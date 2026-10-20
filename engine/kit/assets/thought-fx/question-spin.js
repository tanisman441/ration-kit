// thought-fx/question-spin — soru işareti boştayken süzülür ve salınır; spin anında 360° döner, kıvılcım çentikleri saçar.
// NOT: canvas y-aşağıdır; (0,0) işaretin dönüş merkezi.
export default {
  name: 'question-spin', category: 'thought-fx',
  desc: 'Question mark that floats gently and spins a full turn on the spin moment',
  tags: ['soru', 'işaret', 'merak', 'şüphe', 'question', 'mark', 'spin', 'why', 'curiosity', 'wonder'],
  box: [-78, -86, 78, 66],
  bleed: 32,
  anchor: 'dönüş merkezi (0,0)',
  points: { top: [0, -64], dot: [2, 34], centre: [0, -8] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'işaret rengi' },
    spin: { type: 'time', default: null, desc: '360° dönüş anı (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.spin == null ? -1 : t - p.spin;
    const floatY = Math.sin(t * k.TAU / 2.4) * 3;          // canlı idle: hafif süzülme
    let rot = Math.sin(t * 0.9) * 0.05;                    // idle: minik salınım
    if (d >= 0 && d < 0.8) {                                // dönüş (easeInOut)
      const e = k.clamp(d / 0.8, 0, 1);
      const ee = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
      rot += ee * k.TAU;
    }
    ctx.translate(0, floatY);
    ctx.rotate(rot);
    const mark = k.rgba(p.color), line = k.rgba('bg', 0.55), sh = k.rgba('ink', 0.12);
    const trace = (c, w, ox, oy) => {
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath();
      ctx.arc(ox, -16 + oy, 34, Math.PI * 0.75, Math.PI * 2.02);
      ctx.lineTo(10 + ox, 16 + oy);
      ctx.stroke();
    };
    trace(sh, 9, 7, 8);            // gölge
    trace(line, 14, 0, 0);         // dış hat
    trace(mark, 9, 0, 0);          // gövde
    // nokta
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(9, 42, 12, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = mark; ctx.beginPath(); ctx.ellipse(2, 34, 9, 9, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst yay üzerinde, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, -42, 11, 7, -0.5, 0, k.TAU); ctx.fill();
    // dönüş kıvılcımları
    if (d >= 0 && d < 0.8) {
      const g = k.clamp(d / 0.8, 0, 1);
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + 0.4;
        const r1 = 52 + g * 26, r2 = 66 + g * 26;
        ctx.strokeStyle = k.rgba(p.color, 0.75 * (1 - g));
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, -8 + Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, -8 + Math.sin(a) * r2);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
