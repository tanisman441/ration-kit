// weapons/pistol — yandan görünüm tabanca, namlu sağa bakar.
// Orijinal tasarım; gerçek silah markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) sürgü (slide) merkezidir.
export default {
  name: 'pistol',
  category: 'weapons',
  desc: 'Yandan görünüm tabanca; namlu sağa bakar, ateş anında namlu flaşı ve hafif tepme',
  tags: ['tabanca', 'silah', 'pistol', 'gun', 'handgun', 'ateş', 'FPS', 'yan silah'],
  box: [-95, -38, 100, 74],
  bleed: 60,
  anchor: 'sürgü merkezi (0,0)',
  points: { muzzle: [88, -2], grip: [-40, 54] },
  params: {
    color: { type: 'color', default: 'dim' },
    fire: { type: 'time', default: null, desc: 'ateş anı: namlu flaşı + hafif tepme' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    const metal = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.45))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.fire == null ? -1 : t - p.fire;
    const fireK = d >= 0 && d < 0.18 ? 1 - d / 0.18 : 0;
    const recK = d >= 0 && d < 0.25 ? Math.sin((d / 0.25) * Math.PI) : 0;
    const rx = -7 * recK, ry = -4 * recK;
    const bob = k.noise1(t * 0.8 + 9) * 1.1;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    ctx.save();
    ctx.translate(rx, ry + bob);

    // horoz (hammer)
    blob(-78, -22, 16, 12, 5, metal);
    // sürgü (slide)
    blob(-70, -14, 146, 30, 12, body);
    // sürgü tırtılları (arka)
    for (let i = 0; i < 4; i++) blob(-66 + i * 8, -11, 4, 24, 2, metal);
    // namlu ağzı
    blob(72, -9, 16, 14, 4, dark);
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.arc(82, -2, 4, 0, k.TAU); ctx.fill();
    // gezler
    blob(-64, -24, 12, 11, 3, dark);
    blob(56, -24, 10, 11, 3, dark);
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); ctx.arc(-58, -19, 2.8, 0, k.TAU); ctx.fill();  // arka gez noktası (vurgu)
    // kabza (açılı)
    ctx.save();
    ctx.translate(-58, 14); ctx.rotate(0.16);
    blob(0, 0, 40, 50, 12, dark);
    blob(4, 4, 32, 12, 6, body);       // kabza üst bandı
    for (let i = 0; i < 3; i++) blob(6, 20 + i * 9, 28, 3.5, 1.7, metal);  // tırtıl
    ctx.restore();
    // tetik korkuluğu + tetik
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-18, 16); ctx.quadraticCurveTo(2, 16, 4, 32); ctx.stroke();
    ctx.strokeStyle = metal; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-18, 16); ctx.quadraticCurveTo(2, 16, 4, 32); ctx.stroke();
    blob(-8, 16, 5, 13, 2.5, inkC);

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -8, 20, 5.5, -0.15, 0, k.TAU); ctx.fill();

    ctx.restore();

    // namlu flaşı
    if (fireK > 0) {
      const mx = 92 + rx, my = -2 + ry + bob;
      k.glow(mx, my, 42 * fireK + 14, 'yellow', 0.55 * fireK);
      ctx.fillStyle = k.rgba('yellow', 0.95 * fireK);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * k.TAU + 0.5;
        const L = ((i % 2 === 0 ? 38 : 22) * fireK) + 8;
        const bx = mx + Math.cos(a) * L, by = my + Math.sin(a) * L;
        const px = mx + Math.cos(a + 0.45) * 7, py = my + Math.sin(a + 0.45) * 7;
        const qx = mx + Math.cos(a - 0.45) * 7, qy = my + Math.sin(a - 0.45) * 7;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.lineTo(qx, qy); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,255,255,${(0.9 * fireK).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(mx, my, 10 * fireK + 4, 0, k.TAU); ctx.fill();
    }
  },
};
