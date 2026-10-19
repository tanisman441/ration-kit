// icons/heart-like — kalp; boşta nabız gibi atar, beat anında büyür + kırmızı glow.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) kalbin merkezine yakındır.
export default {
  name: 'heart-like',
  category: 'icons',
  desc: 'Kırmızı kalp; boşta yavaş nabızla atar, beat anında büyür ve kırmızı ışık saçar',
  tags: ['kalp', 'beğeni', 'heart', 'like', 'aşk', 'love', 'favori', 'favorite', 'icon'],
  box: [-95, -85, 95, 90],
  bleed: 60,
  anchor: 'kalp merkezi (0,0)',
  points: { top: [0, -52], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'red', desc: 'kalp rengi' },
    beat: { type: 'time', default: null, desc: 'kalp atışı anı: 0.45 sn büyüme + glow' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const heart = (dx = 0, dy = 0) => {
      ctx.beginPath();
      ctx.moveTo(dx, dy + 52);
      ctx.bezierCurveTo(dx - 88, dy - 4, dx - 54, dy - 52, dx, dy - 22);
      ctx.bezierCurveTo(dx + 54, dy - 52, dx + 88, dy - 4, dx, dy + 52);
      ctx.closePath();
    };
    // ANIMASYON 1 — idle: yavaş kalp nabzı (lub-dub: iki vuruşluk döngü, 1.2 sn)
    const ph = (t / 1.2) % 1;
    const lub = Math.exp(-Math.pow((ph - 0.08) * 9, 2)) + 0.6 * Math.exp(-Math.pow((ph - 0.32) * 9, 2));
    // ANIMASYON 2 — beat olayı: 0.45 sn güçlü atış + kırmızı glow
    const d = p.beat == null ? -1 : t - p.beat;
    let big = 0;
    if (d >= 0 && d < 0.45) big = Math.exp(-7 * d) * Math.cos(14 * d);
    const s = 1 + 0.03 * lub + 0.18 * Math.max(0, big);
    ctx.save(); ctx.scale(s, s);
    // kalp gövdesi (gölge + hat + dolgu)
    ctx.fillStyle = sh(p.color); heart(6, 7); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O; heart(0, 0); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); heart(0, 0); ctx.fill();
    // sol üst parlama (sol lob üzerinde)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-26, -26, 18, 10, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();
    // nabız glow'u + beat flaşı
    k.glow(0, -6, 80, p.color, 0.12 + 0.12 * lub + 0.35 * Math.max(0, big));
  },
};
