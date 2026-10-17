// economy/credit-card — kredi kartı: ön yüzde çip + numara, flip anında
// dönerek arka yüze geçer (manyetik şerit + imza bandı).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) merkezdir.
export default {
  name: 'credit-card', category: 'economy',
  desc: 'Kredi kartı; flip anında dönerek arka yüze geçer (manyetik şeritli)',
  tags: ['kredi kartı', 'kart', 'credit', 'card', 'ödeme', 'payment', 'banka kartı'],
  box: [-132, -88, 132, 88],
  bleed: 12,
  anchor: 'merkez (0,0)',
  points: { chip: [-72, -34], corner: [108, -62] },
  params: {
    color: { type: 'color', default: 'panel2' },
    flip: { type: 'time', default: null, desc: 'çevirme anı (0.45 sn dönüş)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6, W = 240, H = 150, R = 18;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.flip == null ? -1 : t - p.flip;
    const phase = d < 0 ? 0 : Math.min(d / 0.45, 1);
    const sx = Math.cos(phase * Math.PI);
    const w = Math.max(Math.abs(sx), 0.05);
    const back = phase > 0.5;

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(8, H / 2 + 12, W / 2 * w, 9, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.scale(w, 1);

    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-W / 2 - LW / 2, -H / 2 - LW / 2, W + LW, H + LW, R + 4); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();

    if (!back) {
      // ÖN YÜZ: çip
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-96, -52, 50, 38, 8); ctx.fill();
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); k.rrect(-93, -49, 44, 32, 6); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-93, -33); ctx.lineTo(-49, -33); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-71, -49); ctx.lineTo(-71, -17); ctx.stroke();
      // kart numarası (4 grup çizgi)
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 5;
      for (let g = 0; g < 4; g++) {
        const gx = -96 + g * 52;
        ctx.beginPath(); ctx.moveTo(gx, 28); ctx.lineTo(gx + 36, 28); ctx.stroke();
      }
      // isim çizgisi
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-96, 52); ctx.lineTo(-20, 52); ctx.stroke();
      // marka: iki kesişen daire
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.arc(78, 42, 17, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(96, 42, 17, 0, k.TAU); ctx.stroke();
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-70, -52, 44, 12, -0.3, 0, k.TAU); ctx.fill();
    } else {
      // ARKA YÜZ: manyetik şerit
      ctx.fillStyle = k.rgba('bg', 0.9);
      ctx.beginPath(); k.rrect(-W / 2 + 8, -H / 2 + 12, W - 16, 34, 6); ctx.fill();
      // imza bandı
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); k.rrect(-W / 2 + 16, -2, 130, 30, 6); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-W / 2 + 26, 13); ctx.quadraticCurveTo(-60, 4, -30, 14); ctx.stroke();
      // güvenlik kodu kutusu
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(60, -2, 44, 30, 6); ctx.fill();
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); k.rrect(63, 1, 38, 24, 4); ctx.fill();
      // alt bilgi çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-W / 2 + 16, 48); ctx.lineTo(40, 48); ctx.stroke();
    }
    ctx.restore();
  },
};
