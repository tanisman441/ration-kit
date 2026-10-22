// superhero-fx/hero-landing — klasik kahraman inişi: diz üstü çökmüş figür, yumruk yerde.
// NOT: canvas y-aşağıdır; (0,0) yumruğun yere değdiği nokta, zemin y=0.
export default {
  name: 'hero-landing', category: 'superhero-fx',
  desc: 'Klasik kahraman inişi pozu: at anında toz bulutu ve şok dalgası patlar',
  tags: ['iniş', 'kahraman', 'diz', 'toz', 'şok', 'dalga', 'landing', 'hero', 'dust', 'shockwave'],
  box: [-205, -215, 205, 35],
  bleed: 70,
  anchor: 'yumruğun yere değdiği nokta (0,0)',
  points: { fist: [0, -4], head: [-45, -155], ground: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'iniş anı (toz bulutu + şok dalgası, 0.6 sn)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const br = Math.sin(t * 2.6) * 2.2;   // idle nefes
    ctx.save();
    ctx.lineCap = 'round';

    // ---- iniş olayı: at anı (0.6 sn) ----
    if (d >= 0 && d <= 0.85) {
      const g = k.prog(d, 0, 0.65);

      // 1) zemin çatlakları — (0,0)'dan dışa
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 3 + 81), h2 = k.hash(i * 7 + 83);
        const a = Math.PI * (0.08 + h1 * 0.84);        // aşağı yarım daire
        const len = (50 + h2 * 90) * k.E.outCubic(g);
        ctx.strokeStyle = k.rgba('ink', 0.55 * (1 - g));
        ctx.lineWidth = 5 - h2 * 2.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 8, -Math.sin(a) * 8 * 0.3);
        ctx.lineTo(Math.cos(a) * len, -Math.sin(a) * len * 0.3 - 2);
        ctx.stroke();
      }

      // 2) şok dalgası — zeminde genişleyen elips halkalar
      for (let r = 0; r < 2; r++) {
        const rr = d - r * 0.11;
        if (rr < 0) continue;
        const g2 = k.prog(rr, 0, 0.6);
        const rx = (50 + 195 * k.E.outExpo(g2));
        ctx.strokeStyle = r === 0 ? k.rgba('yellow', 0.7 * (1 - g2)) : k.rgba('dim', 0.5 * (1 - g2));
        ctx.lineWidth = 9 * (1 - g2 * 0.6) + 2;
        ctx.beginPath(); ctx.ellipse(0, -6, rx, rx * 0.26, 0, 0, k.TAU); ctx.stroke();
      }

      // 3) toz bulutu — dim puflar
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 5 + 85), h2 = k.hash(i * 11 + 87);
        const side = i % 2 === 0 ? 1 : -1;
        const e = k.E.outCubic(k.prog(d, 0.04, 0.7));
        const x = side * (30 + h1 * 190) * e;
        const y = -(8 + h2 * 46) * e - 4;
        const rad = (12 + h2 * 26) * (0.5 + e * 0.8);
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - k.prog(d, 0.04, 0.7)));
        ctx.beginPath(); ctx.arc(x, y, rad, 0, k.TAU); ctx.fill();
      }

      // 4) iniş çakması
      if (d < 0.14) {
        const f = 1 - d / 0.14;
        k.glow(0, -10, 90 * f, 'yellow', 0.45 * f);
      }
    }

    // ---- figür (çömelme pozu) ----
    const col = k.rgba(p.color);
    const LW = 30;
    const S = [-25, -132 + br * 0.5];   // omuz
    const H = [-70, -85];               // kalça

    // arka bacak (diz yerde): kalça -> diz -> ayak
    ctx.strokeStyle = col; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.moveTo(H[0], H[1]);
    ctx.lineTo(-112, -10); ctx.lineTo(-152, -6); ctx.stroke();
    // ön bacak (ayak basılı): kalça -> diz -> ayak
    ctx.beginPath(); ctx.moveTo(H[0], H[1]);
    ctx.lineTo(28, -62); ctx.lineTo(72, -8); ctx.stroke();
    // ön ayak tabanı
    ctx.beginPath(); k.rrect(38, -16, 66, 14, 7); ctx.fillStyle = col; ctx.fill();
    // gövde: kalça -> omuz (öne eğik)
    ctx.beginPath(); ctx.moveTo(H[0], H[1]); ctx.lineTo(S[0], S[1]); ctx.stroke();
    // arka kol (geride, bükük)
    ctx.beginPath(); ctx.moveTo(S[0], S[1]);
    ctx.lineTo(-78, -98); ctx.lineTo(-118, -66); ctx.stroke();
    // ön kol: omuz -> yumruk (yere değiyor)
    ctx.beginPath(); ctx.moveTo(S[0], S[1]); ctx.lineTo(-8, -18); ctx.stroke();

    // yumruk (yere değen)
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, -14, 19, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, -14, 19, 0, k.TAU); ctx.stroke();

    // kafa
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(-45, -158 + br * 0.3, 30, 0, k.TAU); ctx.fill();
    // premium: sol üst parlama (kafada)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-56, -170 + br * 0.3, 13, 7, -0.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(-45, -158 + br * 0.3, 30, 0, k.TAU); ctx.stroke();
    // kararlı göz çizgisi (ink iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-34, -160 + br * 0.3); ctx.lineTo(-20, -162 + br * 0.3); ctx.stroke();

    // idle: havada süzülen toz zerreleri
    for (let i = 0; i < 6; i++) {
      const h1 = k.hash(i * 17 + 89), h2 = k.hash(i * 23 + 91);
      const x = -150 + h1 * 300 + k.noise1(i * 3 + t * 0.7) * 8;
      const y = -30 - h2 * 130 + k.noise1(i * 5 + t * 0.5) * 6;
      ctx.fillStyle = k.rgba('dim', 0.25 + 0.1 * Math.sin(t * 2 + i));
      ctx.beginPath(); ctx.arc(x, y, 2.5 + h2 * 2, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
