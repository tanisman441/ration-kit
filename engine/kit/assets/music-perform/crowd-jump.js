// music-perform/crowd-jump — ritimle zıplayan konser kalabalığı: döngüsel zıplama + drop anında senkron sıçrama ve konfeti.
// NOT: canvas y-aşağıdır; zemin (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'crowd-jump', category: 'music-perform',
  desc: 'Ritimle zıplayan konser kalabalığı; drop anında hep birlikte sıçrar, konfeti patlar',
  tags: ['kalabalık', 'zıplama', 'konser', 'seyirci', 'drop', 'ritim', 'crowd', 'jump', 'concert', 'fans', 'beat'],
  box: [-250, -425, 250, 14],
  bleed: 60,
  anchor: 'zemin (0,0); kalabalığın ortası',
  points: { top: [0, -300] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'drop anı: senkron büyük sıçrama + konfeti (~0.8 sn olay)' },
    count: { type: 'number', default: 6, desc: 'kişi sayısı 4–8' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.78))).join(',')})`;
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

    const d = p.at == null ? -1 : t - p.at;
    const drop = d >= 0 && d < 0.8;
    const n = Math.max(4, Math.min(8, Math.round(p.count)));
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    // zemin
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 230, 10, 0, 0, k.TAU); ctx.fill();

    const fig = (cx, baseY, s, seed, mood) => {
      // döngüsel zıplama: faz kaydırmalı
      const ph = ((t * 1.25 + seed * 0.37) % 1);
      const bounce = 4 * ph * (1 - ph);
      let yOff = -95 * bounce;
      let armUp = 0.45 + bounce * 0.55;
      if (drop) {
        const a = d / 0.8;
        yOff = -120 * 4 * a * (1 - a);
        armUp = 1;
      }
      const yy = baseY + yOff;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      const wob = (k.hash(seed * 7 + 1) - 0.5) * 6;
      // gölge
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, baseY + 2, Math.max(8, 30 * s * (1 + yOff / 420)), 8 * s, 0, 0, k.TAU); ctx.fill();
      // bacaklar (zıplarken dizler bükülür)
      const knee = bounce * 22;
      limb(cx - 8 * s, yy, cx - 10 * s, yy - 44 * s + knee * 0.5, 11 * s, tone);
      limb(cx - 10 * s, yy - 44 * s + knee * 0.5, cx - 10 * s, yy - 88 * s, 10 * s, tone);
      limb(cx + 8 * s, yy, cx + 10 * s, yy - 44 * s + knee * 0.5, 11 * s, tone);
      limb(cx + 10 * s, yy - 44 * s + knee * 0.5, cx + 10 * s, yy - 88 * s, 10 * s, tone);
      // gövde (baş genişliği 40 → gövde 104)
      blob(cx - 15 * s, yy - 192 * s, 30 * s, 104 * s, 13 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - 7 * s, yy - 176 * s, 7 * s, 14 * s, 0.15, 0, k.TAU); ctx.fill();
      // kollar: zıplama tepesinde havada
      for (const sd of [-1, 1]) {
        const sx = cx + sd * 13 * s, sy = yy - 176 * s;
        const hx = cx + sd * (18 + 14 * armUp) * s;
        const hyy = yy - 176 * s - (40 + 50 * armUp) * s;
        const ex = (sx + hx) / 2, ey = (sy + hyy) / 2 + (1 - armUp) * 8 * s;
        limb(sx, sy, ex, ey, 10 * s, tone);
        limb(ex, ey, hx, hyy, 8.5 * s, tone);
        disc(hx, hyy, 7.5 * s, 7.5 * s, tone);
      }
      // baş
      const hy2 = yy - 214 * s;
      disc(cx + wob * 0.5, hy2, 20 * s, 19 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx + wob * 0.5 - 7 * s, hy2 - 7 * s, 6.5 * s, 4.5 * s, -0.4, 0, k.TAU); ctx.fill();
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.ellipse(cx + wob * 0.5 - 9, hy2 - 2, 3, 3, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + wob * 0.5 + 9, hy2 - 2, 3, 3, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = inkC; ctx.lineWidth = 3;
      if (mood === 'happy') { ctx.beginPath(); ctx.arc(cx + wob * 0.5, hy2 + 5, 7, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(cx + wob * 0.5 - 7, hy2 + 8); ctx.lineTo(cx + wob * 0.5 + 7, hy2 + 8); ctx.stroke(); }
    };

    let seed = 1;
    const back = Math.ceil(n / 2), front = n - back;
    const row = (cnt, baseY, s, xOff) => {
      const w = Math.min(440, cnt * 78);
      for (let i = 0; i < cnt; i++) {
        const cx = (cnt === 1 ? 0 : -w / 2 + (w * i) / (cnt - 1)) + xOff + (k.hash(seed * 13) - 0.5) * 18;
        fig(cx, baseY, s * (0.92 + k.hash(seed * 29) * 0.16), seed, drop ? 'happy' : 'neutral');
        seed++;
      }
    };
    row(back, -52, 0.82, 39);
    row(front, 0, 1, 0);

    // konfeti: drop'ta patlar, 0.8 sn'de söner
    if (drop) {
      const g = d / 0.8;
      for (let i = 0; i < 16; i++) {
        const h1 = k.hash(i * 3 + 5), h2 = k.hash(i * 7 + 11), h3 = k.hash(i * 11 + 2);
        const ang = -Math.PI / 2 + (h1 - 0.5) * 1.6;
        const rise = g * (60 + h2 * 70);
        const px = Math.cos(ang) * (50 + h2 * 70) * g + (h3 - 0.5) * 220;
        const py = -250 - rise;
        const a = 0.9 * (1 - g);
        const c = h3 < 0.45 ? 'yellow' : (h3 < 0.7 ? 'red' : 'cyan');
        ctx.fillStyle = k.rgba(c, a);
        ctx.beginPath(); ctx.ellipse(px, py, 4.5, 3, h1 * Math.PI, 0, k.TAU); ctx.fill();
        if (h3 < 0.25) spark(px, py - 30, 6 * (1 - g * 0.5), 'yellow', a);
      }
    }
  },
};
