// wind-fx/dust-blow — toz savrulması: sakin toz zerreleri + blow anında sağa savrulan toz bulutu.
// NOT: canvas y-aşağıdır; (0,0) toz kaynağıdır, savrulma +x yönünedir.
export default {
  name: 'dust-blow', category: 'wind-fx',
  desc: 'Toz savrulması: havada süzülen sakin zerreler, blow anında girdaplı toz bulutu sağa savrulur',
  tags: ['toz', 'savrulma', 'bulut', 'girdap', 'rüzgar', 'dust', 'blow', 'cloud', 'swirl', 'wind'],
  box: [-110, -100, 180, 90],
  bleed: 40,
  anchor: 'toz kaynağı (0,0)',
  points: { source: [0, 0], drift: [150, 0] },
  params: {
    blow: { type: 'time', default: null, desc: 'toz savrulma anı (0.9 sn: toz bulutu girdapla sağa savrulur)' },
    color: { type: 'color', default: 'yellow' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: bulut büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.blow == null ? -1 : t - p.blow;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- sakin toz zerreleri (sürekli süzülme, idle) ---
    for (let i = 0; i < 8; i++) {
      const h1 = k.hash(i * 11 + 2), h2 = k.hash(i * 23 + 5);
      const x = -90 * S + h1 * 200 * S + 18 * S * k.noise1(t * 0.7 + i * 3);
      const y = -70 * S + h2 * 140 * S + 14 * S * k.noise1(t * 0.9 + i * 7);
      ctx.fillStyle = k.rgba('dim', 0.28 + 0.14 * k.noise1(t * 1.3 + i));
      ctx.beginPath(); ctx.arc(x, y, (2.5 + 2.5 * h2) * S, 0, k.TAU); ctx.fill();
    }

    if (d >= 0 && d < 0.9) {
      const bp = k.prog(d, 0, 0.9);
      const fade = 1 - bp;

      // --- genişleyen toz yumakları (3 elips, büyür + solar) ---
      for (let i = 0; i < 3; i++) {
        const h = k.hash(i * 37 + 1);
        const cx = (10 + 130 * k.E.outCubic(bp)) * S + (h - 0.5) * 90 * S * bp;
        const cy = (-55 + 80 * h) * S - 30 * S * bp * h;
        const rw = (30 + 60 * bp) * S, rh = (17 + 28 * bp) * S;
        ctx.fillStyle = k.rgba('dim', 0.36 * fade);
        ctx.beginPath(); ctx.ellipse(cx, cy, rw, rh, 0.15 * (i - 1), 0, k.TAU); ctx.fill();
        // yumak üstü parlama
        ctx.fillStyle = k.rgba('bg', 0.08 * fade);
        ctx.beginPath(); ctx.ellipse(cx - rw * 0.3, cy - rh * 0.35, rw * 0.4, rh * 0.3, 0, 0, k.TAU); ctx.fill();
      }

      // --- girdaplı zerre fırtınası (16 zerre, spiral savrulma) ---
      for (let i = 0; i < 16; i++) {
        const h1 = k.hash(i * 13 + 3), h2 = k.hash(i * 29 + 11), h3 = k.hash(i * 41 + 17);
        const r = (20 + 150 * k.E.outCubic(bp)) * S;
        const ang = h1 * k.TAU + bp * (2.5 + 3 * h2);
        const x = Math.cos(ang) * r * (0.9 + 0.4 * h3) + 20 * S;
        const y = Math.sin(ang) * r * 0.45 - 25 * S * bp;
        const sz = (2 + 4.5 * h2 * (1 - bp * 0.5)) * S;
        ctx.fillStyle = k.rgba(h3 > 0.6 ? p.color : 'dim', (0.55 + 0.4 * h1) * fade);
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      }

      // --- savrulma yön çizgileri (bulutun içinden geçerek sağa) ---
      ctx.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 53 + 7);
        const yy = (-60 + h * 120) * S - 10 * S * bp;
        const x0 = -60 * S + bp * 240 * S * (0.75 + 0.5 * h);
        ctx.strokeStyle = k.rgba(p.color, 0.45 * fade);
        ctx.lineWidth = 2.5 * S;
        ctx.beginPath();
        ctx.moveTo(x0 - 36 * S * fade, yy);
        ctx.lineTo(x0, yy + 5 * S * Math.sin(t * 8 + i * 2));
        ctx.stroke();
      }
    }

    ctx.restore();
  },
};
