// coast-fx/buoy-bob — şamandıra dalgada sallanır, yanıp sönen lambasıyla yüzer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) su yüzeyi (şamandıranın yüzdüğü seviye).
export default {
  name: 'buoy-bob', category: 'coast-fx',
  desc: 'Kırmızı-beyaz şamandıra dalgada yükselip alçalır, yana yatar; tepesindeki lamba ritmik yanıp söner',
  tags: ['şamandıra', 'dalga', 'deniz', 'sahil', 'işaret', 'lamba', 'buoy', 'wave', 'sea', 'coast', 'float', 'beacon'],
  box: [-150, -110, 150, 110],
  bleed: 25,
  anchor: 'su yüzeyi (0,0); şamandıra gövdesi y -30..45, lamba y ~-58',
  points: { lamp: [0, -58], top: [0, -30], waterline: [0, 0] },
  params: {
    color: { type: 'color', default: 'red' },
    speed: { type: 'number', default: 1, desc: 'dalga hızı çarpanı (1 = tam salınım ~3 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // gökyüzü: hafif bulut çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.3); ctx.lineWidth = 4;
    for (let i = 0; i < 2; i++) {
      const cy = -92 + i * 30 + Math.sin(t * 0.3 + i) * 2;
      ctx.beginPath(); ctx.moveTo(-120 + i * 30, cy); ctx.lineTo(-30 + i * 30, cy); ctx.stroke();
    }
    // uzak ufuk çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-150, -58); ctx.lineTo(150, -58); ctx.stroke();

    // deniz: dalga yüzeyi (şamandıranın etrafında yükselir)
    const waveY = (x) => Math.sin(x * 0.045 + t * 1.8 * (p.speed || 1)) * 5;
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath();
    ctx.moveTo(-150, 110);
    ctx.lineTo(-150, waveY(-150));
    for (let x = -150; x <= 150; x += 10) ctx.lineTo(x, waveY(x));
    ctx.lineTo(150, 110);
    ctx.closePath(); ctx.fill();
    // dalga sırt çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      const wy = 52 + i * 26;
      ctx.beginPath();
      for (let x = -140; x <= 140; x += 14) {
        const yy = wy + Math.sin(x * 0.05 + t * 1.4 + i * 2) * 3;
        if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    // şamandıra: dalgayla yükselir-alçalır, yana yatar
    const bob = Math.sin(t * k.TAU / 3 * (p.speed || 1)) ;
    const bobY = bob * 7;
    const tilt = Math.cos(t * k.TAU / 3 * (p.speed || 1)) * 0.12;
    ctx.save();
    ctx.translate(0, bobY);
    ctx.rotate(tilt);
    // su altı taban (suda kalan kısım, hafif görünür)
    ctx.fillStyle = k.rgba('ink', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 26, 30, 10, 0, 0, k.TAU); ctx.fill();
    // gövde: konik şamandıra
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(-34, 28); ctx.lineTo(-20, -34); ctx.lineTo(20, -34); ctx.lineTo(34, 28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath();
    ctx.moveTo(-29, 26); ctx.lineTo(-17, -30); ctx.lineTo(17, -30); ctx.lineTo(29, 26); ctx.closePath(); ctx.fill();
    // beyaz bant
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); ctx.moveTo(-24, 6); ctx.lineTo(-19, -12); ctx.lineTo(19, -12); ctx.lineTo(24, 6); ctx.closePath(); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, -16, 5, 14, 0.12, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(12, 20, 9, 3, 0, 0, k.TAU); ctx.fill();
    // direk + lamba
    ctx.strokeStyle = line; ctx.lineWidth = LW + 3;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, -52); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, -52); ctx.stroke();
    // yanıp sönen lamba (2 sn periyot, 0.5 sn yanık)
    const lampPhase = (t % 2);
    const lampOn = lampPhase < 0.5 ? 1 - lampPhase / 0.5 * 0.4 : 0.12;
    k.glow(0, -58, 20, 'yellow', 0.5 * lampOn);
    ctx.fillStyle = k.rgba('yellow', lampOn);
    ctx.beginPath(); ctx.arc(0, -58, 7, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -58, 9, 0, k.TAU); ctx.stroke();
    // lamba yansıması suda
    if (lampOn > 0.5) {
      ctx.fillStyle = k.rgba('yellow', 0.25 * lampOn);
      ctx.beginPath(); ctx.ellipse(0, 8 + bobY * 0.3, 18, 4, 0, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // şamandıranın suya değdiği yerde köpük halkaları
    const foam = 0.5 + 0.5 * Math.sin(t * k.TAU / 3 * (p.speed || 1) + Math.PI / 2);
    ctx.strokeStyle = k.rgba('bg', 0.35 + 0.3 * foam);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, waveY(0) + 2, 38 + foam * 8, 5, 0, 0, k.TAU); ctx.stroke();
  },
};
