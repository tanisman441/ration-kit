// gesture-fx/fist-pump — yukarı pompalanan yumruk; `at` anında fırlar, parçacık saçar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) dinlenme konumundaki yumruk merkezidir.
export default {
  name: 'fist-pump',
  category: 'gesture-fx',
  desc: 'Yukarı pompalanan yumruk; pompalama anında fırlar, parçacık saçar',
  tags: ['yumruk', 'zafer', 'pompalama', 'kutlama', 'fist', 'pump', 'victory', 'celebration'],
  box: [-125, -155, 125, 100],
  bleed: 55,
  anchor: 'yumruk merkezi (0,0); dinlenmede alt orta',
  points: { fist: [0, -44], base: [0, 78] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'el rengi' },
    at: { type: 'time', default: null, desc: 'pompalama anı: yumruk fırlar, parçacık saçar' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = 6, OUT = k.rgba('bg', 0.55);
    const sh = (n, f = 0.88) => { const c = k.col(n); return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`; };
    const blob = (x, y, w, h, r, n) => {
      ctx.fillStyle = sh(n); ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = OUT; ctx.beginPath(); k.rrect(x - O / 2, y - O / 2, w + O, h + O, r + O / 2); ctx.fill();
      ctx.fillStyle = k.rgba(n); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, n) => {
      ctx.fillStyle = sh(n); ctx.beginPath(); ctx.ellipse(x + 6, y + 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(x, y, rx + O / 2, ry + O / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(n); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, n) => {
      ctx.strokeStyle = sh(n); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1 + 6, y1 + 6); ctx.lineTo(x2 + 6, y2 + 6); ctx.stroke();
      ctx.strokeStyle = OUT; ctx.lineWidth = w + O; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba(n); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const sheen = (x, y, rx, ry, a = 0.11) => {
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.4, 0, k.TAU); ctx.fill();
    };

    // ANİMASYON — idle: hafif nefes (±2.5); `at`: 0.22 sn'de 72 birim fırlar, 0.48 sn'de yayla geri döner
    const d = p.at == null ? -1 : t - p.at;
    let py = Math.sin(t * k.TAU / 2.4) * 2.5;
    if (d >= 0 && d < 0.7) {
      if (d < 0.22) py = -72 * k.E.inOutCubic(d / 0.22);
      else py = -72 + 72 * k.E.outBack((d - 0.22) / 0.48, 1.4);
    }

    // fırlatma tozu (tabanda genişleyen elips)
    if (d >= 0 && d < 0.3) {
      const g = d / 0.3;
      ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - g)); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, 44, 24 + g * 46, (24 + g * 46) * 0.45, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.save();
    ctx.translate(0, py);
    blob(-26, 34, 52, 62, 12, 'panel2');          // kol manşeti
    blob(-46, -42, 92, 84, 22, p.color);          // yumruk
    sheen(-22, -28, 24, 10);
    disc(-28, -40, 15, 15, p.color);              // boğumlar
    disc(0, -44, 15, 15, p.color);
    disc(28, -40, 15, 15, p.color);
    limb(-40, 10, -6, -8, 20, p.color);           // başparmak
    ctx.restore();

    // parçacık patlaması (0.6 sn)
    if (d >= 0 && d < 0.6) {
      const fade = 1 - d / 0.6;
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 3 + 2);
        const vx = (h2 - 0.5) * 130, vy = 90 + h1 * 90;
        const px = vx * d, pyy = -46 - vy * d + 90 * d * d;
        ctx.globalAlpha = fade * 0.9;
        ctx.fillStyle = k.rgba('accent');
        ctx.beginPath(); ctx.arc(px, pyy, 4 + h1 * 4, 0, k.TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },
};
