// combat-fx/slash — kılıç kesik yayı: slash anında parlayan hilal yay + hareket çizgileri.
// NOT: canvas y-aşağıdır; yay merkezde (0,0) etrafında, saat yönünde süpürür.
export default {
  name: 'slash',
  category: 'combat-fx',
  desc: 'Kılıç kesik yayı: slash anında parlayan hilal şeklinde kesik izi ve hareket çizgileri',
  tags: ['kılıç', 'kesik', 'vuruş', 'savaş', 'slash', 'sword', 'cut', 'combat', 'swish'],
  box: [-190, -140, 190, 140],
  bleed: 70,
  anchor: 'kesik yayının merkezi (0,0)',
  points: { tip: [150, -90], trail: [-150, 90] },
  params: {
    slash: { type: 'time', default: null, desc: 'kesik anı (parlama + hareket çizgileri)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.slash == null ? -1 : t - p.slash;
    if (d < 0 || d > 0.55) return;

    const R = 145;
    const a0 = -1.45, a1 = 0.45; // üstten sağ alta süpüren yay
    const N = 26;
    ctx.save();
    ctx.lineCap = 'round';

    // 1) ilk flaş — kesik çizgisi boyunca sıcak parlama (0.12–0.2 sn)
    if (d < 0.2) {
      const f = 1 - d / 0.2;
      k.glow(55, -45, 130 * f, 'yellow', 0.35 * f);
    }

    // 2) hareket çizgileri — yayın gerisinde kalan izler
    const streakA = d < 0.28 ? 1 - d / 0.28 : 0;
    for (let i = 0; i < 4; i++) {
      const h1 = k.hash(i * 7 + 21), h2 = k.hash(i * 11 + 23);
      const a = a0 - 0.12 - h1 * 0.5;
      // çizgiler box+bleed içinde kalsın: r2 en fazla R+55
      const r1 = R + 20 + h2 * 18, r2 = R + 30 + h2 * 25;
      ctx.strokeStyle = k.rgba(p.color, 0.45 * streakA * (0.5 + h2 * 0.5));
      ctx.lineWidth = 3 + h1 * 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }

    // 3) hilal kesik — uca doğru incelen bant (parçalı dörtgenler)
    const env = d < 0.35 ? 1 : 1 - (d - 0.35) / 0.2;
    const aEnv = k.clamp(env, 0, 1);
    for (let i = 0; i < N; i++) {
      const s0 = i / N, s1 = (i + 1) / N;
      const aA = a0 + (a1 - a0) * s0, aB = a0 + (a1 - a0) * s1;
      const wA = (30 - 24 * s0) * aEnv, wB = (30 - 24 * s1) * aEnv;
      const cxA = Math.cos(aA) * R, cyA = Math.sin(aA) * R;
      const cxB = Math.cos(aB) * R, cyB = Math.sin(aB) * R;
      const nxA = -Math.sin(aA), nyA = Math.cos(aA);
      const nxB = -Math.sin(aB), nyB = Math.cos(aB);
      // dış sıcak katman
      ctx.fillStyle = k.rgba('yellow', 0.75 * aEnv);
      ctx.beginPath();
      ctx.moveTo(cxA + nxA * wA, cyA + nyA * wA);
      ctx.lineTo(cxB + nxB * wB, cyB + nyB * wB);
      ctx.lineTo(cxB - nxB * wB, cyB - nyB * wB);
      ctx.lineTo(cxA - nxA * wA, cyA - nyA * wA);
      ctx.closePath();
      ctx.fill();
      // iç sıcak çekirdek — bantın dış kenarına yakın ince şerit
      const oA = wA * 0.32, oB = wB * 0.32; // bant içindeki başlangıç ofseti
      const cA = wA * 0.38, cB = wB * 0.38; // çekirdek genişliği
      ctx.fillStyle = k.rgba('bg', 0.9 * aEnv);
      ctx.beginPath();
      ctx.moveTo(cxA + nxA * oA, cyA + nyA * oA);
      ctx.lineTo(cxB + nxB * oB, cyB + nyB * oB);
      ctx.lineTo(cxB + nxB * (oB + cB), cyB + nyB * (oB + cB));
      ctx.lineTo(cxA + nxA * (oA + cA), cyA + nyA * (oA + cA));
      ctx.closePath();
      ctx.fill();
    }

    // 4) uç kıvılcımları — yayın ucunda kopan parçacıklar
    const g = k.prog(d, 0.05, 0.5);
    for (let i = 0; i < 8; i++) {
      const h1 = k.hash(i * 13 + 31), h2 = k.hash(i * 17 + 37);
      const a = a1 + (h1 - 0.5) * 0.7;
      const rr = R + g * (60 + h2 * 90);
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      ctx.fillStyle = k.rgba('yellow', 0.8 * (1 - g));
      ctx.beginPath();
      ctx.arc(x, y, 3.5 + h2 * 5 * (1 - g), 0, k.TAU);
      ctx.fill();
    }
    ctx.restore();
  },
};
