// economy/coin — dönen madeni para: önden görünüm, spin ile yarım tur atar
// (ön yüz yıldızlı, arka yüz çizgili). Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) merkezdir.
export default {
  name: 'coin', category: 'economy',
  desc: 'Madeni para; spin 0-1 arasında yarım tur döner (ön yüz yıldızlı, arka yüz çizgili)',
  tags: ['para', 'madeni para', 'coin', 'money', 'altın', 'gold', 'dön', 'spin'],
  box: [-75, -80, 75, 80],
  bleed: 8,
  anchor: 'merkez (0,0)',
  points: { top: [0, -62] },
  params: {
    color: { type: 'color', default: 'yellow' },
    spin: { type: 'number', default: 0, desc: 'dönüş miktarı (0-1: yarım tur)' },
  },
  draw(ctx, t, p, k) {
    const R = 62, LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const star = (cx, cy, r, c) => {
      ctx.fillStyle = c; ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };

    const ang = k.clamp(p.spin, 0, 1) * Math.PI;
    const sx = Math.cos(ang), face = sx < 0 ? -1 : 1;
    const w = Math.max(Math.abs(sx), 0.06);

    // zemin gölgesi (ölçeklenmemiş)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(6, R + 12, R * w * 0.9, 8, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.scale(w, 1);
    // kalınlık hissi: arkada koyu kenar
    ctx.fillStyle = k.rgba('bg', 0.6);
    ctx.beginPath(); ctx.arc(-7 * face, 0, R, 0, k.TAU); ctx.fill();
    // dış hat + ana disk
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    // iç halka
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, R - 15, 0, k.TAU); ctx.stroke();
    if (face > 0) {
      star(0, 0, 23, k.rgba('ink', 0.75));
    } else {
      // arka yüz: yatay çizgi deseni
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
      [-14, 0, 14].forEach(y => {
        const hw = Math.sqrt(Math.max((R - 22) * (R - 22) - y * y, 0));
        ctx.beginPath(); ctx.moveTo(-hw, y); ctx.lineTo(hw, y); ctx.stroke();
      });
    }
    // premium parlama (sol üst)
    if (w > 0.3) {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-19, -23, 16, 10, -0.4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
