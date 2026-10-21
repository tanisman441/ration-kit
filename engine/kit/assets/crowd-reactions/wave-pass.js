// crowd-reactions/wave-pass — meksika dalgası: figürler soldan sağa sırayla yükselip kollarını kaldırır.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; zemin (0,0), figürler negatif y yönünde yukarı uzar.
export default {
  name: 'wave-pass',
  category: 'crowd-reactions',
  desc: 'soldan sağa geçen meksika dalgası; her figür sırayla yükselir, kollarını kaldırır, sarı ışıltı çıkarır',
  tags: ['kalabalık', 'meksika dalgası', 'dalga', 'tezahürat', 'stadyum', 'sırayla', 'wave', 'crowd', 'stadium', 'mexican wave', 'fans', 'cheer'],
  box: [-260, -320, 260, 12],
  bleed: 50,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -300] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'dalganın merkezden geçiş anı (figürler 0.28 sn arayla yükselir)' },
    count: { type: 'number', default: 7, desc: 'kişi sayısı 5–9 (tek sıra)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.8))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const spark = (x, y, s, c, a) => {
      ctx.fillStyle = k.rgba(c, a);
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.quadraticCurveTo(x + s * 0.22, y - s * 0.22, x + s, y);
      ctx.quadraticCurveTo(x + s * 0.22, y + s * 0.22, x, y + s);
      ctx.quadraticCurveTo(x - s * 0.22, y + s * 0.22, x - s, y);
      ctx.quadraticCurveTo(x - s * 0.22, y - s * 0.22, x, y - s);
      ctx.fill();
    };
    const face = (cx, hy, mood) => {
      ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
      if (mood === 'happy') {
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * 10, hy + 2, 5.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
        ctx.beginPath(); ctx.arc(cx, hy + 12, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
      } else {
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * 10, hy - 2, 4, 4, 0, 0, k.TAU); ctx.fill(); }
        ctx.beginPath(); ctx.moveTo(cx - 8, hy + 10); ctx.lineTo(cx + 8, hy + 10); ctx.stroke();
      }
    };

    const n = Math.max(5, Math.min(9, Math.round(p.count)));
    const w = Math.min(470, n * 66);
    const step = 0.28;                                  // figürler arası dalga gecikmesi (sn)
    const riseDur = 0.45;                               // tek figürün yükselme süresi

    for (let i = 0; i < n; i++) {
      const cx = n === 1 ? 0 : -w / 2 + (w * i) / (n - 1);
      const seed = i + 1;
      const s = 0.92 + k.hash(seed * 29) * 0.16;
      const bob = Math.sin(t * 2.2 + seed * 1.7) * 2.5;
      const y = bob;
      // bu figürün dalga zamanı: at merkezde, sola/sağa doğru gecikir
      const dd = p.at == null ? -1 : t - p.at - (i - (n - 1) / 2) * step;
      let yOff = 0, armUp = 0.15, mood = 'neutral', glint = 0;
      if (dd >= 0 && dd < riseDur) {
        const a = dd / riseDur;
        const e = Math.sin(a * Math.PI);                 // yüksel/alçal zarfı
        yOff = -70 * e;
        armUp = 0.15 + 0.85 * e;
        mood = 'happy';
        glint = Math.sin(a * Math.PI);
      }
      const yy = y + yOff;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, y + 2, 30 * s, 8 * s, 0, 0, k.TAU); ctx.fill();
      blob(cx - 13 * s, yy - 78 * s, 26 * s, 78 * s, 10 * s, tone);
      blob(cx - 20 * s, yy - 140 * s, 40 * s, 66 * s, 16 * s, tone);
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(cx + 12 * s, yy - 110 * s, 7 * s, 22 * s, 0.1, 0, k.TAU); ctx.fill();
      const hy = yy - 158 * s;
      for (const sd of [-1, 1]) {
        const sx = cx + sd * 17 * s, sy = yy - 128 * s;
        const hx = cx + sd * (20 - 12 * armUp) * s;
        const hhy = yy - 128 * s - (108 * armUp + 4) * s;
        const ex = (sx + hx) / 2, ey = (sy + hhy) / 2 + (1 - armUp) * 10 * s;
        limb(sx, sy, ex, ey, 16 * s, tone);
        limb(ex, ey, hx, hhy, 13 * s, tone);
        disc(hx, hhy, 8.5 * s, 8.5 * s, tone);
      }
      disc(cx, hy, 21 * s, 20 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - 7 * s, hy - 7 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
      face(cx, hy, mood);
      if (glint > 0.05) spark(cx, hy - 44 * s, 7 * glint, 'yellow', 0.85 * glint);  // dalga tepesinde ışıltı
    }
  },
};
