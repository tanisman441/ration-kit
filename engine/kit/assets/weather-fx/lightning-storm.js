// weather-fx/lightning-storm — şiddetli fırtına bulutu; strike anında 0.15 sn'lik çakma
// flaşı + bulut içi aydınlanma, şimşek 0.6 sn'de söner. Boşta çisenti ve bulut süzülmesi.
// NOT: canvas y-aşağıdır; şimşek buluttan (−y) aşağıya (+y) iner.
export default {
  name: 'lightning-storm', category: 'weather-fx',
  desc: 'Şiddetli fırtına bulutu; strike anında çakan şimşek ve bulut içi aydınlanma',
  tags: ['yıldırım', 'şimşek', 'fırtına', 'şiddetli', 'yağmur', 'bulut', 'thunderstorm', 'lightning', 'bolt', 'storm'],
  box: [-160, -150, 160, 175],
  bleed: 30,
  anchor: 'bulut merkezi (0,-70); şimşek y=160 civarına iner',
  points: { top: [0, -140], bottom: [0, 165] },
  params: {
    color: { type: 'color', default: 'dim' },
    drop: { type: 'color', default: 'cyan' },
    bolt: { type: 'color', default: 'yellow' },
    strike: { type: 'time', default: null, desc: 'şimşek çakma anı: 0.15 sn flaş + 0.6 sn sönüm' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.strike == null ? -1 : t - p.strike;
    const flashing = d >= 0 && d < 0.6;
    // flaş eğrisi: 0.15 sn tam parlaklık, sonra titreyerek sön
    const flashA = flashing ? (d < 0.15 ? 1 : (1 - (d - 0.15) / 0.45) * (0.55 + 0.45 * Math.sin(d * 160 + 1))) : 0;

    // idle: bulut süzülmesi
    const bobY = Math.sin(t * 1.7) * 3;
    const bobX = k.noise1(t * 0.9) * 3;

    // çisenti: şimşek anında şiddetlenir
    const boost = flashing ? 1 : 0.45;
    ctx.lineWidth = 5;
    for (let i = 0; i < 24; i++) {
      const x0 = -125 + k.hash(i * 3.1 + 5) * 250;
      const speed = 170 + k.hash(i * 7.7 + 5) * 120;
      const yy = -40 + ((t * speed + k.hash(i * 9.3 + 5) * 200) % 200);
      ctx.strokeStyle = k.rgba(p.drop, 0.5 * boost);
      ctx.beginPath();
      ctx.moveTo(x0 + bobX * 0.3, yy);
      ctx.lineTo(x0 + bobX * 0.3 - 9, yy + 24);
      ctx.stroke();
    }

    // fırtına bulutu
    const disc = (x, y, r, c, sheen) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
    };
    ctx.save();
    ctx.translate(bobX, bobY);
    const bc = k.rgba(p.color), bd = darker(p.color);
    const blobs = [
      [-88, -62, 36], [-44, -82, 48], [6, -86, 46], [54, -76, 40], [94, -60, 30],
      [-60, -44, 32], [-6, -42, 34], [50, -44, 30], [92, -36, 24],
    ];
    for (const [x, y, r] of blobs) disc(x + 5, y + 6, r, bd, false);
    blobs.forEach(([x, y, r], i) => disc(x, y, r, bc, i === 1 || i === 2));
    // bulut içi aydınlanma: çakma anında gövdeyi içten aydınlat
    if (flashing) k.glow(0, -60, 120, p.bolt, 0.45 * flashA);
    ctx.restore();

    // şimşek: çakma penceresinde zigzag
    if (flashing) {
      const seed = p.strike == null ? 0 : Math.round(p.strike * 10) * 131;
      const segs = 8, pts = [];
      for (let i = 0; i <= segs; i++) {
        const y = 8 + (157 * i) / segs;
        const x = i === 0 ? 0 : (k.hash(seed + i * 17 + 3) - 0.5) * 72;
        pts.push([x, y]);
      }
      const a = Math.max(0, flashA);
      k.glow(0, 90, 120, p.bolt, 0.35 * a);
      const bolt = (w, alpha) => {
        ctx.strokeStyle = k.rgba(p.bolt, alpha);
        ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      };
      bolt(16, 0.35 * a);
      bolt(7, 0.95 * a);
      if (d < 0.15) { // flaş anında beyaz-sıcak çekirdek
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      }
      // yan dal
      const b = 3, [bx, by] = pts[b];
      const dir = k.hash(seed + 91) > 0.5 ? 1 : -1;
      ctx.strokeStyle = k.rgba(p.bolt, 0.7 * a); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(bx, by);
      ctx.lineTo(bx + dir * 26, by + 18);
      ctx.lineTo(bx + dir * 40, by + 44);
      ctx.stroke();
      // yere çarpma parlaması
      const [ex, ey] = pts[segs];
      k.glow(ex, ey, 40, p.bolt, 0.55 * a);
    }
  },
};
