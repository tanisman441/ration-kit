// chat-fx/typing-dots — "yazıyor..." balonu: üç nokta sırayla zıplayarak belirip söner (loop). Contract: engine/kit/ASSETS.md
export default {
  name: 'typing-dots', category: 'chat-fx',
  desc: 'Yazıyor göstergesi: sohbet balonunda üç nokta 1.5 sn döngüyle sırayla zıplar, at anında balon belirir',
  tags: ['yazıyor', 'typing', 'nokta', 'mesaj', 'sohbet', 'chat', 'dots', 'indicator', 'bubble', 'messaging'],
  box: [-150, -90, 150, 90],
  bleed: 20,
  anchor: 'balon merkezi (0,0)',
  points: { center: [0, 0], tail: [-80, 42] },
  params: {
    at: { type: 'time', default: null, desc: 'balonun belirme anı' },
    color: { type: 'color', default: 'panel2' },
    period: { type: 'number', default: 1.5, desc: 'nokta döngüsü süresi (sn)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0) return;
    const per = Math.max(0.6, p.period ?? 1.5);
    const breathe = 1 + 0.02 * Math.sin(t * 2.2);            // idle: hafif nefes

    // belirme: 0.3 sn ölçeklenme
    const pop = k.E.outBack(k.clamp(d / 0.3, 0, 1));
    ctx.save();
    ctx.scale(pop * breathe, pop * breathe);

    const W = 190, H = 84, R = 30;
    const shade = (n, f) => { const c = k.col(n); return `rgb(${c[0] * f | 0},${c[1] * f | 0},${c[2] * f | 0})`; };

    // gölge (sağ alt %12 koyultma) + balon + kuyruk
    ctx.fillStyle = shade(p.color, 0.88);
    k.rrect(-W / 2 + 7, -H / 2 + 7, W, H, R); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();                                          // kuyruk (sol alt)
    ctx.moveTo(-W / 2 + 34, H / 2 - 6); ctx.lineTo(-W / 2 + 8, H / 2 + 30); ctx.lineTo(-W / 2 + 58, H / 2 - 4); ctx.closePath(); ctx.fill();
    k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    ctx.lineWidth = Math.max(4, W * 0.03);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    k.rrect(-W / 2, -H / 2, W, H, R); ctx.stroke();
    ctx.beginPath();                                          // kuyruk dış hat
    ctx.moveTo(-W / 2 + 34, H / 2 - 6); ctx.lineTo(-W / 2 + 8, H / 2 + 30); ctx.lineTo(-W / 2 + 58, H / 2 - 4); ctx.closePath();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3; ctx.stroke();

    // premium parlama: sol üst beyaz elips, alfa 0.11
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-W / 2 + 44, -H / 2 + 20, 40, 14, -0.4, 0, k.TAU); ctx.fill();

    // üç nokta: sırayla zıplar
    for (let i = 0; i < 3; i++) {
      const ph = (t / per) * k.TAU - i * (k.TAU / 3);
      const s = (Math.sin(ph) + 1) / 2;                       // 0..1
      const dy = -14 * s * s;
      const al = 0.35 + 0.65 * s;
      const x = (i - 1) * 46;
      ctx.globalAlpha = al;
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); ctx.arc(x, dy, 12, 0, k.TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },
};
