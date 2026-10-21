// mechanics-fx/gear-turn — dönen makine dişlisi: 12 dişli çark, 4 kollu, mil + cıvatalar.
// spin (0-1) dönüş hızını belirler; spin=0 iken bile yavaşça döner (canlı idle).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) dişli merkezidir.
export default {
  name: 'gear-turn', category: 'mechanics-fx',
  desc: 'spin hızında dönen dişli çark; mil, 4 kol ve cıvatalı göbek',
  tags: ['dişli', 'çark', 'mekanik', 'makine', 'dönüş', 'gear', 'cog', 'machine', 'mechanism', 'rotate'],
  box: [-115, -115, 115, 115],
  bleed: 8,
  anchor: 'dişli merkezi (0,0)',
  points: { hub: [0, 0] },
  params: {
    color: { type: 'color', default: 'ink' },
    spin: { type: 'number', default: 0.5, desc: 'dönüş hızı (0-1); 0 = en yavaş idle dönüş' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const N = 12, R_OUT = 96, R_IN = 78;
    const spin = k.clamp(p.spin, 0, 1);
    const ang = t * (0.35 + 2.6 * spin);   // idle dönüş + spin hızı

    ctx.save();
    ctx.rotate(ang);

    // dişli silueti (tek path: dış dişler)
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * k.TAU, a1 = ((i + 0.28) / N) * k.TAU, a2 = ((i + 0.5) / N) * k.TAU, a3 = ((i + 0.78) / N) * k.TAU;
      const px = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
      const [x1, y1] = px(R_IN, a0), [x2, y2] = px(R_OUT, a1), [x3, y3] = px(R_OUT, a2), [x4, y4] = px(R_IN, a3);
      if (i === 0) ctx.moveTo(x1, y1); else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
    }
    ctx.closePath();
    ctx.lineWidth = LW; ctx.strokeStyle = line; ctx.stroke();
    ctx.fillStyle = body; ctx.fill();

    // iç halka
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 62 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 0, 62, 0, k.TAU); ctx.fill();
    // gölge (sağ alt, %12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(4, 5, 58, 0.6, 2.2); ctx.fill();

    // 4 kol
    ctx.lineWidth = 14; ctx.strokeStyle = k.rgba('dim');
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * k.TAU;
      ctx.beginPath();
      ctx.moveTo(20 * Math.cos(a), 20 * Math.sin(a));
      ctx.lineTo(56 * Math.cos(a), 56 * Math.sin(a));
      ctx.stroke();
    }
    // göbek
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 22 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, k.TAU); ctx.fill();
    // cıvatalar
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * k.TAU + Math.PI / 4;
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(36 * Math.cos(a), 36 * Math.sin(a), 6, 0, k.TAU); ctx.fill();
    }
    // mil
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 10 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, k.TAU); ctx.fill();

    ctx.restore();

    // premium parlama (sol üst, ışık yönü sabit — dönüşle hareket etmez)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-56, -68, 30, 16, -0.55, 0, k.TAU); ctx.fill();
  },
};
