// vehicles-2/helicopter — yandan görünüm helikopter (sağa bakar); ana rotor sürekli döner, gövde hafif salınır.
// Orijinal tasarım. NOT: canvas y-aşağıdır; (0,0) kızak tabanı merkezi.
export default {
  name: 'helicopter',
  category: 'vehicles-2',
  desc: 'Yandan görünüm helikopter; pervane sürekli döner, kuyruk rotoru eşlik eder, gövde hafif salınır',
  tags: ['helikopter', 'heli', 'helicopter', 'pervane', 'uçak', 'taşıt', 'havacılık'],
  box: [-135, -150, 135, 12],
  bleed: 60,
  anchor: 'kızak tabanı merkezi (0,0); gövde yukarı uzar',
  points: { rotorHub: [0, -118], cockpit: [52, -78], tail: [-108, -88], skidL: [-45, 0], skidR: [45, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'gövde rengi' },
    rotor: { type: 'number', default: 0.7, desc: 'pervane hızı (0-1, sürekli dönüş)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color);
    const glass = k.rgba('bg', 0.9);
    const tire = k.col('ink');
    const darkTire = `rgb(${tire.map(v => Math.max(0, Math.round(v * 0.6))).join(',')})`;

    const blob = (x, y, w, h, r, c = col) => {
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const rod = (x1, y1, x2, y2, w, c = col) => {
      ctx.strokeStyle = O; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // ANIMASYON — rotor sürekli dönüş (döngülü) + gövde salınımı
    const sp = k.clamp(p.rotor, 0, 1);
    const rotA = t * (4 + sp * 12);
    const bob = Math.sin(t * 2.1) * 2.2;
    const tilt = k.noise1(t * 0.9) * 0.02;

    ctx.save();
    ctx.translate(0, bob);
    ctx.rotate(tilt);

    // kuyruk bomu
    rod(-38, -86, -100, -80, 12);
    // kuyruk kanatçığı
    blob(-112, -102, 14, 28, 6);
    // kuyruk rotoru (dönen X)
    const trA = t * (14 + sp * 22);
    ctx.save(); ctx.translate(-106, -88);
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(0, 0, 13, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = darkTire; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(Math.cos(trA) * 12, Math.sin(trA) * 12);
    ctx.lineTo(-Math.cos(trA) * 12, -Math.sin(trA) * 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(Math.cos(trA + Math.PI / 2) * 12, Math.sin(trA + Math.PI / 2) * 12);
    ctx.lineTo(-Math.cos(trA + Math.PI / 2) * 12, -Math.sin(trA + Math.PI / 2) * 12); ctx.stroke();
    ctx.restore();

    // gövde (kabin)
    blob(-42, -104, 96, 52, 18);
    // kokpit camı
    ctx.fillStyle = glass; ctx.beginPath(); k.rrect(16, -96, 30, 28, 8); ctx.fill();
    // burun ışığı (vurgu: red, yanıp söner)
    const blink = 0.5 + 0.5 * Math.sin(t * 6);
    ctx.fillStyle = k.rgba('red', 0.5 + 0.5 * blink);
    ctx.beginPath(); ctx.arc(58, -78, 5, 0, k.TAU); ctx.fill();
    k.glow(58, -78, 10 + 8 * blink, 'red', 0.3 * blink);

    // direk + rotor göbeği
    rod(-4, -104, -4, -116, 10, darkTire);
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(0, -118, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -118, 7.5, 0, k.TAU); ctx.fill();

    // kızaklar
    rod(-45, -52, -45, -6, 6, darkTire);
    rod(45, -52, 45, -6, 6, darkTire);
    blob(-70, -10, 140, 10, 5, darkTire);

    // premium parlama (kabin sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, -96, 22, 8, -0.35, 0, k.TAU); ctx.fill();

    ctx.restore();

    // ANA ROTOR — sürekli dönen 3 kanat + bulanık disk
    ctx.save();
    ctx.translate(0, bob);
    // bulanık dönüş diski
    ctx.fillStyle = k.rgba('bg', 0.28);
    ctx.beginPath(); ctx.ellipse(0, -118, 105, 10, 0, 0, k.TAU); ctx.fill();
    for (let i = 0; i < 3; i++) {
      const a = rotA + i * k.TAU / 3;
      const ex = Math.cos(a) * 100, ey = Math.sin(a) * 100;
      ctx.strokeStyle = O; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(0, -118); ctx.lineTo(ex, -118 + ey * 0.1); ctx.stroke();
      ctx.strokeStyle = darkTire; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(0, -118); ctx.lineTo(ex, -118 + ey * 0.1); ctx.stroke();
    }
    ctx.restore();
  },
};
