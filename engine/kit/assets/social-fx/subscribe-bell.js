// social-fx/subscribe-bell — abone zili: ring anında çan sağa-sola sallanır,
// tokmağı ters yönde savrulur, iki yana ses dalgası yayılır. Boşta hafif salınım.
export default {
  name: 'subscribe-bell', category: 'social-fx',
  desc: 'Notification bell that swings and rings out sound arcs on the ring moment',
  tags: ['zil', 'bell', 'abone', 'subscribe', 'bildirim', 'notification', 'ding', 'çalma'],
  box: [-130, -110, 130, 110],
  bleed: 55,
  anchor: 'zilin askı noktası (0,-70)',
  points: { top: [0, -95], clapper: [0, 30], bell: [0, -20] },
  params: {
    ring: { type: 'time', default: null, desc: 'zil çalma anı: sallanma + ses dalgası (1.2 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.ring == null ? -1 : t - p.ring;
    const col = p.color;
    let swing;
    if (d >= 0 && d <= 1.2) {
      const g = k.prog(d, 0, 1.2);
      swing = 0.55 * Math.sin(d * 16) * (1 - g);
    } else {
      swing = 0.04 * Math.sin(t * 1.8); // idle: hafif salınım
    }

    // 1) ses dalgaları — ring sırasında iki yana yayılır
    if (d >= 0 && d <= 1.2) {
      const g = k.prog(d, 0, 1.2);
      for (let i = 0; i < 2; i++) {
        const gg = k.prog(d - i * 0.22, 0, 0.98);
        if (gg > 0) {
          const r = 45 + 70 * k.E.outExpo(gg);
          for (const sgn of [-1, 1]) {
            ctx.strokeStyle = k.rgba(col, 0.6 * (1 - gg));
            ctx.lineWidth = 6 * (1 - gg) + 2;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.arc(0, -20, r, sgn > 0 ? -0.7 : Math.PI - 0.7, sgn > 0 ? 0.7 : Math.PI + 0.7); ctx.stroke();
          }
        }
      }
    }

    // 2) zil gövdesi (askı noktasından sallanır)
    ctx.translate(0, -70);
    ctx.rotate(swing);
    const bellPath = () => {
      ctx.beginPath();
      ctx.moveTo(-52, 42);
      ctx.bezierCurveTo(-48, -6, -30, -42, 0, -42);
      ctx.bezierCurveTo(30, -42, 48, -6, 52, 42);
      ctx.quadraticCurveTo(0, 58, -52, 42);
      ctx.closePath();
    };
    // gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(6, 6); bellPath(); ctx.fill(); ctx.restore();
    // gövde
    ctx.fillStyle = k.rgba(col, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    bellPath(); ctx.fill(); ctx.stroke();
    // alt dudak bandı
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-58, 38, 116, 16, 8); ctx.fill();
    // askı topuzu
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, -48, 11, 0, k.TAU); ctx.fill(); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-24, -22, 14, 22, -0.4, 0, k.TAU); ctx.fill();

    // 3) tokmak — gövdeye zıt fazda savrulur
    const clap = d >= 0 && d <= 1.2 ? -swing * 1.6 : -swing * 0.6 + 0.05 * Math.sin(t * 2.2);
    ctx.save(); ctx.translate(0, 58); ctx.rotate(clap);
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 14, 13, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.restore();

    ctx.restore();
  },
};
