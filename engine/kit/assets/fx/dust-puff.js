// fx/dust-puff — toz bulutu: at anında zeminden kabarır, dışa yayılır ve solar.
// NOT: canvas y-aşağıdır; toz tabanı (0,0), bulut yukarı (negatif y) kabarır.
export default {
  name: 'dust-puff',
  category: 'fx',
  desc: 'Toz bulutu: at anında zeminden kabarır, dışa yayılır, solar',
  tags: ['toz', 'bulut', 'toprak', 'darbe', 'dust', 'puff', 'cloud', 'dirt', 'poof'],
  box: [-170, -130, 170, 20],
  bleed: 35,
  anchor: 'taban (0,0): tozun çıktığı nokta',
  points: { top: [0, -110] },
  params: {
    at: { type: 'time', default: null, desc: 'toz kalkma anı' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 1.3) return;

    const g = k.prog(d, 0, 1.3);
    const al = 1 - g;

    // 1) başlangıç poflaması — ilk 0.2 sn küçük patlama diski
    if (d < 0.22) {
      const f = 1 - d / 0.22;
      ctx.fillStyle = k.rgba(p.color, 0.5 * f);
      ctx.beginPath();
      ctx.ellipse(0, -14, 60 * (1 - f * 0.4), 26 * (1 - f * 0.4), 0, 0, k.TAU);
      ctx.fill();
    }

    // 2) toz pufları: dışa ve yukarı sürüklenir, büyür, solar
    for (let i = 0; i < 12; i++) {
      const h1 = k.hash(i * 3 + 5), h2 = k.hash(i * 5 + 9), h3 = k.hash(i * 7 + 13);
      const side = h1 > 0.5 ? 1 : -1;
      const dist = (20 + h2 * 130) * k.E.outCubic(g);
      const x = side * dist + k.noise1(i * 2 + d * 3) * 10;
      const y = -(14 + h3 * 70) * Math.sin(Math.min(g * 1.4, 1) * Math.PI * 0.5)
                - g * g * 12 + k.noise1(i * 3 + 7 + d * 2.5) * 8;
      const r = (10 + h3 * 16) * (0.5 + g * 0.9);
      // yumuşak kenar: hale + gövde
      ctx.fillStyle = k.rgba(p.color, 0.16 * al);
      ctx.beginPath(); ctx.arc(x, y, r * 1.7, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 0.5 * al);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      // sol üst parlama (premium finish)
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.4, r * 0.45, r * 0.3, -0.4, 0, k.TAU); ctx.fill();
    }
  },
};
