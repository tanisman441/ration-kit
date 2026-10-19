// vehicles-2/train — yandan görünüm buharlı lokomotif (sağa bakar); whistle anında bacadan buhar fışkırır + hareket izi.
// Orijinal tasarım. NOT: canvas y-aşağıdır; (0,0) zemin merkezi, tekerlekler yerde durur.
export default {
  name: 'train',
  category: 'vehicles-2',
  desc: 'Yandan görünüm buharlı lokomotif; düdük anında bacadan buhar fışkırır, arkada hız izi belirir',
  tags: ['tren', 'lokomotif', 'buharlı tren', 'train', 'locomotive', 'taşıt', 'demiryolu', 'buhar'],
  box: [-128, -150, 128, 14],
  bleed: 90,
  anchor: 'zemin merkezi (0,0); tekerlekler yerde',
  points: { chimney: [55, -118], cabin: [-45, -95], wheelBig: [-55, -26], cowcatcher: [98, -14] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'gövde rengi' },
    whistle: { type: 'time', default: null, desc: 'düdük anı: buhar fışkırır + hareket izi (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 6;
    const col = k.rgba(p.color);
    const glass = k.rgba('bg', 0.9);
    const tire = k.col('ink');
    const darkTire = `rgb(${tire.map(v => Math.max(0, Math.round(v * 0.6))).join(',')})`;

    const blob = (x, y, w, h, r, c = col) => {
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // ANIMASYON — düdük olayı (0.9 sn)
    const d = p.whistle == null ? -1 : t - p.whistle;
    const whOn = d >= 0 && d < 0.9;
    const shake = whOn ? k.noise1(t * 22) * 2.5 : k.noise1(t * 1.1) * 0.8;

    ctx.save();
    ctx.translate(0, shake);

    // kazan (gövde)
    blob(-88, -96, 176, 52, 12);
    // ön yuvarlak kapak
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(94, -70, 26 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(94, -70, 26, 0, k.TAU); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(94, -70, 17, 0, k.TAU); ctx.fill();
    // kabin
    blob(-88, -120, 52, 76, 10);
    ctx.fillStyle = glass; ctx.beginPath(); k.rrect(-80, -110, 36, 28, 6); ctx.fill();
    // baca
    blob(44, -118, 24, 26, 6, darkTire);
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(56, -118, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(56, -118, 12, 0, k.TAU); ctx.fill();
    // düdük
    blob(20, -108, 10, 16, 5, k.rgba('yellow'));
    // snowplow (ön alt)
    ctx.fillStyle = O;
    ctx.beginPath(); ctx.moveTo(84, -44); ctx.lineTo(120, -44); ctx.lineTo(120, -8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darkTire;
    ctx.beginPath(); ctx.moveTo(88, -42); ctx.lineTo(114, -42); ctx.lineTo(114, -12); ctx.closePath(); ctx.fill();

    // büyük tekerlekler + biyel kolu
    const rodAng = whOn ? (d / 0.9) * k.TAU * 3 : 0;
    for (const wx of [-55, 30]) {
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(wx, -26, 26 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(wx, -26, 26, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const a = rodAng + i * Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(wx, -26);
        ctx.lineTo(wx + Math.cos(a) * 17, -26 + Math.sin(a) * 17); ctx.stroke();
      }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(wx, -26, 6, 0, k.TAU); ctx.fill();
    }
    // biyel kolu (tekerlekleri bağlar)
    ctx.strokeStyle = O; ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-55 + Math.cos(rodAng) * 17, -26 + Math.sin(rodAng) * 17);
    ctx.lineTo(30 + Math.cos(rodAng) * 17, -26 + Math.sin(rodAng) * 17);
    ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-55 + Math.cos(rodAng) * 17, -26 + Math.sin(rodAng) * 17);
    ctx.lineTo(30 + Math.cos(rodAng) * 17, -26 + Math.sin(rodAng) * 17);
    ctx.stroke();

    // far (vurgu: yellow)
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); k.rrect(88, -52, 14, 12, 5); ctx.fill();
    k.glow(95, -46, 22, 'yellow', 0.35);

    // premium parlama (kazan sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-55, -88, 32, 9, -0.3, 0, k.TAU); ctx.fill();

    ctx.restore();

    // ANIMASYON 1 — bacadan buhar fışkırma (düdük anında yoğun)
    const puffN = whOn ? 14 : 3;
    for (let i = 0; i < puffN; i++) {
      const h1 = k.hash(i * 3 + 51), h2 = k.hash(i * 5 + 52);
      let px, py, pr, pa;
      if (whOn) {
        const pd = d - i * 0.06;
        if (pd < 0) continue;
        const pg = pd / 1.0;
        px = 56 + (h1 - 0.5) * 30 - pd * 14; py = -122 - pd * 70 - pg * pg * 30 + (h2 - 0.5) * 14;
        pr = 9 + pd * 26; pa = 0.6 * (1 - pg);
      } else {
        // idle: her ~3 sn'de bir küçük nefes pufu (döngülü)
        const cyc = (t * 0.33 + h1) % 1;
        if (cyc > 0.4) continue;
        const pg = cyc / 0.4;
        px = 56 + (h1 - 0.5) * 12; py = -122 - pg * 40; pr = 6 + pg * 10; pa = 0.35 * (1 - pg);
      }
      ctx.fillStyle = k.rgba('dim', pa);
      ctx.beginPath(); ctx.arc(px, py, pr, 0, k.TAU); ctx.fill();
    }

    // ANIMASYON 2 — hareket izi (düdük anında arkada)
    if (whOn) {
      ctx.strokeStyle = k.rgba('ink', 0.28); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const yy = -40 - i * 18 + k.noise1(t * 5 + i * 9) * 4;
        const len = (30 + k.hash(i * 7 + 12) * 40) * (d / 0.9);
        ctx.beginPath(); ctx.moveTo(-100 - len, yy); ctx.lineTo(-100, yy); ctx.stroke();
      }
    }
  },
};
