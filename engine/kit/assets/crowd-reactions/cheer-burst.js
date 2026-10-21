// crowd-reactions/cheer-burst — gol/kazanma anında zıplayıp kollarını havaya kaldıran coşku kalabalığı.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; zemin (0,0), figürler negatif y yönünde yukarı uzar.
export default {
  name: 'cheer-burst',
  category: 'crowd-reactions',
  desc: 'at anında hep birlikte zıplayıp kollarını havaya kaldıran, konfetili coşku kalabalığı',
  tags: ['kalabalık', 'coşku', 'tezahürat', 'sevinç', 'zıplama', 'gol sevinci', 'cheer', 'crowd', 'celebration', 'jump', 'goal', 'fans'],
  box: [-260, -300, 260, 12],
  bleed: 70,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -280] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'coşku anı: hep birlikte zıplama + kollar havaya (yaklaşık 1 sn olay)' },
    count: { type: 'number', default: 7, desc: 'kişi sayısı 5–9' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.8))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };
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

    const d = p.at == null ? -1 : t - p.at;
    const n = Math.max(5, Math.min(9, Math.round(p.count)));

    const fig = (cx, baseY, s, seed) => {
      const bob = Math.sin(t * 2.2 + seed * 1.7) * 2.5;
      const y = baseY + bob;
      let yOff = 0, armUp = 0.15, mood = 'neutral';
      if (d >= 0 && d < 1.05) {
        mood = 'happy';
        if (d < 0.28) {
          armUp = 0.15 + 0.85 * sstep(0, 0.28, d);            // kollar 0.28 sn'de havaya
        } else {
          const a = (d - 0.28) / 0.77;                        // zıplama 0.77 sn
          yOff = -105 * 4 * a * (1 - a);
          armUp = 1;
        }
      } else if (d >= 1.05) { mood = 'happy'; }
      const yy = y + yOff;
      const wob = (k.hash(seed * 7 + 1) - 0.5) * 6;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, y + 2, Math.max(8, 30 * s * (1 + yOff / 420)), 8 * s, 0, 0, k.TAU); ctx.fill();
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
      disc(cx + wob * 0.5, hy, 21 * s, 20 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx + wob * 0.5 - 7 * s, hy - 7 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
      face(cx + wob * 0.5, hy, mood);
    };

    const rows = n <= 5 ? [[n, 0, 1]] : [[Math.ceil(n / 2), -46, 0.84], [Math.floor(n / 2), 0, 1]];
    let seed = 1;
    for (const [cnt, baseY, s] of rows) {
      const w = Math.min(460, cnt * 68);
      for (let i = 0; i < cnt; i++) {
        const cx = cnt === 1 ? 0 : -w / 2 + (w * i) / (cnt - 1) + (k.hash(seed * 13) - 0.5) * 16;
        fig(cx, baseY, s * (0.92 + k.hash(seed * 29) * 0.16), seed);
        seed++;
      }
    }

    // konfeti: ellerin üstünden fışkırır, 0.7 sn'de sönümlenir
    if (d > 0 && d < 0.7) {
      const g = d / 0.7;
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 3 + 5), h2 = k.hash(i * 7 + 11), h3 = k.hash(i * 11 + 2);
        const ang = -Math.PI / 2 + (h1 - 0.5) * 1.4;
        const rise = g * (50 + h2 * 60);                        // en fazla 110 birim yükselir
        const px = Math.cos(ang) * (60 + h2 * 80) * g + (h3 - 0.5) * 260;
        const py = -250 - rise;
        const a = 0.9 * (1 - g);
        const c = h3 < 0.45 ? 'yellow' : (h3 < 0.7 ? 'red' : 'dim');
        ctx.fillStyle = k.rgba(c, a);
        ctx.beginPath(); ctx.ellipse(px, py, 4.5, 3, h1 * Math.PI, 0, k.TAU); ctx.fill();
        if (h3 < 0.25) spark(px, py - 30, 6 * (1 - g * 0.5), 'yellow', a);
      }
    }
  },
};
