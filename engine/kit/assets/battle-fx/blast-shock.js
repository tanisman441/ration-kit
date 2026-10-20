// battle-fx/blast-shock — şok dalgası: patlama merkezinden genişleyen çift halka + toz bulutu.
// NOT: canvas y-aşağıdır; (0,0) patlama merkezidir.
export default {
  name: 'blast-shock',
  category: 'battle-fx',
  desc: 'Şok dalgası: patlama merkezinden genişleyen çift halka, sıcak çekirdek ve savrulan toz bulutu',
  tags: ['şok', 'dalga', 'patlama', 'bomba', 'halka', 'shock', 'blast', 'explosion', 'wave'],
  box: [-180, -180, 180, 180],
  bleed: 60,
  anchor: 'patlama merkezi (0,0)',
  points: { center: [0, 0], rim: [150, 0] },
  params: {
    blast: { type: 'time', default: null, desc: 'patlama anı (0.7 sn: çekirdek + çift halka + toz)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: dalga büyüklüğü' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.blast == null ? -1 : t - p.blast;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- idle: merkezde sıcak çekirdek nabzı — patlama öncesi ---
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.8);
      k.glow(0, 0, (26 + 10 * pulse) * S, p.color, 0.25 + 0.15 * pulse);
      ctx.fillStyle = k.rgba(p.color, 0.5 + 0.25 * pulse);
      ctx.beginPath();
      ctx.arc(0, 0, (10 + 3 * pulse) * S, 0, k.TAU);
      ctx.fill();
      ctx.strokeStyle = k.rgba(p.color, 0.3 + 0.2 * pulse);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, (20 + 8 * pulse) * S, 0, k.TAU);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (d > 1.1) { ctx.restore(); return; }

    // --- sıcak çekirdek (0.2 sn): sarı → kırmızı küre ---
    if (d < 0.2) {
      const f = 1 - d / 0.2;
      k.glow(0, 0, 95 * S * f, 'yellow', 0.5 * f);
      ctx.fillStyle = k.rgba('yellow', 0.9 * f);
      ctx.beginPath();
      ctx.arc(0, 0, (52 - d * 140) * S, 0, k.TAU);
      ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 0.8 * f);
      ctx.beginPath();
      ctx.arc(0, 0, (34 - d * 90) * S, 0, k.TAU);
      ctx.fill();
    }

    // --- şok halkaları: 2 kademeli genişleyen halka (0.1–0.7 sn) ---
    for (let r = 0; r < 2; r++) {
      const rg = k.prog(d - r * 0.12, 0.08, 0.72);
      if (rg <= 0 || rg >= 1) continue;
      const rad = (18 + 150 * k.E.outExpo(rg)) * S;
      ctx.strokeStyle = k.rgba(r === 0 ? 'yellow' : p.color, (r === 0 ? 0.7 : 0.5) * (1 - rg));
      ctx.lineWidth = ((r === 0 ? 9 : 6) * (1 - rg * 0.7) + 1.5) * S;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, k.TAU);
      ctx.stroke();
    }

    // --- ateş dilleri: 8 alev dili, 0.5 sn ---
    const fg = k.prog(d, 0.02, 0.5);
    for (let i = 0; i < 8; i++) {
      const h1 = k.hash(i * 13 + 81), h2 = k.hash(i * 17 + 83);
      const a = h1 * k.TAU;
      const e = k.E.outCubic(fg);
      const dist = (26 + h2 * 92) * S * e;
      const x = Math.cos(a) * dist + k.noise1(i * 3 + d * 8) * 6;
      const y = Math.sin(a) * dist + k.noise1(i * 7 + d * 8) * 6;
      const fl = (16 - fg * 8) * S * (0.7 + h2 * 0.6);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = k.rgba(h2 > 0.5 ? 'yellow' : p.color, 0.85 * (1 - fg));
      ctx.beginPath();
      ctx.moveTo(0, -fl);
      ctx.quadraticCurveTo(fl * 0.55, 0, 0, fl * 0.8);
      ctx.quadraticCurveTo(-fl * 0.55, 0, 0, -fl);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // --- toz bulutu: 12 dim zerre, 0.25–1.0 sn ---
    const dg = k.prog(d, 0.25, 1.0);
    for (let i = 0; i < 12; i++) {
      const h1 = k.hash(i * 19 + 87), h2 = k.hash(i * 23 + 89);
      const a = h2 * k.TAU;
      const dist = (40 + h1 * 115) * S * k.E.outCubic(dg);
      ctx.fillStyle = k.rgba('dim', 0.45 * (1 - dg));
      ctx.beginPath();
      ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, (3.5 + h1 * 6) * S, 0, k.TAU);
      ctx.fill();
    }
    ctx.restore();
  },
};
