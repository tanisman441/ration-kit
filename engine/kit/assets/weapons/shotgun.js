// weapons/shotgun — yandan görünüm pompalı tüfek, namlu sağa bakar.
// Orijinal tasarım; gerçek silah markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'shotgun',
  category: 'weapons',
  desc: 'Yandan görünüm pompalı tüfek; kalın namlu, kayar pompa, ateş anında flaş ve güçlü geri tepme',
  tags: ['pompalı', 'tüfek', 'silah', 'shotgun', 'gun', 'pump', 'ateş', 'FPS', 'av tüfeği'],
  box: [-155, -58, 215, 66],
  bleed: 85,
  anchor: 'gövde merkezi (0,0)',
  points: { muzzle: [203, -6], grip: [-62, 48] },
  params: {
    color: { type: 'color', default: 'dim' },
    fire: { type: 'time', default: null, desc: 'ateş anı: geniş namlu flaşı + güçlü geri tepme' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    const metal = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.45))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // ateş: geniş flaş + güçlü geri tepme
    const d = p.fire == null ? -1 : t - p.fire;
    const fireK = d >= 0 && d < 0.22 ? 1 - d / 0.22 : 0;
    const recK = d >= 0 && d < 0.3 ? Math.sin((d / 0.3) * Math.PI) : 0;
    const rx = -15 * recK;
    const bob = k.noise1(t * 0.8) * 1.2;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    ctx.save();
    ctx.translate(rx, bob);

    // dipçik
    blob(-152, -19, 54, 40, 10, dark);
    blob(-152, -19, 20, 40, 8, metal);
    // gövde
    blob(-100, -16, 96, 34, 9, body);
    // pompa (kayar ön kabza) — tırtık çizgili
    blob(-8, -14, 52, 30, 9, dark);
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      const gx = 2 + i * 11;
      ctx.beginPath(); ctx.moveTo(gx, -10); ctx.lineTo(gx, 12); ctx.stroke();
    }
    // şarjör borusu (pompanın altı)
    blob(-4, 16, 84, 12, 6, metal);
    // kalın namlu
    blob(44, -10, 150, 15, 7, metal);
    blob(44, -10, 150, 6, 3, body);            // namlu üst çizgisi
    // namlu ağzı
    blob(192, -13, 16, 21, 6, dark);
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.arc(200, -2.5, 4.5, 0, k.TAU); ctx.fill();
    // kabza
    ctx.save();
    ctx.translate(-100, 18); ctx.rotate(0.22);
    blob(0, 0, 22, 38, 9, dark);
    ctx.restore();
    // tetik korkuluğu + tetik
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-72, 18); ctx.quadraticCurveTo(-54, 18, -54, 32); ctx.stroke();
    ctx.strokeStyle = metal; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-72, 18); ctx.quadraticCurveTo(-54, 18, -54, 32); ctx.stroke();
    blob(-64, 18, 6, 14, 3, inkC);
    // arka gez noktası (vurgu)
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); ctx.arc(-88, -26, 3.2, 0, k.TAU); ctx.fill();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, -8, 24, 6, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();

    // namlu flaşı (geniş yıldız)
    if (fireK > 0) {
      const mx = 212 + rx, my = -4 + bob;
      k.glow(mx, my, 62 * fireK + 20, 'yellow', 0.55 * fireK);
      ctx.fillStyle = k.rgba('yellow', 0.95 * fireK);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * k.TAU + 0.2;
        const L = ((i % 2 === 0 ? 60 : 34) * fireK) + 10;
        const bx = mx + Math.cos(a) * L, by = my + Math.sin(a) * L;
        const px = mx + Math.cos(a + 0.32) * 10, py = my + Math.sin(a + 0.32) * 10;
        const qx = mx + Math.cos(a - 0.32) * 10, qy = my + Math.sin(a - 0.32) * 10;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.lineTo(qx, qy); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,255,255,${(0.9 * fireK).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(mx, my, 15 * fireK + 6, 0, k.TAU); ctx.fill();
      // duman
      if (d > 0.05) {
        for (let i = 0; i < 4; i++) {
          const h = k.hash(i * 7 + 5);
          const sx = mx + 12 + h * 30, sy = my - 14 - d * 50 - h * 16;
          const sa = Math.max(0, 0.4 - d * 0.3);
          ctx.fillStyle = k.rgba('dim', sa);
          ctx.beginPath(); ctx.arc(sx, sy, 7 + d * 14 + h * 6, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};
