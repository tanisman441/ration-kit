// shop-display-fx/coupon-flutter — uçuşan indirim kuponu; döngüsel salınım + kenar çırpınması.
// NOT: canvas y-aşağıdır. Idle (döngüsel): kupon sallanır, kenarı çırpınır, küçük hareket çizgileri uçar.
export default {
  name: 'coupon-flutter', category: 'shop-display-fx',
  desc: 'Havada süzülen, kenarı çırpınan indirim kuponu; döngüsel salınım ve uçuş çizgileriyle',
  tags: ['kupon', 'indirim', 'uçuşan', 'fırsat', 'çek', 'coupon', 'voucher', 'flutter', 'discount', 'flying', 'deal'],
  box: [-130, -90, 130, 90],
  bleed: 50,
  anchor: 'kuponun merkezi',
  points: { left: [-110, 0], right: [110, 0], centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round';
    const bob = 10 * Math.sin(t * k.TAU / 1.8);
    const sway = 0.14 * Math.sin(t * k.TAU / 1.8);
    const flutter = 1 + 0.08 * Math.sin(t * k.TAU / 0.45);
    // uçuş çizgileri (arkada, döngüsel kayar)
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const ph = ((t * 0.55 + i * 0.33) % 1);
      const lx = -130 + ph * 70;
      const ly = -50 + i * 34 + 6 * Math.sin(t * 3 + i);
      ctx.globalAlpha = (1 - ph) * 0.7;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 26 * (1 - ph) + 8, ly); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(0, bob);
    ctx.rotate(sway);
    ctx.scale(flutter, 1 / Math.sqrt(flutter));
    // kupon gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-116, -56, 232, 112, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-108, -48, 216, 96, 12); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-68, -32, 34, 9, -0.3, 0, k.TAU); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); k.rrect(58, 8, 50, 40, 10); ctx.fill();
    // koparma çizgisi (kesikli)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(52, -48); ctx.lineTo(52, 48); ctx.stroke();
    ctx.setLineDash([]);
    // sol: makas işareti gibi küçük çentik + indirim yazısı
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba(p.color);
    ctx.font = '800 44px system-ui, sans-serif';
    ctx.fillText('%20', -30, -2);
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.font = '800 20px system-ui, sans-serif';
    ctx.fillText('İNDİRİM', -30, 30);
    // sağ parça: barkod çubukları
    ctx.fillStyle = k.rgba('ink');
    let bx = 66;
    for (let i = 0; bx < 100; i++) {
      const w = 3 + k.hash(i * 4.1) * 5;
      ctx.fillRect(bx, -28, w, 56);
      bx += w + 4;
    }
    ctx.restore();
    ctx.restore();
  },
};
