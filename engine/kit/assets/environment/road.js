// environment/road — yatay yol şeridi (perspektifsiz); orta kesik çizgili asfalt.
// NOT: canvas y-aşağıdır; şerit merkezi (0,0).
export default {
  name: 'road',
  category: 'environment',
  desc: 'Yatay asfalt yol şeridi; ortada sarı kesik çizgi, kenarlarda şerit çizgileri',
  tags: ['yol', 'asfalt', 'cadde', 'sokak', 'şerit', 'road', 'street', 'asphalt', 'highway', 'lane'],
  box: [-324, -37, 324, 37],
  bleed: 0,
  anchor: 'şerit merkezi (0,0); yol yatay uzar',
  points: { start: [-320, 0], end: [320, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // asfalt gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-320 - LW / 2, -30 - LW / 2, 640 + LW, 60 + LW, 12 + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-320, -30, 640, 60, 12); ctx.fill();

    // kenar çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.6); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-312, -22); ctx.lineTo(312, -22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-312, 22); ctx.lineTo(312, 22); ctx.stroke();

    // orta kesik çizgi (sarı vurgu)
    ctx.fillStyle = k.rgba('yellow', 0.9);
    for (let x = -306; x < 306; x += 62) {
      ctx.beginPath(); k.rrect(x, -4, 34, 8, 4); ctx.fill();
    }

    // premium parlama (üst şerit, sol)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); k.rrect(-310, -27, 210, 7, 3.5); ctx.fill();
  },
};
