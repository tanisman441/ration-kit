// nature-cycle/snowfall — bulut altından kar yağışı: gust anında 1.0 sn rüzgâr taneleri yana savurur.
// NOT: canvas y-aşağıdır; taneler üstten alta süzülür.
export default {
  name: 'snowfall', category: 'nature-cycle',
  desc: 'Bulutlu kar yağışı: gust anında rüzgâr taneleri yana savurur, yağış hızlanır',
  tags: ['kar', 'bulut', 'rüzgar', 'kış', 'tipi', 'yağış', 'snow', 'snowfall', 'cloud', 'wind', 'gust', 'winter'],
  box: [-170, -140, 170, 150],
  bleed: 40,
  anchor: 'bulut merkezi (0,-75); kar alanı',
  points: { cloud: [0, -75], snowfall: [0, 40], ground: [0, 140] },
  params: {
    gust: { type: 'time', default: null, desc: 'rüzgâr anı: 1.0 sn taneler yana savrulur, yağış hızlanır' },
    cloud: { type: 'color', default: 'panel2' },
    flake: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // rüzgâr zarfı: 1.0 sn'lik savrulma
    const d = p.gust == null ? -1 : t - p.gust;
    const genv = (d < 0 || d > 1.0) ? 0 : Math.sin(k.clamp(d / 1.0, 0, 1) * Math.PI);
    const gustX = genv * 140;

    // 1) kar taneleri — 6 kollu, boşta süzülür
    const flake = (x, y, r, rot, alpha) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.strokeStyle = line; ctx.lineWidth = r * 0.34 + 4;
      for (let a = 0; a < 3; a++) {
        ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = k.rgba(p.flake); ctx.lineWidth = r * 0.34;
      for (let a = 0; a < 3; a++) {
        ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.arc(-r * 0.55, -r * 0.3, r * 0.28, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    const NF = 26, topY = -140, fallH = 290;
    for (let i = 0; i < NF; i++) {
      const x0 = -140 + k.hash(i * 3.7) * 280;
      const speed = (30 + k.hash(i * 6.1) * 42) * (1 + genv * 1.3);
      const yy = topY + ((t * speed + k.hash(i * 8.9) * fallH) % fallH);
      const sway = Math.sin(t * 0.9 + k.hash(i * 2.2) * k.TAU) * (14 + genv * 10);
      const xx = -150 + (((x0 + sway + gustX + 150) % 300) + 300) % 300;
      const r = 7 + k.hash(i * 5.5) * 8;
      const rot = t * 0.25 * (k.hash(i * 7.7) - 0.5) * 2 + gustX * 0.004;
      flake(xx, yy, r, rot, 0.55 + 0.45 * (0.5 + 0.5 * genv));
    }

    // 2) rüzgâr çizgileri (olay sırasında)
    if (genv > 0.02) {
      ctx.strokeStyle = k.rgba(p.flake, 0.65 * genv);
      ctx.lineWidth = 5;
      for (let i = 0; i < 4; i++) {
        const y = -100 + i * 62 + k.hash(i * 5.1) * 28;
        const x0 = -175 + k.hash(i * 3.3) * 45;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 115 + genv * 105, y - 12); ctx.stroke();
      }
    }

    // 3) kar birikintisi (altta)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 148, 162, 26, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.cloud);
    ctx.beginPath(); ctx.ellipse(0, 147, 156, 22, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, 140, 60, 8, -0.08, 0, k.TAU); ctx.fill();

    // 4) bulut — boşta kıpırdar
    const bobX = k.noise1(t * 1.1 + 3) * 3, bobY = Math.sin(t * 1.9 + 1) * 3;
    const disc = (x, y, r, c, sheen) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
    };
    ctx.save(); ctx.translate(bobX, bobY);
    const bc = k.rgba(p.cloud), bd = darker(p.cloud);
    const blobs = [
      [-60, -72, 30], [-20, -86, 38], [20, -88, 36], [58, -78, 30],
      [-35, -58, 26], [15, -56, 28],
    ];
    for (const [x, y, r] of blobs) disc(x + 5, y + 6, r, bd, false);
    blobs.forEach(([x, y, r], i) => disc(x, y, r, bc, i === 1 || i === 2));
    ctx.restore();

    ctx.restore();
  },
};
