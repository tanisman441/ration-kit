// animals/bird — uçuşan kuş, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi.
export default {
  name: 'bird', category: 'animals',
  desc: 'Uçuşan kuş, yandan görünüm; kanatlar sürekli çırpınır, fly olayında hızlanır',
  tags: ['kuş', 'uçan', 'kanat', 'gökyüzü', 'bird', 'flying', 'wing', 'fly'],
  box: [-115, -85, 115, 85],
  bleed: 45,
  anchor: 'gövde merkezi (0,0)',
  points: { beak: [80, -15], tail: [-82, 2], head: [40, -16] },
  params: {
    color: { type: 'color', default: 'dim' },
    fly: { type: 'time', default: null, desc: 'kanat hızlanması — kalkış/dalış, gövde eğilir (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const beakC = k.rgba('yellow');
    const df = p.fly == null ? -1 : t - p.fly;
    const flying = df >= 0 && df < 0.9;
    const fenv = flying ? Math.sin(df / 0.9 * Math.PI) : 0;          // hızlanma zarfı
    const flap = Math.sin(t * k.TAU * 3 + fenv * 4) * (0.8 + fenv * 0.5); // kanat çırpışı
    const bob = Math.sin(t * k.TAU * 3) * 3;                        // hafif süzülme
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const tri = (x1, y1, x2, y2, x3, y3, c) => {
      ctx.fillStyle = line; ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath();
      ctx.lineWidth = LW; ctx.stroke(); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();
    };

    const wingBlade = (bx, by, ang, len, w, c) => {
      const tx = bx + Math.sin(ang) * len, ty = by - Math.cos(ang) * len;
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
    };

    ctx.save();
    ctx.translate(0, bob);
    if (flying) ctx.rotate(-0.25 * fenv);                            // dalış eğimi

    // arka kanat (uzak, koyu gölge)
    wingBlade(0, -8, -0.45 - flap * 0.7, 62, 24, k.rgba('bg', 0.35));

    // kuyruk tüyleri
    const tsway = Math.sin(t * k.TAU * 3) * 0.1;
    for (const i of [-1, 0, 1]) {
      ctx.save(); ctx.translate(-48, 0); ctx.rotate(i * 0.35 + tsway);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-38, -8, 38, 16, 8); ctx.fill();
      ctx.fillStyle = body; ctx.beginPath(); k.rrect(-36, -6, 34, 12, 6); ctx.fill();
      ctx.restore();
    }

    // gövde
    disc(0, 0, 42, 27, body);

    // baş + gaga
    disc(40, -16, 23, 21, body);
    tri(58, -23, 58, -7, 80, -15, beakC);
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(46, -22, 4, 4, 0, 0, k.TAU); ctx.fill();

    // ön kanat (yakın): geriye yatık kürek formunda çırpınır
    wingBlade(2, -10, -0.45 + flap, 84, 28, body);

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(28, -28, 10, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-12, -12, 16, 9, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();

    // hız çizgileri (fly olayında arkada)
    if (flying) {
      ctx.strokeStyle = k.rgba('ink', 0.35 * fenv); ctx.lineWidth = 4;
      for (const ly of [-20, 0, 20]) {
        ctx.beginPath(); ctx.moveTo(-115, ly + bob); ctx.lineTo(-70, ly + bob); ctx.stroke();
      }
    }
  },
};
