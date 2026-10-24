// restaurant-fx/bill-fold — tepsideki adisyon katlanır; "at" anında üst yarı kıvrılıp alt yarının üstüne kapanır.
// NOT: canvas y-aşağıdır; adisyon dikey durur, katlama çizgisi y=-24'te, üst yarı yukarı kıvrılır.
export default {
  name: 'bill-fold', category: 'restaurant-fx',
  desc: 'Tepsideki adisyonun katlanması; katlama anında üst yarının kıvrılıp kapanması',
  tags: ['adisyon', 'hesap', 'fatura', 'katlama', 'restoran', 'tepsi', 'ödeme', 'bill', 'check', 'fold', 'restaurant bill', 'receipt'],
  box: [-150, -150, 150, 90],
  bleed: 40,
  anchor: 'tepsi merkezi (0,24); adisyon katlama çizgisi (0,-24)',
  points: { crease: [0, -24], paper_top: [0, -108], tray: [0, 40], total: [0, 22] },
  params: {
    at: { type: 'time', default: null, desc: 'katlama anı (üst yarı kıvrılır, ~0.9 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const folding = d >= 0 && d <= 1.0;
    const folded = d > 1.0; // katlama kalıcıdır: olay bitince katlı kalır

    // katlama fazları: 0–0.45 üst yarı dikilir (scaleY 1→0), 0.45–0.9 alt yarının üstüne yatar (scaleY 0→1, ters)
    let liftG = 0, layG = 0;
    if (folding) {
      liftG = k.prog(d, 0, 0.45);
      layG = k.prog(d - 0.45, 0, 0.45);
    } else if (folded) {
      liftG = 1; layG = 1;
    }

    // --- 1) tepsi
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-104, 50, 208, 18, 9); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.ellipse(0, 44, 100, 20, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, 41, 88, 14, 0, 0, k.TAU); ctx.fill();

    const flutter = (folding || folded) ? 0 : Math.sin(t * 2.2) * 0.012; // idle: köşe hafifçe titrer
    ctx.save();
    ctx.translate(0, 30); ctx.rotate(flutter); ctx.translate(0, -30);

    const PW = 56, CREASE = -24, TOP = -116, BOT = 30;
    const paperH = BOT - TOP;

    // --- 2) alt yarı (sabit)
    const botH = BOT - CREASE;
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-PW + 6, CREASE + 6, PW * 2, botH, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.92);
    k.rrect(-PW, CREASE, PW * 2, botH, 8); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // alt yarı satırları (ink, alfa 0.75 ince iç detay)
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3.5;
    for (let i = 0; i < 3; i++) {
      const yy = CREASE + 14 + i * 13;
      ctx.beginPath(); ctx.moveTo(-PW + 14, yy); ctx.lineTo(PW - 22 - (i === 2 ? 14 : 0), yy); ctx.stroke();
    }
    // toplam satırı (green vurgu = ödeme)
    ctx.strokeStyle = k.rgba('green', 1); ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(-PW + 14, BOT - 8); ctx.lineTo(PW - 14, BOT - 8); ctx.stroke();

    // --- 3) üst yarı: katlanırken kıvrılır
    // katlama öncesi: normal; lift fazı: scaleY ile dikilir; lay fazı: alt yarının üstüne ters yatar
    ctx.save();
    if (layG > 0) {
      // alt yarının üstüne yatmış: pivot katlama çizgisi, ters yönde scaleY
      const s = k.E.inOutCubic(layG);
      ctx.translate(0, CREASE); ctx.scale(1, -s * 0.92); ctx.translate(0, -CREASE);
      ctx.globalAlpha = 0.97;
    } else if (liftG > 0) {
      // dikilme: pivot katlama çizgisi, yukarı doğru kısalır + hafif eğilir
      const s = k.E.inOutCubic(liftG);
      ctx.translate(0, CREASE); ctx.scale(1 - s * 0.12, 1 - s * 0.96); ctx.translate(0, -CREASE);
      ctx.translate(s * 8, 0);
    }
    const topH = CREASE - TOP;
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-PW + 6, TOP + 6, PW * 2, topH, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.92);
    k.rrect(-PW, TOP, PW * 2, topH, 8); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // üst yarı satırları
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3.5;
    for (let i = 0; i < 4; i++) {
      const yy = TOP + 14 + i * 13;
      ctx.beginPath(); ctx.moveTo(-PW + 14, yy); ctx.lineTo(PW - 14 - (i % 2) * 18, yy); ctx.stroke();
    }
    // üst yarı sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-PW + 20, TOP + 16, 18, 6, -0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 4) katlama çizgisi (kıvrım izi; katlanırken belirginleşir)
    const creaseA = folding ? 0.5 + 0.5 * Math.sin(k.prog(d, 0, 0.9) * Math.PI) : 0.3;
    ctx.strokeStyle = k.rgba('bg', creaseA); ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.moveTo(-PW + 6, CREASE); ctx.lineTo(PW - 6, CREASE); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // --- 5) "at" olayı: katlama sonu küçük toz/kağıt kıvılcımı + kıvrım vurgusu
    if (folding && d > 0.6) {
      const g = k.prog(d - 0.6, 0, 0.4);
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * k.TAU + 0.4;
        const dist = (14 + k.hash(i * 5 + 3) * 30) * k.E.outExpo(g);
        ctx.strokeStyle = k.rgba('ink', 0.6 * (1 - g));
        ctx.lineWidth = 3.5 * (1 - g) + 1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * 40, CREASE + Math.sin(ang) * 10);
        ctx.lineTo(Math.cos(ang) * (40 + dist), CREASE + Math.sin(ang) * (10 + dist * 0.4));
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
