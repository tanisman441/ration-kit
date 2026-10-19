// space/comet — kuyruklu yıldız: parlak çekirdek + parçacık kuyruğu.
// fly anında kuyruk parçacıkları 0.4–0.8 sn'de sönümlenir; boşta kuyruk titrer.
// Vurgu rengi: yellow.
// NOT: canvas y-aşağıdır; (0,0) çekirdektir, kuyruk sola uzanır.
export default {
  name: 'comet', category: 'space',
  desc: 'Kuyruklu yıldız; fly anında parçacık kuyruğu sönümlenir',
  tags: ['kuyruklu yıldız', 'komet', 'uzay', 'comet', 'space', 'göktaşı', 'meteor', 'yıldız kayması'],
  box: [-270, -80, 60, 80],
  bleed: 40,
  anchor: 'çekirdek (0,0); kuyruk sola uzanır',
  points: { head: [0, 0], tail: [-200, 0] },
  params: {
    color: { type: 'color', default: 'yellow' },
    fly: { type: 'time', default: null, desc: 'geçiş anı: 0.8 sn kuyruk parçacık sönümlenmesi' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const core = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // fly zamanlaması: parçacıklar 0.4–0.8 sn arasında sönümlenir
    const d = p.fly == null ? -1 : t - p.fly;
    const burst = d >= 0 && d < 0.8 ? 1 - k.E.inOutCubic(d / 0.8) : (d >= 0 ? 0 : 1);

    ctx.save();

    // kuyruk: iki katman — geniş toz şeridi + dar parlak damar
    const tailLen = 230;
    const shimmer = k.noise1(t * 3.2) * 6;
    const grad = ctx.createLinearGradient(0, 0, -tailLen, 0);
    grad.addColorStop(0, k.rgba('yellow', 0.55 * burst));
    grad.addColorStop(0.5, k.rgba('yellow', 0.25 * burst));
    grad.addColorStop(1, k.rgba('yellow', 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-8, -16);
    ctx.quadraticCurveTo(-tailLen * 0.5, -26 + shimmer, -tailLen, -10 + shimmer * 1.6);
    ctx.lineTo(-tailLen, 10 + shimmer * 1.6);
    ctx.quadraticCurveTo(-tailLen * 0.5, 26 + shimmer, -8, 16);
    ctx.closePath(); ctx.fill();
    // dar parlak damar
    const grad2 = ctx.createLinearGradient(0, 0, -tailLen * 0.7, 0);
    grad2.addColorStop(0, k.rgba('yellow', 0.7 * burst));
    grad2.addColorStop(1, k.rgba('yellow', 0));
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.moveTo(-6, -7);
    ctx.quadraticCurveTo(-tailLen * 0.35, -12 + shimmer * 0.6, -tailLen * 0.7, -4 + shimmer);
    ctx.lineTo(-tailLen * 0.7, 4 + shimmer);
    ctx.quadraticCurveTo(-tailLen * 0.35, 12 + shimmer * 0.6, -6, 7);
    ctx.closePath(); ctx.fill();

    // kuyruk parçacıkları (hash tabanlı; fly anında sönümlenir)
    for (let i = 0; i < 14; i++) {
      const h1 = k.hash(i * 11 + 7), h2 = k.hash(i * 23 + 3);
      const px = -20 - h1 * 200;
      const py = (h2 - 0.5) * (14 + h1 * 34) + Math.sin(t * 4 + h1 * 20) * 4;
      const tw = 0.5 + 0.5 * Math.sin(t * 5 + h2 * k.TAU);
      const a = (0.3 + 0.6 * tw) * burst * (1 - h1 * 0.6);
      ctx.fillStyle = k.rgba('yellow', a);
      ctx.beginPath(); ctx.arc(px, py, 2 + 3 * h2, 0, k.TAU); ctx.fill();
    }

    // çekirdek: parlak disk + glow
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 24 + LW / 2, 0, k.TAU); ctx.fill();
    const coreGrad = ctx.createRadialGradient(-6, -8, 4, 0, 0, 24);
    coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    coreGrad.addColorStop(0.5, core);
    coreGrad.addColorStop(1, k.rgba('yellow', 0.35));
    ctx.fillStyle = coreGrad;
    ctx.beginPath(); ctx.arc(0, 0, 24, 0, k.TAU); ctx.fill();
    k.glow(0, 0, 44, 'yellow', 0.4);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, -10, 9, 6, -0.4, 0, k.TAU); ctx.fill();
    // çekirdek nabzı (canlı idle)
    const nb = 0.5 + 0.5 * Math.sin(t * 3.6);
    k.glow(0, 0, 30 + 8 * nb, 'yellow', 0.25);

    ctx.restore();
  },
};
