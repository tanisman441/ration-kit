// space-action/meteor-dodge — ateşli meteor yakın geçiş yapar; `at` anında uzay aracı
// sarsıntılı bir manevrayla yana kaçar, itici alevi patlar, meteor ateşiyle süzülüp geçer.
// NOT: canvas y-aşağıdır; (0,0) uzay aracının merkezidir. Yukarı = negatif y.
export default {
  name: 'meteor-dodge',
  category: 'space-action',
  desc: 'Uzay aracı ateşli meteorun yakın geçişinde sarsıntılı manevrayla yana kaçar',
  tags: ['meteor', 'kaçış', 'göktaşı', 'uzay aracı', 'manevra', 'sarsıntı', 'meteor', 'dodge', 'evade', 'spacecraft', 'near miss', 'fireball'],
  box: [-180, -110, 180, 110],
  bleed: 80,
  anchor: 'uzay aracı merkezi (0,0)',
  points: { ship: [0, 0], meteor: [0, -60], thruster: [-58, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'gemi gövde rengi' },
    at: { type: 'time', default: null, desc: 'meteor yakın geçiş anı: 0.6 sn sarsıntılı kaçış' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const OUT = 6;
    ctx.save();

    // --- meteor: döngülü yakın geçiş (idle her 3.2 sn'de bir üstten geçer) ---
    const PER = 3.2;
    const mt = ((t % PER) + PER) % PER;
    const mp = mt / PER;                                            // 0–1
    const mx = k.lerp(-200, 200, mp);
    const my = -95 + 60 * Math.sin(mp * Math.PI);                   // üstten kavisli geçiş
    const edge = k.clamp(Math.min(mp, 1 - mp) / 0.18, 0, 1);        // döngü uçlarında sönümle
    const nx = 1, ny = 0.25;                                        // iz yönü
    const trail = (0.75 + 0.25 * k.noise1(t * 14)) * edge;
    // alevli iz
    for (let i = 0; i < 16; i++) {
      const h1 = k.hash(i * 5 + 101), h2 = k.hash(i * 9 + 113), h3 = k.hash(i * 23 + 127);
      const along = 0.2 + h1 * 0.8;
      const wob = k.noise1(t * 10 + i * 2.1) * 14;
      const bx = mx - nx * along * 110 - ny * wob;
      const by = my - ny * along * 110 + nx * wob;
      const len = (22 + 34 * h2) * (1 - along * 0.5) * trail;
      ctx.strokeStyle = k.rgba(h3 > 0.4 ? 'yellow' : 'red', 0.6 * (1 - along) * trail);
      ctx.lineWidth = (4 + 6 * h2) * (1 - along * 0.4);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(bx + nx * len, by + ny * len);
      ctx.lineTo(bx - nx * len, by - ny * len);
      ctx.stroke();
    }
    // ateş topu başı
    const mr = 22 * trail;
    k.glow(mx, my, mr * 2.6, k.col('yellow'), 0.5 * trail);
    ctx.fillStyle = k.rgba('yellow', 0.85 * trail);
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 0.95 * edge);
    ctx.beginPath(); ctx.arc(mx, my, mr * 0.55, 0, k.TAU); ctx.fill();
    // kaya kraterleri
    ctx.fillStyle = k.rgba('ink', 0.4 * edge);
    ctx.beginPath(); ctx.arc(mx - 5, my - 3, 4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 4, my + 5, 3, 0, k.TAU); ctx.fill();
    // parlama + gölge
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(mx - mr * 0.3, my - mr * 0.36, mr * 0.42, mr * 0.28, -0.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(mx + mr * 0.24, my + mr * 0.3, mr * 0.4, mr * 0.26, -0.5, 0, k.TAU); ctx.fill();

    // --- kaçış manevrası ---
    let ox = 0, oy = 0, shake = 0;
    if (d >= 0 && d < 0.6) {
      const de = k.prog(d, 0, 0.6);
      oy = -52 * Math.sin(de * Math.PI);                            // yukarı kaçış (negatif y = yukarı)
      ox = -18 * Math.sin(de * Math.PI * 2);
      shake = 6 * (1 - de);
    }
    const idleBob = 4 * k.noise1(t * 2.4);
    const sx = ox + k.noise1(t * 30) * shake;
    const sy = oy + idleBob + k.noise1(t * 26 + 5) * shake;
    const tilt = -0.28 * (d >= 0 && d < 0.6 ? Math.sin(k.prog(d, 0, 0.6) * Math.PI) : 0)
               + 0.04 * k.noise1(t * 1.8);

    // --- uzay aracı ---
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(tilt);
    // gövde (kapsül)
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    k.rrect(-52, -20, 104, 40, 20); ctx.fill(); ctx.stroke();
    // burun
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    ctx.beginPath();
    ctx.moveTo(52, -20); ctx.lineTo(78, 0); ctx.lineTo(52, 20); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // pencere
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); ctx.arc(18, 0, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(18, 0, 7, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); ctx.arc(15, -3, 2.5, 0, k.TAU); ctx.fill();
    // kanatçıklar
    ctx.fillStyle = k.rgba('red', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-30, s * 18); ctx.lineTo(-52, s * 36); ctx.lineTo(-8, s * 20);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    // itici alev (idle titreme; kaçışta patlama)
    const burst = (d >= 0 && d < 0.6) ? 2.2 * (1 - k.prog(d, 0, 0.6)) : 0;
    const fl = (0.6 + 0.4 * k.noise1(t * 12)) + burst;
    k.glow(-52, 0, 30 * fl, k.col('yellow'), 0.45);
    ctx.fillStyle = k.rgba('yellow', 0.8);
    ctx.beginPath();
    ctx.moveTo(-52, -10);
    ctx.lineTo(-52 - 34 * fl, 0);
    ctx.lineTo(-52, 10);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.7);
    ctx.beginPath();
    ctx.moveTo(-52, -5);
    ctx.lineTo(-52 - 18 * fl, 0);
    ctx.lineTo(-52, 5);
    ctx.closePath(); ctx.fill();
    // parlama + gölge
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-16, -10, 30, 9, -0.3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(-14, 12, 30, 8, -0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- kaçış şok halkası (at'ten sonra 0.4 sn) ---
    if (d >= 0 && d < 0.4) {
      const re = k.prog(d, 0, 0.4);
      ctx.strokeStyle = k.rgba('cyan', 0.6 * (1 - re));
      ctx.lineWidth = 6 * (1 - re) + 2;
      ctx.beginPath(); ctx.arc(sx, sy, 20 + 90 * re, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
