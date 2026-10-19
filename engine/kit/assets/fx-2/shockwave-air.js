// fx-2/shockwave-air — hava şok dalgası: at anında merkezden genişleyen 3 kademeli halka
// + radyal hız çizgileri + kısa merkez flaşı; 0.7 sn'de alfa sönümlenir.
// NOT: canvas y-aşağıdır; (0,0) şokun çıktığı nokta.
export default {
  name: 'shockwave-air', category: 'fx-2',
  desc: 'Hava şok dalgası: at anında merkezden genişleyen halkalar ve radyal hız çizgileri',
  tags: ['şok', 'dalga', 'hava', 'shockwave', 'air', 'blast', 'patlama dalgası', 'şok dalgası', 'ring'],
  box: [-170, -170, 170, 170],
  bleed: 30,
  anchor: 'merkez (0,0) — şokun çıktığı nokta',
  points: { edge: [160, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'dalga rengi' },
    at: { type: 'time', default: null, desc: 'şok anı (halkalar + hız çizgileri)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 0.7) { ctx.restore(); return; }

    // 1) merkez flaşı (ilk 0.14 sn)
    if (d < 0.14) {
      const f = 1 - d / 0.14;
      k.glow(0, 0, 70 * f + 20, 'yellow', 0.5 * f);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * f).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(0, 0, 22 * f + 6, 0, k.TAU); ctx.fill();
    }

    // 2) genişleyen halkalar (3 halka, kademeli — küre hissi için içten dışa)
    for (let r = 0; r < 3; r++) {
      const dd = d - r * 0.08;
      if (dd < 0) continue;
      const g = k.prog(dd, 0, 0.62);
      const rad = 14 + 148 * k.E.outExpo(g);
      ctx.strokeStyle = r === 0 ? k.rgba(p.color, 0.8 * (1 - g)) : k.rgba(p.color, 0.45 * (1 - g));
      ctx.lineWidth = (r === 0 ? 9 : 5.5) * (1 - g * 0.6) + 1.5;
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, k.TAU); ctx.stroke();
    }

    // 3) radyal hız çizgileri (ilk 0.35 sn)
    if (d < 0.35) {
      const sg = d / 0.35;
      for (let i = 0; i < 14; i++) {
        const h1 = k.hash(i * 17 + 601), h2 = k.hash(i * 23 + 617);
        const a = h1 * k.TAU;
        const r0 = 24 + h2 * 24 + sg * 70;
        const len = 14 + h2 * 26;
        ctx.strokeStyle = k.rgba(p.color, 0.55 * (1 - sg));
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
        ctx.lineTo(Math.cos(a) * (r0 + len), Math.sin(a) * (r0 + len));
        ctx.stroke();
      }
    }

    // 4) halka önünde sürüklenen ince toz zerreleri
    const dg = k.prog(d, 0.05, 0.65);
    for (let i = 0; i < 12; i++) {
      const h1 = k.hash(i * 31 + 631), h2 = k.hash(i * 37 + 647);
      const a = h1 * k.TAU;
      const rad = (14 + 148 * k.E.outExpo(dg)) * (0.8 + h2 * 0.25);
      const px = Math.cos(a) * rad, py = Math.sin(a) * rad;
      ctx.fillStyle = k.rgba(p.color, 0.5 * (1 - dg));
      ctx.beginPath(); ctx.arc(px, py, 2 + h2 * 3.5, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
