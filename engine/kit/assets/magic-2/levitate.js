// magic-2/levitate — havada süzülme: büyü kristali ±8 units, 2.4 sn periyotla
// yukarı-aşağı salınır; nabız parlama + yükselen ışık tozları + zemin gölgesi.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) süzülmenin merkezidir (kristal bunun etrafında salınır).
export default {
  name: 'levitate', category: 'magic-2',
  desc: 'Havada süzülen büyü kristali: yavaş salınım, nabız parlama, yükselen ışık tozları',
  tags: ['süzülme', 'levitate', 'levitation', 'uçma', 'kristal', 'büyü', 'floating', 'hover', 'havada'],
  box: [-80, -110, 80, 80],
  bleed: 35,
  anchor: 'süzülmenin merkezi (0,0) — kristal bu nokta etrafında salınır',
  points: { center: [0, 0], top: [0, -85], ground: [0, 70] },
  params: {
    color: { type: 'color', default: 'purple', desc: 'kristalin enerji rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const col = p.color;
    const ph = k.TAU * t / 2.4;
    const bob = -8 * Math.sin(ph);          // ±8 units, 2.4 sn periyot
    const cy = bob;
    const pulse = 0.5 + 0.5 * Math.sin(ph - 0.6);

    // ---- zemin gölgesi: kristal yükselince küçülür ----
    const shw = 1 + (-bob / 8) * 0.22;
    ctx.fillStyle = k.rgba('ink', 0.18);
    ctx.beginPath(); ctx.ellipse(0, 72, 44 * shw, 10, 0, 0, k.TAU); ctx.fill();

    // ---- nabız parlama ----
    k.glow(0, cy, 74, col, 0.28 + 0.16 * pulse);

    // ---- yörünge halkası + 3 parıltı ----
    ctx.strokeStyle = k.rgba(col, 0.35);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, cy, 58, 20, 0, 0, k.TAU); ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const a = t * 0.9 + i * k.TAU / 3;
      const px = Math.cos(a) * 58, py = cy + Math.sin(a) * 20;
      const back = Math.sin(a) < 0 ? 0.45 : 1;   // arka yarım halka daha silik
      ctx.fillStyle = k.rgba(col, 0.75 * back);
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, k.TAU); ctx.fill();
    }

    // ---- kristal: sağ alta %12 koyu gölge kopya + ana gövde ----
    const c = k.col(col);
    const darkCss = 'rgba(' + Math.round(c[0] * 0.88) + ',' + Math.round(c[1] * 0.88) + ',' +
      Math.round(c[2] * 0.88) + ',0.5)';
    ctx.save();
    ctx.translate(6, 6 + cy);
    ctx.fillStyle = darkCss;
    ctx.beginPath();
    ctx.moveTo(0, -55); ctx.lineTo(24, -12); ctx.lineTo(16, 34); ctx.lineTo(0, 52);
    ctx.lineTo(-16, 34); ctx.lineTo(-24, -12);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(0, cy);
    ctx.fillStyle = k.rgba(col, 0.9);
    ctx.beginPath();
    ctx.moveTo(0, -55); ctx.lineTo(24, -12); ctx.lineTo(16, 34); ctx.lineTo(0, 52);
    ctx.lineTo(-16, 34); ctx.lineTo(-24, -12);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 6;
    ctx.stroke();
    // iç faset çizgileri (ink, alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -55); ctx.lineTo(0, 52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-24, -12); ctx.lineTo(24, -12); ctx.stroke();
    // sol üst parlama (beyaz alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, -30, 12, 20, 0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // ---- yükselen ışık tozları ----
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 11 + 3);
      const yy = 70 - ((t * 26 + h1 * 150) % 150);
      const xx = (h2 - 0.5) * 90 + k.noise1(i * 2.7 + t * 1.2) * 10;
      const fa = Math.max(0, 1 - Math.abs(yy - 10) / 80);
      ctx.fillStyle = k.rgba(col, 0.55 * fa);
      ctx.beginPath(); ctx.arc(xx, yy, 2 + h2 * 2.5, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
