// fantasy/potion — mantarlı yuvarlak iksir şişesi; içinde dalgalanan mor sıvı ve yükselen baloncuklar.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) şişe taban merkezidir.
export default {
  name: 'potion',
  category: 'fantasy',
  desc: 'Mantarlı yuvarlak iksir şişesi; mor sıvı dalgalanır, baloncuklar yükselir; fizz anında köpürür',
  tags: ['iksir', 'büyü iksiri', 'şişe', 'sihir', 'potion', 'magic potion', 'elixir', 'flask'],
  box: [-95, -112, 95, 112],
  bleed: 60,
  anchor: 'taban merkezi (0,0)',
  points: { mouth: [0, -72] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'cam rengi' },
    liquid: { type: 'color', default: 'purple', desc: 'sıvı rengi' },
    fizz: { type: 'time', default: null, desc: 'köpürme anı' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const blob = (x, y, w, h, r, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); k.rrect(x + 5, y + 7, w, h, r); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - 3, y - 3, w + 6, h + 6, r + 3); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const d = p.fizz == null ? -1 : t - p.fizz;
    const fizzing = d >= 0 && d < 0.8;

    // boyun + ağız + mantar (sıvının arkasında)
    blob(-19, -58, 38, 54, 8, p.color, k.rgba(p.color, 0.55));
    blob(-25, -72, 50, 15, 6, p.color, sh(p.color, 0.75));
    blob(-13, -94, 26, 24, 6, p.color, sh(p.color, 0.6));

    // gövde camı
    const bodyPath = () => { ctx.beginPath(); ctx.ellipse(0, 42, 60, 56, 0, 0, k.TAU); };
    ctx.save(); ctx.translate(5, 7); ctx.fillStyle = sh(p.color); bodyPath(); ctx.fill(); ctx.restore();
    ctx.lineWidth = 6; ctx.strokeStyle = O; bodyPath(); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 0.5); bodyPath(); ctx.fill();

    // sıvı (camın içinde kırpılır)
    ctx.save(); bodyPath(); ctx.clip();
    const amp = fizzing ? 10 : 4, spd = fizzing ? 7 : 2.2;
    const surf = x => 30 + Math.sin(x * 0.12 + t * spd) * amp;
    ctx.fillStyle = k.rgba(p.liquid, 0.92);
    ctx.beginPath();
    ctx.moveTo(-62, 100);
    for (let x = -62; x <= 62; x += 6) ctx.lineTo(x, surf(x));
    ctx.lineTo(62, 100); ctx.closePath(); ctx.fill();
    // yüzey çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.25); ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -62; x <= 62; x += 6) { const y = surf(x); if (x === -62) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke();

    // ANIMASYON 1 — idle baloncuklar: sürekli yükselir
    const bspd = fizzing ? 70 : 24;
    for (let i = 0; i < (fizzing ? 8 : 3); i++) {
      const h1 = k.hash(i * 3 + 41), h2 = k.hash(i * 5 + 42);
      const cyc = ((t * bspd + i * 37 + h1 * 30) % 78);
      const by = 88 - cyc, bx = (h2 - 0.5) * 76 + k.noise1(i * 7 + t * 2) * 6;
      if (by < surf(bx) + 4) continue;
      const r = 2.5 + h1 * 3.5;
      ctx.fillStyle = `rgba(255,255,255,${(0.55 * (1 - cyc / 78)).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(bx, by, r, 0, k.TAU); ctx.fill();
    }
    ctx.restore(); // cam kırpma sonu

    // cam parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-26, 18, 16, 28, -0.2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath(); k.rrect(-48, 2, 9, 56, 4.5); ctx.fill();

    // ANIMASYON 2 — fizz olayı: boyundan köpük fışkırır (0.8 sn)
    if (fizzing) {
      const g = d / 0.8;
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 3 + 51), h2 = k.hash(i * 5 + 52);
        const fy = -70 - g * (30 + h1 * 40), fx = (h2 - 0.5) * 44 * g;
        const r = (4 + h1 * 7) * (1 - g * 0.4);
        ctx.fillStyle = i % 2 === 0 ? k.rgba(p.liquid, 0.85 * (1 - g)) : `rgba(255,255,255,${(0.8 * (1 - g)).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(fx, fy, r, 0, k.TAU); ctx.fill();
      }
      k.glow(0, -70, 40 * (1 - g) + 12, p.liquid, 0.4 * (1 - g));
    }
  },
};
