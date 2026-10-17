// characters/hacker — kapüşonlu figür, laptop başında; karanlık hacker havası.
// NOT: canvas y-aşağıdır; zemin (0,0), yukarı NEGATİF y'dir. Figür sağa bakar.
export default {
  name: 'hacker',
  category: 'characters',
  desc: 'Kapüşonlu hacker; laptop başında oturur, active anında hızlı yazma patlaması yapar',
  tags: ['hacker', 'bilgisayar korsanı', 'kapüşon', 'laptop', 'kod', 'siber', 'hooded', 'cyber', 'coder', 'dark'],
  box: [-180, -292, 170, 12],
  bleed: 0,
  anchor: 'zemin (0,0); sahne merkezi',
  points: { screen: [50, -215], head: [-105, -256] },
  params: {
    color: { type: 'color', default: 'dim' },
    active: { type: 'time', default: null, desc: 'yazma patlaması: eller sekme, ekran titreme' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const deskC = k.rgba('panel2');
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // yazma patlaması
    const d = p.active == null ? -1 : t - p.active;
    const burst = d >= 0 && d < 0.6 ? Math.sin((d / 0.6) * Math.PI) : 0;
    const typeJit = (i) => burst > 0 ? Math.sin(t * 40 + i * 2.4) * 4 * burst : 0;
    const br = Math.sin(t * k.TAU / 2.4) * 1.5;

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

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(-10, -5, 165, 10, 0, 0, k.TAU); ctx.fill();

    // sandalye + masa (gamer düzeni)
    blob(-158, -196, 18, 104, 9, deskC);
    blob(-156, -100, 74, 16, 8, deskC);
    limb(-140, -88, -140, -8, 12, deskC);
    limb(-100, -88, -100, -8, 12, deskC);
    blob(-150, -118, 300, 18, 6, deskC);
    limb(-132, -100, -132, -8, 14, deskC);
    limb(132, -100, 132, -8, 14, deskC);

    // laptop: klavye + ekran (kod)
    blob(-122, -130, 92, 13, 6, k.rgba('panel'));
    blob(38, -118, 44, 10, 5, deskC);
    blob(54, -172, 16, 56, 6, deskC);
    blob(-16, -262, 148, 94, 10, k.rgba('panel'));
    const sx = -8, sy = -254, sw = 132, sh = 78;
    ctx.fillStyle = k.rgba('bg', 0.88);
    ctx.beginPath(); k.rrect(sx, sy, sw, sh, 6); ctx.fill();
    // kod satırları (yeşil, Matrix havası)
    const flick = burst > 0 ? (k.hash(Math.floor(t * 24)) - 0.5) * 0.3 : 0;
    for (let i = 0; i < 5; i++) {
      const yy = sy + 10 + i * 13;
      const ww = (sw - 24) * (0.35 + k.hash(i * 7 + 2) * 0.55);
      ctx.fillStyle = k.rgba('green', 0.55 + flick + (i === 4 ? 0.25 : 0));
      ctx.beginPath(); k.rrect(sx + 10, yy, ww, 7, 3.5); ctx.fill();
    }
    k.glow(sx + sw / 2, sy + sh / 2, 60, 'green', 0.12 + burst * 0.25);
    // ekran ışığının masaya yansıması
    k.glow(58, -112, 70, 'green', 0.10 + burst * 0.15);

    // figür — öne eğik, kapüşonlu
    const hipX = -115, hipY = -104;
    limb(hipX, hipY, -62, -100, 20, body);
    limb(-62, -100, -58, -14, 18, body);
    blob(-70, -13, 26, 13, 6, body);
    // gövde (öne eğik)
    blob(hipX - 34, -206 - br * 0.4, 62, 106, 26, body);
    // kollar: klavyede, patlamada seker
    const shoX = -108, shoY = -186 - br * 0.4;
    const hY = -126 + typeJit(1), hY2 = -126 + typeJit(5);
    limb(shoX, shoY, -84, -150, 17, body);
    limb(-84, -150, -68, hY, 15, body);
    disc(-66, hY, 9, 9, body);
    limb(shoX + 8, shoY, -36, -148, 17, body);
    limb(-36, -148, 16, hY2, 15, body);
    disc(18, hY2, 9, 9, body);

    // kapüşon: büyük koyu başlık + gölgeli yüz
    const hx = -100, hy = -236 - br * 0.5;
    disc(hx, hy, 40, 42, dark);                       // kapüşon dışı
    // yüz boşluğu (gölge)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.ellipse(hx + 8, hy + 4, 23, 25, 0, 0, k.TAU); ctx.fill();
    // parlayan gözler (yeşil vurgu)
    const blink = ((t + 0.7) % 3.8) < 0.14 ? 0.25 : 1;
    k.glow(hx + 6, hy + 2, 20, 'green', 0.5);
    k.glow(hx + 20, hy + 2, 20, 'green', 0.5);
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath(); ctx.ellipse(hx + 6, hy + 2, 4.5, 4.5 * blink, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 20, hy + 2, 4.5, 4.5 * blink, 0, 0, k.TAU); ctx.fill();
    // kapüşon parlaması (premium, sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.ellipse(hx - 16, hy - 20, 14, 10, -0.4, 0, k.TAU); ctx.fill();

    // patlama anında tuş vuruş çizgileri
    if (burst > 0.35) {
      ctx.strokeStyle = k.rgba('green', burst * 0.9); ctx.lineWidth = 3;
      for (const [lx, ly, i] of [[-66, hY - 16, 1], [18, hY2 - 16, 5]]) {
        const o = typeJit(i) * 0.6;
        ctx.beginPath(); ctx.moveTo(lx - 6, ly + o); ctx.lineTo(lx + 6, ly + o); ctx.stroke();
      }
    }
  },
};
