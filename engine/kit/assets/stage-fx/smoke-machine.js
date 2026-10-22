// stage-fx/smoke-machine — sahne duman makinesi.
// Boşta nozuldan sürekli ince bir duman kıvrımı yükselir; puff anında ~1.2 sn
// yoğun duman püskürür (büyüyen bulut + kalınlaşan kıvrım). LED boşta yanıp söner.
// NOT: canvas y-aşağıdır; (0,0) makinenin taban merkezidir.
export default {
  name: 'smoke-machine', category: 'stage-fx',
  desc: 'Duman makinesi: boşta ince kıvrım, puff anında yoğun duman püskürtür',
  tags: ['duman', 'sis', 'makine', 'sahne', 'konser', 'efekt', 'smoke', 'fog', 'machine', 'stage'],
  box: [-95, -140, 370, 40],
  bleed: 45,
  anchor: 'makinenin taban merkezi (0,0)',
  points: { nozzle: [78, -58], top: [0, -92] },
  params: {
    puff: { type: 'time', default: null, desc: 'yoğun duman püskürtme anı (1.2 sn)' },
    color: { type: 'color', default: 'accent', desc: 'LED + nozul halka rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const d = p.puff == null ? -1 : t - p.puff;
    const puffE = d >= 0 ? k.clamp(1 - d / 1.2, 0, 1) : 0;   // püskürtme şiddeti

    // ---- duman (makineden önce, arkada) ----
    const NX = 78, NY = -58;                                 // nozul ucu
    const nP = puffE > 0 ? 20 : 9;                           // parçacık sayısı
    const drift = puffE > 0 ? 300 : 210;                     // sürüklenme mesafesi
    for (let i = 0; i < nP; i++) {
      const speed = puffE > 0 ? 0.9 : 0.28;
      const ph = (t * speed + i / nP) % 1;                   // 0 nozul, 1 uzak
      if (ph <= 0.001 && puffE <= 0) continue;
      const wob = k.hash(i * 7.3);
      const sx = NX + ph * drift;
      const sy = NY - ph * (46 + wob * 40) + Math.sin(ph * 6 + i * 1.7 + t * 1.5) * 22 * ph;
      const r = (puffE > 0 ? 14 : 7) + ph * (puffE > 0 ? 46 : 26);
      const a = (1 - ph) * (puffE > 0 ? 0.55 : 0.20) * (0.75 + wob * 0.5);
      ctx.fillStyle = k.rgba('dim', Math.max(0, Math.min(0.6, a)));
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, k.TAU); ctx.fill();
      // bulut içi açık çekirdek
      ctx.fillStyle = k.rgba('panel2', Math.max(0, a * 0.5));
      ctx.beginPath(); ctx.arc(sx - r * 0.2, sy - r * 0.2, r * 0.55, 0, k.TAU); ctx.fill();
    }
    // puff anında nozul ağzında ilk topak
    if (puffE > 0.05) {
      const cr = 20 + (1 - puffE) * 55;
      ctx.fillStyle = k.rgba('dim', puffE * 0.6);
      ctx.beginPath(); ctx.arc(NX + 26, NY - 8, cr, 0, k.TAU); ctx.fill();
    }

    // ---- zemin gölgesi ----
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 8, 84, 11, 0, 0, k.TAU); ctx.fill();

    // ---- makine gövdesi ----
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-78, -92, 156, 92, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-78, -92, 156, 92, 16); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';                 // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-48, -70, 16, 12, -0.4, 0, k.TAU); ctx.fill();
    // üst havalandırma çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(-58, -80 + i * 11); ctx.lineTo(-18, -80 + i * 11); ctx.stroke();
    }
    // taşıma kolu (havada duran ince çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, -92, 34, Math.PI, k.TAU); ctx.stroke();
    // ayaklar
    ctx.fillStyle = k.rgba('ink', 0.8);
    k.rrect(-62, -6, 24, 10, 4); ctx.fill();
    k.rrect(38, -6, 24, 10, 4); ctx.fill();

    // nozul (sağa bakar)
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath();
    ctx.moveTo(70, -72); ctx.lineTo(96, -64); ctx.lineTo(96, -52); ctx.lineTo(70, -44);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = k.rgba(acc, 0.9);                         // nozul halka (vurgu)
    ctx.beginPath(); ctx.ellipse(96, -58, 6, 10, 0, 0, k.TAU); ctx.fill();

    // LED: boşta yanıp söner, puff'ta sürekli yanar
    const blink = (k.hash(Math.floor(t * 2.4)) > 0.45);
    const ledA = puffE > 0 ? 0.95 : (blink ? 0.85 : 0.15);
    ctx.fillStyle = k.rgba(acc, ledA);
    ctx.beginPath(); ctx.arc(-62, -30, 7, 0, k.TAU); ctx.fill();
    if (ledA > 0.5) k.glow(-62, -30, 22, acc, 0.4);

    ctx.restore();
  },
};
