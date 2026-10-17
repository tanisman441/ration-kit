// ui/cursor-click — fare imleci; `at` anında tıklama dalgası yayar.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'cursor-click',
  category: 'ui',
  desc: 'Fare imleci; at anında uçtan tıklama dalgası yayar',
  tags: ['imleç', 'fare', 'tık', 'tıklama', 'işaret', 'cursor', 'click', 'mouse', 'pointer', 'tap'],
  box: [-70, -70, 110, 110],
  bleed: 50,
  anchor: 'imleç ucu (0,0)',
  points: { tip: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'tıklama anı: dalga yayılır' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const line = k.rgba('bg', 0.7), inkC = k.rgba('ink');
    ctx.lineJoin = 'round';

    ctx.save();

    // tıklama dalgası (uçtan genişler, 0.45 sn)
    if (d >= 0 && d < 0.5) {
      const e = k.E.outCubic(d / 0.5);
      const r = 12 + e * 52;
      ctx.globalAlpha = 1 - e;
      k.glow(0, 0, r + 10, p.color, 0.35 * (1 - e));
      ctx.strokeStyle = k.rgba(p.color);
      ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // imleç oku (klasik): beyaz gövde, koyu dış hat
    const path = [[0, 0], [0, 52], [13, 40], [19, 55], [25, 52], [19, 37], [32, 37]];
    ctx.beginPath();
    path.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = line;
    ctx.save();
    ctx.translate(2.5, 2.5);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = inkC;
    ctx.fill();
    // üst parlama (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(4, 6); ctx.lineTo(4, 34); ctx.lineTo(10, 29); ctx.lineTo(10, 8);
    ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};
