// character-actions/sit — taburede oturan insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; zemin (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'sit',
  category: 'character-actions',
  desc: 'Taburede oturan insan figürü; nefes alıp veren canlı duruş',
  tags: ['oturma', 'oturmak', 'sandalyede oturma', 'dinlenme', 'oturuş', 'sit', 'sitting', 'rest', 'seated'],
  box: [-110, -300, 120, 24],
  bleed: 15,
  anchor: 'zemin (0,0); tabure üstü ~-96',
  points: { head: [4, -268], seat: [4, -107], hand: [60, -128] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const stool = k.rgba('panel2');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const br = Math.sin(t * k.TAU / 2.4) * 2;               // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;               // göz kırpma
    const rock = k.noise1(t * 0.9) * 1.5;                   // hafif salınım

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(10, -6, 66, 10, 0, 0, k.TAU); ctx.fill();

    // tabure: oturak + iki ayak
    blob(-46, -118, 100, 22, 10, stool);
    blob(-38, -96, 15, 96, 7, stool);
    blob(39, -96, 15, 96, 7, stool);
    // tabure iç detay çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-38, -107); ctx.lineTo(46, -107); ctx.stroke();

    const hipY = -118, hipX = 4 + rock;

    // bacaklar: uyluk yatay öne, kaval dik aşağı
    for (const s of [-1, 1]) {
      const kx = 78, ky = hipY + 6;
      limb(hipX + s * 6, hipY, kx, ky, 20, body);           // uyluk
      limb(kx, ky, kx, -18, 17, body);                      // kaval
      blob(kx - 12, -17, 26, 13, 6, body);                  // ayak
    }

    // gövde (nefesle ±2)
    blob(-27 + rock, -242 - br * 0.4, 62, 128, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(20 + rock, -168 - br * 0.4, 12, 46, 0.1, 0, k.TAU); ctx.fill();

    // kollar: omuzdan dirseğe, el uyluk üstünde
    const shoY = -214 - br * 0.5;
    for (const s of [-1, 1]) {
      const ax = hipX + s * 26, ay = shoY;
      const ex = ax + 30, ey = ay + 46;
      const hx2 = 58 + s * 4, hy2 = hipY - 2;
      limb(ax, ay, ex, ey, 18, body);
      limb(ex, ey, hx2, hy2, 15, body);
      disc(hx2, hy2, 10, 10, body);
    }

    // baş
    const hbx = hipX, hby = -264 - br * 0.6;
    disc(hbx, hby, 36, 34, body);

    // yüz
    const ey = hby - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex + hbx, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex + hbx, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(hbx, hby + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(hbx, hby + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(hbx, hby + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(hbx - 8, hby + 12); ctx.lineTo(hbx + 8, hby + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-15 + rock, -216 - br * 0.4, 9, 26, 0.12, 0, k.TAU); ctx.fill();
  },
};
