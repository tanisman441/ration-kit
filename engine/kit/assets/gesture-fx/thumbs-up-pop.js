// gesture-fx/thumbs-up-pop — yukarı bakan başparmak eli; `pop` anında yaylanarak belirir, halka saçar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) el merkezidir.
export default {
  name: 'thumbs-up-pop',
  category: 'gesture-fx',
  desc: 'Yukarı bakan başparmak eli; belirdiğinde yaylanarak pop olur, halka saçar',
  tags: ['başparmak', 'beğeni', 'onay', 'thumbs up', 'like', 'approve', 'el', 'güzel'],
  box: [-120, -120, 120, 120],
  bleed: 55,
  anchor: 'el merkezi (0,0)',
  points: { top: [-32, -72], center: [0, 14] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'el rengi' },
    pop: { type: 'time', default: null, desc: 'belirme anı: 0.35 sn yaylı pop + halka' },
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

    // ANİMASYON — idle: hafif nefes eğimi; `pop`: 0.35 sn'de outBack ile 0→1 ölçeklenir, eğilip oturur, halka saçar
    const d = p.pop == null ? -1 : t - p.pop;
    let s = 1, tilt = 0.03 * Math.sin(t * k.TAU / 2.4), ring = 0, flash = 0;
    if (d >= 0 && d < 0.6) {
      if (d < 0.35) {
        s = Math.max(0.001, k.E.outBack(d / 0.35, 1.8));
        tilt = -0.14 * (1 - d / 0.35);
      }
      ring = Math.max(0, 1 - d / 0.35);
      flash = Math.max(0, 1 - d / 0.18);
    }

    ctx.save();
    ctx.rotate(tilt); ctx.scale(s, s);
    blob(-48, -8, 90, 66, 20, p.color);           // yumruk
    sheen(-24, -22, 20, 10);
    disc(28, 8, 13, 13, p.color);                 // boğumlar
    disc(28, 32, 12, 12, p.color);
    limb(-30, -8, -34, -62, 26, p.color);         // başparmak
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-44, -4); ctx.quadraticCurveTo(-28, 12, -44, 30); ctx.stroke();
    ctx.restore();

    if (flash > 0) k.glow(-30, -20, 90 * (1 - flash) + 40, 'accent', 0.45 * flash);
    if (ring > 0) {
      const g = 1 - ring;
      ctx.strokeStyle = k.rgba('accent', 0.85 * ring); ctx.lineWidth = 6 * ring + 2;
      ctx.beginPath(); ctx.arc(-30, -10, 62 + g * 62, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
