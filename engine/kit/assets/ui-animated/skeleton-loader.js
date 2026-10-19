// ui-animated/skeleton-loader — yükleme iskeleti; parlak bir bant 1.8 sn'lik
// döngüyle soldan sağa kayar (shimmer, canlı idle). `at` ile yumuşak giriş.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'skeleton-loader',
  category: 'ui-animated',
  desc: 'Yükleme iskeleti; üzerinden döngüsel parlama bandı kayar (shimmer)',
  tags: ['skeleton', 'yükleme', 'iskelet', 'shimmer', 'bekleme', 'placeholder', 'loading', 'yükleniyor', 'parlama', 'skeleton loader'],
  box: [-260, -110, 260, 110],
  bleed: 20,
  anchor: 'iskelet merkezi (0,0)',
  points: { avatar: [-200, 0], line1: [40, -52] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'giriş anı: yumuşak belirme' },
    speed: { type: 'number', default: 1.0, desc: 'shimmer hızı çarpanı' },
  },
  draw(ctx, t, p, k) {
    const W = 480, H = 190;
    const d = p.at == null ? 999 : t - p.at;
    if (d < 0) return;
    const alpha = k.clamp(d / 0.4, 0, 1);
    const base = k.rgba(p.color, 0.5);
    ctx.lineCap = 'round';

    // iskelet parçaları: avatar dairesi + başlık + 3 satır
    const parts = [];
    parts.push({ kind: 'arc', x: -190, y: 0, r: 42 });
    const rows = [
      { x: -128, y: -64, w: 250, h: 30 },
      { x: -128, y: -18, w: 330, h: 22 },
      { x: -128, y: 18, w: 290, h: 22 },
      { x: -128, y: 54, w: 250, h: 22 },
    ];
    rows.forEach(r => parts.push({ kind: 'rrect', ...r, rad: 11 }));

    ctx.save();
    ctx.globalAlpha = alpha;

    // taban şekiller
    ctx.fillStyle = base;
    parts.forEach(pt => {
      ctx.beginPath();
      if (pt.kind === 'arc') ctx.arc(pt.x, pt.y, pt.r, 0, k.TAU);
      else k.rrect(pt.x, pt.y, pt.w, pt.h, pt.rad);
      ctx.fill();
    });

    // shimmer: parlak bant soldan sağa süpürür (döngüsel)
    const period = 1.8 / Math.max(0.2, p.speed);
    const ph = ((t % period) + period) % period / period; // 0..1
    const sweepX = -W / 2 - 160 + ph * (W + 320);
    ctx.save();
    ctx.beginPath();
    k.rrect(-W / 2, -H / 2, W, H, 26);
    ctx.clip();
    const g = ctx.createLinearGradient(sweepX - 110, 0, sweepX + 110, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.38)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(sweepX - 110, -H / 2, 220, H);
    ctx.restore();

    ctx.restore();
  },
};
