// wind-fx/kite-dive — dalış yapan uçurtma: hafif salınım idle + dive anında yay çizerek dalış ve hız çizgileri.
// NOT: canvas y-aşağıdır; (0,0) ipin tutulduğu alt noktadır, uçurtma yukarıdadır.
export default {
  name: 'kite-dive', category: 'wind-fx',
  desc: 'Dalış yapan uçurtma: ipte hafif salınım, dive anında yay çizerek dalış ve arkasında hız çizgileri',
  tags: ['uçurtma', 'dalış', 'rüzgar', 'ip', 'kuyruk', 'kite', 'dive', 'wind', 'string', 'tail'],
  box: [-150, -160, 150, 140],
  bleed: 50,
  anchor: 'ip tutma noktası (0,0)',
  points: { kite: [0, -95], tail: [0, -40] },
  params: {
    dive: { type: 'time', default: null, desc: 'dalış anı (1.2 sn: uçurtma yay çizerek dalar, hız çizgileri belirir)' },
    color: { type: 'color', default: 'red' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: uçurtma büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.dive == null ? -1 : t - p.dive;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();
    ctx.lineCap = 'round';

    // --- dalış zarfı (1.2 sn: in → dön → toparlan) ---
    let dx = 0, dy = 0, dspin = 0, dline = 0;
    if (d >= 0 && d < 1.2) {
      const dp = k.prog(d, 0, 1.2);
      const arc = Math.sin(dp * Math.PI);          // 0 → 1 → 0
      dx = 85 * S * arc;
      dy = 105 * S * arc;
      dspin = 1.1 * arc;
      dline = arc;
    }

    // --- uçurtma konumu: salınım idle + dalış ---
    const kx = 14 * S * Math.sin(t * 1.1) + dx;
    const ky = -95 * S + 9 * S * Math.sin(t * 1.7 + 1) + dy;
    const krot = 0.16 * Math.sin(t * 1.3) + dspin;

    // --- hız çizgileri (dalış anında, uçurtmanın sol üstünde) ---
    if (dline > 0) {
      for (let i = 0; i < 4; i++) {
        const h = k.hash(i * 19 + 4);
        const lx = kx - (60 + 40 * h) * S * dline;
        const ly = ky - (50 + 30 * h) * S * dline;
        ctx.strokeStyle = k.rgba('ink', 0.45 * dline);
        ctx.lineWidth = 3 * S;
        ctx.beginPath();
        ctx.moveTo(lx - 34 * S * dline, ly - 20 * S * dline);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }
    }

    // --- ip (tutma noktasından uçurtmaya, ink çizgi) ---
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 2.5 * S;
    ctx.beginPath();
    ctx.moveTo(0, 128 * S);
    ctx.quadraticCurveTo(kx * 0.4 + 10 * S * Math.sin(t * 2.2), ky * 0.5 + 60 * S, kx, ky + 34 * S);
    ctx.stroke();

    ctx.translate(kx, ky); ctx.rotate(krot);

    // --- uçurtma gövdesi (eşkenar dörtgen) ---
    const W = 62 * S, H = 76 * S;
    ctx.beginPath();
    ctx.moveTo(0, -H / 2); ctx.lineTo(W / 2, 0); ctx.lineTo(0, H / 2); ctx.lineTo(-W / 2, 0);
    ctx.closePath();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5 * S;
    ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 0.92);
    ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath();
    ctx.ellipse(-W * 0.22, -H * 0.24, W * 0.22, H * 0.16, -0.5, 0, k.TAU);
    ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba(p.color, 0.14);
    ctx.beginPath();
    ctx.ellipse(W * 0.22, H * 0.26, W * 0.24, H * 0.17, 0.5, 0, k.TAU);
    ctx.fill();
    // --- çapraz çıtalar (ink, alfa 0.5) ---
    ctx.strokeStyle = k.rgba('ink', 0.5);
    ctx.lineWidth = 3 * S;
    ctx.beginPath();
    ctx.moveTo(0, -H / 2); ctx.lineTo(0, H / 2);
    ctx.moveTo(-W / 2, 0); ctx.lineTo(W / 2, 0);
    ctx.stroke();

    // --- kuyruk: ip + 3 fiyonk (dalgalanır) ---
    ctx.strokeStyle = k.rgba('ink', 0.65);
    ctx.lineWidth = 2.5 * S;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    const tlen = 52 * S;
    for (let i = 1; i <= 3; i++) {
      const ty = H / 2 + (i / 3) * tlen;
      const tx = 8 * S * Math.sin(t * 3.4 + i * 1.9) + (dline * 14 * S * Math.sin(t * 18 + i));
      if (i === 1) ctx.quadraticCurveTo(tx * 0.5, H / 2 + tlen * 0.16, tx, ty);
      else ctx.lineTo(tx, ty);
      // fiyonk
      ctx.save();
      ctx.translate(tx, ty); ctx.rotate(0.4 * Math.sin(t * 4 + i * 2.4));
      ctx.fillStyle = k.rgba(p.color, 0.9);
      ctx.beginPath();
      ctx.moveTo(-9 * S, 0); ctx.lineTo(0, -6 * S); ctx.lineTo(9 * S, 0); ctx.lineTo(0, 6 * S);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.stroke();

    ctx.restore();
  },
};
