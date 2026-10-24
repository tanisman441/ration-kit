// library-fx/bookstack-wobble — üst üste kitap yığını döngüsel olarak sallanır, dengede kalır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = yığın tabanı.
export default {
  name: 'bookstack-wobble', category: 'library-fx',
  desc: 'Üst üste dizili kitap yığını döngüsel olarak sallanır, üst kitap kayar ama düşmez',
  tags: ['kitap', 'yığın', 'kütüphane', 'denge', 'sallanma', 'book', 'stack', 'library', 'wobble', 'balance'],
  box: [-150, -175, 150, 35],
  bleed: 35,
  anchor: 'yığın tabanı (zemin)',
  points: { top: [0, -160], base: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
    wobble: { type: 'number', default: 0.7, desc: 'sallanma genliği (0–1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const amp = Math.max(0.1, Math.min(1, p.wobble));
    const ph = t / 2.4;
    const sway = Math.sin(ph * k.TAU) * amp;
    ctx.lineCap = 'round';
    ctx.save();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-144, 0, 288, 16, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(-140, 0, 280, 12, 8); ctx.fill();
    const layers = [
      { w: 240, h: 34, col: 'dim', y: -34 },
      { w: 210, h: 32, col: 'panel2', y: -66 },
      { w: 180, h: 30, col: 'ink', y: -96 },
      { w: 150, h: 28, col: 'dim', y: -124 },
      { w: 120, h: 26, col: 'panel2', y: -150 },
    ];
    for (let i = 0; i < layers.length; i++) {
      const L = layers[i];
      const f = (i + 1) / layers.length;
      const dx = sway * 13 * f;
      const rot = sway * 0.09 * f;
      ctx.save();
      ctx.translate(dx, 0);
      ctx.rotate(rot);
      const cx = -L.w / 2, cy = L.y;
      ctx.fillStyle = k.rgba('ink', 0.12); ctx.beginPath(); k.rrect(cx + 6, cy + 6, L.w, L.h, 8); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(cx - 3, cy - 3, L.w + 6, L.h + 6, 8); ctx.fill();
      ctx.fillStyle = k.rgba(L.col, 1); ctx.beginPath(); k.rrect(cx, cy, L.w, L.h, 8); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 0.9);
      ctx.beginPath(); k.rrect(cx + 10, cy + L.h / 2 - 3, 26, 6, 3); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 0.9);
      ctx.beginPath(); k.rrect(cx + L.w - 14, cy + 4, 8, L.h - 8, 3); ctx.fill();
      if (i >= 3) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(cx + 26, cy + 8, 18, 6, -0.3, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    }
    if (Math.abs(sway) > 0.6 * amp) {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = k.rgba('dim', 0.5);
        ctx.beginPath(); ctx.arc(60 + k.hash(i * 7 + 1) * 30, -10 - k.hash(i * 11 + 2) * 20, 2.5, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
