// vehicle-fx/drift-skid — drift lastik izi: kavisli çift iz 0.8 sn'de çizilir, toz bulutu eşlik eder.
// NOT: canvas y-aşağıdır; yay merkezi (0,140), yarıçap 200; iz alt kenarlardan girip tepeden geçer.
export default {
  name: 'drift-skid',
  category: 'vehicle-fx',
  desc: 'Drift lastik izi: kavisli çift iz 0.8 saniyede çizilir, toz bulutu eşlik eder',
  tags: ['drift', 'lastik', 'iz', 'kayma', 'viraj', 'yarış', 'tire', 'skid', 'drift', 'mark', 'slide', 'racing'],
  box: [-205, -110, 205, 120],
  bleed: 50,
  anchor: 'yayın tepesi (0,-60); iz alt kenarlardan girer, tepede kayar',
  points: { start: [-178, 49], apex: [0, -60], end: [178, 49] },
  params: {
    drift: { type: 'time', default: null, desc: 'drift anı: iz 0.8 sn\'de çizilir, toz 1 sn\'de solar' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.drift == null ? -1 : t - p.drift;
    if (d < 0 || d > 1.05) return;
    ctx.save();
    const CX = 0, CY = 140, R = 200;
    const A0 = Math.PI * 1.15, A1 = Math.PI * 1.85;
    const px = (a) => CX + R * Math.cos(a);
    const py = (a) => CY + R * Math.sin(a);
    const front = (u) => A0 + (A1 - A0) * k.E.outCubic(k.prog(u, 0, 0.8)); // u anındaki iz ucu açısı
    const g = k.E.outCubic(k.prog(d, 0, 0.8));
    const aNow = front(d);

    // 1) lastik izi: yayın normali yönünde ofsetli iki koyu bant
    if (g > 0.001) {
      for (const off of [-11, 11]) {
        ctx.strokeStyle = k.rgba(p.color, 0.55);
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const steps = 44;
        for (let s = 0; s <= steps; s++) {
          const a = A0 + (aNow - A0) * (s / steps);
          const X = px(a) + Math.cos(a) * off;
          const Y = py(a) + Math.sin(a) * off;
          if (s === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();
      }
      // bantların üst kenarında ince açık yansıma
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      const steps2 = 44;
      for (let s = 0; s <= steps2; s++) {
        const a = A0 + (aNow - A0) * (s / steps2);
        const X = px(a) + Math.cos(a) * -19;
        const Y = py(a) + Math.sin(a) * -19;
        if (s === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
    }

    // 2) toz: izin vardığı noktada doğar, 0.5 sn'de büyüyüp solar
    const ND = 10;
    for (let i = 0; i < ND; i++) {
      const birth = k.hash(i * 7 + 2) * 0.72;   // izin o noktaya varış zamanı
      const dd = d - birth;
      if (dd < 0 || dd > 0.5) continue;
      const gp = k.prog(dd, 0, 0.5);
      const a = front(birth);
      const bx = px(a) + (k.hash(i * 3 + 4) - 0.5) * 44;
      const by = py(a) - 10 - k.hash(i * 5 + 6) * 26 - gp * 14;
      const r = (9 + k.hash(i * 11 + 1) * 15) * (0.6 + gp * 0.9);
      const al = 0.55 * (1 - gp);
      ctx.fillStyle = k.rgba('dim', 0.14 * al);
      ctx.beginPath(); ctx.arc(bx, by, r * 1.7, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 0.5 * al);
      ctx.beginPath(); ctx.arc(bx, by, r, 0, k.TAU); ctx.fill();
      // sol üst parlama (premium finish)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(bx - r * 0.3, by - r * 0.35, r * 0.4, r * 0.28, -0.4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
