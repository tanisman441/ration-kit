// aquarium-fx/air-bubbles — akvaryum havalandırma taşı: tabandan döngülü
// yükselen kabarcıklar (idle, ~1.8 sn periyot), tepeye yakın patlar;
// burst anında (0.5 sn) köpük dalgası yükselir.
// NOT: canvas y-aşağıdır; (0,0) taşın tabanıdır.
export default {
  name: 'air-bubbles', category: 'aquarium-fx',
  desc: 'Havalandırma taşından yükselen kabarcık akıntısı, tepeye ulaşan kabarcık patlar',
  tags: ['kabarcık', 'hava', 'havalandırma', 'köpük', 'akvaryum', 'bubble', 'air', 'aerator', 'rising', 'aquarium'],
  box: [-55, -180, 55, 25],
  bleed: 25,
  anchor: 'havalandırma taşının tabanı (0,0)',
  points: { base: [0, 0], top: [0, -170] },
  params: {
    burst: { type: 'time', default: null, desc: 'köpük patlaması anı (0.5 sn, köpük dalgası yükselir)' },
    color: { type: 'color', default: 'cyan', desc: 'kabarcık rengi' },
    density: { type: 'number', default: 1, desc: 'kabarcık yoğunluğu çarpanı (0.3–2)' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const dn = p.density == null ? 1 : p.density;
    ctx.save();
    ctx.lineCap = 'round';

    // havalandırma taşı: gözenekli küçük kaya
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(-32, -14, 64, 32, 14); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(-32, -14, 64, 32, 14); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -7, 10, 5, -0.3, 0, k.TAU); ctx.fill();
    // gözenek delikleri
    ctx.fillStyle = k.rgba('bg', 0.5);
    for (let i = 0; i < 5; i++) {
      const h = k.hash(i * 7.7);
      ctx.beginPath(); ctx.arc(-20 + h * 40, -8 + (h * 37 % 1) * 12, 2.5, 0, k.TAU); ctx.fill();
    }

    // kabarcıklar: 1.8 sn döngüde yükselir, büyür, tepede patlar
    const N = Math.max(3, Math.min(12, Math.round(8 * dn)));
    for (let i = 0; i < N; i++) {
      const h = k.hash(i * 23.1 + 4);
      const cyc = 1.8, off = h * cyc;
      const ph = ((t + off) % cyc) / cyc;
      const swayX = k.noise1(i * 5.9 + t * 0.8) * 12 * ph;
      const x = (h - 0.5) * 42 + swayX;
      const y = -16 - ph * 152;
      const r = 3 + h * 5 + ph * 4;
      const pop = ph > 0.9 ? (ph - 0.9) / 0.1 : 0;
      const alpha = 0.8 * (1 - pop);
      if (alpha <= 0) continue;
      const rr = r * (1 + pop * 0.6);
      ctx.strokeStyle = k.rgba(acc, alpha); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath(); ctx.arc(x - rr * 0.35, y - rr * 0.35, Math.max(1, rr * 0.22), 0, k.TAU); ctx.fill();
    }

    // burst: köpük dalgası (0.5 sn)
    const bd = p.burst == null ? -1 : t - p.burst;
    if (bd >= 0 && bd < 0.5) {
      const prog = bd / 0.5;
      const wy = -16 - prog * 150;
      ctx.strokeStyle = k.rgba(acc, (1 - prog) * 0.8); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, wy, 20 + prog * 20, 8, 0, 0, k.TAU); ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 51.9);
        ctx.strokeStyle = k.rgba(acc, (1 - prog) * 0.7); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc((h - 0.5) * 52, -16 - prog * (50 + h * 100), 2.5 + h * 3.5, 0, k.TAU); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
