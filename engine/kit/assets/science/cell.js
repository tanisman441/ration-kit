// science/cell — hücre: zar, sitoplazma, çekirdek ve organeller.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'cell',
  category: 'science',
  desc: 'Hücre: zar, sitoplazma, çekirdek ve organeller; bölünme anında iki hücreye ayrılır',
  tags: ['hücre', 'biyoloji', 'çekirdek', 'bölünme', 'mitoz', 'cell', 'biology', 'nucleus', 'mitosis'],
  box: [-225, -125, 225, 125],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: { nucleus: [0, 0], membrane: [0, -105] },
  params: {
    color: { type: 'color', default: 'green', desc: 'vurgu rengi (çekirdek ve organeller)' },
    divide: { type: 'time', default: null, desc: 'bölünme anı (mitoz)' },
  },
  draw(ctx, t, p, k) {
    const d = p.divide == null ? -1 : t - p.divide;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // bölünme ilerlemesi 0–1 (0.9 sn)
    const g = d < 0 ? 0 : k.prog(d, 0, 0.9);

    // hücre zarının organik kenarı (noise ile hafif titrer)
    const blob = (cx, cy, r, seed) => {
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const a = (i / 28) * k.TAU;
        const q = r * (1 + k.noise1(seed + i * 0.55 + t * 1.2) * 0.06);
        const x = cx + Math.cos(a) * q, y = cy + Math.sin(a) * q * 0.86;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    if (g === 0) {
      // tek hücre
      ctx.fillStyle = k.rgba('bg', 0.55);
      blob(0, 0, 112, 3.1); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 0.85);
      blob(0, 0, 104, 3.1); ctx.fill();
      // zar parlaması (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-45, -58, 30, 18, -0.5, 0, k.TAU); ctx.fill();
      drawInner(ctx, t, p, k, 0, 0, 1, acc);
    } else {
      // bölünme: iki yavru hücre ayrılır
      const sep = 25 + g * 92;
      for (const sgn of [-1, 1]) {
        ctx.fillStyle = k.rgba('bg', 0.55);
        blob(sgn * sep, 0, 72, 3.1 + sgn); ctx.fill();
        ctx.fillStyle = k.rgba('dim', 0.85);
        blob(sgn * sep, 0, 65, 3.1 + sgn); ctx.fill();
        drawInner(ctx, t, p, k, sgn * sep, 0, 0.72, acc);
      }
      // aradaki ince köprü (erken safhada)
      if (g < 0.45) {
        ctx.strokeStyle = k.rgba('dim', 0.7 * (1 - g / 0.45));
        ctx.lineWidth = 16 * (1 - g / 0.45);
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.stroke();
      }
    }
    ctx.restore();

    function drawInner(ctx, t, p, k, cx, cy, s, acc) {
      // çekirdek
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.arc(cx, cy, 34 * s, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(acc, 0.9);
      ctx.beginPath(); ctx.arc(cx, cy, 29 * s, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(cx - 10 * s, cy - 11 * s, 11 * s, 8 * s, -0.4, 0, k.TAU); ctx.fill();
      k.glow(cx, cy, 50 * s, acc, 0.22);
      // çekirdekçik
      ctx.fillStyle = k.rgba('bg', 0.45);
      ctx.beginPath(); ctx.arc(cx + 8 * s, cy + 6 * s, 9 * s, 0, k.TAU); ctx.fill();
      // organeller — sitoplazmada yüzen küçük noktalar
      for (let i = 0; i < 9; i++) {
        const a = k.hash(i * 13 + 2) * k.TAU, r = (48 + k.hash(i * 7 + 3) * 30) * s;
        const ox = cx + Math.cos(a) * r + k.noise1(i * 3 + t * 0.8) * 6;
        const oy = cy + Math.sin(a) * r * 0.8 + k.noise1(i * 5 + t * 0.8) * 6;
        ctx.fillStyle = k.rgba(acc, 0.5);
        ctx.beginPath(); ctx.arc(ox, oy, (4 + k.hash(i * 11) * 4) * s, 0, k.TAU); ctx.fill();
      }
    }
  },
};
