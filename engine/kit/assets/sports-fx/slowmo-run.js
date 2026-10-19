// sports-fx/slowmo-run — ağır çekim sprint: öne eğik koşucu silueti + geride kalan gecikmeli hayalet hız izleri.
// NOT: canvas y-aşağıdır; koşucu sağa (+x) koşar, hayaletler sola (-x) geride kalır. Zemin y=+100 civarıdır.
export default {
  name: 'slowmo-run',
  category: 'sports-fx',
  desc: 'Ağır çekim sprint: öne eğik koşucu silueti ve zaman gecikmeli hayalet hız izleri',
  tags: ['koşu', 'sprint', 'sprinter', 'ağır çekim', 'hız izi', 'atletizm', 'run', 'sprint', 'slowmo', 'speed trail', 'athletics'],
  box: [-240, -130, 240, 130],
  bleed: 60,
  anchor: 'koşucu gövde merkezi (0,0); zemin y=+100',
  points: { head: [31, -102], feet: [70, 92] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'sprint patlama anı: hız çizgileri + öne atılma' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.9 ? 1 - d / 0.9 : 0;   // patlama zarfı (0.9 sn)
    const lean = 0.20 + 0.22 * burst;                    // patlamada daha öne eğilme
    const bob = Math.sin(t * 4.4) * 4;                   // idle: hafif sekme (nefes)
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const C = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // iki parçalı uzuv: dış hat (bg alfa) + iç dolgu (kalın çizgi)
    const limb = (x1, y1, x2, y2, x3, y3, w, col, lw, alpha) => {
      ctx.strokeStyle = lw; ctx.lineWidth = w + 7;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
    };

    // yuvarlatılmış dikdörtgen: dış hat + dolgu
    const body = (x, y, w, h, r, col) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - 3, y - 3, w + 6, h + 6, r + 3); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // koşucu silueti; phase = bacak döngü fazı, ghost=true → hayalet iz (ince, parlamasız)
    const runner = (x0, phase, alpha, ghost) => {
      const u = Math.sin(phase), v = Math.cos(phase);   // bacak salınımı (yavaş: slowmo)
      const col = ghost ? k.rgba(p.color, 0.5 * alpha) : k.rgba(p.color, alpha);
      const lw = ghost ? k.rgba('bg', 0.2) : line;
      ctx.save();
      ctx.translate(x0, bob * (ghost ? 0.4 : 1));
      ctx.rotate(lean);
      // arka bacak
      limb(0, -24, -24 - 10 * u, 20, -56 - 14 * u, 84 - 6 * Math.abs(v), 15, col, lw);
      // ön bacak (diz yukarıda)
      limb(0, -24, 36 + 10 * u, -44, 70 + 14 * u, 84 - 12 * Math.abs(v), 15, col, lw);
      // ayak uçları: kısa yatay rrect
      for (const [fx, fy] of [[70 + 14 * u, 84 - 12 * Math.abs(v)], [-56 - 14 * u, 84 - 6 * Math.abs(v)]]) {
        ctx.fillStyle = ghost ? k.rgba('bg', 0.2) : line;
        ctx.beginPath(); k.rrect(fx - 16, fy - 3, 32, 13, 6); ctx.fill();
        ctx.fillStyle = col;
        ctx.beginPath(); k.rrect(fx - 13, fy, 26, 8, 4); ctx.fill();
      }
      // arka kol (bacağın tersi)
      limb(6, -72, -24 - 7 * u, -46, -6 - 9 * u, -18, 13, col, lw);
      // ön kol (dirsek bükük, öne pompalıyor)
      limb(6, -72, 34 + 7 * u, -50, 30 + 9 * u, -20, 13, col, lw);
      // gövde
      body(-15, -84, 30, 62, 13, col);
      // kafa
      ctx.fillStyle = ghost ? k.rgba('bg', 0.2) : line;
      ctx.beginPath(); ctx.arc(10, -106, 21, 0, k.TAU); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(10, -106, 18, 0, k.TAU); ctx.fill();
      // göz (profil: tek nokta) — ghost'ta yok
      if (!ghost) {
        ctx.fillStyle = inkC;
        ctx.beginPath(); ctx.arc(20, -108, 3.2, 0, k.TAU); ctx.fill();
      }
      // premium parlama: sol üst (sadece ana figür)
      if (!ghost) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(-6, -68, 7, 16, 0.25, 0, k.TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(2, -112, 7, 5, -0.3, 0, k.TAU); ctx.fill();
        // sağ alt gölge
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.beginPath(); ctx.ellipse(11, -32, 8, 14, 0.25, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    };

    // zemin çizgisi (serbest çizgi → ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-225, 100); ctx.lineTo(225, 100); ctx.stroke();

    // hayalet hız izleri: geride, gecikmeli fazlarda (ağır çekim sürüklenmesi)
    const phase = t * 3.4;
    runner(-104, phase - 1.2, 0.35, true);
    runner(-52, phase - 0.6, 0.6, true);
    // ana figür
    runner(0, phase, 1, false);

    // patlama anı: hız çizgileri + arkadan iten parlama
    if (burst > 0) {
      k.glow(-40, -10, 150 * burst, 'yellow', 0.3 * burst);
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 13 + 5), h2 = k.hash(i * 17 + 9);
        const y = -95 + h1 * 175;
        const x2 = -60 - h1 * 120;
        const len = Math.min((90 + h2 * 140) * (0.5 + 0.5 * burst), x2 + 290); // box+bleed içinde kal
        ctx.strokeStyle = k.rgba('ink', 0.65 * burst);
        ctx.lineWidth = 4 + h2 * 4;
        ctx.beginPath(); ctx.moveTo(x2 - len, y); ctx.lineTo(x2, y); ctx.stroke();
      }
    }
  },
};
