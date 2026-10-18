// nature/sun — ışınlı güneş; flare anında parlama patlaması, normalde ışınlar yavaşça döner ve nabız atar.
export default {
  name: 'sun',
  category: 'nature',
  desc: 'Işınlı güneş; flare anında parlama patlaması olur, ışınlar yavaşça döner ve nabız atar',
  tags: ['güneş', 'ışın', 'gündüz', 'hava', 'yaz', 'parlak', 'sun', 'sunshine', 'rays', 'day', 'summer'],
  box: [-150, -150, 150, 150],
  bleed: 70,
  anchor: 'güneş merkezi (0,0)',
  points: { centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow' },
    flare: { type: 'time', default: null, desc: 'parlama patlaması anı (~0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // flare olayı: 0.9 sn'lik parlama
    const d = p.flare == null ? -1 : t - p.flare;
    const fenv = d < 0 || d > 0.9 ? 0 : Math.sin(k.clamp(d / 0.9, 0, 1) * Math.PI);

    // idle: ışınlar yavaşça döner + nabız
    const rot = t * 0.12;
    const pulse = Math.sin(t * 2.4) * 0.5 + 0.5;   // 0..1

    const R = 56;
    const discScale = 1 + fenv * 0.14 + pulse * 0.02;

    // parlama halesi (olay + hafif idle ışıma)
    const haloA = 0.10 + 0.06 * pulse + fenv * 0.4;
    k.glow(0, 0, R + 30 + fenv * 60, p.color, Math.min(0.5, haloA));

    // ışınlar (8 adet, döner grup)
    ctx.save();
    ctx.rotate(rot);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * k.TAU;
      const wob = Math.sin(t * 2.4 + i * 0.8);
      const len = 34 + wob * 5 + fenv * 34;
      const w = 15 + fenv * 4;
      const r0 = R + 14, r1 = r0 + len;
      ctx.save(); ctx.rotate(a);
      // sağ alt gölge
      ctx.fillStyle = darker(p.color);
      ctx.beginPath(); k.rrect(r0 + 4, -w / 2 + 4, len, w, w / 2); ctx.fill();
      // dış hat + gövde
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(r0 - LW / 2, -w / 2 - LW / 2, len + LW, w + LW, (w + LW) / 2); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); k.rrect(r0, -w / 2, len, w, w / 2); ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // güneş diski
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, R * discScale + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darker(p.color); ctx.beginPath(); ctx.arc(4, 5, R * discScale, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, R * discScale - 3, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-R * 0.32, -R * 0.42, R * 0.42, R * 0.26, -0.5, 0, k.TAU); ctx.fill();

    // flare anında çekirdek flaşı
    if (fenv > 0.02) {
      ctx.fillStyle = k.rgba('bg', 0.35 * fenv);
      ctx.beginPath(); ctx.arc(0, 0, R * discScale * (1 - fenv * 0.5), 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.arc(0, 0, R * 0.45 * fenv, 0, k.TAU); ctx.fill();
    }
  },
};
