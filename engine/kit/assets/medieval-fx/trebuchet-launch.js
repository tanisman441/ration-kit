// medieval-fx/trebuchet-launch — mancınık: at anında kol savrulur, taş balistik uçar.
// Boşta karşı ağırlık hafifçe sallanır, üstteki flama dalgalanır;
// olayda (2.4 sn) kol 0.7 sn'de savrulur, taş ayrılıp yay çizerek uçar, toz çıkarır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = zemin, pivot (0,-115).
export default {
  name: 'trebuchet-launch', category: 'medieval-fx',
  desc: 'Mancınık; at anında kol savrulur, taş balistik bir yay çizerek uçar',
  tags: ['mancınık', 'trebuchet', 'taş', 'fırlatma', 'kuşatma', 'ortaçağ', 'siege', 'catapult', 'medieval', 'war'],
  box: [-180, -250, 300, 15],
  bleed: 90,
  anchor: 'zemin (0,0); pivot (0,-115)',
  points: { pivot: [0, -115], counterweight: [-31, -168], release: [90, -235] },
  params: {
    at: { type: 'time', default: null, desc: 'fırlatma anı (2.4 sn: kol savrulması + taş uçuşu + iniş)' },
    power: { type: 'number', default: 1, desc: 'fırlatma gücü (0.6–1.4)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const wood = k.rgba('dim', 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const pw = Math.max(0.6, Math.min(1.4, p.power));
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d < 2.4;
    const PX = 0, PY = -115; // pivot
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    ctx.beginPath(); ctx.rect(-270, -320, 660, 370); ctx.clip();

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(10, -3, 150, 10, 0, 0, k.TAU); ctx.fill();

    // iskelet: taban kirişi + A çerçeve (ahşap, premium finish)
    const beam = (x1, y1, x2, y2, w) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = wood; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    beam(-130, -8, 130, -8, 18);                 // taban
    beam(-110, -10, -14, -108, 15);              // sol A bacağı
    beam(110, -10, 14, -108, 15);                // sağ A bacağı
    beam(-96, -52, 96, -52, 12);                 // çapraz kiriş
    // tekerlekler
    for (const wx of [-95, 95]) {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(wx, -14, 20 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = wood; ctx.beginPath(); ctx.arc(wx, -14, 20, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(wx, -14, 7, 0, k.TAU); ctx.fill();
    }
    // üst flama: idle'da dalgalanır
    const fw = k.noise1(t * 4.6) * 6;
    beam(0, -108, 0, -190, 6);
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath();
    ctx.moveTo(0, -190);
    ctx.quadraticCurveTo(26, -184 + fw * 0.5, 46, -178 + fw);
    ctx.quadraticCurveTo(26, -172 + fw * 0.3, 0, -168);
    ctx.closePath(); ctx.fill();

    // kol açısı: kurulu -1.05 rad → ateş sonrası +0.95 rad (0.7 sn'de, outExpo)
    let ang = -1.05;
    if (firing) ang = -1.05 + 2.0 * k.E.outExpo(k.prog(d, 0, 0.7));
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const tipX = PX + ca * 150, tipY = PY - sa * 150;   // uzun uç (taş tarafı)
    const cwX = PX - ca * 62, cwY = PY + sa * 62;       // kısa uç (ağırlık)
    // kol
    beam(PX, PY, tipX, tipY, 11);
    beam(PX, PY, cwX, cwY, 11);
    // pivot göbeği
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(PX, PY, 13 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(PX, PY, 13, 0, k.TAU); ctx.fill();

    // karşı ağırlık kutusu: boşta hafif sallanır (idle)
    const sway = firing ? 0 : k.noise1(t * 1.1) * 0.04;
    ctx.save(); ctx.translate(cwX, cwY); ctx.rotate(sway);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-34 - LW / 2, -6, 68 + LW, 58 + LW / 2, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.8); ctx.beginPath(); k.rrect(-34, -6, 68, 58, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, 6, 16, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // taş: kurulu halde askıda, savrulma sonunda ayrılır
    const stoneR = 17 * (0.8 + pw * 0.2);
    const rel = 0.62; // ayrılma anı
    if (!firing || d < rel) {
      // askı ipi (ink, serbest çizgi) + taş
      const hang = firing ? 1 - k.prog(d, 0, rel) * 0.4 : 1;
      const sx = tipX - ca * 26 * hang, sy = tipY + sa * 26 * hang + 18 * hang;
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(sx, sy - stoneR); ctx.stroke();
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(sx, sy, stoneR + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = wood; ctx.beginPath(); ctx.arc(sx, sy, stoneR, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(sx - stoneR * 0.35, sy - stoneR * 0.35, stoneR * 0.45, stoneR * 0.3, -0.5, 0, k.TAU); ctx.fill();
    } else {
      // balistik uçuş: ayrılma noktasından hız vektörüyle (menzil box içinde kalır)
      const fd = d - rel;
      const v0 = 200 * pw;
      const va = -0.9; // yukarı-sağ
      const vx = Math.cos(va) * v0, vy0 = Math.sin(va) * v0;
      const rlx = tipX, rly = tipY;
      const sx = rlx + vx * fd;
      const sy = rly + vy0 * fd + 0.5 * 620 * fd * fd;
      const landed = sy >= -10;
      const fx2 = landed ? rlx + vx * (( -vy0 + Math.sqrt(vy0 * vy0 + 2 * 620 * (rly + 10))) / 620) : sx;
      const fy2 = landed ? -10 : sy;
      // iz (trail)
      for (let i = 1; i <= 8; i++) {
        const bt = fd - i * 0.045;
        if (bt < 0) continue;
        const bx = rlx + vx * bt, by = rly + vy0 * bt + 0.5 * 620 * bt * bt;
        if (by > -6) continue;
        ctx.fillStyle = k.rgba('dim', 0.35 * (1 - i / 9));
        ctx.beginPath(); ctx.arc(bx, by, stoneR * (1 - i / 12), 0, k.TAU); ctx.fill();
      }
      if (!landed || fd < 1.1) {
        ctx.save(); ctx.translate(fx2, fy2); ctx.rotate(fd * 9);
        ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, stoneR + LW / 2, 0, k.TAU); ctx.fill();
        ctx.fillStyle = wood; ctx.beginPath(); ctx.arc(0, 0, stoneR, 0, k.TAU); ctx.fill();
        ctx.restore();
      }
      // iniş tozu: 0.5 sn
      if (landed) {
        const g = k.prog(Math.max(0, fd - 0.02), 0, 0.5);
        if (g < 1) {
          for (let i = 0; i < 6; i++) {
            const px = fx2 + (k.hash(i * 7 + 11) - 0.5) * (20 + g * 90);
            ctx.fillStyle = k.rgba('dim', 0.55 * (1 - g));
            ctx.beginPath(); ctx.arc(px, -8 - g * 22, 6 + g * 10, 0, k.TAU); ctx.fill();
          }
        }
      }
    }
    // ateş anı tozu (pivot çevresi, ilk 0.3 sn)
    if (firing && d < 0.3) {
      const g = k.prog(d, 0, 0.3);
      ctx.fillStyle = k.rgba('dim', 0.4 * (1 - g));
      ctx.beginPath(); ctx.arc(PX - 20 * g, -20, 10 + g * 26, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(PX + 26 * g, -14, 8 + g * 20, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
