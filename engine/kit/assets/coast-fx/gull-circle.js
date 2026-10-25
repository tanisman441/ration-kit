// coast-fx/gull-circle — martı döngüsel olarak daire çizer, kanat çırpar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) uçuş dairesinin merkezi.
export default {
  name: 'gull-circle', category: 'coast-fx',
  desc: 'Beyaz martı gökyüzünde daire çizerek uçar; kanatlar ritmik çırpar, arkada süzülen iki martı daha var',
  tags: ['martı', 'kuş', 'uçuş', 'daire', 'gökyüzü', 'deniz', 'seagull', 'bird', 'fly', 'circle', 'sky', 'coast'],
  box: [-150, -110, 150, 110],
  bleed: 20,
  anchor: 'uçuş dairesinin merkezi (0,0); martı yörünge yarıçapı ~70',
  points: { centre: [0, 0], gull: [70, 0], sky: [0, -80] },
  params: {
    color: { type: 'color', default: 'panel2' },
    speed: { type: 'number', default: 1, desc: 'uçuş hızı çarpanı (1 = tam tur ~5 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // gökyüzü: süzülen bulut çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.3); ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const cy = -88 + i * 26 + Math.sin(t * 0.3 + i * 2) * 2;
      const cx = -110 + i * 40 + Math.sin(t * 0.2 + i) * 6;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 70, cy); ctx.stroke();
    }
    // deniz (alt bant)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-150, 82, 300, 28, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -140; x <= 140; x += 14) {
      const yy = 94 + Math.sin(x * 0.05 + t * 1.2) * 2.5;
      if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();

    // uçuş yörüngesi (ince, silik daire izi)
    ctx.strokeStyle = k.rgba('bg', 0.18); ctx.lineWidth = 2;
    ctx.setLineDash([6, 10]);
    ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.stroke();
    ctx.setLineDash([]);

    // arka plandaki iki süzülen martı (yavaş, kanat çırpmadan)
    const drawFarGull = (bx, by, s) => {
      ctx.strokeStyle = k.rgba('dim', 0.7); ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx - 14 * s, by - 3 * s);
      ctx.quadraticCurveTo(bx, by + 4 * s, bx + 14 * s, by - 3 * s);
      ctx.stroke();
    };
    drawFarGull(-96 + Math.sin(t * 0.25) * 8, -52 + Math.sin(t * 0.4) * 4, 0.8);
    drawFarGull(92 + Math.sin(t * 0.2 + 1) * 8, -70 + Math.sin(t * 0.33 + 2) * 4, 0.65);

    // ana martı: daire üzerinde uçar, gidiş yönüne bakar
    const ang = t * k.TAU / 5 * (p.speed || 1) - Math.PI / 2;
    const R = 70;
    const gx = Math.cos(ang) * R;
    const gy = Math.sin(ang) * R * 0.85;
    const heading = ang + Math.PI / 2; // teğet yön (y-aşağı: saat yönü)
    const flap = Math.sin(t * k.TAU / 0.55); // kanat çırpma (~0.55 sn periyot)

    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(heading);
    ctx.scale(1.3, 1.3);
    // kanatlar (çırpma: yukarı-aşağı döner)
    const wingAng = flap * 0.55;
    ctx.save();
    ctx.rotate(-wingAng);
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(0, -2); ctx.quadraticCurveTo(-16, -26, -34, -30); ctx.quadraticCurveTo(-14, -8, 0, 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath();
    ctx.moveTo(0, -1); ctx.quadraticCurveTo(-15, -22, -30, -26); ctx.quadraticCurveTo(-12, -7, 0, 1); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.rotate(wingAng);
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(0, 2); ctx.quadraticCurveTo(-16, 26, -34, 30); ctx.quadraticCurveTo(-14, 8, 0, -2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath();
    ctx.moveTo(0, 1); ctx.quadraticCurveTo(-15, 22, -30, 26); ctx.quadraticCurveTo(-12, 7, 0, -1); ctx.closePath(); ctx.fill();
    ctx.restore();
    // gövde
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(2, 0, 22, 9, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(2, 0, 19, 7, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-4, -4, 10, 3, 0, 0, k.TAU); ctx.fill();
    // baş + gaga
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(20, -3, 8.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(20, -3, 6.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.95);
    ctx.beginPath(); ctx.moveTo(25, -5); ctx.lineTo(34, -2); ctx.lineTo(25, -1); ctx.closePath(); ctx.fill();
    // göz
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.arc(22, -5, 1.8, 0, k.TAU); ctx.fill();
    // kuyruk
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(-16, -4); ctx.lineTo(-30, -8); ctx.lineTo(-30, 4); ctx.lineTo(-16, 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath();
    ctx.moveTo(-16, -3); ctx.lineTo(-27, -6); ctx.lineTo(-27, 3); ctx.lineTo(-16, 3); ctx.closePath(); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(4, 7, 10, 2.5, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // martının gölgesi denizde (yörüngeyle senkron, hafif)
    const shx = gx * 0.9;
    ctx.fillStyle = k.rgba('ink', 0.1);
    ctx.beginPath(); ctx.ellipse(shx, 96, 16, 3, 0, 0, k.TAU); ctx.fill();
  },
};
