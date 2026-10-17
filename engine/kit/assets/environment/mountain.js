// environment/mountain — dağ; iki katmanlı, karlı zirveler.
// NOT: canvas y-aşağıdır; zemin (0,0).
export default {
  name: 'mountain',
  category: 'environment',
  desc: 'Dağ; iki katmanlı silüet, karlı zirveler ve tabanda iki çam',
  tags: ['dağ', 'zirve', 'kar', 'doğa', 'manzara', 'mountain', 'peak', 'snow', 'nature', 'landscape'],
  box: [-280, -250, 280, 20],
  bleed: 0,
  anchor: 'zemin (0,0)',
  points: { peak: [90, -242] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    const snow = `rgb(${base.map(v => Math.round(v + (255 - v) * 0.62)).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const mtn = (x0, y0, px, py, x1, c) => {
      ctx.fillStyle = line; ctx.beginPath();
      ctx.moveTo(x0 - LW / 2, y0 + LW); ctx.lineTo(px, py - LW / 2); ctx.lineTo(x1 + LW / 2, y0 + LW);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(x0, y0); ctx.lineTo(px, py); ctx.lineTo(x1, y0);
      ctx.closePath(); ctx.fill();
    };
    // kar başlığı: zirveden iki yana, alt kenarı zigzaglı
    const cap = (px, py, w, drop) => {
      ctx.fillStyle = snow; ctx.beginPath();
      ctx.moveTo(px, py - 3);
      ctx.lineTo(px - w, py + drop);
      const n = 7;
      for (let i = 1; i <= n; i++) {
        const x = px - w + (2 * w * i) / n;
        const y = py + drop - (i % 2 ? drop * 0.38 : 0);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(px, py - 3);
      ctx.closePath(); ctx.fill();
    };
    const pine = (x, s) => {
      ctx.fillStyle = line; ctx.beginPath();
      ctx.moveTo(x - 16 * s - 2, -2); ctx.lineTo(x, -52 * s - 4); ctx.lineTo(x + 16 * s + 2, -2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath();
      ctx.moveTo(x - 16 * s, 0); ctx.lineTo(x, -52 * s); ctx.lineTo(x + 16 * s, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = line; ctx.fillRect(x - 3 * s - 1, -8, 6 * s + 2, 10);
      ctx.fillStyle = dark; ctx.fillRect(x - 3 * s, -8, 6 * s, 8);
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 270, 10, 0, 0, k.TAU); ctx.fill();

    // arka dağ (koyu)
    mtn(-280, 4, -110, -198, 40, dark);
    cap(-110, -198, 44, 46);
    // ön dağ (ana renk)
    mtn(-60, 4, 90, -242, 280, body);
    cap(90, -242, 52, 58);

    // premium parlama (ön dağın sol yamacı)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    ctx.moveTo(-30, -8); ctx.lineTo(66, -196); ctx.lineTo(90, -238); ctx.lineTo(38, -120); ctx.lineTo(-8, -30);
    ctx.closePath(); ctx.fill();

    // tabanda iki çam (ölçek hissi)
    pine(-196, 1.15);
    pine(212, 0.9);
  },
};
