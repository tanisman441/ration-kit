// vehicles-2/bus — yandan görünüm otobüs (sağa bakar); doors anında kapı iki yana açılır, içinden ışık sızar.
// Orijinal tasarım. NOT: canvas y-aşağıdır; (0,0) zemin merkezi, tekerlekler yerde durur.
export default {
  name: 'bus',
  category: 'vehicles-2',
  desc: 'Yandan görünüm şehir otobüsü; kapı anında iki kanat açılır, içinden sarı ışık sızar',
  tags: ['otobüs', 'belediye otobüsü', 'bus', 'taşıt', 'şehir', 'toplu taşıma', 'kapı'],
  box: [-132, -118, 132, 14],
  bleed: 45,
  anchor: 'zemin merkezi (0,0); tekerlekler yerde',
  points: { door: [48, -55], front: [112, -60], roof: [0, -106], wheelF: [72, -20], wheelR: [-72, -20] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'gövde rengi' },
    doors: { type: 'time', default: null, desc: 'kapı açılma anı: iki kanat yana kayar (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 6;
    const col = k.rgba(p.color);
    const glass = k.rgba('bg', 0.9);
    const tire = k.col('ink');
    const darkTire = `rgb(${tire.map(v => Math.max(0, Math.round(v * 0.6))).join(',')})`;

    const blob = (x, y, w, h, r, c = col) => {
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // ANIMASYON — kapı olayı (0.8 sn)
    const d = p.doors == null ? -1 : t - p.doors;
    const g = d < 0 ? 0 : d > 0.8 ? 1 : k.E.inOutCubic(d / 0.8);
    const slide = g * 16;

    // idle: hafif salınım
    const bob = k.noise1(t * 1.3) * 1.2;

    ctx.save();
    ctx.translate(0, bob);

    // gövde
    blob(-112, -100, 224, 78, 14);
    // tavan bandı
    blob(-108, -100, 216, 12, 6, k.rgba('ink'));

    // camlar (bilgi taşıyan yüzey değil; parlama yok)
    const win = (x) => { ctx.fillStyle = glass; ctx.beginPath(); k.rrect(x, -84, 26, 24, 6); ctx.fill(); };
    win(-92); win(-60); win(-28);
    // ön cam
    ctx.fillStyle = glass; ctx.beginPath(); k.rrect(74, -86, 28, 30, 7); ctx.fill();
    // güzergah tabelası
    blob(68, -110, 40, 10, 4, darkTire);

    // KAPI: iç karanlık + ışık, iki kanat yana kayar
    const dx = 30, dy = -88, dw = 36, dh = 66;
    ctx.fillStyle = k.rgba('bg', 0.95); ctx.beginPath(); k.rrect(dx, dy, dw, dh, 8); ctx.fill();
    if (g > 0.02) {
      ctx.fillStyle = k.rgba('yellow', 0.35 * g);
      ctx.beginPath(); k.rrect(dx + 4, dy + 4, dw - 8, dh - 8, 6); ctx.fill();
      k.glow(dx + dw / 2, dy + dh / 2, 30 * g, 'yellow', 0.3 * g);
    }
    // sol kanat
    blob(dx - slide, dy, dw / 2 - 1, dh, 6, k.rgba('panel2'));
    // sağ kanat
    blob(dx + dw / 2 + 1 + slide, dy, dw / 2 - 1, dh, 6, k.rgba('panel2'));
    // kapı camları
    ctx.fillStyle = glass;
    ctx.beginPath(); k.rrect(dx - slide + 4, dy + 8, dw / 2 - 9, 20, 4); ctx.fill();
    ctx.beginPath(); k.rrect(dx + dw / 2 + 5 + slide, dy + 8, dw / 2 - 9, 20, 4); ctx.fill();

    // far / stop
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); k.rrect(104, -48, 14, 10, 5); ctx.fill();
    k.glow(111, -43, 20, 'yellow', 0.3);
    ctx.fillStyle = k.rgba('red', 0.9); ctx.beginPath(); k.rrect(-116, -48, 9, 10, 4); ctx.fill();

    // tekerlekler
    for (const wx of [-72, 72]) {
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(wx, -20, 20 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(wx, -20, 20, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.85); ctx.beginPath(); ctx.arc(wx, -20, 12, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.85); ctx.beginPath(); ctx.arc(wx, -20, 4.5, 0, k.TAU); ctx.fill();
    }

    // premium parlama (gövde sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-80, -92, 34, 10, -0.3, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
