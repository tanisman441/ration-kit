// sports-fx/crowd-wave — tribün kesiti: Meksika dalgası soldan sağa döngüsel olarak gezer.
// NOT: canvas y-aşağıdır; figürler characters ailesindendir (kafa/gövde oranı + nokta gözler).
export default {
  name: 'crowd-wave',
  category: 'sports-fx',
  desc: 'Tribün kesiti: üç sıra taraftar, soldan sağa gezen döngüsel Meksika dalgasıyla zıplar',
  tags: ['tribün', 'taraftar', 'kalabalık', 'meksika dalgası', 'stadyum', 'crowd', 'fans', 'stadium', 'wave', 'supporters'],
  box: [-240, -100, 240, 100],
  bleed: 30,
  anchor: 'tribün merkezi (0,0); en üst sıra y=-52',
  points: { top: [0, -88] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const shirtC = k.rgba(p.color), accentC = k.rgba('accent');
    ctx.lineCap = 'round';

    // tribün basamakları (arka plan detayı — boyama değil, ince basamak çizgileri)
    const tiers = [-52, 2, 56];
    for (const ty of tiers) {
      ctx.fillStyle = k.rgba('panel2', 0.9);
      ctx.beginPath(); k.rrect(-225, ty + 26, 450, 16, 8); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-225, ty + 26); ctx.lineTo(225, ty + 26); ctx.stroke();
    }

    // figür: characters ailesi — basık daire kafa + rrect gövde, zıplayınca kollar havada
    const fan = (x, y, jump, seed) => {
      const h1 = k.hash(seed * 3 + 1);
      const shirt = h1 < 0.35 ? accentC : shirtC;   // her 3 figürden biri vurgu rengi
      const j = -16 * Math.max(0, Math.sin(jump));  // zıplama
      const bob = Math.sin(t * 2.4 + seed) * 1.5;   // idle: nefes
      ctx.save();
      ctx.translate(x, y + j + bob);
      // kollar (zıplayınca havada)
      const up = Math.max(0, Math.sin(jump)) > 0.25;
      ctx.strokeStyle = shirt; ctx.lineWidth = 8;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(s * 8, -22);
        if (up) { ctx.lineTo(s * 16, -44); ctx.lineTo(s * 20, -58); }
        else { ctx.lineTo(s * 14, -8); ctx.lineTo(s * 12, 4); }
        ctx.stroke();
      }
      // gövde
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-12, -30, 24, 30, 9); ctx.fill();
      ctx.fillStyle = shirt;
      ctx.beginPath(); k.rrect(-9, -27, 18, 24, 7); ctx.fill();
      // kafa (basık daire: rx = ry * 0.92)
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, -42, 14, 15, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.ellipse(0, -42, 12, 13, 0, 0, k.TAU); ctx.fill();
      // nokta gözler
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.arc(-4.5, -43, 1.8, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(4.5, -43, 1.8, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    // Meksika dalgası: faz x'e bağlı, soldan sağa gezer (döngüsel idle)
    let seed = 0;
    for (let r = 0; r < 3; r++) {
      const n = 10 - r;                            // üst sıra biraz seyrek
      for (let i = 0; i < n; i++) {
        const x = -198 + i * (396 / (n - 1)) + (r % 2) * 10;
        const phase = t * 4.2 - x * 0.028 - r * 0.35;
        fan(x, tiers[r] + 24, phase, ++seed);
      }
    }
  },
};
