// fx/confetti — konfeti yağmuru: at anında tepeden renkli parçalar dökülür, salınarak düşer.
// NOT: canvas y-aşağıdır; (0,0) üst merkez, parçalar aşağı (pozitif y) düşer.
export default {
  name: 'confetti',
  category: 'fx',
  desc: 'Konfeti yağmuru: at anında tepeden renkli parçalar salınarak dökülür',
  tags: ['konfeti', 'kutlama', 'parti', 'yağmur', 'confetti', 'celebration', 'party', 'cannon'],
  box: [-190, -20, 190, 240],
  bleed: 30,
  anchor: 'üst merkez (0,0): konfetinin çıktığı nokta; parçalar aşağı dökülür',
  points: { base: [0, 220] },
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 2.2) return;
    const cols = ['red', 'cyan', 'yellow', 'green', 'purple'];

    // 1) başlangıç patlaması — ilk 0.15 sn parlama
    if (d < 0.15) {
      const f = 1 - d / 0.15;
      k.glow(0, 10, 70 * f, p.color, 0.45 * f);
    }

    // 2) parçalar: üstten fışkırır, salınarak düşer, taklalar atar
    const al = 1 - k.prog(d, 1.4, 2.2);
    for (let i = 0; i < 46; i++) {
      const h1 = k.hash(i * 3 + 41), h2 = k.hash(i * 5 + 43), h3 = k.hash(i * 7 + 47);
      const spread = (h1 - 0.5) * 2;                      // -1..1 yatay saçılma
      const v0 = 90 + h2 * 150;                          // ilk yukarı hız
      const dd = Math.max(d - h3 * 0.3, 0);              // kademeli çıkış
      const x = spread * (110 + h2 * 90) * (1 - Math.pow(1 - Math.min(dd * 1.8, 1), 2))
                + k.noise1(i * 2 + d * 4) * 16;          // dışa + yana salınım
      const y = -v0 * dd + 130 * dd * dd + 30;           // önce yukarı, sonra süzülerek düş
      if (y > 235 || y < -14) continue;
      const col = cols[i % 5];
      const spin = dd * (3 + h2 * 5) + h1 * k.TAU;
      const w = (6 + h2 * 6) * (0.4 + 0.6 * Math.abs(Math.cos(spin))); // takla: daralır
      ctx.fillStyle = k.rgba(col, al);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(spin * 0.7) * 0.6);
      ctx.fillRect(-w / 2, -4, w, 8);
      ctx.restore();
    }
  },
};
