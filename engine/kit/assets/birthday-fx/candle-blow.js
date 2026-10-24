// birthday-fx/candle-blow — üç mumlu doğum günü pastası; at anında alevler söner, fitillerden duman yükselir.
// NOT: canvas y-aşağıdır; (0,0) pasta tabanıdır, alevler negatif y yönünde yukarıdadır.
export default {
  name: 'candle-blow', category: 'birthday-fx',
  desc: 'Üç mumlu doğum günü pastası; üfleme anında alevler söner, fitillerden duman yükselir',
  tags: ['doğum günü', 'pasta', 'mum', 'üfleme', 'dilek', 'kutlama', 'birthday', 'cake', 'candle', 'blow', 'wish', 'party'],
  box: [-150, -205, 150, 30],
  bleed: 45,
  anchor: 'pasta tabanı (0,0)',
  points: { flame1: [-45, -168], flame2: [0, -168], flame3: [45, -168], cake: [0, -30] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'pasta kreması rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'üfleme anı — alevler 0.3 sn içinde söner, ardından 1.2 sn duman yükselir' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba('dim'), frost = k.rgba(p.color), plateC = k.rgba('panel2');
    const d = p.at == null ? -1 : t - p.at;
    const blown = d >= 0;
    const flameOut = blown ? k.clamp(d / 0.3, 0, 1) : 0; // 0 = yanıyor, 1 = söndü
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // tabak
    disc(0, 14, 132, 13, plateC);
    // alt kat + sağ alt gölge (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-104, -54, 220, 68, 14); ctx.fill();
    blob(-110, -60, 220, 68, 14, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, -48, 30, 9, -0.25, 0, k.TAU); ctx.fill();
    // alt kat krema + damlalar
    blob(-110, -60, 220, 20, 12, frost);
    for (const dx of [-88, -40, 8, 56, 96]) disc(dx, -36, 7, 10, frost);
    // üst kat
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-64, -94, 140, 44, 14); ctx.fill();
    blob(-70, -100, 140, 44, 14, body);
    blob(-70, -100, 140, 18, 12, frost);
    for (const dx of [-52, -14, 24, 54]) disc(dx, -78, 6, 9, frost);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-42, -92, 18, 7, -0.25, 0, k.TAU); ctx.fill();

    // mumlar + alevler
    for (let i = 0; i < 3; i++) {
      const cx = (i - 1) * 45;
      // mum gövdesi (çizgili)
      blob(cx - 7, -146, 14, 46, 6, k.rgba('panel'));
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      for (const sy of [-138, -126, -114]) {
        ctx.beginPath(); ctx.moveTo(cx - 7, sy); ctx.lineTo(cx + 7, sy + 6); ctx.stroke();
      }
      // fitil
      ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, -146); ctx.lineTo(cx, -152); ctx.stroke();

      // alev: titreme (canlı idle) + üflemede yana yatıp sönme
      const flick = 1 + k.noise1(t * 6 + i * 9) * 0.12;
      const sway = k.noise1(t * 3.1 + i * 5) * 3;
      const lean = flameOut * 1.25; // üfleme yönü: sağa
      const fs = flick * (1 - flameOut);
      if (fs > 0.03) {
        const fy = -168 + flameOut * 6;
        k.glow(cx + sway, fy, 34 * fs, 'yellow', 0.45 * fs);
        ctx.save();
        ctx.translate(cx + sway, fy);
        ctx.rotate(lean);
        ctx.scale(fs, fs);
        ctx.fillStyle = k.rgba('yellow');
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.quadraticCurveTo(9, -4, 6, 4);
        ctx.quadraticCurveTo(3, 10, 0, 10);
        ctx.quadraticCurveTo(-3, 10, -6, 4);
        ctx.quadraticCurveTo(-9, -4, 0, -15);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.ellipse(0, 3, 3, 5, 0, 0, k.TAU); ctx.fill();
        ctx.restore();
      }

      // duman: söndükten sonra fitilden kıvrılarak yükselir (0.1–2.6 sn)
      if (blown && d > 0.1 && d < 2.7) {
        const sd = d - 0.1;
        for (let j = 0; j < 4; j++) {
          const u = k.clamp((sd - j * 0.35) / 1.8, 0, 1);
          if (u <= 0) continue;
          const sx = cx + Math.sin(u * 5 + i) * 10 * u + u * 14;
          const sy = -152 - u * 55;
          const r = 4 + u * 9;
          ctx.fillStyle = k.rgba('dim', 0.65 * Math.pow(1 - u, 0.7));
          ctx.beginPath(); ctx.arc(sx, sy, r, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};
