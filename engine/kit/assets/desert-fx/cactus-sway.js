// desert-fx/cactus-sway — rüzgârda salınan saguaro kaktüsü.
// gust anında (0.9 sn) kaktüs iyice eğilir, dikenler uçuşur; boşta
// ~3.5 sn periyotla hafifçe salınır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kaktüsün tabanıdır.
export default {
  name: 'cactus-sway', category: 'desert-fx',
  desc: 'Rüzgârda salınan saguaro kaktüsü, gust anında iyice eğilip diken savurur',
  tags: ['kaktüs', 'saguaro', 'salınım', 'rüzgar', 'çöl', 'diken', 'cactus', 'sway', 'desert', 'wind'],
  box: [-120, -270, 120, 20],
  bleed: 25,
  anchor: 'kaktüsün tabanı (0,0)',
  points: { base: [0, 0], top: [0, -240] },
  params: {
    gust: { type: 'time', default: null, desc: 'rüzgâr hamlesi (0.9 sn, kaktüs eğilir + dikenler uçar)' },
    color: { type: 'color', default: 'green', desc: 'kaktüs rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const acc = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const gd = p.gust == null ? -1 : t - p.gust;
    const gusting = gd >= 0 && gd < 0.9;
    const env = gusting ? Math.sin((gd / 0.9) * Math.PI) : 0;

    // Salınım: idle (~3.5 sn) + gust olayı
    const sway = Math.sin(t * k.TAU / 3.5) * 0.045 + env * 0.13;

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // Zemin gölgesi + çakıllar (dönmez)
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, -2, 72, 11, 0, 0, k.TAU); ctx.fill();
    for (let i = 0; i < 5; i++) {
      const px = -95 + k.hash(i * 7 + 3) * 190, py = -3 - k.hash(i * 13) * 6;
      ctx.fillStyle = k.rgba('dim', 0.7);
      ctx.beginPath(); ctx.ellipse(px, py, 5 + k.hash(i) * 5, 4, 0, 0, k.TAU); ctx.fill();
    }

    ctx.save();
    ctx.translate(0, 0); ctx.rotate(sway);

    const column = (x, y, w, h, r) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = acc; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // Ana gövde
    column(-30, -240, 60, 240, 28);
    // Sol kol (aşağıda, uzun): yatay dirsek + dikey kol
    column(-68, -150, 40, 32, 15);
    column(-82, -212, 34, 78, 16);
    // Sağ kol (yukarıda, kısa)
    column(28, -176, 38, 30, 14);
    column(42, -230, 32, 70, 15);

    // Sağ alt gölge şeridi: ana gövdede %12 koyultma (clip ile)
    ctx.save();
    ctx.beginPath(); k.rrect(-30, -240, 60, 240, 28); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.fillRect(6, -240, 24, 240);
    ctx.restore();

    // Dikenler: gövde kenarlarında kısa çizgiler (serbest çizgi dili: ink)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 2.5;
    for (let i = 0; i < 9; i++) {
      const y = -228 + i * 24;
      ctx.beginPath(); ctx.moveTo(-30, y); ctx.lineTo(-42, y - 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(30, y + 12); ctx.lineTo(42, y + 7); ctx.stroke();
    }
    // kol uçlarındaki diken tutamları
    for (let i = 0; i < 3; i++) {
      const y = -206 + i * 14;
      ctx.beginPath(); ctx.moveTo(-82, y); ctx.lineTo(-92, y - 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(74, y - 16); ctx.lineTo(84, y - 21); ctx.stroke();
    }

    // premium parlama: gövdede sol üst beyaz alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -175, 10, 42, 0.08, 0, k.TAU); ctx.fill();

    ctx.restore();

    // gust olayı: uçuşan diken/toz çizgileri
    if (gusting) {
      for (let i = 0; i < 7; i++) {
        const f = (gd / 0.9) * 3 - i * 0.35;
        if (f < 0 || f > 1.4) continue;
        const px = -120 + f * 260 + k.noise1(t * 4 + i * 5) * 10;
        const py = -60 - i * 26 - f * 30;
        ctx.strokeStyle = k.rgba('ink', 0.55 * (1 - f / 1.4)); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 14, py - 4); ctx.stroke();
      }
    }
  },
};
