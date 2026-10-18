// sports/trophy — kupa: klasik kupa formu + iki kulp + kaide, hafif ışıltı
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) kaidenin taban ortasıdır.
export default {
  name: 'trophy', category: 'sports',
  desc: 'Klasik kupa: iki kulplu altın kupa ve kaide; 2-3 saniyede bir ışıltı parlar',
  tags: ['kupa', 'trophy', 'şampiyon', 'cup', 'kazanan', 'winner', 'şampiyonluk', 'ödül', 'award', 'spor'],
  box: [-90, -150, 90, 10],
  bleed: 30,
  anchor: 'kaidenin taban ortası (0,0)',
  points: { top: [0, -138] },
  params: {
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const metal = k.rgba(p.color), line = k.rgba('bg', 0.55);

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // kaide (rrect) — zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(6, 8, 58, 7, 0, 0, k.TAU); ctx.fill();

    // kulplar (arka katman): iki yay kulp
    ctx.lineWidth = 13; ctx.strokeStyle = line;
    ctx.beginPath(); ctx.arc(-52, -92, 22, Math.PI * 0.35, Math.PI * 1.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(52, -92, 22, -Math.PI * 0.25, Math.PI * 0.65); ctx.stroke();
    ctx.lineWidth = 8; ctx.strokeStyle = metal;
    ctx.beginPath(); ctx.arc(-52, -92, 22, Math.PI * 0.35, Math.PI * 1.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(52, -92, 22, -Math.PI * 0.25, Math.PI * 0.65); ctx.stroke();

    // kupa gövdesi: trapez kadeh
    ctx.beginPath();
    ctx.moveTo(-44, -130); ctx.lineTo(44, -130);
    ctx.lineTo(28, -74); ctx.lineTo(-28, -74);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.save(); ctx.translate(6, 6); ctx.fill(); ctx.restore();
    ctx.fillStyle = line; ctx.fill();
    ctx.save(); ctx.translate(0, -3); ctx.fillStyle = metal; ctx.fill(); ctx.restore();

    // gövde iç detayı: ince kabartma şerit (ink 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-38, -112); ctx.lineTo(38, -112); ctx.stroke();

    // kupa sapı
    ctx.fillStyle = line; ctx.fillRect(-8, -74, 16, 22);
    ctx.fillStyle = metal; ctx.fillRect(-6, -74, 12, 22);

    // kaide: üst parça + taban
    ctx.beginPath(); k.rrect(-34, -52, 68, 20, 8); ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(6, 6); ctx.fill(); ctx.restore();
    ctx.beginPath(); k.rrect(-34, -52, 68, 20, 8); ctx.fillStyle = line; ctx.fill();
    ctx.beginPath(); k.rrect(-32, -54, 64, 18, 8); ctx.fillStyle = k.rgba('panel2'); ctx.fill();

    ctx.beginPath(); k.rrect(-52, -32, 104, 32, 8); ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(6, 6); ctx.fill(); ctx.restore();
    ctx.beginPath(); k.rrect(-52, -32, 104, 32, 8); ctx.fillStyle = line; ctx.fill();
    ctx.beginPath(); k.rrect(-50, -34, 100, 30, 8); ctx.fillStyle = metal; ctx.fill();

    // premium parlama (sol üst, kupa gövdesi)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, -108, 13, 20, 0.35, 0, k.TAU); ctx.fill();

    // ışıltı: 2.6 sn periyotta 0.3 sn parlayan yıldız (k.hash ile faz kayması yok)
    const ph = t % 2.6;
    if (ph < 0.3) {
      const a = 1 - ph / 0.3;
      const sx = 34, sy = -118;
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(0.4);
      ctx.fillStyle = `rgba(255,255,255,${0.9 * a})`;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = i * Math.PI / 4, rr = i % 2 ? 5 : 13 * (0.6 + 0.4 * a);
        const x = Math.cos(ang) * rr, y = Math.sin(ang) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.fillStyle = k.rgba('yellow', 0.5 * a);
      ctx.beginPath(); ctx.arc(sx, sy, 6, 0, k.TAU); ctx.fill();
    }
  },
};
