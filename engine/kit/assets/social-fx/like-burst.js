// social-fx/like-burst — beğeni patlaması: at anında kalp büyür, mini kalpler fırlatır.
// Boşta kalp hafifçe nabız gibi atar.
export default {
  name: 'like-burst', category: 'social-fx',
  desc: 'Big heart that pops on the tap moment and bursts mini hearts outward',
  tags: ['beğeni', 'like', 'kalp', 'heart', 'patlama', 'burst', 'beğenme', 'sevme', 'love'],
  box: [-120, -110, 120, 110],
  bleed: 120,
  anchor: 'kalbin merkezi',
  points: { heart: [0, 0], top: [0, -95] },
  params: {
    at: { type: 'time', default: null, desc: 'beğenme anı: kalp büyür + mini kalpler fırlar (0.9 sn)' },
    color: { type: 'color', default: 'red' },
    parts: { type: 'number', default: 6, desc: 'fırlayan mini kalp sayısı (3-8)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const heart = (x, y, s) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.95);
      ctx.bezierCurveTo(x - s * 1.25, y + s * 0.12, x - s * 0.72, y - s * 0.85, x, y - s * 0.18);
      ctx.bezierCurveTo(x + s * 0.72, y - s * 0.85, x + s * 1.25, y + s * 0.12, x, y + s * 0.95);
      ctx.closePath();
    };
    const n = Math.max(3, Math.min(8, Math.round(p.parts)));

    // 1) fırlayan mini kalpler + şok halkası (0.9 sn)
    if (d >= 0 && d <= 0.9) {
      const g = k.prog(d, 0, 0.9);
      const ringR = 70 + 85 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(col, 0.65 * (1 - g));
      ctx.lineWidth = 7 * (1 - g) + 2;
      ctx.beginPath(); ctx.arc(0, 0, ringR, 0, k.TAU); ctx.stroke();
      for (let i = 0; i < n; i++) {
        const a = (i / n) * k.TAU + k.hash(i) * 0.6;
        const dist = 75 + (95 + k.hash(i + 40) * 45) * k.E.outExpo(g);
        const hx = Math.cos(a) * dist, hy = Math.sin(a) * dist - 15;
        const hs = 20 * (1 - g * 0.55);
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        heart(hx + 6, hy + 6, hs); ctx.fill();
        ctx.fillStyle = k.rgba(col, 1 - g * 0.85);
        heart(hx, hy, hs); ctx.fill();
      }
    }

    // 2) ana kalp — idle nabız + at anında büyüme
    let s = 62 * (1 + 0.03 * Math.sin(t * 2.6));
    if (d >= 0 && d <= 0.9) {
      const g = k.prog(d, 0, 0.9);
      const pop = Math.min(1, d / 0.22);
      s *= 1 + 0.5 * Math.sin(Math.PI * pop) * (1 - g * 0.4);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    heart(6, 6, s); ctx.fill();
    ctx.fillStyle = k.rgba(col, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    heart(0, 0, s); ctx.fill(); ctx.stroke();
    // sol üst parlama (sol lobun üstünde)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-s * 0.3, -s * 0.26, s * 0.2, s * 0.11, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
