// combat-hits-2/counter-flash — karşı saldırı flaşı: anlık merkez patlaması ve X şeklinde dört ışık kolu.
// NOT: canvas y-aşağıdır; (0,0) patlamanın merkezi.
export default {
  name: 'counter-flash', category: 'combat-hits-2',
  desc: 'Karşı saldırı flaşı: merkezde kısa patlama ve X şeklinde dışa vuran dört ışık kolu',
  tags: ['karşı', 'saldırı', 'flaş', 'çapraz', 'patlama', 'ışık', 'counter', 'flash', 'strike', 'burst', 'cross', 'x'],
  box: [-110, -110, 110, 110],
  bleed: 50,
  anchor: 'patlamanın merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'karşı saldırı anı (flaş + X kolları, ~0.5 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d <= 0.9;

    // idle: merkezde hafif nabızlı nişan noktası
    const idlePulse = 0.18 + 0.1 * (0.5 + 0.5 * k.noise1(t * 1.6));
    ctx.save();
    ctx.strokeStyle = k.rgba(p.color, idlePulse);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 12 + 2 * (0.5 + 0.5 * k.noise1(t * 1.6)), 0, k.TAU); ctx.stroke();

    if (active) {
      // 1) merkez flaşı — çok kısa (0.15 sn)
      if (d < 0.15) {
        const f = 1 - d / 0.15;
        k.glow(0, 0, 95 * f, p.color, 0.5 * f);
        ctx.fillStyle = k.rgba(p.color, 0.95 * f);
        ctx.beginPath(); ctx.arc(0, 0, 16 * f + 5, 0, k.TAU); ctx.fill();
      }
      // 2) X kolları — dört çapraz ışık kolu, hızla açılıp söner
      const eg = k.prog(d, 0, 0.14);                       // açılma
      const fg = k.prog(d, 0.1, 0.55);                     // sönme
      const len = 22 + 128 * k.E.outCubic(eg);
      const baseW = 15 * (1 - eg * 0.5);
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + i * Math.PI / 2;           // çapraz kollar
        const dx = Math.cos(a), dy = Math.sin(a);
        const px = -dy, py = dx;                           // dik vektör
        ctx.fillStyle = k.rgba(p.color, 0.85 * (1 - fg));
        ctx.beginPath();
        ctx.moveTo(px * baseW, py * baseW);
        ctx.lineTo(dx * len, dy * len);
        ctx.lineTo(-px * baseW, -py * baseW);
        ctx.closePath();
        ctx.fill();
      }
      // 3) ikinci halka — patlamayı çerçeveler (0.35 sn)
      if (d > 0.03) {
        const g = k.prog(d - 0.03, 0, 0.32);
        ctx.strokeStyle = k.rgba(p.color, 0.5 * (1 - g));
        ctx.lineWidth = 5 * (1 - g * 0.6) + 1;
        ctx.beginPath(); ctx.arc(0, 0, 20 + 62 * k.E.outExpo(g), 0, k.TAU); ctx.stroke();
      }
      // 4) geç kıvılcım — sönümlenen ufak çizgiler
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 11 + 3), h2 = k.hash(i * 17 + 29);
        const life = 0.3 + h2 * 0.25;
        if (d > life) continue;
        const lg = k.prog(d, 0, life);
        const a = h1 * k.TAU;
        const dist = (30 + h2 * 70) * k.E.outCubic(lg);
        const sx = Math.cos(a) * dist, sy = Math.sin(a) * dist;
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - lg));
        ctx.lineWidth = 2.5 * (1 - lg) + 0.8;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx * 0.88, sy * 0.88); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
