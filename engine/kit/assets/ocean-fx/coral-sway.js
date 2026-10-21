// ocean-fx/coral-sway — akıntıyla sağa-sola sallanan dallı mercan
// (sway, ~3.2 sn periyot); swell anında (0.9 sn) akıntı güçlenip mercan
// iyice eğilir ve polipler açılır.
// NOT: canvas y-aşağıdır; (0,0) mercanın tabanıdır.
export default {
  name: 'coral-sway', category: 'ocean-fx',
  desc: 'Akıntıyla sallanan dallı mercan, swell anında eğilip polipleri açılır',
  tags: ['mercan', 'sallanma', 'akıntı', 'polipler', 'denizaltı', 'coral', 'sway', 'current', 'polyps', 'reef'],
  box: [-110, -170, 110, 15],
  bleed: 25,
  anchor: 'mercanın tabanı (0,0)',
  points: { base: [0, 0], tip: [0, -160] },
  params: {
    swell: { type: 'time', default: null, desc: 'akıntı dalgası anı (0.9 sn, mercan eğilir + polipler açılır)' },
    color: { type: 'color', default: 'red', desc: 'mercan rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // Akıntı: idle salınım + swell olayı
    const idle = Math.sin(t * k.TAU / 3.2);
    const wd = p.swell == null ? -1 : t - p.swell;
    let gust = 0, polyps = 0;
    if (wd >= 0 && wd < 0.9) {
      const pp = wd / 0.9;
      gust = Math.sin(pp * Math.PI);   // 0→1→0 eğilme
      polyps = Math.sin(pp * Math.PI); // polipler açılır
    }
    const bend = idle * 10 + gust * 26; // tepe yatay kayması

    // Taban kayası
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(-48, -8, 96, 24, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(-48, -8, 96, 24, 12); ctx.stroke();

    // Dallar: kalın çizgiler, tepeye doğru eğilir
    const branches = [
      { x0: 0, y0: 0, x1: -8, y1: -150, w: 20, lean: -1 },
      { x0: -14, y0: -60, x1: -52, y1: -120, w: 14, lean: -1 },
      { x0: 12, y0: -80, x1: 44, y1: -140, w: 14, lean: 1 },
      { x0: -4, y0: -110, x1: -30, y1: -160, w: 10, lean: -0.5 },
      { x0: 6, y0: -105, x1: 30, y1: -158, w: 10, lean: 0.5 },
    ];
    for (const b of branches) {
      const tipX = b.x1 + bend * b.lean;
      ctx.strokeStyle = k.rgba(acc, 0.95); ctx.lineWidth = b.w;
      ctx.beginPath(); ctx.moveTo(b.x0, b.y0);
      ctx.quadraticCurveTo(b.x0 + bend * b.lean * 0.4, (b.y0 + b.y1) / 2, tipX, b.y1);
      ctx.stroke();
      // polip topları: dal uçlarında, swell'de açılır
      const pr = 5 + polyps * 4;
      for (let i = 0; i < 3; i++) {
        const f = 0.5 + i * 0.25;
        const px = b.x0 + (tipX - b.x0) * f + Math.sin(t * 2 + i * 2.1) * 3;
        const py = b.y0 + (b.y1 - b.y0) * f;
        ctx.fillStyle = k.rgba(acc, 0.8);
        ctx.beginPath(); ctx.arc(px, py, pr * (0.7 + i * 0.15), 0, k.TAU); ctx.fill();
      }
    }
    // ana dalda sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -60, 14, 34, -0.25, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
