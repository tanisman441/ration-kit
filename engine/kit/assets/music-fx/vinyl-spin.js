// music-fx/vinyl-spin — oluklu vinil plak + iki tonlu etiket; t'ye bağlı lineer dönüş.
// drop anında iğne kolu iner, sıçrar + çizgi efekti (0.8 sn); boşta plak sürekli döner.
export default {
  name: 'vinyl-spin', category: 'music-fx',
  desc: 'Spinning grooved vinyl record with a two-tone label; the needle drops with a bounce',
  tags: ['plak', 'vinil', 'vinyl', 'record', 'plak çalar', 'turntable', 'dönmek', 'spin', 'iğne'],
  box: [-150, -150, 150, 150],
  bleed: 35,
  anchor: '(0,0) plak merkezi',
  points: { centre: [0, 0], edge: [128, 0], arm: [128, -128] },
  params: {
    drop: { type: 'time', default: null, desc: 'iğne düşürme anı: kol iner, sıçrama + çizgi efekti (0.8 sn)' },
    speed: { type: 'number', default: 2.2, desc: 'dönüş hızı rad/sn' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.drop == null ? -1 : t - p.drop;

    // 1) gölge + plak gövdesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(6, 6, 122, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(0, 0, 120, 0, k.TAU); ctx.fill(); ctx.stroke();

    // 2) oluklar (sabit, simetrik — dönüşü göstermez)
    ctx.strokeStyle = k.rgba('ink', 0.32); ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(0, 0, 62 + i * 12, 0, k.TAU); ctx.stroke();
    }

    // 3) dönen grup: etiket + işaret noktası (dönüş buradan okunur)
    const ang = t * p.speed;
    ctx.save(); ctx.rotate(ang);
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, 44, 0, k.TAU); ctx.fill(); ctx.stroke();
    // iki tonlu yarım: asimetri dönüşü belli eder
    ctx.fillStyle = k.rgba('dim', 0.55);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 44, -0.5, Math.PI - 0.5); ctx.closePath(); ctx.fill();
    // işaret noktası
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(0, -30, 7, 0, k.TAU); ctx.fill();
    ctx.restore();
    // mil deliği
    ctx.fillStyle = k.rgba('bg', 1);
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, k.TAU); ctx.fill();

    // 4) premium parlama (dönmez — ışık sabit yönden)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-52, -62, 46, 24, -0.6, 0, k.TAU); ctx.fill();

    // 5) ton kolu: pivot sağ üstte, iğne plağa iner
    const pivot = [128, -128];
    const restTip = [104, -88], playTip = [70, -36];
    let tip;
    if (d < 0 && p.drop != null) {
      // olay öncesi: kol havada, son 0.3 sn'de yaklaşır
      const g = k.prog(d + 0.3, 0, 0.3);
      tip = [restTip[0] + (playTip[0] - restTip[0]) * g, restTip[1] + (playTip[1] - restTip[1]) * g];
    } else if (d >= 0 && d <= 0.8) {
      const g = k.E.outBack(k.prog(d, 0, 0.8));
      tip = [restTip[0] + (playTip[0] - restTip[0]) * g, restTip[1] + (playTip[1] - restTip[1]) * g];
    } else {
      tip = playTip;
    }
    // kol gövdesi (dış hatlı çubuk)
    ctx.lineCap = 'round';
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(pivot[0], pivot[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(pivot[0], pivot[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
    // pivot tabanı
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(pivot[0], pivot[1], 16, 0, k.TAU); ctx.fill(); ctx.stroke();
    // iğne ucu
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(tip[0] - 4, tip[1] + 15); ctx.stroke();

    // 6) drop şoku: temas anında kısa çizgi efekti (0.35 sn)
    if (d >= 0 && d <= 0.35) {
      const g = k.prog(d, 0, 0.35);
      ctx.strokeStyle = k.rgba('ink', 0.75 * (1 - g));
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        const a = -0.5 + (i / 5) * 1.0;
        const r0 = 12 + 10 * g, r1 = r0 + 20 * (1 - g);
        ctx.beginPath();
        ctx.moveTo(tip[0] + Math.cos(a) * r0, tip[1] + Math.sin(a) * r0 + 12);
        ctx.lineTo(tip[0] + Math.cos(a) * r1, tip[1] + Math.sin(a) * r1 + 12);
        ctx.stroke();
      }
      k.glow(tip[0], tip[1] + 8, 26, p.color, 0.4 * (1 - g));
    }
    ctx.restore();
  },
};
