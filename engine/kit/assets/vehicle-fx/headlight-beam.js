// vehicle-fx/headlight-beam — far hüzmesi: idle'da hafif titreme, flash anında 0.3 sn uzun far patlaması.
// NOT: canvas y-aşağıdır; far merceği (0,0), hüzme +x yönünde uzar.
export default {
  name: 'headlight-beam',
  category: 'vehicle-fx',
  desc: 'Far hüzmesi: hafif titreyen ışık konisi; flash anında 0.3 sn uzun far patlaması',
  tags: ['far', 'hüzme', 'ışık', 'gece', 'sürüş', 'araba', 'headlight', 'beam', 'light', 'night', 'driving', 'car'],
  box: [-56, -92, 330, 92],
  bleed: 70,
  anchor: 'far merceği (0,0); hüzme sağa uzar',
  points: { lamp: [0, 0], beamtip: [300, 0] },
  params: {
    flash: { type: 'time', default: null, desc: 'uzun far patlaması anı (0.3 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.flash == null ? -1 : t - p.flash;
    const flashing = d >= 0 && d <= 0.32;
    const burst = flashing ? 1 - d / 0.32 : 0;
    // idle titreme: ışınımda doğal dalgalanma (canlı idle)
    const flick = 1 + k.noise1(t * 5.5) * 0.05 + k.noise1(t * 13.7 + 5) * 0.03;
    const L = 280 * flick + burst * 90;         // hüzme boyu
    const spread = 62 + burst * 26;            // uç genişliği
    const al = 0.30 * flick + burst * 0.32;    // hüzme yoğunluğu

    // 1) hüzme: iki katmanlı koni (dış yumuşak + iç çekirdek)
    const beam = (alphaMul, lenF, wF) => {
      ctx.fillStyle = k.rgba(p.color, Math.min(al * alphaMul, 0.9));
      ctx.beginPath();
      ctx.moveTo(24, -16 * wF);
      ctx.lineTo(24 + L * lenF, -spread * wF);
      ctx.lineTo(24 + L * lenF, spread * wF);
      ctx.lineTo(24, 16 * wF);
      ctx.closePath();
      ctx.fill();
    };
    beam(1, 1, 1);
    beam(1.4, 0.72, 0.62);

    // 2) far gövdesi + mercek
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 6;
    k.rrect(-52, -34, 84, 68, 16);
    ctx.fill(); ctx.stroke();
    // mercek: parlak iç (flash'ta daha parlak)
    ctx.fillStyle = k.rgba(p.color, 0.55 + 0.45 * burst);
    ctx.beginPath(); ctx.arc(-10, 0, 22, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(-16, -8, 8, 5, -0.5, 0, k.TAU); ctx.fill();
    // sol üst parlama (premium finish) — gövdede
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, -20, 30, 12, -0.4, 0, k.TAU); ctx.fill();

    // 3) flash anı: mercekte patlama + ışın çizgileri (0.3 sn net olay)
    if (flashing) {
      k.glow(-10, 0, 90 + 60 * burst, p.color, 0.2 + 0.4 * burst);
      ctx.strokeStyle = k.rgba(p.color, 0.85 * burst);
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const a = -0.5 + i * 0.25 + k.noise1(t * 9 + i * 2) * 0.06;
        const r0 = 30, r1 = 52 + 26 * burst;
        ctx.beginPath();
        ctx.moveTo(-10 + Math.cos(a) * r0, Math.sin(a) * r0);
        ctx.lineTo(-10 + Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
