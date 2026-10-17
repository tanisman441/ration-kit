// fx/portal — dönen enerji portalı: open ile açılan halka, içinde dönen sarmal enerji; active anında parıltı.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'portal', category: 'fx',
  desc: 'Dikey enerji portalı: open ile açılan halka, içinde dönen sarmal enerji, active anında parıltı',
  tags: ['portal', 'geçit', 'kapı', 'enerji', 'ışınlanma', 'teleport', 'büyü', 'sihir', 'portal'],
  box: [-135, -175, 135, 175],
  bleed: 90,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0], top: [0, -162] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'enerji rengi' },
    open: { type: 'number', default: 1, desc: 'portal açıklığı (0–1)' },
    active: { type: 'time', default: null, desc: 'aktivasyon anı (parıltı + genişleyen halka)' },
  },
  draw(ctx, t, p, k) {
    const o = k.clamp(p.open, 0, 1);
    if (o <= 0.01) return;
    const R = 150, RW = 105;
    ctx.lineCap = 'round';

    // dış halka (dış hat + gövde)
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 24;
    ctx.beginPath(); ctx.ellipse(0, 0, RW, R, 0, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim');
    ctx.lineWidth = 16;
    ctx.beginPath(); ctx.ellipse(0, 0, RW, R, 0, 0, k.TAU); ctx.stroke();

    // premium parlama (sol üst halka)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-66, -112, 22, 13, -0.6, 0, k.TAU); ctx.fill();

    // iç karanlık çekirdek
    const rx = RW * o * 0.86, ry = R * o * 0.86;
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.ellipse(0, 0, Math.max(rx, 2), Math.max(ry, 2), 0, 0, k.TAU); ctx.fill();

    // dönen sarmal enerji — 5 renkli yay
    const rot = t * 1.8;
    for (let i = 0; i < 5; i++) {
      const a0 = rot + (i / 5) * k.TAU, a1 = a0 + 1.5;
      ctx.strokeStyle = k.rgba(p.color, 0.75 * o);
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.ellipse(0, 0, rx * 0.8, ry * 0.8, 0, a0, a1); ctx.stroke();
      const am = a0 + 0.75;
      k.glow(Math.cos(am) * rx * 0.8, Math.sin(am) * ry * 0.8, 22, p.color, 0.3 * o);
    }
    k.glow(0, 0, rx, p.color, 0.22 * o);

    // active: parıltı + genişleyen halka
    const d = p.active == null ? -1 : t - p.active;
    if (d >= 0 && d < 0.8) {
      const g = d / 0.8;
      k.glow(0, 0, 80 + 150 * g, p.color, 0.5 * (1 - g));
      ctx.strokeStyle = k.rgba(p.color, 0.8 * (1 - g));
      ctx.lineWidth = 10 * (1 - g * 0.5);
      ctx.beginPath(); ctx.ellipse(0, 0, RW + 95 * g, R + 95 * g, 0, 0, k.TAU); ctx.stroke();
    }
  },
};
