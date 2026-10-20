// gadget-fx/battery-charge — doluluk seviyesi ayarlanabilen pil + dolunca şimşek flaşı.
// NOT: canvas y-aşağıdır; (0,0) pil gövdesinin merkezi, kutup başlığı sağda.
export default {
  name: 'battery-charge',
  category: 'gadget-fx',
  desc: 'Battery with adjustable fill level; a lightning bolt flashes when charge reaches full',
  tags: ['pil', 'batarya', 'şarj', 'doluyor', 'enerji', 'battery', 'charge', 'energy', 'power'],
  box: [-150, -90, 150, 90],
  bleed: 40,
  anchor: 'pil gövdesi merkezi',
  points: { terminal: [140, 0], body: [0, 0], bolt: [-40, -30] },
  params: {
    charge: { type: 'number', default: 0.5, desc: 'doluluk 0-1 (1 = tam dolu, şimşek çakar)' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const W = 230, H = 110, x0 = -W / 2, y0 = -H / 2;
    const c = k.clamp(p.charge, 0, 1);
    const loop = (t % 2.6) / 2.6;

    // 1) kutup başlığı (sağda)
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); k.rrect(W / 2 - 6, -20, 24, 40, 10); ctx.fill();

    // 2) pil gövdesi — dim dış, bg iç boşluk
    ctx.fillStyle = k.rgba('dim', 0.9);
    ctx.beginPath(); k.rrect(x0, y0, W, H, 18); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(x0 + 10, y0 + 10, W - 20, H - 20, 12); ctx.fill();

    // 3) dolgu — soldan sağa, charge kadar
    const innerW = W - 32, innerH = H - 32;
    const fillW = Math.max(0, innerW * c);
    if (fillW > 2) {
      ctx.fillStyle = k.rgba(p.color, 0.92);
      ctx.beginPath(); k.rrect(x0 + 16, y0 + 16, fillW, innerH, 10); ctx.fill();
      // premium finish: sol üst parlama (beyaz, alfa 0.10)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); k.rrect(x0 + 16, y0 + 16, fillW, innerH * 0.42, 10); ctx.fill();
      // idle: dolgu üzerinde gezinen hafif ışık bandı (döngülü)
      if (fillW > 40) {
        const bx = x0 + 16 + ((loop * (fillW + 60)) % (fillW + 60)) - 30;
        ctx.fillStyle = k.rgba('bg', 0.18);
        ctx.beginPath(); k.rrect(bx, y0 + 16, 30, innerH, 8); ctx.fill();
      }
    }

    // 4) gölge — sağ alt %12 koyultma
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(x0 + 6, y0 + 6 + (H - 12), W - 12, 6, 3); ctx.fill();

    // 5) doluysa şimşek: %85'ten itibaren belirir, tam doluda parlar (döngülü nabız)
    const boltA = k.prog(c, 0.82, 1.0);
    if (boltA > 0) {
      const pulseA = 0.75 + 0.25 * Math.sin(loop * k.TAU);
      const ba = boltA * pulseA;
      k.glow(0, 0, 46, 'yellow', 0.4 * ba);
      ctx.fillStyle = k.rgba('yellow', Math.min(1, ba + 0.15));
      ctx.beginPath();
      ctx.moveTo(12, -38);
      ctx.lineTo(-16, 6);
      ctx.lineTo(-2, 6);
      ctx.lineTo(-12, 38);
      ctx.lineTo(16, -6);
      ctx.lineTo(2, -6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
