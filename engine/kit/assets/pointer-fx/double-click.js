// pointer-fx/double-click — imleç oku; at anında çift tık: 0.18 sn arayla iki dalga.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'double-click',
  category: 'pointer-fx',
  desc: 'Çift tıklama: 0.18 sn arayla art arda iki halka dalgası yayılır',
  tags: ['çift', 'tık', 'tıklama', 'imleç', 'dalga', 'fare', 'double', 'click', 'cursor', 'pointer'],
  box: [-130, -130, 130, 130],
  bleed: 70,
  anchor: 'imleç ucu (0,0)',
  points: { tip: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'ilk tık anı: iki dalga 0.18 sn arayla yayılır (toplam ~0.75 sn)' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const idle = Math.sin((t * k.TAU) / 2.4) * 1.5;

    // her tıklamada ok hafif çöker (0.12 sn)
    let squash = 1;
    for (let i = 0; i < 2; i++) {
      const dd = d - i * 0.18;
      if (dd >= 0 && dd < 0.12) squash = Math.min(squash, 1 - 0.2 * (dd / 0.12));
    }

    ctx.save();
    ctx.lineJoin = 'round';

    // iki kademeli dalga
    for (let i = 0; i < 2; i++) {
      const dd = d - i * 0.18;
      if (dd < 0 || dd > 0.55) continue;
      const e = k.E.outExpo(dd / 0.55);
      const r = 12 + e * 88;
      k.glow(0, 0, r + 12, i === 0 ? p.color : 'yellow', 0.35 * (1 - e));
      ctx.strokeStyle = k.rgba(i === 0 ? p.color : 'yellow', 0.9 * (1 - e));
      ctx.lineWidth = 7 * (1 - e) + 1.5;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
    }
    // merkez flaşları (her tıkta 0.12 sn)
    for (let i = 0; i < 2; i++) {
      const dd = d - i * 0.18;
      if (dd >= 0 && dd < 0.12) {
        k.glow(0, 0, 36 * (1 - dd / 0.12), 'yellow', 0.5 * (1 - dd / 0.12));
      }
    }

    // imleç oku
    ctx.save();
    ctx.translate(0, idle);
    ctx.scale(1, squash);
    const path = [[0, 0], [0, 52], [13, 40], [19, 55], [25, 52], [19, 37], [32, 37]];
    ctx.beginPath();
    path.forEach(([x, y], idx) => (idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.save(); ctx.translate(2.5, 2.5); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('ink');
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(4, 6); ctx.lineTo(4, 34); ctx.lineTo(10, 29); ctx.lineTo(10, 8);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
