// nature-cycle/rain-shower — yağmur sağanağı: burst anında 0.8 sn'de yağış yoğunlaşır, bulut kararır.
// NOT: canvas y-aşağıdır; damlalar yukarıdan aşağıya düşer.
export default {
  name: 'rain-shower', category: 'nature-cycle',
  desc: 'Yağmur sağanağı: burst anında damlalar sıklaşır ve hızlanır, bulut kararır',
  tags: ['yağmur', 'sağanak', 'bulut', 'şiddetli', 'damla', 'hava', 'rain', 'shower', 'downpour', 'cloud', 'storm'],
  box: [-170, -130, 170, 140],
  bleed: 24,
  anchor: 'bulut merkezi (0,-60); damlalar alta düşer',
  points: { cloud: [0, -60], rain: [0, 50], puddle: [0, 115] },
  params: {
    burst: { type: 'time', default: null, desc: 'sağanak anı: 0.8 sn\'de yağış yoğunlaşır, bulut kararır ve sıkışır' },
    cloud: { type: 'color', default: 'panel2' },
    drop: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    const mixc = (a, b, m) => { const x = k.col(a), y = k.col(b); return `rgb(${x.map((v, i) => Math.round(k.lerp(v, y[i], m))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // sağanak zarfı: 0.8 sn'lik yoğunlaşma dalgası
    const d = p.burst == null ? -1 : t - p.burst;
    const env = (d < 0 || d > 0.8) ? 0 : Math.sin(k.clamp(d / 0.8, 0, 1) * Math.PI);

    // 1) damlalar — boşta hafif yağmur, sağanakta sık ve hızlı
    const ND = 26, topY = -25, fallH = 130;
    ctx.lineWidth = 5;
    for (let i = 0; i < ND; i++) {
      if (k.hash(i * 13.7 + 2) > 0.45 + 0.5 * env) continue;
      const x0 = -145 + k.hash(i * 3.1) * 290;
      const speed = 160 + k.hash(i * 7.7) * 100 + env * 170;
      const yy = topY + ((t * speed + k.hash(i * 9.3) * fallH) % fallH);
      const slant = -6 - env * 8;
      const len = 20 + env * 9;
      ctx.strokeStyle = k.rgba(p.drop, 0.4 + 0.45 * env + 0.15 * k.hash(i * 5.5));
      ctx.beginPath();
      ctx.moveTo(x0, yy);
      ctx.lineTo(x0 + slant, yy + len);
      ctx.stroke();
    }

    // 2) su birikintisi — sağanakta büyür
    const prx = 58 + 42 * env;
    ctx.fillStyle = k.rgba(p.drop, 0.22 + 0.22 * env);
    ctx.beginPath(); ctx.ellipse(0, 118, prx, 10, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba(p.drop, 0.35 + 0.4 * env); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 118, prx * 0.7, 6.5, 0, 0, k.TAU); ctx.stroke();
    // sağanak halkası
    if (env > 0.15) {
      const rg = (t * 3) % 1;
      ctx.strokeStyle = k.rgba(p.drop, 0.5 * env * (1 - rg));
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(30, 118, 14 + rg * 34, 5 + rg * 7, 0, 0, k.TAU); ctx.stroke();
    }

    // 3) bulut — boşta kıpırdar, sağanakta kararır ve sıkışır
    const bobX = k.noise1(t * 1.1) * 3, bobY = Math.sin(t * 2.1) * 3;
    const disc = (x, y, r, c, sheen) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
    };
    ctx.save();
    ctx.translate(bobX, bobY + 8 * env);
    ctx.scale(1 + 0.06 * env, 1 - 0.09 * env);
    const bc = mixc(p.cloud, 'dim', env * 0.55);   // sağanakta kararır
    const bd = darker(p.cloud);
    const blobs = [
      [-70, -52, 34], [-30, -68, 44], [12, -70, 42], [52, -60, 36], [84, -48, 28],
      [-45, -36, 28], [5, -34, 30], [48, -34, 26],
    ];
    for (const [x, y, r] of blobs) disc(x + 5, y + 6, r, bd, false);
    blobs.forEach(([x, y, r], i) => disc(x, y, r, bc, i === 1 || i === 2));
    ctx.restore();

    ctx.restore();
  },
};
