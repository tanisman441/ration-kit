// space-fx-2/meteor-burn — yanan meteor: ateş topu başı ve arkasında alevli iz sürükler,
// `at` anında 0.7 sn parlayıp patlar, köze dağılır.
// NOT: canvas y-aşağıdır; (0,0) ateş topu merkezidir. Meteor sağ alta doğru gider.
export default {
  name: 'meteor-burn',
  category: 'space-fx-2',
  desc: 'Yanan meteor: ateş topu başı ve arkasında alevli iz sürükler, anı gelince patlar',
  tags: ['meteor', 'göktaşı', 'ateş topu', 'yanma', 'iz', 'patlama', 'meteor', 'fireball', 'burn', 'trail', 'comet'],
  box: [-170, -110, 170, 110],
  bleed: 60,
  anchor: 'ateş topu merkezi (0,0)',
  points: { head: [0, 0], 'trail-start': [-95, -70] },
  params: {
    at: { type: 'time', default: null, desc: 'ateş topu anı: 0.7 sn parlayıp patlar, köze dağılır' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    const flick = 0.78 + 0.22 * k.noise1(t * 13);          // idle: alev titremesi
    const nx = 0.8, ny = 0.6;                               // hareket yönü: sağ alt (y-aşağı)

    // --- patlama anı: 0.7 sn parlama + parçacık ---
    if (d >= 0 && d < 0.7) {
      const e = k.prog(d, 0, 0.7);
      k.glow(0, 0, (60 + 260 * e) * S, k.col('yellow'), 0.55 * (1 - e));
      ctx.fillStyle = k.rgba('yellow', 0.85 * (1 - e));
      ctx.beginPath(); ctx.arc(0, 0, (26 - 10 * e) * S, 0, k.TAU); ctx.fill();
      // dağılan köz parçacıkları
      const N = 22;
      for (let i = 0; i < N; i++) {
        const h1 = k.hash(i * 7 + 31), h2 = k.hash(i * 13 + 47), h3 = k.hash(i * 29 + 61);
        const ang = h1 * k.TAU;
        const r = (30 + d * (150 + 170 * h2)) * S;
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r;
        const life = 1 - k.prog(d, 0.25, 0.7);
        if (life <= 0) continue;
        const sz = (2 + 4 * h3) * S * life;
        ctx.fillStyle = k.rgba(life > 0.4 ? 'yellow' : 'red', 0.9 * life);
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
      return;
    }
    // --- patlama sonrası: 1.3 sn'e kadar sönümlenen köz ---
    if (d >= 0.7 && d < 1.3) {
      const fade = 1 - k.prog(d, 0.7, 1.3);
      k.glow(0, 0, 70 * S, k.col('red'), 0.3 * fade);
      for (let i = 0; i < 8; i++) {
        const hx = k.hash(i * 11 + 71), hy = k.hash(i * 17 + 83);
        const x = (hx - 0.5) * 90 * S + d * 40 * S * nx;
        const y = (hy - 0.5) * 90 * S + d * 40 * S * ny;
        ctx.fillStyle = k.rgba('dim', 0.8 * fade);
        ctx.beginPath(); ctx.arc(x, y, (3 + 4 * hx) * S, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
      return;
    }

    // --- iz (trail): sol üstte uzanan alev çizgileri ---
    for (let i = 0; i < 14; i++) {
      const h1 = k.hash(i * 5 + 13), h2 = k.hash(i * 9 + 27), h3 = k.hash(i * 23 + 41);
      const along = 0.25 + h1 * 0.75;                       // başın arkasına doğru
      const bx = -nx * along * 200 * S, by = -ny * along * 200 * S;
      const wob = k.noise1(t * 9 + i * 2.3) * 16 * S;       // idle salınım
      const x = bx - ny * wob, y = by + nx * wob;
      const len = (26 + 40 * h2) * S * (1 - along * 0.55) * flick;
      const a = 0.55 * (1 - along) * flick;
      const col = h3 > 0.45 ? 'yellow' : 'red';
      ctx.strokeStyle = k.rgba(col, a);
      ctx.lineWidth = (4 + 5 * h2) * S * (1 - along * 0.4);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x + nx * len, y + ny * len);
      ctx.lineTo(x - nx * len, y - ny * len);
      ctx.stroke();
    }
    k.glow(-nx * 90 * S, -ny * 90 * S, 90 * S, k.col('red'), 0.22 * flick);

    // --- ateş topu başı ---
    const hr = 26 * S * flick;
    // kaya çekirdek
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); ctx.arc(0, 0, hr * 0.62, 0, k.TAU); ctx.fill();
    // alev zarfı
    const flame = 0.5 + 0.5 * k.noise1(t * 17 + 4);
    k.glow(0, 0, hr * 2.4, k.col('yellow'), 0.5 * flick);
    ctx.fillStyle = k.rgba('yellow', 0.85 * flick);
    ctx.beginPath(); ctx.arc(-nx * 4 * S, -ny * 4 * S, hr * (0.72 + 0.1 * flame), 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); ctx.arc(-nx * 5 * S, -ny * 5 * S, hr * 0.38, 0, k.TAU); ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10, kontursuz)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-hr * 0.32, -hr * 0.38, hr * 0.42, hr * 0.28, -0.5, 0, k.TAU); ctx.fill();
    // sağ alt gölge (%12)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(hr * 0.25, hr * 0.3, hr * 0.4, hr * 0.26, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
