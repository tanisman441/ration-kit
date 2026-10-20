// gesture-fx/pinch-zoom — sıkıştırma hareketi yapan iki parmak; `at` anında kapanır, halka patlatır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) sıkıştırma merkezidir.
export default {
  name: 'pinch-zoom',
  category: 'gesture-fx',
  desc: 'Sıkıştırma hareketi yapan iki parmak; sıkıştırma anında kapanır, halka ve çizgiler patlatır',
  tags: ['sıkıştır', 'yakınlaştır', 'uzaklaştır', 'pinch', 'zoom', 'parmak', 'iki parmak'],
  box: [-125, -125, 125, 125],
  bleed: 50,
  anchor: 'sıkıştırma merkezi (0,0)',
  points: { center: [0, 0], fingerTop: [14, -30], fingerBottom: [14, 30] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'parmak rengi' },
    at: { type: 'time', default: null, desc: 'sıkıştırma anı: parmaklar kapanır, halka patlar' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = 6, OUT = k.rgba('bg', 0.55);
    const sh = (n, f = 0.88) => { const c = k.col(n); return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`; };
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

    // ANİMASYON — idle: parmaklar nefes gibi hafif açılıp kapanır; `at`: 0.18 sn'de 22 birim kapanır, yayla geri açılır
    const d = p.at == null ? -1 : t - p.at;
    let q = 2 + 2 * Math.sin(t * k.TAU / 2.2), ring = 0;
    if (d >= 0 && d < 0.8) {
      if (d < 0.18) q = 2 + 20 * k.E.inOutCubic(d / 0.18);
      else q = 2 + 20 * (1 - k.E.outBack((d - 0.18) / 0.62, 1.6));
      ring = Math.max(0, 1 - (d - 0.14) / 0.45);
    }

    const ty = -30 + q, by = 30 - q;

    // kesik çizgili kılavuz çember (yakınlaştırma hissi)
    ctx.save();
    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 38 - q * 0.45, 0, k.TAU); ctx.stroke();
    ctx.restore();

    // üst parmak (aşağı bakar)
    limb(50, -104, 18, ty + 2, 26, p.color);
    disc(38, -80, 14, 13, p.color);
    disc(16, ty, 15, 15, p.color);
    sheen(8, ty - 6, 10, 6);
    // alt parmak (yukarı bakar)
    limb(50, 104, 18, by - 2, 26, p.color);
    disc(38, 80, 14, 13, p.color);
    disc(16, by, 15, 15, p.color);

    // sıkıştırma patlaması: halka + köşegen çizgiler
    if (ring > 0) {
      const g = 1 - ring;
      ctx.strokeStyle = k.rgba('accent', 0.8 * ring); ctx.lineWidth = 6 * ring + 2;
      ctx.beginPath(); ctx.arc(0, 0, 24 + g * 46, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('accent', 0.55 * ring); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + i * Math.PI / 2, r0 = 34 + g * 46, r1 = r0 + 13;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
        ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
