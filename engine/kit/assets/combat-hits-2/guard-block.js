// combat-hits-2/guard-block — darbe anında savunan yuvarlak kalkan: geri itme + temas noktasında halka ve kıvılcımlar.
// NOT: canvas y-aşağıdır; (0,0) kalkanın merkezi; temas noktası sağ kenardadır.
export default {
  name: 'guard-block', category: 'combat-hits-2',
  desc: 'Blok kalkanı: darbe anında geri itme, temas noktasında genişleyen halka ve kıvılcım patlaması',
  tags: ['kalkan', 'blok', 'savunma', 'darbe', 'temas', 'kıvılcım', 'guard', 'block', 'shield', 'impact', 'defense', 'sparks'],
  box: [-120, -120, 120, 120],
  bleed: 90,
  anchor: 'kalkanın merkezi (0,0)',
  points: { contact: [76, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'darbe anı (geri itme + halka + kıvılcım, ~0.8 sn)' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d <= 1.0;

    // darbe geri itmesi — hızlı çekilme, yavaş toparlanma (0.5 sn)
    const gg = active ? k.prog(d, 0, 0.55) : 1;
    const pushX = active ? -17 * (1 - k.E.outCubic(gg)) : 0;

    // idle: hafif süzülme (±2 birim)
    const fy = k.noise1(t * 1.4) * 2, fr = k.noise1(t * 1.1 + 4) * 0.02;

    function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); }

    ctx.save();
    ctx.translate(pushX, fy);
    ctx.rotate(fr);

    // 1) sağ alt gölge — %12 koyultma, 6 birim offset
    ctx.fillStyle = k.rgba('ink', 0.12);
    circle(6, 6, 80); ctx.fill();

    // 2) kalkan gövdesi — daire
    ctx.fillStyle = k.rgba(p.color, 1);
    circle(0, 0, 80); ctx.fill();
    // göbek (umbra)
    ctx.fillStyle = k.rgba('dim', 1);
    circle(0, 0, 34); ctx.fill();
    // sol üst parlama — beyaz alfa 0.10, kontursuz
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-30, -32, 40, 24, -0.5, 0, k.TAU); ctx.fill();
    // dış hat — bg alfa 0.55
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5.5;
    circle(0, 0, 80); ctx.stroke();
    ctx.lineWidth = 4;
    circle(0, 0, 34); ctx.stroke();
    // jant çizgileri — 4 kısa iç çizgi (ink alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const a = i * k.TAU / 4 + Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 44, Math.sin(a) * 44);
      ctx.lineTo(Math.cos(a) * 66, Math.sin(a) * 66);
      ctx.stroke();
    }

    // 3) darbe olayı — temas noktası (76, 0)
    if (active) {
      const cx = 76, cy = 0;
      // flaş — kısa ve parlak (0.14 sn)
      if (d < 0.14) {
        const f = 1 - d / 0.14;
        k.glow(cx, cy, 85 * f, 'yellow', 0.45 * f);
        ctx.fillStyle = k.rgba('yellow', 0.9 * f);
        circle(cx, cy, 14 * f + 4); ctx.fill();
      }
      // darbe halkası — genişleyen (0.6 sn)
      if (d > 0.04) {
        const g = k.prog(d - 0.04, 0, 0.56);
        const rr = 18 + 105 * k.E.outExpo(g);
        ctx.strokeStyle = k.rgba('yellow', 0.6 * (1 - g));
        ctx.lineWidth = 7 * (1 - g * 0.65) + 1.5;
        circle(cx, cy, rr); ctx.stroke();
      }
      // kıvılcımlar — temas noktasından sağa savrulur (0.8 sn)
      for (let i = 0; i < 9; i++) {
        const h1 = k.hash(i * 7 + 11), h2 = k.hash(i * 13 + 37), h3 = k.hash(i * 29 + 61);
        const life = 0.35 + h2 * 0.45;
        if (d > life) continue;
        const lg = k.prog(d, 0, life);
        const ang = (h1 - 0.5) * 2.1;                 // sağa açılan yelpaze (y-aşağı: +y aşağı)
        const dist = (40 + h3 * 90) * k.E.outCubic(lg);
        const sx = cx + Math.cos(ang) * dist, sy = cy + Math.sin(ang) * dist + lg * lg * 26;
        const len = (1 - lg) * (10 + h2 * 12);
        ctx.strokeStyle = k.rgba('yellow', 0.85 * (1 - lg));
        ctx.lineWidth = 4 * (1 - lg) + 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - Math.cos(ang) * len, sy - Math.sin(ang) * len);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
