// fx/water-splash — su sıçraması: at anında damlalar yukarı fışkırır, düşer ve solar.
// NOT: canvas y-aşağıdır; sıçrama tabanı (0,0), damlalar yukarı (negatif y) fışkırır.
export default {
  name: 'water-splash',
  category: 'fx',
  desc: 'Su sıçraması: at anında yukarı fışkıran damlalar, düşer ve solar',
  tags: ['su', 'sıçrama', 'damla', 'su sesi', 'water', 'splash', 'droplet', 'plop'],
  box: [-130, -190, 130, 30],
  bleed: 40,
  anchor: 'taban (0,0): sıçramanın çıktığı nokta; damlalar yukarı fışkırır',
  points: { peak: [0, -160] },
  params: {
    at: { type: 'time', default: null, desc: 'sıçrama anı' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 1.4) return;
    ctx.lineCap = 'round';

    // 1) tabanda ilk halkalar (genişleyen elips dalgalar)
    for (let r = 0; r < 3; r++) {
      const rr = d - r * 0.12;
      if (rr < 0) continue;
      const g = k.prog(rr, 0, 0.7);
      ctx.strokeStyle = k.rgba(p.color, 0.5 * (1 - g));
      ctx.lineWidth = 5 * (1 - g) + 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14 + 100 * g, 6 + 26 * g, 0, 0, k.TAU);
      ctx.stroke();
    }

    // 2) merkez su sütunu (kısa süreli)
    if (d < 0.45) {
      const f = 1 - d / 0.45;
      k.glow(0, -40, 60 * f, p.color, 0.35 * f);
      ctx.fillStyle = k.rgba(p.color, 0.55 * f);
      const wob = (rr, seed, amp) => {
        ctx.beginPath();
        for (let i = 0; i <= 20; i++) {
          const an = (i / 20) * k.TAU;
          const q = rr * (1 + k.noise1(seed + i * 0.8 + t * 9) * amp);
          const x = Math.cos(an) * q * 0.62, y = -60 - 50 * (1 - f) + Math.sin(an) * q * 2.2;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      };
      wob(34 * f + 8, 2.3, 0.16);
    }

    // 3) damlalar: yukarı fışkırır, yerçekimiyle düşer
    const al = 1 - k.prog(d, 0.5, 1.4);
    for (let i = 0; i < 18; i++) {
      const h1 = k.hash(i * 3 + 11), h2 = k.hash(i * 5 + 23), h3 = k.hash(i * 7 + 37);
      const ang = (h1 - 0.5) * 1.5;                    // saçılma açısı
      const v0 = 280 + h2 * 220;                       // ilk hız (yukarı)
      const x = Math.sin(ang) * v0 * d * 0.75;
      const y = -v0 * d + 260 * d * d;                 // yukarı - , aşağı +
      if (y > 6) continue;
      const sz = 3.5 + h3 * 5;
      ctx.fillStyle = k.rgba(p.color, (0.75 + h3 * 0.25) * al);
      ctx.beginPath();
      ctx.ellipse(x, y, sz * 0.8, sz * (1 + d * 1.2), 0, 0, k.TAU);  // düşerken uzar
      ctx.fill();
    }
  },
};
