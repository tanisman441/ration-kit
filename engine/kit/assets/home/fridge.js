// home/fridge — önden çift kapılı buzdolabı; motor titrer, open anında kapak açılıp ışık yanar
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) buzdolabının merkezidir.
export default {
  name: 'fridge', category: 'home',
  desc: 'Önden çift kapılı buzdolabı; motoru hafif titrer, open anında alt kapak açılır ve iç ışık yanar',
  tags: ['buzdolabı', 'fridge', 'refrigerator', 'mutfak', 'kitchen', 'soğutucu', 'ev', 'home'],
  box: [-110, -105, 110, 105],
  bleed: 45,
  anchor: 'buzdolabının merkezi (0,0); zemin y=98',
  points: { door: [45, 30], handle: [52, 20], top: [0, -88] },
  params: {
    open: { type: 'time', default: null, desc: 'kapak açılma anı (açılır, durur, kapanır; 1.2 sn)' },
    color: { type: 'color', default: 'dim', desc: 'gövde rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), shadow = 'rgba(0,0,0,0.12)', gloss = 'rgba(255,255,255,0.10)';
    const d = p.open == null ? -1 : t - p.open;
    // idle: motor titreşimi (yatay ±1.5 units)
    const hum = k.noise1(t * 3 + 0.7) * 1.5;
    // open olayı: 0→0.35 açılır, 0.85'e kadar açık, 1.2'de kapanır
    let ang = 0; // kapak açısı (rad)
    if (d >= 0 && d < 1.2) {
      if (d < 0.35) ang = k.E.outCubic(d / 0.35) * 1.05;
      else if (d < 0.85) ang = 1.05;
      else ang = (1 - k.E.inOutCubic((d - 0.85) / 0.35)) * 1.05;
    }
    const openK = ang / 1.05; // 0 kapalı, 1 tam açık

    ctx.save();
    ctx.translate(hum, 0);

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-104, 92); ctx.lineTo(104, 92); ctx.stroke();

    // gövde dış çerçevesi
    ctx.fillStyle = shadow; k.rrect(-64, -79, 140, 176, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-70, -85, 140, 176, 12); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-70, -85, 140, 176, 12); ctx.stroke();

    // üst kapak (dondurucu) — sabit
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-62, -77, 124, 52, 8); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    k.rrect(-62, -77, 124, 52, 8); ctx.stroke();
    // üst kapak kolu
    ctx.fillStyle = k.rgba('ink');
    k.rrect(46, -68, 10, 30, 5); ctx.fill();
    // üst kapak parlama (sol üst)
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(-52, -68, 6, 12, 0.15, 0, k.TAU); ctx.fill();

    // alt kapak iç boşluğu (kapak açılınca görünür)
    const cavity = () => {
      ctx.fillStyle = k.rgba('bg', 0.92);
      k.rrect(-62, -17, 124, 100, 6); ctx.fill();
      // iç arka panel derinliği (sol üst parlama)
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      k.rrect(-62, -17, 44, 100, 6); ctx.fill();
      // raflar
      ctx.strokeStyle = k.rgba('dim', 0.8); ctx.lineWidth = 4;
      for (const ry of [12, 42]) {
        ctx.beginPath(); ctx.moveTo(-56, ry); ctx.lineTo(56, ry); ctx.stroke();
      }
      // içindeki yiyecek siluetleri
      ctx.fillStyle = k.rgba('accent', 0.7);
      k.rrect(-50, -8, 18, 18, 4); ctx.fill();
      ctx.fillStyle = k.rgba('green', 0.7);
      ctx.beginPath(); ctx.arc(20, 4, 10, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.7);
      k.rrect(40, 50, 14, 26, 4); ctx.fill();
    };

    // iç ışık (açılma ilerledikçe güçlenir)
    if (openK > 0.02) {
      k.glow(0, 32, 95, 'yellow', 0.35 * openK);
      ctx.save(); ctx.globalAlpha = 0.28 * openK;
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath();
      ctx.moveTo(-62, -17); ctx.lineTo(62, -17);
      ctx.lineTo(96, 92); ctx.lineTo(-96, 92);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    if (openK > 0.02) {
      cavity();
      // açılan kapak: sol menteşeden döner (perspektif yamuk)
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const hx = -62, dw = 124;
      const rx = hx + dw * ca, lift = -34 * sa;
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.moveTo(hx + 6, -17 + 6); ctx.lineTo(rx + 6, -17 + lift + 6);
      ctx.lineTo(rx + 6, 83 + lift + 6); ctx.lineTo(hx + 6, 83 + 6);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath();
      ctx.moveTo(hx, -17); ctx.lineTo(rx, -17 + lift);
      ctx.lineTo(rx, 83 + lift); ctx.lineTo(hx, 83);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
      // kapaktaki kol (açıkken kapakla birlikte)
      if (ca > 0.25) {
        ctx.fillStyle = k.rgba('ink');
        const kx0 = rx - 12 * ca;
        k.rrect(kx0, 0 + lift * 0.45, 10, 34, 5); ctx.fill();
      }
    } else {
      // kapalı alt kapak
      ctx.fillStyle = k.rgba(p.color);
      k.rrect(-62, -17, 124, 100, 8); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4;
      k.rrect(-62, -17, 124, 100, 8); ctx.stroke();
      // alt kapak kolu
      ctx.fillStyle = shadow; k.rrect(50, 4, 12, 42, 6); ctx.fill();
      ctx.fillStyle = k.rgba('ink');
      k.rrect(46, 0, 12, 42, 6); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 3;
      k.rrect(46, 0, 12, 42, 6); ctx.stroke();
    }

    // kapak ayrım çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-62, -21); ctx.lineTo(62, -21); ctx.stroke();

    ctx.restore();
  },
};
