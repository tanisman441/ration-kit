// space-travel/comet-tail — kuyruklu yıldız: parlayan baş + dalgalanan kuyruk
// + kuyruktan kopan parçacıklar. Canlı idle: kuyruk dalgalanması, baş parlaması.
// NOT: canvas y-aşağıdır; (0,0) kuyruklu yıldızın baş merkezidir (nokta [90,0]'da).
export default {
  name: 'comet-tail', category: 'space-travel',
  desc: 'Kuyruklu yıldız: nabız gibi parlayan baş, dalgalanan kuyruk ve kopan parçacıklar',
  tags: ['kuyruklu yıldız', 'kuyruk', 'uzay', 'uzay yolculuğu', 'göktaşı', 'meteor', 'comet', 'tail', 'meteor', 'space travel', 'kuyrukluyıldız'],
  box: [-260, -110, 150, 110],
  bleed: 40,
  anchor: 'kuyruklu yıldız baş merkezi (0,0)',
  points: { head: [90, 0], tail: [-230, 0] },
  params: {
    speed: { type: 'number', default: 0.6, desc: '0-1: akış hızı (dalgalanma + parçacık)' },
  },
  draw(ctx, t, p, k) {
    const sp = k.clamp(p.speed, 0, 1);
    const HX = 90;                                  // baş x konumu
    ctx.save();
    ctx.translate(HX, 0);                           // artık (0,0) = baş merkezi

    // kuyruk orta çizgisi: x sola gittikçe büyüyen dalga
    const wave = x => Math.sin(x * 0.022 + t * (1.2 + 2.6 * sp)) * (7 + (-x) * 0.10);

    // kuyruk: 3 katmanlı bant (ana bant cyan vurgu, dış bantlar dim)
    const bands = [
      { col: 'cyan', a: 0.42, w: 30, ph: 0 },
      { col: 'dim', a: 0.30, w: 44, ph: 1.4 },
      { col: 'dim', a: 0.18, w: 58, ph: 2.9 },
    ];
    for (const b of bands) {
      for (let s = 0; s < 26; s++) {
        const u = s / 25;                           // 0 baş → 1 kuyruk ucu
        const x = -u * 320;
        const y = wave(x + b.ph * 24);
        const sz = (b.w * (1 - u) + 5) * 0.55;
        ctx.fillStyle = k.rgba(b.col, b.a * (1 - u * 0.75));
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      }
    }

    // parçacıklar: kuyruktan kopup sola sürüklenir (canlı idle)
    for (let i = 0; i < 16; i++) {
      const ph = k.hash(i * 7.31);
      const rate = 0.22 + 0.5 * sp * (0.5 + ph);
      const c = (t * rate + ph) % 1;               // yaşam döngüsü 0→1
      const x = -c * 320 - 10;
      const y = wave(x) + (ph - 0.5) * 60 * c;
      const sz = 2 + ph * 3.5;
      ctx.fillStyle = k.rgba('cyan', 0.8 * (1 - c));
      ctx.beginPath(); ctx.arc(x, y, sz * (1 - c * 0.4), 0, k.TAU); ctx.fill();
    }

    // baş: koma halesi + nabızla parlayan çekirdek (canlı idle)
    const pulse = 0.5 + 0.5 * Math.sin(t * 4.6);
    k.glow(0, 0, 120, 'cyan', 0.30 + 0.18 * pulse);
    ctx.fillStyle = k.rgba('cyan', 0.22);
    ctx.beginPath(); ctx.arc(0, 0, 44, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.30);
    ctx.beginPath(); ctx.arc(0, 0, 33, 0, k.TAU); ctx.fill();
    // çekirdek: dış hat + parlak iç
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.92);
    ctx.beginPath(); ctx.arc(0, 0, 26 - 4, 0, k.TAU); ctx.fill();
    k.glow(0, 0, 44, 'cyan', 0.35 + 0.25 * pulse);
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, -10, 11, 8, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
