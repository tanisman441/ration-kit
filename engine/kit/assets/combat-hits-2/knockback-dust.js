// combat-hits-2/knockback-dust — savrulma anı: yükselen toz bulutu, arkadan gelen hız çizgileri, yer halkası.
// NOT: canvas y-aşağıdır; (0,0) darbenin alındığı nokta (toz buradan yükselir).
export default {
  name: 'knockback-dust', category: 'combat-hits-2',
  desc: 'Savrulma efekti: darbe anında yükselen toz bulutu, hız çizgileri ve yer şok halkası',
  tags: ['savrulma', 'toz', 'hız', 'çarpışma', 'darbe', 'bulut', 'knockback', 'dust', 'speed', 'impact', 'cloud'],
  box: [-160, -120, 140, 120],
  bleed: 60,
  anchor: 'darbenin alındığı nokta (0,0)',
  points: { hit: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'savrulma anı (toz + hız çizgileri, ~0.8 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d <= 1.0;

    // idle: yer çizgisi havasında tek ince gösterge
    ctx.save();
    ctx.strokeStyle = k.rgba('ink', 0.14);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-46, 52); ctx.lineTo(46, 52); ctx.stroke();
    ctx.restore();

    if (active) {
      ctx.save();
      // 1) toz pufları — yukarı ve dışa şişer, 0.8 sn'de dağılır
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 5 + 51), h2 = k.hash(i * 9 + 97), h3 = k.hash(i * 13 + 23);
        const life = 0.55 + h2 * 0.35;
        if (d > life) continue;
        const lg = k.prog(d, 0, life);
        const dir = h1 < 0.5 ? -1 : 1;
        const x0 = (h1 - 0.5) * 130;
        const x = x0 + dir * 34 * k.E.outCubic(lg);
        const y = 30 - (44 + h3 * 66) * k.E.outCubic(lg);
        const r = (13 + h3 * 15) * (1 + lg * 1.9);
        const alpha = 0.5 * (1 - lg) * (0.7 + 0.3 * h2);
        ctx.fillStyle = k.rgba(p.color, alpha);
        ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
        // iç açık nokta — pufun hacmi
        ctx.fillStyle = k.rgba('bg', 0.16 * (1 - lg));
        ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.45, 0, k.TAU); ctx.fill();
      }
      // 2) hız çizgileri — darbe yönünde (sağa) uzayan 6 çizgi
      const sg = k.prog(d, 0, 0.38);
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 7 + 71), h2 = k.hash(i * 11 + 13);
        const y = -64 + h1 * 118;                          // y-aşağı: -64 yukarı, +54 aşağı
        const len = (90 + h2 * 80) * k.E.outCubic(k.clamp(sg * 1.6, 0, 1));
        const alpha = 0.42 * (1 - k.prog(d, 0.18, 0.5)) * (0.6 + 0.4 * h2);
        if (alpha <= 0.01 || len <= 1) continue;
        ctx.strokeStyle = k.rgba('ink', alpha);
        ctx.lineWidth = 3.5 + h1 * 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(28, y);
        ctx.lineTo(28 + len, y - 4);
        ctx.stroke();
      }
      // 3) yer şok halkası — eliptik, 0.45 sn
      if (d > 0.03) {
        const g = k.prog(d - 0.03, 0, 0.42);
        ctx.strokeStyle = k.rgba(p.color, 0.5 * (1 - g));
        ctx.lineWidth = 5 * (1 - g * 0.6) + 1;
        ctx.beginPath(); ctx.ellipse(0, 52, 20 + 105 * k.E.outExpo(g), 9 + 26 * k.E.outExpo(g), 0, 0, k.TAU); ctx.stroke();
      }
      ctx.restore();
    }
  },
};
