// travel-fx/passport-stamp — açık pasaport: stamp anında mühür sayfaya iner, mürekkep saçılır, damga kalır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) pasaport sayfalarının ortasıdır.
export default {
  name: 'passport-stamp', category: 'travel-fx',
  desc: 'Açık pasaportun üstündeki mühür stamp anında sayfaya iner, mürekkep halkası saçar ve damga izi bırakır',
  tags: ['pasaport', 'damga', 'mühür', 'vize', 'gümrük', 'sınır', 'passport', 'stamp', 'seal', 'visa', 'customs', 'border'],
  box: [-150, -212, 150, 118],
  bleed: 18,
  anchor: 'pasaport sayfalarının ortası (0,0)',
  points: { seal: [40, 30], stamp: [40, -105], pages: [0, 10] },
  params: {
    color: { type: 'color', default: 'ink' },
    stamp: { type: 'time', default: null, desc: 'damga vuruş anı (mühür iner, mürekkep saçar)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkLine = k.rgba('ink', 0.75);
    const shade = (c, f) => { const [r, g, b] = k.col(c); return `rgba(${r * f | 0},${g * f | 0},${b * f | 0},1)`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.stamp == null ? -1 : t - p.stamp;
    const sway = k.noise1(t * 0.8) * 2;                      // sayfalar canlı: hafif esneme

    // --- pasaport (açık, iki sayfa) ---
    const page = (x) => {
      ctx.save(); ctx.translate(x, sway * 0.6);
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-55, -48, 110, 128, 10); ctx.fill();
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); k.rrect(-55 + LW / 2, -48 + LW / 2, 110 - LW, 128 - LW, 8); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';              // premium parlama (sol sayfa üstü)
      if (x < 0) { ctx.beginPath(); ctx.ellipse(-28, -28, 22, 10, -0.45, 0, k.TAU); ctx.fill(); }
      // sayfa bilgi satırları
      ctx.fillStyle = k.rgba('dim', 0.8);
      for (let i = 0; i < 4; i++) ctx.fillRect(-38, -16 + i * 16, 52 + (k.hash(i * 7 + (x > 0 ? 3 : 0)) * 18), 6);
      ctx.restore();
    };
    // kapak kenarı (arkada, koyu)
    ctx.fillStyle = shade('dim', 0.8);
    ctx.beginPath(); k.rrect(-118, -54, 236, 142, 14); ctx.fill();
    page(-57); page(57);
    // orta cilt çizgisi
    ctx.lineWidth = 4; ctx.strokeStyle = inkLine;
    ctx.beginPath(); ctx.moveTo(0, -50 + sway * 0.6); ctx.lineTo(0, 82 + sway * 0.6); ctx.stroke();

    // --- damga izi (stamp vuruşundan sonra sayfada kalır) ---
    const sealP = d >= 0.15 ? k.E.outBack(k.prog(t, p.stamp + 0.15, p.stamp + 0.6)) : 0;
    if (sealP > 0) {
      ctx.save(); ctx.translate(57, 30 + sway * 0.6); ctx.rotate(-0.18); ctx.scale(sealP, sealP);
      ctx.strokeStyle = k.rgba('red', 0.9); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, k.TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 19, 0, k.TAU); ctx.stroke();
      // içte yıldız
      ctx.fillStyle = k.rgba('red', 0.9);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 === 0 ? 11 : 4.6;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](r * Math.cos(a), r * Math.sin(a));
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // --- mürekkep saçılması + halka (vuruş anı efekti) ---
    if (d >= 0.15 && d < 0.75) {
      const q = (d - 0.15) / 0.6;
      // genişleyen halka
      ctx.strokeStyle = k.rgba('red', 0.55 * (1 - q)); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(57, 30 + sway * 0.6, 26 + 46 * k.E.outCubic(q), 0, k.TAU); ctx.stroke();
      // saçılan mürekkep noktaları
      for (let i = 0; i < 12; i++) {
        const a = k.hash(i * 13 + 2) * k.TAU, dist = 34 + 42 * k.E.outCubic(q) + k.hash(i * 5) * 8;
        ctx.fillStyle = k.rgba('red', 0.75 * (1 - q));
        ctx.beginPath(); ctx.arc(57 + dist * Math.cos(a), 30 + sway * 0.6 + dist * Math.sin(a), 2.5 + k.hash(i) * 2.5, 0, k.TAU); ctx.fill();
      }
    }

    // --- mühür (yukarıda bekler, stamp anında iner) ---
    let yoff = -62;                                          // dinlenme konumu (yukarıda)
    if (d >= 0) {
      if (d < 0.15) yoff = k.lerp(-62, 66, k.E.inCubic(d / 0.15));        // hızlı iniş
      else yoff = k.lerp(66, -40, k.E.outCubic(k.prog(t, p.stamp + 0.15, p.stamp + 0.6))); // geri çekilme
    }
    ctx.save(); ctx.translate(57, yoff);
    // sap
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-13, -112, 26, 52, 9); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-13 + LW / 2, -112 + LW / 2, 26 - LW, 52 - LW, 6); ctx.fill();
    // topuz
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -122, 20, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(0, -122, 20 - LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-7, -130, 9, 5, -0.5, 0, k.TAU); ctx.fill();
    // taban
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-40, -62, 80, 26, 8); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-40 + LW / 2, -62 + LW / 2, 80 - LW, 26 - LW, 5); ctx.fill();
    ctx.restore();
  },
};
