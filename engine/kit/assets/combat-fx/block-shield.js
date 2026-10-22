// combat-fx/block-shield — blok kalkanı: block anında parlayan altıgen kalkan + dalgalanma; hafif idle titreme.
// NOT: canvas y-aşağıdır; (0,0) kalkanın merkezi.
export default {
  name: 'block-shield',
  category: 'combat-fx',
  desc: 'Blok kalkanı: block anında altıgen kalkan flaşı ve dalgalanma halkası, boşta hafif titreme',
  tags: ['kalkan', 'blok', 'savunma', 'koruma', 'shield', 'block', 'defend', 'guard', 'hex'],
  box: [-115, -125, 115, 125],
  bleed: 70,
  anchor: 'kalkanın merkezi (0,0)',
  points: { center: [0, 0], top: [0, -92] },
  params: {
    block: { type: 'time', default: null, desc: 'blok anı (kalkan flaşı + dalgalanma)' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const d = p.block == null ? -1 : t - p.block;
    const active = d >= 0 && d <= 0.6;

    function hex(cx, cy, r, rot) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = rot + i * k.TAU / 6;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    // idle: hafif titreme (±1.5 birim)
    const tx = k.noise1(t * 1.7) * 1.5, ty = k.noise1(t * 1.3 + 9) * 1.5;
    ctx.save();
    ctx.translate(tx, ty);

    // 1) sağ alt gölge — %12 koyultma, 6 birim offset
    ctx.fillStyle = k.rgba('ink', 0.12);
    hex(6, 6, 88, Math.PI / 2);
    ctx.fill();

    // 2) kalkan gövdesi — altıgen
    ctx.fillStyle = k.rgba(p.color, 1);
    hex(0, 0, 88, Math.PI / 2);
    ctx.fill();
    // sol üst parlama — beyaz alfa 0.10, kontursuz
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath();
    ctx.ellipse(-30, -34, 44, 26, -0.5, 0, k.TAU);
    ctx.fill();
    // dış hat — bg alfa 0.55
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 6;
    hex(0, 0, 88, Math.PI / 2);
    ctx.stroke();
    // iç altıgen detay — idle nabzı
    const pulse = 0.22 + 0.08 * (0.5 + 0.5 * k.noise1(t * 0.9));
    ctx.strokeStyle = k.rgba('cyan', pulse);
    ctx.lineWidth = 4;
    hex(0, 0, 58, Math.PI / 2);
    ctx.stroke();

    // 3) block olayı — kalkan flaşı + dalgalanma (0.5 sn)
    if (active) {
      const f = 1 - d / 0.5;
      // kalkan flaşı: iç altıgen parlak dolgu
      ctx.fillStyle = k.rgba('cyan', 0.45 * f);
      hex(0, 0, 58, Math.PI / 2);
      ctx.fill();
      k.glow(0, 0, 70 * f, 'cyan', 0.3 * f);
      // dalgalanma: genişleyen altıgen halka
      const g = k.prog(d, 0, 0.5);
      const rr = 88 + 82 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba('cyan', 0.6 * (1 - g));
      ctx.lineWidth = 7 * (1 - g * 0.6) + 1.5;
      hex(0, 0, rr, Math.PI / 2);
      ctx.stroke();
      // ikinci halka — kademeli
      if (d > 0.1) {
        const g2 = k.prog(d - 0.1, 0, 0.4);
        const rr2 = 88 + 82 * k.E.outExpo(g2);
        ctx.strokeStyle = k.rgba('cyan', 0.35 * (1 - g2));
        ctx.lineWidth = 4 * (1 - g2 * 0.5) + 1;
        hex(0, 0, rr2, Math.PI / 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
