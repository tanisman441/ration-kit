// retail-fx/shelf-restock — iki katlı market rafı; `at` anında kol üstten inip rafa ürün dizer, komşu ürünler sarsılır.
// NOT: canvas y-aşağıdır. Idle: ürünlerde ~2.2 sn periyotlu hafif yerleşme hareketi; at olayı ~1.3 sn sürer.
export default {
  name: 'shelf-restock', category: 'retail-fx',
  desc: 'İki katlı market rafı; üstten inen kol rafa yeni ürün dizer, komşu ürünler sarsılır',
  tags: ['raf', 'stok', 'dizme', 'reyon', 'market', 'ürün', 'perakende', 'shelf', 'restock', 'store', 'retail', 'products', 'merchandising'],
  box: [-170, -135, 170, 135],
  bleed: 60,
  anchor: 'raf ünitesinin merkezi (0,0)',
  points: { shelf_top: [0, -36], place: [60, -36], shelf_bottom: [0, 64] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'ürün dizme anı: kol iner, ürünü bırakır, çekilir (~1.3 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const stocking = d >= 0 && d < 1.3;

    // komşu sarsıntısı: ürün bırakılınca sönümlü sallanma
    const shake = d >= 0.5 ? Math.exp(-6 * (d - 0.5)) * Math.cos(22 * (d - 0.5)) * 3.5 : 0;

    // raf ünitesi: arka panel
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-152, -128, 304, 256, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-144, -120, 288, 240, 10); ctx.fill();
    // sol üst parlama (panel üstünde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-96, -100, 56, 10, -0.25, 0, k.TAU); ctx.fill();

    // ürün çizici: kutu/konserve (x merkez, baseY raf tahtası üstü)
    const product = (x, baseY, w, h, col, i, extra = 0) => {
      const bob = 1.5 * k.noise1(t * 0.6 + i * 3.1);
      const dx = shake * (1 + k.hash(i * 1.7) * 0.5);
      const y0 = baseY - h + bob + extra;
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - w / 2 + dx, y0, w, h, 8); ctx.fill();
      ctx.fillStyle = k.rgba(col);
      ctx.beginPath(); k.rrect(x - w / 2 + 5 + dx, y0 + 5, w - 10, h - 10, 5); ctx.fill();
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - w / 2 + 16 + dx, y0 + 16, 8, 4, -0.3, 0, k.TAU); ctx.fill();
      // etiket çizgisi
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.fillRect(x - w / 2 + 12 + dx, y0 + h / 2 - 3, w - 24, 6);
    };

    const cols = ['cyan', 'green', 'purple', 'yellow'];
    const topY = -36, botY = 64;

    // üst raf: 3 ürün + dizilecek ürün için x=60 civarı boşluk
    const topXs = [-114, -38, 114];
    topXs.forEach((x, j) => {
      const i = j;
      product(x, topY, 36 + k.hash(i * 4.2) * 10, 54 + k.hash(i * 8.7) * 16, cols[i % 4], i);
    });
    // alt raf: 4 ürün
    for (let i = 0; i < 4; i++) {
      const x = -114 + i * 76;
      product(x, botY, 38 + k.hash(i * 2.9 + 40) * 12, 48 + k.hash(i * 6.3 + 40) * 14, cols[(i + 2) % 4], i + 10);
    }

    // raf tahtaları (ürünlerin üstüne değil, altına çizilir — önce ürünler çizildi, şimdi tahta ön yüzü)
    for (const y of [topY, botY]) {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-152, y, 304, 14, 6); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); k.rrect(-147, y + 2, 294, 10, 4); ctx.fill();
    }

    // ---- kol animasyonu ----
    const placeX = 60, pw = 42, ph = 62;
    const restX = 96, restY = -112, placeY = -100;
    let hx, hy, carrying;
    if (d < 0) {
      hx = restX + 3 * Math.sin(t * k.TAU / 2.2);
      hy = restY + 3 * Math.sin(t * k.TAU / 2.2 + 1);
      carrying = true;
    } else if (d < 0.4) {
      const q = k.E.inOutCubic(k.prog(d, 0, 0.4));
      hx = k.lerp(restX, placeX, q); hy = k.lerp(restY, placeY, q);
      carrying = true;
    } else if (d < 1.0) {
      const q = k.E.inOutCubic(k.prog(d, 0.45, 1.0));
      hx = k.lerp(placeX, restX, q); hy = k.lerp(placeY, restY, q);
      carrying = false;
    } else {
      hx = restX; hy = restY; carrying = false;
    }

    // iniş hareket çizgileri
    if (d >= 0 && d < 0.4) {
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const lx = hx - 28 + i * 28;
        ctx.beginPath(); ctx.moveTo(lx, hy - 44); ctx.lineTo(lx, hy - 26); ctx.stroke();
      }
    }

    // bırakılan ürün: 0.45'te ele düşer, rafa oturur
    if (d >= 0.45) {
      const fall = 16 * (1 - k.E.outCubic(k.prog(d, 0.45, 0.62)));
      product(placeX, topY, pw, ph, p.color, 99, fall);
    }
    // taşınan ürün (elde)
    if (carrying) {
      const y0 = hy - 4;
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(hx - pw / 2, y0, pw, ph, 8); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); k.rrect(hx - pw / 2 + 5, y0 + 5, pw - 10, ph - 10, 5); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(hx - pw / 2 + 16, y0 + 16, 8, 4, -0.3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.fillRect(hx - pw / 2 + 12, y0 + ph / 2 - 3, pw - 24, 6);
    }

    // kol: pivot (üst sağ, çerçeve dışı) → el
    ctx.strokeStyle = line; ctx.lineWidth = 28;
    ctx.beginPath(); ctx.moveTo(150, -132); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 18;
    ctx.beginPath(); ctx.moveTo(150, -132); ctx.lineTo(hx, hy); ctx.stroke();
    // el
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(hx, hy, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(hx, hy, 10, 0, k.TAU); ctx.fill();
  },
};
