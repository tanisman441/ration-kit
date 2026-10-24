// gym-fx/barbell-lift — önden görünen halterci, halteri omuzdan baş üstüne kaldırır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'barbell-lift',
  category: 'gym-fx',
  desc: 'Halterle omuzdan baş üstüne pres yapan insan figürü (önden); at anında halter yukarı kalkar',
  tags: ['halter', 'halter kaldırma', 'ağırlık kaldırma', 'barbell', 'weightlifting', 'overhead press', 'spor salonu', 'gym', 'fitness'],
  box: [-160, -360, 160, 16],
  bleed: 40,
  anchor: 'ayaklar (0,0); boy ~290 birim, halter genişliği ~300',
  points: { head: [0, -250], barbell: [0, -300], handL: [-70, -300], handR: [70, -300], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    at: { type: 'time', default: null, desc: 'kaldırma anı — halter 1.2 sn içinde omuzdan baş üstüne kalkıp iner; null ise halter omuzda bekler' },
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

    const d = p.at == null ? -1 : t - p.at;
    let raise = 0;                                        // 0: halter omuzda, 1: baş üstünde
    if (d >= 0 && d <= 1.2) raise = sstep(0, 0.5, d) - sstep(0.7, 1.15, d);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 56, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;
    const crouch = raise * 8;
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 16, -16 - crouch * 0.4, 20, body);
      blob(s * 16 - 12, -13 - crouch * 0.4, 24, 13, 6, body);
    }

    // gövde
    blob(-31, -240 - br * 0.4 - crouch * 0.3, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge
    ctx.beginPath(); ctx.ellipse(17, -196, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();

    // halter: eller omuz genişliğinde, bar yatay; plakalar vurgu rengi
    const handY = -196 - br * 0.4 + raise * (-108);
    const barY = handY - 6;
    for (const s of [-1, 1]) {
      const hx = s * 70, ex = s * (44 + raise * 10), ey = shoY + 26 - raise * 60;
      limb(s * 29, shoY, ex, ey, 18, body);
      limb(ex, ey, hx, handY, 15, body);
      disc(hx, handY, 10, 10, body);
    }
    ctx.save();
    ctx.translate(0, barY);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-152, -5, 304, 10, 5); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-148, -3, 296, 6, 3); ctx.fill();
    for (const s of [-1, 1]) {
      blob(s * 118 - 12, -30, 24, 60, 10, acc);
      blob(s * 142 - 8, -22, 16, 44, 8, k.rgba('panel2'));
    }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-118, -16, 7, 12, -0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

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
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // efor: tepe anında ter + hız çizgileri
    const eff = d > 0.4 && d < 1.0 ? Math.sin((d - 0.4) / 0.6 * Math.PI) : 0;
    if (eff > 0) {
      for (let i = 0; i < 2; i++) {
        const h1 = k.hash(i * 5 + 2), h2 = k.hash(i * 11 + 7);
        ctx.fillStyle = k.rgba('dim', 0.6 * eff);
        ctx.beginPath(); ctx.ellipse(-60 + h1 * 120, -310 - h2 * 30, 4, 6.5, 0.2, 0, k.TAU); ctx.fill();
      }
      ctx.strokeStyle = k.rgba('ink', 0.3 * eff); ctx.lineWidth = 4;
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(s * 168, barY - 34); ctx.lineTo(s * 168, barY - 14); ctx.stroke();
      }
    }
  },
};
