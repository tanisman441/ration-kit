// particle-fx/bubbles-rise — yukarı süzülen baloncuklar: tabandan sürekli doğan
// baloncuklar yalpalanarak yükselir, üstte patlar (döngülü idle).
// NOT: canvas y-aşağıdır; (0,0) baloncuk kaynağı, yukarı = negatif y.
export default {
  name: 'bubbles-rise', category: 'particle-fx',
  desc: 'Yükselen baloncuklar: yalpalanarak yukarı süzülen, üstte patlayan baloncuklar',
  tags: ['baloncuk', 'kabarcık', 'köpük', 'suda', 'yükselme', 'bubbles', 'rise', 'soap', 'foam', 'float'],
  box: [-90, -165, 90, 45],
  bleed: 40,
  anchor: 'alt merkez (0,0) — baloncukların doğduğu nokta',
  points: { source: [0, 20], top: [0, -160] },
  params: {
    count: { type: 'number', default: 12, min: 4, max: 20, desc: 'aynı anda yüzen baloncuk sayısı' },
    color: { type: 'color', default: 'cyan', desc: 'baloncuk çeper rengi' },
  },
  draw(ctx, t, p, k) {
    const n = Math.round(p.count);
    const CYCLE = 3.6; // saniye — bir baloncuğun ömrü
    ctx.save();
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 3 + 601), h2 = k.hash(i * 5 + 607), h3 = k.hash(i * 7 + 613);
      const c = ((t / CYCLE) + h1) % 1;
      const y = 26 - c * 186;
      const x = (h2 - 0.5) * 100 + k.noise1(i * 2.1 + t * 1.4) * (10 + c * 22); // yükseldikçe yalpa
      const r = 5 + h3 * 11;
      const pop = 1 - k.prog(c, 0.93, 1.0);      // tepeye varınca patlar
      if (pop <= 0) continue;
      const born = k.prog(c, 0, 0.08);           // doğarken büyür
      const rr = r * (0.3 + 0.7 * born) * (0.55 + 0.45 * pop);
      const al = (0.35 + 0.65 * born) * pop;

      // çeper: ink dış hat + renkli iç hat (iki temada da okunur)
      ctx.strokeStyle = k.rgba('bg', 0.55 * al);
      ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.85 * al);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, Math.max(rr - 1.6, 0.5), 0, k.TAU); ctx.stroke();

      // premium parlama: sol üstte beyaz ışık yansıması
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.75 * al).toFixed(3) + ')';
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(x, y, Math.max(rr - 3.2, 0.5), -2.6, -1.5); ctx.stroke();
    }
    ctx.restore();
  },
};
