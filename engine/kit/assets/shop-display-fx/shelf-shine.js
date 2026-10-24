// shop-display-fx/shelf-shine — mağaza rafı; `at` anında parlama süpürür, ürünler sırayla parlar.
// NOT: canvas y-aşağıdır. Idle: orta ürün 2.4 sn'de bir hafifçe parlar; at olayı ~1.3 sn sürer.
export default {
  name: 'shelf-shine', category: 'shop-display-fx',
  desc: 'Üzerinde üç ürün olan mağaza rafı; parlama anında ışık soldan sağa süpürür',
  tags: ['raf', 'vitrin', 'ürün', 'parlama', 'mağaza', 'dükkan', 'shelf', 'shine', 'display', 'products', 'shop', 'store'],
  box: [-150, -110, 150, 110],
  bleed: 50,
  anchor: 'raf tablasının merkezi (0, 70)',
  points: { shelf: [0, 70], left: [-90, 0], mid: [0, 0], right: [90, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
    at: { type: 'time', default: null, desc: 'parlama anı: ışık bandı soldan sağa süpürür + ürünler sırayla parlar (1.3 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const sweep = d < 0 ? -1 : k.prog(d, 0, 1.0);
    const sx = -150 + sweep * 300;
    // raf tablası
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-142, 62, 284, 26, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-134, 68, 268, 18, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-90, 72, 40, 5, -0.2, 0, k.TAU); ctx.fill();
    // raf ayakları
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.fillRect(-128, 88, 10, 18);
    ctx.fillRect(118, 88, 10, 18);
    // üç ürün: şişe, kavanoz, kutu
    const products = [
      { x: -90, w: 40, h: 90, kind: 0 },
      { x: 0, w: 52, h: 74, kind: 1 },
      { x: 90, w: 44, h: 96, kind: 2 },
    ];
    products.forEach((pr, i) => {
      const x0 = pr.x - pr.w / 2, y1 = 62;
      // ürün gölge tonu (sağ alt)
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x0 - 4, y1 - pr.h - 4, pr.w + 8, pr.h + 4, 12); ctx.fill();
      ctx.fillStyle = i === 1 ? k.rgba(p.color, 0.9) : k.rgba('dim');
      if (pr.kind === 1) {
        ctx.beginPath(); k.rrect(x0, y1 - pr.h, pr.w, pr.h, 12); ctx.fill();
      } else {
        ctx.beginPath(); k.rrect(x0, y1 - pr.h, pr.w, pr.h, 10); ctx.fill();
        // şişe boynu / kutu kapağı
        ctx.fillStyle = k.rgba('ink', 0.7);
        ctx.fillRect(x0 + pr.w / 2 - 7, y1 - pr.h - 12, 14, 14);
      }
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x0 + pr.w * 0.3, y1 - pr.h + 14, pr.w * 0.28, 6, -0.3, 0, k.TAU); ctx.fill();
      // etiket
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(x0 + 6, y1 - pr.h * 0.55, pr.w - 12, 26, 6); ctx.fill();
      // parıltı: at anında sırayla, boşta ortada hafif nabız
      const seq = d >= 0 && k.prog(d, i * 0.25, i * 0.25 + 0.5);
      const idle = i === 1 ? 0.35 + 0.3 * Math.sin(t * k.TAU / 2.4) : 0;
      const glint = Math.max(seq > 0 && seq < 1 ? (1 - seq) : 0, d < 0 ? idle : 0);
      if (glint > 0.05) {
        const gx = pr.x, gy = y1 - pr.h / 2;
        const gs = 8 + glint * 14;
        ctx.fillStyle = k.rgba('yellow', 0.85 * glint);
        ctx.beginPath();
        ctx.moveTo(gx, gy - gs); ctx.lineTo(gx + gs * 0.3, gy - gs * 0.3); ctx.lineTo(gx + gs, gy);
        ctx.lineTo(gx + gs * 0.3, gy + gs * 0.3); ctx.lineTo(gx, gy + gs); ctx.lineTo(gx - gs * 0.3, gy + gs * 0.3);
        ctx.lineTo(gx - gs, gy); ctx.lineTo(gx - gs * 0.3, gy - gs * 0.3); ctx.closePath(); ctx.fill();
      }
    });
    // süpürme bandı (at anında, eğik parlak şerit)
    if (d >= 0 && d < 1.3) {
      const bandA = 0.28 * (1 - k.prog(d, 0.7, 1.3));
      ctx.save();
      ctx.beginPath(); ctx.rect(-150, -110, 300, 220); ctx.clip();
      ctx.fillStyle = k.rgba('yellow', bandA);
      ctx.beginPath();
      ctx.moveTo(sx - 22, -110); ctx.lineTo(sx + 6, -110); ctx.lineTo(sx - 22, 110); ctx.lineTo(sx - 50, 110);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', bandA * 0.6);
      ctx.beginPath();
      ctx.moveTo(sx + 10, -110); ctx.lineTo(sx + 20, -110); ctx.lineTo(sx - 10, 110); ctx.lineTo(sx - 20, 110);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
};
