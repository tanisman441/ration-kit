// workout-fx/dumbbell-lift — çift kol dambıl pres yapan insan figürü, önden görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'dumbbell-lift',
  category: 'workout-fx',
  desc: 'Dambılla çift kol pres yapan insan figürü (önden); tekrarla kollar baş üstüne kalkar',
  tags: ['dambıl', 'dambıl kaldırma', 'ağırlık', 'dumbbell', 'weight lifting', 'overhead press', 'egzersiz', 'workout', 'fitness'],
  box: [-115, -350, 115, 16],
  bleed: 35,
  anchor: 'ayaklar (0,0); boy ~290 birim',
  points: { head: [0, -250], handL: [-62, -298], handR: [62, -298], dumbbellL: [-62, -298], dumbbellR: [62, -298], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    rep: { type: 'time', default: null, desc: 'tekrarın başlangıcı — bir tam pres döngüsü (1.2 sn); null ise dinlenme' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55), acc = k.rgba('accent');
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
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma

    // tekrar fazı: kaldır (0–0.55) → bekle → indir (0.65–1.15)
    const d = p.rep == null ? -1 : t - p.rep;
    let raise = 0;                                        // 0: kollar yanda, 1: baş üstünde
    if (d >= 0 && d <= 1.2) raise = sstep(0, 0.55, d) - sstep(0.65, 1.15, d);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;
    // bacaklar (kaldırırken hafif çömelme)
    const crouch = raise * 10;
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 15, -16 - crouch * 0.4, 20, body);
      blob(s * 15 - 12, -13 - crouch * 0.4, 24, 13, 6, body);
    }

    // gövde
    blob(-31, -240 - br * 0.4 - crouch * 0.3, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge
    ctx.beginPath(); ctx.ellipse(17, -196, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();

    // kollar + dambıllar (dambıl bara kol açısıyla döner: yanda dikey, tepede yatay)
    const dumbbell = (hx, hy, ang) => {
      ctx.save(); ctx.translate(hx, hy - 4); ctx.rotate(ang);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-36, -7, 72, 14, 7); ctx.fill();
      ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-33, -5, 66, 10, 5); ctx.fill();
      for (const ps of [-1, 1]) {
        blob(ps * 40 - 7, -24, 14, 48, 7, acc);           // plakalar (vurgu rengi, bara dik)
      }
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-40, -14, 5, 10, -0.3, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    for (const s of [-1, 1]) {
      const hx = s * (37 + raise * 25), hy = (-134 - br * 0.3) + raise * (-164);   // tepede eller başın dışında
      const ex = s * (33 + raise * 16), ey = (-170 - br * 0.4) + raise * (-80);
      limb(s * 29, shoY, ex, ey, 18, body);
      limb(ex, ey, hx, hy, 15, body);
      disc(hx, hy, 10, 10, body);
      dumbbell(hx, hy, (1 - raise) * Math.PI / 2);
    }

    // baş
    const hy = -250 - br * 0.6 - crouch * 0.3;
    disc(0, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(0, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // baş parlaması
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // efor: tepe anında ter + titreme çizgileri
    const eff = d > 0.45 && d < 0.95 ? Math.sin((d - 0.45) / 0.5 * Math.PI) : 0;
    if (eff > 0) {
      for (let i = 0; i < 2; i++) {
        const h1 = k.hash(i * 5 + 2), h2 = k.hash(i * 11 + 7);
        ctx.fillStyle = k.rgba('dim', 0.6 * eff);
        ctx.beginPath(); ctx.ellipse(-50 + h1 * 100, -300 - h2 * 30, 4, 6.5, 0.2, 0, k.TAU); ctx.fill();
      }
      ctx.strokeStyle = k.rgba('ink', 0.3 * eff); ctx.lineWidth = 4;
      for (const s of [-1, 1]) {
        for (let i = 0; i < 2; i++) {
          const yy = -260 - i * 26 - raise * 40;
          ctx.beginPath(); ctx.moveTo(s * 84, yy); ctx.lineTo(s * 96, yy); ctx.stroke();
        }
      }
    }
  },
};
