// office-fx/coffee-spill — at anında fincan devrilir: 0.5 sn eğilme, kahve
// fışkırması (balistik damlalar ~0.9 sn), sonra damlama akışı ve büyüyen gölet.
// idle'da fincandan buhar kıvrılır. canvas y-aşağı; (0,0) fincan tabanı.
export default {
  name: 'coffee-spill', category: 'office-fx',
  desc: 'at anında fincan devrilir, kahve fışkırır, damlar ve gölet büyür',
  tags: ['kahve', 'fincan', 'dökülme', 'leke', 'coffee', 'spill', 'cup', 'mug', 'ofis', 'office', 'kaza', 'accident'],
  box: [-150, -130, 150, 110],
  bleed: 40,
  anchor: 'fincan tabanı',
  points: { pour: [-46, -36], puddle: [-72, 66] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'fincan rengi' },
    at: { type: 'time', default: null, desc: 'devrilme anı: 0.5 sn eğilme + kahve fışkırması' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const LW = 9;

    // masa
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-150, 62, 300, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel', 1);
    ctx.beginPath(); k.rrect(-150, 58, 300, 28, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-90, 66, 40, 6, 0, 0, k.TAU); ctx.fill();

    // devrilme açısı (taban etrafında)
    let tilt = 0;
    if (d >= 0) tilt = -0.42 * k.E.outBack(k.prog(d, 0, 0.5), 1.4);

    ctx.save();
    ctx.translate(0, 58); ctx.rotate(tilt); ctx.translate(0, -58);

    // gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.moveTo(-40, 58); ctx.lineTo(-48, -38); ctx.lineTo(48, -38); ctx.lineTo(40, 58); ctx.closePath(); ctx.fill();
    // fincan gövdesi (yamuk)
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(-43, 60); ctx.lineTo(-51, -40); ctx.lineTo(51, -40); ctx.lineTo(43, 60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath();
    ctx.moveTo(-38, 56); ctx.lineTo(-46, -36); ctx.lineTo(46, -36); ctx.lineTo(38, 56); ctx.closePath(); ctx.fill();
    // parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-26, -12, 10, 24, 0.15, 0, k.TAU); ctx.fill();
    // kulak
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 13; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(52, 8, 17, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(52, 8, 17, -1.2, 1.2); ctx.stroke();
    // kahve yüzeyi
    ctx.fillStyle = k.rgba('yellow', 0.95);
    ctx.beginPath(); ctx.ellipse(0, -34, 40, 7, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // buhar (sadece devrilmeden önce)
    if (d < 0.25) {
      ctx.strokeStyle = k.rgba('dim', 0.45); ctx.lineWidth = 5; ctx.lineCap = 'round';
      for (let s = 0; s < 2; s++) {
        const bx = -14 + s * 28;
        ctx.beginPath();
        for (let yy = -48; yy >= -100; yy -= 8) {
          const xx = bx + 7 * Math.sin(t * 2 + yy * 0.06 + s * 2);
          if (yy === -48) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      }
    }

    // fışkırma: balistik damlalar (dökülme ağzı ~(-40,-31))
    if (d >= 0.12 && d < 2.2) {
      ctx.fillStyle = k.rgba('yellow', 0.95);
      for (let i = 0; i < 12; i++) {
        const ti = d - 0.12 - i * 0.055;
        if (ti < 0 || ti > 1.1) continue;
        const vx = -(8 + 20 * k.hash(i * 3 + 1));
        const vy = 26 + 14 * k.hash(i * 5 + 2);
        const px = -40 + vx * ti, py = -31 + vy * ti + 260 * ti * ti;
        if (py > 56) {   // masaya çarptı: sıçrama noktası
          ctx.beginPath(); ctx.ellipse(px, 60, 6 + 4 * k.hash(i), 3, 0, 0, k.TAU); ctx.fill();
          continue;
        }
        ctx.beginPath(); ctx.arc(px, py, 4 + 3 * k.hash(i * 7 + 3), 0, k.TAU); ctx.fill();
      }
    }

    // gölet: büyür ve kalır
    if (d >= 0.5) {
      const pr = 10 + 52 * k.prog(d, 0.5, 2.4);
      ctx.fillStyle = k.rgba('yellow', 0.9);
      ctx.beginPath(); ctx.ellipse(-72, 64, pr, pr * 0.28, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-72 - pr * 0.3, 64 - pr * 0.1, pr * 0.4, pr * 0.1, 0, 0, k.TAU); ctx.fill();
    }

    // damlama: devrilmeden sonra ağızdan ince akış + periyodik damla
    if (d >= 1.2) {
      ctx.strokeStyle = k.rgba('yellow', 0.8); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-40, -28);
      ctx.quadraticCurveTo(-44 + 3 * Math.sin(t * 5), 16, -52, 58);
      ctx.stroke();
      const cyc = (t * 1.3) % 1;
      ctx.fillStyle = k.rgba('yellow', 0.9);
      ctx.beginPath(); ctx.arc(-52, -20 + cyc * 76, 4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
