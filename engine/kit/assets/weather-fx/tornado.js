// weather-fx/tornado — dönen hortum hunisi; bantlar faz kaymalı salınarak dönüş
// illüzyonu verir, huni tabanda daha çok yalpalar, tabanda dönen enkaz parçacıkları.
// NOT: canvas y-aşağıdır; huni yukarıda geniş (−y), aşağıda dardır (+y).
export default {
  name: 'tornado', category: 'weather-fx',
  desc: 'Dönen hortum hunisi; faz kaymalı bantlar dönüş illüzyonu verir, tabanda enkaz savrulur',
  tags: ['hortum', 'kasırga', 'fırtına', 'rüzgar', 'girdap', 'tornado', 'twister', 'funnel', 'storm', 'wind'],
  box: [-120, -190, 120, 180],
  bleed: 25,
  anchor: 'huni ekseni x=0; tepe bulutu y≈-165, taban y≈165',
  points: { top: [0, -165], base: [0, 165] },
  params: {
    color: { type: 'color', default: 'dim' },
    strength: { type: 'number', default: 0.7, desc: 'hortum şiddeti 0–1: yalpa genliği ve huni genişliği' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const s = k.clamp(p.strength, 0, 1);

    const NB = 11, Y0 = -165, Y1 = 165;
    const sway = Math.sin(t * 1.9) * (4 + 9 * s); // bütün huninin yalpası (tabanda artar)

    // huni bantları: yukarıdan aşağıya
    for (let i = 0; i < NB; i++) {
      const f = i / (NB - 1);
      const cy = Y0 + f * (Y1 - Y0);
      const w = (1 + 0.35 * s) * (170 * Math.pow(1 - f, 0.75) + 30 * f);
      // dönüş illüzyonu: faz kaymalı yatay salınım (tabana doğru büyür)
      const cx = sway * f + Math.sin(t * (4.5 + 2 * s) - i * 0.85) * (4 + f * 13);
      const c = i % 2 === 0 ? k.rgba(p.color) : darker(p.color);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(cx, cy, w / 2 + LW / 2, 17 + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, 17, 0, 0, k.TAU); ctx.fill();
      // sol üst parlama (premium finish)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - w * 0.18, cy - 7, w * 0.2, 7, -0.35, 0, k.TAU); ctx.fill();
    }

    // tepe bulutu (huninin buluta bağlandığı yer)
    const disc = (x, y, r, c, sheen) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
    };
    const bc = k.rgba(p.color), bd = darker(p.color);
    const cap = [[-52, -168, 26], [-18, -180, 32], [20, -178, 30], [54, -166, 24]];
    for (const [x, y, r] of cap) disc(x + 4, y + 5, r, bd, false);
    cap.forEach(([x, y, r], i) => disc(x, y, r, bc, i === 1));

    // taban toz bulutu
    const dustA = 0.28 + 0.08 * Math.sin(t * 3.2);
    ctx.fillStyle = k.rgba(p.color, dustA);
    ctx.beginPath(); ctx.ellipse(sway, 158, 62 + 8 * s, 20, 0, 0, k.TAU); ctx.fill();

    // savrulan enkaz parçacıkları (taban çevresinde yörünge)
    for (let i = 0; i < 12; i++) {
      const h1 = k.hash(i * 3.7), h2 = k.hash(i * 9.1 + 4);
      const ang = t * (2 + h1 * 2.5) + h2 * k.TAU;
      const rad = 28 + h1 * 48;
      const x = sway * 0.8 + Math.cos(ang) * rad;
      const y = 148 + Math.sin(ang * 2 + h2 * 5) * 12 - h2 * 18;
      const r = 2.5 + h1 * 3.5;
      ctx.fillStyle = k.rgba('ink', 0.5 + 0.3 * h2);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    }
  },
};
