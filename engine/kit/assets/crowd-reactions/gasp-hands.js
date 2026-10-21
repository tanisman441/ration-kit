// crowd-reactions/gasp-hands — şaşkınlık anında elleri başa götüren, ağzı O olan kalabalık.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; zemin (0,0), figürler negatif y yönünde yukarı uzar.
export default {
  name: 'gasp-hands',
  category: 'crowd-reactions',
  desc: 'at anında elleri başına götürüp şaşkınlıkla donakalan kalabalık; şok çizgili',
  tags: ['kalabalık', 'şaşkınlık', 'gasp', 'şok', 'hands on head', 'shock', 'crowd', 'surprised', 'astonished', 'fans', 'şaşırma'],
  box: [-260, -300, 260, 12],
  bleed: 60,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -260] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'şaşkınlık anı: eller 0.15 sn\'de başa, 0.5 sn tutma (yaklaşık 0.9 sn olay)' },
    count: { type: 'number', default: 6, desc: 'kişi sayısı 5–8' },
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
    const face = (cx, hy, mood) => {
      ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
      if (mood === 'surprised') {
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * 10, hy - 2, 5, 6, 0, 0, k.TAU); ctx.fill(); }
        ctx.beginPath(); ctx.ellipse(cx, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill();
      } else {
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * 10, hy - 2, 4, 4, 0, 0, k.TAU); ctx.fill(); }
        ctx.beginPath(); ctx.moveTo(cx - 8, hy + 10); ctx.lineTo(cx + 8, hy + 10); ctx.stroke();
      }
    };

    const d = p.at == null ? -1 : t - p.at;
    const n = Math.max(5, Math.min(8, Math.round(p.count)));

    const fig = (cx, baseY, s, seed) => {
      const bob = Math.sin(t * 2.2 + seed * 1.7) * 2.5;
      const y = baseY + bob;
      let grab = 0, mood = 'neutral', recoil = 0;
      if (d >= 0 && d < 0.95) {                                    // 0.95 sn şaşkınlık olayı
        mood = 'surprised';
        grab = sstep(0, 0.15, d) * (1 - sstep(0.65, 0.95, d));      // eller 0.15 sn'de başa, 0.65'te bırakır
        recoil = -4 * sstep(0, 0.15, d) * (1 - sstep(0.5, 0.95, d)); // geriye mini kaçış
      } else if (d >= 0.95) { mood = d < 2.2 ? 'surprised' : 'neutral'; }
      const xx = cx + recoil;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, y + 2, 30 * s, 8 * s, 0, 0, k.TAU); ctx.fill();
      blob(xx - 13 * s, y - 78 * s, 26 * s, 78 * s, 10 * s, tone);
      blob(xx - 20 * s, y - 140 * s, 40 * s, 66 * s, 16 * s, tone);
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(xx + 12 * s, y - 110 * s, 7 * s, 22 * s, 0.1, 0, k.TAU); ctx.fill();
      const hy = y - 158 * s;
      // kollar: yanlardan başın iki yanına; grab 0→yanda, 1→başta
      for (const sd of [-1, 1]) {
        const sx = xx + sd * 17 * s, sy = y - 128 * s;
        const handX = xx + sd * (20 + 4 * grab) * s;
        const handY = (y - 30 * s) * (1 - grab) + (hy - 4 * s) * grab;
        const ex = (sx + handX) / 2 + sd * 14 * s * grab, ey = (sy + handY) / 2;
        limb(sx, sy, ex, ey, 16 * s, tone);
        limb(ex, ey, handX, handY, 13 * s, tone);
        disc(handX, handY, 9.5 * s, 9.5 * s, tone);
      }
      disc(xx, hy, 21 * s, 20 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(xx - 7 * s, hy - 7 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
      face(xx, hy, mood);
      // şok çizgileri: başın üstünde 3 kısa ışın, olay ortasında parlar
      if (d >= 0 && d < 0.95) {
        const g = Math.sin(Math.PI * k.clamp(d / 0.95, 0, 1));
        ctx.strokeStyle = k.rgba('ink', 0.75 * g); ctx.lineWidth = 3.5 * s;
        for (const [ox, oy, dx, dy] of [[-30, -26, -8, -12], [0, -32, 0, -14], [30, -26, 8, -12]]) {
          ctx.beginPath();
          ctx.moveTo(xx + ox * s, hy + oy * s);
          ctx.lineTo(xx + (ox + dx) * s, hy + (oy + dy) * s);
          ctx.stroke();
        }
      }
    };

    const rows = n <= 4 ? [[n, 0, 1]] : [[Math.ceil(n / 2), -46, 0.84], [Math.floor(n / 2), 0, 1]];
    let seed = 1;
    for (const [cnt, baseY, s] of rows) {
      const w = Math.min(460, cnt * 72);
      for (let i = 0; i < cnt; i++) {
        const cx = cnt === 1 ? 0 : -w / 2 + (w * i) / (cnt - 1) + (k.hash(seed * 13) - 0.5) * 16;
        fig(cx, baseY, s * (0.92 + k.hash(seed * 29) * 0.16), seed);
        seed++;
      }
    }
  },
};
