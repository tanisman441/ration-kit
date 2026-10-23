// vehicle-arrival/rocket-stage — roket, önden: at anında ateşleme + yükseliş,
// 0.55 sn'de kademe ayrılır (booster geride kalır). Boşta: rampada hafif titreme,
// kule ikaz lambası yanıp söner. (0,0) = rampa tabanı. Contract: engine/kit/ASSETS.md.
export default {
  name: 'rocket-stage', category: 'vehicle-arrival',
  desc: 'Önden roket; at anında ateşlenip yükselir, kademe ayrılır, alev + duman',
  tags: ['roket', 'fırlatma', 'uzay', 'kademe', 'ateşleme', 'rocket', 'launch', 'space', 'liftoff', 'stage'],
  box: [-180, -350, 180, 70],
  bleed: 140,
  anchor: 'fırlatma rampası tabanı (0,0)',
  points: { nose: [0, -322], nozzle: [0, -62], stage: [0, -132] },
  params: {
    at: { type: 'time', default: null, desc: 'fırlatma anı (ateşleme + yükseliş + kademe ayrılma)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const hull = k.rgba(p.color, 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const d = p.at == null ? -1 : t - p.at;
    // ateşleme: d∈[-0.7,0] alev büyür; yükseliş d∈[0,1.4]; kademe d=0.55'te ayrılır
    let rise = 0, flame = 0;
    if (d >= -0.7 && d < 0) {
      flame = k.prog(d, -0.7, 0); // ateşleme öncesi alevlenme
    } else if (d >= 0 && d < 1.4) {
      const g = k.prog(d, 0, 1.4);
      rise = 300 * g * g; // ease-in: giderek hızlanır
      flame = 1;
    } else if (d >= 1.4) {
      rise = 300; flame = 1;
    }
    const sep = d >= 0.55; // kademe ayrıldı mı
    const tremble = (p.at == null || d < 0) ? k.noise1(t * 9) * 1.2 : 0;

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();
    ctx.beginPath(); ctx.rect(-320, -490, 640, 630); ctx.clip(); // box+bleed

    // rampa platformu + servis kulesi (sabit)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-130 - LW / 2, -20 - LW / 2, 260 + LW, 26 + LW, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(-130, -20, 260, 26, 8); ctx.fill();
    // servis kulesi (sol)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-158 - LW / 2, -260 - LW / 2, 34 + LW, 246 + LW, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(-158, -260, 34, 246, 8); ctx.fill();
    // ikaz lambası (idle yanıp söner)
    const blink = 0.4 + 0.6 * Math.abs(Math.sin(t * 3.5));
    ctx.fillStyle = k.rgba('red', blink);
    ctx.beginPath(); ctx.arc(-141, -272, 9, 0, k.TAU); ctx.fill();
    if (blink > 0.7) k.glow(-141, -272, 26, 'red', 0.4);
    // servis kolu: ateşlemede geri çekilir
    let armA = 0;
    if (d >= -0.35 && d < 0.1) armA = k.prog(d, -0.35, 0.1) * 1.1;
    else if (d >= 0.1) armA = 1.1;
    ctx.save();
    ctx.translate(-124, -200); ctx.rotate(armA);
    ctx.strokeStyle = dark; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(80, 0); ctx.stroke();
    ctx.restore();

    // --- roket gövdesi çizim fonksiyonu (yerel) ---
    const upper = (yOff) => {
      ctx.save();
      ctx.translate(tremble, yOff);
      // burun konisi
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.moveTo(-46 - LW / 2, -252); ctx.quadraticCurveTo(-46 - LW / 2, -322, 0, -322 - LW / 2);
      ctx.quadraticCurveTo(46 + LW / 2, -322, 46 + LW / 2, -252);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('accent', 0.95);
      ctx.beginPath();
      ctx.moveTo(-46, -252); ctx.quadraticCurveTo(-46, -322, 0, -322);
      ctx.quadraticCurveTo(46, -322, 46, -252);
      ctx.closePath(); ctx.fill();
      // üst gövde
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-46 - LW / 2, -252 - LW / 2, 92 + LW, 122 + LW, 12); ctx.fill();
      ctx.fillStyle = hull; ctx.beginPath(); k.rrect(-46, -252, 92, 122, 12); ctx.fill();
      ctx.save();
      ctx.beginPath(); k.rrect(-46, -252, 92, 122, 12); ctx.clip();
      ctx.fillStyle = k.rgba('bg', 0.12); ctx.fillRect(-2, -252, 48, 122);
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(-26, -236, 16, 10, -0.4, 0, k.TAU); ctx.fill();
      ctx.restore();
      // pencere
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -210, 16 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.75); ctx.beginPath(); ctx.arc(0, -210, 16, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, -210, 9, -2.4, -0.9); ctx.stroke();
      // kademe çizgisi
      ctx.strokeStyle = k.rgba('ink', 0.45); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-46, -132); ctx.lineTo(46, -132); ctx.stroke();
      ctx.restore();
    };
    const booster = (yOff, tilt, fl) => {
      ctx.save();
      ctx.translate(0, yOff); ctx.rotate(tilt);
      // alt kademe gövdesi
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-46 - LW / 2, -132 - LW / 2, 92 + LW, 72 + LW, 10); ctx.fill();
      ctx.fillStyle = hull; ctx.beginPath(); k.rrect(-46, -132, 92, 72, 10); ctx.fill();
      // kanatçıklar
      for (const s of [-1, 1]) {
        ctx.fillStyle = line;
        ctx.beginPath();
        ctx.moveTo(s * 46, -110); ctx.lineTo(s * (74 + LW / 2), -44); ctx.lineTo(s * 46, -44);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = k.rgba('accent', 0.95);
        ctx.beginPath();
        ctx.moveTo(s * 46, -110); ctx.lineTo(s * 74, -44); ctx.lineTo(s * 46, -44);
        ctx.closePath(); ctx.fill();
      }
      // alev (nozul altında)
      if (fl > 0) {
        const flLen = (60 + k.noise1(t * 18) * 22) * fl;
        const fg = ctx.createLinearGradient(0, -44, 0, -44 + flLen);
        fg.addColorStop(0, k.rgba('yellow', 0.95));
        fg.addColorStop(0.6, k.rgba('accent', 0.85));
        fg.addColorStop(1, k.rgba('red', 0));
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.moveTo(-26, -44);
        ctx.quadraticCurveTo(-34, -44 + flLen * 0.6, -8 - k.noise1(t * 22) * 10, -44 + flLen);
        ctx.quadraticCurveTo(18 + k.noise1(t * 22 + 5) * 10, -44 + flLen * 0.6, 26, -44);
        ctx.closePath(); ctx.fill();
        if (fl > 0.5) k.glow(0, -50, 46, 'yellow', 0.4);
      }
      ctx.restore();
    };

    if (!sep) {
      // ayrılmadan önce: bütün roket birlikte
      booster(rise, 0, flame);
      upper(rise);
    } else {
      // kademe ayrıldı: üst kademe yükselmeye devam, booster geride kalır + yana yatar
      const sg = k.prog(d, 0.55, 1.4);
      const bRise = 300 * Math.pow(k.prog(0.55, 0, 1.4), 2); // ayrılma anındaki yükseklik
      booster(bRise - sg * 90, sg * 0.35, 1 - sg); // booster düşer, alevi söner
      upper(rise);
      // üst kademe motoru: küçük sürekli alev
      const flLen = 44 + k.noise1(t * 18) * 16;
      const fg = ctx.createLinearGradient(0, -130 + rise, 0, -130 + rise + flLen);
      fg.addColorStop(0, k.rgba('yellow', 0.9));
      fg.addColorStop(1, k.rgba('red', 0));
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(-20, -130 + rise);
      ctx.quadraticCurveTo(-24, -130 + rise + flLen * 0.7, 0, -130 + rise + flLen);
      ctx.quadraticCurveTo(24, -130 + rise + flLen * 0.7, 20, -130 + rise);
      ctx.closePath(); ctx.fill();
      // ayrılma kıvılcımları
      if (d < 1.0) {
        const al = 1 - k.prog(d, 0.55, 1.0);
        for (let i = 0; i < 8; i++) {
          const px = (k.hash(i * 7 + 1) - 0.5) * 120;
          const py = -132 + bRise + (k.hash(i * 13 + 2) - 0.5) * 30;
          ctx.fillStyle = k.rgba('yellow', 0.8 * al);
          ctx.beginPath(); ctx.arc(px, py, 4 + k.hash(i * 3) * 4, 0, k.TAU); ctx.fill();
        }
      }
    }

    // ateşleme dumanı: rampadan iki yana yayılır
    if (d >= -0.5 && d < 1.2) {
      const g = k.prog(d, -0.5, 1.2), al = 0.55 * (1 - g * 0.6);
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 19 + 4), h2 = k.hash(i * 23 + 9);
        const sgn = i % 2 ? 1 : -1;
        const px = sgn * (40 + h1 * 60 + g * 170);
        const py = -8 - h2 * 26 - g * 40;
        ctx.fillStyle = k.rgba('dim', al);
        ctx.beginPath(); ctx.arc(px, py, 12 + g * 22, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
