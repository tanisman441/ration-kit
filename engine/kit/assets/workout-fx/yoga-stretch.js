// workout-fx/yoga-stretch — yana esneyen yoga figürü, önden görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'yoga-stretch',
  category: 'workout-fx',
  desc: 'Yana esneyen yoga figürü (önden); tekrarla gövde sola eğilip kol baş üstünden uzar',
  tags: ['yoga', 'esneme', 'esneme hareketi', 'yoga', 'stretch', 'stretching', 'esneklik', 'flexibility', 'sakin'],
  box: [-125, -350, 125, 16],
  bleed: 30,
  anchor: 'ayaklar (0,0); mat zeminde, boy ~290 birim',
  points: { head: [0, -250], stretchHand: [-80, -296], feet: [0, 0], mat: [0, -4] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    rep: { type: 'time', default: null, desc: 'esneme döngüsünün başlangıcı — yana eğilme (1.5 sn); null ise dik duruş' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
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
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };
    const br = Math.sin(t * k.TAU / 3.6) * 3;              // derin yoga nefesi (canlı idle)
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma

    // tekrar fazı: eğil (0–0.6) → tut → dön (0.9–1.4)
    const d = p.rep == null ? -1 : t - p.rep;
    let lean = 0;                                         // 0: dik, 1: tam yana eğilme
    if (d >= 0 && d <= 1.5) lean = sstep(0, 0.6, d) - sstep(0.9, 1.4, d);
    const leanX = -48 * lean;                             // sola eğilme
    const xoff = (y) => leanX * k.clamp((-130 - y) / 130, 0, 1.15);  // kalçadan yukarı kayma

    // yoga matı
    blob(-78, -9, 156, 10, 5, k.rgba('panel2'));
    ctx.strokeStyle = k.rgba('ink', 0.25); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-52, -4); ctx.lineTo(52, -4); ctx.stroke();

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -11, 58, 8, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;
    // bacaklar
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 15, -16, 20, body);
      blob(s * 15 - 12, -13, 24, 13, 6, body);
    }

    // gövde (eğilmeyle kayar)
    const tx = xoff(-200);
    blob(-31 + tx, -240 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17 + tx, -196, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-15 + tx, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();

    // kollar: sol kol yanda, sağ kol baş üstünden sola uzar
    const shoX = xoff(shoY);
    limb(-29 + shoX, shoY, -37, -134, 18, body);
    disc(-37, -134, 10, 10, body);
    const shx = 29 + shoX, shy = shoY;
    const hhx = 37 + (leanX * 1.5 - 8 - 37) * lean;        // boşta yanda, esnerken baş üstünden sola
    const hhy = -134 + (-296 - br * 0.4 + 134) * lean;
    const ex = (shx + hhx) / 2 + 12 * lean, ey = (shy + hhy) / 2 - 8 * lean;
    limb(shx, shy, ex, ey, 18, body);
    limb(ex, ey, hhx, hhy, 15, body);
    disc(hhx, hhy, 10, 10, body);

    // baş
    const hy = -250 - br * 0.6, hx = xoff(hy);
    disc(hx, hy, 36, 34, body);
    const ey2 = hy - 2, ex2 = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(hx + s * ex2, ey2 + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(hx + s * ex2, ey2, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(hx, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(hx, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(hx, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(hx - 8, hy + 12); ctx.lineTo(hx + 8, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // nefes buharı (esneme tepesinde, sakin efor işareti)
    if (lean > 0.5) {
      const ba = (lean - 0.5) * 2 * 0.3;
      ctx.fillStyle = k.rgba('dim', ba);
      ctx.beginPath(); ctx.ellipse(hx + 30, hy - 40, 10, 6, 0.3, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx + 44, hy - 56, 7, 4.5, 0.3, 0, k.TAU); ctx.fill();
    }
  },
};
