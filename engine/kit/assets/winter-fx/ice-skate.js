// winter-fx/ice-skate — buzda kayan patenci (karakter ailesi oranları 1:2.6);
// glide ile buz izi çizgileri, hız çizgileri ve eğim değişir. Sürekli: nefes, sallanma, buz parıltısı.
// NOT: canvas y-aşağıdır; kayış soldan sağa; (0,0) ayaklar/buz çizgisi.
export default {
  name: 'ice-skate', category: 'winter-fx',
  desc: 'Buzda kayan patenci: glide ile uzayan buz izi, hız çizgileri, parlayan buz yüzeyi ve denge sallantısı',
  tags: ['buz pateni', 'paten', 'kayma', 'kış', 'buz', 'ice skate', 'skating', 'glide', 'winter', 'ice'],
  box: [-170, -160, 170, 30],
  bleed: 30,
  anchor: 'ayaklar (0,0); buz çizgisi y=4',
  points: { head: [8, -140], feet: [0, 0], trail: [-120, 4] },
  params: {
    glide: { type: 'number', default: 0.6, desc: '0–1: kayma şiddeti (buz izi uzunluğu, hız çizgileri, eğim)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 10;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const ice = k.rgba('cyan');
    const G = k.clamp(p.glide, 0, 1);
    const br = Math.sin(t * k.TAU / 2.4) * 1.6;                       // nefes
    const lean = 0.07 + 0.10 * G + Math.sin(t * 1.9) * 0.03;           // kayış eğimi + sallanma
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // --- buz yüzeyi ---
    ctx.strokeStyle = inkC; ctx.globalAlpha = 0.35; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-170, 4); ctx.lineTo(170, 4); ctx.stroke();
    ctx.globalAlpha = 1;
    // buz parıltısı (yanıp sönen + işaretler)
    for (let i = 0; i < 7; i++) {
      const h1 = k.hash(i * 23 + 6), h2 = k.hash(i * 47 + 14);
      const x = -160 + h1 * 320, y = 12 + h2 * 10;
      const tw = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 3 + i * 2.7));
      ctx.strokeStyle = ice; ctx.globalAlpha = tw; ctx.lineWidth = 2.5;
      const r = 4 + 3 * h2;
      ctx.beginPath();
      ctx.moveTo(x - r, y); ctx.lineTo(x + r, y);
      ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // --- buz izi (glide ile uzar, geride solar) ---
    const trailLen = 40 + 120 * G;
    for (const [off, wdt] of [[0, 4], [7, 3]]) {
      ctx.strokeStyle = k.rgba('ink', 0.22 + 0.30 * G); ctx.lineWidth = wdt;
      ctx.beginPath();
      ctx.moveTo(-24, 2 + off);
      ctx.quadraticCurveTo(-24 - trailLen * 0.5, 8 + off, -24 - trailLen, 3 + off * 0.6);
      ctx.stroke();
    }

    // --- patenci ---
    ctx.save();
    ctx.rotate(lean);
    const sway = Math.sin(t * 2.6) * 3;

    // bacaklar: biri geride uzanır (kayış), biri altta
    limb(8, -26, -36, -10, 13, body);                 // kayan bacak
    limb(8, -26, 16, -6, 13, body);                   // destek bacağı
    // paten bıçakları
    for (const [bx1, bx2] of [[-52, -30], [4, 26]]) {
      ctx.strokeStyle = line; ctx.lineWidth = 4 + LW * 0.6;
      ctx.beginPath(); ctx.moveTo(bx1, -2); ctx.lineTo(bx2, -2); ctx.stroke();
      ctx.strokeStyle = inkC; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(bx1, -2); ctx.lineTo(bx2, -2); ctx.stroke();
      blob(bx1 + 4, -12, 14, 9, 4, body);             // paten botu
    }

    // gövde (baş:gövde 1:2.6 → baş 40, gövde 104)
    blob(-7, -122 - br * 0.5, 30, 100, 12, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(2, -100 - br * 0.5, 7, 16, -0.2, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(16, -40, 8, 18, -0.2, 0, k.TAU); ctx.fill();

    // kollar (denge için açık)
    const armSway = Math.sin(t * 2.6 + 1) * 4;
    limb(6, -108 - br * 0.5, -34, -96 + armSway, 11, body);   // arka kol
    limb(6, -108 - br * 0.5, 44, -100 - armSway, 11, body);   // ön kol

    // baş + bere
    disc(8, -140 - br * 0.6, 20, 18.5, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(1, -148 - br * 0.6, 7, 5, -0.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(8, -152 - br * 0.6, 21, 12, 0, Math.PI, k.TAU); ctx.fill();
    ctx.fillStyle = inkC; ctx.beginPath(); ctx.ellipse(8, -151 - br * 0.6, 18, 10, 0, Math.PI, k.TAU); ctx.fill();
    disc(8, -164 - br * 0.6, 6, 6, inkC);                    // ponpon
    // yüz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.arc(13, -141 - br * 0.6, 2.6, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -141 - br * 0.6, 2.6, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(10, -134 - br * 0.6, 5, 0.3, Math.PI - 0.6); ctx.stroke();

    ctx.restore();   // patenci dönüşü sonu

    // --- hız çizgileri (glide yüksekse) ---
    if (G > 0.25) {
      ctx.strokeStyle = inkC; ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const yy = -120 + i * 34;
        ctx.globalAlpha = 0.12 + 0.22 * G;
        ctx.beginPath(); ctx.moveTo(-168, yy); ctx.lineTo(-120 - 30 * G, yy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  },
};
