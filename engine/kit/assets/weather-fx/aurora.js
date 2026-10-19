// weather-fx/aurora — kutup ışıkları: dalga gibi akan ışık perdeleri; perdeler
// döngüsel olarak salınır ve akar, içlerindeki ışınlar titrer. Saf canlı idle.
// NOT: canvas y-aşağıdır; perdeler yukarıdan (−y) aşağıya (+y) sarkar.
export default {
  name: 'aurora', category: 'weather-fx',
  desc: 'Kutup ışıkları; dalga gibi akan ışık perdeleri, titreyen iç ışınlar',
  tags: ['kutup ışıkları', 'aurora', 'gece', 'gökyüzü', 'ışık', 'aurora', 'northern lights', 'sky', 'night', 'polar'],
  box: [-170, -150, 170, 130],
  bleed: 20,
  anchor: 'perdelerin üst kenarı y≈-130; merkez (0,0)',
  points: { top: [0, -140] },
  params: {
    color: { type: 'color', default: 'green' },
    fringe: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const X0 = -150, X1 = 150;

    // perdeler: ana renk (0,2) + ince fringe (1)
    const curtains = [
      { col: p.color, len: 150, wob: 1.0, phase: 0 },
      { col: p.fringe, len: 190, wob: 0.45, phase: 2.2 },
      { col: p.color, len: 130, wob: 0.8, phase: 4.1 },
    ];

    curtains.forEach((C, ci) => {
      const swayX = Math.sin(t * 0.4 + C.phase) * 10; // perdenin yatay salınımı
      const shimmer = 0.5 + 0.12 * k.noise1(t * 1.5 + ci * 7.7); // ışık titremesi
      const topY = x => -130 + 20 * Math.sin(x * 0.02 + t * 1.1 * C.wob + C.phase) + 9 * Math.sin(x * 0.05 - t * 0.7 + C.phase);
      const botY = x => topY(x) + C.len + 14 * Math.sin(x * 0.03 + t * 0.9 * C.wob + ci);

      // perde gövdesi: yukarıdan aşağıya sönen dikey gradyan
      const g = ctx.createLinearGradient(0, -150, 0, 80);
      g.addColorStop(0, k.rgba(C.col, shimmer));
      g.addColorStop(1, k.rgba(C.col, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(X0 + swayX, topY(X0));
      for (let x = X0 + 12; x <= X1; x += 12) ctx.lineTo(x + swayX, topY(x));
      for (let x = X1; x >= X0; x -= 12) ctx.lineTo(x + swayX, botY(x));
      ctx.closePath(); ctx.fill();

      // iç ışınlar: perdenin dalgasını takip eden titreyen dikey çizgiler
      ctx.lineWidth = 3;
      for (let r = 0; r < 8; r++) {
        const rx = X0 + 20 + k.hash(r * 5.3 + ci * 13.1) * (X1 - X0 - 40);
        const ra = 0.22 + 0.2 * Math.sin(t * 3 + rx * 0.1 + ci * 2);
        if (ra <= 0.03) continue;
        ctx.strokeStyle = k.rgba(C.col, ra);
        ctx.beginPath();
        ctx.moveTo(rx + swayX, topY(rx) + 4);
        ctx.lineTo(rx + swayX + 6 * Math.sin(t * 1.3 + r), botY(rx) - 6);
        ctx.stroke();
      }

      // üst kenar vurgusu: perdenin en parlak çizgisi
      ctx.strokeStyle = k.rgba(C.col, 0.55 * shimmer + 0.15);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(X0 + swayX, topY(X0));
      for (let x = X0 + 12; x <= X1; x += 12) ctx.lineTo(x + swayX, topY(x));
      ctx.stroke();
    });
  },
};
