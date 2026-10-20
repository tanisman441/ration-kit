// celebration-fx/banner-drop — kutlama bandı: at anında yukarıdan açılır
// (0.4 sn'de açılma + sarkaç sönümlenmeli salınım), sonra hafif sallanır.
// Metin yüzeyi bilgi taşıdığı için parlama metne değil banda uygulanır.
// NOT: canvas y-aşağıdır; (0,0) asılma noktasıdır (çubuk merkezi).
export default {
  name: 'banner-drop', category: 'celebration-fx',
  desc: 'Açılan kutlama bandı: at anında düşüp sallanarak duran, yazılı afiş bandı',
  tags: ['band', 'afiş', 'tebrik', 'kutlama', 'süs', 'yazı', 'banner', 'celebration', 'ribbon', 'congratulations', 'decoration'],
  box: [-235, -45, 235, 130],
  bleed: 40,
  anchor: 'asılma noktası (0,0) — çubuk merkezi',
  points: { hang: [0, 0], left: [-190, 60], right: [190, 60] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'band rengi (tek vurgu rengi)' },
    text: { type: 'text', default: 'TEBRİKLER', desc: 'band üzerindeki yazı' },
    at: { type: 'time', default: null, desc: 'açılma anı: band düşer ve salınarak durur' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? 99 : t - p.at;   // at yoksa band açık durur
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // asma çubuğu: hep görünür
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-206, -10, 412 + 2 * LW / 2, 14 + LW, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-206, -10, 412, 14, 8); ctx.fill();

    if (d < 0) {
      // olay öncesi: yukarı sarılı küçük rulo
      ctx.fillStyle = k.rgba(p.color);
      ctx.strokeStyle = line;
      ctx.lineWidth = LW - 1;
      ctx.beginPath(); k.rrect(-150, -6, 300, 26, 13); ctx.fill(); ctx.stroke();
      ctx.restore();
      return;
    }

    // açılma: 0.45 sn'de tam boy; sarkaç: sönümlenen salınım
    const open = k.E.outCubic(k.clamp(d / 0.45, 0, 1));
    const swing = 0.16 * Math.exp(-d * 1.6) * Math.sin(d * 2 * Math.PI * 1.1)
      + 0.018 * Math.sin(t * 1.7); // yerleştikten sonra hafif sallanma
    ctx.translate(0, 4);
    ctx.rotate(swing);

    const BW = 190, BH = 96;
    const hgt = BH * open;
    if (hgt > 2) {
      // yan kuyruklar (kurdele)
      ctx.fillStyle = k.rgba(p.color, 0.92);
      ctx.strokeStyle = line;
      ctx.lineWidth = LW - 1.5;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(s * BW, 12);
        ctx.lineTo(s * (BW + 44), 30);
        ctx.lineTo(s * (BW + 44), 30 + hgt * 0.7);
        ctx.lineTo(s * (BW + 24), 30 + hgt * 0.7 - 14);
        ctx.lineTo(s * BW, 30 + hgt * 0.7);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      // band gövdesi
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-BW - LW / 2, 6 - LW / 2, 2 * BW + LW, hgt + LW, 16); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); k.rrect(-BW, 6, 2 * BW, hgt, 16); ctx.fill();
      // sağ alt gölge: %12 koyultma
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); k.rrect(-BW + 40, 6 + hgt - 30, 2 * BW - 46, 24, 12); ctx.fill();
      // premium parlama: bandın sol üstünde (metne uygulanmaz)
      if (open > 0.6) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); k.rrect(-BW + 16, 18, 2 * BW - 32, 14, 7); ctx.fill();
      }
      // yazı: taşmayı … ile kırp, parlama YOK
      if (open > 0.75) {
        ctx.font = `700 44px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const maxW = 2 * BW - 40;
        let txt = String(p.text ?? '');
        while (txt.length > 1 && ctx.measureText(txt).width > maxW) txt = txt.slice(0, -1);
        if (txt !== String(p.text ?? '')) txt = txt.slice(0, -1) + '…';
        ctx.fillStyle = k.rgba('ink');
        ctx.fillText(txt, 0, 6 + hgt / 2);
      }
    }
    ctx.restore();
  },
};
