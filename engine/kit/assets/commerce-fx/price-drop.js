// commerce-fx/price-drop — asılı fiyat etiketi; `at` anında aşağı ok etikete saplanır, patlama yıldızı açılır, etiket sallanır.
// NOT: canvas y-aşağıdır. Idle: 2.4 sn periyotlu hafif sallanma; at olayı ~1.2 sn sürer.
export default {
  name: 'price-drop', category: 'commerce-fx',
  desc: 'İpten asılı fiyat etiketi; düşen ok, patlama yıldızı ve sallanan etiketle fiyat düşüşü',
  tags: ['fiyat', 'indirim', 'etiket', 'ucuzluk', 'düşüş', 'price', 'discount', 'price tag', 'sale', 'drop', 'cheap'],
  box: [-130, -170, 130, 115],
  bleed: 80,
  anchor: 'etiketin merkezi (0,-5); ip üstten asılı',
  points: { tag: [0, -5], impact: [0, -5], string_top: [0, -168] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'fiyat düşüş anı: ok saplanır + yıldız patlar + etiket sallanır (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const wobble = (x, f = 19, dp = 7) => (x < 0 ? 0 : Math.exp(-dp * x) * Math.cos(f * x));
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d < 1.2;

    // ok: d<0 iken yukarıda bekler, 0–0.06 sn'de etikete saplanır, sonra gömülü kalır
    const ay = d < 0 ? -150 : -150 + 145 * k.E.outCubic(k.prog(d, 0, 0.06));
    const wob = d >= 0.06 ? wobble(d - 0.06, 17, 6) * 0.16 : 0;
    const sway = d < 0 ? 0.045 * Math.sin(t * k.TAU / 2.4) : 0;
    const rot = sway + wob;

    // ip (serbest asılı çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -168); ctx.lineTo(0, -78); ctx.stroke();

    // patlama yıldızı (ok saplandığı anda açılır)
    if (d >= 0.06) {
      const bs = k.E.outBack(k.prog(d, 0.06, 0.2), 1.6);
      if (bs > 0) {
        const alpha = d < 0.9 ? 1 : 1 - k.prog(d, 0.9, 1.2);
        ctx.save(); ctx.translate(0, -5); ctx.scale(bs, bs); ctx.rotate(0.2);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = line;
        ctx.beginPath();
        for (let i = 0; i <= 24; i++) {
          const a = (i / 24) * k.TAU, r = i % 2 === 0 ? 105 : 72;
          const x = Math.cos(a) * r, y = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = k.rgba(p.color, 0.92);
        ctx.beginPath();
        for (let i = 0; i <= 24; i++) {
          const a = (i / 24) * k.TAU, r = i % 2 === 0 ? 96 : 64;
          const x = Math.cos(a) * r, y = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
        // sol üst parlama (yıldız üstünde)
        ctx.fillStyle = 'rgba(255,255,255,0.11)';
        ctx.beginPath(); ctx.ellipse(-34, -52, 26, 10, -0.5, 0, k.TAU); ctx.fill();
        ctx.restore(); ctx.globalAlpha = 1;
        // şok halkası
        const rr = 60 + k.E.outCubic(k.prog(d, 0.06, 0.6)) * 120;
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - k.prog(d, 0.06, 0.6)));
        ctx.lineWidth = 10 * (1 - k.prog(d, 0.06, 0.6)) + 2;
        ctx.beginPath(); ctx.arc(0, -5, rr, 0, k.TAU); ctx.stroke();
      }
    }

    // etiket (sallanarak döner)
    ctx.save(); ctx.translate(0, -5); ctx.rotate(rot); ctx.translate(0, 5);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-88, -68, 176, 126, 22); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-80, -60, 160, 110, 18); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); k.rrect(-74, 14, 154, 30, 14); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -44, 34, 9, -0.3, 0, k.TAU); ctx.fill();
    // ip deliği
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(0, -64, 9, 0, k.TAU); ctx.fill();
    // eski fiyat + üstü çizili
    ctx.fillStyle = k.rgba('ink');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 40px system-ui, sans-serif';
    ctx.fillText('₺99', 0, -12);
    ctx.strokeStyle = k.rgba(p.color, 0.9); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-52, -10); ctx.lineTo(52, -14); ctx.stroke();
    // yeni fiyat
    ctx.fillStyle = k.rgba(p.color);
    ctx.font = '800 34px system-ui, sans-serif';
    ctx.fillText('₺59', 0, 32);
    ctx.restore();

    // düşen ok (kalın gövde + üçgen uç)
    ctx.fillStyle = line;
    const aw = 16;
    ctx.beginPath();
    ctx.moveTo(-aw, ay - 70); ctx.lineTo(aw, ay - 70); ctx.lineTo(aw, ay - 26);
    ctx.lineTo(aw + 20, ay - 26); ctx.lineTo(0, ay + 12);
    ctx.lineTo(-aw - 20, ay - 26); ctx.lineTo(-aw, ay - 26);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    const iw = 11;
    ctx.beginPath();
    ctx.moveTo(-iw, ay - 66); ctx.lineTo(iw, ay - 66); ctx.lineTo(iw, ay - 26);
    ctx.lineTo(iw + 14, ay - 26); ctx.lineTo(0, ay + 4);
    ctx.lineTo(-iw - 14, ay - 26); ctx.lineTo(-iw, ay - 26);
    ctx.closePath(); ctx.fill();
  },
};
