// vehicle-fx/exhaust-smoke — egzoz dumanı: sürekli yükselen, genişleyip solan duman halkaları.
// NOT: canvas y-aşağıdır; egzoz ağzı (0,0), duman negatif y yönünde yükselir.
export default {
  name: 'exhaust-smoke',
  category: 'vehicle-fx',
  desc: 'Egzoz dumanı: sürekli yükselen, genişleyip solan duman halkaları',
  tags: ['egzoz', 'duman', 'halka', 'is', 'motor', 'egzoz dumanı', 'exhaust', 'smoke', 'ring', 'fumes', 'emission'],
  box: [-90, -230, 90, 24],
  bleed: 40,
  anchor: 'egzoz ağzı (0,0): duman buradan yükselir',
  points: { tip: [0, 0], top: [0, -200] },
  params: {
    intensity: { type: 'number', default: 0.6, desc: 'duman yoğunluğu 0–1' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const inten = k.clamp(p.intensity, 0, 1);
    if (inten <= 0.01) return;
    ctx.save();
    const cyc = 3.2;                            // bir halkanın ömrü (sn)
    const rise = 198;
    const N = Math.round(3 + 7 * inten);        // eşzamanlı halka sayısı
    for (let i = 0; i < N; i++) {
      const ph = (((t / cyc + i / N) % 1) + 1) % 1; // 0 genç → 1 yaşlı
      const y = -14 - ph * rise;
      const grow = k.E.outCubic(ph);
      const rx = (14 + 46 * grow) * (0.7 + 0.5 * inten);
      const ry = rx * 0.62;
      const x = k.noise1(i * 3.7 + t * 1.1) * 14 * ph;
      const alpha = 0.5 * (1 - ph) * (0.35 + 0.65 * inten);
      // yumuşak iç dolgu + belirgin halka kenarı
      ctx.fillStyle = k.rgba(p.color, alpha * 0.35);
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba(p.color, alpha);
      ctx.lineWidth = 5 + 4 * grow;
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.stroke();
      // sol üst parlama (premium finish)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - rx * 0.35, y - ry * 0.45, rx * 0.4, ry * 0.3, -0.5, 0, k.TAU); ctx.fill();
    }
    // ağızdaki taze pof: hafif nabızla büyür/küçülür (canlı idle)
    const puff = 8 + 5 * inten + k.noise1(t * 2.2) * 3;
    k.glow(0, -8, puff * 2.4, p.color, 0.3);
    ctx.fillStyle = k.rgba(p.color, 0.55);
    ctx.beginPath(); ctx.ellipse(0, -8, puff * 1.25, puff * 0.8, 0, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
