// retail-fx/sale-sticker — indirim yıldızı (starburst); `at` anında yapışır gibi belirir, sonra nabızla salınır.
// NOT: canvas y-aşağıdır. Idle: ~1.8 sn nabız + hafif tilt; at olayı ~0.9 sn sürer.
export default {
  name: 'sale-sticker', category: 'retail-fx',
  desc: 'Yıldız patlaması indirim etiketi; yapışma anında belirir, sonra nabız gibi atar',
  tags: ['indirim', 'etiket', 'yıldız', 'kampanya', 'fırsat', 'mağaza', 'sale', 'sticker', 'discount', 'starburst', 'promo', 'offer'],
  box: [-130, -130, 130, 130],
  bleed: 80,
  anchor: 'yıldızın merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'yapışma anı: yıldız yaylanarak belirir + şok halkası (~0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;

    // yapışma: 0–0.3 sn'de outBack ile belirir
    const pop = d < 0 ? 1 : (d < 0.3 ? Math.max(0.001, k.E.outBack(k.prog(d, 0, 0.3), 1.7)) : 1);
    // idle nabız + tilt
    const pulse = 1 + 0.035 * Math.sin(t * k.TAU / 1.8);
    const tilt = 0.06 * Math.sin(t * k.TAU / 2.6);

    const burst = (r1, r2, fill) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * k.TAU, r = i % 2 === 0 ? r1 : r2;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };

    ctx.save();
    ctx.translate(0, 0); ctx.rotate(tilt); ctx.scale(pop * pulse, pop * pulse);

    burst(112, 78, line);
    burst(103, 70, k.rgba(p.color, 0.95));
    // sol üst parlama (yıldız kenarında, metinden uzakta)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-52, -58, 30, 10, -0.5, 0, k.TAU); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(48, 62, 30, 10, -0.5, 0, k.TAU); ctx.fill();

    // metin
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba('bg', 0.95);
    ctx.font = '800 30px system-ui, sans-serif';
    ctx.fillText('İNDİRİM', 0, -22);
    ctx.font = '800 52px system-ui, sans-serif';
    ctx.fillText('%50', 0, 22);
    ctx.restore();

    // yapışma şok halkası
    if (d >= 0.2 && d < 0.9) {
      const ph = k.prog(d, 0.2, 0.9);
      const r = 90 + k.E.outCubic(ph) * 90;
      ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - ph));
      ctx.lineWidth = 9 * (1 - ph) + 2;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
    }
    // yapışma anında radyal hız çizgileri
    if (d >= 0 && d < 0.25) {
      const a = 1 - k.prog(d, 0, 0.25);
      ctx.strokeStyle = k.rgba('ink', 0.45 * a); ctx.lineWidth = 5; ctx.lineCap = 'round';
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * k.TAU + 0.2;
        const r0 = 118, r1 = 138;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r0, Math.sin(ang) * r0);
        ctx.lineTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.stroke();
      }
    }
  },
};
