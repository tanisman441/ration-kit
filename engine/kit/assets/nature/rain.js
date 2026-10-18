// nature/rain — yağmur bulutu; intensity ile damla yoğunluğu, damlalar sürekli yağar, bulut hafif titrer.
// NOT: canvas y-aşağıdır; bulut merkezde, damlalar alta düşer.
export default {
  name: 'rain',
  category: 'nature',
  desc: 'Yağmur bulutu; intensity ile damla yoğunluğu ayarlanır, damlalar sürekli yağar',
  tags: ['yağmur', 'bulut', 'damla', 'hava', 'yağış', 'rain', 'cloud', 'drops', 'weather', 'storm'],
  box: [-140, -120, 140, 175],
  bleed: 24,
  anchor: 'bulut merkezi (0,-55); damlalar y=160 civarına düşer',
  points: { top: [0, -100] },
  params: {
    color: { type: 'color', default: 'dim' },
    drop: { type: 'color', default: 'cyan' },
    intensity: { type: 'number', default: 0.7, desc: 'yağış şiddeti 0–1: damla yoğunluğu' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const inten = k.clamp(p.intensity, 0, 1);

    // idle: bulut nefes alır + hafif titrer
    const bobY = Math.sin(t * 2.1) * 2.5;
    const bobX = k.noise1(t * 1.1) * 2.5;

    // damlalar: hash ile sabit konumlar, t ile düşer
    const ND = 26;
    const fallH = 210, topY = -30;
    ctx.lineWidth = 5;
    for (let i = 0; i < ND; i++) {
      if (k.hash(i * 13.7 + 2) > inten) continue;      // intensity: damla yoğunluğu
      const x0 = -115 + k.hash(i * 3.1) * 230;
      const speed = 150 + k.hash(i * 7.7) * 110;      // px/sn
      const yy = topY + ((t * speed + k.hash(i * 9.3) * fallH) % fallH);
      const slant = -6 - inten * 6;                    // hafif eğik yağış
      const alpha = 0.35 + 0.45 * inten;
      ctx.strokeStyle = k.rgba(p.drop, alpha);
      ctx.beginPath();
      ctx.moveTo(x0 + bobX * 0.3, yy);
      ctx.lineTo(x0 + bobX * 0.3 + slant, yy + 22);
      ctx.stroke();
    }

    // bulut gövdesi (üst üste binmiş diskler)
    const disc = (x, y, r, c, sheen) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
    };

    ctx.save();
    ctx.translate(bobX, bobY);
    const bc = k.rgba(p.color), bd = darker(p.color);
    // gölge katmanı (sağ alta 5 birim ofset, %12 koyultma)
    const blobs = [
      [-70, -52, 34], [-30, -68, 44], [12, -70, 42], [52, -60, 36], [84, -48, 28],
      [-45, -36, 28], [5, -34, 30], [48, -34, 26],
    ];
    for (const [x, y, r] of blobs) disc(x + 5, y + 6, r, bd, false);
    // ana gövde
    blobs.forEach(([x, y, r], i) => disc(x, y, r, bc, i === 1 || i === 2));
    ctx.restore();
  },
};
