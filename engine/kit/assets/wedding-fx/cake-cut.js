// wedding-fx/cake-cut — üç katlı düğün pastası: çift bıçağı birlikte tutar, at anında pasta kesilir.
// NOT: canvas y-aşağıdır; (0,0) pasta standının tabanı, bıçak yukarıdan (negatif y) aşağı iner.
export default {
  name: 'cake-cut', category: 'wedding-fx',
  desc: 'Üç katlı düğün pastası: çift bıçağı birlikte tutar, at anında bıçak pastayı keser',
  tags: ['pasta', 'düğün', 'kesmek', 'bıçak', 'kutlama', 'cake', 'wedding', 'cut', 'knife', 'celebration'],
  box: [-190, -320, 190, 40],
  bleed: 50,
  anchor: 'pasta standının tabanı (0,0); bıçak sağ üstten gelir',
  points: { knife: [96, -190], cake: [0, -140], topper: [0, -300] },
  params: {
    at: { type: 'time', default: null, desc: 'bıçağın pastayı kestiği an' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const frost = k.rgba('panel2');
    const skin = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;
    // mum alevi titremesi (canlı idle)
    const flick = 1 + 0.25 * k.noise1(t * 6) + 0.1 * Math.sin(t * 11);

    // stand: taban + sap + tabak
    blob(-120, -16, 240, 14, 8, k.rgba('dim'));
    blob(-14, -70, 28, 58, 10, k.rgba('dim'));
    blob(-140, -84, 280, 14, 8, k.rgba('dim'));

    // kesim: at'tan sonra dilim sağa ayrılır
    const cutP = d < 0 ? 0 : k.prog(d, 0, 0.5);
    const sliceX = cutP * cutP * (3 - 2 * cutP) * 26;
    const sliceTilt = cutP * 0.12;

    // üç kat (alttan üste): dilim sağ kenardan ayrılır
    // alt kat
    blob(-110, -164, 220, 80, 16, frost);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(70, -130, 34, 26, 0, 0, k.TAU); ctx.fill();
    // orta kat
    blob(-82, -236, 164, 72, 14, frost);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(52, -206, 26, 20, 0, 0, k.TAU); ctx.fill();
    // üst kat
    blob(-56, -296, 112, 60, 12, frost);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(36, -272, 18, 16, 0, 0, k.TAU); ctx.fill();

    // kat araları süs çizgileri (tek vurgu rengi: red — gül şeritleri, her katın kendi genişliğinde)
    ctx.strokeStyle = k.rgba('red', 0.85); ctx.lineWidth = 5;
    const stripes = [[-168, -104, 104], [-240, -78, 78], [-300, -52, 52]];
    for (const [y, x1, x2] of stripes) {
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
    }
    // gül noktaları
    for (let i = 0; i < 5; i++) {
      const gx = -80 + i * 40;
      disc(gx, -168, 7, 7, k.rgba('red'));
    }
    for (let i = 0; i < 4; i++) {
      const gx = -60 + i * 40;
      disc(gx, -240, 6, 6, k.rgba('red'));
    }

    // ayrılan dilim (üst katın sağ parçası)
    if (cutP > 0) {
      ctx.save();
      ctx.translate(sliceX, 0); ctx.rotate(sliceTilt);
      blob(28, -296, 30, 60, 10, k.rgba('yellow'));
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.beginPath(); ctx.moveTo(30, -292); ctx.lineTo(56, -292); ctx.stroke();
      ctx.restore();
    }

    // üst süs: iki kalp (çift figürü yerine)
    ctx.fillStyle = k.rgba('red');
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.translate(s * 16, -318); ctx.scale(0.9, 0.9);
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.bezierCurveTo(-12, -6, -6, -16, 0, -8);
      ctx.bezierCurveTo(6, -16, 12, -6, 0, 8);
      ctx.fill();
      ctx.restore();
    }

    // mumlar (üst katın iki yanında) + titreyen alevler
    for (const s of [-1, 1]) {
      const cx = s * 44;
      blob(cx - 3, -318, 6, 22, 3, k.rgba('yellow'));
      const fy = -330 - 4 * flick;
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath(); ctx.ellipse(cx, fy, 5, 8 * flick, 0, 0, k.TAU); ctx.fill();
      k.glow(cx, fy, 16 * flick, 'yellow', 0.35);
    }

    // bıçak + iki el (sağ üstten): at'ta 0.4 sn'de aşağı iner ve keser
    const press = d < 0 ? 0 : k.prog(d, 0, 0.4);
    const pressE = press * press * (3 - 2 * press);
    const kY = -186 + pressE * 46; // bıçak ucu pastaya girer
    const kX = 96;
    // bıçak: sap + ağız (ağız dim, sap ink)
    ctx.save();
    ctx.translate(kX, kY); ctx.rotate(0.5);
    blob(-8, -58, 16, 42, 8, k.rgba('ink')); // sap
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-7, -16); ctx.lineTo(7, -16); ctx.lineTo(2, 62); ctx.lineTo(-7, 62);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath();
    ctx.moveTo(-4, -14); ctx.lineTo(4, -14); ctx.lineTo(1, 58); ctx.lineTo(-4, 58);
    ctx.closePath(); ctx.fill();
    // bıçak parlaması (boşta periyodik)
    const glint = (t % 3.5);
    if (glint < 0.2) {
      ctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - glint / 0.2)})`;
      ctx.beginPath(); ctx.ellipse(0, 20, 3, 16, 0.1, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
    // iki el bıçak sapını tutar (üst üste)
    limb(150, -268, 104, -226, 22, skin);
    disc(100, -222, 20, 14, skin);
    limb(168, -238, 116, -206, 20, skin);
    disc(112, -202, 19, 13, skin);

    // at anı: kesim parlaması + kırıntı saçılması
    if (d >= 0 && d < 0.8) {
      const f = 1 - d / 0.8;
      k.glow(56, -250, 46 * f, 'yellow', 0.4 * f);
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 3 + 21), h2 = k.hash(i * 5 + 23);
        const px = 56 + (h1 - 0.5) * 90 * d;
        const py = -250 + d * 60 * h2;
        ctx.fillStyle = k.rgba('yellow', 0.85 * f);
        ctx.beginPath(); ctx.ellipse(px, py, 4, 3, h1 * k.TAU, 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -150, 26, 18, -0.3, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-60, -224, 18, 14, -0.3, 0, k.TAU); ctx.fill();
  },
};
