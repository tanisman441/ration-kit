// characters/crowd — 5-12 kişilik kalabalık; person ailesinin sadeleştirilmiş figürleri.
// NOT: canvas y-aşağıdır; zemin (0,0), figürler negatif y yönünde yukarı uzar.
export default {
  name: 'crowd',
  category: 'characters',
  desc: '5–12 kişilik kalabalık; iki sıra, hafif salınımlı sade figürler',
  tags: ['kalabalık', 'insanlar', 'topluluk', 'izleyici', 'crowd', 'people', 'group', 'audience'],
  box: [-250, -225, 250, 12],
  bleed: 0,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -215] },
  params: {
    color: { type: 'color', default: 'dim' },
    count: { type: 'number', default: 8, desc: 'kişi sayısı 5–12' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const n = Math.max(5, Math.min(12, Math.round(p.count)));
    const line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.78))).join(',')})`;
    ctx.lineCap = 'round';

    const fig = (cx, baseY, s, seed) => {
      const bob = Math.sin(t * 2 + seed * 1.7) * 2.5;      // hafif salınım
      const y = baseY + bob;
      const wob = (k.hash(seed * 7 + 1) - 0.5) * 6;        // duruş farkı
      const bodyC = k.hash(seed * 31) < 0.35 ? dark : k.rgba(p.color);  // ton farkı
      // bacaklar (tek parça, sade)
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(cx - 13 * s + wob - LW / 2, y - 78 * s - LW / 2, 26 * s + LW, 78 * s + LW, 10 * s); ctx.fill();
      ctx.fillStyle = bodyC;
      ctx.beginPath(); k.rrect(cx - 13 * s + wob, y - 78 * s, 26 * s, 78 * s, 10 * s); ctx.fill();
      // gövde
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(cx - 20 * s - LW / 2, y - 140 * s - LW / 2, 40 * s + LW, 66 * s + LW, 16 * s); ctx.fill();
      ctx.fillStyle = bodyC;
      ctx.beginPath(); k.rrect(cx - 20 * s, y - 140 * s, 40 * s, 66 * s, 16 * s); ctx.fill();
      // baş
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(cx + wob * 0.5, y - 158 * s, 21 * s + LW / 2, 20 * s + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = bodyC;
      ctx.beginPath(); ctx.ellipse(cx + wob * 0.5, y - 158 * s, 21 * s, 20 * s, 0, 0, k.TAU); ctx.fill();
      // premium parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx + wob * 0.5 - 7 * s, y - 165 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
    };

    // iki sıra: arka sıra daha küçük ve yukarıda
    const rows = n <= 6 ? [[n, 0, 1]] : [[Math.ceil(n / 2), -58, 0.82], [Math.floor(n / 2), 0, 1]];
    let seed = 1;
    for (const [cnt, baseY, s] of rows) {
      const w = Math.min(440, cnt * 72);
      for (let i = 0; i < cnt; i++) {
        const cx = cnt === 1 ? 0 : -w / 2 + (w * i) / (cnt - 1) + (k.hash(seed * 13) - 0.5) * 18;
        fig(cx, baseY, s * (0.92 + k.hash(seed * 29) * 0.16), seed);
        seed++;
      }
    }

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, -4, Math.min(240, n * 34), 9, 0, 0, k.TAU); ctx.fill();
  },
};
