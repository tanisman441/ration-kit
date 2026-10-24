// birthday-fx/party-hat-toss — çizgili parti şapkası; at anında havaya fırlatılır, dönerek düşer.
// NOT: canvas y-aşağıdır; (0,0) şapka tabanıdır, uç negatif y yönünde yukarıdadır.
export default {
  name: 'party-hat-toss', category: 'birthday-fx',
  desc: 'Pompomlu çizgili parti şapkası; fırlatma anında dönerek havalanır ve yerine düşer',
  tags: ['parti şapkası', 'şapka', 'fırlatma', 'doğum günü', 'kutlama', 'pompon', 'party hat', 'toss', 'birthday', 'party', 'celebration', 'cone'],
  box: [-130, -200, 130, 40],
  bleed: 55,
  anchor: 'şapka tabanı (0,0)',
  points: { tip: [0, -138], pompom: [0, -146], brim: [52, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'şapka rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'fırlatma anı — 1.2 sn havada dönüş, sonra iniş ve küçük sekme' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba(p.color);
    const d = p.at == null ? -1 : t - p.at;
    const tossed = d >= 0;
    // fırlatma yörüngesi: parabol (yukarı-dönüş), inişte küçük sekme
    let hy = 0, hx = 0, rot = 0;
    if (tossed) {
      if (d < 1.2) {
        const u = d / 1.2;
        hy = -160 * 4 * u * (1 - u);
        hx = 30 * Math.sin(Math.PI * u);
        rot = u * k.TAU * 1.25;
      } else if (d < 1.5) {
        const u = (d - 1.2) / 0.3;
        hy = -10 * Math.sin(Math.PI * u);
        hx = 0;
        rot = k.TAU * 1.25 * (1 - u * 0.2);
      } else {
        rot = k.TAU; // tam tur tamamlandı, görsel olarak dinlenme açısı
      }
    }
    const idleSway = tossed ? 0 : Math.sin(t * k.TAU / 2.8) * 0.04; // hafif salınım (canlı idle)
    const pomWob = Math.sin(t * 5.2) * 0.08; // pompom titremesi
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 8, 62, 9, 0, 0, k.TAU); ctx.fill();

    // fırlatma anında konfeti patlaması (0.6 sn)
    if (tossed && d < 0.6) {
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 7 + 4), h2 = k.hash(i * 13 + 23), h3 = k.hash(i * 29 + 41);
        const ang = h1 * k.TAU;
        const e = 1 - Math.pow(1 - Math.min(d / 0.4, 1), 2);
        const dist = (16 + h2 * 70) * e;
        const x = Math.cos(ang) * dist;
        const y = -10 + Math.sin(ang) * dist + 40 * d * d;
        const fade = 1 - k.prog(d, 0.25, 0.6);
        if (fade <= 0) continue;
        ctx.fillStyle = h3 > 0.5 ? k.rgba(p.color, fade) : k.rgba('ink', fade * 0.8);
        ctx.beginPath(); ctx.arc(x, y, 2.5 + h2 * 2.5, 0, k.TAU); ctx.fill();
      }
    }

    // şapka
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rot + idleSway);
    // koni gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(58, 0); ctx.lineTo(0, -132); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(-54, 0); ctx.lineTo(54, 0); ctx.lineTo(0, -128); ctx.closePath(); ctx.fill();
    // çizgiler: koni genişliğine göre daralan bantlar
    ctx.save();
    ctx.beginPath(); ctx.moveTo(-54, 0); ctx.lineTo(54, 0); ctx.lineTo(0, -128); ctx.closePath(); ctx.clip();
    ctx.fillStyle = k.rgba('ink', 0.55);
    for (const [sy, sh] of [[-96, 12], [-66, 12], [-36, 12]]) {
      ctx.beginPath(); ctx.rect(-60, sy, 120, sh); ctx.fill();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, -88, 10, 30, 0.35, 0, k.TAU); ctx.fill();
    ctx.restore();
    // taban kenarı
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 0, 60, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(0, 0, 56, 8, 0, 0, k.TAU); ctx.fill();
    // pompom: uçta, hafif titrer
    ctx.save();
    ctx.translate(0, -132);
    ctx.rotate(pomWob);
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -6, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel'); ctx.beginPath(); ctx.arc(0, -6, 12, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-4, -10, 5, 4, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
    ctx.restore();
  },
};
