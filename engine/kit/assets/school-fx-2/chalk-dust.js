// school-fx-2/chalk-dust — tebeşir tozu bulutu:
// tebeşir tahtanın üstünde hafif titrer (idle); at anında tahtaya vurur,
// vuruş noktasından toz patlaması ve parçacıklar yayılıp sönümlenir;
// idle'da havada asılı duran hafif toz zerrecikleri vardır.
// canvas y-aşağı; (0,0) sahne merkezi.
export default {
  name: 'chalk-dust', category: 'school-fx-2',
  desc: 'Tebeşir tozu: at anında tebeşir tahtaya vurur, toz bulutu patlar',
  tags: ['tebeşir', 'toz', 'tahta', 'vuruş', 'bulut', 'chalk', 'dust', 'board', 'hit', 'okul', 'sınıf', 'parçacık'],
  box: [-115, -95, 115, 95],
  bleed: 30,
  anchor: 'sahne merkezi',
  points: { impact: [0, 30], chalk: [-10, -18] },
  params: {
    at: { type: 'time', default: null, desc: 'tebeşirin tahtaya vurma anı (toz patlaması ~1.1 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;

    // tahta şeridi
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-89, 36, 190, 44, 10); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-101, 24, 190, 44, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-95, 30, 190, 44, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, 40, 26, 6, -0.1, 0, k.TAU); ctx.fill();

    // tebeşir konumu: idle'da havada titrer, at anında tahtaya iner
    let cx = -10 + k.noise1(t * 9) * 1.5, cy = -18 + k.noise1(t * 7 + 40) * 1.5, ca = -0.5;
    if (d >= 0) {
      if (d < 0.12) { const g = k.prog(d, 0, 0.12); cx = k.lerp(-10, 0, g); cy = k.lerp(-18, 22, g); ca = k.lerp(-0.5, -0.15, g); }
      else { cx = 2 * Math.sin(d * 30) * Math.exp(-d * 6); cy = 22; ca = -0.15 + 0.05 * Math.sin(d * 25) * Math.exp(-d * 5); }
    }

    // toz patlaması (parçacıklar)
    if (d >= 0 && d < 1.0) {
      for (let i = 0; i < 24; i++) {
        const h1 = k.hash(i * 13 + 1), h2 = k.hash(i * 29 + 7), h3 = k.hash(i * 47 + 3);
        const dd = d - h1 * 0.22;
        if (dd < 0 || dd > 0.8) continue;
        const ang = -Math.PI / 2 + (h2 - 0.5) * 2.6;
        const dist = (dd / 0.8) * (44 + h3 * 56);
        const px = Math.cos(ang) * dist, py = 30 + Math.sin(ang) * dist + dd * 30;
        ctx.fillStyle = k.rgba('dim', 0.8 * (1 - dd / 0.8));
        ctx.beginPath(); ctx.arc(px, py, 2.5 + h3 * 3.5, 0, k.TAU); ctx.fill();
      }
      // yumuşak toz bulutu
      for (let j = 0; j < 5; j++) {
        const dd = d - j * 0.05;
        if (dd < 0 || dd > 1.1) continue;
        ctx.fillStyle = k.rgba('dim', 0.36 * (1 - dd / 1.1));
        ctx.beginPath();
        ctx.arc((j - 2) * 18 + dd * 10 * (j - 2), 26 - dd * 26, 15 + dd * 40, 0, k.TAU);
        ctx.fill();
      }
      // vuruş halkası
      if (d < 0.4) {
        ctx.strokeStyle = k.rgba('ink', 0.4 * (1 - d / 0.4));
        ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, 30, 8 + d * 160, 0, k.TAU); ctx.stroke();
      }
    }

    // asılı toz (idle, her zaman)
    const moteA = d >= 0 && d < 1.2 ? 0.12 : 0.24;
    for (let i = 0; i < 6; i++) {
      const mx = -72 + i * 27 + 8 * Math.sin(t * 0.7 + i * 2);
      const my = -42 + 22 * Math.sin(t * 0.5 + i * 1.3);
      ctx.fillStyle = k.rgba('dim', moteA);
      ctx.beginPath(); ctx.arc(mx, my, 1.7, 0, k.TAU); ctx.fill();
    }

    // tebeşir parçası (beyaz)
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(ca);
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-28, -4, 52, 15, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); k.rrect(-26, -7.5, 52, 15, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-11, -4.5, 11, 3.5, 0, 0, k.TAU); ctx.fill();
    // kırık uç
    ctx.fillStyle = k.rgba('ink', 0.3);
    ctx.beginPath(); ctx.moveTo(26, -7.5); ctx.lineTo(19, -1); ctx.lineTo(26, 4.5); ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
