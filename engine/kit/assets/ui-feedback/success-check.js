// ui-feedback/success-check — at anında tik çizilerek belirir + halka patlaması; idle'da yumuşak nabız.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'success-check',
  category: 'ui-feedback',
  desc: 'Başarı onayı: at anında tik çizilerek belirir, halka patlar',
  tags: ['başarı', 'tik', 'onay', 'doğru', 'tamam', 'success', 'check', 'tick', 'approved', 'ui'],
  box: [-80, -80, 80, 80],
  bleed: 44,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'onay anı: tik çizilir + halka patlaması' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const R = 48, LW = 11;

    // idle: yumuşak nabız (2.4 sn)
    const pulse = 1 + 0.025 * Math.sin((t * k.TAU) / 2.4);
    // olayda halka yaylanır: hafif küçül, outBack ile geri (pop)
    let pop = 1;
    if (d >= 0 && d < 0.4) pop = 0.65 + 0.35 * k.E.outBack(k.clamp(d / 0.35, 0, 1));

    ctx.save();
    ctx.scale(pulse * pop, pulse * pop);

    // sağ alt gölge
    ctx.lineWidth = LW;
    ctx.strokeStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); ctx.arc(4, 5, R, 0, k.TAU); ctx.stroke();
    // halka
    if (d >= 0) k.glow(0, 0, R + 14, p.color, 0.35);
    ctx.strokeStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();
    // sol üst parlama (premium, alfa 0.11)
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.arc(0, 0, R - 8, -Math.PI * 0.85, -Math.PI * 0.35); ctx.stroke();

    ctx.restore();

    // patlama parçacıkları (0.55 sn)
    if (d >= 0 && d < 0.55) {
      const e = d / 0.55;
      ctx.save();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * k.TAU + k.hash(i * 3.7);
        const rr = R + 4 + e * 56;
        ctx.globalAlpha = (1 - e) * 0.9;
        ctx.fillStyle = i % 3 === 0 ? k.rgba('yellow') : k.rgba(p.color);
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 5 * (1 - e * 0.5), 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    }

    // tik: 0.28 sn'de çizilerek belirir, sonra kalır
    if (d >= 0) {
      const te = k.E.outCubic(k.clamp(d / 0.28, 0, 1));
      ctx.save();
      ctx.strokeStyle = k.rgba('ink', 0.92);
      ctx.lineWidth = 11;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const p1 = [-21, 1], p2 = [-6, 17], p3 = [23, -15];
      const l1 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const l2 = Math.hypot(p3[0] - p2[0], p3[1] - p2[1]);
      const total = (l1 + l2) * te;
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]);
      if (total <= l1) {
        const f = l1 > 0 ? total / l1 : 0;
        ctx.lineTo(p1[0] + (p2[0] - p1[0]) * f, p1[1] + (p2[1] - p1[1]) * f);
      } else {
        ctx.lineTo(p2[0], p2[1]);
        const f = l2 > 0 ? (total - l1) / l2 : 0;
        ctx.lineTo(p2[0] + (p3[0] - p2[0]) * f, p2[1] + (p3[1] - p2[1]) * f);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
};
