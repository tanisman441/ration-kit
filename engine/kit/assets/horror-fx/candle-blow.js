// horror-fx/candle-blow — yanan mum: dans eden alev; at anında söner, duman yükselir.
// NOT: canvas y-aşağıdır; (0,60) mum tabanıdır, alev yukarıdadır.
export default {
  name: 'candle-blow', category: 'horror-fx',
  desc: 'Yanan mum: alev sürekli dans eder; at anında 0.4 sn çırpınıp söner, ardından ~1.5 sn duman yükselir',
  tags: ['mum', 'alev', 'sönme', 'duman', 'fitil', 'korku', 'candle', 'flame', 'blow out', 'smoke', 'wick', 'horror'],
  box: [-55, -195, 55, 75],
  bleed: 30,
  anchor: 'mum tabanı (0,60)',
  points: { flame: [0, -102], wick: [0, -74], smoke_top: [0, -182] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'söndürme anı: 0.4 sn alev çırpınır ve söner, duman yükselir' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // --- mum gövdesi: gölge + ana form + erimiş balmumu ---
    ctx.fillStyle = darker('dim');
    k.rrect(-22 + 6, -70 + 6, 44, 130, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-22, -70, 44, 130, 12); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    k.rrect(-22, -70, 44, 130, 12); ctx.stroke();
    for (const [wx, ww, wh] of [[-14, 9, 16], [4, 12, 24]]) {   // balmumu damlaları
      ctx.fillStyle = k.rgba('dim');
      k.rrect(wx, -70 - wh + 4, ww, wh, 5); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4;
      k.rrect(wx, -70 - wh + 4, ww, wh, 5); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';               // sol üst parlama (premium finish)
    ctx.beginPath(); ctx.ellipse(-13, -50, 6, 26, 0.08, 0, k.TAU); ctx.fill();

    // --- fitil ---
    ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(0, -80); ctx.stroke();

    // --- alev: idle dansı / söndürme çırpınışı ---
    const flame = (fx, fy, fs, alpha) => {
      k.glow(fx, fy, 34 * fs, k.col(p.color), 0.42 * alpha);
      ctx.fillStyle = k.rgba(p.color, 0.95 * alpha);
      ctx.beginPath(); ctx.ellipse(fx, fy, 10 * fs, 16 * fs, 0.12, 0, k.TAU); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.75 * alpha})`;
      ctx.beginPath(); ctx.ellipse(fx - 1.5 * fs, fy + 4 * fs, 4 * fs, 7 * fs, 0.12, 0, k.TAU); ctx.fill();
    };
    if (d < 0) {
      const sway = 4.5 * k.noise1(t * 6.2);                // alev dansı (idle)
      const stretch = 1 + 0.14 * Math.sin(t * 11) + 0.06 * k.noise1(t * 17);
      flame(sway, -102, stretch, 1);
    } else if (d < 0.4) {
      const g = k.prog(d, 0, 0.4);                         // 0.4 sn çırpınıp sönme
      const fs = (1 - g) * (1 - 0.15 * g);
      const shakeX = 9 * g * k.noise1(d * 43);
      flame(shakeX, -102 + 6 * g, Math.max(0.01, fs), 1 - g * 0.6);
    }

    // --- duman: sönmeden sonra 1.2 sn yükselir ---
    if (d >= 0.35 && d < 1.9) {
      const sd = d - 0.35;
      for (let i = 0; i < 6; i++) {
        const rise = sd * 68 - i * 14;
        if (rise < 0) continue;
        const px = 5 * k.noise1(i * 3.1 + sd * 4.5);       // dalgalı yükseliş
        const pr = 4.5 + rise * 0.10;
        const pa = 0.5 * (1 - sd / 1.55) * (1 - i / 9);
        if (pa <= 0) continue;
        ctx.fillStyle = k.rgba('dim', pa);
        ctx.beginPath(); ctx.arc(px, -82 - rise, pr, 0, k.TAU); ctx.fill();
      }
      // fitilde sönümlenen köz parlaması (sarı vurgu)
      const ember = 1 - k.prog(sd, 0, 0.6);
      if (ember > 0) k.glow(0, -80, 12, k.col(p.color), 0.35 * ember);
    }

    ctx.restore();
  },
};
