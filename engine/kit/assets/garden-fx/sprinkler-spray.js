// garden-fx/sprinkler-spray — bahçe fıskiyesi; iki yana su yayı, salınan baş, spray anında basınç patlaması.
// NOT: canvas y-aşağıdır; su yayı yukarı fırlayıp zemine (y=100) düşer.
export default {
  name: 'sprinkler-spray', category: 'garden-fx',
  desc: 'Bahçe fıskiyesi: kubbeli başlıktan iki yana su yayı püskürür, baş hafif salınır, spray anında basınç artar',
  tags: ['fıskiye', 'yağmurlama', 'sulama', 'sprinkler', 'bahçe sulama', 'çim sulama', 'su püskürtme', 'water spray', 'garden sprinkler'],
  box: [-140, -120, 140, 120],
  bleed: 25,
  anchor: 'taban plakası merkezi (0,105)',
  points: { head: [0, 12], groundL: [-125, 100], groundR: [125, 100] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'fıskiye gövde rengi' },
    spray: { type: 'time', default: null, desc: 'basınç patlaması: su yayı güçlenir (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    const d = p.spray == null ? -1 : t - p.spray;
    const bursting = d >= 0 && d < 0.9;
    const boost = bursting ? 1 + 0.55 * (1 - d / 0.9) : 1;

    // zemin şeridi
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 112, 138, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darker('dim');
    ctx.beginPath(); ctx.ellipse(0, 112, 138, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(0, 110, 138, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-40, 106, 46, 4, -0.1, 0, k.TAU); ctx.fill();

    // taban plakası
    ctx.fillStyle = line; k.rrect(-35, 96, 70, 16, 8); ctx.fill();
    ctx.fillStyle = darker(p.color); k.rrect(-35 + 5, 96 + 5, 70, 16, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); k.rrect(-35, 96, 70, 16, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, 100, 16, 3.4, -0.15, 0, k.TAU); ctx.fill();

    // dikme
    ctx.fillStyle = line; k.rrect(-12, 34, 24, 66, 7); ctx.fill();
    ctx.fillStyle = darker(p.color); k.rrect(-12 + 4, 34 + 4, 24, 66, 7); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); k.rrect(-12, 34, 24, 66, 7); ctx.fill();

    // kubbeli baş (salınım)
    const sway = Math.sin(t * 3.9) * 0.16 + (bursting ? Math.sin(t * 22) * 0.05 : 0);
    ctx.save(); ctx.translate(0, 30); ctx.rotate(sway);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 21, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darker(p.color);
    ctx.beginPath(); ctx.arc(4, 5, 18, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 0, 18, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-6, -9, 7, 3.6, -0.5, 0, k.TAU); ctx.fill();
    // ağızlık
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); ctx.arc(0, -19, 5.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(0, -19, 3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // su yayı: iki yana parabolik damla akışı
    const arcY = ph => 8 - 105 * Math.sin(Math.PI * ph) + 92 * ph;
    const drop = (x, y, r, alpha) => {
      ctx.fillStyle = k.rgba('bg', 0.4);
      ctx.beginPath(); ctx.arc(x, y, r + 1.5, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('cyan', alpha);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.35, 0, k.TAU); ctx.fill();
    };
    for (const s of [-1, 1]) {
      const n = bursting ? 30 : 20;
      for (let j = 0; j < n; j++) {
        const h1 = k.hash(j * 7.31 + (s > 0 ? 100 : 0));
        const h2 = k.hash(j * 3.77 + (s > 0 ? 55 : 9));
        const ph = (t * (0.75 + h1 * 0.4) * boost + h2) % 1;
        const x = s * (8 + 117 * ph) * (0.96 + 0.04 * boost) + s * 9 * Math.sin(t * 3.9) * ph;
        const y = arcY(ph);
        const r = (3.2 + h1 * 3.2) * (1 - ph * 0.25);
        drop(x, y, r, 0.95 - ph * 0.35);
      }
      // iniş köpüğü
      const fx = s * 125 * (0.96 + 0.04 * boost);
      const pulse = 0.5 + 0.5 * Math.sin(t * 7 + s);
      ctx.fillStyle = k.rgba('cyan', 0.28 + 0.14 * pulse * boost);
      ctx.beginPath(); ctx.ellipse(fx, 102, 16 + 6 * pulse, 5 + 2 * pulse, 0, 0, k.TAU); ctx.fill();
    }

    // spray patlaması: ağızda parlama + ek fışkırtı
    if (bursting) {
      const f = 1 - d / 0.9;
      k.glow(0, 10, 42 * f + 14, 'cyan', 0.5 * f);
      for (let j = 0; j < 10; j++) {
        const h1 = k.hash(j * 11.3 + 200), h2 = k.hash(j * 5.9 + 201);
        const age = d - h1 * 0.3;
        if (age < 0 || age > 0.6) continue;
        const s = h2 > 0.5 ? 1 : -1;
        const px = s * (10 + age * 170), py = 8 - 70 * Math.sin(Math.PI * Math.min(age / 0.6, 1)) + 60 * (age / 0.6);
        drop(px, py, 4 + h1 * 3, 0.9 * (1 - age / 0.6));
      }
    }
  },
};
