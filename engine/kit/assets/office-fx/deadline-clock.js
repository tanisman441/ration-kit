// office-fx/deadline-clock — analog saat: canlı idle — saniye ibresi döner
// (60 sn/tur), akrep/yelkovan orantılı; her dakikanın son 8 saniyesinde kırmızı
// nabız (çerçevede glow + hafif büyüme + geri sayım yayı). canvas y-aşağı; (0,0) kadran merkezi.
export default {
  name: 'deadline-clock', category: 'office-fx',
  desc: 'Canlı saat: ibreler döner, son 8 saniyede kırmızı nabız atar',
  tags: ['saat', 'zaman', 'son tarih', 'geri sayım', 'deadline', 'clock', 'time', 'countdown', 'ofis', 'office', 'süre'],
  box: [-110, -110, 110, 110],
  bleed: 34,
  anchor: 'kadran merkezi',
  points: { center: [0, 0], rim: [0, -78] },
  params: {
    color: { type: 'color', default: 'red', desc: 'çerçeve / uyarı rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const cyc = ((t % 60) + 60) % 60;
    const urg = k.clamp((cyc - 52) / 8, 0, 1);   // son 8 sn: 0 → 1
    const pulse = urg * (0.6 + 0.4 * Math.sin(t * 12));

    if (pulse > 0.02) k.glow(0, 0, 92, p.color, 0.4 * pulse);
    ctx.scale(1 + 0.02 * pulse, 1 + 0.02 * pulse);

    // gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(6, 8, 78, 0, k.TAU); ctx.fill();
    // çerçeve
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, 82, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.arc(0, 0, 78, 0, k.TAU); ctx.fill();
    // kadran
    ctx.fillStyle = k.rgba('panel', 1);
    ctx.beginPath(); ctx.arc(0, 0, 66, 0, k.TAU); ctx.fill();
    // dakika çizgileri
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * k.TAU - Math.PI / 2;
      const big = i % 3 === 0;
      ctx.strokeStyle = k.rgba('ink', big ? 0.8 : 0.45);
      ctx.lineWidth = big ? 5 : 3; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(54 * Math.cos(a), 54 * Math.sin(a));
      ctx.lineTo((big ? 44 : 48) * Math.cos(a), (big ? 44 : 48) * Math.sin(a));
      ctx.stroke();
    }

    // ibreler (y-aşağı: açı -PI/2'den başlar)
    const secA = (cyc / 60) * k.TAU - Math.PI / 2;
    const minA = ((t % 3600) / 3600) * k.TAU - Math.PI / 2;
    const hrA = ((t % 43200) / 43200) * k.TAU - Math.PI / 2;
    const hand = (a, len, w, col, al) => {
      ctx.strokeStyle = k.rgba(col, al); ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-8 * Math.cos(a), -8 * Math.sin(a));
      ctx.lineTo(len * Math.cos(a), len * Math.sin(a)); ctx.stroke();
    };
    hand(hrA, 34, 9, 'ink', 0.9);
    hand(minA, 50, 7, 'ink', 0.9);
    hand(secA, 56, 4, p.color, 1);
    // mil
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, k.TAU); ctx.fill();

    // geri sayım yayı (son 8 sn, çerçeve üstünde)
    if (urg > 0) {
      ctx.strokeStyle = k.rgba(p.color, 0.85);
      ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, 78, -Math.PI / 2, -Math.PI / 2 + urg * k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
