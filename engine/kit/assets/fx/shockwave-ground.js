// fx/shockwave-ground — zemin şok dalgası: at anında zeminde genişleyen halkalar + toz.
// NOT: canvas y-aşağıdır; (0,0) patlama noktası, dalga zemin düzleminde (yatay elips) yayılır.
export default {
  name: 'shockwave-ground',
  category: 'fx',
  desc: 'Zemin şok dalgası: at anında zeminde genişleyen elips halkalar ve kalkan toz',
  tags: ['şok', 'dalga', 'zemin', 'patlama dalgası', 'shockwave', 'ground', 'blast wave', 'ring'],
  box: [-230, -70, 230, 50],
  bleed: 40,
  anchor: 'zemin merkezi (0,0): şokun çıktığı nokta',
  points: { edge: [210, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'şok anı' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 1.2) return;

    // 1) ilk flaş — zeminde kısa parlama
    if (d < 0.14) {
      const f = 1 - d / 0.14;
      k.glow(0, -6, 90 * f, 'yellow', 0.4 * f);
    }

    // 2) genişleyen halkalar (3 halka, kademeli)
    for (let r = 0; r < 3; r++) {
      const rr = d - r * 0.09;
      if (rr < 0) continue;
      const g = k.prog(rr, 0, 0.95);
      const rx = 20 + 200 * k.E.outExpo(g);
      const ry = rx * 0.3;
      ctx.strokeStyle = r === 0 ? k.rgba(p.color, 0.7 * (1 - g)) : k.rgba(p.color, 0.4 * (1 - g));
      ctx.lineWidth = (r === 0 ? 9 : 5) * (1 - g * 0.6) + 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, k.TAU);
      ctx.stroke();
    }

    // 3) halka kenarında kalkan toz parçaları
    const g = k.prog(d, 0.05, 1.0);
    const al = 1 - g;
    const edgeX = 20 + 200 * k.E.outExpo(Math.min(g, 1));
    for (let i = 0; i < 16; i++) {
      const h1 = k.hash(i * 3 + 61), h2 = k.hash(i * 5 + 63);
      const side = h1 > 0.5 ? 1 : -1;
      const x = side * edgeX * (0.82 + h2 * 0.18) + k.noise1(i * 2 + d * 5) * 8;
      const y = -(6 + h2 * 34) * Math.sin(Math.min(g * 2.2, 1) * Math.PI * 0.5) + k.noise1(i * 3 + 3) * 5;
      const rr = (5 + h2 * 9) * (0.6 + g * 0.7);
      ctx.fillStyle = k.rgba(p.color, 0.45 * al);
      ctx.beginPath(); ctx.arc(x, y, rr, 0, k.TAU); ctx.fill();
    }
  },
};
