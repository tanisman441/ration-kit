// particle-fx/smoke-puff — tabandan sürekli yükselen duman yumağı: puflar
// genişleyip solarak yükselir (döngülü idle animasyon).
// NOT: canvas y-aşağıdır; (0,0) dumanın çıktığı taban noktası, yukarı = negatif y.
export default {
  name: 'smoke-puff', category: 'particle-fx',
  desc: 'Yükselen duman yumağı: tabandan sürekli genişleyip solarak yükselen puflar',
  tags: ['duman', 'buhar', 'puf', 'bulut', 'yükselme', 'smoke', 'puff', 'steam', 'cloud', 'rise'],
  box: [-100, -180, 100, 40],
  bleed: 60,
  anchor: 'taban (0,0) — dumanın çıktığı nokta',
  points: { source: [0, 0], top: [0, -160] },
  params: {
    density: { type: 'number', default: 0.7, min: 0.2, max: 1, desc: 'duman yoğunluğu' },
    color: { type: 'color', default: 'dim', desc: 'duman rengi' },
  },
  draw(ctx, t, p, k) {
    const N = 14;
    const CYCLE = 3.2; // saniye — bir pufun tabandan tepeye ömrü
    ctx.save();
    for (let i = 0; i < N; i++) {
      const h1 = k.hash(i * 3 + 401), h2 = k.hash(i * 5 + 407), h3 = k.hash(i * 7 + 419);
      // döngülü faz: puflar alttan üst üste biner
      const c = ((t / CYCLE) + h1) % 1;
      const y = -18 - c * 150;
      const x = (h2 - 0.5) * 60 + k.noise1(i * 1.7 + t * 0.9) * (8 + c * 30);
      const r = (16 + h3 * 14) * (0.55 + c * 1.25);          // yükseldikçe genişler
      const fade = Math.sin(c * Math.PI);                    // altta doğar, üstte solar
      const al = fade * p.density * 0.5;

      // yumak: iki üst üste daire — koyu iç, açık dış
      ctx.fillStyle = k.rgba(p.color, al * 0.75);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, al * 0.35);
      ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.28, r * 0.72, 0, k.TAU); ctx.fill();

      // premium parlama: sol üstten beyaz ışık (alfa 0.10 ölçeğinde)
      if (fade > 0.15) {
        ctx.fillStyle = 'rgba(255,255,255,' + (0.10 * fade * p.density).toFixed(3) + ')';
        ctx.beginPath(); ctx.ellipse(x - r * 0.3, y - r * 0.32, r * 0.42, r * 0.28, -0.5, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
