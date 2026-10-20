// fail-fx/red-x-stamp — kırmızı X mührü: at anında hızla basılır (büyüme + 0.1 sn
// sarsıntı), sonra durur. Vurgu rengi: red.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'red-x-stamp',
  category: 'fail-fx',
  desc: 'Sarsıntıyla basılan kırmızı X mührü',
  tags: ['mühür', 'damga', 'reddedildi', 'x', 'hata', 'yanlış', 'stamp', 'rejected', 'denied', 'fail', 'error', 'wrong'],
  box: [-95, -95, 95, 95],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'mühür basma anı: hızlı büyüme + 0.1 sn sarsıntı' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = 128, R = 22;

    let scale = 1, alpha = 1, shakeX = 0, rot = 0;
    if (d < 0) {
      // basılmadan önce: havada asılı, hafif silik + minik salınım
      scale = 0.82;
      alpha = 0.42;
      shakeX = k.noise1(t * 2.0) * 2;
    } else {
      // basma: 0.15 sn'de 1.3→1.0 slam, ardından 0.1 sn sarsıntı
      scale = 1.3 - 0.3 * k.E.outCubic(k.prog(d, 0, 0.15));
      if (d >= 0.15 && d < 0.25) {
        const e = (d - 0.15) / 0.1;
        shakeX = 7 * Math.sin(e * Math.PI * 2) * (1 - e);
        rot = 0.05 * Math.sin(e * Math.PI * 2) * (1 - e);
      }
    }

    ctx.save();
    ctx.translate(shakeX, 0);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;

    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-S / 2 + 6, -S / 2 + 6, S, S, R); ctx.fill();
    // mühür gövdesi (red vurgu)
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-S / 2, -S / 2, S, S, R); ctx.fill();
    // iç çerçeve çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.75);
    ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-S / 2 + 12, -S / 2 + 12, S - 24, S - 24, R - 8); ctx.stroke();
    // sol üst parlama (premium, alfa 0.11)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(-S / 2 + 34, -S / 2 + 18, 38, 13, -0.4, 0, k.TAU);
    ctx.fill();
    // X işareti (iç detay: ink, kalın)
    ctx.strokeStyle = k.rgba('ink', 0.92);
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-24, -24); ctx.lineTo(24, 24);
    ctx.moveTo(24, -24); ctx.lineTo(-24, 24);
    ctx.stroke();

    ctx.restore();
    ctx.globalAlpha = 1;

    // --- mürekkep sıçramaları: at anında belirir, sonra kalır ---
    if (d >= 0) {
      const pop = k.E.outBack(k.prog(d, 0, 0.18));
      for (let i = 0; i < 7; i++) {
        const ang = k.hash(70 + i * 11) * k.TAU;
        const dist = S / 2 + 10 + k.hash(80 + i * 11) * 26;
        const r = (2.5 + k.hash(90 + i * 11) * 4.5) * pop;
        if (r <= 0) continue;
        ctx.fillStyle = k.rgba(p.color, 0.85);
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, r, 0, k.TAU);
        ctx.fill();
      }
    }
  },
};
