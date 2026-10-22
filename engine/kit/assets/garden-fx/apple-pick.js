// garden-fx/apple-pick — elma dalı; yapraklar salınır, pick anında bir elma kopup
// yere düşer (0.75 sn düşüş + sekme + toz), sonra yerde kalır.
// NOT: canvas y-aşağıdır; dal soldan sağa hafif yükselir, zemin y=115.
export default {
  name: 'apple-pick', category: 'garden-fx',
  desc: 'Elma dalı: yapraklar salınır, pick anında bir elma kopup düşer, seker ve yerde kalır',
  tags: ['elma', 'elma toplama', 'ağaç', 'dal', 'hasat', 'meyve', 'apple', 'picking', 'harvest', 'tree', 'fruit'],
  box: [-160, -150, 160, 130],
  bleed: 25,
  anchor: 'dalın sol ucu (-140,-112); zemin y=115',
  points: { branch: [-140, -112], picked: [80, -50], ground: [80, 115] },
  params: {
    color: { type: 'color', default: 'red', desc: 'elma rengi' },
    pick: { type: 'time', default: null, desc: 'elma koparılıp düşer: düşüş + sekme + toz (1.4 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    const branchY = x => -120 + (x + 150) / 6;

    const d = p.pick == null ? -1 : t - p.pick;
    const falling = d >= 0 && d < 1.4;

    // zemin
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 118, 158, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darker('dim');
    ctx.beginPath(); ctx.ellipse(0, 118, 158, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(0, 116, 158, 10, 0, 0, k.TAU); ctx.fill();

    // ana dal (kalın, hafif yukarı)
    ctx.strokeStyle = line; ctx.lineWidth = 17;
    ctx.beginPath(); ctx.moveTo(-152, -118); ctx.lineTo(152, -68); ctx.stroke();
    ctx.strokeStyle = darker('dim'); ctx.lineWidth = 17;
    ctx.beginPath(); ctx.moveTo(-148, -113); ctx.lineTo(152, -63); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-152, -118); ctx.lineTo(152, -68); ctx.stroke();
    // dal parlama
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-140, -122); ctx.lineTo(140, -72); ctx.stroke();

    // yapraklar (salınım)
    const leaf = (x, y, s, rot, flip) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot + Math.sin(t * 1.4 + x * 0.05) * 0.12); ctx.scale(flip ? -1 : 1, 1);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(s * 0.9, 0, s + 2, s * 0.52 + 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('green');
      ctx.beginPath(); ctx.ellipse(s * 0.9, 0, s, s * 0.52, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s * 1.8, 0); ctx.stroke();
      ctx.restore();
    };
    const leafSpots = [[-120, -112, 13, -0.5], [-88, -106, 11, 0.4, 1], [-40, -100, 13, -0.4],
      [-8, -94, 11, 0.5, 1], [30, -88, 13, -0.5], [62, -82, 11, 0.45, 1], [110, -76, 13, -0.4], [140, -70, 11, 0.5, 1]];
    leafSpots.forEach(([x, y, s, r, f]) => leaf(x, y, s, r, f));

    // elma çizimi
    const apple = (x, y, r, rot) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, r + 3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darker(p.color); ctx.beginPath(); ctx.arc(4, 5, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-r * 0.34, -r * 0.4, r * 0.38, r * 0.24, -0.45, 0, k.TAU); ctx.fill();
      // sap çukuru
      ctx.fillStyle = darker(p.color);
      ctx.beginPath(); ctx.ellipse(0, -r * 0.82, r * 0.22, r * 0.12, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    const stem = (x, yTop, yBot) => {
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(x, yTop); ctx.quadraticCurveTo(x + 3, (yTop + yBot) / 2, x, yBot); ctx.stroke();
    };

    // asılı elmalar (hafif salınım)
    const hangers = [[-60, 15], [10, 14]];
    hangers.forEach(([x, r], i) => {
      const by = branchY(x), bob = Math.sin(t * 2.1 + i * 2.4) * 2.2;
      stem(x, by - 2, by + 16 + bob);
      apple(x, by + 16 + r + bob, r, Math.sin(t * 1.7 + i) * 0.08);
    });

    // koparılan elma (x=80): asılı → düşüş → sekme → yerde
    const px0 = 80, py0 = branchY(px0) + 16 + 15, pyG = 115 - 13;
    let ax = px0, ay = py0, arot = Math.sin(t * 1.9) * 0.08, attached = true;
    if (d >= 0) {
      attached = false;
      if (d < 0.75) {
        const g = d / 0.75;
        ay = py0 + (pyG - py0) * g * g;
        arot = g * 0.9;
      } else if (d < 1.12) {
        const g = (d - 0.75) / 0.37;
        ay = pyG - 20 * Math.sin(Math.PI * g) * (1 - g);
        arot = 0.9 - g * 0.5;
        ax = px0 + 8 * g;
      } else {
        ay = pyG; arot = 0.35; ax = px0 + 8;
      }
    } else {
      ay = py0 + Math.sin(t * 2.1 + 4) * 2.2;
    }
    if (attached) stem(px0, branchY(px0) - 2, ay - 15);
    apple(ax, ay, 15, arot);

    // iniş tozu
    if (d >= 0.75 && d < 1.4) {
      const g = (d - 0.75) / 0.65;
      ctx.strokeStyle = k.rgba('dim', 0.55 * (1 - g)); ctx.lineWidth = 4 * (1 - g) + 1;
      ctx.beginPath(); ctx.ellipse(px0 + 8, 115, 10 + 34 * g, 4 + 7 * g, 0, 0, k.TAU); ctx.stroke();
      for (let j = 0; j < 6; j++) {
        const h1 = k.hash(j * 8.4 + 30), h2 = k.hash(j * 3.1 + 31);
        const age = d - 0.75 - h1 * 0.25;
        if (age < 0 || age > 0.5) continue;
        const f = age / 0.5;
        ctx.fillStyle = k.rgba('dim', 0.7 * (1 - f));
        ctx.beginPath(); ctx.arc(px0 + 8 + (h2 - 0.5) * 90 * f, 110 - (20 + h1 * 40) * f + 30 * f * f, 2.5 + h1 * 2, 0, k.TAU); ctx.fill();
      }
    }
    void falling;
  },
};
