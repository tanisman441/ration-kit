// lab-fx/spill-spread — dökülen sıvının yayılması: spill anında merkezden
// sönümlü genişleyen su birikintisi; sıçrayan tanecikler ve kenarda kalan
// parlak ıslak iz; sonrasında hafif yüzey ışıltısı (idle).
// NOT: canvas y-aşağıdır; (0,0) dökülme merkezidir.
export default {
  name: 'spill-spread', category: 'lab-fx',
  desc: 'Dökülen sıvı: merkezden genişleyen birikinti, sıçramalar ve ıslak iz',
  tags: ['dökülme', 'sıvı', 'birikinti', 'yayılma', 'leke', 'spill', 'spread', 'puddle', 'leak', 'lab'],
  box: [-125, -25, 125, 25],
  bleed: 30,
  anchor: 'dökülme merkezi (0,0)',
  points: { center: [0, 0], edge: [95, 0] },
  params: {
    spill: { type: 'time', default: null, desc: 'dökülme anı (birikinti 1.2 sn boyunca sönümlü genişler)' },
    color: { type: 'color', default: 'cyan', desc: 'sıvı rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.spill == null ? -1 : t - p.spill;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // genişleme eğrisi — 1.2 sn'de sönümlü, spill yoksa minik birikinti (idle)
    const g = d < 0 ? 0.12 : k.E.outCubic(k.prog(d, 0, 1.2));
    const R = 16 + g * 76;

    // birikinti gövdesi — yumuşak dalgalı kenarlı blob
    ctx.fillStyle = k.rgba(acc, 0.7);
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * k.TAU;
      const w = 1 + 0.1 * k.noise1(i * 0.28 + 3) + 0.05 * Math.sin(3 * a + 1.2);
      const r = R * w;
      const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.42;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();

    // dış kenar çizgisi (bg, iki temada okunur)
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // yüzey ışıltısı — sol üstte yumuşak parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-R * 0.45, -R * 0.1, R * 0.32, R * 0.12, -0.25, 0, k.TAU); ctx.fill();
    // sağ alt iç gölge
    ctx.fillStyle = k.rgba('ink', 0.1);
    ctx.beginPath(); ctx.ellipse(R * 0.4, R * 0.12, R * 0.3, R * 0.1, -0.25, 0, k.TAU); ctx.fill();

    // kenardaki küçük damlalar — genişleme sırasında fırlayan uydu damlalar
    for (let i = 0; i < 6; i++) {
      const seed = i * 41 + 9;
      const a = k.hash(seed) * k.TAU;
      const rr = (2 + k.hash(seed + 1) * 3.5);
      const dist = R * (1.02 + k.hash(seed + 2) * 0.22);
      const show = d < 0 ? 0.4 : k.prog(d, 0.2 + i * 0.08, 0.9);
      if (show <= 0) continue;
      ctx.fillStyle = k.rgba(acc, 0.75 * show);
      ctx.beginPath(); ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist * 0.42, rr * show, 0, k.TAU); ctx.fill();
    }

    // sıçrama tanecikleri — spill anında havaya (0.4-0.9 sn)
    if (d >= 0.05 && d < 0.95) {
      const g2 = k.prog(d, 0.05, 0.95);
      for (let i = 0; i < 8; i++) {
        const seed = i * 53 + 21;
        const a = -Math.PI / 2 + (k.hash(seed) - 0.5) * 2.4;
        const h = g2 * (30 + k.hash(seed + 1) * 46) * (1 - g2 * 0.6);
        const dist = (1 - g2 * 0.4) * (R * 0.55) * k.hash(seed + 2);
        const x = Math.cos(a * 0.3) * dist, y = -h;
        ctx.fillStyle = k.rgba(acc, 0.9 * (1 - g2));
        ctx.beginPath(); ctx.arc(x, y, 2.6 * (1 - g2) + 0.8, 0, k.TAU); ctx.fill();
      }
      // genişleyen dış halka
      ctx.strokeStyle = k.rgba(acc, 0.6 * (1 - g2));
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 0, R * (0.9 + g2 * 0.25), R * (0.9 + g2 * 0.25) * 0.42, 0, 0, k.TAU); ctx.stroke();
    }

    // yüzey dalgalanması (idle — birikinti her zaman hafif ışıldar)
    const sh = 0.5 + 0.5 * Math.sin(t * 2.4);
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.1 + 0.08 * sh).toFixed(3) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-R * 0.2, -R * 0.02, R * 0.55, R * 0.2, 0, 3.4, 5.6); ctx.stroke();

    ctx.restore();
  },
};
