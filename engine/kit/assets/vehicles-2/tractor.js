// vehicles-2/tractor — yandan görünüm traktör (sağa bakar); plow anında arkadan toz bulutu kalkar.
// Orijinal tasarım. NOT: canvas y-aşağıdır; (0,0) zemin merkezi, tekerlekler yerde durur.
export default {
  name: 'tractor',
  category: 'vehicles-2',
  desc: 'Yandan görünüm çiftlik traktörü; saban anında arka tekerlekten toz bulutu yükselir',
  tags: ['traktör', 'çiftçi', 'tractor', 'tarım', 'çiftlik', 'taşıt', 'saban'],
  box: [-122, -118, 122, 14],
  bleed: 80,
  anchor: 'zemin merkezi (0,0); tekerlekler yerde',
  points: { plow: [-100, -16], exhaust: [-18, -108], cabin: [-28, -88], wheelBig: [-55, -34], wheelSmall: [62, -18] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'kaporta/kabin rengi' },
    plow: { type: 'time', default: null, desc: 'saban anı: arkadan toz bulutu kalkar (0.9 sn)' },
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
    const rod = (x1, y1, x2, y2, w, c = col) => {
      ctx.strokeStyle = O; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // ANIMASYON — plow olayı (0.9 sn): gövde sarsıntısı + toz
    const d = p.plow == null ? -1 : t - p.plow;
    const plOn = d >= 0 && d < 0.9;
    const bounce = plOn ? Math.abs(k.noise1(t * 18)) * 4 : k.noise1(t * 1.2) * 0.8;

    ctx.save();
    ctx.translate(0, -bounce);

    // büyük arka tekerlek
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(-55, -34, 34 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(-55, -34, 34, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.7); ctx.lineWidth = 5;
    for (let i = 0; i < 8; i++) {
      const a = i * k.TAU / 8;
      ctx.beginPath();
      ctx.moveTo(-55 + Math.cos(a) * 24, -34 + Math.sin(a) * 24);
      ctx.lineTo(-55 + Math.cos(a) * 32, -34 + Math.sin(a) * 32);
      ctx.stroke();
    }
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(-55, -34, 9, 0, k.TAU); ctx.fill();

    // küçük ön tekerlek
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(62, -18, 18 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(62, -18, 18, 0, k.TAU); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(62, -18, 6, 0, k.TAU); ctx.fill();

    // şasi
    rod(-55, -40, 62, -30, 10, darkTire);
    // motor kaputu
    blob(28, -72, 62, 36, 10);
    // ızgara
    ctx.fillStyle = darkTire; ctx.beginPath(); k.rrect(82, -64, 8, 24, 4); ctx.fill();
    // kabin
    blob(-52, -108, 56, 48, 10);
    ctx.fillStyle = glass; ctx.beginPath(); k.rrect(-44, -100, 40, 30, 6); ctx.fill();
    // egzoz bacası
    rod(-14, -72, -14, -102, 9, darkTire);
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(-14, -104, 8, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(-14, -104, 5.5, 0, k.TAU); ctx.fill();
    // far (vurgu: yellow)
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); k.rrect(72, -64, 10, 10, 4); ctx.fill();
    k.glow(77, -59, 18, 'yellow', 0.3);
    // direksiyon simidi
    ctx.strokeStyle = darkTire; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(-32, -72, 9, 0, k.TAU); ctx.stroke();

    // premium parlama (kaput sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(48, -66, 18, 7, -0.35, 0, k.TAU); ctx.fill();

    ctx.restore();

    // ANIMASYON 1 — egzozdan ince duman (sürekli idle, döngülü)
    for (let i = 0; i < 3; i++) {
      const cyc = (t * 0.4 + k.hash(i * 3 + 61)) % 1;
      const pg = cyc / 1;
      ctx.fillStyle = k.rgba('dim', 0.3 * (1 - pg));
      ctx.beginPath(); ctx.arc(-14 + (k.hash(i * 5 + 62) - 0.5) * 14, -110 - pg * 34, 4 + pg * 8, 0, k.TAU); ctx.fill();
    }

    // ANIMASYON 2 — saban toz bulutu (plow anında, arkadan)
    if (plOn) {
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 3 + 63), h2 = k.hash(i * 5 + 64), h3 = k.hash(i * 7 + 65);
        const pd = d - i * 0.06;
        if (pd < 0) continue;
        const pg = pd / 0.9;
        const x = -95 - pd * (30 + h1 * 40) + h2 * 16;
        const y = -12 - pd * (26 + h3 * 30) - pg * pg * 24;
        const r = 7 + pd * 22;
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - pg));
        ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      }
    }
  },
};
