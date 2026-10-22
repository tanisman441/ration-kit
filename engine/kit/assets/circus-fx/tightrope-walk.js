// circus-fx/tightrope-walk — ipte yürüyen cambaz.
// Canlı idle: denge sallantısı (~2.6 sn periyot, gövde ±6°, denge sopası
// yukarı-aşağı salınır); bacaklar dönüşümlü adım atar. İp ink rengi ince çizgi.
// NOT: canvas y-aşağıdır; (0,0) ipin merkezidir (cambazın bastığı nokta).
export default {
  name: 'tightrope-walk', category: 'circus-fx',
  desc: 'Gerili ip üzerinde denge sopasıyla yürüyen cambaz, sallantılı',
  tags: ['cambaz', 'ip', 'denge', 'sirk', 'tightrope', 'walker', 'balance', 'circus', 'akrobat'],
  box: [-225, -290, 225, 60],
  bleed: 20,
  anchor: 'ipin merkezi (0,0) — cambazın bastığı nokta',
  points: { footL: [-24, 0], footR: [24, 0], ropeL: [-215, 0], ropeR: [215, 0], head: [0, -232] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'kostüm rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // ip: hafif sarkık, ince ink çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-215, -4);
    ctx.quadraticCurveTo(0, 6, 215, -4); ctx.stroke();
    // ip destek direkleri
    ctx.fillStyle = k.rgba('dim', 0.9);
    k.rrect(-222, -60, 10, 64, 4); ctx.fill();
    k.rrect(212, -60, 10, 64, 4); ctx.fill();

    // denge sallantısı: gövde tilt + sopa salınımı
    const ph = t * k.TAU / 2.6;
    const tilt = 0.10 * Math.sin(ph);              // ±6°
    const wobX = 8 * Math.sin(ph + 1);             // yanal kayma
    const br = Math.sin(t * k.TAU / 2.4) * 1.6;    // nefes
    const blink = (t % 3.6) < 0.12;

    ctx.save();
    ctx.translate(wobX, 0);
    ctx.rotate(tilt);

    // bacaklar: dönüşümlü adım (ipte kayar gibi)
    const step = Math.sin(t * k.TAU / 1.7);
    ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-12, -95); ctx.lineTo(-24 + step * 14, -2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, -95); ctx.lineTo(24 - step * 14, -2); ctx.stroke();
    // ayaklar: ipte kısa yatay rrect
    ctx.fillStyle = k.rgba('bg', 0.55);
    k.rrect(-38 + step * 14, -7, 30, 9, 4); ctx.fill();
    k.rrect(8 - step * 14, -7, 30, 9, 4); ctx.fill();

    // gövde
    ctx.fillStyle = k.rgba(acc, 0.9);
    k.rrect(-24, -190 + br * 0.4, 48, 98, 15); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-24, -190 + br * 0.4, 48, 98, 15); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -172, 10, 19, -0.35, 0, k.TAU); ctx.fill();

    // denge sopası: omuz hizasında, iki yanda uzun, salınır
    const poleY = -160 + br * 0.4 + Math.sin(ph + 0.7) * 7;
    const poleTilt = -tilt * 2.2 + Math.sin(ph * 2) * 0.03;
    ctx.save();
    ctx.translate(0, poleY); ctx.rotate(poleTilt);
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-150, -6, 300, 12, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    k.rrect(-150, -6, 300, 12, 6); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-95, -3, 55, 2.8, 0, 0, k.TAU); ctx.fill();
    // sopa uçları
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.arc(-150, 0, 10, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(150, 0, 10, 0, k.TAU); ctx.fill();
    ctx.restore();
    // kollar: sopayı tutar
    ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-18, -165 + br * 0.4); ctx.lineTo(-52, poleY + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18, -165 + br * 0.4); ctx.lineTo(52, poleY + 4); ctx.stroke();

    // kafa
    const hy = -220 + br * 0.6;
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); ctx.arc(0, hy, 29, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, hy, 29, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, hy - 10, 9, 6.5, -0.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 2.8;
    if (blink) {
      ctx.beginPath(); ctx.moveTo(-12, hy - 6); ctx.lineTo(-5, hy - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(5, hy - 6); ctx.lineTo(12, hy - 6); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(-8.5, hy - 6, 3.2, 0, k.TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(8.5, hy - 6, 3.2, 0, k.TAU); ctx.stroke();
    }
    // odaklı ağız (dengeye konsantre)
    ctx.beginPath(); ctx.moveTo(-6, hy + 12); ctx.lineTo(6, hy + 12); ctx.stroke();

    ctx.restore();   // tilt sonu
    ctx.restore();
  },
};
