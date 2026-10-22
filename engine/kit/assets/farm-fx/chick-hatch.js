// farm-fx/chick-hatch — yumurtadan çıkan civciv, önden görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) yumurta tabanıdır.
export default {
  name: 'chick-hatch', category: 'farm-fx',
  desc: 'Yumurtadan çıkan civciv; at anında kabuk çatlar, üst kapak fırlar, civciv başını çıkarır',
  tags: ['civciv', 'yumurta', 'kuluçka', 'çiftlik', 'kuş', 'chick', 'hatch', 'egg', 'farm'],
  box: [-105, -160, 105, 15],
  bleed: 60,
  anchor: 'yumurta tabanı (0,0)',
  points: { top: [0, -125], chick: [0, -72] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'kırılma anı — kabuk çatlar, üst kapak fırlar, civciv çıkar (1 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const shell = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const chickC = k.rgba('yellow'), beakC = k.rgba('yellow');
    const df = p.at == null ? -1 : t - p.at;
    const near = df < 0 && df > -0.6;                         // kırılma öncesi bekleyiş
    const hatching = df >= 0 && df < 1.0;                    // kırılma olayı
    const done = df >= 1.0;                                  // civciv çıktı
    const emerged = hatching ? 1 - Math.pow(1 - Math.min(df / 0.6, 1), 3) : (done ? 1 : 0);
    const wob = near ? Math.sin(t * k.TAU * 9) * 0.10         // bekleyişte hızlı titreme
      : Math.sin(t * k.TAU * 2.2) * 0.05;                    // idle sallantı
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const jag = (x0, y0, x1, y1, segs, jagAmt, seed, c, w, alpha) => {  // zigzag çatlak çizgisi
      ctx.strokeStyle = c; ctx.lineWidth = w; ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.moveTo(x0, y0);
      for (let i = 1; i <= segs; i++) {
        const f = i / segs;
        const off = (k.hash(seed + i * 3) - 0.5) * 2 * jagAmt;
        ctx.lineTo(x0 + (x1 - x0) * f + off, y0 + (y1 - y0) * f + off * 0.4);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    };

    // saman yuva
    ctx.strokeStyle = k.rgba('yellow', 0.65); ctx.lineWidth = 4;
    for (let i = 0; i < 7; i++) {
      const gx = -52 + i * 17;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.quadraticCurveTo(gx + 6, -12, gx + 14, -14); ctx.stroke();
    }

    ctx.save();
    ctx.rotate(wob);

    // yumurta alt kabuğu (her zaman)
    disc(0, -50, 55, 60, shell);
    // yumurta parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, -88, 16, 22, -0.3, 0, k.TAU); ctx.fill();

    // çatlaklar (olayda belirginleşir)
    const crackA = hatching || done ? 0.85 : 0.35;
    jag(-38, -72, 30, -66, 7, 8, 41, inkC, 3.5, crackA);
    jag(-10, -96, 34, -58, 6, 7, 57, inkC, 3, crackA * 0.8);

    ctx.restore();

    // üst kapak (olayda fırlar, sonra düşer)
    if (!done) {
      const ce = hatching ? 1 - Math.pow(1 - Math.min(df / 0.55, 1), 3) : 0;
      const fall = hatching && df > 0.55 ? (df - 0.55) * 130 : 0;
      ctx.save();
      ctx.translate(ce * 26, -ce * 70 + fall);
      ctx.rotate(ce * 1.1 + (fall > 0 ? fall * 0.02 : 0));
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, -98, 40, 26, 0, Math.PI, k.TAU); ctx.fill();
      ctx.fillStyle = shell;
      ctx.beginPath(); ctx.ellipse(0, -98, 36, 22, 0, Math.PI, k.TAU); ctx.fill();
      ctx.restore();
    }

    // kabuk parçacıkları (olayda fırlar)
    if (hatching) {
      for (let i = 0; i < 4; i++) {
        const e = Math.min(df / 0.7, 1);
        const dx = (k.hash(i * 19 + 7) - 0.5) * 130 * e;
        const dy = -90 - e * (60 + k.hash(i * 19 + 9) * 50) + e * e * 120;
        ctx.save(); ctx.translate(dx, dy); ctx.rotate(k.hash(i * 19 + 12) * k.TAU + e * 3);
        ctx.fillStyle = line; ctx.beginPath();
        ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.lineTo(0, -11); ctx.closePath(); ctx.fill();
        ctx.fillStyle = shell; ctx.beginPath();
        ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.lineTo(0, -8); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    // civciv (olayda belirir)
    if (emerged > 0) {
      const cy = -52 - 34 * emerged + (done ? Math.sin(t * k.TAU * 1.8) * 2.5 : 0);
      const cx = (done ? Math.sin(t * k.TAU * 0.9) * 2 : 0);
      const flap = hatching ? Math.sin(df * k.TAU * 6) * 0.5 : Math.sin(t * k.TAU * 1.8) * 0.08;
      // mini kanatlar
      for (const s of [-1, 1]) {
        ctx.save(); ctx.translate(cx + s * 26, cy + 4); ctx.rotate(s * (0.5 + flap * s));
        ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 0, 12, 8, 0, 0, k.TAU); ctx.fill();
        ctx.fillStyle = chickC; ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, k.TAU); ctx.fill();
        ctx.restore();
      }
      disc(cx, cy - 6, 30, 28, chickC);                      // tüy topu
      // baş tüyü
      ctx.strokeStyle = line; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(cx - 4, cy - 34); ctx.lineTo(cx - 8, cy - 44); ctx.stroke();
      ctx.strokeStyle = chickC; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(cx - 4, cy - 34); ctx.lineTo(cx - 8, cy - 44); ctx.stroke();
      // yüz (aile dili)
      const tb = t % 3.8;
      const eyeH = tb < 0.12 ? 0.6 : 3.6;
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.ellipse(cx - 9, cy - 12, 3.2, eyeH, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 9, cy - 12, 3.2, eyeH, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line;                                   // gaga
      ctx.beginPath(); ctx.moveTo(cx - 6, cy - 2); ctx.lineTo(cx + 6, cy - 2); ctx.lineTo(cx, cy + 8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = beakC;
      ctx.beginPath(); ctx.moveTo(cx - 4, cy - 2); ctx.lineTo(cx + 4, cy - 2); ctx.lineTo(cx, cy + 5); ctx.closePath(); ctx.fill();
      // parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - 12, cy - 24, 10, 7, -0.4, 0, k.TAU); ctx.fill();
    }
  },
};
