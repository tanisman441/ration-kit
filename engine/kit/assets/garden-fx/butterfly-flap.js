// garden-fx/butterfly-flap — kanat çırpan kelebek; sürekli çırpma + süzülen uçuş hareketi.
// NOT: canvas y-aşağıdır; kelebek (0,0) merkezinde, kanatlar gövde ekseninde çırpar.
export default {
  name: 'butterfly-flap', category: 'garden-fx',
  desc: 'Kanat çırpan kelebek: üst-alt kanat çiftleri ritmik çırpar, gövde süzülerek salınır',
  tags: ['kelebek', 'kanat', 'uçuş', 'kanat çırpma', 'butterfly', 'wings', 'flap', 'bahçe', 'insect'],
  box: [-80, -70, 80, 70],
  bleed: 18,
  anchor: 'gövde merkezi (0,0)',
  points: { body: [0, 0] },
  params: {
    color: { type: 'color', default: 'purple', desc: 'kanat rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // süzülme: lissajous salınım
    const bx = 12 * Math.sin(t * 2.24), by = 9 * Math.sin(t * 2.99 + 1.2);
    const tilt = 0.1 * Math.sin(t * 2.24 + 0.6);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(tilt);

    // kanat çırpma: 0.5 sn periyot
    const flap = Math.sin(t * k.TAU / 0.5);
    const wingAng = -0.5 - 0.9 * flap; // radyan: yukarı-aşağı

    const wing = (s, cx, cy, rx, ry, ang) => {
      ctx.save(); ctx.translate(s * 3, 0); ctx.scale(s, 1); ctx.rotate(ang);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx + 3, ry + 3, -0.35, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darker(p.color);
      ctx.beginPath(); ctx.ellipse(cx + 4, cy + 5, rx, ry, -0.35, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, -0.35, 0, k.TAU); ctx.fill();
      // desen: iç benekler
      ctx.fillStyle = 'rgba(255,255,255,0.32)';
      ctx.beginPath(); ctx.ellipse(cx + rx * 0.3, cy - ry * 0.25, rx * 0.22, ry * 0.26, -0.35, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx - rx * 0.25, cy + ry * 0.3, rx * 0.16, ry * 0.2, -0.35, 0, k.TAU); ctx.fill();
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - rx * 0.3, cy - ry * 0.42, rx * 0.34, ry * 0.2, -0.4, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    // alt kanatlar arkada, üst kanatlar önde
    for (const s of [-1, 1]) wing(s, 24, 14, 17, 12, wingAng * 0.7 + 0.35);
    for (const s of [-1, 1]) wing(s, 32, -12, 27, 17, wingAng);

    // gövde
    ctx.fillStyle = line; k.rrect(-8, -15, 16, 32, 8); ctx.fill();
    ctx.fillStyle = darker('ink'); k.rrect(-8 + 3, -15 + 4, 16, 32, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.95); k.rrect(-8, -15, 16, 32, 8); ctx.fill();
    // baş
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -22, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.95); ctx.beginPath(); ctx.arc(0, -22, 7.5, 0, k.TAU); ctx.fill();
    // gözler
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); ctx.arc(-3, -23, 1.8, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -23, 1.8, 0, k.TAU); ctx.fill();
    // antenler (serbest çizgi: ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 2.6;
    for (const s of [-1, 1]) {
      const wob = Math.sin(t * 5.1 + s) * 3;
      ctx.beginPath(); ctx.moveTo(s * 4, -28);
      ctx.quadraticCurveTo(s * 12 + wob, -38, s * 18 + wob, -44); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.7);
      ctx.beginPath(); ctx.arc(s * 18 + wob, -44, 2.6, 0, k.TAU); ctx.fill();
    }
    // gövde çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 2.4;
    for (const yy of [-6, 0, 6]) {
      ctx.beginPath(); ctx.moveTo(-5, yy); ctx.lineTo(5, yy); ctx.stroke();
    }
    ctx.restore();
  },
};
