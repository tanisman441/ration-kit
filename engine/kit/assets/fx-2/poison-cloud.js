// fx-2/poison-cloud — zehir bulutu: döngüsel canlı idle (köpürme, sürüklenme, kabarma)
// + at anında püskürme (şişme + dışa savrulan damlacıklar + beyaz flaş).
// NOT: canvas y-aşağıdır; (0,0) bulut merkezi.
export default {
  name: 'poison-cloud', category: 'fx-2',
  desc: 'Zehir bulutu: sürekli köpüren canlı bulut, at anında şişip zehir püskürten patlama',
  tags: ['zehir', 'bulut', 'poison', 'cloud', 'toksin', 'gaz', 'duman', 'zehirli', 'toxic', 'püskürme'],
  box: [-150, -115, 150, 85],
  bleed: 40,
  anchor: 'bulut merkezi (0,0)',
  points: { top: [0, -100], edge: [135, 0] },
  params: {
    color: { type: 'color', default: 'green', desc: 'zehir rengi' },
    density: { type: 'number', default: 0.6, desc: 'bulut yoğunluğu (0–1)' },
    at: { type: 'time', default: null, desc: 'püskürme anı (şişme + damlacık savrulması)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const den = k.clamp(p.density ?? 0.6, 0, 1);
    const d = p.at == null ? -1 : t - p.at;

    // at anında şişme katsayısı (0 → 1.2 sn'de kabarıp iner)
    let swell = 1;
    if (d >= 0 && d < 1.2) swell = 1 + 0.38 * Math.sin(Math.min(d / 1.2, 1) * Math.PI);

    // ---- ana bulut: nefes alan, sürüklenen damla kümesi ----
    const n = 9;
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 7 + 101), h2 = k.hash(i * 13 + 137), h3 = k.hash(i * 19 + 173);
      const bx = (h1 - 0.5) * 190 + k.noise1(i * 1.3 + t * 0.45) * 16;
      const by = (h2 - 0.5) * 120 + k.noise1(i * 2.1 + 40 + t * 0.6) * 12;
      const br = (22 + h3 * 26) * swell * (0.88 + 0.12 * Math.sin(t * 1.7 + h1 * k.TAU));
      ctx.fillStyle = k.rgba(p.color, (0.55 + 0.3 * den) * (0.75 + h2 * 0.25));
      ctx.beginPath(); ctx.arc(bx, by, br, 0, k.TAU); ctx.fill();
    }
    // iç koyu çekirdek damlaları
    for (let i = 0; i < 5; i++) {
      const h1 = k.hash(i * 11 + 211), h2 = k.hash(i * 17 + 241);
      const bx = (h1 - 0.5) * 120 + k.noise1(i * 1.7 + 90 + t * 0.5) * 12;
      const by = (h2 - 0.5) * 70 + k.noise1(i * 2.3 + 130 + t * 0.65) * 9;
      ctx.fillStyle = k.rgba(p.color, 0.85);
      ctx.beginPath(); ctx.arc(bx, by, (12 + h2 * 14) * swell, 0, k.TAU); ctx.fill();
    }

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, -62, 40, 22, -0.5, 0, k.TAU); ctx.fill();

    // ---- köpürme: patlayıp sönen küçük baloncuklar ----
    for (let i = 0; i < 6; i++) {
      const h1 = k.hash(i * 23 + 311), h2 = k.hash(i * 31 + 337);
      const cyc = (t * 0.42 + h1) % 1;
      const bx = (h2 - 0.5) * 150 + k.noise1(i * 3 + t * 0.8) * 8;
      const by = 20 - cyc * 90;
      const grow = Math.sin(Math.min(cyc * 1.15, 1) * Math.PI);
      ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - cyc));
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(bx, by, 3 + 9 * grow, 0, k.TAU); ctx.stroke();
    }

    // ---- at: püskürme — dışa savrulan damlacıklar + flaş ----
    if (d >= 0 && d < 0.55) {
      const g = k.prog(d, 0, 0.55);
      k.glow(0, 0, 90, p.color, 0.5 * (1 - g));
      if (d < 0.18) {
        ctx.fillStyle = 'rgba(255,255,255,' + (0.5 * (1 - d / 0.18)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(0, 0, 46 * (1 - d / 0.18), 0, k.TAU); ctx.fill();
      }
      for (let i = 0; i < 26; i++) {
        const h1 = k.hash(i * 37 + 401), h2 = k.hash(i * 41 + 419);
        const a = h1 * k.TAU;
        const dist = 26 + d * 400 * (0.6 + h2 * 0.8);
        if (dist > 158) continue;
        const px = Math.cos(a) * dist, py = Math.sin(a) * dist * 0.62;
        ctx.fillStyle = k.rgba(p.color, 0.9 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 3.5 + h2 * 8 * (1 - g * 0.6), 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
