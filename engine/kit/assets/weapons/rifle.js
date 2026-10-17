// weapons/rifle — yandan görünüm saldırı tüfeği, namlu sağa bakar.
// Orijinal tasarım; gerçek silah markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'rifle',
  category: 'weapons',
  desc: 'Yandan görünüm saldırı tüfeği; namlu sağa bakar, ateş anında namlu flaşı ve geri tepme',
  tags: ['tüfek', 'silah', 'saldırı tüfeği', 'rifle', 'gun', 'assault rifle', 'ateş', 'FPS', 'piyade'],
  box: [-150, -52, 210, 62],
  bleed: 75,
  anchor: 'gövde merkezi (0,0)',
  points: { muzzle: [198, -4], grip: [-58, 46] },
  params: {
    color: { type: 'color', default: 'dim' },
    fire: { type: 'time', default: null, desc: 'ateş anı: namlu flaşı + geri tepme' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    const metal = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.45))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // ateş: flaş + geri tepme
    const d = p.fire == null ? -1 : t - p.fire;
    const fireK = d >= 0 && d < 0.2 ? 1 - d / 0.2 : 0;
    const recK = d >= 0 && d < 0.28 ? Math.sin((d / 0.28) * Math.PI) : 0;
    const rx = -11 * recK;
    const bob = k.noise1(t * 0.8) * 1.2;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    ctx.save();
    ctx.translate(rx, bob);

    // dipçik
    blob(-148, -17, 52, 36, 10, dark);
    blob(-148, -17, 20, 36, 8, metal);            // dipçik tabanı
    // gövde
    blob(-98, -15, 108, 32, 9, body);
    // üst ray
    blob(-92, -23, 180, 9, 4, metal);
    // arka gez
    blob(-88, -36, 16, 14, 4, dark);
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); ctx.arc(-80, -29, 3.2, 0, k.TAU); ctx.fill();  // gez noktası (vurgu)
    // kurma kolu
    blob(-104, -12, 14, 8, 3, metal);
    // ön gez
    blob(72, -34, 12, 13, 3, dark);
    // el kundağı
    blob(8, -12, 78, 26, 10, dark);
    blob(20, -8, 54, 18, 8, body);
    // namlu
    blob(86, -6, 102, 11, 5, metal);
    // namlu freni (ağız)
    blob(186, -10, 16, 19, 5, dark);
    blob(188, -5, 12, 3, 1.5, inkC); blob(188, 2, 12, 3, 1.5, inkC);
    // şarjör (kavisli)
    blob(-58, 16, 26, 40, 8, dark);
    blob(-58, 16, 26, 12, 6, metal);
    // kabza
    ctx.save();
    ctx.translate(-96, 16); ctx.rotate(0.22);
    blob(0, 0, 22, 38, 9, dark);
    ctx.restore();
    // tetik korkuluğu + tetik
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-70, 16); ctx.quadraticCurveTo(-52, 16, -52, 30); ctx.stroke();
    ctx.strokeStyle = metal; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-70, 16); ctx.quadraticCurveTo(-52, 16, -52, 30); ctx.stroke();
    blob(-62, 16, 6, 14, 3, inkC);

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -8, 22, 6, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();

    // namlu flaşı (yıldız)
    if (fireK > 0) {
      const mx = 206 + rx, my = -4 + bob;
      k.glow(mx, my, 55 * fireK + 18, 'yellow', 0.55 * fireK);
      ctx.fillStyle = k.rgba('yellow', 0.95 * fireK);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * k.TAU + 0.35;
        const L = ((i % 2 === 0 ? 52 : 30) * fireK) + 10;
        const bx = mx + Math.cos(a) * L, by = my + Math.sin(a) * L;
        const px = mx + Math.cos(a + 0.35) * 9, py = my + Math.sin(a + 0.35) * 9;
        const qx = mx + Math.cos(a - 0.35) * 9, qy = my + Math.sin(a - 0.35) * 9;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.lineTo(qx, qy); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,255,255,${(0.9 * fireK).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(mx, my, 13 * fireK + 5, 0, k.TAU); ctx.fill();
      // duman
      const sd = d;
      if (sd > 0.05) {
        for (let i = 0; i < 3; i++) {
          const h = k.hash(i * 7 + 3);
          const sx = mx + 10 + h * 26, sy = my - 12 - sd * 46 - h * 14;
          const sa = Math.max(0, 0.35 - sd * 0.28);
          ctx.fillStyle = k.rgba('dim', sa);
          ctx.beginPath(); ctx.arc(sx, sy, 6 + sd * 12 + h * 5, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};
