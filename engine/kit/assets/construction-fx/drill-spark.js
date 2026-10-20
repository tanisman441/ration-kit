// construction-fx/drill-spark — power drill with vibrating bit; spark burst at the bit contact point.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi.
export default {
  name: 'drill-spark', category: 'construction-fx',
  desc: 'Power drill with vibrating bit and a spark burst at the contact point when at hits',
  tags: ['matkap', 'şarjlı matkap', 'kıvılcım', 'delme', 'inşaat', 'drill', 'spark', 'boring', 'power tool'],
  box: [-150, -80, 190, 110],
  bleed: 70,
  anchor: 'gövde merkezi (0,0)',
  points: { tip: [118, 0], grip: [-96, 67] },
  params: {
    at: { type: 'time', default: null, desc: 'matkap ucunda kıvılcım patlaması anı' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ol = k.rgba('bg', 0.55), OW = 6;

    // gölge + gövde + dış hat çizen yardımcı (rrect gövdeler)
    function rbody(x, y, w, h, r, fill) {
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = fill;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
      // sol üst parlama — beyaz alfa 0.10
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(x + w * 0.3, y + h * 0.28, w * 0.22, h * 0.16, -0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = ol; ctx.lineWidth = OW;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.stroke();
    }

    // 1) gövde
    rbody(-150, -36, 148, 72, 18, k.rgba('dim', 1));
    // 2) havalandırma çizgileri (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath(); ctx.moveTo(-128, -8 + i * 12); ctx.lineTo(-66, -8 + i * 12); ctx.stroke();
    }
    // 3) kabza
    rbody(-116, 36, 40, 62, 10, k.rgba('panel2', 1));
    // 4) tetik
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-74 + 6, 34 + 6, 16, 26, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-74, 34, 16, 26, 6); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = OW - 1;
    ctx.beginPath(); k.rrect(-74, 34, 16, 26, 6); ctx.stroke();

    // 5-6) mandren + uç — boşta titreşim (idle vibration)
    const vib = k.noise1(t * 38) * 2.2;
    ctx.save(); ctx.translate(0, vib);
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-4 + 6, -16 + 6, 38, 32, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); k.rrect(-4, -16, 38, 32, 8); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(10, -7, 10, 5, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = OW;
    ctx.beginPath(); k.rrect(-4, -16, 38, 32, 8); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 1); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(34, 0); ctx.lineTo(118, 0); ctx.stroke();
    ctx.restore();

    // 7) kıvılcım patlaması — at anı (0.2–0.7 sn)
    if (d >= 0 && d < 0.7) {
      const f = 1 - d / 0.7;
      k.glow(118, 0, 70 * f + 12, 'yellow', 0.45 * f);
      ctx.fillStyle = k.rgba('yellow', 0.9 * f);
      ctx.beginPath(); ctx.arc(118, 0, 9 + 10 * f, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 10; i++) {
        const a = (k.hash(i * 7 + 2) - 0.35) * 1.7;
        const sp = 40 + k.hash(i * 11 + 5) * 72;
        const dist = sp * k.E.outCubic(Math.min(d / 0.45, 1));
        const x = 118 + Math.cos(a) * dist, y = k.noise1(i * 3 + t * 9) * 3 + Math.sin(a) * dist * 0.8 + dist * dist * 0.0022;
        const len = (10 + k.hash(i * 13 + 7) * 14) * f + 3;
        ctx.strokeStyle = k.rgba('yellow', 0.9 * f); ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x - Math.cos(a) * len, y - Math.sin(a) * len); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
