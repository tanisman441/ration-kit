// ui-feedback/error-shake — at anında yuvarlak karede X 0.4 sn sarsılır; idle'da hafif titreme.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'error-shake',
  category: 'ui-feedback',
  desc: 'Hata bildirimi: at anında yuvarlak kare X ile sarsılır',
  tags: ['hata', 'yanlış', 'x', 'sarsıntı', 'başarısız', 'error', 'fail', 'shake', 'wrong', 'ui'],
  box: [-80, -80, 80, 80],
  bleed: 28,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'hata anı: 0.4 sn yatay sarsıntı' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = 104, R = 26;

    // sarsıntı: 0.4 sn, genliği sönen sinüs (3 yarım dalga)
    let shakeX = 0, rot = 0;
    if (d >= 0 && d < 0.4) {
      const e = d / 0.4;
      shakeX = 16 * Math.sin(e * 3 * Math.PI) * (1 - e);
      rot = 0.06 * Math.sin(e * 3 * Math.PI) * (1 - e);
    }
    // idle: hafif titreme (noise1, ±1.5 birim)
    const idleX = k.noise1(t * 3.1) * 1.5;
    const idleY = k.noise1(t * 2.3 + 10) * 1.2;

    ctx.save();
    ctx.translate(shakeX + idleX, idleY);
    ctx.rotate(rot);

    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-S / 2 + 6, -S / 2 + 6, S, S, R); ctx.fill();
    // gövde
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-S / 2, -S / 2, S, S, R); ctx.fill();
    // dış hat
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-S / 2, -S / 2, S, S, R); ctx.stroke();
    // sol üst parlama (premium, alfa 0.11)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(-S / 2 + 30, -S / 2 + 15, 34, 12, -0.4, 0, k.TAU);
    ctx.fill();
    // X işareti (iç detay: ink, alfa 0.92)
    ctx.strokeStyle = k.rgba('ink', 0.92);
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, -20); ctx.lineTo(20, 20);
    ctx.moveTo(20, -20); ctx.lineTo(-20, 20);
    ctx.stroke();

    ctx.restore();
  },
};
