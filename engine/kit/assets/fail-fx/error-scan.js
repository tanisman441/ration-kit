// fail-fx/error-scan — hata taraması: at anında kırmızı tarama çizgisi paneli süpürür
// (0.5 sn), uyarı üçgeni belirir; idle'da üçgende yavaş nabız. Tek vurgu rengi: red.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'error-scan',
  category: 'fail-fx',
  desc: 'Kırmızı tarama çizgili panel ve beliren uyarı üçgeni',
  tags: ['tarama', 'hata', 'uyarı', 'tarayıcı', 'tehlike', 'arama', 'error', 'scan', 'warning', 'alert', 'fail'],
  box: [-115, -95, 115, 95],
  bleed: 35,
  anchor: 'panel merkezi (0,0)',
  points: { top: [0, -75], center: [0, 0], warning: [42, 18] },
  params: {
    at: { type: 'time', default: null, desc: 'tarama anı: 0.5 sn kırmızı çizgi geçişi + uyarı üçgeni' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const W = 200, H = 150, R = 16;
    const scanning = d >= 0 && d < 0.7;
    const triOn = d >= 0; // üçgen at ile belirir

    // --- panel gövdesi ---
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-W / 2 + 6, -H / 2 + 6, W, H, R); ctx.fill();
    // gövde
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    // iç yüzey
    ctx.fillStyle = k.rgba('dim', 0.35);
    ctx.beginPath(); k.rrect(-W / 2 + 10, -H / 2 + 10, W - 20, H - 20, R - 6); ctx.fill();
    // dış hat
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.stroke();
    // sol üst parlama (premium, alfa 0.11)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(-W / 2 + 54, -H / 2 + 20, 56, 16, -0.35, 0, k.TAU);
    ctx.fill();
    // soyut içerik çizgileri (bilgi taşımaz)
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = k.rgba('ink', 0.3);
      const lw = 130 - i * 18;
      ctx.beginPath(); k.rrect(-W / 2 + 20, -H / 2 + 26 + i * 20, lw, 8, 4); ctx.fill();
    }

    // --- tarama çizgisi: 0.5 sn'de yukarıdan aşağıya süpürme ---
    if (scanning) {
      const y = k.lerp(-H / 2 + 6, H / 2 - 6, k.E.outCubic(k.prog(d, 0, 0.5)));
      const fade = 1 - k.prog(d, 0.55, 0.7);
      k.glow(0, y, 40, p.color, 0.45 * fade);
      ctx.fillStyle = k.rgba(p.color, 0.95 * fade);
      ctx.fillRect(-W / 2 + 10, y - 3, W - 20, 6);
      // çizginin üstünde kalan alanı hafif kırmızılaştır
      ctx.fillStyle = k.rgba(p.color, 0.08 * fade);
      ctx.fillRect(-W / 2 + 10, -H / 2 + 10, W - 20, y + H / 2 - 10);
    }

    // --- uyarı üçgeni: at ile pop, idle'da yavaş nabız ---
    if (triOn) {
      const pop = d < 0.25
        ? k.E.outBack(k.prog(d, 0, 0.25))
        : 1 + 0.045 * Math.sin(t * k.TAU / 2.4); // idle nabız (~2.4 sn)
      const tx = 42, ty = 18, tri = 40;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.scale(pop, pop);
      // dış hat (bg)
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath();
      ctx.moveTo(0, -tri - 7); ctx.lineTo(tri + 6, tri * 0.82); ctx.lineTo(-tri - 6, tri * 0.82);
      ctx.closePath(); ctx.fill();
      // üçgen (red vurgu)
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath();
      ctx.moveTo(0, -tri); ctx.lineTo(tri, tri * 0.82); ctx.lineTo(-tri, tri * 0.82);
      ctx.closePath(); ctx.fill();
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(-11, -14, 12, 7, -0.5, 0, k.TAU); ctx.fill();
      // ünlem (ink)
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); k.rrect(-6, -20, 12, 30, 6); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 20, 6.5, 0, k.TAU); ctx.fill();
      ctx.restore();
      // nabızla birlikte hafif glow
      const pulse = d < 0.25 ? 1 : 0.5 + 0.5 * Math.sin(t * k.TAU / 2.4);
      k.glow(tx, ty, 52, p.color, 0.25 * pulse);
    }
  },
};
