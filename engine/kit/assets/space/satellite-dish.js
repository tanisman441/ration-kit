// space/satellite-dish — yer istasyonu uydu çanağı; ping anında çanak odağından
// sinyal dalgaları yayılır, çanak boşta hafif salınır. Vurgu rengi: cyan.
// NOT: canvas y-aşağıdır; (0,0) tabandadır.
export default {
  name: 'satellite-dish', category: 'space',
  desc: 'Yer istasyonu uydu çanağı; ping anında sinyal dalgaları yayar',
  tags: ['uydu', 'çanak', 'anten', 'sinyal', 'dish', 'satellite dish', 'uzay', 'space', 'iletisim', 'anten'],
  box: [-160, -260, 160, 16],
  bleed: 100,
  anchor: 'taban (0,0)',
  points: { focal: [-99, -237], dish: [-40, -150], base: [0, -22] },
  params: {
    color: { type: 'color', default: 'panel2' },
    ping: { type: 'time', default: null, desc: 'sinyal gönderme anı: 1.0 sn dalga yayılımı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const dishC = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // ping zamanlaması: 1.0 sn
    const d = p.ping == null ? -1 : t - p.ping;

    // çanağın hafif salınımı (canlı idle): ~3 sn periyot, ±2.5°
    const sway = Math.sin(t * k.TAU / 3) * 0.045;
    const tilt = -0.6 + sway; // çanak yukarı-sola bakar

    // taban / kaide
    blob(-52, -44, 104, 46, 10, k.rgba('dim'));
    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 4, 78, 10, 0, 0, k.TAU); ctx.fill();

    // uzun destek direği (tabandan çanak yuvasına)
    const pivot = [-40, -150];
    limb(0, -44, pivot[0], pivot[1] + 10, 18, k.rgba('dim'));
    disc(pivot[0], pivot[1], 20, 20, k.rgba('dim')); // yuva

    ctx.save();
    // çanak grubu: yuva etrafında salınır
    ctx.translate(pivot[0], pivot[1]);
    ctx.rotate(tilt);

    // çanak (parabolik kase): alıcı kolunun ekseninde, aşağı doğru açılan yay
    ctx.strokeStyle = line; ctx.lineWidth = 30 + LW;
    ctx.beginPath(); ctx.arc(0, 0, 80, Math.PI * 0.28, Math.PI * 0.72); ctx.stroke();
    ctx.strokeStyle = dishC; ctx.lineWidth = 30;
    ctx.beginPath(); ctx.arc(0, 0, 80, Math.PI * 0.28, Math.PI * 0.72); ctx.stroke();
    // kase içi (iç yüzey)
    ctx.strokeStyle = k.rgba('panel', 0.9); ctx.lineWidth = 18;
    ctx.beginPath(); ctx.arc(0, 0, 67, Math.PI * 0.3, Math.PI * 0.7); ctx.stroke();
    // iç halka çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 54, Math.PI * 0.3, Math.PI * 0.7); ctx.stroke();
    // premium parlama (sol üst kenar)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, 80, Math.PI * 0.3, Math.PI * 0.44); ctx.stroke();
    // alıcı (LNB) kolu + başlık — odak noktasına (yukarı)
    limb(0, 0, 0, -105, 9, dishC);
    disc(0, -105, 12, 12, k.rgba('panel'));
    const rxLed = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 4.2));
    ctx.fillStyle = k.rgba('cyan', rxLed);
    ctx.beginPath(); ctx.ellipse(0, -105, 5, 5, 0, 0, k.TAU); ctx.fill();
    if (rxLed > 0.75) k.glow(0, -105, 16, 'cyan', 0.35);
    ctx.restore();

    // odak noktasının dünya koordinatı: (0,-105) noktasının tilt ile dönüşü + öteleme
    const focalX = pivot[0] + 105 * Math.sin(tilt);
    const focalY = pivot[1] - 105 * Math.cos(tilt);
    // sinyal yönü: kol ekseni (yukarı, tilt kadar eğik)
    const sigA = -Math.PI / 2 + tilt;

    // ping: odaktan sinyal dalgaları (1.0 sn)
    if (d >= 0 && d < 1.0) {
      for (let i = 0; i < 3; i++) {
        const ph = d * 1.5 - i * 0.2;
        if (ph < 0) continue;
        const r = 18 + ph * 150;
        const a = k.clamp(1 - ph / 0.85, 0, 1) * 0.75;
        ctx.strokeStyle = k.rgba('cyan', a); ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(focalX, focalY, r, sigA - 1.1, sigA + 1.1); ctx.stroke();
      }
    }
    // boşta hafif sinyal nabzı (odakta)
    const idlePulse = 0.25 + 0.2 * Math.sin(t * 2.2);
    k.glow(focalX, focalY, 22, 'cyan', idlePulse);
  },
};
