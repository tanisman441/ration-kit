// police-fx/helicopter-spot — polis helikopteri: hover'da salınır, rotor döner, arama ışığı zemini süpürür.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi. Orijinal tasarım (araç/heli ile aynı değil).
export default {
  name: 'helicopter-spot',
  category: 'police-fx',
  desc: 'Polis helikopteri: havada salınır, pervane döner, arama ışığı zeminde gezinir',
  tags: ['helikopter', 'polis', 'arama', 'ışık', 'hava', 'kovalamaca', 'helicopter', 'police', 'spotlight', 'search', 'chase'],
  box: [-170, -170, 170, 60],
  bleed: 90,
  anchor: 'gövde merkezi (0,0); arama ışığı zeminde',
  points: { rotor: [0, -125], spotlight: [95, -55], skid: [0, 44] },
  params: {
    sweep: { type: 'number', default: 1, desc: 'arama ışığı süpürme hızı (1 = ~4 sn periyot)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color, 1);
    const ink = k.rgba('ink', 1);

    // hover: salınım + eğim (canlı idle)
    const bob = Math.sin(t * 2.2) * 3;
    const tilt = k.noise1(t * 1.1) * 0.035;
    ctx.save();
    ctx.translate(0, bob);
    ctx.rotate(tilt);

    const blob = (x, y, wd, h, r, c = col) => {
      ctx.fillStyle = O; k.rrect(x - LW / 2, y - LW / 2, wd + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; k.rrect(x, y, wd, h, r); ctx.fill();
    };
    const rod = (x1, y1, x2, y2, w, c = col) => {
      ctx.strokeStyle = O; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // kuyruk bomu + kanatçık
    rod(-40, -25, -120, -18, 14);
    blob(-136, -38, 18, 34, 8);
    // kuyruk rotoru (dönen)
    const trA = t * 18;
    ctx.strokeStyle = O; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-127, -21); ctx.lineTo(-127, -21); ctx.stroke();
    ctx.strokeStyle = ink; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-127 + Math.cos(trA) * 15, -21 + Math.sin(trA) * 15);
    ctx.lineTo(-127 - Math.cos(trA) * 15, -21 - Math.sin(trA) * 15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-127 + Math.cos(trA + 1.57) * 15, -21 + Math.sin(trA + 1.57) * 15);
    ctx.lineTo(-127 - Math.cos(trA + 1.57) * 15, -21 - Math.sin(trA + 1.57) * 15); ctx.stroke();

    // gövde (yuvarlak kabin, burun sağda)
    ctx.fillStyle = O; ctx.beginPath(); ctx.ellipse(-2 - LW / 2, -22, 82 + LW / 2, 44 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(-2, -22, 82, 44, 0, 0, k.TAU); ctx.fill();
    // kokpit camı (burun)
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); ctx.ellipse(38, -30, 30, 24, 0.15, 0, k.TAU); ctx.fill();
    // "POLİS" şeridi (vurgu)
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath(); ctx.ellipse(-2, -8, 78, 12, 0, 0.35, Math.PI - 0.35); ctx.fill();

    // arama lambası (burun altı)
    const lampX = 95, lampY = -52;
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(lampX, lampY, 14, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 1); ctx.beginPath(); ctx.arc(lampX, lampY, 10, 0, k.TAU); ctx.fill();
    k.glow(lampX, lampY, 26, 'yellow', 0.45);

    // kızaklar
    rod(-52, 18, -52, 42, 7, ink);
    rod(52, 18, 52, 42, 7, ink);
    blob(-78, 38, 156, 12, 6, ink);

    // ana rotor direği + göbek
    rod(-4, -66, -4, -122, 10, ink);
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(0, -125, 11, 0, k.TAU); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -125, 8, 0, k.TAU); ctx.fill();

    // premium parlama: kabin sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, -52, 30, 12, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // ANA ROTOR: dönen kanatlar + bulanık disk
    ctx.save();
    ctx.translate(0, bob);
    const rotA = t * 16;
    ctx.fillStyle = k.rgba('bg', 0.25);
    ctx.beginPath(); ctx.ellipse(0, -125, 130, 12, 0, 0, k.TAU); ctx.fill();
    for (let i = 0; i < 2; i++) {
      const a = rotA + i * Math.PI;
      const ex = Math.cos(a) * 125, ey = Math.sin(a) * 125;
      ctx.strokeStyle = O; ctx.lineWidth = 11;
      ctx.beginPath(); ctx.moveTo(0, -125); ctx.lineTo(ex, -125 + ey * 0.1); ctx.stroke();
      ctx.strokeStyle = ink; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(0, -125); ctx.lineTo(ex, -125 + ey * 0.1); ctx.stroke();
    }
    ctx.restore();

    // ARAMA IŞIĞI: koni + zeminde gezinen ışık havuzu (canlı süpürme)
    const sp = k.clamp(p.sweep, 0.1, 3);
    const swx = Math.sin(t * 1.6 * sp) * 70;   // havuzun zemin x'i
    const lx = 95, ly = -52 + bob;
    const gx = 95 + swx, gy = 52;
    // koni (ışın)
    const grad = ctx.createLinearGradient(lx, ly, gx, gy);
    grad.addColorStop(0, k.rgba('yellow', 0.36));
    grad.addColorStop(1, k.rgba('yellow', 0.08));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(lx - 7, ly + 4); ctx.lineTo(lx + 7, ly + 4);
    ctx.lineTo(gx + 42, gy); ctx.lineTo(gx - 42, gy);
    ctx.closePath(); ctx.fill();
    // zemin havuzu
    ctx.fillStyle = k.rgba('yellow', 0.30);
    ctx.beginPath(); ctx.ellipse(gx, gy, 44, 9, 0, 0, k.TAU); ctx.fill();
    k.glow(gx, gy, 30, 'yellow', 0.25);

    ctx.restore();
  },
};
