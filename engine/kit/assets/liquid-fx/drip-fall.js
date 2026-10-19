// liquid-fx/drip-fall — uçta büyüyen, uzayıp kopan ve düşen damla (döngülü).
// NOT: canvas y-aşağıdır; damla +y yönüne düşer, taban y=190 civarıdır.
export default {
  name: 'drip-fall',
  category: 'liquid-fx',
  desc: 'Musluk ucunda büyüyüp uzayan, kopup düşen ve tabanda kaybolan döngülü damla',
  tags: ['damla', 'damlama', 'musluk', 'sızıntı', 'su damlası', 'drip', 'droplet', 'falling drop', 'leak', 'faucet'],
  box: [-40, -20, 40, 200],
  bleed: 18,
  anchor: 'damlanın çıktığı uç (0,0); taban y=190',
  points: { source: [0, 0], base: [0, 190] },
  params: {
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // uç (küçük ağız): damla buradan çıkar
    ctx.fillStyle = line;
    k.rrect(-24 + 4, -18 + 4, 48, 20, 9); ctx.fill();
    ctx.fillStyle = darker('dim');
    k.rrect(-24 + 4, -18 + 4, 48, 20, 9); ctx.fill();
    ctx.fillStyle = line;
    k.rrect(-24, -18, 48, 20, 9); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-24, -18, 48, 20, 9); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -11, 12, 4, -0.2, 0, k.TAU); ctx.fill();

    const drop = (x, y, r, stretch, alpha) => {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.2, r * 1.32 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath(); ctx.ellipse(x, y - r * 0.06, r * 0.9, r * 1.04 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - r * 0.36, y - r * 0.42, r * 0.3, r * 0.46, -0.4, 0, k.TAU); ctx.fill();
    };

    // döngü: büyü (0–0.42) → uzama (0.42–0.58) → kopuş+düşüş (0.58–1)
    const C = 2.4, ph = (t % C) / C;
    const baseY = 190;
    if (ph < 0.42) {
      const g = k.prog(ph, 0, 0.42);
      drop(0, 4, 3 + 10.5 * g, 1 + g * 0.25, 0.95);
    } else if (ph < 0.58) {
      const g = k.prog(ph, 0.42, 0.58);
      // boyun: uçtan damlaya incelen şerit
      const y0 = 0, y1 = 4 + 16 * g;
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.moveTo(-6, y0); ctx.lineTo(6, y0); ctx.lineTo(3, y1 + 8); ctx.lineTo(-3, y1 + 8);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath();
      ctx.moveTo(-3.4, y0); ctx.lineTo(3.4, y0); ctx.lineTo(1.6, y1 + 7); ctx.lineTo(-1.6, y1 + 7);
      ctx.closePath(); ctx.fill();
      drop(0, y1, 13.5 - 1.5 * g, 1.25 + g * 1.2, 0.95);
    } else {
      const g = k.prog(ph, 0.58, 1);
      const y = 18 + (baseY - 18) * g * g;
      const stretch = 1 + g * 0.9;
      if (y < baseY - 2) drop(k.noise1(t * 3) * 2, y, 12, stretch, 0.95);
      else {
        // tabana varış: minik sıçrama
        const s = k.prog(g, 0.94, 1);
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - s));
        ctx.lineWidth = 4 * (1 - s) + 1;
        ctx.beginPath(); ctx.ellipse(0, baseY, 8 + 30 * s, 4 + 8 * s, 0, 0, k.TAU); ctx.stroke();
      }
    }
  },
};
