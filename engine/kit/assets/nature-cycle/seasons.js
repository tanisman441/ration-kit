// nature-cycle/seasons — tek ağaçta dört mevsim döngüsü; season anında bir sonraki mevsime geçilir.
// NOT: canvas y-aşağıdır; yapraklar yukarıdan aşağıya dökülür.
export default {
  name: 'seasons', category: 'nature-cycle',
  desc: 'Tek ağaçta dört mevsim: season anında yapraklar dökülür/açar, renk ve kar değişir',
  tags: ['mevsim', 'ilkbahar', 'yaz', 'sonbahar', 'kış', 'ağaç', 'yaprak', 'season', 'spring', 'summer', 'autumn', 'winter', 'tree'],
  box: [-160, -140, 160, 140],
  bleed: 30,
  anchor: 'gövde tabanı (0,110); yapraklar üstte',
  points: { tree: [0, -30], ground: [0, 110], top: [0, -90] },
  params: {
    season: { type: 'time', default: null, desc: 'mevsim geçiş anı: 1.2 sn\'de yapraklar dökülür/açar, renk ve kar değişir' },
    phase: { type: 'number', default: 0, desc: 'mevsim: 0=ilkbahar 1=yaz 2=sonbahar 3=kış (season anında bir sonrakine geçer)' },
    ground: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 7;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    const res = c => (typeof c === 'string' && c.startsWith('rgb(') ? c.match(/\d+/g).map(Number) : k.col(c));
    const mixc = (a, b, m) => { const x = res(a), y = res(b); return `rgb(${x.map((v, i) => Math.round(k.lerp(v, y[i], m))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // mevsimler: yaprak rengi, gürlük, kar
    const SEASONS = [
      { leaf: 'green', canopy: 0.85, snow: 0 },  // ilkbahar
      { leaf: 'green', canopy: 1.0, snow: 0 },   // yaz (daha koyu)
      { leaf: 'yellow', canopy: 0.7, snow: 0 },  // sonbahar
      { leaf: 'green', canopy: 0.05, snow: 1 },   // kış (çıplak)
    ];
    const ph = ((Math.round(p.phase) % 4) + 4) % 4;
    const from = SEASONS[ph], to = SEASONS[(ph + 1) % 4];
    const d = p.season == null ? -1 : t - p.season;
    const g = d < 0 ? 0 : k.prog(d, 0, 1.2);
    const e = k.E.inOutCubic(g);
    const canopyR = k.lerp(from.canopy, to.canopy, e);
    const snowF = k.lerp(from.snow, to.snow, e);
    // yaz yaprağı daha koyu yeşil
    const leafA = ph === 1 ? darker('green') : from.leaf;
    const leafB = (ph + 1) % 4 === 1 ? darker('green') : to.leaf;
    const leafCol = mixc(ph === 3 ? leafB : leafA, leafB, e);

    // 1) zemin tümseği
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 112, 132, 24, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darker(p.ground);
    ctx.beginPath(); ctx.ellipse(0, 111, 126, 20, 0, 0, k.TAU); ctx.fill();
    // kar örtüsü
    if (snowF > 0.02) {
      ctx.fillStyle = k.rgba('panel2', snowF * 0.95);
      ctx.beginPath(); ctx.ellipse(0, 104, 118 * (0.4 + 0.6 * snowF), 13, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.10 * snowF})`;
      ctx.beginPath(); ctx.ellipse(-40, 99, 45, 6, -0.15, 0, k.TAU); ctx.fill();
    }

    // 2) gövde + dallar (kışın belirginleşir)
    const branchA = 0.25 + 0.75 * (1 - canopyR);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-12, 8, 24, 104, 10); ctx.fill();
    ctx.fillStyle = darker('dim');
    ctx.beginPath(); k.rrect(-9, 8, 18, 104, 8); ctx.fill();
    const branches = [[0, 20, -34, -28], [0, 20, 34, -28], [0, 20, -8, -52], [0, 20, 10, -48]];
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    for (const [x0, y0, x1, y1] of branches) {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.strokeStyle = k.rgba('dim', branchA); ctx.lineWidth = 6;
    for (const [x0, y0, x1, y1] of branches) {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }

    // 3) yaprak kümesi — boşta hışırdar (salınım)
    const swayX = k.noise1(t * 0.8) * 3.5, swayY = k.noise1(t * 0.6 + 5) * 2.5;
    const blobs = [[0, -72, 40], [-36, -50, 30], [36, -50, 30], [0, -32, 32]];
    const branchTips = [[-34, -28], [34, -28], [-8, -52], [10, -48]];
    if (canopyR > 0.1) {
      ctx.save(); ctx.translate(swayX, swayY);
      for (const [bx, by, br] of blobs) {
        const r = br * canopyR;
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.arc(bx, by, r + 3.5, 0, k.TAU); ctx.fill();
      }
      for (const [bx, by, br] of blobs) {
        const r = br * canopyR;
        ctx.fillStyle = leafCol;
        ctx.beginPath(); ctx.arc(bx, by, r + 1.2, 0, k.TAU); ctx.fill();
      }
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-22, -92, 22, 12, -0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    // dallardaki kar (kışın ve kışa geçerken): dal uçlarında
    if (snowF > 0.05) {
      ctx.fillStyle = k.rgba('panel2', snowF * 0.9);
      for (const [tx2, ty2] of branchTips) {
        const sr = 5 + k.hash(tx2 * 1.7 + ty2) * 3;
        ctx.beginPath(); ctx.arc(tx2, ty2 - 4, sr, 0, k.TAU); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,255,255,${0.10 * snowF})`;
      ctx.beginPath(); ctx.ellipse(-12, -56, 10, 5, -0.3, 0, k.TAU); ctx.fill();
    }

    // 4) geçişte dökülen/açan yapraklar
    if (d >= 0 && d <= 1.2) {
      for (let i = 0; i < 7; i++) {
        const lg = k.prog(d - i * 0.07, 0, 0.85);
        if (lg <= 0 || lg >= 1) continue;
        const lx0 = k.hash(i * 3.3) * 90 - 45;
        const ly = k.lerp(-55, 102, k.E.inCubic(lg));
        const lx = lx0 + Math.sin(lg * 9 + i * 2.1) * 12 * lg;
        const lr = 5 + k.hash(i * 7.1) * 3.5;
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(lg * 5 + i);
        ctx.fillStyle = ph === 3 ? leafB : leafA;
        ctx.globalAlpha = 1 - lg * 0.6;
        ctx.beginPath(); ctx.ellipse(0, 0, lr, lr * 0.55, 0, 0, k.TAU); ctx.fill();
        ctx.restore();
      }
    }

    // 5) sonbahar boşta: süzülen yaprak; kış boşta: yağan kar
    if (d < 0 && ph === 2) {
      for (let i = 0; i < 2; i++) {
        const ly = -50 + ((t * 26 + i * 95) % 155);
        const lx = -30 + i * 55 + Math.sin(t * 1.4 + i * 3) * 10;
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(t * 1.2 + i * 2);
        ctx.fillStyle = k.rgba('yellow', 0.85);
        ctx.beginPath(); ctx.ellipse(0, 0, 6, 3.4, 0, 0, k.TAU); ctx.fill();
        ctx.restore();
      }
    }
    if (snowF > 0.5) {
      for (let i = 0; i < 8; i++) {
        const yy = -140 + ((t * (26 + k.hash(i * 6.1) * 22) + k.hash(i * 8.9) * 280) % 280);
        const xx = -140 + k.hash(i * 3.7) * 280 + Math.sin(t * 0.9 + i * 2.4) * 12;
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.arc(xx, yy, 6.5, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('panel2', snowF);
        ctx.beginPath(); ctx.arc(xx, yy, 4.5, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
