// economy/shopping-cart — yandan görünüm alışveriş sepeti: sepet, tutamak,
// tekerlekler. full arttıkça sepete ürün kutuları dolar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) tekerlek tabanındadır.
export default {
  name: 'shopping-cart', category: 'economy',
  desc: 'Alışveriş sepeti; full 0-1 arasında sepete ürün kutuları dolar',
  tags: ['sepet', 'alışveriş', 'shopping', 'cart', 'market', 'trolley', 'satın al'],
  box: [-120, -148, 80, 26],
  bleed: 10,
  anchor: 'tekerlek tabanı (0,0)',
  points: { handle: [-102, -134], basket: [0, -78] },
  params: {
    color: { type: 'color', default: 'dim' },
    full: { type: 'number', default: 0.5, desc: 'sepet doluluğu (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // sepet gövdesi (yamuk): üst geniş, alt dar
    const trap = [[-84, -112], [58, -112], [38, -42], [-62, -42]];
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath();
    trap.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]));
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle = body;
    ctx.beginPath();
    trap.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]));
    ctx.closePath(); ctx.fill();

    // sepet ızgarası (iç ayrım çizgileri)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    [-58, -32, -6, 20, 44].forEach(x => {
      const tt = (x + 84) / 142; // üst kenarda oran
      const bx = -62 + tt * 100; // alt kenarda karşılık
      ctx.beginPath(); ctx.moveTo(x, -108); ctx.lineTo(bx, -46); ctx.stroke();
    });
    [-88, -64].forEach(y => {
      ctx.beginPath(); ctx.moveTo(-78, y); ctx.lineTo(52, y); ctx.stroke();
    });

    // ürünler (full'e göre)
    const cnt = Math.round(k.clamp(p.full, 0, 1) * 4);
    const spots = [[-52, -96, 30, 24], [-12, -100, 34, 28], [28, -94, 28, 22], [-32, -70, 30, 24]];
    for (let i = 0; i < cnt; i++) {
      const s = spots[i], cx = s[0] + s[2] / 2, cy = s[1] + s[3] / 2;
      const rot = (k.hash(i * 13 + 5) - 0.5) * 0.25;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-s[2] / 2 - 2, -s[3] / 2 - 2, s[2] + 4, s[3] + 4, 5); ctx.fill();
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); k.rrect(-s[2] / 2, -s[3] / 2, s[2], s[3], 5); ctx.fill();
      ctx.restore();
    }

    // tutamak
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-84, -112); ctx.lineTo(-104, -136); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-84, -112); ctx.lineTo(-104, -136); ctx.stroke();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-120, -146, 34, 16, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-116, -142, 26, 8, 4); ctx.fill();

    // ayaklar + tekerlekler
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-52, -42); ctx.lineTo(-48, -14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28, -42); ctx.lineTo(32, -14); ctx.stroke();
    [[-48, -8], [32, -8]].forEach(w => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(w[0], w[1], 12, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel'); ctx.beginPath(); ctx.arc(w[0], w[1], 8, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.7); ctx.beginPath(); ctx.arc(w[0], w[1], 3, 0, k.TAU); ctx.fill();
    });
    // alt raf çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-52, -30); ctx.lineTo(30, -30); ctx.stroke();

    // premium parlama (sepet sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -100, 18, 8, -0.3, 0, k.TAU); ctx.fill();

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(0, 12, 62, 8, 0, 0, k.TAU); ctx.fill();
  },
};
