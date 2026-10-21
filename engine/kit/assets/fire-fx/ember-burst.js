// fire-fx/ember-burst — kor fışkırması: parlayan kor parçacıkları havaya savrulur, sönümlenip düşer.
// NOT: canvas y-aşağıdır; (0,0) fışkırma merkezidir.
export default {
  name: 'ember-burst',
  category: 'fire-fx',
  desc: 'Kor fışkırması: parlayan kor parçacıkları havaya savrulur, sönümlenerek düşer',
  tags: ['kor', 'kıvılcım', 'fışkırma', 'ateş', 'sönümlenme', 'ember', 'burst', 'spark', 'fire', 'glow'],
  box: [-120, -170, 120, 50],
  bleed: 45,
  anchor: 'fışkırma merkezi (0,0)',
  points: { origin: [0, 0], top: [0, -140] },
  params: {
    at: { type: 'time', default: null, desc: 'fışkırma anı (0.9 sn: korlar savrulur, sönümlenip düşer)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- köz yatağı: her zaman çizilir, nabızla parlar ---
    const pulse = 0.5 + 0.5 * Math.sin(t * 3.1);
    for (let i = 0; i < 7; i++) {
      const hx = k.hash(i * 11 + 3);
      const ex = (hx - 0.5) * 110 * S;
      const er = (6 + 6 * k.hash(i * 17 + 8)) * S;
      ctx.fillStyle = k.rgba('dim', 0.9);
      ctx.beginPath(); ctx.arc(ex, 4 * S, er, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('red', 0.55 + 0.3 * pulse * k.hash(i * 5 + 1));
      ctx.beginPath(); ctx.arc(ex - er * 0.2, 2 * S, er * 0.62, 0, k.TAU); ctx.fill();
    }
    k.glow(0, 4 * S, 50 * S, k.col('red'), 0.18 + 0.12 * pulse);

    // --- patlama öncesi: son nabız büyür ---
    if (d < 0) {
      const pre = p.at != null ? k.clamp(1 + d / 0.4, 0, 1) : 0; // son 0.4 sn'de şişer
      k.glow(0, 0, (30 + 40 * pre) * S, k.col('yellow'), 0.2 + 0.35 * pre);
      ctx.restore();
      return;
    }

    // --- kor parçacıkları (0.9 sn) ---
    if (d < 0.95) {
      const N = 26;
      for (let i = 0; i < N; i++) {
        const h1 = k.hash(i * 7 + 21), h2 = k.hash(i * 13 + 37), h3 = k.hash(i * 29 + 51);
        const ang = -Math.PI / 2 + (h1 - 0.5) * 2.2;      // yukarıya koni
        const v0 = (150 + 190 * h2) * S;
        const tt = d;
        // balistik: yukarı fırlama, hafif yerçekimiyle yavaşlama
        const r = v0 * tt * (1 - 0.35 * tt);
        const x = Math.cos(ang) * r + k.noise1(t * 5 + i * 3) * 14 * S * tt;
        const y = Math.sin(ang) * r + 60 * S * tt * tt;    // y-aşağı: +y aşağı çekiş
        const life = 1 - k.prog(tt, 0.35, 0.9);            // 0.35 sn'den sonra sönüm
        if (life <= 0 || y > 30 * S) continue;
        const sz = (2.5 + 3.5 * h3) * S * life;
        const col = life > 0.5 ? 'yellow' : 'red';
        k.glow(x, y, sz * 4, k.col(col), 0.35 * life);
        ctx.fillStyle = k.rgba(col, 0.95 * life);
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
        // sol üst parlama (premium finish, alfa 0.10)
        ctx.fillStyle = k.rgba('bg', 0.10 * life);
        ctx.beginPath(); ctx.ellipse(x - sz * 0.3, y - sz * 0.3, sz * 0.5, sz * 0.35, -0.5, 0, k.TAU); ctx.fill();
      }
      // taban alev parlaması (0.3 sn)
      const fb = 1 - k.prog(d, 0, 0.3);
      if (fb > 0) k.glow(0, -10 * S, 90 * S * fb, k.col('yellow'), 0.4 * fb);
    }

    ctx.restore();
  },
};
