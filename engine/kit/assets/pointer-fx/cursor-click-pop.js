// pointer-fx/cursor-click-pop — imleç oku; click anında halka patlar, ok hafif çöker.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'cursor-click-pop',
  category: 'pointer-fx',
  desc: 'Fare imleci; click anında uçtan patlayan halka ve okta hafif çökme',
  tags: ['imleç', 'tıklama', 'tık', 'fare', 'halka', 'patlama', 'cursor', 'click', 'pointer', 'mouse'],
  box: [-110, -110, 110, 110],
  bleed: 60,
  anchor: 'imleç ucu (0,0)',
  points: { tip: [0, 0] },
  params: {
    click: { type: 'time', default: null, desc: 'tıklama anı: halka patlar, ok 0.35 sn çöküp döner' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.click == null ? -1 : t - p.click;
    const idle = Math.sin((t * k.TAU) / 2.4) * 1.5; // hafif yüzen idle

    // ok çökmesi: 0.1 sn çök, 0.25 sn yay geri dönüş
    let squash = 1;
    if (d >= 0 && d < 0.35) {
      squash = d < 0.1 ? 1 - 0.22 * (d / 0.1) : 1 - 0.22 * (1 - k.E.outBack((d - 0.1) / 0.25));
    }

    ctx.save();
    ctx.lineJoin = 'round';

    // patlama halkası + parçacıklar (0.55 sn)
    if (d >= 0 && d < 0.55) {
      const e = k.E.outExpo(d / 0.55);
      const r = 10 + e * 78;
      k.glow(0, 0, r + 14, p.color, 0.4 * (1 - e));
      ctx.strokeStyle = k.rgba(p.color, 0.9 * (1 - e));
      ctx.lineWidth = 8 * (1 - e) + 1.5;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
      // 8 parça, hash tabanlı yönler
      for (let i = 0; i < 8; i++) {
        const a = k.hash(i * 7 + 3) * k.TAU;
        const rr = 14 + e * (46 + k.hash(i) * 40);
        const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
        ctx.fillStyle = k.rgba(i % 3 === 0 ? 'yellow' : p.color, 0.85 * (1 - e));
        ctx.beginPath(); ctx.arc(px, py, 5.5 * (1 - e) + 1, 0, k.TAU); ctx.fill();
      }
      // merkez flaşı
      if (d < 0.14) k.glow(0, 0, 40 * (1 - d / 0.14), 'yellow', 0.5 * (1 - d / 0.14));
    }

    // imleç oku (klasik), çökme ölçeği uygulanır
    ctx.save();
    ctx.translate(0, idle);
    ctx.scale(1 + (1 - squash) * 0.5, squash);
    const path = [[0, 0], [0, 52], [13, 40], [19, 55], [25, 52], [19, 37], [32, 37]];
    ctx.beginPath();
    path.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = k.rgba('bg', 0.7); // dış hat gölgesi
    ctx.save(); ctx.translate(2.5, 2.5); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('ink');
    ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(4, 6); ctx.lineTo(4, 34); ctx.lineTo(10, 29); ctx.lineTo(10, 8);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
