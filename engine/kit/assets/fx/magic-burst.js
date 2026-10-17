// fx/magic-burst — sihirli patlama: yıldız ışınlar + genişleyen çift halka + sarmal kıvılcımlar.
// explosion'dan farkı: ateş yerine büyü dili (mor parıltı, sarmal yıldız kıvılcımlar).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'magic-burst', category: 'fx',
  desc: 'Sihirli patlama: yıldız ışınlar, genişleyen mor halka, sarmal yükselen yıldız kıvılcımlar',
  tags: ['büyü', 'sihir', 'patlama', 'magic', 'burst', 'parıltı', 'spell', 'yıldız', 'sparkle'],
  box: [-110, -110, 110, 110],
  bleed: 110,
  anchor: 'merkez (0,0)',
  points: {},
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı' },
    color: { type: 'color', default: 'purple', desc: 'büyü rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 1.1) return;
    ctx.lineCap = 'round';

    // 1) ilk flaş — 0–0.15 sn: yıldız ışınlar + parlama
    if (d < 0.15) {
      const f = 1 - d / 0.15;
      k.glow(0, 0, 130, p.color, 0.55 * f);
      ctx.fillStyle = k.rgba(p.color, 0.9 * f);
      ctx.beginPath(); ctx.arc(0, 0, 12 + 20 * f, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * k.TAU + 0.31;
        const r2 = 70 + 50 * f;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.06) * 24, Math.sin(a - 0.06) * 24);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.lineTo(Math.cos(a + 0.06) * 24, Math.sin(a + 0.06) * 24);
        ctx.closePath(); ctx.fill();
      }
    }

    // 2) genişleyen çift halka — 0.05–0.8 sn
    if (d > 0.05 && d < 0.8) {
      const g = k.prog(d, 0.05, 0.8);
      ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - g));
      ctx.lineWidth = 10 * (1 - g * 0.6);
      ctx.beginPath(); ctx.arc(0, 0, 25 + 125 * g, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.45 * (1 - g));
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 18 + 80 * g, 0, k.TAU); ctx.stroke();
    }

    // 3) sarmal yıldız kıvılcımlar — 0–1.1 sn: dışa + hafif sarmal + yükselme
    const dd = Math.min(d, 1), al = Math.max(0, 1 - dd);
    const ease = 1 - Math.pow(1 - dd, 2);
    for (let i = 0; i < 14; i++) {
      const a = k.hash(i * 3 + 1) * k.TAU;
      const sp = 80 + k.hash(i * 5 + 2) * 140;
      const swirl = (2 + k.hash(i * 7 + 3) * 2) * d;
      const dist = sp * ease;
      const x = Math.cos(a + swirl * 0.4) * dist;
      const y = Math.sin(a + swirl * 0.4) * dist * 0.9 - dd * 70;
      const tw = 0.6 + 0.4 * Math.sin(t * 18 + k.hash(i * 13 + 5) * k.TAU);
      const sz = 4 + k.hash(i * 11 + 4) * 6;
      ctx.fillStyle = k.rgba(p.color, al * tw);
      // 4 köşeli parıltı yıldızı
      ctx.beginPath();
      ctx.moveTo(x, y - sz);
      ctx.lineTo(x + sz * 0.3, y - sz * 0.3);
      ctx.lineTo(x + sz, y);
      ctx.lineTo(x + sz * 0.3, y + sz * 0.3);
      ctx.lineTo(x, y + sz);
      ctx.lineTo(x - sz * 0.3, y + sz * 0.3);
      ctx.lineTo(x - sz, y);
      ctx.lineTo(x - sz * 0.3, y - sz * 0.3);
      ctx.closePath(); ctx.fill();
    }
  },
};
