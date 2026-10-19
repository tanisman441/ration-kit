// ui-feedback/pull-refresh — dairesel yenile okusu; at anında aşağı çekilip geri sıçrar.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'pull-refresh',
  category: 'ui-feedback',
  desc: 'Yenileme göstergesi: at anında dairesel ok aşağı çekilip yayla geri sıçrar',
  tags: ['yenile', 'yenileme', 'ok', 'çek', 'pull', 'refresh', 'reload', 'sync', 'ui'],
  box: [-80, -90, 80, 90],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0], top: [0, -44] },
  params: {
    at: { type: 'time', default: null, desc: 'çekme anı: aşağı çekilme + geri sıçrama (0.55 sn)' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const R = 40, LW = 13;

    // çekilme: aşağı in, yayla geri (outBack)
    let pullY = 0, lineA = 0;
    if (d >= 0 && d < 0.55) {
      if (d < 0.18) {
        const e = d / 0.18;
        pullY = 36 * e;
        lineA = e;
      } else {
        const e = k.E.outBack((d - 0.18) / 0.37);
        pullY = 36 * (1 - e);
        lineA = Math.max(0, 1 - (d - 0.18) / 0.37);
      }
    }
    // idle: hafif yukarı-aşağı salınım (2.4 sn)
    const bob = 6 * Math.sin((t * k.TAU) / 2.4);

    ctx.save();
    ctx.translate(0, pullY + bob);

    // hareket çizgileri (çekilme sırasında üstte belirir; havada duran ince çizgi → ink)
    if (lineA > 0) {
      ctx.save();
      ctx.globalAlpha = lineA * 0.7;
      ctx.strokeStyle = k.rgba('ink', 0.75);
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) {
        const len = 14 + 8 * (1 - Math.abs(i));
        ctx.beginPath();
        ctx.moveTo(i * 26, -R - 34);
        ctx.lineTo(i * 26, -R - 34 + len);
        ctx.stroke();
      }
      ctx.restore();
    }

    // dairesel ok (tepede 60° boşluk bırakır, ok ucu boşluğun ucunda)
    const a0 = -Math.PI / 2 + 0.55, a1 = -Math.PI / 2 + 0.55 + Math.PI * 1.62;
    ctx.lineCap = 'round';
    ctx.lineWidth = LW;
    // sağ alt gölge
    ctx.strokeStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); ctx.arc(4, 5, R, a0, a1); ctx.stroke();
    // gövde yayı
    ctx.strokeStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 0, R, a0, a1); ctx.stroke();
    // ok ucu (yay sonu noktasında teğete dik üçgen)
    const ex = Math.cos(a1) * R, ey = Math.sin(a1) * R;
    const tx = -Math.sin(a1), ty = Math.cos(a1); // teğet yönü
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(ex + tx * 16, ey + ty * 16);
    ctx.lineTo(ex - ty * 11, ey + tx * 11);
    ctx.lineTo(ex + ty * 11, ey - tx * 11);
    ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};
