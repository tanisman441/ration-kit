// karaoke-fx/score-pop — puan rozeti; at anında büyüyerek patlar (0.2–0.8 sn),
// ışınlar ve kıvılcımlar saçılır. Boşta hafif salınım + parlama nabzı.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; (0,0) rozet merkezidir.
export default {
  name: 'score-pop', category: 'karaoke-fx',
  desc: 'Puan rozeti; at anında büyüyerek patlar, ışınlar ve kıvılcımlar saçar',
  tags: ['puan', 'score', '100', 'rozet', 'patlama', 'pop', 'yıldız', 'başarı', 'karaoke', 'star', 'badge', 'points'],
  box: [-140, -140, 140, 140],
  bleed: 55,
  anchor: 'rozet merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'rozet rengi (tek vurgu rengi)' },
    score: { type: 'text', default: '100', desc: 'rozetin üzerindeki puan' },
    at: { type: 'time', default: null, desc: 'patlama anı: rozet büyür, ışınlar 0.2–0.8 sn saçar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? -1 : t - p.at;
    const line = k.rgba('bg', 0.55);
    const txt = String(p.score ?? '100');
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // patlama ölçeği: 0.45 sn'de 0.55 → 1.12 → 1.0 (overshoot)
    let scale = 1;
    if (d >= 0 && d < 0.6) {
      const e = k.clamp(d / 0.45, 0, 1);
      scale = 0.55 + 0.57 * (1 - Math.pow(1 - e, 3)) + 0.12 * Math.sin(e * Math.PI) * (1 - e);
      if (d > 0.45) scale = 1.12 - 0.12 * ((d - 0.45) / 0.15);
    } else {
      // boşta hafif nefes
      scale = 1 + 0.02 * Math.sin(t * 2.2);
    }
    ctx.translate(0, Math.sin(t * 2.2) * 2);
    ctx.scale(scale, scale);

    // patlama ışınları: 0.15–0.8 sn arası dışa fırlar
    if (d >= 0.1 && d < 0.85) {
      const pr = k.prog(d, 0.1, 0.8);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * k.TAU + 0.26;
        const len = 96 + pr * 62 + k.hash(i * 7 + 3) * 18;
        const wdt = 5 + (1 - pr) * 3;
        ctx.strokeStyle = k.rgba(p.color, 0.9 * (1 - pr));
        ctx.lineWidth = wdt;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 78, Math.sin(a) * 78);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.stroke();
      }
      // kıvılcımlar
      for (let i = 0; i < 16; i++) {
        const h1 = k.hash(i * 11 + 101), h2 = k.hash(i * 19 + 113), h3 = k.hash(i * 29 + 127);
        const dd = Math.max(d - 0.1 - h3 * 0.15, 0);
        const a = h1 * k.TAU;
        const r = 70 + dd * 260 * (0.5 + h2);
        const fade = 1 - k.prog(dd, 0.1, 0.55);
        if (fade <= 0) continue;
        ctx.fillStyle = k.rgba(p.color, 0.95 * fade);
        ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 3 + h2 * 4, 0, k.TAU); ctx.fill();
      }
      if (d < 0.2) {
        const f = 1 - d / 0.2;
        k.glow(0, 0, 120 * f, p.color, 0.5 * f);
      }
    }

    // yıldız rozet (12 köşe)
    const star = (rOut, rIn, nPts) => {
      ctx.beginPath();
      for (let i = 0; i < nPts * 2; i++) {
        const r = i % 2 === 0 ? rOut : rIn;
        const a = (i / (nPts * 2)) * k.TAU - Math.PI / 2;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };
    ctx.fillStyle = line;
    star(96 + LW / 2, 78 + LW / 2, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    star(96, 78, 12); ctx.fill();
    // premium parlama: sol üst
    const shimmer = 0.09 + 0.03 * Math.sin(t * 2.1);
    ctx.fillStyle = 'rgba(255,255,255,' + shimmer.toFixed(3) + ')';
    ctx.beginPath(); ctx.ellipse(-34, -44, 26, 14, -0.5, 0, k.TAU); ctx.fill();
    // iç daire
    ctx.fillStyle = k.rgba('bg');
    ctx.beginPath(); ctx.arc(0, 0, 58, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 58, 0, k.TAU); ctx.stroke();

    // puan metni
    ctx.font = `800 44px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba('ink');
    ctx.fillText(txt, 0, 2);
    ctx.restore();
  },
};
