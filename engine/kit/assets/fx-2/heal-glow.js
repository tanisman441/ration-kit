// fx-2/heal-glow — iyileşme parlaması: at anında yükselen yeşil partiküller + genişleyen halkalar.
// Idle'da nefes alan şifa alanı ve süzülen artı işaretleri.
// NOT: canvas y-aşağıdır; (0,0) iyileşen noktanın tabanı.
export default {
  name: 'heal-glow', category: 'fx-2',
  desc: 'İyileşme parlaması: at anında yükselen artı-şekilli partiküller ve genişleyen şifa halkaları',
  tags: ['iyileşme', 'şifa', 'heal', 'healing', 'glow', 'parlama', 'can', 'rejenerasyon', 'canlanma', 'yeşil ışık'],
  box: [-110, -150, 110, 40],
  bleed: 45,
  anchor: 'taban (0,0) — iyileşen noktanın zemin karşılığı',
  points: { top: [0, -145], base: [0, 0] },
  params: {
    color: { type: 'color', default: 'green', desc: 'şifa enerjisinin rengi' },
    at: { type: 'time', default: null, desc: 'iyileşme anı (partiküller + halkalar)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    const plus = (x, y, s, a) => {
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
      ctx.fillRect(x - s, y - s * 0.32, s * 2, s * 0.64);
      ctx.fillRect(x - s * 0.32, y - s, s * 0.64, s * 2);
    };

    // ---- olay: 0 → 1.1 sn arası şifa dalgası ----
    if (d >= 0 && d < 1.1) {
      const g = k.prog(d, 0, 1.1);
      const al = 1 - g;

      // yumuşak yükselen ışık sütunu
      k.glow(0, -66, 92 * (1 - g * 0.3), p.color, 0.55 * al);
      ctx.fillStyle = k.rgba(p.color, 0.38 * al);
      ctx.beginPath(); ctx.ellipse(0, -64, 52 * (1 - g * 0.35), 72, 0, 0, k.TAU); ctx.fill();

      // yükselen partiküller (daire + artı işaretleri)
      for (let i = 0; i < 30; i++) {
        const h1 = k.hash(i * 9 + 17), h2 = k.hash(i * 23 + 41), h3 = k.hash(i * 31 + 83);
        const py = -(8 + h1 * 110) - d * 190 * (0.55 + h2 * 0.9);
        if (py > 18 || py < -165) continue;
        const px = (h1 - 0.5) * 100 + k.noise1(i * 2.7 + d * 5) * 12;
        const pa = 0.85 * al * (1 - k.prog(-py, 105, 160));
        if (h3 > 0.55) plus(px, py, 5 + h2 * 5, Math.max(pa, 0));
        else {
          ctx.fillStyle = k.rgba(p.color, Math.max(pa, 0));
          ctx.beginPath(); ctx.arc(px, py, 2.5 + h2 * 4.5, 0, k.TAU); ctx.fill();
        }
      }

      // genişleyen halkalar (2 kademe)
      for (let r = 0; r < 2; r++) {
        const dd = d - r * 0.16;
        if (dd < 0) continue;
        const gg = k.prog(dd, 0, 0.7);
        const rx = 24 + 96 * k.E.outExpo(gg);
        ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - gg));
        ctx.lineWidth = 7 * (1 - gg) + 2;
        ctx.beginPath(); ctx.ellipse(0, -4, rx, rx * 0.3, 0, 0, k.TAU); ctx.stroke();
      }
    }

    // ---- idle: nefes alan şifa alanı + süzülen artılar ----
    if (d < 0) {
      const br = 0.5 + 0.5 * Math.sin(t * 2.1);
      k.glow(0, -30, 60 + 14 * br, p.color, 0.3 + 0.14 * br);
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 13 + 7), h2 = k.hash(i * 29 + 19);
        const cyc = (t * 0.35 + h1) % 1;
        const py = -4 - cyc * 84;
        const px = (h2 - 0.5) * 74 + k.noise1(i * 4 + t) * 6;
        plus(px, py, 3.5 + h2 * 3.5, 0.5 * (1 - cyc));
      }
    }
    ctx.restore();
  },
};
