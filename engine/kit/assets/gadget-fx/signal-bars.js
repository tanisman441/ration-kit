// gadget-fx/signal-bars — büyüyüp nabız gibi atan sinyal çubukları.
// NOT: canvas y-aşağıdır; (0,0) çubukların taban çizgisinin merkezi.
export default {
  name: 'signal-bars',
  category: 'gadget-fx',
  desc: 'Signal bars: four rounded bars that pulse gently and bounce in a wave on activity',
  tags: ['sinyal', 'çubuk', 'bağlantı', 'seviye', 'kablosuz', 'signal', 'bars', 'reception', 'strength'],
  box: [-140, -190, 140, 40],
  bleed: 30,
  anchor: 'taban çizgisi merkezi',
  points: { base: [0, 0], top: [84, -168] },
  params: {
    activity: { type: 'time', default: null, desc: 'sinyal aktivite anı: çubuklar dalga gibi zıplar' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.activity == null ? -1 : t - p.activity;
    const loop = (t % 3.0) / 3.0;
    const hs = [52, 92, 132, 172]; // çubuk boyları
    const bw = 34, gap = 46, x0 = -(3 * gap + bw) / 2 + bw / 2;

    for (let i = 0; i < 4; i++) {
      const x = x0 + i * gap;
      // idle: çubuklar hafifçe nabız gibi atar (kademeli faz)
      const idle = 1 + 0.06 * Math.sin(loop * k.TAU - i * 0.9);
      // activity olayı: soldan sağa zıplama dalgası (0.7 sn)
      let bounce = 1;
      if (d >= 0 && d <= 0.7) {
        const local = d - i * 0.08;
        if (local >= 0 && local <= 0.32) {
          bounce = 1 + 0.28 * Math.sin((local / 0.32) * Math.PI);
        }
      }
      const h = hs[i] * idle * bounce;
      const y = -h;

      // çubuk gövdesi — dim
      ctx.fillStyle = k.rgba('dim', 0.95);
      ctx.beginPath(); k.rrect(x - bw / 2, y, bw, h, 12); ctx.fill();
      // aktif uç vurgusu — üstte renkli kapak (accent)
      const capH = Math.min(26, h * 0.3);
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath(); k.rrect(x - bw / 2, y, bw, capH, 10); ctx.fill();
      // premium finish: sol üst parlama (beyaz, alfa 0.10)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); k.rrect(x - bw / 2 + 4, y + 4, 8, h * 0.4, 4); ctx.fill();
      // gölge: sağ alt %12
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); k.rrect(x - bw / 2 + 4, y + h - 8, bw - 8, 6, 3); ctx.fill();
    }
    ctx.restore();
  },
};
