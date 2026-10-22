// farm-fx/tractor-bounce — hoplayan traktör, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) teker tabanıdır.
export default {
  name: 'tractor-bounce', category: 'farm-fx',
  desc: 'Hoplayan traktör, yandan görünüm; gövde süspansiyonda sürekli salınır, tekerler döner, egzoz duman çıkarır',
  tags: ['traktör', 'çiftlik', 'tarla', 'araç', 'hoplama', 'süspansiyon', 'tractor', 'farm', 'vehicle', 'bounce'],
  box: [-135, -150, 135, 35],
  bleed: 55,
  anchor: 'teker tabanı (0,0)',
  points: { cabin: [-24, -108], hood: [60, -78], exhaust: [62, -130] },
  params: {
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const glassC = k.rgba('ink', 0.85), lampC = k.rgba('yellow');
    const sus = Math.sin(t * k.TAU * 0.45);                    // süspansiyon salınımı (~2.2 sn)
    const bodyY = sus * 5, bodyRot = sus * 0.02;
    const spin = t * 1.4;                                     // teker dönüşü
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const rbox = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const wheel = (cx, cy, r) => {                            // teker: lastik + dönen jant
      disc(cx, cy, r, r, inkC);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(spin * (r > 35 ? 1 : 1.6));
      for (const i of [0, 1, 2]) {
        const a = i * k.TAU / 3;
        ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (r - 12), Math.sin(a) * (r - 12)); ctx.stroke();
      }
      ctx.restore();
      disc(cx, cy, r * 0.28, r * 0.28, k.rgba('dim'));
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.beginPath(); ctx.ellipse(cx, cy, 4, 4, 0, 0, k.TAU); ctx.fill();
    };

    // tekerler (sabit, gövde salınır)
    wheel(-62, -46, 46);
    wheel(78, -30, 30);

    ctx.save();
    ctx.translate(0, bodyY);
    ctx.rotate(bodyRot);

    // şasi
    rbox(-95, -78, 160, 22, 10, k.rgba('ink', 0.55));

    // kabin
    rbox(-58, -142, 64, 70, 12, body);
    rbox(-50, -134, 48, 38, 8, glassC);                       // cam
    ctx.fillStyle = 'rgba(255,255,255,0.18)';                  // cam parlaması
    ctx.beginPath(); ctx.ellipse(-40, -122, 8, 12, 0.3, 0, k.TAU); ctx.fill();

    // kaput (ön)
    rbox(14, -102, 86, 50, 12, body);
    ctx.fillStyle = k.rgba('ink', 0.4);                        // ızgara çizgileri
    for (const gy of [-88, -76, -64]) {
      ctx.fillRect(88, gy, 8, 3);
    }
    // far
    disc(103, -84, 8, 8, lampC);
    k.glow(103, -84, 20, 'yellow', 0.25);

    // egzoz borusu
    rbox(58, -138, 11, 48, 5, k.rgba('ink', 0.6));
    disc(63, -138, 8, 5, k.rgba('dim'));

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -132, 12, 7, -0.3, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(45, -95, 16, 8, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();

    // egzoz dumanı (döngülü, hash tabanlı)
    for (let i = 0; i < 4; i++) {
      const age = (t * 0.55 + i * 0.25) % 1;
      const px = 63 + k.noise1(t * 2 + i * 9) * 8 + age * 22;
      const py = -146 - age * 58;
      const r = 6 + age * 15;
      ctx.fillStyle = k.rgba('dim', 0.30 * (1 - age));
      ctx.beginPath(); ctx.ellipse(px, py, r, r * 0.85, 0, 0, k.TAU); ctx.fill();
    }
    // arka teker tozu (hafif, döngülü)
    for (let i = 0; i < 2; i++) {
      const age = (t * 0.7 + i * 0.5) % 1;
      ctx.fillStyle = k.rgba('dim', 0.22 * (1 - age));
      ctx.beginPath(); ctx.ellipse(-108 - age * 20, -8 - age * 8, 5 + age * 10, 4 + age * 7, 0, 0, k.TAU); ctx.fill();
    }
  },
};
