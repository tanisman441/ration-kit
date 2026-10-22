// kitchen-fx-2/soup-simmer — kaynayan çorba tenceresi: sürekli kabarcık + buhar; boil anında fokurdama taşması.
// NOT: canvas y-aşağıdır; çorba yüzeyi y≈-8, kabarcıklar ve buhar yukarı (+y'nin tersine) yükselir.
export default {
  name: 'soup-simmer', category: 'kitchen-fx-2',
  desc: 'Kaynayan çorba tenceresi: sürekli kabarcık ve buhar; boil anında büyük fokurdama ve kenardan taşma',
  tags: ['çorba', 'tencere', 'kaynama', 'fokurdama', 'buhar', 'kabarcık', 'yemek pişirme', 'soup', 'simmer', 'boil', 'steam'],
  box: [-145, -175, 145, 125],
  bleed: 50,
  anchor: 'tencere tabanının merkezi (0,100)',
  points: { pot: [0, 45], soup: [0, -20], steam: [0, -140], rim: [-72, -10] },
  params: {
    boil: { type: 'time', default: null, desc: 'fokurdama taşması (1.0 sn): büyük kabarcık patlar, çorba kenardan taşar' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.boil == null ? -1 : t - p.boil;
    const boiling = d >= 0 && d <= 1.0;
    const g = boiling ? k.prog(d, 0, 1.0) : -1;

    // tencere sarsıntısı
    const shk = boiling ? Math.sin(d * 42) * 3 * (1 - g * 0.6) : 0;
    ctx.save(); ctx.translate(shk, 0);

    // --- 1) yan kulplar + gölge
    for (const s of [-1, 1]) {
      const hx = s > 0 ? 108 : -142;
      ctx.fillStyle = k.rgba('bg', 0.15);
      k.rrect(hx + 6, 36, 34, 20, 8); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 1);
      k.rrect(hx, 30, 34, 20, 8); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    }
    // --- 2) tencere gövdesi + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-104, -4, 220, 110, 16); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-110, -10, 220, 110, 16); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-72, 22, 20, 40, 0.15, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 3) çorba yüzeyi (elips) + içindekiler
    ctx.fillStyle = k.rgba('red', 1);
    ctx.beginPath(); ctx.ellipse(0, -8, 100, 22, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-44, -14, 34, 8, -0.15, 0, k.TAU); ctx.fill();
    // sebze parçaları (yüzer, hafif bob)
    const veg = [[-52, -10, 16, 12], [12, -14, 18, 13], [58, -8, 14, 11]];
    for (let i = 0; i < veg.length; i++) {
      const bob = boiling ? Math.sin(d * 30 + i * 2) * 4 * (1 - g * 0.5) : Math.sin(t * 2.2 + i * 2.1) * 2.5;
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.beginPath(); ctx.ellipse(veg[i][0], veg[i][1] + bob, veg[i][2], veg[i][3], 0.3 * i, 0, k.TAU); ctx.fill();
    }
    // idle: döngülü kabarcıklar (büyür → patlar, 1.3 sn)
    for (let i = 0; i < 6; i++) {
      const cyc = 1.3, ph = ((t + k.hash(i * 7 + 2) * cyc) % cyc) / cyc;
      const bx = -80 + k.hash(i * 7 + 4) * 160;
      const r = 11 * Math.sin(ph * Math.PI);
      if (r > 1) {
        ctx.fillStyle = k.rgba('red', 0.9);
        ctx.beginPath(); ctx.arc(bx, -10 - ph * 6, r, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3; ctx.stroke();
      }
    }

    // --- 4) kepçe (sağda, eğik sap)
    ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(118, -110); ctx.lineTo(66, -34); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.ellipse(56, -24, 16, 22, 0.6, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();

    // --- 5) idle: buhar (3 kıvrım, 4 sn döngüde yükselir)
    const steamN = boiling ? 5 : 3;
    for (let i = 0; i < steamN; i++) {
      const cyc = 4, ph = ((t * (boiling ? 1.8 : 1) + i * (cyc / steamN)) % cyc) / cyc;
      const sx = -60 + i * 40;
      const wob = k.noise1(t * 1.8 + i * 11) * 14;
      const y0 = -40 - ph * 100;
      const alpha = (boiling ? 0.7 : 0.5) * Math.sin(ph * Math.PI);
      ctx.strokeStyle = k.rgba('ink', alpha);
      ctx.lineWidth = 8 * (1 - ph * 0.5);
      ctx.beginPath();
      ctx.moveTo(sx, -40);
      ctx.bezierCurveTo(sx + wob - 14, y0 + 30, sx - wob + 14, y0 - 8, sx + wob * 0.5, y0 - 32);
      ctx.stroke();
    }

    // --- 6) boil olayı: büyük fokurdama + taşma (1.0 sn)
    if (boiling) {
      // 0–0.35: kubbe büyür; 0.35–0.6: patlar (halka + damlalar)
      const domeG = k.prog(d, 0, 0.35);
      const popG = k.prog(d, 0.35, 0.7);
      if (domeG < 1) {
        ctx.fillStyle = k.rgba('red', 1);
        ctx.beginPath(); ctx.arc(10, -12, 8 + 26 * domeG, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = line; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(10, -12, 8 + 26 * domeG, Math.PI, 0); ctx.stroke();
      } else {
        ctx.strokeStyle = k.rgba('red', 0.7 * (1 - popG));
        ctx.lineWidth = 7 * (1 - popG) + 2;
        ctx.beginPath(); ctx.arc(10, -30, 12 + popG * 44, 0, k.TAU); ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const ang = -Math.PI / 2 + (k.hash(i * 3 + 8) - 0.5) * 2.0;
          const dist = (50 + k.hash(i * 3 + 10) * 70) * k.E.outCubic(popG);
          ctx.fillStyle = k.rgba('red', 0.9 * (1 - popG));
          ctx.beginPath();
          ctx.arc(10 + Math.cos(ang) * dist, -24 + Math.sin(ang) * dist, 4 + k.hash(i * 5) * 4, 0, k.TAU);
          ctx.fill();
        }
      }
      // kenardan taşma (0.4–1.0): sol kenardan damlama
      const og = k.prog(d, 0.4, 1.0);
      if (og > 0) {
        const dripLen = 60 * k.E.outCubic(og);
        ctx.fillStyle = k.rgba('red', 0.95);
        k.rrect(-118, -6, 16, dripLen, 8); ctx.fill();
        ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
        ctx.beginPath(); ctx.arc(-110, -6 + dripLen + 6, 9, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
      }
    }
    ctx.restore();
  },
};
