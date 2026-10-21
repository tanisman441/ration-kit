// lab-fx/fizz-bubble — köpüren deney sıvısı: erlenmayerde sürekli yükselen
// baloncuklar + üstte kabaran köpük tabakası. intensity yoğunluğu yönetir.
// NOT: canvas y-aşağıdır; (0,0) kap tabanındadır.
export default {
  name: 'fizz-bubble', category: 'lab-fx',
  desc: 'Köpüren deney sıvısı: erlenmayerde yükselen baloncuklar ve kabaran köpük',
  tags: ['köpük', 'köpurme', 'baloncuk', 'deney', 'kimya', 'fizz', 'bubbles', 'foam', 'fizzing', 'lab'],
  box: [-85, -185, 85, 12],
  bleed: 30,
  anchor: 'taban (0,0)',
  points: { mouth: [0, -178], liquid: [0, -70], base: [0, 0] },
  params: {
    intensity: { type: 'number', default: 0.6, min: 0, max: 1, desc: 'köpürme yoğunluğu 0-1 (baloncuk sayısı ve köpük yüksekliği)' },
    color: { type: 'color', default: 'green', desc: 'sıvı rengi' },
  },
  draw(ctx, t, p, k) {
    const I = k.clamp(p.intensity, 0, 1);
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // ölçü — erlenmayer
    const bw = 70, neckW = 28, topY = -178, botY = 0, neckBot = -116;

    // sıvı (camın içinde)
    const liqTop = -95;
    const halfAt = (y) => {
      const g = k.prog(y, neckBot, botY);
      return 30 + (bw - 30) * g;
    };
    ctx.fillStyle = k.rgba(acc, 0.72);
    ctx.beginPath();
    const wob = (x) => Math.sin(x * 0.1 + t * 3.2) * 2.5;
    const lw = halfAt(liqTop) - 5;
    ctx.moveTo(-lw, liqTop + wob(0));
    for (let x = -lw; x <= lw; x += 7) ctx.lineTo(x, liqTop + wob(x));
    ctx.lineTo(halfAt(botY - 6) - 5, botY - 6);
    ctx.lineTo(-halfAt(botY - 6) + 5, botY - 6);
    ctx.closePath(); ctx.fill();

    // köpük tabakası — yüzeyde kabaran beyaz köpük (intensity ile boy atar)
    const foamH = 6 + I * 22;
    for (let x = -lw - 2; x <= lw + 2; x += 6) {
      const r = 4 + k.hash(x * 1.7 + 11) * (3 + I * 8);
      const yy = liqTop + 2 - foamH * k.hash(x * 2.3 + 41) * 0.6 + Math.sin(x * 0.2 + t * 5) * 1.6;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.arc(x, yy, r, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, yy, r, 0, k.TAU); ctx.stroke();
    }

    // baloncuklar — sıvı içinde sürekli yükselir (canlı idle; sayısı yoğunluğa bağlı)
    const n = Math.round(6 + I * 14);
    for (let i = 0; i < n; i++) {
      const seed = i * 13 + 7;
      const sp = 0.35 + k.hash(seed) * 0.7 + I * 0.8;
      const c = (t * sp / 2.4 + k.hash(seed + 1)) % 1;
      const y = (botY - 10) - c * ((botY - 10) - liqTop);
      const x = (k.hash(seed + 2) - 0.5) * 2 * Math.max(halfAt(y) - 12, 4) + k.noise1(seed + t * 2.2) * 6;
      const r = 2.5 + k.hash(seed + 3) * (2.5 + I * 4);
      const born = k.prog(c, 0, 0.1), gone = 1 - k.prog(c, 0.9, 1);
      const rr = r * (0.3 + 0.7 * born) * (0.5 + 0.5 * gone);
      if (rr < 0.8) continue;
      const al = 0.9 * (0.35 + 0.65 * born) * gone;
      ctx.fillStyle = k.rgba('ink', 0.28 * al);
      ctx.beginPath(); ctx.arc(x, y, rr, 0, k.TAU); ctx.fill();
      // kabarcık çeperi + sol üst parlama
      ctx.strokeStyle = k.rgba(acc, 0.9 * al);
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(x, y, Math.max(rr - 0.9, 0.5), 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.8 * al).toFixed(3) + ')';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(x, y, Math.max(rr - 2, 0.5), -2.7, -1.6); ctx.stroke();
    }

    // cam gövde
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(-neckW, topY); ctx.lineTo(-neckW, neckBot);
    ctx.lineTo(-bw - 6, botY); ctx.lineTo(bw + 6, botY);
    ctx.lineTo(neckW, neckBot); ctx.lineTo(neckW, topY);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(-neckW, topY); ctx.lineTo(-neckW, neckBot);
    ctx.lineTo(-bw, botY); ctx.lineTo(bw, botY);
    ctx.lineTo(neckW, neckBot); ctx.lineTo(neckW, topY);
    ctx.stroke();
    // ağız bandı (iç ayrım çizgisi)
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-neckW, topY + 14); ctx.lineTo(neckW, topY + 14); ctx.stroke();
    // sağ alt gölge (cam kenarı koyulaşır)
    ctx.strokeStyle = k.rgba('ink', 0.12);
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(neckW - 2, neckBot + 6); ctx.lineTo(bw - 3, botY - 5); ctx.lineTo(bw - 3, botY + 2); ctx.stroke();
    // sol üst cam parlaması (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-44, -70, 9, 28, 0.25, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
