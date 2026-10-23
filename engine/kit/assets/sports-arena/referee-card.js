// sports-arena/referee-card — hakemin kart gösterdiği an.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; üst = negatif y.
// Karakter STYLE.md ailesindendir (basık daire kafa, kalın yuvarlak uzuvlar).
export default {
  name: 'referee-card', category: 'sports-arena',
  desc: 'Hakem figürü: at anında kolunu savurup kırmızı/sarı kartı havaya kaldırır, kart ışıldar',
  tags: ['hakem', 'kart', 'kırmızı kart', 'sarı kart', 'faul', 'referee', 'card', 'red card', 'yellow card', 'foul', 'penalty'],
  box: [-120, -280, 120, 16],
  bleed: 50,
  anchor: 'ayaklar (0,0); kafa merkezi y=-178',
  points: { card: [58, -208], head: [0, -178], whistle: [-14, -132] },
  params: {
    color: { type: 'color', default: 'ink' },
    card: { type: 'enum', values: ['red', 'yellow'], default: 'red', desc: 'gösterilen kartın rengi' },
    at: { type: 'time', default: null, desc: 'kart gösterme anı: kol 0.25 sn\'de kalkar, ışıma 0.6 sn sürer' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const shirt = k.rgba(p.color);
    const cardC = k.rgba(p.card);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };
    const raise = d < 0 ? 0 : sstep(0, 0.25, d);                 // kol kalkışı
    const ease = 1 - Math.pow(1 - raise, 3);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    const bob = Math.sin(t * 2.4) * 2;                          // idle: nefes
    const sway = k.noise1(t * 1.1) * 1.5;                        // idle: hafif salınım

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, 4, 44, 9, 0, 0, k.TAU); ctx.fill();

    // bacaklar + ayaklar
    limb(-11, -52, -15, -4, 17, shirt);
    limb(11, -52, 15, -4, 17, shirt);
    blob(-26, -10, 24, 10, 5, shirt);
    blob(2, -10, 24, 10, 5, shirt);

    // gövde (hakem forması: yakada beyaz şerit)
    blob(-26, -152 + bob, 52, 104, 16, shirt);
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); k.rrect(-5, -152 + bob, 10, 34, 5); ctx.fill();

    // düdük: boyunda asılı
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-8, -146 + bob); ctx.quadraticCurveTo(-18, -128 + bob, -14, -118 + bob); ctx.stroke();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(-14, -114 + bob, 7, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-14, -114 + bob, 7, 0, k.TAU); ctx.stroke();

    // kafa
    const hy = -184 + bob;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(sway * 0.4, hy, 28, 30, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(sway * 0.4, hy, 24, 26, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(sway * 0.4 - 9, hy - 9, 8, 5.5, -0.4, 0, k.TAU); ctx.fill();
    // yüz: kararlı bakış (kart kalkınca gözler büyür)
    const alert = d >= 0.15;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(sway * 0.4 + s * 10, hy - 1, alert ? 4.6 : 3.4, 0, k.TAU); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(sway * 0.4 - 8, hy + 11); ctx.lineTo(sway * 0.4 + 8, hy + 11); ctx.stroke();

    // sol kol: aşağıda sabit
    limb(-22, -140 + bob, -30, -70 + bob, 15, shirt);

    // sağ kol: kartı kaldırır — el konumu aşağıdan yukarıya
    const handX = 34 + 24 * ease, handY = -70 - 140 * ease + bob * (1 - ease);
    const ex = 26 + 20 * ease, ey = (-140 + bob + handY) / 2 + (1 - ease) * 18;
    limb(22, -140 + bob, ex, ey, 15, shirt);
    limb(ex, ey, handX, handY, 12, shirt);

    // kart: elde, kalkışla büyüyerek belirir
    const pop = d < 0 ? 0 : sstep(0, 0.22, d);
    if (pop > 0) {
      const cw = 46 * pop, ch = 62 * pop;
      const cx = handX + 16 * ease, cy = handY - 40 * pop;
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(0.12 * ease); ctx.translate(-cx, -cy);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(cx - cw / 2 - LW / 2, cy - ch / 2 - LW / 2, cw + LW, ch + LW, 8); ctx.fill();
      ctx.fillStyle = cardC; ctx.beginPath(); k.rrect(cx - cw / 2, cy - ch / 2, cw, ch, 6); ctx.fill();
      if (pop > 0.7) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(cx - cw * 0.2, cy - ch * 0.28, cw * 0.16, ch * 0.2, 0.2, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
      // ışıma: 0.6 sn
      if (d < 0.6) {
        const env = 1 - d / 0.6;
        k.glow(cx, cy, 60, p.card, 0.45 * env);
        ctx.strokeStyle = k.rgba(p.card, 0.6 * env);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, 44 + (1 - env) * 40, 0, k.TAU); ctx.stroke();
      }
    }
  },
};
