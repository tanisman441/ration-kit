// vehicle-fx/tire-tracks — lastik izleri: roll anında iki paralel iz soldan sağa belirir, toz eşlik eder.
// NOT: canvas y-aşağıdır; (0,0) izlerin ortası, araç soldan sağa gitmiş varsayılır.
export default {
  name: 'tire-tracks',
  category: 'vehicle-fx',
  desc: 'Lastik izleri: roll anında iki paralel dişli iz soldan sağa belirir, toz eşlik eder',
  tags: ['lastik', 'iz', 'tekerlek', 'yol', 'toprak', 'araba', 'tire', 'tracks', 'wheel', 'road', 'trail', 'car'],
  box: [-190, -72, 190, 72],
  bleed: 44,
  anchor: 'izlerin ortası (0,0); izler soldan sağa uzar',
  points: { start: [-170, 0], end: [170, 0] },
  params: {
    roll: { type: 'time', default: null, desc: 'geçiş anı: izler 0.7 sn\'de belirir, toz 0.6 sn\'de solar' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.roll == null ? -1 : t - p.roll;
    if (d < 0 || d > 1.25) return;
    ctx.save();
    const X0 = -170, X1 = 170;
    const frontX = (u) => X0 + (X1 - X0) * k.E.outCubic(k.prog(u, 0, 0.7)); // u anındaki iz ucu x
    const fx = frontX(d);
    const wob = (x) => Math.sin(x * 0.02) * 4;       // ize hafif dalga

    // 1) iz bantları: dişli desen (kısa dikdörtgenler), iz ucuna kadar
    for (const yc of [-26, 26]) {
      // bant kenar çizgileri
      for (const eo of [-9, 9]) {
        ctx.strokeStyle = k.rgba(p.color, 0.4);
        ctx.lineWidth = 3;
        ctx.beginPath();
        const steps = 34;
        let started = false;
        for (let s = 0; s <= steps; s++) {
          const x = X0 + (fx - X0) * (s / steps);
          const y = yc + wob(x) + eo;
          if (!started) { ctx.moveTo(x, y); started = true; }
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // dişler
      for (let x = X0 + 6; x <= fx - 4; x += 22) {
        const y = yc + wob(x);
        ctx.fillStyle = k.rgba(p.color, 0.55);
        k.rrect(x - 7, y - 8, 14, 16, 4);
        ctx.fill();
        // dişin sol üst parlaması (premium finish)
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        k.rrect(x - 7, y - 8, 14, 6, 3);
        ctx.fill();
      }
    }

    // 2) toz: izin vardığı noktada doğar, 0.6 sn'de büyüyüp solar
    const ND = 10;
    for (let i = 0; i < ND; i++) {
      const birth = k.hash(i * 7 + 3) * 0.66;        // izin o noktaya varış zamanı
      const dd = d - birth;
      if (dd < 0 || dd > 0.6) continue;
      const gp = k.prog(dd, 0, 0.6);
      const bx = frontX(birth) + (k.hash(i * 3 + 5) - 0.5) * 30;
      const side = k.hash(i * 9 + 1) > 0.5 ? 1 : -1;
      const by = side * 26 + wob(bx) - 6 - k.hash(i * 5 + 7) * 18 - gp * 12;
      const r = (8 + k.hash(i * 11 + 2) * 13) * (0.6 + gp * 0.9);
      const al = 0.5 * (1 - gp);
      ctx.fillStyle = k.rgba('dim', 0.14 * al);
      ctx.beginPath(); ctx.arc(bx, by, r * 1.7, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 0.5 * al);
      ctx.beginPath(); ctx.arc(bx, by, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(bx - r * 0.3, by - r * 0.35, r * 0.4, r * 0.28, -0.4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
