// retail-fx/price-tag-flip — ipten asılı fiyat etiketi; `at` anında kart çevrilir, yeni fiyat görünür.
// NOT: canvas y-aşağıdır. Idle: ~2.4 sn periyotlu hafif sallanma; flip olayı ~1.2 sn sürer.
export default {
  name: 'price-tag-flip', category: 'retail-fx',
  desc: 'İpten asılı fiyat etiketi; çevrilince eski fiyatın üstü çizilip yeni fiyat görünür',
  tags: ['etiket', 'fiyat', 'çevirme', 'indirim', 'kasa', 'mağaza', 'price', 'tag', 'flip', 'discount', 'label', 'retail'],
  box: [-120, -175, 120, 125],
  bleed: 70,
  anchor: 'etiketin merkezi (0,-10); ip üstten asılı',
  points: { top: [0, -172], tag: [0, -10] },
  params: {
    color: { type: 'color', default: 'green' },
    at: { type: 'time', default: null, desc: 'etiket çevirme anı: kart döner, yeni fiyat belirir (~1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // çevirme: 0–0.45 sn'de scaleX 1→0→1 (ortada yüz değişir, metin hep okunur), sonra sönümlü yalpalanma
    let sx = 1, side = 0, swayExtra = 0;
    if (d >= 0) {
      if (d < 0.45) {
        const q = k.E.inOutCubic(k.prog(d, 0, 0.45));
        sx = Math.abs(Math.cos(q * Math.PI));
        side = q < 0.5 ? 0 : 1;
      } else {
        side = 1;
        swayExtra = 0.12 * Math.exp(-4 * (d - 0.45)) * Math.cos(16 * (d - 0.45));
      }
    }
    const sway = 0.05 * Math.sin(t * k.TAU / 2.4) + swayExtra;

    // ip (serbest asılı çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -172); ctx.lineTo(0, -78); ctx.stroke();

    // kart (sallanır + yatay eksende çevrilir)
    ctx.save();
    ctx.translate(0, -10); ctx.rotate(sway); ctx.scale(sx, 1); ctx.translate(0, 10);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-82, -70, 164, 120, 20); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-74, -62, 148, 104, 16); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); k.rrect(-68, 2, 142, 34, 12); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-42, -48, 32, 8, -0.3, 0, k.TAU); ctx.fill();
    // ip deliği
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(0, -56, 8, 0, k.TAU); ctx.fill();

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (side === 0) {
      // ÖN YÜZ: eski fiyat, üstü çizili
      ctx.fillStyle = k.rgba('ink');
      ctx.font = '800 44px system-ui, sans-serif';
      ctx.fillText('₺129', 0, 2);
      ctx.strokeStyle = k.rgba('red', 0.9); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(-52, 0); ctx.lineTo(52, 4); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.6);
      ctx.font = '700 20px system-ui, sans-serif';
      ctx.fillText('ESKİ FİYAT', 0, -34);
    } else {
      // ARKA YÜZ: yeni fiyat
      ctx.fillStyle = k.rgba(p.color);
      ctx.font = '800 48px system-ui, sans-serif';
      ctx.fillText('₺89', 0, 4);
      ctx.fillStyle = k.rgba('ink');
      ctx.font = '700 20px system-ui, sans-serif';
      ctx.fillText('YENİ FİYAT', 0, -34);
    }
    ctx.restore();

    // çevirme parıltısı: flip sırasında kart kenarında ışık şeridi
    if (d >= 0 && d < 0.5) {
      const a = Math.sin(k.prog(d, 0, 0.5) * Math.PI);
      ctx.strokeStyle = k.rgba(p.color, 0.5 * a); ctx.lineWidth = 8;
      ctx.save(); ctx.translate(0, -10); ctx.rotate(sway);
      ctx.beginPath(); ctx.moveTo(sx * 70, -52); ctx.lineTo(sx * 70, 42); ctx.stroke();
      ctx.restore();
    }
  },
};
