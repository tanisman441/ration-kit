// science/beaker — erlenmayer: sıvı seviyesi ayarlanır, kaynama anında kabarcıklar ve buhar.
// NOT: canvas y-aşağıdır; (0,0) tabandadır.
export default {
  name: 'beaker',
  category: 'science',
  desc: 'Erlenmayer: seviyesi ayarlanabilir renkli sıvı, kaynama anında kabarcık ve buhar',
  tags: ['erlenmayer', 'beher', 'kimya', 'deney', 'sıvı', 'kaynama', 'beaker', 'flask', 'chemistry', 'lab'],
  box: [-90, -190, 90, 12],
  bleed: 35,
  anchor: 'taban (0,0)',
  points: { mouth: [0, -182], base: [0, 0] },
  params: {
    color: { type: 'color', default: 'green', desc: 'sıvı rengi' },
    fill: { type: 'number', default: 0.55, desc: 'sıvı seviyesi 0–1' },
    bubble: { type: 'time', default: null, desc: 'kaynama anı (kabarcık patlaması + buhar)' },
  },
  draw(ctx, t, p, k) {
    const d = p.bubble == null ? -1 : t - p.bubble;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // gövde ölçüleri
    const bw = 75, neckW = 30, topY = -182, botY = 0, neckTop = -182, neckBot = -118;
    const bodyTopW = 34;

    // sıvı seviyesi
    const f = k.clamp(p.fill, 0, 1);
    const bodyH = botY - neckBot; // 118
    const liqTop = botY - 8 - f * (bodyH - 16);
    const halfAt = (y) => {
      // y'deki gövde yarı genişliği (yamuk)
      const g = k.prog(y, neckBot, botY);
      return bodyTopW + (bw - bodyTopW) * g;
    };

    // sıvı (camın içinde, önce çizilir)
    if (f > 0.02) {
      ctx.fillStyle = k.rgba(acc, 0.75);
      ctx.beginPath();
      const wob = (x) => Math.sin(x * 0.09 + t * 3) * 3;
      ctx.moveTo(-halfAt(liqTop) + 4, liqTop + wob(0));
      for (let x = -halfAt(liqTop); x <= halfAt(liqTop); x += 8)
        ctx.lineTo(x, liqTop + wob(x));
      ctx.lineTo(halfAt(botY - 6) - 4, botY - 6);
      ctx.lineTo(-halfAt(botY - 6) + 4, botY - 6);
      ctx.closePath(); ctx.fill();
      // sıvı üstü parlama çizgisi
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -halfAt(liqTop); x <= halfAt(liqTop); x += 8) {
        const y = liqTop + wob(x);
        if (x === -halfAt(liqTop)) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // kabarcıklar — sıvı içinde yükselir
    const boil = d >= 0 && d < 1.2;
    const n = boil ? 16 : 6;
    for (let i = 0; i < n; i++) {
      const seed = i * 17 + 3;
      const cyc = (t * (0.5 + k.hash(seed) * 0.9 + (boil ? 1.2 : 0)) + k.hash(seed + 1)) % 1;
      const y = (botY - 10) - cyc * (botY - 10 - liqTop);
      const x = (k.hash(seed + 2) - 0.5) * 2 * (halfAt(y) - 12);
      const r = 2.5 + k.hash(seed + 4) * 3.5 + (boil ? 2 : 0);
      ctx.fillStyle = k.rgba('ink', 0.35 * (1 - cyc * 0.5));
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    }

    // kaynama buharı — boyundan yükselir
    if (boil) {
      const g = k.prog(d, 0, 1.2);
      for (let i = 0; i < 4; i++) {
        const py = neckTop - 8 - g * (30 + i * 18) + k.noise1(i * 7 + t * 3) * 8;
        const px = (k.hash(i * 11 + 9) - 0.5) * 30 + k.noise1(i * 5 + t * 2) * 10;
        ctx.fillStyle = k.rgba('dim', 0.4 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 8 + g * 10, 0, k.TAU); ctx.fill();
      }
    }

    // cam gövde — dış hat + hafif cam tonu
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(-neckW, neckTop); ctx.lineTo(-neckW, neckBot);
    ctx.lineTo(-bw - 8, botY); ctx.lineTo(bw + 8, botY);
    ctx.lineTo(neckW, neckBot); ctx.lineTo(neckW, neckTop);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.18);
    ctx.beginPath();
    ctx.moveTo(-neckW + 6, neckTop); ctx.lineTo(-neckW + 6, neckBot);
    ctx.lineTo(-bw + 2, botY - 6); ctx.lineTo(bw - 2, botY - 6);
    ctx.lineTo(neckW - 6, neckBot); ctx.lineTo(neckW - 6, neckTop);
    ctx.closePath(); ctx.fill();
    // cam kenar çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.6);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-neckW, neckTop); ctx.lineTo(-neckW, neckBot);
    ctx.lineTo(-bw, botY); ctx.lineTo(bw, botY);
    ctx.lineTo(neckW, neckBot); ctx.lineTo(neckW, neckTop);
    ctx.stroke();
    // ağız bandı
    ctx.fillStyle = k.rgba('dim', 0.9);
    ctx.beginPath(); k.rrect(-neckW - 8, neckTop - 4, (neckW + 8) * 2, 16, 8); ctx.fill();
    // cam parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-48, -80, 10, 30, 0.25, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
