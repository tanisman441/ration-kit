// construction-fx/weld-flash — kaynak torcu: uçta döngülü titrek kıvılcım; at anında parlak kaynak çakması.
// NOT: canvas y-aşağıdır; (0,0) torç gövde merkezi.
export default {
  name: 'weld-flash', category: 'construction-fx',
  desc: 'Welding torch with a flickering tip spark and a bright weld strike flash when at hits',
  tags: ['kaynak', 'torç', 'kaynak makinesi', 'çakma', 'inşaat', 'welding', 'torch', 'flash', 'spark'],
  box: [-110, -90, 120, 110],
  bleed: 80,
  anchor: 'torç gövde merkezi (0,0)',
  points: { tip: [18, 0], grip: [-73, 40] },
  params: {
    at: { type: 'time', default: null, desc: 'kaynak vuruşu anı (parlak çakma + kıvılcımlar + duman)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ol = k.rgba('bg', 0.55), OW = 6;

    function rbody(x, y, w, h, r, fill) {
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = fill;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(x + w * 0.3, y + h * 0.28, w * 0.22, h * 0.16, -0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = ol; ctx.lineWidth = OW;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.stroke();
    }

    // 1) torç gövdesi
    rbody(-110, -18, 80, 36, 12, k.rgba('dim', 1));
    // 2) gövde şeridi (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-58, -18); ctx.lineTo(-58, 18); ctx.stroke();
    // 3) kabza
    rbody(-88, 18, 30, 44, 10, k.rgba('panel2', 1));
    // 4) nozul
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-30 + 6, -9 + 6, 48, 18, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-30, -9, 48, 18, 6); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-30, -9, 48, 18, 6); ctx.stroke();
    // 5) elektrot ucu
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(30, 0); ctx.stroke();

    // 6) döngülü titrek kıvılcım — uçta hep yanar
    const fl = 0.22 + 0.13 * k.noise1(t * 8);
    k.glow(30, 0, 22, 'yellow', fl);
    ctx.fillStyle = k.rgba('yellow', 0.5 + 0.3 * k.noise1(t * 11));
    ctx.beginPath(); ctx.arc(30, 0, 4.5, 0, k.TAU); ctx.fill();

    // 7) kaynak vuruşu — at anı (0–1.0 sn): parlak çakma + kıvılcım yağmuru + duman
    if (d >= 0 && d < 1.0) {
      const f = 1 - d / 1.0;
      k.glow(30, 0, 95 * f + 20, 'yellow', 0.5 * f);
      k.glow(30, 0, 45 * f + 8, 'bg', 0.6 * f);
      ctx.fillStyle = k.rgba('yellow', 0.9 * f);
      ctx.beginPath(); ctx.arc(30, 0, 12 + 14 * f, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 12; i++) {
        const a = (k.hash(i * 5 + 1) - 0.5) * 2.6;
        const sp = 50 + k.hash(i * 7 + 3) * 110;
        const dd = Math.min(d / 0.6, 1);
        const dist = sp * k.E.outCubic(dd);
        const x = 30 + Math.cos(a) * dist, y = k.noise1(i * 3 + t * 7) * 4 + Math.sin(a) * dist * 0.9 + dist * dist * 0.0018;
        ctx.strokeStyle = i % 3 === 0 ? k.rgba('red', 0.9 * (1 - dd)) : k.rgba('yellow', 0.9 * (1 - dd));
        ctx.lineWidth = 3.2;
        const len = (8 + k.hash(i * 9 + 5) * 10) * (1 - dd) + 2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(a) * len, y - Math.sin(a) * len); ctx.stroke();
      }
      for (let i = 0; i < 4; i++) {
        const g = k.prog(d, 0.15 + i * 0.08, 1.0);
        if (g <= 0) continue;
        ctx.fillStyle = k.rgba('dim', 0.4 * (1 - g));
        ctx.beginPath(); ctx.arc(26 + (k.hash(i * 13 + 8) - 0.5) * 40, -6 - g * 75, 8 + g * 18, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
