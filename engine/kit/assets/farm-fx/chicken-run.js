// farm-fx/chicken-run — koşan tavuk, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayak tabanıdır.
export default {
  name: 'chicken-run', category: 'farm-fx',
  desc: 'Koşan tavuk, yandan görünüm; run anında bacaklar hızlı döner, hız çizgileri ve toz çıkar',
  tags: ['tavuk', 'koşan', 'koşu', 'çiftlik', 'kümes', 'kanatlı', 'chicken', 'running', 'farm', 'hen'],
  box: [-120, -115, 120, 12],
  bleed: 45,
  anchor: 'ayak tabanı (0,0)',
  points: { head: [38, -90], feet: [0, 0], tail: [-42, -70] },
  params: {
    color: { type: 'color', default: 'panel2' },
    run: { type: 'time', default: null, desc: 'koşu anı — bacaklar hızlı döner, hız çizgileri + toz (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const combC = k.rgba('red'), beakC = k.rgba('yellow'), legC = k.rgba('yellow');
    const df = p.run == null ? -1 : t - p.run;
    const running = df >= 0 && df < 1.2;
    const env = running ? Math.sin(df / 1.2 * Math.PI) : 0;   // koşu zarfı
    const cycle = t * k.TAU * 6.5;                            // bacak turu
    const breath = Math.sin(t * k.TAU * 0.42) * 2;            // idle nefes
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const tri = (x1, y1, x2, y2, x3, y3, c) => {
      ctx.fillStyle = line; ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath();
      ctx.lineWidth = LW; ctx.lineJoin = 'round'; ctx.stroke(); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {                  // kalın çizgi bacak/kanat
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // bacaklar (vücuttan önce: arka planda)
    for (const [hx, ph] of [[-12, 0], [14, Math.PI]]) {
      const fx = hx + (running ? Math.cos(cycle + ph) * 22 * env : 0);
      const fy = -(running ? Math.max(0, Math.sin(cycle + ph)) * 20 * env : 0);
      limb(hx, -34, fx, fy - 2, 7, legC);
      // ayak: kısa yatay rrect
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(fx - 11, fy - 7, 22, 9, 4); ctx.fill();
      ctx.fillStyle = legC; ctx.beginPath(); k.rrect(fx - 9, fy - 5, 18, 6, 3); ctx.fill();
    }

    ctx.save();
    const bodyY = running ? -Math.abs(Math.sin(cycle)) * 8 * env : breath;
    ctx.translate(0, bodyY);
    if (running) ctx.rotate(-0.12 * env);                      // koşu eğimi

    // kuyruk tüyleri
    const tsw = running ? Math.sin(cycle + 2) * 0.25 * env : Math.sin(t * k.TAU * 0.5) * 0.06;
    for (const i of [-1, 0, 1]) {
      const a = Math.PI - 0.5 + i * 0.35 + tsw;
      tri(-30, -62, -30 + Math.cos(a) * 34, -62 + Math.sin(a) * 34,
          -30 + Math.cos(a + 0.18) * 34, -62 + Math.sin(a + 0.18) * 34, body);
    }

    // gövde
    disc(0, -56, 42, 32, body);

    // kanat (yanda, koşuda çırpınır)
    const wingA = running ? -0.3 + Math.sin(cycle) * 0.55 * env : -0.3 + Math.sin(t * k.TAU * 0.42) * 0.06;
    limb(-4, -58, -4 + Math.sin(wingA) * 46, -58 - Math.cos(wingA) * 46, 16, body);

    // baş
    const headBob = running ? Math.sin(cycle + 1.2) * 5 * env : Math.sin(t * k.TAU * 0.9) * 2 + breath * 0.4;
    const hx = 40, hy = -90 + headBob;
    disc(hx, hy, 21, 19, body);
    // ibik (vurgu: kırmızı)
    for (const i of [0, 1, 2])
      tri(hx - 12 + i * 11, hy - 16, hx - 7 + i * 11, hy - 16, hx - 10 + i * 11, hy - 30 + (i % 2) * 4, combC);
    // gaga
    tri(hx + 18, hy - 6, hx + 18, hy + 6, hx + 38, hy, beakC);
    // göz (3–5 sn'de bir kırpma)
    const tb = t % 4.2;
    const eyeH = tb < 0.12 ? 0.6 : 4;
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(hx + 8, hy - 4, 3.6, eyeH, 0, 0, k.TAU); ctx.fill();

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -78, 15, 9, -0.3, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(30, -100, 8, 5, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();

    // hız çizgileri (koşu anında arkada)
    if (running) {
      ctx.strokeStyle = k.rgba('ink', 0.35 * env); ctx.lineWidth = 4;
      for (const [ly, off] of [[-38, 0], [-58, 12], [-80, 4]]) {
        ctx.beginPath(); ctx.moveTo(-116 + off, ly); ctx.lineTo(-66 + off, ly); ctx.stroke();
      }
    }
    // toz bulutları (ayakların arkasında)
    if (running) {
      for (let i = 0; i < 4; i++) {
        const age = (df / 1.2 + i * 0.25) % 1;
        const px = -58 - age * 55 - k.hash(i * 7 + 3) * 22;
        const py = -8 - age * 16 - k.hash(i * 7 + 5) * 10;
        const r = 5 + age * 15;
        ctx.fillStyle = k.rgba('dim', 0.32 * env * (1 - age));
        ctx.beginPath(); ctx.ellipse(px, py, r, r * 0.7, 0, 0, k.TAU); ctx.fill();
      }
    }
  },
};
