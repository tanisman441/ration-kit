// gym-fx/kettlebell-swing — yandan görünen figür, kettlebell bacak arasından göğüs hizasına savrulur. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar. Figür sağa bakar.
export default {
  name: 'kettlebell-swing',
  category: 'gym-fx',
  desc: 'Kettlebell savuran insan figürü (yandan); her turda gülle bacak arasından göğüs hizasına çıkar',
  tags: ['kettlebell', 'gülle', 'savurma', 'kettlebell swing', 'ağırlık', 'spor salonu', 'gym', 'fitness', 'egzersiz'],
  box: [-150, -330, 170, 16],
  bleed: 40,
  anchor: 'ayaklar (0,0); boy ~290 birim, savrulma yarıçapı ~110',
  points: { head: [30, -250], kettlebell: [90, -160], hand: [60, -190], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    swing: { type: 'time', default: null, desc: 'sallama döngüsünün başlangıcı — 1.0 snlik turlar durmadan tekrarlanır; null ise gülle önde sarkık bekler' },
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
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma

    const d = p.swing == null ? -1 : t - p.swing;
    const active = d >= 0;
    const ph = active ? (d % 1.0) / 1.0 : 0;
    const s = active ? Math.sin(ph * Math.PI) : 0;         // 0: gülle geride, 1: gülle önde yukarıda
    const ang = active ? -1.0 + 2.9 * s : 0.25 + 0.08 * Math.sin(t * k.TAU / 2.4);
    const hinge = active ? 1 - s : 0;                     // 1: derin kalça büküşü, 0: dik duruş

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 58, 10, 0, 0, k.TAU); ctx.fill();

    const hipX = -10 - 26 * hinge, hipY = -130 - 6 * hinge;
    const kneeX = 14 + 10 * hinge, kneeY = -70;
    // bacaklar (yandan: ön bacak tam, arka bacak hafif geride)
    limb(hipX, hipY, kneeX, kneeY, 20, body);
    limb(kneeX, kneeY, 6, -14, 17, body);
    limb(hipX - 8, hipY, kneeX - 12, kneeY, 18, k.rgba('panel2'));
    limb(kneeX - 12, kneeY, -6, -14, 15, k.rgba('panel2'));
    blob(6 - 12, -13, 26, 13, 6, body);
    blob(-6 - 12, -13, 26, 13, 6, k.rgba('panel2'));

    // gövde: kalçadan omza eğik rrect (lean: öne eğilme)
    const lean = 0.15 + 0.55 * hinge;
    const shoX = hipX + Math.sin(lean) * 112, shoY = hipY - Math.cos(lean) * 112 - br * 0.4;
    ctx.save();
    ctx.translate(hipX, hipY); ctx.rotate(lean);
    blob(-31, -112 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge
    ctx.beginPath(); ctx.ellipse(17, -40, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-15, -84, 9, 24, 0.12, 0, k.TAU); ctx.fill();
    ctx.restore();

    // kol + kettlebell: omuzdan gülleye düz kol
    const kbX = shoX + 112 * Math.sin(ang), kbY = shoY + 112 * Math.cos(ang);
    // savrulma izi (yay)
    if (active) {
      ctx.strokeStyle = k.rgba('ink', 0.18); ctx.lineWidth = 5;
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const a = -1.0 + 2.9 * (i / 12);
        const px = shoX + 112 * Math.sin(a), py = shoY + 112 * Math.cos(a);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    limb(shoX, shoY, kbX, kbY, 16, body);
    disc(kbX, kbY, 10, 10, body);
    // gülle: top + omza dönük sap
    disc(kbX, kbY, 27, 27, acc);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(kbX - 9, kbY - 10, 9, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(kbX, kbY, 20, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(kbX, kbY, 20, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();

    // baş (gövde doğrultusunda, omzun üstü)
    const hx = shoX + Math.sin(lean) * 42, hy = shoY - Math.cos(lean) * 42 - br * 0.5;
    disc(hx, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const sgn of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(sgn * ex + 4, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(sgn * ex + 4, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(4, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(4, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(4, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-4, hy + 12); ctx.lineTo(12, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
  },
};
