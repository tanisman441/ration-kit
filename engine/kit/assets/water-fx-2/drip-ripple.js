// water-fx-2/drip-ripple — musluktan düşen damla su yüzeyine çarpar, 3 halka
// yayılır. drip anında tek damla (0.5 sn düşüş + 0.9 sn halka); boşta döngülü
// damlar (1.6 sn periyot, idle).
// NOT: canvas y-aşağıdır; (0,0) su yüzeyidir.
export default {
  name: 'drip-ripple', category: 'water-fx-2',
  desc: 'Musluktan düşen damla ve çarpınca yayılan halka dalgaları',
  tags: ['damla', 'drip', 'halka', 'dalga', 'musluk', 'su yüzeyi', 'ripple', 'drop', 'rings', 'faucet'],
  box: [-125, -205, 125, 60],
  bleed: 40,
  anchor: 'su yüzeyi merkezi (0,0)',
  points: { spout: [0, -172], impact: [0, 0] },
  params: {
    drip: { type: 'time', default: null, desc: 'damlanın çarptığı an (öncesinde 0.5 sn düşer)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // Musluk/boru: üstten inen kısa boru + ağız
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(-22, -205, 44, 30, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    k.rrect(-22, -205, 44, 30, 10); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.beginPath(); ctx.ellipse(0, -175, 12, 6, 0, 0, k.TAU); ctx.fill();
    // premium finish: sol üst parlama (boru)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -196, 10, 7, -0.4, 0, k.TAU); ctx.fill();

    // Su yüzeyi: dalgalı şerit
    ctx.fillStyle = k.rgba(acc, 0.5);
    ctx.beginPath();
    ctx.moveTo(-125, 0);
    for (let x = -125; x <= 125; x += 10) ctx.lineTo(x, Math.sin(x * 0.1 + t * 2.8) * 3);
    ctx.lineTo(125, 20); ctx.lineTo(-125, 20);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba(acc, 0.7); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -125; x <= 125; x += 10) {
      const y = Math.sin(x * 0.1 + t * 2.8) * 3;
      x === -125 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Damla + halkalar: drip varsa olay-zamanlı, yoksa döngülü idle
    let dropPh = null, ringT = null;
    if (p.drip == null) {
      const cyc = 1.6, ph = (t % cyc) / cyc;
      if (ph < 0.32) dropPh = ph / 0.32;
      else ringT = (ph - 0.32) / 0.68 * 0.9;
    } else {
      const dd = t - p.drip;
      if (dd < 0 && dd > -0.55) dropPh = 1 + dd / 0.55;
      else if (dd >= 0 && dd < 0.95) ringT = dd;
    }

    // düşen damla (yukarıdan aşağı, uzayarak)
    if (dropPh != null) {
      const y = -172 + dropPh * 168;
      const stretch = 1 + dropPh * 0.6;
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.ellipse(0, y, 8.2, 10.4 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath(); ctx.ellipse(0, y - 0.5, 6.2, 8.2 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-2.4, y - 3, 2.2, 3.4, -0.35, 0, k.TAU); ctx.fill();
    }

    // halkalar: 3 ardışık elips genişler, solar
    if (ringT != null) {
      for (let r = 0; r < 3; r++) {
        const rr = ringT - r * 0.12;
        if (rr < 0) continue;
        const gg = k.prog(rr, 0, 0.85);
        ctx.strokeStyle = k.rgba(acc, 0.65 * (1 - gg));
        ctx.lineWidth = 7 * (1 - gg) + 1.5;
        ctx.beginPath(); ctx.ellipse(0, 0, 12 + 92 * gg, 4.5 + 17 * gg, 0, 0, k.TAU); ctx.stroke();
      }
      // merkezde küçük sıçrama
      const sp = k.prog(ringT, 0, 0.35) * (1 - k.prog(ringT, 0.35, 0.7));
      if (sp > 0.02) {
        ctx.fillStyle = k.rgba(acc, 0.8 * sp);
        ctx.beginPath(); ctx.ellipse(0, -8 * sp, 6 * sp + 2, 10 * sp + 2, 0, 0, k.TAU); ctx.fill();
      }
    }

    // sağ alt gölge (su altında)
    ctx.fillStyle = k.rgba('ink', 0.1);
    ctx.beginPath(); ctx.ellipse(70, 14, 44, 8, 0.2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
