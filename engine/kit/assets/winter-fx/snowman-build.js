// winter-fx/snowman-build — duran kardan adam; nefes alır, etrafında kar yağar, atkı ucu dalgalanır,
// wave anında sağ kolunu 0.9 sn sallar. Şapka, kömür gözler/düğmeler, havuç burun.
// NOT: canvas y-aşağıdır; (0,0) ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'snowman-build', category: 'winter-fx',
  desc: 'Kardan adam: şapkalı, kömür gözlü, havuç burunlu; nefes alır, çevresinde kar yağar, atkısı dalgalanır, wave anında kol sallar',
  tags: ['kardan adam', 'kar', 'kış', 'noel', 'snowman', 'snow', 'winter', 'carrot', 'hat', 'christmas'],
  box: [-140, -250, 140, 25],
  bleed: 20,
  anchor: 'ayaklar (0,0); boy ~240 birim',
  points: { head: [0, -178], top: [0, -236], hand: [80, -154] },
  params: {
    wave: { type: 'time', default: null, desc: 'kol sallama anı (0.9 sn: sağ kol kalkar, el sallar)' },
    scarf: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const LW = 8;
    const snow = k.rgba('dim'), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const carrot = k.rgba('yellow'), scarfC = k.rgba(p.scarf);
    const d = p.wave == null ? -1 : t - p.wave;
    const waving = d >= 0 && d < 0.9;
    const wenv = waving ? Math.sin(k.clamp(d / 0.9, 0, 1) * Math.PI) : 0;
    const br = Math.sin(t * k.TAU / 2.4) * 1.6;   // nefes
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const shine = (x, y, rx, ry) => {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.5, 0, k.TAU); ctx.fill();
    };

    // --- zemin karı ---
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 6, 96, 18, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(0, 4, 92, 15, 0, 0, k.TAU); ctx.fill();

    // --- gövde: 3 kat ---
    const baseY = 0, midY = -118 - br * 0.5, headY = -186 - br;
    disc(0, baseY - 52, 54, 52, snow); shine(-20, -72, 15, 9);
    disc(0, midY - 6, 41, 40, snow); shine(-15, midY - 22, 11, 7);
    disc(0, headY, 29, 27, snow); shine(-11, headY - 12, 8, 5);

    // sağ alt gölgeler (tek ton)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(20, baseY - 32, 26, 15, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(15, midY + 8, 19, 11, -0.4, 0, k.TAU); ctx.fill();

    // --- kömür düğmeler ---
    ctx.fillStyle = inkC;
    for (const yy of [-96, -118, -140]) { ctx.beginPath(); ctx.arc(0, yy - br * 0.5, 4.5, 0, k.TAU); ctx.fill(); }

    // --- atkı (boyun + dalgalanan uç) ---
    blob(-36, midY - 52, 72, 17, 8, scarfC);
    const knotX = 24, knotY = midY - 43;
    disc(knotX, knotY, 10, 9, scarfC);
    const flut = Math.sin(t * 3.1) * 0.16 + k.noise1(t * 2 + 3) * 0.12;   // dalgalanma
    ctx.save(); ctx.translate(knotX + 6, knotY + 4); ctx.rotate(0.9 + flut + wenv * 0.5);
    blob(-6, -6, 44, 12, 6, scarfC);
    ctx.restore();

    // --- kollar (dal kollar; sağ kol wave'de kalkar) ---
    const branch = (x1, y1, ang, len) => {
      const x2 = x1 + Math.cos(ang) * len, y2 = y1 + Math.sin(ang) * len;
      ctx.strokeStyle = line; ctx.lineWidth = 7 + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = inkC; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      // dal çatalı
      const mx = x1 + (x2 - x1) * 0.7, my = y1 + (y2 - y1) * 0.7;
      ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(ang - 0.7) * 14, my + Math.sin(ang - 0.7) * 14); ctx.stroke();
      return [x2, y2];
    };
    branch(-38, midY - 10, Math.PI + 0.55, 52);   // sol kol (yukarı-sola)
    const rAng = -0.55 - wenv * (1.15 - 0.35 * Math.sin(d * k.TAU * 2.6));  // sağ kol: kalk + salla
    branch(38, midY - 10, rAng, 52);

    // --- yüz ---
    const hy = headY;
    ctx.fillStyle = inkC;   // kömür gözler
    ctx.beginPath(); ctx.arc(-8, hy - 6, 3.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(8, hy - 6, 3.4, 0, k.TAU); ctx.fill();
    // havuç burun (hafif sallanır → canlı idle)
    const noseWag = Math.sin(t * 2.2) * 0.10;
    ctx.save(); ctx.translate(0, hy + 2); ctx.rotate(noseWag);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(16, -8); ctx.lineTo(16, 8); ctx.lineTo(46, 0); ctx.closePath();
    ctx.lineWidth = LW; ctx.stroke(); ctx.fill();
    ctx.fillStyle = carrot;
    ctx.beginPath(); ctx.moveTo(18, -5); ctx.lineTo(18, 5); ctx.lineTo(42, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
    // gülümseme (kömür noktalar)
    ctx.fillStyle = inkC;
    for (let i = -2; i <= 2; i++) {
      const a = i * 0.28;
      ctx.beginPath(); ctx.arc(Math.sin(a) * 13, hy + 14 + (1 - Math.cos(a)) * 8, 2.6, 0, k.TAU); ctx.fill();
    }

    // --- şapka (silindir + siper) ---
    const hatY = hy - 26;
    blob(-19, hatY - 36, 38, 38, 7, inkC);
    blob(-33, hatY - 8, 66, 11, 5, inkC);

    // --- etrafında süzülen kar taneleri (sürekli) ---
    for (let i = 0; i < 9; i++) {
      const h1 = k.hash(i * 17 + 4), h2 = k.hash(i * 29 + 9);
      const speed = 26 + 22 * h2;
      const y = -250 + ((t * speed + h1 * 290) % 290);
      const x = (h1 - 0.5) * 260 + Math.sin(t * 1.7 + i * 2.2) * 10;
      ctx.fillStyle = k.rgba('ink', 0.35 + 0.3 * h2);
      ctx.beginPath(); ctx.arc(x, y, 2 + 2.4 * h2, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
