// ui/progress-ring — ilerleme halkası; ortada yüzde yazar, tamamlanınca parlar.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'progress-ring',
  category: 'ui',
  desc: 'İlerleme halkası; ortada yüzde yazar, %100 olunca kısa parlama yapar',
  tags: ['ilerleme', 'yüzde', 'halka', 'tamamlanma', 'progress', 'ring', 'percent', 'circle', 'loading'],
  box: [-80, -80, 80, 80],
  bleed: 20,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0] },
  params: {
    progress: { type: 'number', default: 0.6, desc: 'ilerleme 0–1' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const R = 52, LW = 14;
    const pr = k.clamp(Number(p.progress ?? 0.6), 0, 1);
    const trackC = k.rgba('dim', 0.3), fillC = k.rgba(p.color), inkC = k.rgba('ink');
    ctx.lineCap = 'round';

    ctx.save();

    // zemin halka
    ctx.lineWidth = LW;
    ctx.strokeStyle = trackC;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();

    // ilerleme yayı (tepeden başlar)
    if (pr > 0.005) {
      const a0 = -Math.PI / 2, a1 = a0 + pr * k.TAU;
      if (pr >= 0.999) k.glow(0, 0, R + 18, p.color, 0.35);
      ctx.strokeStyle = fillC;
      ctx.beginPath(); ctx.arc(0, 0, R, a0, a1); ctx.stroke();
      // yay başı noktası
      ctx.fillStyle = fillC;
      ctx.beginPath(); ctx.arc(Math.cos(a1) * R, Math.sin(a1) * R, LW / 2, 0, k.TAU); ctx.fill();
    }

    // yüzde metni
    ctx.fillStyle = inkC;
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(pr * 100)}`, 0, 2);

    ctx.restore();
  },
};
