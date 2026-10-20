// gadget-fx/touch-ripple — dokunma noktasından yayılan halka dalgaları.
// NOT: canvas y-aşağıdır; (0,0) dokunma noktası.
export default {
  name: 'touch-ripple',
  category: 'gadget-fx',
  desc: 'Touch ripple: expanding rings radiate from a tap point when touched',
  tags: ['dokunma', 'dokun', 'halka', 'dalga', 'parmak', 'touch', 'ripple', 'tap', 'wave'],
  box: [-190, -190, 190, 190],
  bleed: 40,
  anchor: 'dokunma noktası',
  points: { center: [0, 0], edge: [160, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'dokunma anı: üç kademeli halka yayılır' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const loop = (t % 2.2) / 2.2;

    // 1) dokunma noktası — idle nabız
    const pulse = 1 + 0.12 * Math.sin(loop * k.TAU);
    k.glow(0, 0, 30 * pulse, p.color, 0.35);
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.arc(0, 0, 14 * pulse, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-4.5, -5.5, 6, 4, -0.6, 0, k.TAU); ctx.fill();
    // sabit ince halka — dokunma hissi
    ctx.strokeStyle = k.rgba(p.color, 0.3 + 0.1 * Math.sin(loop * k.TAU));
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 30 * pulse, 0, k.TAU); ctx.stroke();

    // 2) at olayı: üç kademeli genişleyen halka (her biri 0.9 sn, 0.12 sn arayla)
    if (d >= 0 && d <= 1.3) {
      for (let i = 0; i < 3; i++) {
        const rr = d - i * 0.12;
        if (rr < 0 || rr > 0.9) continue;
        const g = k.prog(rr, 0, 0.9);
        const rad = 18 + 160 * k.E.outExpo(g);
        const fade = 1 - g;
        ctx.strokeStyle = k.rgba(p.color, 0.75 * fade);
        ctx.lineWidth = 9 * fade + 1.5;
        ctx.beginPath(); ctx.arc(0, 0, rad, 0, k.TAU); ctx.stroke();
        // iç parlama izi
        ctx.strokeStyle = k.rgba('bg', 0.25 * fade);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, rad - 8, 0, k.TAU); ctx.stroke();
      }
      // merkezde kısa flaş
      if (d < 0.16) {
        k.glow(0, 0, 44 * (1 - d / 0.16), 'yellow', 0.45 * (1 - d / 0.16));
      }
    }
    ctx.restore();
  },
};
