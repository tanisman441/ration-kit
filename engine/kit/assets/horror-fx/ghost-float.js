// horror-fx/ghost-float — süzülen çarşaflı hayalet: dalgalı etek + mor parlayan gözler.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir. Saf idle animasyonu, time paramı yok.
export default {
  name: 'ghost-float', category: 'horror-fx',
  desc: 'Çarşaflı hayalet: sürekli yukarı-aşağı süzülür, eteği dalgalanır, gözleri mor parlar',
  tags: ['hayalet', 'çarşaf', 'süzülme', 'ruh', 'korku', 'perili', 'ghost', 'floating', 'sheet ghost', 'spirit', 'haunt'],
  box: [-70, -95, 70, 95],
  bleed: 14,
  anchor: 'gövde merkezi (0,0)',
  points: { head: [0, -55], hem: [0, 82], eyes: [0, -52] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: '0.5–2: süzülme ve dalgalanma hızı' },
  },
  draw(ctx, t, p, k) {
    const sp = k.clamp(p.speed, 0.5, 2);
    ctx.save();

    // --- canlı idle: süzülme + yana yatma ---
    const bobY = 9 * Math.sin(t * 2.0 * sp);
    const tilt = 0.07 * Math.sin(t * 1.25 * sp + 1);
    ctx.translate(0, bobY); ctx.rotate(tilt);

    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // --- çarşaf gövde: üst yarım daire + dalgalı etek ---
    const hemY = x => 74 + 9 * k.noise1(x * 0.06 + t * 3.2 * sp);
    const body = dy => {
      ctx.beginPath();
      ctx.arc(0, -28 + dy, 54, Math.PI, 0);                 // kubbe baş
      ctx.lineTo(54, hemY(54) + dy);
      for (let x = 54; x >= -54; x -= 9) ctx.lineTo(x, hemY(x) + dy);  // dalgalı etek
      ctx.closePath();
    };
    ctx.fillStyle = darker(p.color);
    ctx.save(); ctx.translate(6, 6); body(0); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color);
    body(0); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.lineJoin = 'round';
    body(0); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';               // sol üst parlama (premium finish)
    ctx.beginPath(); ctx.ellipse(-26, -52, 17, 8, -0.5, 0, k.TAU); ctx.fill();

    // --- kollar: çarşafın iki yanında minik çıkıntılar ---
    for (const side of [-1, 1]) {
      const wave = 4 * k.noise1(t * 3 * sp + side * 5);
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(side * 56, -2 + wave, 12, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(side * 56, -2 + wave, 12, 0, k.TAU); ctx.stroke();
    }

    // --- yüz: mor parlayan gözler + şaşkın ağız ---
    const glowA = 0.28 + 0.14 * Math.sin(t * 3.4 * sp);     // göz nabzı
    for (const side of [-1, 1]) {
      const ex = side * 17, ey = -50;
      k.glow(ex, ey, 13, k.col('purple'), glowA);
      ctx.fillStyle = k.rgba('ink', 0.92);
      ctx.beginPath(); ctx.arc(ex, ey, 5.5, 0, k.TAU); ctx.fill();
    }
    ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, -30, 7, 9 + 2 * Math.sin(t * 3.4 * sp), 0, 0, k.TAU); ctx.stroke();

    ctx.restore();
  },
};
