// fx/smoke — yükselen duman sütunu; yoğunluk ayarlı, yumuşak döngü.
// NOT: canvas y-aşağıdır; taban (0,0), duman negatif y yönünde yükselir.
export default {
  name: 'smoke',
  category: 'fx',
  desc: 'Yükselen duman sütunu; yoğunluk ayarlı, yumuşak döngülü, hafif yana salınımlı',
  tags: ['duman', 'is', 'buhar', 'tütün', 'smoke', 'fume', 'haze', 'vapor'],
  box: [-75, -195, 75, 10],
  bleed: 25,
  anchor: 'taban (0,0)',
  points: { top: [0, -185] },
  params: {
    density: { type: 'number', default: 0.6, desc: 'duman yoğunluğu 0–1' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const den = k.clamp(p.density, 0, 1);
    if (den <= 0.01) return;
    const H = 160;                                  // sütun boyu
    const N = Math.round(5 + 5 * den);
    for (let i = 0; i < N; i++) {
      const speed = 0.55 + k.hash(i * 3 + 1) * 0.5;
      const cyc = H / 30;
      const ph = ((t * speed + k.hash(i * 5 + 2) * cyc) % cyc) / cyc;   // 0→1
      const sway = k.noise1(i * 7 + t * 1.4) * (7 + ph * 15);
      const x = sway + (k.hash(i * 11 + 3) - 0.5) * 16;
      const y = -8 - ph * H;
      const r = 12 + ph * 22 + k.hash(i * 13 + 4) * 7;
      const fade = Math.sin(ph * Math.PI);          // altta ve üstte yumuşak giriş/çıkış
      const a = 0.4 * den * fade;
      // yumuşak kenar: dış hale + iç gövde
      ctx.fillStyle = k.rgba(p.color, a * 0.4);
      ctx.beginPath(); ctx.arc(x, y, r * 1.4, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, a);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      // hacim: sağ alta hafif gölge, sol üste hafif parlama
      ctx.fillStyle = k.rgba('bg', 0.1 * fade);
      ctx.beginPath(); ctx.arc(x + r * 0.28, y + r * 0.28, r * 0.62, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.46, 0, k.TAU); ctx.fill();
    }
  },
};
