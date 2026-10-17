// fx/sparks — kıvılcım patlaması: at anında ince ışıklı çizgiler dışa saçılır.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'sparks',
  category: 'fx',
  desc: 'Kıvılcım patlaması: at anında ince ışıklı çizgiler dışa saçılır, solar',
  tags: ['kıvılcım', 'parıltı', 'çarpışma', 'sıçrama', 'spark', 'sparks', 'glint', 'burst'],
  box: [-95, -95, 95, 95],
  bleed: 45,
  anchor: 'merkez (0,0)',
  points: {},
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 0.7) return;
    const dd = Math.min(d / 0.7, 1), al = 1 - dd;
    ctx.lineCap = 'round';

    // merkez flaşı
    if (d < 0.12) {
      const f = 1 - d / 0.12;
      k.glow(0, 0, 46 * f + 12, p.color, 0.5 * f);
    }

    // 16 kıvılcım: dışa doğru çizgi + parlak uç
    for (let i = 0; i < 16; i++) {
      const a = k.hash(i * 3 + 1) * k.TAU;
      const sp = (70 + k.hash(i * 5 + 2) * 60);
      const dist = sp * (1 - Math.pow(1 - dd, 2.2));
      const dx = Math.cos(a), dy = Math.sin(a);
      const x = dx * dist, y = dy * dist + dd * dd * 34;   // hafif yerçekimi
      const len = 26 * (1 - dd) + 6;
      ctx.strokeStyle = k.rgba(p.color, al);
      ctx.lineWidth = 3.5 * (1 - dd) + 1;
      ctx.beginPath();
      ctx.moveTo(x - dx * len / 2, y - dy * len / 2);
      ctx.lineTo(x + dx * len / 2, y + dy * len / 2);
      ctx.stroke();
      // uçta parlak nokta
      ctx.fillStyle = k.rgba(p.color, al);
      ctx.beginPath(); ctx.arc(x + dx * len / 2, y + dy * len / 2, 3, 0, k.TAU); ctx.fill();
    }
  },
};
