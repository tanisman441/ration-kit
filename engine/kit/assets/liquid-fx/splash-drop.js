// liquid-fx/splash-drop — düşen damlanın çarpma anında taç şeklinde sıçraması.
// NOT: canvas y-aşağıdır; damla yukarıdan (+y yönüne) düşer, çarpma noktası (0,0).
export default {
  name: 'splash-drop',
  category: 'liquid-fx',
  desc: 'Çarpma anında damlanın yüzeye düşüp taç şeklinde sıçraması; yukarı fışkıran damlalar',
  tags: ['sıçrama', 'damla', 'su damlası', 'çarpma', 'taç', 'splash', 'droplet', 'crown splash', 'impact', 'water drop'],
  box: [-130, -190, 130, 50],
  bleed: 44,
  anchor: 'çarpma noktası (0,0); damla yukarıdan düşer',
  points: { impact: [0, 0], fall: [0, -172] },
  params: {
    at: { type: 'time', default: null, desc: 'damlanın çarpma anı' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);

    const drop = (x, y, r, stretch, alpha) => {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.18, r * 1.28 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath(); ctx.ellipse(x, y - r * 0.06, r * 0.88, r * 1.02 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - r * 0.36, y - r * 0.4, r * 0.3, r * 0.46, -0.4, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? null : t - p.at;

    // düşen damla: çarpma öncesi yaklaşır; at yoksa döngülü düşer
    let dy = null;
    if (d == null) {
      const cyc = 1.5, ph = (t % cyc) / cyc;
      dy = -176 + ph * 176;
      // sakin yüzey
      ctx.strokeStyle = k.rgba(p.color, 0.22);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, 2, 34 + 10 * Math.sin(t * 2.4), 5, 0, 0, k.TAU); ctx.stroke();
    } else if (d < 0 && d > -0.75) {
      dy = -16 + d * 232; // d=0 → y=-16
    }
    if (dy != null && dy < 6) {
      const stretch = 1 + k.clamp((dy + 176) / 182, 0, 1) * 0.5;
      drop(0, dy, 13, stretch, 0.95);
    }
    if (d == null || d < 0 || d > 1.35) return;

    // taç: genişleyen halka + yukarı sivri uçlar
    const g = k.prog(d, 0, 0.45);
    const fade = 1 - k.prog(d, 0.25, 1.15);
    const rx = 24 + 92 * g, ry = 7 + 15 * g;
    ctx.strokeStyle = k.rgba(p.color, 0.6 * fade);
    ctx.lineWidth = (22 * (1 - g) + 5);
    ctx.beginPath(); ctx.ellipse(0, -4, rx, ry, 0, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 0.62 * fade);
    const NS = 11;
    for (let i = 0; i < NS; i++) {
      const h = k.hash(i * 3.3 + 5);
      const an = (i / NS) * Math.PI * 2;
      const bx = Math.cos(an) * rx, by = -6 + Math.abs(Math.sin(an)) * ry * 0.7;
      const len = (24 + 36 * h) * (1 - g);
      if (len < 2) continue;
      const lean = (h - 0.5) * 34;
      ctx.beginPath();
      ctx.moveTo(bx - 7, by);
      ctx.quadraticCurveTo(bx + lean * 0.5, by - len * 0.6, bx + lean, by - len);
      ctx.quadraticCurveTo(bx + lean * 0.5 + 8, by - len * 0.55, bx + 8, by);
      ctx.closePath(); ctx.fill();
    }

    // damlalar: yukarı fışkırır, düşer, solar
    const al = 1 - k.prog(d, 0.35, 1.3);
    for (let i = 0; i < 16; i++) {
      const h1 = k.hash(i * 3 + 11), h2 = k.hash(i * 5 + 23), h3 = k.hash(i * 7 + 37);
      const ang = (h1 - 0.5) * 1.6;
      const v0 = 220 + h2 * 190;
      const x = Math.sin(ang) * v0 * d * 0.7;
      const y = -v0 * d + 300 * d * d - 10;
      if (y > 8) continue;
      const sz = 3.5 + h3 * 5;
      ctx.fillStyle = k.rgba(p.color, (0.8 + h3 * 0.2) * al);
      ctx.beginPath();
      ctx.ellipse(x, y, sz * 0.8, sz * (1 + d * 1.1), 0, 0, k.TAU);
      ctx.fill();
    }

    // yüzey halkaları
    for (let r = 0; r < 2; r++) {
      const rr = d - r * 0.14;
      if (rr < 0) continue;
      const gg = k.prog(rr, 0, 0.8);
      ctx.strokeStyle = k.rgba(p.color, 0.5 * (1 - gg));
      ctx.lineWidth = 6 * (1 - gg) + 1.5;
      ctx.beginPath(); ctx.ellipse(0, 2, 16 + 104 * gg, 6 + 20 * gg, 0, 0, k.TAU); ctx.stroke();
    }
  },
};
