// space-fx-2/blackhole-swirl — kara delik girdabı: sürekli dönen turuncu akresyon diski
// ve ortasında karanlık çekirdek; iç kenar nabızla parlar (idle).
// NOT: canvas y-aşağıdır; (0,0) çekirdek merkezidir.
export default {
  name: 'blackhole-swirl',
  category: 'space-fx-2',
  desc: 'Kara delik girdabı: sürekli dönen turuncu disk ve ortasında karanlık çekirdek',
  tags: ['kara delik', 'girdap', 'dönme', 'uzay', 'disk', 'akresyon', 'çekirdek', 'black hole', 'swirl', 'vortex', 'accretion', 'disk'],
  box: [-160, -110, 160, 110],
  bleed: 40,
  anchor: 'çekirdek merkezi (0,0)',
  points: { center: [0, 0], edge: [128, 0] },
  params: {
    spin: { type: 'number', default: 1, desc: '0.3–2: dönüş hızı' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.size, 0.5, 1.5);
    const sp = k.clamp(p.spin, 0.3, 2);
    ctx.save();

    const R = 128 * S;                 // disk yarıçapı
    const TILT = 0.42;                 // disk eğimi (y basık)

    // --- dış disk: dim taban ---
    ctx.fillStyle = k.rgba('dim', 0.55);
    ctx.beginPath(); ctx.ellipse(0, 0, R, R * TILT, 0, 0, k.TAU); ctx.fill();

    // --- spiral kollar: idle sürekli dönüş (3 kol) ---
    for (let a = 0; a < 3; a++) {
      const base = t * 1.6 * sp + a * k.TAU / 3;
      for (let s = 0; s < 14; s++) {
        const u = s / 13;                                   // 0 merkez → 1 dış
        const ang = base + u * 2.6;                         // spiral sarımı
        const r = 44 * S + u * (R - 50 * S);
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r * TILT;
        const sz = (3 + 7 * (1 - u)) * S;
        const tw = 0.5 + 0.5 * k.noise1(t * 8 + a * 9 + s * 1.7);
        const col = u < 0.45 ? 'yellow' : 'red';
        ctx.fillStyle = k.rgba(col, (0.25 + 0.55 * tw) * (1 - u * 0.55));
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      }
    }
    // --- dönen sıcak iç halka: nabızla parlar ---
    const pulse = 0.5 + 0.5 * Math.sin(t * 5.3);
    const ringR = 52 * S;
    k.glow(0, 0, ringR * 2.2, k.col('yellow'), (0.28 + 0.18 * pulse));
    ctx.strokeStyle = k.rgba('yellow', 0.85);
    ctx.lineWidth = 10 * S * (0.9 + 0.25 * pulse);
    ctx.beginPath(); ctx.ellipse(0, 0, ringR, ringR * TILT, 0, 0, k.TAU); ctx.stroke();
    // halka üstünde dönen parlak düğüm
    const na = t * 2.4 * sp;
    const nx = Math.cos(na) * ringR, ny = Math.sin(na) * ringR * TILT;
    k.glow(nx, ny, 26 * S, k.col('yellow'), 0.6);
    ctx.fillStyle = k.rgba('yellow', 0.95);
    ctx.beginPath(); ctx.arc(nx, ny, 8 * S, 0, k.TAU); ctx.fill();

    // --- çekirdek: karanlık gölge (iki temada da boşluk gibi okunur) ---
    ctx.fillStyle = k.rgba('bg', 1);
    ctx.beginPath(); ctx.ellipse(0, 0, 40 * S, 40 * S * TILT * 1.15, 0, 0, k.TAU); ctx.fill();
    // gölge perdesi: iki temada da aynı gri gölgeyi verir
    ctx.fillStyle = k.rgba('ink', 0.62);
    ctx.beginPath(); ctx.ellipse(0, 0, 40 * S, 40 * S * TILT * 1.15, 0, 0, k.TAU); ctx.fill();
    // mercekleme kenarı: ince parlak çizgi
    ctx.strokeStyle = k.rgba('ink', 0.5);
    ctx.lineWidth = 2.5 * S;
    ctx.beginPath(); ctx.ellipse(0, 0, 40 * S, 40 * S * TILT * 1.15, 0, 0, k.TAU); ctx.stroke();
    // sol üst parlama (premium finish, alfa 0.10) — disk üst kenarında
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-R * 0.35, -R * TILT * 0.55, R * 0.3, R * TILT * 0.16, -0.25, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
