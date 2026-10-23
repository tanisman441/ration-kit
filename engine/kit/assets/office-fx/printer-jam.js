// office-fx/printer-jam — kağıt sıkışmış yazıcı: canlı idle animasyon — gövde
// kağıt sıkışma titremesi (±1.5, noise1), sıkışık kağıt sağa-sola seğirir, kırmızı
// uyarı ışığı 1.2 sn periyotta yanıp söner. canvas y-aşağı; (0,0) yazıcı tabanı.
export default {
  name: 'printer-jam', category: 'office-fx',
  desc: 'Kağıdı sıkışmış yazıcı: gövde titrer, uyarı ışığı yanıp söner',
  tags: ['yazıcı', 'kağıt sıkışması', 'hata', 'arıza', 'uyarı', 'printer', 'jam', 'paper jam', 'ofis', 'office', 'error'],
  box: [-130, -170, 130, 70],
  bleed: 30,
  anchor: 'yazıcı tabanı',
  points: { slot: [0, -96], light: [88, -52] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'yazıcı gövde rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    // sıkışma titremesi: gövde ±1.5
    ctx.translate(1.5 * k.noise1(t * 3.1), 1.5 * k.noise1(t * 4.3 + 9));

    // gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-106, 46, 220, 22, 10); ctx.fill();
    // gövde
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-114, -44, 228, 96, 18); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-110, -40, 220, 88, 16); ctx.fill();
    // parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -26, 44, 10, -0.15, 0, k.TAU); ctx.fill();
    // ön kapak çizgisi (iç ayrım)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-88, 18); ctx.lineTo(88, 18); ctx.stroke();
    // çıkış yuvası
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); k.rrect(-70, 26, 140, 12, 6); ctx.fill();

    // sıkışık kağıt: yuvadan eğik çıkar, seğirir
    ctx.save();
    ctx.translate(0, -40);
    ctx.rotate(0.22 + 0.06 * Math.sin(t * 7.3));
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-34, -122, 68, 122, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel', 1);
    ctx.beginPath(); k.rrect(-30, -118, 60, 118, 5); ctx.fill();
    // buruşukluk çizgileri (sıkışma izi)
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-22, -60); ctx.lineTo(-6, -48); ctx.lineTo(-20, -36);
    ctx.moveTo(8, -72); ctx.lineTo(22, -60); ctx.lineTo(10, -48);
    ctx.stroke();
    ctx.restore();

    // sıkışma kıvılcım çizgileri (yuvada, titrek)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const jx = -46 + i * 46 + 3 * k.noise1(t * 6 + i * 5);
      ctx.beginPath(); ctx.moveTo(jx, -44); ctx.lineTo(jx + 4 * k.noise1(t * 8 + i), -58); ctx.stroke();
    }

    // uyarı ışığı: 1.2 sn periyot, 0.5 sn yanık
    const on = (t % 1.2) < 0.5;
    if (on) k.glow(88, -52, 26, 'red', 0.45);
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(88, -52, 12, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red', on ? 1 : 0.35);
    ctx.beginPath(); ctx.arc(88, -52, 9, 0, k.TAU); ctx.fill();
    // ünlem işareti
    ctx.fillStyle = k.rgba('bg', on ? 0.8 : 0.4);
    ctx.fillRect(86.5, -58, 3, 8); ctx.fillRect(86.5, -48, 3, 3);
    ctx.restore();
  },
};
