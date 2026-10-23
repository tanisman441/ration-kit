// food-fx-2/grill-sear — ızgarada mühürlenen et: idle'da cızırdayan buhar ve yağ kıvılcımları; sear anında büyük cızırtı patlaması.
// NOT: canvas y-aşağıdır; ızgara y≈30, et y≈-20 civarında, buhar yukarı (negatif y) yükselir.
export default {
  name: 'grill-sear', category: 'food-fx-2',
  desc: 'Izgara: mühürlenen et üstte durur, boşta cızırdayan buhar yükselir; sear anında yağ sıçraması ve cızırtı patlaması',
  tags: ['ızgara', 'mühürleme', 'et', 'biftek', 'cızırdama', 'grill', 'sear', 'steak', 'barbecue', 'sizzle'],
  box: [-150, -170, 150, 135],
  bleed: 70,
  anchor: 'ızgara gövdesinin merkezi (0,40)',
  points: { grill: [0, 60], steak: [0, -30], steam_top: [0, -150] },
  params: {
    sear: { type: 'time', default: null, desc: 'mühürleme anı (1.2 sn): yağ sıçrar, buhar patlar, ızgara parlar' },
    done: { type: 'number', default: 0.7, desc: 'mühür derecesi 0–1: etin kızarıklığı' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const done = k.clamp(p.done ?? 0.7, 0, 1);
    const d = p.sear == null ? -1 : t - p.sear;
    const searing = d >= 0 && d <= 1.2;
    const g = searing ? k.prog(d, 0, 1.2) : -1;

    // --- 1) ızgara gövdesi + ayakları
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-120, 46, 252, 60, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-126, 40, 252, 60, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // ayaklar
    for (let i = -1; i <= 1; i++) {
      ctx.fillStyle = k.rgba('bg', 0.15);
      k.rrect(i * 84 - 8 + 6, 106, 28, 24, 8); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 1);
      k.rrect(i * 84 - 8, 100, 28, 24, 8); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    }
    // kontrol düğmesi (vurgu)
    ctx.fillStyle = k.rgba('red', 1);
    ctx.beginPath(); ctx.arc(88, 70, 12, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    const knob = k.hash(Math.floor(t * 1.5)) > 0.5 ? 1 : 0.4;
    ctx.fillStyle = k.rgba('red', knob);
    ctx.beginPath(); ctx.arc(88, 70, 6, 0, k.TAU); ctx.fill();
    // gövde parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-84, 54, 26, 9, -0.18, 0, k.TAU); ctx.fill();

    // --- 2) ızgara telleri (5 yatay çubuk)
    for (let i = 0; i < 5; i++) {
      const yy = -6 + i * 10;
      ctx.fillStyle = k.rgba('bg', 0.15);
      k.rrect(-126, yy + 6, 252, 9, 4); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 1);
      k.rrect(-126, yy, 252, 9, 4); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    }

    // --- 3) et (sear'da titrer)
    const jx = searing ? Math.sin(d * 55) * 2.5 * (1 - g) : k.noise1(t * 2.2) * 1.2;
    const steakPath = () => {
      ctx.beginPath();
      ctx.moveTo(-88, -46); ctx.lineTo(88, -46);
      ctx.quadraticCurveTo(104, -46, 104, -28);
      ctx.lineTo(96, -8); ctx.quadraticCurveTo(40, 4, -40, 4);
      ctx.lineTo(-96, -8); ctx.quadraticCurveTo(-104, -46, -88, -46); ctx.closePath();
    };
    ctx.save(); ctx.translate(jx, 0);
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); steakPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('red', 0.35 + done * 0.65);
    steakPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // mühür izleri (çapraz çizgiler)
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(i * 34 - 14, -44); ctx.lineTo(i * 34 + 14, -12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i * 34 + 14, -44); ctx.lineTo(i * 34 - 14, -12); ctx.stroke();
    }
    // sol üst parlama (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-58, -34, 30, 9, -0.2, 0, k.TAU); ctx.fill();
    // et üstü yağ damlacıkları
    for (let i = 0; i < 4; i++) {
      const fx = -60 + i * 40 + k.noise1(t * 1.5 + i * 8) * 3;
      ctx.fillStyle = k.rgba('ink', 0.4);
      ctx.beginPath(); ctx.arc(fx, -24 + (i % 2) * 8, 3.5, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // --- 4) ısı parıltısı (et altı, döngülü nabız)
    const heat = 0.5 + 0.5 * Math.sin(t * 4.5);
    k.glow(0, 0, 70 + heat * 20 + (searing ? 60 * (1 - g) : 0), 'yellow', 0.22 + (searing ? 0.28 * (1 - g) : 0));

    // --- 5) buhar (döngülü yükselen kıvrımlar)
    const wisps = searing ? 8 : 4;
    for (let i = 0; i < wisps; i++) {
      const cyc = searing ? 1.4 : 3;
      const ph = ((t * (searing ? 1.8 : 1) + k.hash(i * 6.3 + 2) * cyc) % cyc) / cyc;
      const sx = (k.hash(i * 3.7 + 5) - 0.5) * 150;
      const y0 = -50 - ph * 115;
      const wob = k.noise1(t * 2.5 + i * 11) * 14;
      ctx.strokeStyle = k.rgba('dim', 0.55 * Math.sin(ph * Math.PI));
      ctx.lineWidth = 5.5 * (1 - ph * 0.5);
      ctx.beginPath();
      ctx.moveTo(sx, -50);
      ctx.bezierCurveTo(sx + wob - 10, y0 + 34, sx - wob + 10, y0 + 4, sx + wob * 0.5, y0 - 20);
      ctx.stroke();
    }

    // --- 6) yağ cızırtısı: idle'da küçük kıvılcımlar (hash döngüsü)
    const sparks = searing ? 14 : 6;
    for (let i = 0; i < sparks; i++) {
      const cyc = 0.9;
      const ph = ((t + k.hash(i * 9.1 + 3) * cyc) % cyc) / cyc;
      const px = (k.hash(i * 4.4 + 8) - 0.5) * 180;
      const py = -40 - ph * (searing ? 60 : 26);
      const a = Math.sin(ph * Math.PI);
      ctx.fillStyle = k.rgba('yellow', 0.85 * a);
      ctx.beginPath(); ctx.arc(px, py, searing ? 3.5 + ph * 2 : 2.5, 0, k.TAU); ctx.fill();
    }

    // --- 7) sear olayı: yağ damlaları parabolayla fırlar
    if (searing) {
      for (let i = 0; i < 12; i++) {
        const dg = k.prog(d - k.hash(i * 7.7 + 1) * 0.35, 0, 0.85);
        if (dg <= 0) continue;
        const ang = -Math.PI / 2 + (k.hash(i * 3.3 + 9) - 0.5) * 1.8;
        const spd = 90 + k.hash(i * 5.5 + 4) * 130;
        const rise = spd * k.E.outCubic(Math.min(dg * 1.7, 1));
        const fall = 320 * Math.pow(Math.max(dg - 0.4, 0) / 0.6, 2);
        const px = Math.cos(ang) * rise;
        const py = -46 + Math.sin(ang) * rise + fall;
        const fade = 1 - k.prog(dg, 0.65, 1.0);
        if (fade <= 0) continue;
        ctx.fillStyle = k.rgba('yellow', 0.9 * fade);
        ctx.beginPath(); ctx.arc(px, py, 3 + k.hash(i * 2.2 + 6) * 3.5, 0, k.TAU); ctx.fill();
      }
      // cızırtı halkası
      const ri = k.prog(d, 0, 0.6);
      if (ri > 0) {
        ctx.strokeStyle = k.rgba('red', 0.65 * (1 - ri));
        ctx.lineWidth = 7 * (1 - ri) + 2;
        ctx.beginPath(); ctx.ellipse(0, -20, 30 + ri * 110, 12 + ri * 40, 0, 0, k.TAU); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
