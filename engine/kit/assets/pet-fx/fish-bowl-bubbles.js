// pet-fx/fish-bowl-bubbles — baloncuk çıkaran balık fanusu; tap anında balık ürker. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) masadır, fanus negatif y yönünde yukarı uzar.
export default {
  name: 'fish-bowl-bubbles', category: 'pet-fx',
  desc: 'Yuvarlak cam fanusta yüzen balık, sürekli yükselen baloncuklar; cama vurulunca balık ürker',
  tags: ['balık', 'fanus', 'akvaryum', 'evcil hayvan', 'baloncuk', 'su', 'fish', 'fishbowl', 'aquarium', 'pet', 'bubbles'],
  box: [-125, -230, 125, 15],
  bleed: 60,
  anchor: 'masa (0,0); fanus çapı ~190 birim',
  points: { top: [0, -205], water: [0, -80], fish: [0, -115] },
  params: {
    color: { type: 'color', default: 'dim' },
    tap: { type: 'time', default: null, desc: 'cama vurulma — halka dalgaları yayılır, balık ürker ve kaçar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const glass = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const fishC = k.rgba('yellow'), waterC = k.rgba('cyan', 0.22);
    const dt = p.tap == null ? -1 : t - p.tap;
    const tapped = dt >= 0 && dt < 0.9;
    const tEnv = tapped ? Math.sin(Math.min(dt / 0.9, 1) * Math.PI) : 0;
    const tapX = -92, tapY = -120;                            // vurulan cam noktası
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const bubble = (x, y, r, a) => {
      ctx.strokeStyle = k.rgba('cyan', a); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.28, 0, k.TAU); ctx.fill();
    };

    // masa
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(120, 0); ctx.stroke();
    // masa gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 2, 95, 9, 0, 0, k.TAU); ctx.fill();

    // fanus camı (arka yarım — suyun arkasında kalır)
    const R = 95, cy = -118;
    ctx.fillStyle = waterC;
    ctx.beginPath(); ctx.arc(0, cy, R, 0, k.TAU); ctx.fill();
    // su yüzeyi
    ctx.fillStyle = k.rgba('cyan', 0.35);
    ctx.beginPath(); ctx.ellipse(0, cy - 42, R * 0.92, 12, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('cyan', 0.7); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, cy - 42, R * 0.92, 12, 0, 0, k.TAU); ctx.stroke();

    // balık: yön değiştirerek yüzer (canlı idle); tap anında ürker ve kaçar
    const dir = Math.cos(t * 0.55) >= 0 ? 1 : -1;
    const fx = tapped ? 52 * (dt < 0.45 ? 1 - dt * 2 : -0.9 + (dt - 0.45) * 1.8) * -dir
      : Math.sin(t * 0.55) * 44;
    const fy = cy + 12 + Math.sin(t * 2.1) * 6 - (tapped ? tEnv * 18 : 0);
    const tailWag = tapped ? Math.sin(t * 40) * 0.9 : Math.sin(t * 9) * 0.45;
    ctx.save(); ctx.translate(fx, fy); ctx.scale(dir, 1);
    // kuyruk
    ctx.save(); ctx.rotate(tailWag);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(-48, -16); ctx.lineTo(-48, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = fishC;
    ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-44, -13); ctx.lineTo(-44, 13); ctx.closePath(); ctx.fill();
    ctx.restore();
    // gövde
    disc(0, 0, 30, 20, fishC);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-12, -8, 10, 6, -0.4, 0, k.TAU); ctx.fill();
    // yüz (aile dili); ürkerken gözler büyür
    ctx.fillStyle = inkC;
    const er = tapped ? 4.6 : 3.4;
    ctx.beginPath(); ctx.ellipse(12, -4, er, er, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(20, 6, 4, 0.3, Math.PI - 0.3); ctx.stroke();
    // üst yüzgeç
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-6, -18); ctx.lineTo(6, -30); ctx.lineTo(14, -16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = fishC;
    ctx.beginPath(); ctx.moveTo(-4, -18); ctx.lineTo(6, -26); ctx.lineTo(11, -16); ctx.closePath(); ctx.fill();
    ctx.restore();

    // baloncuklar: sürekli yükselir (canlı idle)
    for (let i = 0; i < 7; i++) {
      const h1 = k.hash(i * 31 + 3), h2 = k.hash(i * 31 + 11), h3 = k.hash(i * 31 + 23);
      const rise = (t * (26 + h2 * 30) + h1 * 170) % 170;
      const bx = -60 + h3 * 120 + Math.sin(t * 2 + i * 2.4) * 6;
      const by = -40 - rise;
      if (by > cy - R + 14) bubble(bx, by, 3.5 + h2 * 5, 0.75);
    }

    // fanus camı (ön yarım — parlak çerçeve)
    ctx.strokeStyle = line; ctx.lineWidth = LW + 6;
    ctx.beginPath(); ctx.arc(0, cy, R + 2, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = glass; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, cy, R + 2, 0, k.TAU); ctx.stroke();
    // cam parlaması (sol üst, alfa 0.10)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(0, cy, R - 6, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke();

    // tap: vuruş halkaları + camda çatlama işareti
    if (tapped) {
      for (let i = 0; i < 3; i++) {
        const rr = dt * 130 + i * 14;
        const a = 0.7 * (1 - dt / 0.9) * (1 - i * 0.22);
        ctx.strokeStyle = k.rgba('ink', Math.max(a, 0)); ctx.lineWidth = 4 - i;
        ctx.beginPath(); ctx.arc(tapX, tapY, Math.max(rr, 1), 0, k.TAU); ctx.stroke();
      }
      // vuruş yıldızı
      ctx.strokeStyle = k.rgba('yellow', 0.9 * (1 - dt / 0.9)); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const an = i * Math.PI / 2 + 0.4;
        ctx.beginPath(); ctx.moveTo(tapX + Math.cos(an) * 8, tapY + Math.sin(an) * 8);
        ctx.lineTo(tapX + Math.cos(an) * (18 + dt * 26), tapY + Math.sin(an) * (18 + dt * 26)); ctx.stroke();
      }
    }
  },
};
