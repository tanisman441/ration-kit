// winter-fx/igloo-wind — iglo ve rüzgar: sürekli esen rüzgar çizgileri, savrulan kar taneleri,
// kapıdan sızan titrek sıcak ışık; gust anında 0.8 sn şiddetli esinti.
// NOT: canvas y-aşağıdır; rüzgar soldan sağa eser; (0,0) iglo taban merkezidir.
export default {
  name: 'igloo-wind', category: 'winter-fx',
  desc: 'İglo: blok desenli kubbe, kapıdan sızan titrek sıcak ışık, sürekli esen rüzgar çizgileri ve savrulan kar; gust anında fırtına',
  tags: ['iglo', 'rüzgar', 'kış', 'kar', 'fırtına', 'barınak', 'igloo', 'wind', 'winter', 'snow', 'storm', 'shelter'],
  box: [-195, -155, 195, 60],
  bleed: 40,
  anchor: 'iglo taban merkezi (0,10)',
  points: { door: [32, -12], top: [0, -72], centre: [0, 0] },
  params: {
    gust: { type: 'time', default: null, desc: 'şiddetli esinti anı (0.8 sn: çizgiler kalınlaşır, kar savrulur, ışık parlar)' },
    wind: { type: 'number', default: 0.5, desc: '0–1: sürekli rüzgar şiddeti' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 11;
    const snow = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const warm = k.rgba('yellow');
    const W = k.clamp(p.wind, 0, 1);
    const d = p.gust == null ? -1 : t - p.gust;
    const genv = (d >= 0 && d < 0.8) ? Math.sin(k.clamp(d / 0.8, 0, 1) * Math.PI) : 0;
    const shake = genv * k.noise1(t * 30) * 1.5;   // gust'ta iglo hafif titrer
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- zemin karı ---
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 34, 170, 20, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(0, 32, 166, 17, 0, 0, k.TAU); ctx.fill();

    // --- rüzgar çizgileri (iglonun arkasında, sürekli akar) ---
    for (let i = 0; i < 4; i++) {
      const y0 = -118 + i * 42;
      const ph = t * (2 + 5 * W + 7 * genv) + i * 1.9;
      ctx.strokeStyle = k.rgba('ink', 0.20 + 0.14 * W + 0.30 * genv);
      ctx.lineWidth = (3 + 2 * W + 7 * genv);
      ctx.beginPath();
      for (let x = -195; x <= 195; x += 13) {
        const y = y0 + 8 * Math.sin(x * 0.03 + ph);
        if (x <= -195 + 13) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(shake, 0);

    // --- kubbe ---
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 10, 88 + LW / 2, Math.PI, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-88 - LW / 2, 10 - LW / 2, 176 + LW, 12 + LW, 6); ctx.fill();
    ctx.fillStyle = snow;
    ctx.beginPath(); ctx.arc(0, 10, 88, Math.PI, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-88, 10, 176, 12, 6); ctx.fill();

    // blok derzleri (iç çizgiler, ink alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const rr of [30, 55, 78]) {
      ctx.beginPath(); ctx.arc(0, 10, rr, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    }
    for (let i = -2; i <= 2; i++) {
      const a = Math.PI + (i + 2.5) * Math.PI / 5.4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 30, 10 + Math.sin(a) * 30);
      ctx.lineTo(Math.cos(a) * 82, 10 + Math.sin(a) * 82);
      ctx.stroke();
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -38, 26, 13, -0.5, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(44, -16, 28, 14, -0.5, 0, k.TAU); ctx.fill();

    // --- kapı tüneli + sıcak ışık ---
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(8 - LW / 2, -34 - LW / 2, 48 + LW, 46 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('bg'); ctx.beginPath(); k.rrect(8, -34, 48, 46, 8); ctx.fill();
    const flick = 0.55 + 0.25 * k.noise1(t * 6 + 1) + 0.35 * genv;   // ışık titremesi
    ctx.fillStyle = k.rgba('yellow', k.clamp(flick, 0, 1));
    ctx.beginPath(); ctx.ellipse(32, -12, 13, 15, 0, 0, k.TAU); ctx.fill();
    if (flick > 0.5) k.glow(32, -12, 26, 'yellow', 0.30 * flick);
    // kapı eşiği karı
    ctx.fillStyle = snow; ctx.beginPath(); ctx.ellipse(32, 10, 26, 7, 0, 0, k.TAU); ctx.fill();

    ctx.restore();   // iglo titremesi sonu

    // --- savrulan kar taneleri ---
    const n = 10 + Math.round(8 * W + 8 * genv);
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 31 + 8), h2 = k.hash(i * 57 + 19);
      const sp = 70 + 170 * W + 260 * genv;
      const span = 390;
      const xx = -195 + ((t * sp + h1 * span) % span);
      const yy = -130 + h2 * 160 + Math.sin(t * 4 + i * 2.3) * (8 + 14 * W + 18 * genv);
      ctx.fillStyle = k.rgba('ink', 0.30 + 0.35 * (W + genv) * 0.5);
      ctx.beginPath(); ctx.arc(xx, yy, 2 + 3.4 * h2, 0, k.TAU); ctx.fill();
    }

    // --- gust'ta hız çizgisi patlaması ---
    if (genv > 0.15) {
      ctx.strokeStyle = k.rgba('ink', 0.5 * genv); ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 43 + 21), yy = -110 + h * 130;
        const x0 = -150 + genv * 260 * (0.6 + 0.7 * h);
        ctx.beginPath(); ctx.moveTo(x0 - 70 * genv, yy); ctx.lineTo(x0, yy + 4); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
