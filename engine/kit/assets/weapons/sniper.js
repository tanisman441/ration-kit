// weapons/sniper — yandan görünüm dürbünlü uzun tüfek, namlu sağa bakar.
// Orijinal tasarım; gerçek silah markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'sniper',
  category: 'weapons',
  desc: 'Yandan görünüm dürbünlü keskin nişancı tüfeği; ateş anında namlu flaşı, geri tepme ve dürbün parlaması',
  tags: ['keskin nişancı', 'tüfek', 'dürbün', 'silah', 'sniper', 'rifle', 'scope', 'ateş', 'FPS', 'uzun menzil'],
  box: [-160, -70, 225, 80],
  bleed: 80,
  anchor: 'gövde merkezi (0,0)',
  points: { muzzle: [218, -6], grip: [-60, 44], scope: [8, -41] },
  params: {
    color: { type: 'color', default: 'dim' },
    fire: { type: 'time', default: null, desc: 'ateş anı: namlu flaşı + geri tepme + dürbün parlaması' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    const metal = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.45))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.fire == null ? -1 : t - p.fire;
    const fireK = d >= 0 && d < 0.22 ? 1 - d / 0.22 : 0;
    const recK = d >= 0 && d < 0.3 ? Math.sin((d / 0.3) * Math.PI) : 0;
    const rx = -13 * recK;
    const bob = k.noise1(t * 0.8 + 21) * 1.1;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const tube = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    ctx.save();
    ctx.translate(rx, bob);

    // dipçik (ayarlı yanak desteği)
    blob(-158, -16, 58, 34, 10, dark);
    blob(-118, -30, 30, 16, 6, dark);              // yanak desteği
    // gövde
    blob(-102, -14, 100, 30, 9, body);
    // dürbün: montaj ayakları
    blob(-28, -32, 10, 18, 3, metal);
    blob(28, -32, 10, 18, 3, metal);
    // dürbün gövdesi
    blob(-46, -54, 100, 22, 11, dark);
    // objektif (ön, geniş)
    blob(48, -58, 22, 30, 10, metal);
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(63, -43, 6, 11, 0, 0, k.TAU); ctx.fill();
    // oküler (arka)
    blob(-58, -52, 14, 18, 7, metal);
    // ayar kulesi
    blob(-4, -66, 16, 13, 4, dark);
    // el kundağı (uzun)
    blob(-2, -11, 92, 24, 10, dark);
    blob(10, -7, 66, 16, 8, body);
    // namlu (uzun, ince)
    tube(90, -6, 214, -6, 9, metal);
    // namlu ağzı
    blob(210, -11, 14, 16, 4, dark);
    // şarjör + kabza
    blob(-62, 15, 24, 36, 8, dark);
    ctx.save();
    ctx.translate(-100, 15); ctx.rotate(0.2);
    blob(0, 0, 21, 36, 9, dark);
    ctx.restore();
    // tetik
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-74, 15); ctx.quadraticCurveTo(-58, 15, -56, 28); ctx.stroke();
    ctx.strokeStyle = metal; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-74, 15); ctx.quadraticCurveTo(-58, 15, -56, 28); ctx.stroke();
    // çatal ayak (bipod)
    tube(70, 12, 52, 62, 8, metal);
    tube(70, 12, 88, 62, 8, metal);
    blob(44, 56, 18, 10, 4, dark);
    blob(80, 56, 18, 10, 4, dark);

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, -8, 26, 6, -0.15, 0, k.TAU); ctx.fill();

    ctx.restore();

    // dürbün parlaması (ateş anında objektifte)
    const glintK = d >= 0 && d < 0.35 ? Math.sin((d / 0.35) * Math.PI) : 0;
    if (glintK > 0) {
      const gx = 63 + rx, gy = -43 + bob;
      ctx.fillStyle = `rgba(255,255,255,${(0.85 * glintK).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(gx - 16 * glintK, gy); ctx.lineTo(gx, gy - 6); ctx.lineTo(gx + 16 * glintK, gy); ctx.lineTo(gx, gy + 6);
      ctx.closePath(); ctx.fill();
    }

    // namlu flaşı
    if (fireK > 0) {
      const mx = 228 + rx, my = -6 + bob;
      k.glow(mx, my, 60 * fireK + 18, 'yellow', 0.55 * fireK);
      ctx.fillStyle = k.rgba('yellow', 0.95 * fireK);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * k.TAU + 0.2;
        const L = ((i % 2 === 0 ? 58 : 32) * fireK) + 10;
        const bx = mx + Math.cos(a) * L, by = my + Math.sin(a) * L;
        const px = mx + Math.cos(a + 0.35) * 9, py = my + Math.sin(a + 0.35) * 9;
        const qx = mx + Math.cos(a - 0.35) * 9, qy = my + Math.sin(a - 0.35) * 9;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.lineTo(qx, qy); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,255,255,${(0.9 * fireK).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(mx, my, 14 * fireK + 5, 0, k.TAU); ctx.fill();
      if (d > 0.06) {
        for (let i = 0; i < 4; i++) {
          const h = k.hash(i * 11 + 5);
          const sx = mx + 12 + h * 30, sy = my - 14 - d * 50 - h * 16;
          const sa = Math.max(0, 0.38 - d * 0.3);
          ctx.fillStyle = k.rgba('dim', sa);
          ctx.beginPath(); ctx.arc(sx, sy, 7 + d * 13 + h * 5, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};
