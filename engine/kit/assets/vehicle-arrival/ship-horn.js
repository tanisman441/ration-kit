// vehicle-arrival/ship-horn — gemi, yandan: at anında korna çalar,
// ses dalgaları yayılır + su halkaları açılır. Boşta: dalgada hafif yalpa,
// bacadan duman yükselir. (0,0) = su hattı. Contract: engine/kit/ASSETS.md.
export default {
  name: 'ship-horn', category: 'vehicle-arrival',
  desc: 'Yandan yolcu gemisi; at anında korna çalar, ses dalgaları + su halkaları yayılır',
  tags: ['gemi', 'korna', 'liman', 'deniz', 'vapur', 'ulaşım', 'ship', 'horn', 'harbor', 'sea', 'boat'],
  box: [-260, -180, 260, 70],
  bleed: 110,
  anchor: 'su hattı (0,0)',
  points: { horn: [10, -176], bridge: [-30, -108], bow: [205, -48] },
  params: {
    at: { type: 'time', default: null, desc: 'korna anı (1.2 sn ses dalgaları + su halkaları)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const hullC = k.rgba(p.color, 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const d = p.at == null ? -1 : t - p.at;
    const bobY = Math.sin(t * 0.9) * 4;
    const roll = Math.sin(t * 0.7) * 0.02;

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();
    ctx.beginPath(); ctx.rect(-370, -290, 740, 430); ctx.clip(); // box+bleed

    // su: iki dalga katmanı (idle)
    for (let layer = 0; layer < 2; layer++) {
      ctx.strokeStyle = k.rgba('cyan', layer ? 0.35 : 0.55); ctx.lineWidth = layer ? 3 : 5;
      ctx.beginPath();
      for (let x = -370; x <= 370; x += 20) {
        const wy = 14 + layer * 12 + k.noise1(t * 1.4 + x * 0.02 + layer * 9) * 6;
        if (x === -370) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(0, bobY);
    ctx.rotate(roll);

    // gövde (trapez, pruva sağda)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-200 - LW / 2, -64 - LW / 2); ctx.lineTo(190 - LW / 2, -64 - LW / 2);
    ctx.lineTo(214 + LW / 2, -6 + LW / 2); ctx.lineTo(-186 + LW / 2, -6 + LW / 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = hullC;
    ctx.beginPath();
    ctx.moveTo(-200, -64); ctx.lineTo(190, -64); ctx.lineTo(214, -6); ctx.lineTo(-186, -6);
    ctx.closePath(); ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-200, -64); ctx.lineTo(190, -64); ctx.lineTo(214, -6); ctx.lineTo(-186, -6);
    ctx.closePath(); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12); ctx.fillRect(60, -64, 154, 58);
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-140, -52, 44, 10, -0.3, 0, k.TAU); ctx.fill();
    ctx.restore();
    // su kesimi şeridi (tek vurgu: accent)
    ctx.fillStyle = k.rgba('accent', 0.95);
    ctx.beginPath();
    ctx.moveTo(-196, -26); ctx.lineTo(208, -26); ctx.lineTo(214, -6); ctx.lineTo(-186, -6);
    ctx.closePath(); ctx.fill();
    // lumbuzlar
    ctx.fillStyle = k.rgba('panel', 1);
    for (let i = 0; i < 7; i++) {
      ctx.beginPath(); ctx.arc(-160 + i * 48, -46, 7, 0, k.TAU); ctx.fill();
    }

    // güverte binası + köprü
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-96 - LW / 2, -136 - LW / 2, 152 + LW, 74 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel', 1); ctx.beginPath(); k.rrect(-96, -136, 152, 74, 10); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-76 - LW / 2, -172 - LW / 2, 92 + LW, 40 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel', 1); ctx.beginPath(); k.rrect(-76, -172, 92, 40, 10); ctx.fill();
    // köprü camları
    ctx.fillStyle = k.rgba('ink', 0.72);
    ctx.beginPath(); k.rrect(-70, -166, 80, 26, 8); ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = k.rgba('bg', 0.5);
      ctx.fillRect(-46 + i * 26, -166, 5, 26);
    }
    // alt kat camları
    ctx.fillStyle = k.rgba('ink', 0.6);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); k.rrect(-88 + i * 30, -128, 22, 20, 6); ctx.fill();
    }
    // baca (kırmızı bant vurgu yerine gövde rengi + bant)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-6 - LW / 2, -196 - LW / 2, 44 + LW, 64 + LW, 8); ctx.fill();
    ctx.fillStyle = hullC; ctx.beginPath(); k.rrect(-6, -196, 44, 64, 8); ctx.fill();
    ctx.fillStyle = k.rgba('accent', 0.95);
    ctx.beginPath(); k.rrect(-6, -186, 44, 14, 6); ctx.fill();
    // korna (baca üstünde küçük borazan)
    ctx.fillStyle = dark;
    ctx.beginPath(); k.rrect(4, -214, 10, 20, 4); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, -214); ctx.lineTo(34, -206); ctx.lineTo(34, -198); ctx.lineTo(14, -206);
    ctx.closePath(); ctx.fill();
    // direk + bayrak (idle dalgalanır)
    ctx.strokeStyle = dark; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(120, -64); ctx.lineTo(120, -150); ctx.stroke();
    const fw = k.noise1(t * 4.5) * 8;
    ctx.fillStyle = k.rgba('accent', 0.95);
    ctx.beginPath();
    ctx.moveTo(120, -150);
    ctx.quadraticCurveTo(146, -144 + fw * 0.5, 168, -138 + fw);
    ctx.quadraticCurveTo(146, -132 + fw * 0.4, 120, -126);
    ctx.closePath(); ctx.fill();
    ctx.restore(); // gemi

    // baca dumanı (idle, döngülü yükselme)
    for (let i = 0; i < 4; i++) {
      const g = ((t * 0.45) + i / 4) % 1;
      const px = 16 + k.noise1(t * 2 + i * 3) * 10 + g * 26;
      const py = -200 - g * 70 + bobY;
      ctx.fillStyle = k.rgba('dim', 0.35 * (1 - g));
      ctx.beginPath(); ctx.arc(px, py, 8 + g * 14, 0, k.TAU); ctx.fill();
    }

    // korna ses dalgaları: kornadan yayılan 4 halka (1.2 sn)
    if (d >= 0 && d < 1.2) {
      for (let i = 0; i < 4; i++) {
        const dd = d - i * 0.16;
        if (dd < 0) continue;
        const g = k.prog(dd, 0, 0.7), al = (1 - g) * 0.75;
        const r = 24 + g * 200;
        ctx.strokeStyle = k.rgba('yellow', al); ctx.lineWidth = 7 * (1 - g) + 2;
        ctx.beginPath(); ctx.arc(24, -208 + bobY, r, -1.1, 1.1); ctx.stroke();
      }
      // korna flaşı
      const fl = d < 0.25 ? 1 - d / 0.25 : 0;
      if (fl > 0) k.glow(24, -206 + bobY, 40, 'yellow', 0.5 * fl);
    }
    // su halkaları: gövdeden açılan elipsler (0.15–1.5 sn)
    if (d >= 0.15 && d < 1.5) {
      for (let i = 0; i < 3; i++) {
        const dd = d - 0.15 - i * 0.3;
        if (dd < 0) continue;
        const g = k.prog(dd, 0, 0.9), al = (1 - g) * 0.6;
        ctx.strokeStyle = k.rgba('cyan', al); ctx.lineWidth = 5 * (1 - g) + 2;
        ctx.beginPath(); ctx.ellipse(10, 16, 120 + g * 190, 10 + g * 26, 0, 0, k.TAU); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
