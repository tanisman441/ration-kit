// space-fx-2/solar-flare — güneş patlaması: güneş yüzeyinden döngüsel alev dilleri
// yükselir (idle), `at` anında 1.1 sn dev erüpsiyon fışkırır.
// NOT: canvas y-aşağıdır; (0,0) güneş yüzeyidir, alevler yukarı (y-) yükselir.
export default {
  name: 'solar-flare',
  category: 'space-fx-2',
  desc: 'Güneş patlaması: yüzeyden döngüsel alev dilleri yükselir, anı gelince dev patlama',
  tags: ['güneş', 'patlama', 'alev', 'korona', 'erüpsiyon', 'yüzey', 'solar', 'flare', 'sun', 'eruption', 'corona', 'prominence'],
  box: [-150, -170, 150, 70],
  bleed: 50,
  anchor: 'güneş yüzeyi (0,0)',
  points: { limb: [0, 0], corona: [0, -110] },
  params: {
    at: { type: 'time', default: null, desc: 'büyük patlama anı: 1.1 sn dev alev fışkırır' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    const LW = 300 * S;   // yüzey genişliği
    const simmer = 0.7 + 0.3 * k.noise1(t * 5);                 // idle yüzey kaynaması

    // --- güneş yüzeyi: alt kenarda kalan sığ disk (limb eğrisi) ---
    ctx.fillStyle = k.rgba('yellow', 0.95);
    ctx.beginPath(); ctx.ellipse(0, 40 * S, LW * 0.62, 50 * S, 0, 0, Math.PI); ctx.fill();
    // yüzey granülasyonu: idle kaynayan kabarcıklar
    for (let i = 0; i < 12; i++) {
      const hx = k.hash(i * 7 + 91), hy = k.hash(i * 13 + 97);
      const x = (hx - 0.5) * LW * 0.95;
      const y = 8 * S + 10 * S * (0.5 + 0.5 * k.noise1(t * 3.4 + i * 2));
      const r = (6 + 10 * hy) * S * simmer;
      ctx.fillStyle = k.rgba('red', 0.28 + 0.2 * simmer);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.35);
      ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, k.TAU); ctx.fill();
    }
    // yüzey parlaması
    k.glow(0, -10 * S, 130 * S, k.col('yellow'), 0.35 * simmer);

    // --- döngüsel alev dilleri (idle): her dil kendi periyodunda yükselip söner ---
    const N = 9;
    for (let i = 0; i < N; i++) {
      const h1 = k.hash(i * 7 + 101), h2 = k.hash(i * 13 + 113), h3 = k.hash(i * 29 + 127);
      const cyc = 1.6 + h2 * 1.2;                              // 1.6–2.8 sn döngü
      const ph = (t + h3 * cyc) % cyc / cyc;
      const rise = Math.sin(Math.PI * ph);                     // yükselip sönümlenme
      const maxH = (55 + 85 * h1) * S;
      const x = (h1 - 0.5) * LW * 0.9 + k.noise1(t * 6 + i * 4) * 10 * S;
      const lean = (h3 - 0.5) * 40 * S * rise;                 // yana eğilme
      const w = (10 + 8 * h2) * S * rise;
      if (rise < 0.05) continue;
      // alev dili: kırmızı dış, sarı iç
      ctx.fillStyle = k.rgba('red', 0.75 * rise);
      ctx.beginPath();
      ctx.moveTo(x - w, 6 * S);
      ctx.quadraticCurveTo(x - w * 0.4 + lean * 0.4, -maxH * rise * 0.55, x + lean, -maxH * rise);
      ctx.quadraticCurveTo(x + w * 0.4 + lean * 0.4, -maxH * rise * 0.55, x + w, 6 * S);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.85 * rise);
      ctx.beginPath();
      ctx.moveTo(x - w * 0.5, 6 * S);
      ctx.quadraticCurveTo(x - w * 0.2 + lean * 0.4, -maxH * rise * 0.4, x + lean, -maxH * rise * 0.8);
      ctx.quadraticCurveTo(x + w * 0.2 + lean * 0.4, -maxH * rise * 0.4, x + w * 0.5, 6 * S);
      ctx.closePath(); ctx.fill();
      k.glow(x + lean * 0.6, -maxH * rise * 0.5, 34 * S * rise, k.col('yellow'), 0.3 * rise);
    }

    // --- büyük erüpsiyon: at anından 1.1 sn ---
    if (d >= 0 && d < 1.1) {
      const e = k.prog(d, 0, 1.1);
      const EH = 190 * S;
      k.glow(0, -EH * e * 0.5, (80 + 140 * e) * S, k.col('yellow'), 0.5 * (1 - e));
      // dev alev sütunu
      const wob = k.noise1(t * 14) * 22 * S;
      ctx.fillStyle = k.rgba('red', 0.85 * (1 - e * 0.6));
      ctx.beginPath();
      ctx.moveTo(-44 * S, 4 * S);
      ctx.quadraticCurveTo(-30 * S + wob * 0.4, -EH * e * 0.55, wob, -EH * e);
      ctx.quadraticCurveTo(30 * S + wob * 0.4, -EH * e * 0.55, 44 * S, 4 * S);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - e * 0.5));
      ctx.beginPath();
      ctx.moveTo(-22 * S, 4 * S);
      ctx.quadraticCurveTo(-15 * S + wob * 0.4, -EH * e * 0.42, wob, -EH * e * 0.85);
      ctx.quadraticCurveTo(15 * S + wob * 0.4, -EH * e * 0.42, 22 * S, 4 * S);
      ctx.closePath(); ctx.fill();
      // savrulan kıvılcımlar
      for (let i = 0; i < 20; i++) {
        const h1 = k.hash(i * 7 + 131), h2 = k.hash(i * 13 + 137), h3 = k.hash(i * 29 + 149);
        const ang = -Math.PI / 2 + (h1 - 0.5) * 2.4;
        const r = (40 + d * (140 + 160 * h2)) * S;
        const life = 1 - k.prog(d, 0.35, 1.1);
        if (life <= 0) continue;
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r;
        const sz = (2 + 4 * h3) * S * life;
        ctx.fillStyle = k.rgba(life > 0.45 ? 'yellow' : 'red', 0.9 * life);
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      }
      // sol üst parlama (premium finish, alfa 0.10)
      ctx.fillStyle = k.rgba('bg', 0.10 * (1 - e));
      ctx.beginPath(); ctx.ellipse(-LW * 0.3, -30 * S, 60 * S, 22 * S, -0.3, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
