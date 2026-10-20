// gadget-fx/radar-sweep — dönen tarama ışını + yankı yapan hedef noktaları.
// NOT: canvas y-aşağıdır; (0,0) radar merkezi. Işın saat yönünde döner (3.2 sn/tur).
export default {
  name: 'radar-sweep',
  category: 'gadget-fx',
  desc: 'Radar: rotating sweep beam with echo blips that flash as the beam passes, plus a ping burst event',
  tags: ['radar', 'tarama', 'taramak', 'hedef', 'sonar', 'scan', 'sweep', 'blip', 'echo'],
  box: [-160, -160, 160, 160],
  bleed: 40,
  anchor: 'radar merkezi',
  points: { center: [0, 0], rim: [110, 0], north: [0, -110] },
  params: {
    sweep: { type: 'time', default: null, desc: 'ping anı: merkezden genişleyen parlak halka' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const R = 110;
    const d = p.sweep == null ? -1 : t - p.sweep;
    const ang = (t / 3.2) * k.TAU - Math.PI / 2; // ışın açısı

    // 1) dış daire + iç halkalar
    ctx.strokeStyle = k.rgba('dim', 0.8);
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();
    for (const rr of [R * 0.66, R * 0.33]) {
      ctx.strokeStyle = k.rgba('dim', 0.45);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
    }
    // artı çizgiler
    ctx.strokeStyle = k.rgba('dim', 0.35);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-R, 0); ctx.lineTo(R, 0);
    ctx.moveTo(0, -R); ctx.lineTo(0, R); ctx.stroke();

    // 2) tarama ışını — önde parlak çizgi, arkada sönümlenen kuyruk dilimi
    const tail = 0.9; // radyan kuyruk uzunluğu
    ctx.fillStyle = k.rgba(p.color, 0.16);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R - 4, ang - tail, ang);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = k.rgba(p.color, 0.9);
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ang) * (R - 4), Math.sin(ang) * (R - 4));
    ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, k.TAU); ctx.fill();

    // 3) hedef noktaları — ışın geçince yanıp sönen yankılar (k.hash konumları)
    for (let i = 0; i < 5; i++) {
      const h1 = k.hash(i * 7 + 41), h2 = k.hash(i * 13 + 43);
      const br = 30 + h1 * (R - 44);
      const ba = h2 * k.TAU;
      const bx = Math.cos(ba) * br, by = Math.sin(ba) * br;
      // ışının bu noktayı geçmesinden beri geçen süre
      let rel = ((ang - ba) / k.TAU) % 1;
      if (rel < 0) rel += 1;
      const dt = rel * 3.2; // ışın geçtiğinden beri sn
      const echo = dt < 1.1 ? 1 - dt / 1.1 : 0;
      const base = 0.25;
      ctx.fillStyle = k.rgba(p.color, base + echo * 0.75);
      ctx.beginPath(); ctx.arc(bx, by, 7 + echo * 4, 0, k.TAU); ctx.fill();
      if (echo > 0.15) {
        ctx.strokeStyle = k.rgba(p.color, echo * 0.6);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(bx, by, 12 + echo * 14, 0, k.TAU); ctx.stroke();
      }
    }

    // 4) sweep olayı: merkezden genişleyen parlak ping halkası (0.9 sn)
    if (d >= 0 && d <= 0.9) {
      const g = k.prog(d, 0, 0.9);
      const pr = 14 + (R + 26) * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(p.color, 0.9 * (1 - g));
      ctx.lineWidth = 9 * (1 - g) + 2;
      ctx.beginPath(); ctx.arc(0, 0, pr, 0, k.TAU); ctx.stroke();
      k.glow(0, 0, 30, p.color, 0.5 * (1 - g));
    }
    ctx.restore();
  },
};
