// classroom-fx/page-flip — açık kitap: at anında sağ sayfa 0.4 snde yaylanarak sola çevrilir
// (öngörünüm daralması + yukarı yay), idle'da sağ sayfa köşesi hafifçe kıpırdar.
// canvas y-aşağı; (0,0) kitap merkezi (cilt).
export default {
  name: 'page-flip', category: 'classroom-fx',
  desc: 'Kitap sayfası çevirme: sağ sayfa 0.4 snde sola uçar, köşe idle kıpırdanır',
  tags: ['kitap', 'sayfa', 'sayfa çevirme', 'okuma', 'book', 'page', 'flip', 'reading', 'ders', 'study'],
  box: [-110, -62, 110, 62],
  bleed: 16,
  anchor: 'kitap merkezi (cilt)',
  points: { spine: [0, 0], corner: [88, 44] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'kapak rengi' },
    at: { type: 'time', default: null, desc: 'sayfa çevirme anı (0.4 sn dönme)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const flip = d >= 0 && d < 0.4 ? k.prog(d, 0, 0.4) : (d >= 0.4 ? 1 : -1);
    ctx.lineCap = 'round';

    // gölge (sağ alt)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-94, -44, 200, 96, 10); ctx.fill();

    // kapak
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-104, -54, 208, 108, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-100, -50, 200, 100, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, -34, 36, 12, -0.25, 0, k.TAU); ctx.fill();

    // metin satırları yardımcısı (x0..x1 aralığında 4 satır)
    const lines = (x0, x1, lift, a) => {
      ctx.strokeStyle = k.rgba('ink', a); ctx.lineWidth = 3;
      for (let r = 0; r < 4; r++) {
        const y = -24 + r * 16 + lift * (r === 0 ? 1 : 0.3);
        const lx0 = k.lerp(x0, x1, 0.1), lx1 = k.lerp(x0, x1, 0.85 - r * 0.08);
        ctx.beginPath(); ctx.moveTo(lx0, y); ctx.lineTo(lx1, y); ctx.stroke();
      }
    };

    // sol sayfa (çevirme sonrası çift sayfa kenarı görünür)
    ctx.fillStyle = k.rgba('panel', 1);
    ctx.beginPath();
    ctx.moveTo(-92, -42); ctx.lineTo(-6, -42); ctx.lineTo(-6, 42); ctx.lineTo(-92, 42);
    ctx.closePath(); ctx.fill();
    lines(-84, -14, 0, 0.55);
    if (flip >= 1) lines(-80, -20, -4, 0.3);   // çevrilen sayfanın alt kenarı

    // sağ sayfa: idle köşe kıpırdanması, çevirmede uçan sayfa
    const sway = 5 + 4 * Math.sin(t * 1.5);
    if (flip < 0) {
      ctx.fillStyle = k.rgba('panel', 1);
      ctx.beginPath();
      ctx.moveTo(6, -42); ctx.lineTo(92, -42 - sway); ctx.lineTo(92, 42); ctx.lineTo(6, 42);
      ctx.closePath(); ctx.fill();
      lines(14, 80, 0, 0.55);
    } else if (flip < 1) {
      const th = Math.PI * flip;
      const w = 86 * Math.cos(th);            // öngörünüm daralması
      const lift = 26 * Math.sin(th);         // yukarı yay
      const x0 = 6, x1 = 6 + w;
      ctx.fillStyle = k.rgba('panel', 1);
      ctx.beginPath();
      ctx.moveTo(x0, -42 - lift); ctx.lineTo(x1, -42 - lift); ctx.lineTo(x1, 42 - lift); ctx.lineTo(x0, 42 - lift);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
      if (Math.abs(w) > 12) lines(x0, x1, -lift, 0.5 * Math.abs(Math.cos(th)));
      // çevirme gölgesi: sağ sayfa yuvasında kalan koyu iz
      ctx.fillStyle = k.rgba('bg', 0.25 * Math.sin(th));
      ctx.beginPath();
      ctx.moveTo(6, -42); ctx.lineTo(92, -42); ctx.lineTo(92, 42); ctx.lineTo(6, 42);
      ctx.closePath(); ctx.fill();
    } else {
      // çevirme bitti: sağ yuva boş (kapak görünür), cilt çizgisi
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(0, 44); ctx.stroke();
    }
    ctx.restore();
  },
};
