// crowd-reactions/boo-shake — başparmak aşağı sallayarak yuhalayan kalabalık.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; zemin (0,0), figürler negatif y yönünde yukarı uzar.
export default {
  name: 'boo-shake',
  category: 'crowd-reactions',
  desc: 'at anında başparmaklarını aşağı sallayıp öfkeyle sarsılan yuhalama kalabalığı',
  tags: ['kalabalık', 'yuhalama', 'boo', 'kızgın', 'başparmak', 'dislike', 'boo', 'crowd', 'angry', 'fans', 'dislike', 'jeer'],
  box: [-260, -300, 260, 12],
  bleed: 40,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -220] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'yuhalama anı: thumbs-down sallama (yaklaşık 0.7 sn olay)' },
    count: { type: 'number', default: 6, desc: 'kişi sayısı 5–8' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.8))).join(',')})`;
    const thumbC = k.rgba('red');
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
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * 10, hy - 2, 4, 4, 0, 0, k.TAU); ctx.fill(); }
      if (mood === 'sad') { ctx.beginPath(); ctx.arc(cx, hy + 18, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(cx - 8, hy + 10); ctx.lineTo(cx + 8, hy + 10); ctx.stroke(); }
    };

    const d = p.at == null ? -1 : t - p.at;
    const n = Math.max(5, Math.min(8, Math.round(p.count)));

    const fig = (cx, baseY, s, seed) => {
      const bob = Math.sin(t * 2.2 + seed * 1.7) * 2.5;
      const y = baseY + bob;
      let shx = 0, mood = 'neutral', down = 0, lean = 0;
      if (d >= 0 && d < 0.75) {                                     // 0.75 sn yuhalama olayı
        mood = 'sad';
        const env = Math.sin(Math.PI * d / 0.75);                   // sönümlenme zarfı
        shx = Math.sin(d * k.TAU * 6) * 8 * env;                    // yanal sallanma
        down = sstep(0, 0.12, d) * (1 - sstep(0.6, 0.75, d));       // thumbs-down uzatma
        lean = 6 * env;
      } else if (d >= 0.75) { mood = 'sad'; }
      const xx = cx + shx;
      const wob = (k.hash(seed * 7 + 1) - 0.5) * 6;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, y + 2, 30 * s, 8 * s, 0, 0, k.TAU); ctx.fill();
      blob(xx - 13 * s + lean * 0.2 * s, y - 78 * s, 26 * s, 78 * s, 10 * s, tone);
      blob(xx - 20 * s + lean * 0.4 * s, y - 140 * s, 40 * s, 66 * s, 16 * s, tone);
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(xx + 12 * s, y - 110 * s, 7 * s, 22 * s, 0.1, 0, k.TAU); ctx.fill();
      const hy = y - 158 * s;
      // kollar: öne doğru bükük, eller göğüs önünde, başparmaklar aşağı
      for (const sd of [-1, 1]) {
        const sx = xx + sd * 17 * s, sy = y - 128 * s;
        const hx = xx + sd * 22 * s, hhy = y - 100 * s + 14 * down * s;
        const ex = (sx + hx) / 2, ey = (sy + hhy) / 2 + 6 * s;
        limb(sx, sy, ex, ey, 16 * s, tone);
        limb(ex, ey, hx, hhy, 13 * s, tone);
        disc(hx, hhy, 8.5 * s, 8.5 * s, tone);
        if (down > 0.3) {                                          // başparmak nub'ı aşağı
          ctx.fillStyle = line;
          ctx.beginPath(); k.rrect(hx - 5 * s, hhy + 4 * s, 10 * s + LW, 16 * s * down + LW, 4 * s); ctx.fill();
          ctx.fillStyle = thumbC;
          ctx.beginPath(); k.rrect(hx - 5 * s + LW / 2, hhy + 4 * s + LW / 2, 10 * s, 16 * s * down, 4 * s); ctx.fill();
        }
      }
      disc(xx + wob * 0.5 + lean * 0.6 * s, hy, 21 * s, 20 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(xx + wob * 0.5 - 7 * s, hy - 7 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
      face(xx + wob * 0.5 + lean * 0.6 * s, hy, mood);
      // yuhalama "şok" çizgileri: olay sırasında kırmızı zikzaklar
      if (d >= 0 && d < 0.75) {
        const g = Math.sin(Math.PI * d / 0.75);
        ctx.strokeStyle = k.rgba('red', 0.7 * g); ctx.lineWidth = 4 * s;
        for (const sd of [-1, 1]) {
          ctx.beginPath();
          const zx = xx + sd * 46 * s;
          ctx.moveTo(zx, hy - 10 * s);
          ctx.lineTo(zx + sd * 8 * s, hy - 2 * s);
          ctx.lineTo(zx, hy + 6 * s);
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
