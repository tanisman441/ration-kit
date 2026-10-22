// spell-duel/lightning-arc — gökyüzünden inen çatallı şimşek: ana kırık çizgi
// + 2 dal (forks), uçlarda küçük kıvılcım noktaları. Idle: hafif elektrik
// titremesi (noise1 ile ±3 units, ~8 Hz). `at` anında: 0.15 sn beyaz flaş +
// kalınlaşan kıvrımlı ark + altta çarpma halesi.
// NOT: canvas y-aşağıdır; (0,0) şimşeğin üst başlangıcıdır.
export default {
  name: 'lightning-arc', category: 'spell-duel',
  desc: 'Çatallı şimşek; at anında 0.15 sn flaşla çakar, idle\'da elektrik gibi titrer',
  tags: ['şimşek', 'yıldırım', 'elektrik', 'büyü', 'çarpma', 'lightning', 'bolt', 'thunder', 'electric', 'zap'],
  box: [-110, -140, 110, 140],
  bleed: 45,
  anchor: 'şimşeğin üst başlangıç noktası (0,0)',
  points: { strike: [0, 118], top: [0, -130], centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'şimşek çakma anı (0.15 sn flaş + kalın ark)' },
    color: { type: 'color', default: 'yellow', desc: 'şimşek rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const strike = d >= 0 && d < 0.15;
    const boost = strike ? 1 - d / 0.15 : 0; // flaş sönümü

    // Elektrik titremesi: idle'da ±3 units, hızlı noise
    const jx = i => k.noise1(i * 17.3 + t * 8) * 3.5;

    // Ana kırık çizgi: üstten alta 6 segment
    const segs = 6, top = -130, bot = 118;
    const mainX = i => jx(i) + Math.sin(i * 2.7) * 18;
    const segY = i => top + (bot - top) * (i / segs);

    const drawBolt = (lw, style, alpha) => {
      ctx.strokeStyle = style; ctx.lineWidth = lw; ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(mainX(0), segY(0));
      for (let i = 1; i <= segs; i++) ctx.lineTo(mainX(i), segY(i));
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // dış hale (her zaman, çarpma anında güçlenir)
    k.glow(mainX(3), (segY(0) + segY(segs)) / 2, 90, acc, 0.22 + boost * 0.28);

    // Çatallar: 2 dal (soldan 3. segmentte, sağdan 4. segmentte)
    const fork = (sx, sy, dir) => {
      const fN = 3;
      let px = sx, py = sy;
      ctx.beginPath(); ctx.moveTo(px, py);
      for (let i = 1; i <= fN; i++) {
        px += dir * (10 + k.hash(i * 61 + sx) * 22) + jx(i + 40) * 0.6;
        py += 20 + k.hash(i * 13 + sy) * 14;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    };

    // at anı: kalın beyaz çekirdek + geniş ark
    if (strike) {
      drawBolt(14 + boost * 10, 'rgba(255,255,255,' + (0.9 * boost + 0.1).toFixed(3) + ')', 1);
      drawBolt(7, k.rgba(acc, 0.9), 1);
    } else {
      drawBolt(10, k.rgba(acc, 0.85), 0.95);
      drawBolt(4, 'rgba(255,255,255,0.85)', 0.9); // ince beyaz çekirdek
    }

    ctx.strokeStyle = k.rgba(acc, 0.6); ctx.lineWidth = 4;
    fork(mainX(3), segY(3), -1);
    fork(mainX(4), segY(4), 1);

    // Çarpma halesi: alt uçta yıldız patlaması (at anında belirir, 0.4 sn sürer)
    if (d >= 0 && d < 0.4) {
      const prog = d / 0.4;
      const hx = mainX(segs), hy = segY(segs);
      ctx.strokeStyle = k.rgba(acc, (1 - prog) * 0.8); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(hx, hy, 12 + prog * 60, 6 + prog * 20, 0, 0, k.TAU); ctx.stroke();
      k.glow(hx, hy, 30 + prog * 50, acc, (1 - prog) * 0.5);
      // yukarı sıçrayan kıvılcımlar
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 77.7);
        const ang = -Math.PI / 2 + (h - 0.5) * 2;
        ctx.fillStyle = k.rgba(acc, (1 - prog) * 0.9);
        ctx.beginPath();
        ctx.arc(hx + Math.cos(ang) * prog * (30 + h * 40), hy + Math.sin(ang) * prog * (30 + h * 40), 3.5 * (1 - prog) + 1, 0, k.TAU);
        ctx.fill();
      }
    }

    // Üst başlangıç noktası: küçük yükleme parıltısı (idle)
    const charge = 0.3 + 0.35 * Math.abs(Math.sin(t * 5));
    k.glow(mainX(0), segY(0), 16, acc, charge);
    ctx.restore();
  },
};
