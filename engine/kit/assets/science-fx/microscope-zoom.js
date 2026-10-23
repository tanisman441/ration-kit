// science-fx/microscope-zoom — mikroskop; `at` anında mercekte zum: büyüyen örnek + odak halkaları.
// NOT: canvas y-aşağıdır; (0,0) tabandadır.
export default {
  name: 'microscope-zoom',
  category: 'science-fx',
  desc: 'Mikroskop: at anında mercekte zum olayı — büyüyen örnek detayı ve genişleyen odak halkaları',
  tags: ['mikroskop', 'zum', 'mercek', 'inceleme', 'laboratuvar', 'büyütme', 'microscope', 'zoom', 'lens', 'lab'],
  box: [-125, -245, 125, 12],
  bleed: 40,
  anchor: 'taban (0,0)',
  points: { lens: [28, -100] },
  params: {
    at: { type: 'time', default: null, desc: 'zum anı (mercekte büyüyen detay + odak halkası ~1 sn)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const acc = 'cyan';
    ctx.save();
    ctx.lineCap = 'round';

    const g = d < 0 ? 0 : k.prog(d, 0, 1.0);
    const lx = 28, ly = -100; // mercek merkezi

    const outline = (fillFn) => {
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); fillFn(true); ctx.fill();
    };
    const shape = (fn, style, alpha) => {
      ctx.fillStyle = k.rgba(style, alpha);
      ctx.beginPath(); fn(); ctx.fill();
    };

    // taban
    outline(() => k.rrect(-95, -24, 190, 24, 10));
    shape(() => k.rrect(-95, -24, 190, 24, 10), 'dim', 0.9);
    shape(() => k.rrect(-88, -24, 70, 10, 5), 'panel2', 0.6);
    // lamba LED'i (yanıp söner)
    const ledOn = k.hash(Math.floor(t * 1.5)) > 0.35;
    if (ledOn) k.glow(62, -12, 14, acc, 0.45);
    ctx.fillStyle = k.rgba(ledOn ? acc : 'ink', 0.9);
    ctx.beginPath(); ctx.arc(62, -12, 5, 0, k.TAU); ctx.fill();

    // gövde kolonu
    outline(() => k.rrect(-78, -162, 30, 142, 12));
    shape(() => k.rrect(-78, -162, 30, 142, 12), 'dim', 0.9);
    // odak düğmeleri
    for (const ky of [-118, -96]) {
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.arc(-46, ky, 13, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 0.95);
      ctx.beginPath(); ctx.arc(-46, ky, 10, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.7);
      ctx.beginPath(); ctx.arc(-46, ky, 4, 0, k.TAU); ctx.fill();
    }

    // tüp
    outline(() => k.rrect(6, -218, 44, 84, 12));
    shape(() => k.rrect(6, -218, 44, 84, 12), 'panel2', 0.95);
    // göz merceği
    outline(() => k.rrect(14, -234, 28, 20, 8));
    shape(() => k.rrect(14, -234, 28, 20, 8), 'dim', 0.95);
    ctx.fillStyle = k.rgba(acc, 0.35);
    ctx.beginPath(); ctx.arc(28, -224, 8, 0, k.TAU); ctx.fill();

    // objektif (konik) + mercek
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(8, -134); ctx.lineTo(48, -134); ctx.lineTo(42, -106); ctx.lineTo(14, -106);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath();
    ctx.moveTo(13, -134); ctx.lineTo(43, -134); ctx.lineTo(39, -108); ctx.lineTo(17, -108);
    ctx.closePath(); ctx.fill();

    // mercek camı — içinde yüzen örnek noktaları
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(lx, ly, 17, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.arc(lx, ly, 14, 0, k.TAU); ctx.fill();
    const dotScale = 1 + g * 1.5;
    for (let i = 0; i < 6; i++) {
      const a = k.hash(i * 7 + 3) * k.TAU;
      const rr = 3 + k.hash(i * 11 + 5) * 7;
      const dx = lx + Math.cos(a + t * 0.7) * rr + k.noise1(i * 3 + t) * 1.5;
      const dy = ly + Math.sin(a + t * 0.7) * rr * 0.8;
      ctx.fillStyle = k.rgba(acc, 0.85);
      ctx.beginPath(); ctx.arc(dx, dy, (2.2 + k.hash(i * 5) * 1.8) * dotScale, 0, k.TAU); ctx.fill();
    }
    // mercek parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.ellipse(lx - 5, ly - 6, 5, 3.5, -0.5, 0, k.TAU); ctx.fill();

    // tabla + lam
    outline(() => k.rrect(-48, -88, 140, 16, 6));
    shape(() => k.rrect(-48, -88, 140, 16, 6), 'dim', 0.9);
    ctx.fillStyle = k.rgba(acc, 0.25 + g * 0.4);
    ctx.beginPath(); k.rrect(-4, -96, 64, 9, 4); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); k.rrect(-4, -96, 64, 9, 4); ctx.stroke();

    // ZUM OLAYI — odak halkaları + mercek parıltısı
    if (d >= 0 && d < 1.2) {
      k.glow(lx, ly, 40, acc, 0.5 * (1 - g));
      for (let i = 0; i < 3; i++) {
        const ph = k.clamp((d - i * 0.18) / 0.7, 0, 1);
        if (ph <= 0 || ph >= 1) continue;
        ctx.strokeStyle = k.rgba(acc, 0.55 * (1 - ph));
        ctx.lineWidth = 4 * (1 - ph) + 1;
        ctx.beginPath(); ctx.arc(lx, ly, 22 + ph * 62, 0, k.TAU); ctx.stroke();
      }
      // odak artı işareti
      const fa = k.clamp(d / 0.3, 0, 1) * (1 - k.prog(d, 0.8, 1.2));
      if (fa > 0) {
        ctx.strokeStyle = k.rgba(acc, 0.8 * fa);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lx - 24, ly); ctx.lineTo(lx - 12, ly);
        ctx.moveTo(lx + 12, ly); ctx.lineTo(lx + 24, ly);
        ctx.moveTo(lx, ly - 24); ctx.lineTo(lx, ly - 12);
        ctx.moveTo(lx, ly + 12); ctx.lineTo(lx, ly + 24);
        ctx.stroke();
      }
    }

    // premium parlama (sol üst, tüp üstünde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(16, -200, 9, 26, 0.15, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
