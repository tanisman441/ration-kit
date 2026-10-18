// school/pencil — yazı yazan kurşun kalem; write anında ucu yolu takip edip iz bırakır
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) kalem merkezidir.
export default {
  name: 'pencil', category: 'school',
  desc: 'Silgili klasik kurşun kalem; write anında ucu kıvrımlı bir çizgi çizer',
  tags: ['kalem', 'kurşun kalem', 'pencil', 'yazı', 'write', 'çizim', 'drawing'],
  box: [-140, -95, 205, 95],
  bleed: 25,
  anchor: 'kalem merkezi (0,0)',
  points: { tip: [78, -38] },
  params: {
    write: { type: 'time', default: null, desc: 'yazma anı (uç kıvrımlı çizgiyi 1 sn\'de çizer)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.write == null ? -1 : t - p.write;
    const rot = -0.45; // uç sol alta bakar
    const tipLocalX = 86; // döndürülmemiş çerçevede uç
    const tip0 = [tipLocalX * Math.cos(rot), tipLocalX * Math.sin(rot)];

    // yazma yolu: uç dinlenme konumundan sağa kıvrımlı gider
    const path = (q) => [
      tip0[0] + q * 120,
      tip0[1] + Math.sin(q * 2.5 * Math.PI) * 20 + q * 26,
    ];

    let ox = 0, oy = 0, wobA = 0, wobY = 0;
    if (d >= 0 && d < 1.0) {
      const q = Math.min(d / 1.0, 1);
      const P = path(q);
      ox = P[0] - tip0[0]; oy = P[1] - tip0[1];
      wobA = Math.sin(d * 40) * 0.045; // yazarken hafif titreme
      wobY = Math.sin(d * 40) * 2;
    } else {
      oy = Math.sin(t * 1.8) * 4; // havada süzülme (idle)
      wobA = Math.sin(t * 1.8) * 0.02;
    }

    // bırakılan iz (kalemden önce çizilir)
    if (d >= 0) {
      const q = Math.min(d / 1.0, 1);
      ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) {
        const s = (i / 30) * q;
        const P = path(s);
        if (i === 0) ctx.moveTo(P[0], P[1]); else ctx.lineTo(P[0], P[1]);
      }
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(ox, oy + wobY);
    ctx.rotate(rot + wobA);

    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-42 - LW / 2, -15 - LW / 2, 142 + LW, 30 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-42, -15, 142, 30, 10); ctx.fill();
    // gövde gölgesi (alt %12) + parlama (sol üst)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-42, 3, 142, 12, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-38, -13, 134, 9, 5); ctx.fill();

    // metal yüksük + silgi
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-70, -16, 30, 32, 7); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); k.rrect(-70, -16, 30, 32, 7); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-102, -13, 34, 26, 10); ctx.fill();
    ctx.strokeStyle = line;
    ctx.beginPath(); k.rrect(-102, -13, 34, 26, 10); ctx.stroke();

    // ahşap koni + grafit uç
    const wood = 'rgba(236,206,150,0.97)'; // ahşap: iki temada da açık renk
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(100 - LW, -15 - LW / 2); ctx.lineTo(146, 0); ctx.lineTo(100 - LW, 15 + LW / 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = wood;
    ctx.beginPath();
    ctx.moveTo(100, -13); ctx.lineTo(138, 0); ctx.lineTo(100, 13);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath();
    ctx.moveTo(128, -6); ctx.lineTo(146, 0); ctx.lineTo(128, 6);
    ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};
