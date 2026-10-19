// icons/star-rating — 5 yıldızlı puan göstergesi; fill anında yıldızlar sırayla dolar.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) yıldız sırasının merkezidir.
export default {
  name: 'star-rating',
  category: 'icons',
  desc: 'Yan yana 5 yıldız; rating kadar sarı dolar, fill anında soldan sağa sırayla dolum animasyonu yapar',
  tags: ['yıldız', 'puan', 'star', 'rating', 'değerlendirme', 'puanlama', '5 star', 'icon'],
  box: [-158, -48, 158, 48],
  bleed: 50,
  anchor: 'yıldız sırası merkezi (0,0)',
  points: { top: [0, -26], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'dolu yıldız rengi' },
    rating: { type: 'number', default: 5, desc: '0–5 arası puan (buçuk desteklenir)' },
    fill: { type: 'time', default: null, desc: 'dolum anı: yıldızlar sırayla dolar (0.85 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const star = (x, y, rO, rI, rot = -Math.PI / 2) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? rO : rI;
        const a = rot + (i / 10) * k.TAU;
        const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    // ANIMASYON — fill: yıldız i, d = i*0.12 gecikmeyle 0.25 sn'de dolar
    const d = p.fill == null ? -1 : t - p.fill;
    const frac = i => {
      const target = k.clamp(p.rating - i, 0, 1);
      if (d < 0) return target;
      return k.clamp((d - i * 0.12) / 0.25, 0, 1) * target;
    };
    // idle: sıra hafifçe nefes alır
    const bob = 1.5 * Math.sin((t / 2.4) * k.TAU);
    ctx.save(); ctx.translate(0, bob);
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * 60, f = frac(i);
      // boş yıldız (hat + silik dolgu)
      ctx.lineWidth = 5; ctx.strokeStyle = O; star(x, 0, 26, 11.5); ctx.stroke();
      ctx.fillStyle = k.rgba('dim', 0.35); star(x, 0, 26, 11.5); ctx.fill();
      // dolu kısım (kırpma ile)
      if (f > 0.005) {
        ctx.save();
        ctx.beginPath(); ctx.rect(x - 26, -30, 52 * f, 62); ctx.clip();
        ctx.fillStyle = k.rgba(p.color); star(x, 0, 26, 11.5); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.ellipse(x - 8, -10, 7, 4, -0.5, 0, k.TAU); ctx.fill();
        ctx.restore();
        // dolum anında parıltı
        if (d >= 0 && d < 0.85) {
          const g = k.clamp((d - i * 0.12) / 0.25, 0, 1);
          if (g > 0 && g < 1) k.glow(x, 0, 30, p.color, 0.45 * (1 - g));
        }
      }
    }
    ctx.restore();
  },
};
