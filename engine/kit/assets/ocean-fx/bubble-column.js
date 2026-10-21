// ocean-fx/bubble-column — tabandan yükselen baloncuk sütunu: döngülü
// yükseliş (idle, ~2.2 sn periyot), baloncuklar büyüyüp tepeye yakın patlar.
// burst anında kısa bir "köpürme" dalgası yükselir.
// NOT: canvas y-aşağıdır; (0,0) sütunun tabanıdır.
export default {
  name: 'bubble-column', category: 'ocean-fx',
  desc: 'Tabandan yukarı süzülen baloncuk sütunu, tepeye ulaşan baloncuk patlar',
  tags: ['baloncuk', 'köpük', 'sütun', 'hava kabarcığı', 'sualtı', 'bubble', 'column', 'rising', 'air', 'underwater'],
  box: [-60, -220, 60, 20],
  bleed: 30,
  anchor: 'sütunun tabanı (0,0)',
  points: { base: [0, 0], top: [0, -210] },
  params: {
    burst: { type: 'time', default: null, desc: 'köpürme patlaması anı (0.5 sn, tabandan yukarı dalga)' },
    color: { type: 'color', default: 'cyan', desc: 'baloncuk rengi' },
    density: { type: 'number', default: 1, desc: 'baloncuk yoğunluğu çarpanı (0.3–2)' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // Taban: kayalık zemin bloğu
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(-45, -6, 90, 26, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(-45, -6, 90, 26, 12); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, 1, 16, 6, -0.3, 0, k.TAU); ctx.fill();

    // Baloncuklar: her biri 2.2 sn'lik döngüde yükselir, büyür, tepeye yakın patlar
    const dn = p.density == null ? 1 : p.density;
    const N = Math.max(3, Math.min(14, Math.round(9 * dn)));
    for (let i = 0; i < N; i++) {
      const h = k.hash(i * 13.7 + 1);
      const cyc = 2.2, off = h * cyc;
      const ph = ((t + off) % cyc) / cyc; // 0 taban → 1 tepe
      const swayX = k.noise1(i * 7.1 + t * 0.6) * 14 * ph;
      const x = (h - 0.5) * 55 + swayX;
      const y = -8 - ph * 205;
      const r = 4 + h * 7 + ph * 5;
      const pop = ph > 0.88 ? (ph - 0.88) / 0.12 : 0; // tepeye yakın patlama
      const rr = r * (1 + pop * 0.7);
      const alpha = 0.75 * (1 - pop);
      if (alpha <= 0) continue;
      ctx.strokeStyle = k.rgba(acc, alpha); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; // baloncuk parlaması
      ctx.beginPath(); ctx.arc(x - rr * 0.35, y - rr * 0.35, Math.max(1, rr * 0.22), 0, k.TAU); ctx.fill();
    }

    // burst: tabandan yukarı yayılan köpürme dalgası (0.5 sn)
    const bd = p.burst == null ? -1 : t - p.burst;
    if (bd >= 0 && bd < 0.55) {
      const prog = bd / 0.55;
      const wy = -8 - prog * 190;
      ctx.strokeStyle = k.rgba(acc, (1 - prog) * 0.8); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(0, wy, 30 + prog * 26, 10, 0, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(acc, (1 - prog) * 0.35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, wy, 44 + prog * 30, 16, 0, 0, k.TAU); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const h = k.hash(i * 31.3);
        ctx.strokeStyle = k.rgba(acc, (1 - prog) * 0.7); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc((h - 0.5) * 70, -8 - prog * (60 + h * 130), 3 + h * 4, 0, k.TAU); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
