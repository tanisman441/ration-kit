// superhero-fx/cape-flutter — rüzgârda dalgalanan süper kahraman pelerini.
// NOT: canvas y-aşağıdır; (0,0) pelerinin takıldığı omuz.
export default {
  name: 'cape-flutter', category: 'superhero-fx',
  desc: 'Rüzgârda sürekli dalgalanan süper kahraman pelerini: omuzdan takılır, ucu rüzgârla salınır',
  tags: ['pelerin', 'kahraman', 'süper', 'dalgalanma', 'rüzgar', 'cape', 'hero', 'flutter', 'wind'],
  box: [-70, -100, 160, 115],
  bleed: 30,
  anchor: 'pelerinin takıldığı omuz (0,0)',
  points: { shoulder: [0, 0], tip: [150, 0] },
  params: {
    wind: { type: 'number', default: 0.5, desc: '0–1: rüzgar şiddeti; arttıkça dalga genliği büyür' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const W = k.clamp(p.wind, 0, 1);
    const amp = 4 + W * 24;                 // dalga genliği
    const spd = 2.4 + W * 3.6;              // dalga hızı
    const N = 26;
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const f = i / N;
      const x = -12 + f * 168;
      const sway = 0.3 + f;                 // uca doğru büyüyen salınım
      const w1 = Math.sin(f * 7.0 + t * spd) * amp * sway;
      const w2 = Math.sin(f * 5.2 - t * spd * 1.3 + 1.7) * amp * 0.8 * sway;
      top.push([x, -64 + f * 28 + w1]);
      bot.push([x, 62 + f * 16 + w2]);
    }
    ctx.save();

    // gövde
    ctx.beginPath();
    ctx.moveTo(top[0][0], top[0][1]);
    for (let i = 1; i <= N; i++) ctx.lineTo(top[i][0], top[i][1]);
    for (let i = N; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
    ctx.closePath();
    ctx.fillStyle = k.rgba(p.color);
    ctx.fill();

    // premium finish: sağ alt %12 gölge (uc tarafı)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(bot[N - 6][0], bot[N - 6][1]);
    for (let i = N - 6; i <= N; i++) ctx.lineTo(bot[i][0], bot[i][1]);
    for (let i = N; i >= N - 6; i--) ctx.lineTo(top[i][0], top[i][1]);
    ctx.closePath();
    ctx.fill();

    // premium finish: sol üst parlama (omuz tarafı)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    ctx.ellipse(6, -48, 34, 14, -0.25, 0, k.TAU);
    ctx.fill();

    // iç kıvrım çizgileri — havadaki ince çizgiler ink rengiyle
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 3;
    for (const ff of [0.32, 0.58, 0.82]) {
      ctx.beginPath();
      const i0 = Math.round(ff * N);
      ctx.moveTo(top[i0][0] + 4, top[i0][1] + 6);
      ctx.quadraticCurveTo(
        (top[i0][0] + bot[i0][0]) / 2 + 8, (top[i0][1] + bot[i0][1]) / 2,
        bot[i0][0] + 4, bot[i0][1] - 6);
      ctx.stroke();
    }

    // dış hat
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(top[0][0], top[0][1]);
    for (let i = 1; i <= N; i++) ctx.lineTo(top[i][0], top[i][1]);
    for (let i = N; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
    ctx.closePath();
    ctx.stroke();

    // omuz tokası
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
