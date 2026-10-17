// fx/electric — elektrik arkı / yıldırım: at anında titreyen, dallı şimşek çakması.
// NOT: canvas y-aşağıdır; şimşek yukarıdan (−y) aşağıya (+y) iner.
export default {
  name: 'electric',
  category: 'fx',
  desc: 'Elektrik arkı: at anında titreyen, dallı şimşek çakması',
  tags: ['elektrik', 'yıldırım', 'şimşek', 'ark', 'kıvılcım', 'electric', 'lightning', 'bolt', 'zap', 'arc'],
  box: [-85, -115, 85, 115],
  bleed: 25,
  anchor: 'merkez (0,0)',
  points: { top: [0, -105], bottom: [0, 105] },
  params: {
    at: { type: 'time', default: null, desc: 'çakma anı' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 0.45) return;
    // titreme: hızlı yanıp sönme + sönümlenme
    const flick = 0.55 + 0.45 * Math.sin(d * 190 + k.hash(7) * 9);
    const a = (1 - d / 0.45) * flick;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // ana şimşek: zigzag omurga (at değerinden türetilen tohumla her çakma farklı şekil)
    const seed = p.at == null ? 0 : Math.round(p.at * 10) * 131;
    const segs = 9, pts = [];
    for (let i = 0; i <= segs; i++) {
      const y = -105 + (210 * i) / segs;
      const x = (i === 0 || i === segs) ? 0 : (k.hash(seed + i * 13 + 2) - 0.5) * 84;
      pts.push([x, y]);
    }
    const bolt = (w, alpha) => {
      ctx.strokeStyle = k.rgba(p.color, alpha);
      ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    };
    k.glow(0, 0, 110, p.color, 0.32 * a);
    bolt(13, 0.35 * a);      // dış hale
    bolt(6.5, 0.9 * a);      // gövde

    // yan dallar
    for (const b of [2, 5, 7]) {
      const [bx, by] = pts[b];
      const dir = k.hash(seed + b * 29 + 1) > 0.5 ? 1 : -1;
      const len = 28 + k.hash(seed + b * 31 + 2) * 26;
      ctx.strokeStyle = k.rgba(p.color, 0.7 * a); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(bx, by);
      ctx.lineTo(bx + dir * len * 0.7, by + 16);
      ctx.lineTo(bx + dir * len, by + 40);
      ctx.stroke();
    }

    // uçlarda çarpma parlaması
    k.glow(0, -105, 36, p.color, 0.5 * a);
    k.glow(0, 105, 36, p.color, 0.5 * a);
  },
};
