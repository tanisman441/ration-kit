// kitchen-fx/sizzle — tavada kızaran yemek: cızırtı parçacıkları + duman; sizzle anında cızırtı patlaması.
// NOT: canvas y-aşağıdır; tava tabanı y≈0, yağ cızırtısı ve duman yukarı (+y'nin tersine) fırlar.
export default {
  name: 'sizzle', category: 'kitchen-fx',
  desc: 'Tavada kızaran yemek parçaları; yağ cızırtısı, duman ve sizzle anında büyük kıvılcım patlaması',
  tags: ['tava', 'kızartma', 'cızırtı', 'yağ', 'duman', 'yemek pişirme', 'sizzle', 'frying pan', 'oil sizzle', 'steam', 'cooking'],
  box: [-170, -140, 205, 100],
  bleed: 44,
  anchor: 'tava gövdesinin merkezi (0,0)',
  points: { pan: [0, 20], food: [0, -46], steam: [-40, -110], handle_tip: [196, 12] },
  params: {
    sizzle: { type: 'time', default: null, desc: 'cızırtı patlaması anı (kıvılcım + buhar püskürmesi, ~1 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.sizzle == null ? -1 : t - p.sizzle;
    const bursting = d >= 0 && d <= 1.0;

    // --- 1) tava sapı (sağda) + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(122, 8, 84, 20, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(116, 2, 84, 20, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // sap deliği
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); ctx.arc(188, 12, 5, 0, k.TAU); ctx.fill();

    // --- 2) tava gövdesi + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-118, -4, 240, 58, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-124, -10, 240, 58, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // tava iç yüzeyi (daha koyu şerit)
    ctx.fillStyle = k.rgba('bg', 0.35);
    k.rrect(-112, -10, 216, 14, 7); ctx.fill();
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-88, 8, 46, 12, -0.25, 0, k.TAU); ctx.fill();

    // --- 3) yemek parçaları (3 parça, hafif zıplama)
    const chunks = [[-72, -44, 30, 24, 0.2], [-14, -58, 36, 28, 1.3], [58, -44, 30, 24, 2.6]];
    for (let i = 0; i < chunks.length; i++) {
      const [cx, cy, w, h, ph] = chunks[i];
      const hop = Math.sin(t * 3.1 + ph) * 2.2;
      ctx.fillStyle = k.rgba('bg', 0.15);
      ctx.beginPath(); ctx.ellipse(cx + 6, cy + hop + h / 2 + 6, w / 2, h / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 1);
      ctx.beginPath(); ctx.ellipse(cx, cy + hop, w / 2, h / 2, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
      // iç detay + parlama
      ctx.fillStyle = k.rgba('ink', 0.35);
      ctx.beginPath(); ctx.ellipse(cx, cy + hop + 2, w / 2 - 8, h / 2 - 10, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(cx - w / 5, cy + hop - h / 4, w / 5, h / 5.5, -0.5, 0, k.TAU); ctx.fill();
    }

    // --- 4) idle: yağ kabarcıkları (döngülü patlama, 1.1 sn)
    for (let i = 0; i < 6; i++) {
      const bx = -95 + k.hash(i * 7 + 1) * 190;
      const by = -16 - k.hash(i * 7 + 3) * 22;
      const cyc = 1.1, ph = ((t + k.hash(i * 13) * cyc) % cyc) / cyc;
      const r = 2 + 5 * Math.sin(ph * Math.PI);
      if (r > 0.6) {
        ctx.fillStyle = k.rgba('yellow', 0.75 * (1 - ph * 0.5));
        ctx.beginPath(); ctx.arc(bx, by - ph * 8, r, 0, k.TAU); ctx.fill();
      }
    }

    // --- 5) idle: duman (2 kıvrım, 4 sn döngüde yükselir)
    for (let i = 0; i < 2; i++) {
      const cyc = 4, ph = ((t * 0.9 + i * 2) % cyc) / cyc;
      const sx = -50 + i * 90;
      const wob = k.noise1(t * 1.6 + i * 11) * 14;
      const y0 = -64 - ph * 60;
      const alpha = 0.55 * Math.sin(ph * Math.PI);
      ctx.strokeStyle = k.rgba('ink', alpha);
      ctx.lineWidth = 8 * (1 - ph * 0.5);
      ctx.beginPath();
      ctx.moveTo(sx, -64);
      ctx.bezierCurveTo(sx + wob - 16, y0 + 20, sx - wob + 16, y0 - 6, sx + wob * 0.5, y0 - 24);
      ctx.stroke();
    }

    // --- 6) idle: cızırtı parçacıkları (titreşimli kısa çizgiler)
    for (let i = 0; i < 7; i++) {
      const px = -100 + k.hash(i * 5 + 2) * 200;
      const py = -60 - k.hash(i * 5 + 4) * 26;
      const flick = 0.25 + 0.75 * Math.abs(k.noise1(t * 9 + i * 17));
      const dx = (k.hash(i * 9 + 6) - 0.5) * 16;
      ctx.strokeStyle = k.rgba('yellow', 0.8 * flick);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dx, py - 12 - flick * 8); ctx.stroke();
    }

    // --- 7) sizzle olayı: kıvılcım patlaması + buhar püskürmesi (1.0 sn)
    if (bursting) {
      const g = k.prog(d, 0, 1.0);
      k.glow(0, -60, 90 * (1 - g) + 30, 'yellow', 0.5 * (1 - g));
      for (let i = 0; i < 16; i++) {
        const ang = -Math.PI / 2 + (k.hash(i * 3 + 8) - 0.5) * 1.9;
        const dist = (40 + k.hash(i * 3 + 10) * 90) * k.E.outExpo(g);
        const sx = k.hash(i * 7 + 12) * 160 - 80;
        const ex = sx + Math.cos(ang) * dist;
        const ey = -60 + Math.sin(ang) * dist;
        ctx.strokeStyle = k.rgba(i % 3 === 0 ? 'red' : 'yellow', 0.9 * (1 - g));
        ctx.lineWidth = 5 * (1 - g) + 1.5;
        ctx.beginPath(); ctx.moveTo(sx, -60); ctx.lineTo(ex, ey); ctx.stroke();
      }
      // buhar püskürmesi: genişleyen halkalar
      for (let i = 0; i < 2; i++) {
        const gi = k.prog(d - i * 0.15, 0, 0.85);
        if (gi > 0) {
          ctx.strokeStyle = k.rgba('ink', 0.45 * (1 - gi));
          ctx.lineWidth = 8 * (1 - gi) + 2;
          ctx.beginPath(); ctx.arc(-20 + i * 40, -80 - gi * 40, 14 + gi * 46, 0, k.TAU); ctx.stroke();
        }
      }
    }
    ctx.restore();
  },
};
