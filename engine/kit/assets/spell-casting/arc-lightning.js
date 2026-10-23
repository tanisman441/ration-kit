// spell-casting/arc-lightning — büyücünün elinden hedefe sıçrayan mor ark:
// kırık ana çizgi + 2 dal + hedef ucunda kıvılcım topu. Idle: hafif elektrik
// titremesi (noise ±3 units). `at` anında: 0.15 sn beyaz flaş + kalınlaşan ark +
// hedef ucunda 0.4 sn patlama halesi.
// NOT: canvas y-aşağıdır; ark soldan (el, x=-110) sağa (hedef, x=110) gider.
export default {
  name: 'arc-lightning', category: 'spell-casting',
  desc: 'Büyücünün elinden hedefe sıçrayan mor şimşek yayı; at anında flaşla patlar, idle\'da elektrik gibi titrer',
  tags: ['şimşek', 'yıldırım', 'elektrik', 'büyü', 'ark', 'arc', 'lightning', 'zap', 'spell', 'magic'],
  box: [-130, -90, 130, 90],
  bleed: 40,
  anchor: 'arkın orta noktası (0,0); el solda (-110,0), hedef sağda (110,0)',
  points: { hand: [-110, 0], target: [110, 0], centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'arkın çakma anı (0.15 sn flaş + hedef ucunda patlama)' },
    color: { type: 'color', default: 'purple', desc: 'ark rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const strike = d >= 0 && d < 0.15;
    const boost = strike ? 1 - d / 0.15 : 0;

    // Elektrik titremesi: idle'da ±3 units hızlı noise
    const jx = i => k.noise1(i * 19.3 + t * 9) * 3;
    const jy = i => k.noise1(i * 37.1 + t * 7 + 4) * 8;

    const segs = 7, x0 = -110, x1 = 110;
    const mainX = i => x0 + (x1 - x0) * (i / segs) + jx(i);
    const mainY = i => jy(i);

    const drawBolt = (lw, style, alpha) => {
      ctx.strokeStyle = style; ctx.lineWidth = lw; ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(mainX(0), mainY(0));
      for (let i = 1; i <= segs; i++) ctx.lineTo(mainX(i), mainY(i));
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // El ucu (sol): yükleme parıltısı (idle'da nabız atar)
    const charge = 0.35 + 0.3 * Math.abs(Math.sin(t * 6)) + boost * 0.4;
    k.glow(mainX(0), mainY(0), 22, acc, charge);
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.arc(mainX(0), mainY(0), 9 + boost * 6, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();

    // Dış hale (çarpma anında güçlenir)
    k.glow(0, 0, 80, acc, 0.2 + boost * 0.3);

    // Ana ark
    if (strike) {
      drawBolt(15 + boost * 8, 'rgba(255,255,255,' + (0.9 * boost + 0.1).toFixed(3) + ')', 1);
      drawBolt(7, k.rgba(acc, 0.95), 1);
    } else {
      drawBolt(9, k.rgba(acc, 0.85), 0.95);
      drawBolt(3.5, 'rgba(255,255,255,0.9)', 0.9);
    }

    // Dallar: 2 kısa çatallaşma
    const fork = (sx, sy, dir) => {
      let px = sx, py = sy;
      ctx.beginPath(); ctx.moveTo(px, py);
      for (let i = 1; i <= 3; i++) {
        px += dir * (12 + k.hash(i * 43 + sx) * 16) + jx(i + 50) * 0.5;
        py += (k.hash(i * 29 + sy) - 0.5) * 36;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    };
    ctx.strokeStyle = k.rgba(acc, 0.65); ctx.lineWidth = 3.5;
    fork(mainX(2), mainY(2), 0.3);   // yukarı kıvrım
    fork(mainX(5), mainY(5), -0.3);

    // Hedef ucu (sağ): kıvılcım topu — at anında 0.4 sn patlama halesi
    const tx = mainX(segs), ty = mainY(segs);
    const tgtR = 10 + boost * 10 + Math.abs(Math.sin(t * 8)) * 2;
    k.glow(tx, ty, 30, acc, 0.4 + boost * 0.4);
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.arc(tx, ty, tgtR, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(tx, ty, tgtR * 0.45, 0, k.TAU); ctx.fill();
    // premium parlama: hedef topunda sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(tx - tgtR * 0.3, -tgtR * 0.1 + ty - tgtR * 0.3, tgtR * 0.35, tgtR * 0.18, -0.5, 0, k.TAU); ctx.fill();

    if (d >= 0 && d < 0.4) { // hedef patlaması
      const pr = d / 0.4;
      ctx.strokeStyle = k.rgba(acc, (1 - pr) * 0.8); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(tx, ty, 10 + pr * 55, 8 + pr * 30, 0, 0, k.TAU); ctx.stroke();
      for (let i = 0; i < 7; i++) {
        const h = k.hash(i * 53.9);
        const ang = (h - 0.5) * 2.4;
        const sx = tx + Math.cos(ang) * pr * (35 + h * 45);
        const sy = ty + Math.sin(ang) * pr * (35 + h * 45);
        ctx.fillStyle = k.rgba(acc, (1 - pr) * 0.9);
        ctx.beginPath(); ctx.arc(sx, sy, 4 * (1 - pr) + 1, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
