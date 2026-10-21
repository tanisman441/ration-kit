// water-fx-2/geyser-burst — kayalık ağızdan fışkıran gayzer: burst anında
// su sütunu yükselir (1.2 sn), damla yağmuru + buhar eşlik eder. Boştayken
// küçük kabarcıklar ve ince buhar şeridi kıpırdar (idle).
// NOT: canvas y-aşağıdır; (0,0) püskürme ağzıdır.
export default {
  name: 'geyser-burst', category: 'water-fx-2',
  desc: 'Kayalık ağızdan yukarı fışkıran gayzer sütunu, damlalar ve buhar',
  tags: ['gayzer', 'geyser', 'fışkırma', 'patlama', 'su sütunu', 'buhar', 'eruption', 'burst', 'kaplıca', 'fıskiye'],
  box: [-140, -205, 140, 45],
  bleed: 50,
  anchor: 'püskürme ağzı (0,0)',
  points: { vent: [0, 0], crown: [0, -185] },
  params: {
    burst: { type: 'time', default: null, desc: 'püskürme anı (sütun 1.2 sn yükselir, sonra söner)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.burst == null ? -1 : t - p.burst;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // Kaya ağzı: dim rrect tümsek + koyu delik
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-86, -26, 172, 66, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(-86, -26, 172, 66, 16); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); ctx.ellipse(0, -8, 26, 12, 0, 0, k.TAU); ctx.fill();
    // premium finish: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -14, 34, 12, -0.3, 0, k.TAU); ctx.fill();

    // Idle kabarcıklar: burst yokken ağızda küçük damlacıklar
    const idleBub = d < 0 || d > 1.2;
    if (idleBub) {
      for (let i = 0; i < 4; i++) {
        const seed = i * 17 + 3;
        const ph = (t * 0.9 + k.hash(seed)) % 1;
        const bx = (k.hash(seed + 1) - 0.5) * 36;
        const by = -12 - ph * 42;
        ctx.fillStyle = k.rgba(acc, 0.5 * (1 - ph));
        ctx.beginPath(); ctx.arc(bx, by, 3.5 * (1 - ph) + 1, 0, k.TAU); ctx.fill();
      }
      // ince buhar şeridi
      const wy = -34 - 22 * Math.sin(t * 2.2);
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(6 + Math.sin(t * 1.7) * 8, wy, 13, 24, 0.2, 0, k.TAU); ctx.fill();
    }
    if (d < 0 || d > 1.6) { ctx.restore(); return; }

    // Su sütunu: 0→1.2 sn yükselir, kalınlığı dalgalanır
    const rise = k.prog(d, 0, 0.45), fall = k.prog(d, 0.85, 1.45);
    const H = 190 * rise * (1 - fall * 0.55);
    const alpha = 1 - fall;
    if (H > 4) {
      const wob = Math.sin(t * 22) * 5;
      ctx.fillStyle = k.rgba(acc, 0.85 * alpha);
      ctx.beginPath();
      ctx.moveTo(-15, -4);
      ctx.bezierCurveTo(-19 + wob, -H * 0.35, -13 - wob, -H * 0.7, -9, -H);
      ctx.quadraticCurveTo(0, -H - 12, 9, -H);
      ctx.bezierCurveTo(13 - wob, -H * 0.7, 19 + wob, -H * 0.35, 15, -4);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
      // sol üst parlama sütunda
      ctx.fillStyle = 'rgba(255,255,255,' + (0.1 * alpha).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(-9, -H * 0.62, 8, H * 0.22, 0.12, 0, k.TAU); ctx.fill();
      // tepe köpüğü
      ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * alpha).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(0, -H, 17 + rise * 8, 11, 0, 0, k.TAU); ctx.fill();
    }

    // Damlalar: tepeden yana savrulur, düşer
    const dg = k.prog(d, 0.15, 1.35), dal = 1 - dg;
    for (let i = 0; i < 22; i++) {
      const seed = i * 43 + 21;
      const h1 = k.hash(seed), h2 = k.hash(seed + 1), h3 = k.hash(seed + 2);
      const vx = (h1 - 0.5) * 260;
      const vy = -(150 + h2 * 200);
      const x = vx * dg, y = -H * 0.95 + vy * dg + 320 * dg * dg;
      if (y > 20) continue;
      ctx.fillStyle = k.rgba(acc, (0.55 + h3 * 0.4) * dal * alpha);
      ctx.beginPath();
      ctx.ellipse(x, y, 2.6 + h3 * 3, 4 + h3 * 5, 0, 0, k.TAU);
      ctx.fill();
    }

    // Buhar bulutları: sütunu sarar, yükselir
    for (let i = 0; i < 6; i++) {
      const seed = i * 29 + 7;
      const ph = k.prog(d, 0.1 + i * 0.05, 1.3);
      const sx = (k.hash(seed) - 0.5) * 70 + Math.sin(t * 3 + seed) * 8;
      const sy = -30 - ph * 200;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.28 * (1 - ph) * alpha).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(sx, sy, 22 + ph * 30, 14 + ph * 22, 0, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
