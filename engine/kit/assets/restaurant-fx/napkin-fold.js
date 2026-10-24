// restaurant-fx/napkin-fold — ayakta duran katlanmış peçete (çadır formu); "fold" (0-1) düz → dik katlanma derecesi.
// NOT: canvas y-aşağıdır; peçete tabanı y=44, katlama yükseldikçe sırt (-y) dikleşir.
export default {
  name: 'napkin-fold', category: 'restaurant-fx',
  desc: 'Ayakta duran katlanmış peçete; katlanma derecesi animasyonlu, zarif salınım',
  tags: ['peçete', 'katlama', 'peçete katlama', 'restoran', 'masa düzeni', 'şık sunum', 'napkin', 'napkin fold', 'table setting', 'restaurant decor'],
  box: [-135, -165, 135, 65],
  bleed: 36,
  anchor: 'peçete tabanı (0,44); katlama sırtı yukarı yükselir',
  points: { ridge: [0, -120], base_left: [-70, 44], base_right: [70, 44], table: [0, 52] },
  params: {
    fold: { type: 'number', default: 0.8, desc: '0-1: katlanma derecesi (düz → dik çadır formu)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const f = k.clamp(p.fold ?? 0.8, 0, 1);
    const ef = k.E.inOutCubic(f);

    // idle: zarif salınım (±1.6°, 3.4 sn periyot) + hafif nefes
    const sway = Math.sin(t * 1.85) * 0.028;
    const breath = Math.sin(t * 2.6) * 1.5;
    ctx.save();
    ctx.translate(0, 44); ctx.rotate(sway); ctx.translate(0, -44);

    // --- 1) masa yüzeyi
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-129, 58, 258, 12, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-135, 52, 270, 12, 6); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();

    // gölge (sağ alta)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(10, 50, 74, 8, 0, 0, k.TAU); ctx.fill();

    // --- katlama geometrisi: sırt yüksekliği ve yan kenarların içe toplanması
    const ridgeY = k.lerp(40, -120 + breath, ef);   // sırt tepesi
    const baseW = k.lerp(88, 70, ef);               // taban genişliği
    const tuck = k.lerp(0, 16, ef);                 // yan kenar içe kıvrımı

    // --- 2) sol panel
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath();
    ctx.moveTo(-baseW + 6, 50); ctx.lineTo(6, ridgeY + 6); ctx.lineTo(6, 50);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath();
    ctx.moveTo(-baseW, 44); ctx.lineTo(0, ridgeY); ctx.lineTo(0, 44);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // sol panel parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-baseW * 0.55, ridgeY * 0.35 + 20, 16, 30, 0.35, 0, k.TAU); ctx.fill();

    // --- 3) sağ panel (hafif koyu = tek ton gölge hissi; purple vurgu sırt bandında)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath();
    ctx.moveTo(baseW + 6, 50); ctx.lineTo(6, ridgeY + 6); ctx.lineTo(6, 50);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.28);
    ctx.beginPath();
    ctx.moveTo(baseW, 44); ctx.lineTo(0, ridgeY); ctx.lineTo(0, 44);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(baseW, 44); ctx.lineTo(0, ridgeY); ctx.lineTo(0, 44);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();

    // --- 4) sırt bandı (purple vurgu = zarif katlama izi)
    const bandW = 5 + ef * 3;
    ctx.strokeStyle = k.rgba('purple', 0.9); ctx.lineWidth = bandW;
    ctx.beginPath(); ctx.moveTo(0, ridgeY + 4); ctx.lineTo(0, 44); ctx.stroke();

    // --- 5) katlama kıvrım çizgileri (ef ile belirginleşir; ink, ince)
    ctx.strokeStyle = k.rgba('ink', 0.5 + ef * 0.25); ctx.lineWidth = 3.5;
    for (let i = 1; i <= 2; i++) {
      const yy = k.lerp(44, ridgeY, (i / 3) * ef + 0.08);
      const hw = k.lerp(baseW * (i / 3), 4, ef * (i / 3));
      ctx.beginPath(); ctx.moveTo(-hw + tuck * (i / 3), yy); ctx.lineTo(hw - tuck * (i / 3), yy); ctx.stroke();
    }

    // --- 6) kıvrım kıvılcımları: katlanma arttıkça sırt çevresinde parıltı (canlı)
    if (ef > 0.4) {
      const tw = (t % 2.6) / 2.6;
      const a = Math.sin(tw * Math.PI);
      for (let i = 0; i < 3; i++) {
        const px = (k.hash(i * 7 + 1) - 0.5) * 44;
        const py = ridgeY + 14 + k.hash(i * 7 + 3) * 60 * ef;
        ctx.fillStyle = k.rgba('purple', 0.55 * a * ef);
        ctx.beginPath(); ctx.arc(px, py - tw * 12, 3, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
    ctx.restore();
  },
};
