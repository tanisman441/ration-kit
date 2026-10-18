// office/clock — duvar saati: akrep/yelkovan saate göre, saniye ibresi canlı döner;
// alarm anında saat titrer ve ses dalgaları yayılır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; anchor kadran merkezidir (0,0).
export default {
  name: 'clock', category: 'office',
  desc: 'Yuvarlak duvar saati; saniye ibresi canlı döner, alarm anında titreyip ses dalgası yayar',
  tags: ['saat', 'duvar saati', 'zaman', 'alarm', 'akrep', 'yelkovan', 'clock', 'wall clock', 'time', 'alarm clock'],
  box: [-110, -110, 110, 110],
  bleed: 22,
  anchor: 'kadran merkezi (0,0)',
  points: { center: [0, 0], top: [0, -96], hand12: [0, -70] },
  params: {
    color: { type: 'color', default: 'panel2' },
    time: { type: 'number', default: 10.14, desc: 'saat (0-12 arası, ondalıklı): akrep/yelkovan konumu' },
    alarm: { type: 'time', default: null, desc: 'alarm anı: 1 sn titreme + ses dalgaları' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const SH = 'rgba(0,0,0,0.12)', HI = 'rgba(255,255,255,0.10)';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // alarm titremesi
    const d = p.alarm == null ? -1 : t - p.alarm;
    const shaking = d >= 0 && d < 1.0;
    const shx = shaking ? Math.sin(t * 55) * 4 : 0;

    ctx.save();
    ctx.translate(shx, 0);

    const R = 92;
    // gölge + çerçeve
    ctx.fillStyle = SH; ctx.beginPath(); ctx.arc(6, 6, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    // kadran
    ctx.fillStyle = k.rgba('bg', 0.95); ctx.beginPath(); ctx.arc(0, 0, R - 14, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = HI; ctx.beginPath(); ctx.ellipse(-30, -42, 26, 15, -0.5, 0, k.TAU); ctx.fill();

    // saat çizgileri (12 adet)
    for (let i = 0; i < 12; i++) {
      const a = i * k.TAU / 12;
      const big = i % 3 === 0;
      const r1 = R - (big ? 34 : 26), r2 = R - 20;
      ctx.strokeStyle = k.rgba('ink', big ? 0.9 : 0.55);
      ctx.lineWidth = big ? 6 : 3.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }

    // ibreler (açı: 12 yönü = -PI/2)
    const hrs = ((p.time % 12) + 12) % 12;
    const minA = (hrs % 1) * k.TAU - Math.PI / 2;   // yelkovan
    const hrA = (hrs / 12) * k.TAU - Math.PI / 2;   // akrep
    const secA = (t % 60) / 60 * k.TAU - Math.PI / 2; // saniye (canlı)
    const hand = (ang, len, w, col) => {
      ctx.strokeStyle = col; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len); ctx.stroke();
    };
    hand(hrA, 42, 9, k.rgba('ink', 0.9));
    hand(minA, 62, 6, k.rgba('ink', 0.9));
    hand(secA, 68, 3, k.rgba('red', 0.95));  // vurgu: saniye ibresi kırmızı
    // saniye ibresi kuyruğu
    hand(secA + Math.PI, 16, 3, k.rgba('red', 0.95));
    // merkez pimi
    ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); ctx.arc(0, 0, 7, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red'); ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, k.TAU); ctx.fill();

    ctx.restore();

    // alarm ses dalgaları (titreme sırasında)
    if (shaking) {
      for (let w = 0; w < 3; w++) {
        const wp = (d * 2.2 + w / 3) % 1;
        const wr = 100 + wp * 26;
        ctx.strokeStyle = k.rgba('red', (1 - wp) * 0.7);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(shx, 0, wr, -Math.PI / 3.2, Math.PI / 3.2); ctx.stroke();   // sağ
        ctx.beginPath(); ctx.arc(shx, 0, wr, Math.PI - Math.PI / 3.2, Math.PI + Math.PI / 3.2); ctx.stroke(); // sol
      }
    }
  },
};
