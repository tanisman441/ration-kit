// particle-fx/ember-drift — sürüklenen kor parçaları: tabandan yukarı-doğru
// sürüklenen, noise ile titreyen kor zerreleri + ara sıra parlayan kıvılcımlar (döngülü idle).
// NOT: canvas y-aşağıdır; (0,0) korların doğduğu taban noktası.
export default {
  name: 'ember-drift', category: 'particle-fx',
  desc: 'Sürüklenen korlar: titreyerek yukarı savrulan, parlayan kor zerreleri',
  tags: ['kor', 'ateş', 'kıvılcım', 'titreme', 'savurma', 'kül', 'ember', 'drift', 'fire', 'spark', 'flicker'],
  box: [-110, -170, 110, 60],
  bleed: 60,
  anchor: 'alt merkez (0,0) — korların doğduğu taban noktası',
  points: { source: [0, 30], top: [0, -160] },
  params: {
    count: { type: 'number', default: 16, min: 6, max: 28, desc: 'aynı anda sürüklenen kor sayısı' },
    color: { type: 'color', default: 'yellow', desc: 'kor rengi (sıcak renk önerilir)' },
  },
  draw(ctx, t, p, k) {
    const n = Math.round(p.count);
    const CYCLE = 4.2; // saniye — bir korun ömrü
    ctx.save();
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 3 + 701), h2 = k.hash(i * 5 + 707), h3 = k.hash(i * 7 + 719);
      const c = ((t / CYCLE) + h1) % 1;
      // rüzgâr: sağa savrulma yükseldikçe artar (sol üstten ışık, sağa drift)
      const x = (h2 - 0.5) * 90 + c * (30 + h3 * 55) + k.noise1(i * 2.4 + t * 2.2) * 14;
      const y = 34 - c * 200 - Math.sin(c * Math.PI) * 14 * h1;
      const r = 2.4 + h3 * 4.6;
      const fade = Math.sin(c * Math.PI);
      if (fade <= 0.02) continue;
      // titreme: noise tabanlı, her kor kendi ritminde
      const flick = 0.45 + 0.55 * (0.5 + 0.5 * k.noise1(i * 9.1 + t * (5 + h2 * 6)));
      const al = fade * flick;

      // kor: gerçek ışık hissi için glow + sıcak çekirdek
      if (r > 3.4) k.glow(x, y, r * 4.2, p.color, 0.38 * al);
      const hot = h3 > 0.5;
      ctx.fillStyle = hot
        ? 'rgba(255,255,255,' + (0.85 * al).toFixed(3) + ')'
        : k.rgba(p.color, 0.9 * al);
      ctx.beginPath(); ctx.arc(x, y, r * (hot ? 0.55 : 1), 0, k.TAU); ctx.fill();

      // kuyruk izi: geride kalan sönük nokta
      const tx = x - 8 - h2 * 10, ty = y + 10;
      ctx.fillStyle = k.rgba('red', 0.28 * fade);
      ctx.beginPath(); ctx.arc(tx, ty, r * 0.45, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
