// gesture-fx/wave-hand — bilekten salınan açık el; sürekli yavaş sallar, `at` anında hızlı üç salınım yapar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bilektir, el yukarı uzar ve bilek ekseninde döner.
export default {
  name: 'wave-hand',
  category: 'gesture-fx',
  desc: 'Bilekten salınan açık el; sürekli yavaş sallar, vurgu anında hızlı üç salınım yapar',
  tags: ['el sallama', 'selam', 'merhaba', 'veda', 'sallamak', 'wave', 'waving', 'hello', 'hand'],
  box: [-150, -170, 150, 120],
  bleed: 40,
  anchor: 'bilek (0,0); el yukarı salınır',
  points: { wrist: [0, 0], tips: [0, -128] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'el rengi' },
    at: { type: 'time', default: null, desc: 'selam vurgusu: 0.9 sn hızlı salınım + yay çizgileri' },
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
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    // ANİMASYON — idle: 1.6 sn periyotlu yumuşak salınım (canlı loop); `at`: 0.9 sn hızlı üç salınım + yay çizgileri
    const d = p.at == null ? -1 : t - p.at;
    const idle = 0.26 * Math.sin(t * k.TAU / 1.6);
    let swing = idle, burst = 0;
    if (d >= 0 && d < 0.9) {
      const env = (1 - sstep(0.65, 0.9, d)) * sstep(0, 0.06, d);
      burst = env;
      const fast = 0.55 * Math.sin(d * k.TAU / 0.3) * env;
      swing = idle * (1 - env) + fast;
    }

    // vurgu yay çizgileri (bilek merkezli)
    if (burst > 0) {
      ctx.strokeStyle = k.rgba('ink', 0.35 * burst); ctx.lineWidth = 4;
      for (let i = 0; i < 2; i++) {
        const rr = 92 + i * 24, a0 = Math.PI * 1.25 + swing * 0.6;
        ctx.beginPath(); ctx.arc(0, 0, rr, a0 - 0.5, a0 + 0.5); ctx.stroke();
      }
    }

    ctx.save();
    ctx.rotate(swing);
    // önkol + manşet
    limb(0, 112, 0, 10, 36, 'panel2');
    blob(-25, 78, 50, 32, 10, 'panel2');
    // avuç
    disc(0, 0, 17, 17, p.color);                  // bilek eklemi
    blob(-30, -86, 60, 64, 20, p.color);          // avuç içi
    sheen(-16, -72, 16, 9);
    // dört parmak (ortadakiler uzun)
    const xs = [-16.5, -5.5, 5.5, 16.5], lens = [40, 48, 48, 40];
    for (let i = 0; i < 4; i++) {
      limb(xs[i], -82, xs[i] + (i - 1.5) * 5, -82 - lens[i], 15, p.color);
    }
    // başparmak
    limb(26, -50, 48, -32, 16, p.color);
    ctx.restore();
    ctx.restore();
  },
};
