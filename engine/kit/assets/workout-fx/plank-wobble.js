// workout-fx/plank-wobble — dirsek üstü plank duran, titreyen insan figürü, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; yer (0,0), baş solda, ayaklar sağda.
export default {
  name: 'plank-wobble',
  category: 'workout-fx',
  desc: 'Dirsek üstü plank duran insan figürü (yandan); sürekli hafif titrer, tekrarla güçlü wobble dalgası gelir',
  tags: ['plank', 'plank duruşu', 'core', 'karın kası', 'titreme', 'wobble', 'planking', 'egzersiz', 'workout', 'fitness'],
  box: [-155, -130, 155, 16],
  bleed: 35,
  anchor: 'yer (0,0); baş solda (~-100), ayaklar sağda (~136)',
  points: { head: [-100, -64], elbow: [-55, -14], hip: [58, -86], foot: [136, -10] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    rep: { type: 'time', default: null, desc: 'titreme dalgasının başlangıcı — güçlü wobble (0.8 sn); null ise hafif idle titreme' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
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
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes

    // wobble: idle'da hafif titreme, rep ile 0.8 sn güçlü dalga
    const d = p.rep == null ? -1 : t - p.rep;
    const strong = (d >= 0 && d <= 0.8) ? Math.pow(Math.sin(d / 0.8 * Math.PI), 1.5) : 0;
    const wx = k.noise1(t * 2.2) * 1.6 + Math.sin(d * k.TAU * 4) * 9 * strong;
    const wy = k.noise1(t * 2.2 + 9) * 1.1 + Math.sin(d * k.TAU * 4 + 1) * 4.5 * strong;

    // zemin gölgesi (figürden bağımsız, sabit)
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(2, -6, 92, 10, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.translate(wx, wy);

    // bacaklar (düz, ayak parmak ucunda)
    limb(58, -86, 100, -54, 20, body);
    limb(100, -54, 136, -12, 17, body);
    blob(124, -14, 26, 13, 6, body);

    // gövde (yatay)
    blob(-72, -112, 136, 50, 25, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge bandı
    ctx.beginPath(); ctx.ellipse(20, -74, 32, 10, 0.06, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-34, -102, 11, 17, 0.12, 0, k.TAU); ctx.fill();

    // kollar: dirsek yerde, önkol ileri uzanır
    limb(-48, -86, -55, -14, 18, body);                    // üst kol
    limb(-55, -14, -18, -12, 15, body);                    // önkol (yerde)
    disc(-18, -12, 10, 10, body);                          // yumruk

    // baş
    const hy = -64 - br * 0.4;
    disc(-100, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-100 + s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(-100 + s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-100, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(-100, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(-100, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-108, hy + 12); ctx.lineTo(-92, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-113, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // efor: güçlü dalgada ter damlaları
    if (strong > 0.25) {
      for (let i = 0; i < 3; i++) {
        const h1 = k.hash(i * 7 + 5), h2 = k.hash(i * 13 + 1);
        const px = -80 + h1 * 70, py = -116 - h2 * 36 - (1 - strong) * 18;
        ctx.fillStyle = k.rgba('cyan', 0.7 * strong);
        ctx.beginPath(); ctx.ellipse(px, py, 4.5, 7, 0.2, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
