// characters/teacher — öğretmen; person ailesinden, gözlük + işaret çubuğu.
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'teacher',
  category: 'characters',
  desc: 'Öğretmen; gözlük ve elinde işaret çubuğu, 3 ruh hali',
  tags: ['öğretmen', 'eğitimci', 'okul', 'ders', 'teacher', 'educator', 'school', 'instructor'],
  box: [-95, -292, 95, 12],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~290 birim',
  points: { head: [0, -276], hand: [62, -190] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'surprised'], default: 'neutral' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
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

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -22, 20, body);
      blob(s * 13 - 12, -13, 24, 13, 6, body);
    }

    // gövde
    blob(-31, -240 - br * 0.4, 62, 112, 28, body);
    // ceket detayı: düğme çizgisi
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-2.5, -220 - br * 0.4, 5, 80, 2.5); ctx.fill();

    // kollar — sağ el yukarıda işaret çubuğu tutar
    limb(-29, shoY, -37, -134, 18, body);
    disc(-37, -130, 10, 10, body);
    const hx = 56, hy2 = -196;
    limb(29, shoY, hx, hy2, 18, body);
    disc(hx, hy2 - 4, 10, 10, body);
    // işaret çubuğu (serbest çizgi: ink)
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(hx, hy2 - 8); ctx.lineTo(hx + 10, hy2 - 66); ctx.stroke();
    ctx.strokeStyle = inkC; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(hx, hy2 - 8); ctx.lineTo(hx + 10, hy2 - 66); ctx.stroke();

    // baş
    const hy = -250 - br * 0.6;
    disc(0, hy, 36, 34, body);

    // yüz (person dili)
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }

    // gözlük: iki çerçeve + köprü (ink, serbest çizgi kuralı)
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    for (const s of [-1, 1]) {
      ctx.beginPath(); k.rrect(s * ex - 11, ey - 11, 22, 20, 6); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-10, ey - 4); ctx.lineTo(10, ey - 4); ctx.stroke();
    // saplar
    ctx.beginPath(); ctx.moveTo(-21, ey - 4); ctx.lineTo(-30, ey - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(21, ey - 4); ctx.lineTo(30, ey - 8); ctx.stroke();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
