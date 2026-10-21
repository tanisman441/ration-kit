// crowd-reactions/clap-sync — tempo ile senkron el çırpan, ritmik zıplayan alkış kalabalığı.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; zemin (0,0), figürler negatif y yönünde yukarı uzar.
export default {
  name: 'clap-sync',
  category: 'crowd-reactions',
  desc: 'tempo parametresiyle senkron el çırpan kalabalık; her alkışta mini çırpma ışıltısı',
  tags: ['kalabalık', 'alkış', 'el çırpma', 'applause', 'clap', 'crowd', 'senkron', 'ritim', 'sync', 'rhythm', 'fans', 'tezahürat'],
  box: [-260, -300, 260, 12],
  bleed: 30,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -220] },
  params: {
    color: { type: 'color', default: 'dim' },
    tempo: { type: 'number', default: 3, desc: 'saniyedeki alkış sayısı (1–6)' },
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
    const face = (cx, hy) => {
      ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * 10, hy + 2, 5.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(cx, hy + 12, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    };

    const tempo = Math.max(1, Math.min(6, p.tempo));
    const n = Math.max(5, Math.min(9, Math.round(p.count)));

    const fig = (cx, baseY, s, seed) => {
      const jitter = (k.hash(seed * 17) - 0.5) * 0.12;   // insan kusuru: minik faz farkı
      const cyc = ((t * tempo + jitter) % 1 + 1) % 1;    // 0..1 alkış döngüsü
      const shut = Math.abs(Math.cos(cyc * Math.PI));    // 1=eller birleşik, 0=açık
      const handGap = 4 + 24 * (1 - shut);               // el açıklığı
      const hop = -7 * Math.abs(Math.sin(cyc * Math.PI)); // alkışla senkron mini zıplama
      const y = baseY + hop;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, baseY + 2, 30 * s, 8 * s, 0, 0, k.TAU); ctx.fill();
      blob(cx - 13 * s, y - 78 * s, 26 * s, 78 * s, 10 * s, tone);
      blob(cx - 20 * s, y - 140 * s, 40 * s, 66 * s, 16 * s, tone);
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(cx + 12 * s, y - 110 * s, 7 * s, 22 * s, 0.1, 0, k.TAU); ctx.fill();
      const hy = y - 158 * s;
      // kollar öne: eller göğüs hizasında birbirine yaklaşır
      for (const sd of [-1, 1]) {
        const sx = cx + sd * 17 * s, sy = y - 128 * s;
        const hx = cx + sd * handGap * s * 0.55, hhy = y - 104 * s;
        const ex = (sx + hx) / 2, ey = (sy + hhy) / 2 + 4 * s;
        limb(sx, sy, ex, ey, 16 * s, tone);
        limb(ex, ey, hx, hhy, 13 * s, tone);
        disc(hx, hhy, 8.5 * s, 8.5 * s, tone);
      }
      // alkış anında mini ışıltı
      if (shut > 0.9) {
        const a = (shut - 0.9) / 0.1;
        ctx.fillStyle = k.rgba('yellow', 0.55 * a);
        ctx.beginPath(); ctx.ellipse(cx, y - 104 * s, 6 * s * a + 2, 9 * s * a + 2, 0, 0, k.TAU); ctx.fill();
      }
      disc(cx, hy, 21 * s, 20 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - 7 * s, hy - 7 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
      face(cx, hy);
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
  },
};
