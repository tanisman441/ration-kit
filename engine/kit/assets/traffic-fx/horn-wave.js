// traffic-fx/horn-wave — korna: boru ağzından sürekli yayılan ses dalgaları, at anında güçlü üfürüm.
// ANIMASYON: canlı idle dalga yayılımı (1.2 sn döngü, 2 halka); `at` anında 0.6 sn sarsıntılı patlama.
// Tek vurgu: color paramı (varsayılan yellow).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'horn-wave',
  category: 'traffic-fx',
  desc: 'Korna borusu; idle ses dalgaları yayar, at anında güçlü patlama yapar',
  tags: ['korna', 'ses', 'dalga', 'sinyal sesi', 'uyarı', 'gürültü', 'horn', 'sound', 'wave', 'beep', 'warning', 'noise'],
  box: [-110, -80, 160, 80],
  bleed: 40,
  anchor: 'boru gövde merkezi (0,0)',
  points: { bell: [90, 0], throat: [-70, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'korna patlaması: 0.6 sn sarsıntı + büyük halkalar' },
    color: { type: 'color', default: 'yellow', desc: 'ses dalgası rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const blasting = d >= 0 && d < 0.6;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // patlama sarsıntısı
    const shake = blasting ? Math.sin(d * 60) * 3 * (1 - d / 0.6) : 0;
    const breathe = k.noise1(t * 1.5) * 0.015;
    ctx.save();
    ctx.translate(shake, 0); ctx.scale(1 + breathe, 1 + breathe);

    // --- boru gövdesi: koni ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath();
    ctx.moveTo(-64, -8); ctx.lineTo(96, -36); ctx.lineTo(96, 48); ctx.lineTo(-64, 20);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath();
    ctx.moveTo(-70, -14); ctx.lineTo(90, -42); ctx.lineTo(90, 42); ctx.lineTo(-70, 14);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-30, -16, 20, 8, -0.3, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-70, -14); ctx.lineTo(90, -42); ctx.lineTo(90, 42); ctx.lineTo(-70, 14);
    ctx.closePath(); ctx.stroke();

    // --- ağız: iç karanlık + dış halka ---
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.ellipse(90, 0, 8, 42, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba(p.color, blasting ? 0.9 : 0.5);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(90, 0, 8, 42, 0, 0, k.TAU); ctx.stroke();
    if (blasting) k.glow(90, 0, 40, p.color, 0.5 * (1 - d / 0.6));

    // --- montaj: arka kapak ---
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); k.rrect(-88, -16, 20, 32, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6);
    ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-88, -16, 20, 32, 8); ctx.stroke();
    ctx.restore();

    // --- ses dalgaları: ağızdan sağa yayılan yaylar (idle) + patlama halkaları ---
    for (let i = 0; i < 2; i++) {
      const ph = ((t / 1.2) + (i / 2)) % 1;
      const r = 42 + 56 * ph;
      ctx.strokeStyle = k.rgba(p.color, 0.5 * (1 - ph));
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(98 + shake, 0, r, -1.0, 1.0); ctx.stroke();
    }
    if (blasting) {
      for (let i = 0; i < 3; i++) {
        const q = k.prog(d - i * 0.12, 0, 0.55);
        if (q < 0 || q > 1) continue;
        const r = 42 + 56 * q;
        ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - q));
        ctx.lineWidth = 7 * (1 - q) + 2;
        ctx.beginPath(); ctx.arc(98 + shake, 0, r, -1.0, 1.0); ctx.stroke();
      }
    }
  },
};
