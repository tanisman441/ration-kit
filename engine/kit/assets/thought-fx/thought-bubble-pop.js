// thought-fx/thought-bubble-pop — düşünce bulutu at anında elastik şekilde zıplayarak belirir; kuyruk boncukları gecikmeli dizilir.
// NOT: canvas y-aşağıdır; (0,0) bulut merkezi.
export default {
  name: 'thought-bubble-pop', category: 'thought-fx',
  desc: 'Thought bubble cloud that pops in with a springy bounce, trailing tail dots',
  tags: ['düşünce', 'bulut', 'fikir', 'akıl', 'thought', 'bubble', 'cloud', 'pop', 'idea', 'mind'],
  box: [-125, -110, 125, 112],
  bleed: 30,
  anchor: 'bulut merkezi (0,0); kuyruk aşağı sola sarkar',
  points: { centre: [0, -10], top: [0, -76], tail: [-80, 98] },
  params: {
    color: { type: 'color', default: 'panel2', desc: 'bulut rengi' },
    at: { type: 'time', default: null, desc: 'belirme anı: bulut zıplayarak büyür (0.55 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const floatY = Math.sin(t * k.TAU / 2.4) * 3;          // canlı idle: hafif süzülme
    // elastik büyüme (outBack)
    const outBack = e => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(e - 1, 3) + c1 * Math.pow(e - 1, 2); };
    let s = 1;
    if (p.at != null && d < 0) s = 0;
    else if (d >= 0 && d < 0.55) s = Math.max(outBack(k.clamp(d / 0.55, 0, 1)), 0);
    ctx.translate(0, floatY);
    ctx.scale(Math.max(s, 0.0001), Math.max(s, 0.0001));

    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), sh = k.rgba('ink', 0.10);
    const puffs = [ // [x, y, r]
      [-58, 4, 26], [-28, -24, 34], [8, -28, 38], [46, -16, 32],
      [62, 12, 27], [34, 28, 30], [-6, 30, 32], [-40, 26, 28], [-66, 18, 22],
    ];
    const puff = (c, grow, ox, oy) => {
      ctx.fillStyle = c;
      for (const [x, y, r] of puffs) { ctx.beginPath(); ctx.arc(x + ox, y + oy, r + grow, 0, k.TAU); ctx.fill(); }
    };
    puff(sh, 3, 7, 8);            // gölge: sağ alta kaydırılmış
    puff(line, 5, 0, 0);           // dış hat
    puff(body, 0, 0, 0);           // gövde
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -38, 24, 15, -0.4, 0, k.TAU); ctx.fill();
    // kuyruk boncukları: belirmeyle gecikmeli büyür
    const tail = [[-52, 60, 11], [-68, 80, 8], [-82, 96, 6]];
    for (let i = 0; i < tail.length; i++) {
      const [tx, ty, tr] = tail[i];
      let ts = 1;
      if (p.at != null && d < 0) ts = 0;
      else if (d >= 0 && d < 0.55 + i * 0.07) ts = Math.max(outBack(k.clamp((d - i * 0.07) / 0.55, 0, 1)), 0);
      if (ts <= 0.001) continue;
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(tx, ty, tr * ts + 4 * ts, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body; ctx.beginPath(); ctx.arc(tx, ty, tr * ts, 0, k.TAU); ctx.fill();
    }
    // belirmeyle genişleyen halka
    if (d >= 0 && d < 0.45) {
      const g = k.clamp(d / 0.45, 0, 1);
      ctx.strokeStyle = k.rgba('ink', 0.45 * (1 - g));
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, -10, 24 + g * 150, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
