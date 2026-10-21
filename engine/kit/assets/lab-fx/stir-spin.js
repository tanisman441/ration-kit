// lab-fx/stir-spin — manyetik karıştırıcı: deney kabının tabanındaki kapsül
// bar speed hızıyla döner (canlı idle), sıvıda dönen helezon çizgileri ve
// yüzeyde girdap çukuru oluşturur.
// NOT: canvas y-aşağıdır; (0,0) kap tabanındadır.
export default {
  name: 'stir-spin', category: 'lab-fx',
  desc: 'Manyetik karıştırıcı: tabandaki dönen bar ile girdaplı deney kabı',
  tags: ['karıştırıcı', 'manyetik', 'dönme', 'girdap', 'deney', 'stirrer', 'spin', 'mix', 'vortex', 'lab'],
  box: [-85, -170, 85, 12],
  bleed: 20,
  anchor: 'taban (0,0)',
  points: { mouth: [0, -158], bar: [0, -18], surface: [0, -100] },
  params: {
    speed: { type: 'number', default: 0.6, min: 0, max: 1, desc: 'karıştırma hızı 0-1' },
    color: { type: 'color', default: 'cyan', desc: 'sıvı rengi' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.speed, 0, 1);
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // ölçü — beher
    const bw = 70, topY = -160, botY = 0, liqTop = -104;
    const halfAt = (y) => 34 + (bw - 34) * k.prog(y, -100, botY);

    // sıvı
    ctx.fillStyle = k.rgba(acc, 0.68);
    ctx.beginPath();
    const wob = (x) => Math.sin(x * 0.08 + t * (2 + S * 8)) * (1.5 + S * 3);
    const lw = halfAt(liqTop) - 6;
    ctx.moveTo(-lw, liqTop + wob(0));
    for (let x = -lw; x <= lw; x += 7) ctx.lineTo(x, liqTop + wob(x));
    ctx.lineTo(halfAt(botY - 6) - 5, botY - 6);
    ctx.lineTo(-halfAt(botY - 6) + 5, botY - 6);
    ctx.closePath(); ctx.fill();

    // helezonlar — sıvı içinde dönen 3 akıntı çizgisi
    const ang = t * (1.2 + S * 9);
    ctx.strokeStyle = k.rgba('ink', 0.3 + S * 0.25);
    ctx.lineWidth = 2.5;
    for (let s = 0; s < 3; s++) {
      const a0 = ang * (1 + s * 0.12) + s * 2.1;
      ctx.beginPath();
      const turns = 1.4;
      for (let i = 0; i <= 24; i++) {
        const c = i / 24;
        const a = a0 + c * k.TAU * turns;
        const r = 10 + c * 44;
        const x = Math.cos(a) * r, y = -60 - c * 44;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // girdap çukuru — yüzey ortasında dönen çukur
    const dep = S * 10;
    if (S > 0.03) {
      ctx.strokeStyle = k.rgba('ink', 0.35);
      ctx.lineWidth = 2.5;
      for (let r = 0; r < 3; r++) {
        const rr = 8 + r * 9 + k.noise1(r * 3 + t * (4 + S * 6)) * 2;
        const start = ang * 1.6 + r * 1.3;
        ctx.beginPath();
        ctx.ellipse(0, liqTop - dep * 0.4, rr, rr * 0.32, 0, start, start + 4.6);
        ctx.stroke();
      }
      ctx.fillStyle = k.rgba(acc, 0.5);
      ctx.beginPath(); ctx.ellipse(0, liqTop + 1, 9, dep * 0.55 + 3, 0, 0, k.TAU); ctx.fill();
    }

    // karıştırıcı bar — tabanda dönen kapsül (canlı idle; hız speed'e bağlı)
    const ba = ang * 1.35;
    const bLen = 34;
    ctx.save();
    ctx.translate(0, -16);
    // iz hayaleti (hızlıysa)
    if (S > 0.35) {
      ctx.strokeStyle = k.rgba(acc, 0.35 * (S - 0.35));
      ctx.lineWidth = 11;
      ctx.beginPath(); ctx.arc(0, 0, bLen / 2 - 4, ba - 1.1, ba - 0.15); ctx.stroke();
    }
    ctx.rotate(ba);
    ctx.fillStyle = k.rgba('ink', 0.92);
    ctx.beginPath(); k.rrect(-bLen / 2, -6.5, bLen, 13, 6.5); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 2.5;
    ctx.beginPath(); k.rrect(-bLen / 2, -6.5, bLen, 13, 6.5); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-bLen / 4, -2.5, 8, 2.4, -0.2, 0, k.TAU); ctx.fill();
    ctx.restore();

    // cam gövde
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-bw - 5, topY - 4, (bw + 5) * 2, botY - topY + 8, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5.5;
    ctx.beginPath(); k.rrect(-bw, topY, bw * 2, botY - topY, 10); ctx.stroke();
    // iç ayrım çizgisi (seviye işareti)
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(bw - 16, liqTop + 6); ctx.lineTo(bw, liqTop + 6); ctx.stroke();
    // (sağ alt gölge: cam konturun kendisi yeterli, ek çizgi nesne gibi duruyor)
    // sol üst cam parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-52, -90, 8, 32, 0.2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
