// ui-feedback/loading-dots — üç nokta sırayla zıplar (sürekli döngü, canlı idle).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'loading-dots',
  category: 'ui-feedback',
  desc: 'Üç nokta sırayla zıplayan sürekli yükleme göstergesi',
  tags: ['yükleniyor', 'yükleme', 'nokta', 'bekleme', 'loading', 'dots', 'spinner', 'waiting', 'ui'],
  box: [-90, -40, 90, 40],
  bleed: 24,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const R = 12, GAP = 40, H = 18;
    ctx.save();

    for (let i = 0; i < 3; i++) {
      // zıplama: 1.3 rad faz farkıyla sırayla
      const s = Math.max(0, Math.sin(t * 4.4 - i * 1.3));
      const y = -H * Math.pow(s, 1.4);
      const scale = 1 + 0.25 * s;
      const x = (i - 1) * GAP;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      // sağ alt gölge (6 birim offset)
      ctx.fillStyle = k.rgba('bg', 0.5);
      ctx.beginPath(); ctx.arc(2, 3, R, 0, k.TAU); ctx.fill();
      // nokta
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
      // sol üst parlama (premium, alfa 0.11)
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.arc(-R * 0.35, -R * 0.4, R * 0.55, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  },
};
