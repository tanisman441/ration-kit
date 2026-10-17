// fx/fire — döngülü alev; noise tabanlı doğal titreme, yoğunluk ayarlı.
// NOT: canvas y-aşağıdır; taban (0,0), alev negatif y yönünde yükselir.
export default {
  name: 'fire',
  category: 'fx',
  desc: 'Döngülü alev; noise ile doğal titreme, yoğunluk ayarlı, tabanda parlama',
  tags: ['ateş', 'alev', 'yangın', 'fire', 'flame', 'burn', 'blaze'],
  box: [-65, -190, 65, 10],
  bleed: 22,
  anchor: 'taban (0,0)',
  points: { top: [0, -165], base: [0, 0] },
  params: {
    intensity: { type: 'number', default: 0.7, desc: 'alev yoğunluğu 0–1' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const inten = k.clamp(p.intensity, 0, 1);
    if (inten <= 0.01) return;
    const H = 60 + 110 * inten;                 // alev boyu
    const W = 34 + 26 * inten;                  // alev genişliği

    // taban parlaması
    k.glow(0, -H * 0.22, 60 + 45 * inten, 'red', 0.32);
    k.glow(0, -H * 0.32, 40 + 28 * inten, p.color, 0.38);

    // alev dili: 3 katman, noise ile titreyen bezier gövde
    const tongue = (wF, hF, col, alpha, seed) => {
      const w = W * wF, h = H * hF;
      const sway = k.noise1(t * 3.1 + seed) * 13 * wF;
      const sway2 = k.noise1(t * 5.7 + seed + 9) * 9 * wF;
      const tipX = sway * 1.7, tipY = -h + k.noise1(t * 4.3 + seed + 4) * 11 * hF;
      ctx.fillStyle = k.rgba(col, alpha);
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.bezierCurveTo(-w / 2 - sway2, -h * 0.35, -w * 0.26 + sway, -h * 0.72, tipX, tipY);
      ctx.bezierCurveTo(w * 0.26 + sway, -h * 0.72, w / 2 - sway2, -h * 0.35, w / 2, 0);
      ctx.quadraticCurveTo(0, h * 0.07, -w / 2, 0);
      ctx.fill();
    };
    tongue(1, 1, 'red', 0.85, 1);                // dış katman
    tongue(0.64, 0.7, p.color, 0.92, 2);         // orta katman
    tongue(0.36, 0.5, p.color, 0.95, 3);         // parlak çekirdek
    // çekirdek parlaması
    k.glow(0, -H * 0.26, 26 * (0.6 + inten), p.color, 0.5);

    // közler: yükselen, döngülü parçacıklar
    const N = Math.round(4 + 9 * inten);
    for (let i = 0; i < N; i++) {
      const cyc = 1.7;
      const ph = ((t * (0.7 + k.hash(i * 3 + 1) * 0.6) + k.hash(i * 5 + 2) * cyc) % cyc) / cyc;
      const ex = (k.hash(i * 7 + 3) - 0.5) * W * 0.85 + k.noise1(i * 2 + t * 3) * 7;
      const ey = -ph * H * 1.12;
      ctx.fillStyle = k.rgba(p.color, 0.75 * (1 - ph));
      ctx.beginPath(); ctx.arc(ex, ey, 2 + (1 - ph) * 3, 0, k.TAU); ctx.fill();
    }
  },
};
