// environment/room-interior — oda içi; duvar, zemin, pencere, halı, tablo, raf.
// NOT: canvas y-aşağıdır; zemin (0,0).
export default {
  name: 'room-interior',
  category: 'environment',
  desc: 'Oda içi; duvar, zemin, ışıklı pencere, halı, tablo ve kitaplıklı raf',
  tags: ['oda', 'iç mekân', 'ev', 'pencere', 'halı', 'room', 'interior', 'home', 'window', 'rug'],
  box: [-285, -230, 285, 25],
  bleed: 0,
  anchor: 'zemin (0,0)',
  points: { window: [95, -150], rug: [0, -12] },
  params: {
    color: { type: 'color', default: 'panel' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const wall = k.rgba(p.color);
    const base = k.col(p.color);
    const floor = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`;
    const furn = k.rgba('dim');
    const dark = `rgb(${k.col('dim').map(v => Math.max(0, Math.round(v * 0.7))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // duvar (tam kutu, kenar taşırmasız)
    ctx.fillStyle = wall; ctx.fillRect(-285, -230, 570, 232);
    // zemin (tam kutu, kenar taşırmasız)
    ctx.fillStyle = floor; ctx.fillRect(-285, -2, 570, 29);
    // zemin-duvar birleşim çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.45); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-285, 0); ctx.lineTo(285, 0); ctx.stroke();

    // pencere (ışıklı)
    blob(40, -196, 110, 128, 8, furn);
    ctx.fillStyle = k.rgba('yellow', 0.28);
    ctx.fillRect(50, -186, 90, 108);
    k.glow(95, -132, 90, 'yellow', 0.22);
    // cam kayıtları
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(95, -186); ctx.lineTo(95, -78); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(50, -132); ctx.lineTo(140, -132); ctx.stroke();
    // pencere camı parlaması (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    ctx.moveTo(50, -78); ctx.lineTo(84, -186); ctx.lineTo(104, -186); ctx.lineTo(70, -78);
    ctx.closePath(); ctx.fill();
    // pencere ışığı zeminde
    ctx.fillStyle = k.rgba('yellow', 0.10);
    ctx.beginPath(); ctx.ellipse(95, -6, 80, 12, 0, 0, k.TAU); ctx.fill();

    // tablo (sol duvarda)
    blob(-228, -182, 78, 58, 6, furn);
    ctx.fillStyle = k.rgba('bg', 0.5); ctx.fillRect(-220, -174, 62, 42);
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(-220, -150); ctx.lineTo(-200, -170); ctx.lineTo(-182, -152); ctx.lineTo(-174, -158); ctx.lineTo(-158, -146); ctx.lineTo(-158, -132); ctx.lineTo(-220, -132); ctx.closePath(); ctx.fill();

    // raf + kitaplar (sağ duvarda)
    blob(176, -118, 92, 10, 4, furn);
    const bookC = [dark, k.rgba('bg', 0.7), k.rgba('ink', 0.55)];
    for (let i = 0; i < 3; i++) {
      const bw = 16, bh = 44 + k.hash(i * 7 + 2) * 14;
      blob(186 + i * 22, -118 - bh, bw, bh, 3, bookC[i]);
    }

    // halı (zeminde)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -12, 118, 17, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = furn;
    ctx.beginPath(); ctx.ellipse(0, -12, 112, 13, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, -12, 88, 9, 0, 0, k.TAU); ctx.stroke();
  },
};
