// ocean-fx/sonar-ripple — sonar kaynağı etrafında yayılan dalga halkaları.
// at anında (0.9 sn) 3 halka merkezden dışa büyüyüp solar; boşta her
// ~2.4 sn'de bir hafif halka nabzı atar (idle ping).
// NOT: canvas y-aşağıdır; (0,0) sonar merkezidir.
export default {
  name: 'sonar-ripple', category: 'ocean-fx',
  desc: 'Sonar nabzı gibi merkezden yayılan halka dalgaları, at anında güçlü patlar',
  tags: ['sonar', 'halka', 'dalga', 'nabız', 'radar', 'ping', 'ripple', 'echo', 'pulse', 'waves'],
  box: [-130, -130, 130, 130],
  bleed: 40,
  anchor: 'sonar merkezi (0,0)',
  points: { centre: [0, 0], edge: [110, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'sonar dalgası yayılma anı (0.9 sn, 3 halka)' },
    color: { type: 'color', default: 'cyan', desc: 'halka rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const rings = [];
    // Olay: at varsa 3 güçlü halka
    const ad = p.at == null ? -1 : t - p.at;
    if (ad >= 0 && ad < 0.9) {
      for (let i = 0; i < 3; i++) {
        const rt = ad - i * 0.14;             // ardışık halka gecikmesi
        if (rt < 0) continue;
        const prog = rt / 0.9;
        rings.push({ r: 20 + prog * 105, a: (1 - prog) * 0.9, w: 7 - prog * 3 });
      }
    } else {
      // Idle: ~2.4 sn periyotta tek hafif halka nabzı
      const cyc = 2.4, ph = (t % cyc) / cyc;
      rings.push({ r: 16 + ph * 95, a: (1 - ph) * 0.45, w: 4 });
    }

    for (const rg of rings) {
      if (rg.a <= 0.01) continue;
      ctx.strokeStyle = k.rgba(acc, rg.a); ctx.lineWidth = rg.w;
      ctx.beginPath(); ctx.arc(0, 0, rg.r, 0, k.TAU); ctx.stroke();
      // halka parlaması: at olayında ikinci zayıf halka
      if (ad >= 0 && ad < 0.9) {
        ctx.strokeStyle = k.rgba(acc, rg.a * 0.35); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, rg.r + 12, 0, k.TAU); ctx.stroke();
      }
    }

    // Kaynak: sonar düğmesi (nabızla büyüyen çekirdek)
    const pulse = ad >= 0 && ad < 0.9 ? Math.sin((ad / 0.9) * Math.PI) : 0.15 * Math.sin(t * k.TAU / 2.4);
    const cr = 16 * (1 + pulse * 0.35);
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.arc(0, 0, cr, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 0, cr, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-cr * 0.35, -cr * 0.35, cr * 0.32, cr * 0.24, -0.5, 0, k.TAU); ctx.fill();
    // iç nokta: parlak çekirdek
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath(); ctx.arc(0, 0, cr * 0.42, 0, k.TAU); ctx.fill();
    k.glow(0, 0, 34 * (1 + pulse * 0.6), acc, 0.28 + pulse * 0.2);

    ctx.restore();
  },
};
