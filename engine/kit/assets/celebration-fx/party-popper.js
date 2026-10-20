// celebration-fx/party-popper — konfeti konisi: at anında koni sarsılır
// + yukarı yelpaze şeklinde konfeti fışkırır (0.5–0.8 sn sönümlenir).
// Boşta hafif yalpalanma. Konfeti parçaları tek vurgu rengi + beyazdır.
// NOT: canvas y-aşağıdır; (0,0) koni merkezidir, ağız (0,-58)'dedir.
export default {
  name: 'party-popper', category: 'celebration-fx',
  desc: 'Konfeti patlatan koni: at anında sarsılıp yukarı konfeti fışkırtan parti konisi',
  tags: ['konfeti', 'koni', 'parti', 'patlama', 'kutlama', 'eğlence', 'popper', 'confetti', 'party', 'celebration', 'cone'],
  box: [-125, -145, 125, 125],
  bleed: 60,
  anchor: 'koni merkezi (0,0)',
  points: { mouth: [0, -58], base: [0, 92] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'koni + konfeti vurgu rengi' },
    at: { type: 'time', default: null, desc: 'patlama anı: koni sarsılır, konfeti 0.5-0.8 sn fışkırır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? -1 : t - p.at;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // idle yalpalanma + olay sarsıntısı
    let tilt = k.noise1(t * 0.8) * 0.03;
    let jx = 0;
    if (d >= 0 && d < 0.25) {
      const f = 1 - d / 0.25;
      jx = k.noise1(d * 90) * 7 * f;
      tilt += k.noise1(d * 70) * 0.09 * f;
    }
    ctx.translate(jx, 0);
    ctx.rotate(tilt);

    // koni gövdesi: üçgen (rrect yok, path + yuvarlak uç)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-46, 92); ctx.lineTo(46, 92); ctx.lineTo(6, -58); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-46, 92); ctx.lineTo(46, 92); ctx.lineTo(6, -58); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath();
    ctx.moveTo(-46, 92); ctx.lineTo(46, 92); ctx.lineTo(6, -58); ctx.closePath(); ctx.stroke();
    // sağ alt gölge: %12 koyultma
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(14, 92); ctx.lineTo(46, 92); ctx.lineTo(6, -58); ctx.closePath(); ctx.fill();
    // premium parlama: sol üst şerit
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    ctx.moveTo(-38, 84); ctx.lineTo(-18, 84); ctx.lineTo(0, -20); ctx.lineTo(-14, -30);
    ctx.closePath(); ctx.fill();
    // bant şeritleri: koniyi saran iki diyagonal şerit
    ctx.strokeStyle = k.rgba('panel2', 0.9);
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-30, 62); ctx.lineTo(24, -18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-14, 88); ctx.lineTo(30, 18); ctx.stroke();
    // ağız kenarı (koyu)
    ctx.fillStyle = k.rgba('bg', 0.45);
    ctx.beginPath(); ctx.ellipse(0, -58, 12, 5, 0, 0, k.TAU); ctx.fill();

    ctx.restore();

    // konfeti fışkırması: ağızdan yukarı yelpaze (0.5–0.8 sn)
    if (d >= 0 && d < 0.85) {
      ctx.save();
      ctx.lineCap = 'round';
      // ilk 0.12 sn flaş
      if (d < 0.12) {
        const f = 1 - d / 0.12;
        k.glow(0, -58, 70 * f, p.color, 0.5 * f);
      }
      for (let i = 0; i < 34; i++) {
        const h1 = k.hash(i * 7 + 601), h2 = k.hash(i * 13 + 617), h3 = k.hash(i * 29 + 631);
        const dd = Math.max(d - h3 * 0.1, 0);
        const ang = -Math.PI / 2 + (h1 - 0.5) * 1.9;   // yukarı yelpaze
        const e = 1 - Math.pow(1 - Math.min(dd * 2.4, 1), 2.5);
        const dist = (24 + h2 * 120) * e;
        const x = Math.cos(ang) * dist;
        const y = -58 + Math.sin(ang) * dist + 130 * dd * dd;
        if (x < -180 || x > 180 || y < -200 || y > 130) continue;
        const fade = 1 - k.prog(dd, 0.35, 0.8);
        if (fade <= 0) continue;
        const spin = dd * (5 + h2 * 7) + h1 * k.TAU;
        const sq = 0.35 + 0.65 * Math.abs(Math.cos(spin));
        const w = (7 + h2 * 8) * sq;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang + spin * 0.4);
        ctx.fillStyle = i % 3 === 0
          ? k.rgba('panel2', 0.9 * fade)
          : k.rgba(p.color, 0.9 * fade);
        ctx.fillRect(-w / 2, -4.5, w, 9);
        ctx.restore();
      }
      ctx.restore();
    }
  },
};
