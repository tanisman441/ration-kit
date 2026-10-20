// fail-fx/smoke-fizzle — sönen kıvılcım: at anında kıvılcımlar saçar (0.4-0.8 sn sönüş);
// idle'da ince duman yükselir (dim renk, döngüsel). Tek vurgu rengi: yellow (kıvılcım).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'smoke-fizzle',
  category: 'fail-fx',
  desc: 'Sönüp duman çıkaran kıvılcım; ince duman sürekli yükselir',
  tags: ['kıvılcım', 'duman', 'sönme', 'arıza', 'yanma', 'fiyasko', 'spark', 'smoke', 'fizzle', 'fail', 'dying', 'ember'],
  box: [-95, -115, 95, 115],
  bleed: 40,
  anchor: 'kıvılcım tabanı (0,60)',
  points: { ember: [0, 60], smoke_top: [0, -70] },
  params: {
    at: { type: 'time', default: null, desc: 'sönüş anı: 0.4-0.8 sn kıvılcım saçılımı' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const bursting = d >= 0 && d < 0.85;
    const dead = d >= 0.85;
    const ex = 0, ey = 60;

    // --- ince duman: 3 dalga, 3.2 sn döngü, sürekli yükselir (idle) ---
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const ph = ((t / 3.2) + i / 3) % 1;             // 0→1 döngü
      const y = k.lerp(ey - 10, -85, ph);
      const x = Math.sin(ph * 7 + i * 2.1) * 11;
      const alpha = 0.42 * Math.sin(ph * Math.PI);    // iki uçta da söner
      if (alpha <= 0.01) continue;
      ctx.strokeStyle = k.rgba('dim', alpha);
      ctx.lineWidth = 6 * (1 - ph * 0.5);
      ctx.beginPath();
      ctx.moveTo(x, y);
      // dalgalı çizgi: 3 kısa segment
      for (let s = 1; s <= 3; s++) {
        const q = ph + s * 0.05;
        const yy = k.lerp(ey - 10, -85, Math.min(q, 1));
        const xx = Math.sin(Math.min(q, 1) * 7 + i * 2.1) * 11;
        ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }

    // --- kıvılcım tabanı ---
    if (!dead) {
      // kor: sönmeden önce nabız gibi parlar, at sonrası söner
      const emberEnv = d < 0 ? 0.7 + 0.3 * Math.sin(t * 5.2) : Math.max(0, 1 - d / 0.5);
      k.glow(ex, ey, 20, p.color, 0.4 * emberEnv);
      ctx.fillStyle = k.rgba(p.color, emberEnv);
      ctx.beginPath(); ctx.arc(ex, ey, 9, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.85 * emberEnv);
      ctx.beginPath(); ctx.arc(ex, ey, 4, 0, k.TAU); ctx.fill();
    } else {
      // sönmüş kül (dim)
      ctx.fillStyle = k.rgba('dim', 0.7);
      ctx.beginPath(); ctx.arc(ex, ey, 7, 0, k.TAU); ctx.fill();
    }

    // --- kıvılcım saçılımı: 0.4-0.8 sn sönüş ---
    if (bursting) {
      for (let i = 0; i < 7; i++) {
        const ang = -Math.PI / 2 + (k.hash(10 + i * 7) - 0.5) * 2.2; // yukarı ağırlıklı
        const start = k.hash(20 + i * 7) * 0.15;
        const fly = k.E.outCubic(k.prog(d, start, start + 0.5));
        const dist = fly * (44 + k.hash(30 + i * 7) * 44);
        const sx = ex + Math.cos(ang) * dist;
        const sy = ey + Math.sin(ang) * dist + fly * fly * 26; // yerçekimi bükmesi
        const alpha = 1 - k.prog(d, 0.4, 0.8);
        if (alpha <= 0) continue;
        k.glow(sx, sy, 14, p.color, 0.5 * alpha * (1 - fly));
        ctx.strokeStyle = k.rgba(p.color, 0.95 * alpha);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - Math.cos(ang) * 9 * (1 - fly * 0.5), sy - Math.sin(ang) * 9 * (1 - fly * 0.5));
        ctx.stroke();
      }
      // ilk an flaşı
      const fl = 1 - k.prog(d, 0, 0.2);
      if (fl > 0) k.glow(ex, ey, 34, p.color, 0.5 * fl);
    }
  },
};
