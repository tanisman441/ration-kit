// observatory-fx/star-twinkle — yıldızlar döngüsel yanıp söner; `at` anında bir kayan yıldız geçer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gökyüzünün merkezi.
export default {
  name: 'star-twinkle', category: 'observatory-fx',
  desc: 'Yıldızlı gökyüzü: her yıldız kendi ritminde yanıp söner, at anında parlak bir kayan yıldız çapraz geçer',
  tags: ['yıldız', 'yanıp sönme', 'kayan yıldız', 'gece', 'gökyüzü', 'star', 'twinkle', 'shooting star', 'night sky', 'sparkle'],
  box: [-130, -100, 130, 100],
  bleed: 30,
  anchor: 'gökyüzünün merkezi (0,0)',
  points: { sky: [0, 0], meteor: [-5, -12] }, // meteor: kayan yıldızın yol ortası (at+0.45 sn konumu)
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'kayan yıldız anı — çapraz parlak iz bırakarak geçer (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const meteor = d >= 0 && d < 0.9;
    const mProg = meteor ? d / 0.9 : -1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // 4 köşeli parıltı yıldızı çizen yardımcı (ink: iki temada da kontrastlı)
    const sparkle = (x, y, r, a, c) => {
      ctx.fillStyle = c ?? k.rgba('ink', a);
      ctx.beginPath();
      ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
    };

    // yıldız alanı: her yıldız kendi hız/fazında yanıp söner (döngüsel idle)
    for (let i = 0; i < 16; i++) {
      const sx = -118 + k.hash(i * 3 + 1) * 236;
      const sy = -88 + k.hash(i * 3 + 2) * 176;
      const sp = 0.5 + k.hash(i * 3 + 5) * 1.8;
      const ph = k.hash(i) * k.TAU;
      const a = 0.2 + 0.8 * Math.abs(Math.sin(t * sp + ph));
      const big = k.hash(i * 7) > 0.62;
      const r = big ? 7 + 3 * Math.sin(t * sp + ph) : 1.8 + k.hash(i * 11) * 2.4;
      if (big) {
        sparkle(sx, sy, Math.max(r, 3), a);
      } else {
        ctx.fillStyle = k.rgba('ink', a);
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, k.TAU); ctx.fill();
      }
    }

    // ay ışığı gibi sol üstte soluk bir ışık lekesi (sabit, hafif nabız)
    k.glow(-95, -70, 55, 'yellow', 0.10 + 0.04 * Math.sin(t * 1.5));

    // kayan yıldız: sol üstten sağ alta çapraz, iz bırakarak
    if (meteor) {
      const hx = -110 + mProg * 210;
      const hy = -72 + mProg * 120;
      const fade = Math.sin(Math.min(mProg, 1) * Math.PI);
      // iz: başı parlak, kuyruğu sönen çizgi
      const tail = 55 * (1 - mProg * 0.4);
      const grad = ctx.createLinearGradient(hx, hy, hx - tail, hy - tail * 0.57);
      grad.addColorStop(0, k.rgba('yellow', 0.95 * fade));
      grad.addColorStop(1, k.rgba('yellow', 0));
      ctx.strokeStyle = grad; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - tail, hy - tail * 0.57); ctx.stroke();
      // baş: parlak nokta + parıltı
      k.glow(hx, hy, 22, 'yellow', 0.6 * fade);
      sparkle(hx, hy, 9, fade, k.rgba('yellow', fade));
      // kıvılcım parçacıkları
      for (let i = 0; i < 5; i++) {
        const px = hx - k.hash(i + 20) * 40 * mProg - 8;
        const py = hy - k.hash(i + 30) * 22 * mProg + (k.hash(i + 40) - 0.5) * 14;
        ctx.fillStyle = k.rgba('yellow', 0.7 * fade * (1 - mProg));
        ctx.beginPath(); ctx.arc(px, py, 2, 0, k.TAU); ctx.fill();
      }
    }
  },
};
