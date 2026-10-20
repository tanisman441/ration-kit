// money-fx/coin-spin-glow — dönen parlayan coin: sürekli spin atar,
// kenar parıltısı nabız gibi atar, yörüngede kıvılcımlar dolaşır (saf idle).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) coin merkezidir.
export default {
  name: 'coin-spin-glow', category: 'money-fx',
  desc: 'Dönen parlayan coin: sürekli spin, nabız gibi atan kenar parıltısı ve yörünge kıvılcımları',
  tags: ['para', 'madeni para', 'dön', 'spin', 'parıltı', 'coin', 'money', 'glow', 'altın', 'gold'],
  box: [-80, -85, 80, 85],
  bleed: 35,
  anchor: 'coin merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow' },
    period: { type: 'number', default: 1.8, min: 0.8, max: 4, desc: 'bir tam spin süresi (sn)' },
  },
  draw(ctx, t, p, k) {
    const R = 58, P = Math.max(p.period, 0.2);
    const ang = t * k.TAU / P;
    const sx = Math.cos(ang);
    const w = Math.max(Math.abs(sx), 0.06);
    const face = sx >= 0 ? 1 : -1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // nabız parıltısı (idle)
    k.glow(0, 0, 92, p.color, 0.24 + 0.12 * Math.sin(t * 3.4));

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(6, R + 14, R * w * 0.9, 8, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.scale(w, 1);
    // kalınlık: arkada koyu kenar
    ctx.fillStyle = k.rgba('bg', 0.6);
    ctx.beginPath(); ctx.arc(-6 * face, 0, R, 0, k.TAU); ctx.fill();
    // dış hat + gövde
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, R + 3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    // iç halka
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, R - 14, 0, k.TAU); ctx.stroke();
    if (face > 0) {
      // ön yüz: yıldız
      ctx.fillStyle = k.rgba('ink', 0.75); ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.18 : R * 0.4;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    } else {
      // arka yüz: çizgi deseni
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
      [-13, 0, 13].forEach(y => {
        const hw = Math.sqrt(Math.max((R - 21) * (R - 21) - y * y, 0));
        ctx.beginPath(); ctx.moveTo(-hw, y); ctx.lineTo(hw, y); ctx.stroke();
      });
    }
    // premium parlama (sol üst; yüz genişken)
    if (w > 0.35) {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-17, -21, 15, 9, -0.4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // yörünge kıvılcımları (idle)
    for (let i = 0; i < 3; i++) {
      const a = t * 1.25 + i * k.TAU / 3;
      const ox = Math.cos(a) * 78, oy = Math.sin(a) * 74;
      const al = 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 4.1 + i * 2.1));
      ctx.strokeStyle = k.rgba('yellow', al); ctx.lineWidth = 3;
      const s = 7;
      ctx.beginPath();
      ctx.moveTo(ox - s, oy); ctx.lineTo(ox + s, oy);
      ctx.moveTo(ox, oy - s); ctx.lineTo(ox, oy + s);
      ctx.stroke();
    }
  },
};
