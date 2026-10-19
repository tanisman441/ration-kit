// vehicles-2/motorcycle — yandan görünüm motosiklet (sağa bakar); rev anında egzozdan duman pufu + far yanar.
// Orijinal tasarım. NOT: canvas y-aşağıdır; (0,0) zemin merkezi, tekerlekler yerde durur.
export default {
  name: 'motorcycle',
  category: 'vehicles-2',
  desc: 'Yandan görünüm motosiklet; gaz verilince egzozdan duman çıkar, far parlar, gövde titrer',
  tags: ['motosiklet', 'motor', 'motorcycle', 'moto', 'taşıt', 'hız', 'egzoz'],
  box: [-118, -112, 118, 14],
  bleed: 70,
  anchor: 'zemin merkezi (0,0); tekerlekler yerde',
  points: { exhaust: [-95, -38], headlight: [78, -58], seat: [-60, -86], wheelF: [62, -24], wheelR: [-62, -24] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'depo/kapotaj rengi' },
    rev: { type: 'time', default: null, desc: 'gaz verme anı: duman pufu + far yanar (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color);
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

    // ANIMASYON — rev olayı (0.7 sn)
    const d = p.rev == null ? -1 : t - p.rev;
    const revOn = d >= 0 && d < 0.7;
    const g = revOn ? d / 0.7 : d >= 0.7 ? 1 : 0;
    const wheelAng = g * k.TAU * 1.5;
    const shake = revOn ? k.noise1(t * 30) * 2 : k.noise1(t * 1.4) * 0.8;

    ctx.save();
    ctx.translate(0, shake);

    // tekerlekler
    for (const [wx, wy, wr] of [[-62, -24, 24], [62, -24, 24]]) {
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(wx, wy, wr + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(wx, wy, wr, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.85); ctx.beginPath(); ctx.arc(wx, wy, wr - 9, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const a = wheelAng + i * Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(wx, wy);
        ctx.lineTo(wx + Math.cos(a) * (wr - 11), wy + Math.sin(a) * (wr - 11)); ctx.stroke();
      }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(wx, wy, 5, 0, k.TAU); ctx.fill();
    }

    // çamurluklar (kemer yayları)
    for (const wx of [-62, 62]) {
      ctx.strokeStyle = O; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(wx, -24, 30, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(wx, -24, 30, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }

    // motor bloğu
    blob(-32, -62, 58, 32, 9, k.rgba('dim'));
    // depo
    blob(-36, -82, 60, 26, 11);
    // sele
    blob(-80, -86, 40, 15, 7, darkTire);
    // kuyruk
    blob(-96, -80, 20, 12, 6, darkTire);

    // egzoz borusu
    rod(20, -46, -70, -40, 9, darkTire);
    blob(-104, -46, 22, 14, 7, k.rgba('ink'));

    // ön çatal + gidon
    rod(45, -62, 64, -94, 7);
    ctx.fillStyle = O; ctx.beginPath(); k.rrect(52, -102, 28, 10, 5); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); k.rrect(55, -99, 22, 7, 3.5); ctx.fill();

    // far (vurgu: yellow)
    const beam = revOn ? 0.85 : 0.35;
    ctx.fillStyle = O; ctx.beginPath(); k.rrect(70, -66, 18, 14, 6); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', beam + 0.15); ctx.beginPath(); k.rrect(72, -64, 14, 10, 5); ctx.fill();
    k.glow(79, -59, revOn ? 34 : 18, 'yellow', beam);
    if (revOn) {
      ctx.fillStyle = k.rgba('yellow', 0.22);
      ctx.beginPath(); ctx.moveTo(88, -62); ctx.lineTo(150, -78); ctx.lineTo(150, -40); ctx.lineTo(88, -56); ctx.closePath(); ctx.fill();
    }
    // stop lambası
    ctx.fillStyle = k.rgba('red', 0.9); ctx.beginPath(); k.rrect(-100, -76, 9, 10, 4); ctx.fill();

    // premium parlama (depo sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, -74, 18, 7, -0.35, 0, k.TAU); ctx.fill();

    ctx.restore();

    // ANIMASYON — egzoz duman pufları (rev anında)
    if (revOn) {
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 3 + 41), h2 = k.hash(i * 5 + 42);
        const pd = d - i * 0.07;
        if (pd < 0 || pd > 0.9) continue;
        const pg = pd / 0.9;
        const x = -108 - pd * 55 + h1 * 12, y = -39 - pd * 34 - pg * pg * 22 + h2 * 8;
        const r = 6 + pd * 20;
        ctx.fillStyle = k.rgba('dim', Math.max(0, 0.55 * (1 - pg)));
        ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      }
    }
  },
};
