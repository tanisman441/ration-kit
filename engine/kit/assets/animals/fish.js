// animals/fish — yüzen balık, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi.
export default {
  name: 'fish', category: 'animals',
  desc: 'Yüzen balık, yandan görünüm; kuyruk ve yüzgeçler salınır, kabarcıklar yükselir',
  tags: ['balık', 'deniz', 'yüzen', 'okyanus', 'fish', 'swimming', 'sea', 'ocean'],
  box: [-115, -65, 115, 65],
  bleed: 65,
  anchor: 'gövde merkezi (0,0)',
  points: { mouth: [58, 5], tail: [-84, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const sw = Math.sin(t * k.TAU * 1.3);                            // yüzme salınımı
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const finTri = (x1, y1, x2, y2, x3, y3, c) => {
      ctx.fillStyle = line; ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath();
      ctx.lineWidth = LW * 2; ctx.lineJoin = 'round'; ctx.stroke(); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();
    };

    ctx.save();
    ctx.translate(sw * 5, Math.sin(t * k.TAU * 2.6) * 2);            // yüzme yönünde hafif salınım

    // kuyruk yüzgeci: güçlü salınım (canlı idle)
    ctx.save(); ctx.translate(-50, 0); ctx.rotate(sw * 0.28);
    finTri(0, -26, -34, 0, 0, 26, body);
    ctx.restore();

    // sırt yüzgeci
    finTri(-5, -30, 15, -30, 8, -48, body);

    // gövde
    disc(0, 0, 56, 33, body);

    // yan yüzgeç: hızlı çırpınma
    ctx.save(); ctx.translate(8, 12); ctx.rotate(0.5 + Math.sin(t * k.TAU * 4) * 0.3);
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(8, 0, 15, 8.5, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(8, 0, 12, 6, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // solungaç + pul detayları (iç çizgi)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(16, 2, 14, -1.1, 1.1); ctx.stroke();
    for (const sx of [-28, -8, 12]) {
      ctx.beginPath(); ctx.arc(sx, 8, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    }

    // göz + ağız
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(34, -9, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(50, 2); ctx.lineTo(58, 5); ctx.stroke();

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(18, -14, 16, 8, -0.3, 0, k.TAU); ctx.fill();

    ctx.restore();

    // su kabarcıkları: ağızdan yükselir (döngülü, hash tabanlı)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 2.5;
    for (const i of [0, 1, 2]) {
      const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 3 + 2);
      const bx = 58 + h1 * 16;
      const by = -22 - ((t * 32 + h2 * 95) % 95);
      ctx.beginPath(); ctx.arc(bx, by, 3.5 + h1 * 3, 0, k.TAU); ctx.stroke();
    }
  },
};
