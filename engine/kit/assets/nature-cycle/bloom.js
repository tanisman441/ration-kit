// nature-cycle/bloom — çiçek açma: bloom anında taç yapraklar 1.2 sn'de açılır, polen parıltısı saçılır.
// NOT: canvas y-aşağıdır; çiçek yukarı doğru açılır.
export default {
  name: 'bloom', category: 'nature-cycle',
  desc: 'Çiçek açma: bloom anında taç yapraklar açılır, polen parıltısı saçılır',
  tags: ['çiçek', 'tomurcuk', 'açma', 'bahar', 'polen', 'taçyaprak', 'flower', 'bloom', 'bud', 'petal', 'spring'],
  box: [-140, -130, 140, 130],
  bleed: 40,
  anchor: 'çiçek merkezi (0,0); sap tabanda (0,110)',
  points: { flower: [0, 0], bud: [-26, -6], stem: [0, 60], base: [0, 110] },
  params: {
    bloom: { type: 'time', default: null, desc: 'açma anı: 1.2 sn\'de taç yapraklar açılır, polen parıltısı saçılır' },
    petal: { type: 'color', default: 'purple' },
    leaf: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.bloom == null ? -1 : t - p.bloom;
    const g = d < 0 ? 0 : k.prog(d, 0, 1.2);
    const e = k.E.outBack(k.clamp(g, 0, 1));
    const breathe = 1 + 0.03 * Math.sin(t * (k.TAU / 2.4));

    // bitki salınımı (taban etrafında)
    ctx.translate(0, 110); ctx.rotate(k.noise1(t * 0.9) * 0.035); ctx.translate(0, -110);

    // 1) zemin tümseği
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 112, 74, 15, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darker(p.leaf);
    ctx.beginPath(); ctx.ellipse(0, 111, 68, 12, 0, 0, k.TAU); ctx.fill();

    // 2) sap
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(0, 110); ctx.quadraticCurveTo(7, 60, 0, 12); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.leaf); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, 110); ctx.quadraticCurveTo(7, 60, 0, 12); ctx.stroke();

    // 3) yapraklar (sap üstünde)
    const leafAt = (lx, ly, rot) => {
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(rot);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, 0, 23, 12.5, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.leaf);
      ctx.beginPath(); ctx.ellipse(0, 0, 20, 10, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-6, -4, 9, 4.5, -0.3, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    leafAt(-24, 58, -0.55 + k.noise1(t * 1.1) * 0.05);
    leafAt(26, 78, 0.55 + k.noise1(t * 1.1 + 4) * 0.05);

    // 4) taç yapraklar — kapalıdan açığa
    for (let i = 0; i < 6; i++) {
      const ai = (i / 6) * k.TAU - Math.PI / 2;
      const ang = k.lerp(-Math.PI / 2, ai, e);
      const dist = 38 * e;
      const sc = (0.15 + 0.85 * e) * (0.6 + 0.4 * e > 0.9 ? breathe : 1);
      const px = Math.cos(ang) * dist, py = Math.sin(ang) * dist;
      ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(sc, sc);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(16, 0, 32, 19, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.petal, Math.max(e, 0.001));
      ctx.beginPath(); ctx.ellipse(16, 0, 29, 16, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(6, -8, 12, 6, -0.4, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // 5) çiçek merkezi
    if (e > 0.25) {
      const cr = 13 * k.clamp((e - 0.25) / 0.75);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, 0, cr + 3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darker(p.petal);
      ctx.beginPath(); ctx.arc(0, 0, cr, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * k.TAU + 0.4;
        ctx.beginPath(); ctx.arc(Math.cos(a) * cr * 0.55, Math.sin(a) * cr * 0.55, 2.2, 0, k.TAU); ctx.fill();
      }
    }

    // 6) tomurcuk — açılmadan önce (açılırken solar)
    if (g < 1) {
      const bp = d < 0 ? 1 + 0.03 * Math.sin(t * (k.TAU / 2.4)) : 1; // boşta nabız
      const bs = bp * (1 - 0.75 * e);
      ctx.globalAlpha = 1 - g;
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, -4, 15 * bs + 3, 25 * bs + 3, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.petal);
      ctx.beginPath(); ctx.ellipse(0, -4, 15 * bs, 25 * bs, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-5, -12, 6, 10, -0.2, 0, k.TAU); ctx.fill();
      // çanak yapraklar
      ctx.fillStyle = k.rgba(p.leaf);
      ctx.beginPath(); ctx.ellipse(-11, 16, 9, 5, 0.5, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(11, 16, 9, 5, -0.5, 0, k.TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 7) polen parıltısı — açılma sırasında
    if (d >= 0.15 && d <= 1.3) {
      const pg = k.prog(d, 0.15, 1.3);
      for (let i = 0; i < 10; i++) {
        const pa = k.hash(i * 3.7) * k.TAU;
        const pr = 20 + 70 * k.E.outExpo(pg) * (0.6 + 0.4 * k.hash(i * 9.1));
        const px = Math.cos(pa) * pr, py = Math.sin(pa) * pr - pg * 22;
        ctx.fillStyle = k.rgba(p.petal, 0.8 * (1 - pg));
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
