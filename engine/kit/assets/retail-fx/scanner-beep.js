// retail-fx/scanner-beep — el tipi barkod tarayıcı; `at` anında kırmızı ışın barkoda ulaşır, bip halkaları yayılır.
// NOT: canvas y-aşağıdır. Idle: LED yanıp sönmesi (~1.8 sn); at olayı ~1.6 sn sürer.
export default {
  name: 'scanner-beep', category: 'retail-fx',
  desc: 'El tipi barkod tarayıcı; ışın barkoda ulaşınca bip ışık halkaları yayılır',
  tags: ['tarayıcı', 'barkod', 'bip', 'kasa', 'lazer', 'market', 'okutma', 'scanner', 'barcode', 'beep', 'checkout', 'laser'],
  box: [-150, -100, 150, 100],
  bleed: 80,
  anchor: 'tarayıcı gövdesinin merkezi (-75,0)',
  points: { nozzle: [-32, -8], code: [80, 0], beep: [98, -72] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'tarama anı: ışın barkoda ulaşır (0.5 sn) + bip halkaları (1.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const scanning = d >= 0 && d < 0.5;

    const bob = 2 * Math.sin(t * k.TAU / 2.6);

    // ---- barkod paneli (sağda) ----
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(30, -52, 104, 104, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(37, -45, 90, 90, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    let bx = 46, bi = 0;
    while (bx < 116) {
      const w = 3 + k.hash(bi * 3.7) * 8;
      const h = 52 + k.hash(bi * 9.1) * 20;
      if (k.hash(bi * 5.3) > 0.18) ctx.fillRect(bx, -h / 2, w, h);
      bx += w + 2 + k.hash(bi * 7.7) * 5;
      bi++;
    }
    // tarama bitince barkod beyazlar (okundu flaşı)
    if (d >= 0.4 && d < 1.0) {
      ctx.fillStyle = k.rgba(p.color, 0.25 * (1 - k.prog(d, 0.4, 1.0)));
      ctx.beginPath(); k.rrect(37, -45, 90, 90, 10); ctx.fill();
    }

    // ---- tarayıcı gövdesi (solda) ----
    ctx.save(); ctx.translate(0, bob);
    // sap
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-104, 18, 34, 62, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-99, 23, 24, 52, 8); ctx.fill();
    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-122, -34, 84, 58, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-114, -26, 68, 42, 12); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-96, -16, 24, 6, -0.25, 0, k.TAU); ctx.fill();
    // namlu ucu
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-44, -20, 16, 24, 6); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-40, -16, 8, 16, 4); ctx.fill();
    // tetik
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); k.rrect(-92, 22, 10, 20, 5); ctx.fill();
    // LED: idle'da yanıp söner, taramada sürekli yanar
    const ledOn = scanning || (0.5 + 0.5 * Math.sin(t * k.TAU / 1.8)) > 0.45;
    if (ledOn) k.glow(-100, -14, 20, 'green', 0.5);
    ctx.fillStyle = k.rgba('green', ledOn ? 1 : 0.25);
    ctx.beginPath(); ctx.arc(-100, -14, 7, 0, k.TAU); ctx.fill();
    ctx.restore();

    const nx = -32, ny = -8 + bob, tx = 34, ty = -8;

    // ---- ışın: 0–0.5 sn'de namludan barkoda uzar ----
    if (scanning) {
      const q = k.E.outCubic(k.prog(d, 0, 0.5));
      const ex = k.lerp(nx, tx, q);
      k.glow(ex, ty, 30, p.color, 0.4);
      ctx.strokeStyle = k.rgba(p.color, 0.9); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(ex, ty); ctx.stroke();
      ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(ex, ty); ctx.stroke();
      // namlu flaşı
      k.glow(nx, ny, 22, p.color, 0.5 * (1 - q));
    }
    // çarpma parlaması (barkod üstünde)
    if (d >= 0.35 && d < 0.9) {
      k.glow(tx, ty, 34, p.color, 0.55 * (1 - k.prog(d, 0.35, 0.9)));
    }

    // ---- bip halkaları: 0.5–1.6 sn, sağ üstte ----
    if (d >= 0.5 && d < 1.8) {
      for (let j = 0; j < 3; j++) {
        const ph = k.prog(d, 0.5 + j * 0.14, 1.8);
        if (ph <= 0 || ph >= 1) continue;
        const r = 10 + k.E.outCubic(ph) * 58;
        ctx.strokeStyle = k.rgba(p.color, 0.75 * (1 - ph));
        ctx.lineWidth = 8 * (1 - ph) + 2;
        ctx.beginPath(); ctx.arc(98, -72, r, 0, k.TAU); ctx.stroke();
      }
      k.glow(98, -72, 26, p.color, 0.5 * (1 - k.prog(d, 0.5, 1.1)));
      ctx.fillStyle = k.rgba(p.color, 1 - 0.4 * k.prog(d, 1.1, 1.8));
      ctx.beginPath(); ctx.arc(98, -72, 9, 0, k.TAU); ctx.fill();
    }
  },
};
