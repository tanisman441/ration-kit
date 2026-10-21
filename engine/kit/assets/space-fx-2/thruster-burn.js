// space-fx-2/thruster-burn — roket itici alevi: nozuldan çıkan mavi-beyaz alev
// sürekli yanar, itme titremesiyle salınır; `at` anında 0.6 sn ateşleme patlaması yapar.
// NOT: canvas y-aşağıdır; (0,0) nozul çıkışıdır, alev aşağı (y+) uzar.
export default {
  name: 'thruster-burn',
  category: 'space-fx-2',
  desc: 'Roket itici alevi: nozuldan sürekli mavi-beyaz alev çıkar, titreyerek yanar',
  tags: ['itici', 'roket', 'alev', 'motor', 'yanma', 'itme', 'güç', 'thruster', 'rocket', 'engine', 'flame', 'burn', 'nozzle'],
  box: [-80, -90, 80, 170],
  bleed: 45,
  anchor: 'nozul çıkışı (0,0)',
  points: { nozzle: [0, -40], 'flame-tip': [0, 110] },
  params: {
    throttle: { type: 'number', default: 1, desc: '0.2–1.5: itme gücü, alev boyunu belirler' },
    at: { type: 'time', default: null, desc: 'ateşleme anı: 0.6 sn alev güçlenir, şok dalgası yayılır' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.size, 0.5, 1.5);
    const T = k.clamp(p.throttle, 0.2, 1.5);
    ctx.save();

    // --- nozul: dim gövde, panel2 ağız ---
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath();
    ctx.moveTo(-28 * S, -88 * S); ctx.lineTo(28 * S, -88 * S);
    ctx.lineTo(40 * S, -34 * S); ctx.lineTo(-40 * S, -34 * S);
    ctx.closePath(); ctx.fill();
    // nozul ağzı
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); ctx.ellipse(0, -32 * S, 40 * S, 12 * S, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.ellipse(0, -32 * S, 30 * S, 8 * S, 0, 0, k.TAU); ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-14 * S, -66 * S, 16 * S, 26 * S, 0.35, 0, k.TAU); ctx.fill();

    // --- alev uzunluğu: idle titreme + itme ---
    const jitter = 0.82 + 0.18 * k.noise1(t * 21);        // itme titremesi
    let boost = 0;
    if (d >= 0 && d < 0.6) boost = 1 - k.prog(d, 0, 0.6);  // ateşleme anı: 0.6 sn
    const flen = (95 + 55 * T) * S * jitter * (1 + 0.7 * boost);
    const fwid = (34 + 10 * T) * S * (0.9 + 0.1 * k.noise1(t * 17 + 5));

    // şok dalgası (ateşleme anı)
    if (d >= 0 && d < 0.6) {
      const e = k.prog(d, 0, 0.6);
      ctx.strokeStyle = k.rgba('cyan', 0.7 * (1 - e));
      ctx.lineWidth = 5 * S;
      ctx.beginPath(); ctx.ellipse(0, -20 * S, (50 + 130 * e) * S, (18 + 44 * e) * S, 0, 0, k.TAU); ctx.stroke();
      k.glow(0, 20 * S, (90 + 160 * e) * S, k.col('cyan'), 0.4 * (1 - e));
    }

    // --- alev katmanları: dış cyan glow, orta beyaz, çekirdek ---
    k.glow(0, flen * 0.4, flen * 0.75, k.col('cyan'), (0.30 + 0.12 * jitter) * (0.6 + 0.4 * T));
    // dış alev konisi
    ctx.fillStyle = k.rgba('cyan', (0.75 * jitter + 0.2 * boost));
    ctx.beginPath();
    ctx.moveTo(-fwid, -30 * S);
    ctx.quadraticCurveTo(-fwid * 0.55, flen * 0.55, -fwid * 0.12, flen);
    ctx.quadraticCurveTo(0, flen * 1.06, fwid * 0.12, flen);
    ctx.quadraticCurveTo(fwid * 0.55, flen * 0.55, fwid, -30 * S);
    ctx.closePath(); ctx.fill();
    // iç beyaz çekirdek
    const clen = flen * 0.55 * (0.9 + 0.1 * k.noise1(t * 25 + 9));
    ctx.fillStyle = k.rgba('bg', 0.95);
    ctx.beginPath();
    ctx.moveTo(-fwid * 0.45, -30 * S);
    ctx.quadraticCurveTo(-fwid * 0.25, clen * 0.6, 0, clen);
    ctx.quadraticCurveTo(fwid * 0.25, clen * 0.6, fwid * 0.45, -30 * S);
    ctx.closePath(); ctx.fill();
    // Mach elmasları: içte parlayan kesitler (idle yanıp sönme)
    const nd = Math.floor(clen / (26 * S));
    for (let i = 0; i < nd; i++) {
      const my = (i + 1) * 26 * S;
      const mw = fwid * 0.34 * (1 - i / (nd + 1)) * (0.8 + 0.2 * k.noise1(t * 19 + i * 7));
      const tw = 0.5 + 0.5 * k.noise1(t * 15 + i * 11 + 2);
      ctx.fillStyle = k.rgba('cyan', 0.35 + 0.4 * tw);
      ctx.beginPath(); ctx.ellipse(0, my, mw, 7 * S, 0, 0, k.TAU); ctx.fill();
    }
    // sol üst parlama (premium finish)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-fwid * 0.3, flen * 0.3, fwid * 0.22, flen * 0.2, 0.2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
