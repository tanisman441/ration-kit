// health-fx-2/surgery-light-flicker — ameliyat lambası; canlı idle: hafif titreme + ışık konisi nabzı.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'surgery-light-flicker', category: 'health-fx-2',
  desc: 'Tavan kollu ameliyat lambası; ampuller hafif titrer, ışık konisi nefes alır',
  tags: ['ameliyat', 'cerrahi', 'lamba', 'ışık', 'ameliyathane', 'surgery', 'light', 'operation', 'hospital', 'lamp', 'medical'],
  box: [-100, -100, 100, 100],
  bleed: 18,
  anchor: 'lamba başlığı',
  points: { head: [0, -28], beam: [0, 92] },
  params: {
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // parlaklık: noise tabanlı titreme + ara sıra düşüş (canlı idle)
    const n = k.noise1(t * 5.5);
    let b = 0.82 + 0.18 * n;
    if (n < -0.6) b *= 0.72;

    // tavan kolu
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(0, -100); ctx.lineTo(0, -52); ctx.stroke();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(0, -52, 10, 0, k.TAU); ctx.fill();

    // başlık (hafif sallanır)
    ctx.save();
    ctx.translate(0, -28); ctx.rotate(0.03 * Math.sin(t * 0.6));

    // ışık konisi (başlıkla birlikte eğilir)
    ctx.fillStyle = k.rgba(p.color, 0.055 * b);
    ctx.beginPath();
    ctx.moveTo(-46, 26); ctx.lineTo(46, 26); ctx.lineTo(78, 128); ctx.lineTo(-78, 128);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.05 * b);
    ctx.beginPath();
    ctx.moveTo(-24, 26); ctx.lineTo(24, 26); ctx.lineTo(44, 128); ctx.lineTo(-44, 128);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba(p.color, 0.20 * b); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-46, 26); ctx.lineTo(-78, 128); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(46, 26); ctx.lineTo(78, 128); ctx.stroke();

    // kubbe + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-62 + 6, -26 + 6, 124, 52, 26); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    k.rrect(-62, -26, 124, 52, 26); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, -12, 30, 10, -0.4, 0, k.TAU); ctx.fill();

    // ampuller (titreyen parlaklık)
    for (let i = 0; i < 5; i++) {
      const x = -40 + i * 20;
      k.glow(x, 8, 22, p.color, 0.35 * b);
      ctx.fillStyle = k.rgba(p.color, 0.35 + 0.65 * b);
      ctx.beginPath(); ctx.arc(x, 8, 11, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, 8, 11, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.85 * b);
      ctx.beginPath(); ctx.arc(x - 3, 5, 3.5, 0, k.TAU); ctx.fill();
    }
    // güç LED'i
    const ledA = 0.4 + 0.6 * Math.pow(Math.max(0, Math.sin(t * 2.4)), 2);
    ctx.fillStyle = k.rgba('dim', ledA);
    ctx.beginPath(); ctx.arc(52, -16, 4, 0, k.TAU); ctx.fill();

    ctx.restore();
    ctx.restore();
  },
};
