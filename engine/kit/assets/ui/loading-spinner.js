// ui/loading-spinner — dönen yükleme animasyonu; iz bırakan yay başı.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'loading-spinner',
  category: 'ui',
  desc: 'Dönen yükleme animasyonu; iz bırakan parlak yay başı',
  tags: ['yükleme', 'yükleniyor', 'bekle', 'dönüyor', 'loading', 'spinner', 'wait', 'loader', 'busy'],
  box: [-70, -70, 70, 70],
  bleed: 20,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const R = 44, LW = 13;
    const trackC = k.rgba('dim', 0.3), headC = k.rgba(p.color);
    ctx.lineCap = 'round';
    const a = t * 4.4;                       // ~0.7 tur/sn

    ctx.save();

    // iz: solan yay
    ctx.lineWidth = LW;
    ctx.strokeStyle = trackC;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();

    // dönen baş: 100° yay + glow
    const sweep = 1.75;
    k.glow(Math.cos(a) * R, Math.sin(a) * R, 26, p.color, 0.4);
    ctx.strokeStyle = headC;
    ctx.beginPath(); ctx.arc(0, 0, R, a - sweep, a); ctx.stroke();
    // baş noktası
    ctx.fillStyle = headC;
    ctx.beginPath(); ctx.arc(Math.cos(a) * R, Math.sin(a) * R, LW / 2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
