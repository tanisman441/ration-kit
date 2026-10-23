// commerce-fx/cart-fill — alışveriş sepeti; `full` doluluk oranı, `pop` anında yeni ürün sepete düşer.
// NOT: canvas y-aşağıdır. Idle: 2.4 sn periyotlu hafif yaylanma + tekerlek dönüşü; pop olayı ~0.7 sn sürer.
export default {
  name: 'cart-fill', category: 'commerce-fx',
  desc: 'Doluluk seviyesi ayarlanabilen alışveriş sepeti; ürün düşme anında sepet yaylanır',
  tags: ['sepet', 'alışveriş', 'market', 'ürün', 'doldur', 'cart', 'shopping', 'basket', 'market', 'grocery', 'shop'],
  box: [-125, -245, 115, 25],
  bleed: 60,
  anchor: 'tekerlerin altı (0,0)',
  points: { basket: [-5, -95], handle: [-100, -155] },
  params: {
    color: { type: 'color', default: 'ink' },
    full: { type: 'number', default: 0.5, desc: 'sepet doluluk oranı (0-1)' },
    pop: { type: 'time', default: null, desc: 'ürün düşme anı: ürün sepete düşer + sepet yaylanır (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const wobble = (x, f = 19, dp = 7) => (x < 0 ? 0 : Math.exp(-dp * x) * Math.cos(f * x));
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.pop == null ? -1 : t - p.pop;
    const full = k.clamp(p.full ?? 0.5, 0, 1);

    // sepet yaylanması: idle nefes + pop anında çökme
    const bob = 2.5 * Math.sin(t * k.TAU / 2.4);
    const squash = d >= 0 && d < 0.7 ? wobble(d, 16, 7) * 0.06 : 0;

    ctx.save();
    ctx.translate(0, bob);
    ctx.scale(1 + squash, 1 - squash);

    // tekerlekler (dönen kollu)
    const wheel = (wx) => {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(wx, -16, 17, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(wx, -16, 13, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.7); ctx.lineWidth = 4;
      const wa = t * 1.4 + wx;
      ctx.beginPath();
      ctx.moveTo(wx - Math.cos(wa) * 9, -16 - Math.sin(wa) * 9);
      ctx.lineTo(wx + Math.cos(wa) * 9, -16 + Math.sin(wa) * 9);
      ctx.stroke();
    };
    // bacaklar
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-48, -34); ctx.lineTo(-48, -18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28, -34); ctx.lineTo(28, -18); ctx.stroke();
    wheel(-48); wheel(28);

    // sepet gövdesi (yamuk)
    const trap = (dy, fill) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-92 + dy, -160 + dy); ctx.lineTo(62 + dy, -160 + dy);
      ctx.lineTo(38 + dy, -44 + dy); ctx.lineTo(-66 + dy, -44 + dy);
      ctx.closePath(); ctx.fill();
    };
    trap(7, line);
    trap(0, k.rgba('dim'));
    // tel ızgara (iç ayrım çizgileri)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4;
    for (let i = 1; i < 5; i++) {
      const gx = -92 + (i / 5) * 154;
      const gx2 = -66 + (i / 5) * 104;
      ctx.beginPath(); ctx.moveTo(gx, -156); ctx.lineTo(gx2, -48); ctx.stroke();
    }
    for (let i = 1; i < 4; i++) {
      const gy = -160 + (i / 4) * 116;
      const wx0 = -92 + ((gy + 160) / 116) * 26;
      const wx1 = 62 - ((gy + 160) / 116) * 24;
      ctx.beginPath(); ctx.moveTo(wx0, gy); ctx.lineTo(wx1, gy); ctx.stroke();
    }
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath();
    ctx.moveTo(10, -160); ctx.lineTo(62, -160); ctx.lineTo(38, -44); ctx.lineTo(-6, -44);
    ctx.closePath(); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-64, -140, 26, 8, -0.2, 0, k.TAU); ctx.fill();

    // tutamak
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-92, -156); ctx.lineTo(-112, -188); ctx.stroke();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-136, -202, 52, 22, 11); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-130, -197, 40, 12, 6); ctx.fill();

    // ürünler (doluluk kadar, alttan yukarı)
    const items = [
      { w: 56, h: 44, c: 'panel2', x: -48 },
      { w: 44, h: 58, c: 'ink', x: 6 },
      { w: 62, h: 36, c: 'panel2', x: -30 },
      { w: 40, h: 66, c: 'accent', x: -66 },
      { w: 48, h: 42, c: 'ink', x: 22 },
    ];
    const n = Math.round(full * 5);
    let stackY = -52;
    for (let i = 0; i < n && i < 5; i++) {
      const it = items[i];
      const iy = stackY - it.h;
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(it.x - it.w / 2 - 4, iy - 4, it.w + 8, it.h + 8, 10); ctx.fill();
      ctx.fillStyle = k.rgba(it.c === 'accent' ? p.color : it.c);
      ctx.beginPath(); k.rrect(it.x - it.w / 2, iy, it.w, it.h, 8); ctx.fill();
      if (it.c === 'accent') {
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.ellipse(it.x - it.w / 4, iy + it.h / 4, it.w / 5, it.h / 8, -0.4, 0, k.TAU); ctx.fill();
      }
      stackY = iy + 14;
    }

    // pop ürünü: d<0 sepetin üstünde durur, 0–0.35 sn'de düşer, inişte toz halkası
    const popY0 = -225, popY1 = stackY - 46;
    const py = d < 0 ? popY1 : popY0 + (popY1 - popY0) * k.E.inCubic(k.prog(d, 0, 0.35));
    const pRot = d >= 0 && d < 0.35 ? (d / 0.35) * 0.5 : 0;
    ctx.save(); ctx.translate(-8, py); ctx.rotate(pRot);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-30, -25, 60, 50, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-24, -19, 48, 38, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-12, -10, 12, 6, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 22px system-ui, sans-serif';
    ctx.fillText('★', 0, 2);
    ctx.restore();
    // iniş toz halkası
    if (d >= 0.35 && d < 1.8) {
      const rp = k.prog(d, 0.35, 1.8);
      ctx.strokeStyle = k.rgba('dim', 0.6 * (1 - rp));
      ctx.lineWidth = 6 * (1 - rp) + 2;
      ctx.beginPath(); ctx.ellipse(-8, stackY - 40, 20 + rp * 55, 8 + rp * 16, 0, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, 8, 95, 9, 0, 0, k.TAU); ctx.fill();
  },
};
