// night-fx/owl-blink — baykuş: dalda tüneyen baykuş; idle'da 3–5 sn'de bir göz kırpar ve
// kafası hafifçe salınır; at anında 1.2 sn gözler parlar (gece gözü yansıması).
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir, dal y≈78'dedir.
export default {
  name: 'owl-blink', category: 'night-fx',
  desc: 'Tüneyen baykuş; göz kırpma + kafa salınımı, at anında göz parlaması',
  tags: ['baykuş', 'kuş', 'gece', 'göz', 'kırpma', 'parlama', 'owl', 'night', 'bird', 'blink', 'eyes'],
  box: [-95, -115, 95, 105],
  bleed: 30,
  anchor: 'gövde merkezi (0,10); dal y=78',
  points: { eyeL: [-22, -42], eyeR: [22, -42], feet: [0, 76] },
  params: {
    color: { type: 'color', default: 'dim' },
    glow: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'gece gözü parlaması anı (1.2 sn: gözler ışık yansıtır)' },
  },
  draw(ctx, t, p, k) {
    const LW = 8;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- göz kırpma: her ~4.2 sn'de 0.14 sn kapalı ---
    const cyc = t % 4.2;
    const lid = cyc < 0.14 ? Math.sin((cyc / 0.14) * Math.PI) : 0; // 0 açık, 1 kapalı
    // --- kafa salınımı: yavaş, ±3 birim ---
    const sway = Math.sin(t * 0.9) * 3;
    // --- at: göz parlaması ---
    const d = p.at == null ? -1 : t - p.at;
    const shine = (d >= 0 && d < 1.2) ? Math.sin(k.clamp(d / 1.2, 0, 1) * Math.PI) : 0;

    // --- dal (baykuşun arkasında) ---
    ctx.strokeStyle = line; ctx.lineWidth = 14 + LW;
    ctx.beginPath(); ctx.moveTo(-95, 84); ctx.quadraticCurveTo(0, 74, 95, 86); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-92, 82); ctx.quadraticCurveTo(0, 72, 92, 84); ctx.stroke();

    // --- gövde ---
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 16, 52 + LW / 2, 58 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.ellipse(0, 16, 52, 58, 0, 0, k.TAU); ctx.fill();
    // göğüs tüy deseni (iç çizgiler, ink alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.arc(0, 34 + i * 14, 26 - i * 5, 0.4, Math.PI - 0.4); ctx.stroke();
    }
    // premium parlama (sol üst 0.10) + sağ alt gölge
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, -18, 18, 26, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(24, 48, 20, 24, -0.4, 0, k.TAU); ctx.fill();

    // --- kanatlar ---
    ctx.strokeStyle = line; ctx.lineWidth = 20 + LW;
    ctx.beginPath(); ctx.moveTo(-50, 10); ctx.quadraticCurveTo(-62, 40, -44, 62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(50, 10); ctx.quadraticCurveTo(62, 40, 44, 62); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 18;
    ctx.beginPath(); ctx.moveTo(-50, 10); ctx.quadraticCurveTo(-62, 40, -44, 62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(50, 10); ctx.quadraticCurveTo(62, 40, 44, 62); ctx.stroke();

    // --- kafa (salınır) ---
    ctx.save();
    ctx.translate(sway, 0);
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -52, 44 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, -52, 44, 0, k.TAU); ctx.fill();
    // kulak püskülleri
    for (const ex of [-30, 30]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.moveTo(ex - 10, -84); ctx.lineTo(ex + 10, -84); ctx.lineTo(ex, -104); ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.moveTo(ex - 7, -84); ctx.lineTo(ex + 7, -84); ctx.lineTo(ex, -100); ctx.closePath(); ctx.fill();
    }
    // kafa parlama (sol üst 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -72, 14, 10, -0.5, 0, k.TAU); ctx.fill();

    // --- gözler ---
    for (const ex of [-22, 22]) {
      // göz çukuru
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(ex, -46, 17 + LW / 2, 0, k.TAU); ctx.fill();
      if (lid > 0.5) {
        // kapalı: yay çizgisi
        ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(ex, -46, 13, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.beginPath(); ctx.arc(ex, -46, 15, 0, k.TAU); ctx.fill();
        const pr = 6 + shine * 2.5;
        ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); ctx.arc(ex, -46, pr, 0, k.TAU); ctx.fill();
        if (shine > 0.02) {
          // gece gözü yansıması: parlak nokta + glow
          k.glow(ex, -46, 26, p.glow, 0.55 * shine);
          ctx.fillStyle = `rgba(255,255,255,${(0.9 * shine).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(ex - 3, -50, 4.5 * shine + 1, 0, k.TAU); ctx.fill();
        }
      }
    }
    // gaga
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.moveTo(-7, -28); ctx.lineTo(7, -28); ctx.lineTo(0, -18); ctx.closePath(); ctx.fill();
    ctx.restore();

    // --- ayaklar ---
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 6;
    for (const fx of [-16, 16]) {
      ctx.beginPath(); ctx.moveTo(fx, 68); ctx.lineTo(fx, 78); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx - 8, 80); ctx.lineTo(fx + 8, 80); ctx.stroke();
    }
  },
};
