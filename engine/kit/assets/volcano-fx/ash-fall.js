// volcano-fx/ash-fall — düşen kül parçacıkları; sürekli düşüş + rüzgar salınımı.
// NOT: canvas y-aşağıdır; parçacıklar yukarıdan aşağı düşer, rüzgar x'te sürükler.
export default {
  name: 'ash-fall',
  category: 'volcano-fx',
  desc: 'Rüzgarla salınarak sürekli yağan volkan külü; arada sönmekte olan turuncu köz parçacıkları',
  tags: ['kül', 'kül yağmuru', 'ash', 'fall', 'volkanik kül', 'toz', 'düşen parçacık'],
  box: [-150, -140, 150, 140],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: {},
  params: {
    density: { type: 'number', default: 1, desc: 'kül yoğunluğu 0-1.5' },
    wind: { type: 'number', default: 0.4, desc: 'rüzgar -1 (sola) ile 1 (sağa) arası' },
  },
  draw(ctx, t, p, k) {
    const dens = Math.max(0.1, p.density);
    const wind = k.clamp(p.wind, -1, 1);
    const W = 300, H = 280;                 // düşüş alanı
    const n = Math.round(34 * dens);         // kül tanesi sayısı

    // 1) kül taneleri — döngüsel düşüş, her tanenin kendi hızı/salınımı
    for (let i = 0; i < n; i++) {
      const fall = (22 + k.hash(i * 3 + 1) * 30) * (0.7 + dens * 0.3);
      const ph = ((t * fall + k.hash(i * 5 + 2) * H) % H + H) % H;
      const y = -H / 2 + ph;                                          // yukarıdan aşağı
      const swayAmp = 12 + k.hash(i * 7 + 3) * 22;
      const sway = Math.sin(t * (0.9 + k.hash(i * 11 + 4) * 0.9) + i * 1.7) * swayAmp;
      const drift = (((t * wind * 60 + k.hash(i * 13 + 5) * W) % W + W) % W) - W / 2;
      const x = k.clamp(-W / 2 + ((k.hash(i * 17 + 6) * W + drift) % W + W) % W, -W / 2, W / 2);
      const px = x + sway * 0.4;
      const sz = 2 + k.hash(i * 19 + 7) * 4.5;
      const twinkle = 0.55 + 0.45 * Math.sin(t * 3 + i * 2.3);
      ctx.fillStyle = k.rgba('dim', 0.5 * twinkle);
      ctx.save(); ctx.translate(px, y); ctx.rotate(sway * 0.02);
      ctx.beginPath(); ctx.ellipse(0, 0, sz, sz * 0.72, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // 2) köz parçacıkları — seyrek, turuncu, düşerken sönen (ısı parıltısı)
    const embers = Math.round(7 * dens);
    for (let i = 0; i < embers; i++) {
      const fall = 40 + k.hash(i * 23 + 8) * 45;
      const ph = ((t * fall + k.hash(i * 29 + 9) * H) % H + H) % H;
      const y = -H / 2 + ph;
      const base = (k.hash(i * 31 + 10) - 0.5) * 260 + Math.sin(t * 2.2 + i * 3.1) * 18;
      const x = ((base + 150 + t * wind * 24) % 300 + 300) % 300 - 150;
      const life = 1 - ph / H;                                          // alçalınca sön
      ctx.fillStyle = k.rgba('yellow', 0.75 * life);
      ctx.beginPath(); ctx.arc(x, y, 2.6 * (0.5 + life), 0, k.TAU); ctx.fill();
      k.glow(x, y, 10, 'red', 0.35 * life);
    }

    // 3) zeminde biriken kül tabakası (alt kenarda, iki temada da okunur)
    ctx.fillStyle = k.rgba('dim', 0.55);
    ctx.beginPath();
    ctx.moveTo(-150, 140);
    for (let i = 0; i <= 12; i++) {
      const x = -150 + i * 25;
      const y = 140 - 10 - k.hash(i * 37 + 11) * 16;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(150, 140); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.10);
    ctx.beginPath(); ctx.ellipse(-80, 124, 60, 8, -0.1, 0, k.TAU); ctx.fill();
  },
};
