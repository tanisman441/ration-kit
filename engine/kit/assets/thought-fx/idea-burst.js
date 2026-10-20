// thought-fx/idea-burst — parlak çekirdekten dışa fırlayan ışık çizgileri; at anında 0.9 sn'lik patlama, boştayken nabız.
// NOT: canvas y-aşağıdır; (0,0) patlama merkezi.
export default {
  name: 'idea-burst', category: 'thought-fx',
  desc: 'Bright core with radiating spark lines that shoot outward on the at moment',
  tags: ['fikir', 'patlama', 'parlak', 'idea', 'burst', 'spark', 'kıvılcım', 'flash', 'ilham', 'inspiration'],
  box: [-118, -118, 118, 118],
  bleed: 32,
  anchor: 'patlama merkezi (0,0)',
  points: { core: [0, 0], ray: [112, 0], top: [0, -112] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'patlama rengi' },
    at: { type: 'time', default: null, desc: 'patlama anı: ışınlar dışa fırlar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d < 0.9;
    const burst = active ? k.clamp(d / 0.9, 0, 1) : 0;
    const pulse = 0.9 + 0.1 * Math.sin(t * 6);                  // canlı idle: nabız
    const grow = active ? 1 - burst : 0;

    k.glow(0, 0, 85, p.color, Math.min(0.32 * pulse + 0.18 * grow, 0.5));
    // çekirdek katmanları
    const r0 = (24 + 12 * grow) * pulse;
    ctx.fillStyle = k.rgba(p.color, 0.25 + 0.15 * grow);
    ctx.beginPath(); ctx.arc(0, 0, r0 * 1.9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.65 + 0.25 * grow);
    ctx.beginPath(); ctx.arc(0, 0, r0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,' + (0.85 + 0.1 * grow).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(0, 0, r0 * 0.52, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst çekirdekte, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-r0 * 0.3, -r0 * 0.35, r0 * 0.28, r0 * 0.18, -0.4, 0, k.TAU); ctx.fill();

    // ışık çizgileri: 12 yön
    for (let i = 0; i < 12; i++) {
      const a = i * k.TAU / 12 + 0.13 + k.hash(i * 7 + 1) * 0.08;
      const dx = Math.cos(a), dy = Math.sin(a);
      // boştaki soluk ışınlar
      const idleLen = 46 * pulse;
      ctx.strokeStyle = k.rgba(p.color, 0.16 * pulse);
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(dx * (r0 + 8), dy * (r0 + 8));
      ctx.lineTo(dx * (r0 + 8 + idleLen), dy * (r0 + 8 + idleLen));
      ctx.stroke();
      // patlama ışınları: dışa fırlar, solar
      if (active) {
        const len = 46 + 96 * burst;
        const al = 0.9 * (1 - burst);
        ctx.strokeStyle = k.rgba(p.color, al);
        ctx.lineWidth = 7 * (1 - burst * 0.6);
        ctx.beginPath();
        ctx.moveTo(dx * (r0 + 10), dy * (r0 + 10));
        ctx.lineTo(dx * (r0 + 10 + len), dy * (r0 + 10 + len));
        ctx.stroke();
        const tr = 5 * (1 - burst) + 2;                          // uç kıvılcımı
        ctx.fillStyle = 'rgba(255,255,255,' + (0.95 * (1 - burst)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(dx * (r0 + 12 + len), dy * (r0 + 12 + len), tr, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
