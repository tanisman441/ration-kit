// water-fx-2/fountain-arcs — fıskiye: iki yanal yay + dikey merkez jeti,
// damlalar parabol boyunca döngülü akar. spurt anında yaylar 0.8 sn yükselir.
// NOT: canvas y-aşağıdır; (0,0) su havzası merkezidir.
export default {
  name: 'fountain-arcs', category: 'water-fx-2',
  desc: 'Fıskiye: yanal su yayları ve dikey jet, damlalar parabol boyunca akar',
  tags: ['fıskiye', 'fountain', 'su yayı', 'jet', 'havuz', 'süs havuzu', 'water jets', 'arcs', 'park', 'meydan'],
  box: [-175, -185, 175, 60],
  bleed: 40,
  anchor: 'su havzası merkezi (0,0)',
  points: { jet: [0, -165], left: [-118, 12], right: [118, 12], basin: [0, 30] },
  params: {
    spurt: { type: 'time', default: null, desc: 'yayların yükseldiği an (0.8 sn sürer)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.spurt == null ? -1 : t - p.spurt;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // spurt eğrisi
    const lift = d < 0 ? 0 : k.prog(d, 0, 0.2) * (1 - k.prog(d, 0.5, 0.8));
    const boost = 1 + lift * 0.25;

    // Havza: rrect kâse + dalgalı su çizgisi
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(-150, 2, 300, 50, 18); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(-150, 2, 300, 50, 18); ctx.stroke();
    // premium finish: sol üst parlama (kâse kenarı)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-95, 14, 46, 12, -0.3, 0, k.TAU); ctx.fill();
    // su yüzeyi
    ctx.fillStyle = k.rgba(acc, 0.55);
    ctx.beginPath();
    ctx.moveTo(-138, 12);
    for (let x = -138; x <= 138; x += 12) ctx.lineTo(x, 12 + Math.sin(x * 0.11 + t * 3.4) * 3);
    ctx.lineTo(138, 22); ctx.lineTo(-138, 22);
    ctx.closePath(); ctx.fill();

    // Nozüller: kâse iç kenarlarında iki yan + merkez
    const nozzle = (x) => {
      ctx.fillStyle = k.rgba('ink', 0.8);
      k.rrect(x - 11, -6, 22, 18, 7); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 2.5;
      k.rrect(x - 11, -6, 22, 18, 7); ctx.stroke();
    };
    nozzle(-118); nozzle(118); nozzle(0);

    // Damla akışı: parabol boyunca faz kaymalı boncuklar (kuadratik bezier)
    const beads = (x0, y0, cx, cy, x1, y1, n, speed, phase) => {
      for (let i = 0; i < n; i++) {
        const ph = (((t * speed + phase + i / n) % 1) + 1) % 1;
        const q0x = x0 + (cx - x0) * ph, q0y = y0 + (cy - y0) * ph;
        const q1x = cx + (x1 - cx) * ph, q1y = cy + (y1 - cy) * ph;
        const x = q0x + (q1x - q0x) * ph, y = q0y + (q1y - q0y) * ph;
        const sz = 3 + (1 - ph) * 2.5;
        ctx.fillStyle = k.rgba(acc, 0.85);
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      }
    };

    // yan yaylar (parabol), tepe spurt ile yükselir
    beads(-118, -6, -59, -105 * boost, -8, 8, 14, 1.5, 0);
    beads(118, -6, 59, -105 * boost, 8, 8, 14, 1.5, 0.5);
    // merkez dikey jet: yukarı çıkar, dağılır (tepe box+bleed içinde kalır)
    const JH = 140 * boost;
    for (let i = 0; i < 12; i++) {
      const ph = ((t * 1.9 + i / 12) % 1 + 1) % 1;
      const y = -6 - ph * JH;
      const spread = ph * ph * 16 * (k.hash(i * 13 + 5) - 0.3);
      ctx.fillStyle = k.rgba(acc, 0.9 * (1 - ph * 0.5));
      ctx.beginPath(); ctx.arc(spread, y, 4.5 - ph * 1.5, 0, k.TAU); ctx.fill();
    }
    // jet tepesi köpük
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.ellipse(0, -6 - JH, 13, 9, 0, 0, k.TAU); ctx.fill();

    // düşüş noktalarında köpük
    for (const lx of [-8, 8]) {
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.ellipse(lx, 10 + Math.sin(t * 9 + lx) * 2, 12, 5, 0, 0, k.TAU); ctx.fill();
    }

    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(90, 52, 56, 12, 0.2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
