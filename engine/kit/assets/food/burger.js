// food/burger — katmanlı hamburger (ön görünüm); squish anında katmanlar basılıp geri döner
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) burgerin merkezidir.
export default {
  name: 'burger', category: 'food',
  desc: 'Katmanlı hamburger ön görünüm; squish anında üstten basılır ve geri döner',
  tags: ['hamburger', 'burger', 'fast food', 'yemek', 'fastfood', 'ekmek', 'sandviç'],
  box: [-85, -80, 85, 80],
  bleed: 18,
  anchor: 'burgerin merkezi (0,0)',
  points: { top: [0, -60] },
  params: {
    squish: { type: 'time', default: null, desc: 'sıkıştırma anı (katmanlar basılır ve geri döner)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const LW = 5, W = 150;
    const bun = k.rgba('panel2'), patty = k.rgba('ink', 0.85), cheese = k.rgba(p.color);
    const line = k.rgba('bg', 0.55);
    const d = p.squish == null ? -1 : t - p.squish;

    // squish: 0→0.5 sn basılıp geri dönüş
    let sq = 0;
    if (d >= 0 && d < 0.5) sq = Math.sin(Math.PI * d / 0.5);
    const squashY = 1 - 0.28 * sq;

    const rrectStroke = (x, y, w, h, r) => {
      ctx.strokeStyle = line; ctx.lineWidth = LW;
      k.rrect(x, y, w, h, r); ctx.stroke();
    };

    ctx.save();
    ctx.scale(1, squashY);

    // alt ekmek
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-W / 2 + 7, 34, W, 26, 13); ctx.fill();
    ctx.fillStyle = bun;
    k.rrect(-W / 2, 28, W, 26, 13); ctx.fill();
    rrectStroke(-W / 2, 28, W, 26, 13);

    // köfte
    ctx.fillStyle = patty;
    k.rrect(-W / 2 + 3, 8, W - 6, 20, 10); ctx.fill();
    rrectStroke(-W / 2 + 3, 8, W - 6, 20, 10);

    // marul (dalgalı şerit)
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath();
    ctx.moveTo(-W / 2 - 6, -10);
    for (let x = -W / 2 - 6; x < W / 2 + 6; x += 12)
      ctx.quadraticCurveTo(x + 6, -10 + ((Math.round(x / 12) % 2) ? 7 : -3), x + 12, -10);
    ctx.lineTo(W / 2 + 6, 4);
    for (let x = W / 2 + 6; x > -W / 2 - 6; x -= 12)
      ctx.quadraticCurveTo(x - 6, 4 + ((Math.round(x / 12) % 2) ? -5 : 3), x - 12, 4);
    ctx.closePath(); ctx.fill();

    // domates (ince kırmızı şerit)
    ctx.fillStyle = k.rgba('red', 0.85);
    k.rrect(-W / 2 + 6, -24, W - 12, 12, 6); ctx.fill();
    rrectStroke(-W / 2 + 6, -24, W - 12, 12, 6);

    // peynir (sarkan köşeli dilim)
    ctx.fillStyle = cheese;
    ctx.beginPath();
    ctx.moveTo(-W / 2 + 4, -44); ctx.lineTo(W / 2 - 4, -44); ctx.lineTo(W / 2 - 4, -30);
    ctx.lineTo(W / 2 - 36, -30); ctx.lineTo(W / 2 - 36, -16); // sağ sarkan uç
    ctx.lineTo(W / 2 - 54, -30); ctx.lineTo(-W / 2 + 4, -30);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();

    // üst ekmek (kubbe)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(7, -38, W / 2, 30, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = bun;
    ctx.beginPath(); ctx.ellipse(0, -44, W / 2, 30, 0, Math.PI, 0); ctx.fill();
    // susam
    ctx.fillStyle = k.rgba('bg', 0.45);
    const seeds = [[-52, -58], [-30, -66], [-6, -60], [18, -67], [42, -59], [62, -52]];
    for (const [sx, sy] of seeds) { ctx.beginPath(); ctx.ellipse(sx, sy, 5, 3.2, 0.5, 0, k.TAU); ctx.fill(); }
    // premium parlama (sol üst kubbe)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-36, -56, 26, 9, -0.35, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.ellipse(0, -44, W / 2, 30, 0, Math.PI, 0); ctx.stroke();

    ctx.restore();
  },
};
