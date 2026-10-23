// spell-casting/heal-glow — yeşil şifa parıltısı: yumuşak ışık küresi +
// etrafında dönen yaprak/parıltı noktaları + yükselen artı (+) parçacıkları.
// Idle: küre nefes alır (1.8 sn), parıltılar yavaş döner. `at` anında: 0.6 sn
// genişleyen ışık dalgası + hızlanan artı yağmuru.
// NOT: canvas y-aşağıdır; (0,0) şifa merkezidir.
export default {
  name: 'heal-glow', category: 'spell-casting',
  desc: 'Yeşil şifa parıltısı; at anında ışık dalgası + yükselen artı parçacıkları, idle\'da nefes alan ışık',
  tags: ['şifa', 'iyileşme', 'yeşil', 'parıltı', 'büyü', 'ışık', 'heal', 'glow', 'magic', 'cure'],
  box: [-120, -120, 120, 120],
  bleed: 50,
  anchor: 'şifa merkezi (0,0)',
  points: { centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'şifa dalgası anı (0.6 sn genişleyen ışık + artı yağmuru)' },
    color: { type: 'color', default: 'green', desc: 'şifa rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const wave = d >= 0 && d < 0.6;
    const flash = d >= 0 && d < 0.12 ? 1 - d / 0.12 : 0;

    // Nefes: küre ±4 birim, 1.8 sn periyot; at anında büyür
    const R = 40 + Math.sin(t * k.TAU / 1.8) * 4 + (wave ? (d / 0.6) * 18 : 0);

    // Dış hale
    k.glow(0, 0, 110, acc, 0.3 + flash * 0.4);

    // Gölge: %12 koyultma sağ alta
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(6, 6, R, 0, k.TAU); ctx.fill();

    // Işık küresi: yeşil dolgu + iç parlaklık
    ctx.fillStyle = k.rgba(acc, 0.85);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.6, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath(); ctx.arc(0, -R * 0.1, R * 0.32, 0, k.TAU); ctx.fill();
    if (flash > 0) { // şifa flaşı
      ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * flash).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(0, 0, R * (1 + flash * 0.4), 0, k.TAU); ctx.fill();
    }
    // Premium parlama: sol üst elips alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-R * 0.32, -R * 0.4, R * 0.4, R * 0.22, -0.5, 0, k.TAU); ctx.fill();

    // Merkez artı işareti (şifa sembolü): idle'da yavaş nabız
    const plusS = 20 + Math.sin(t * k.TAU / 1.8) * 2 + flash * 8;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    k.rrect(-plusS / 2, -plusS * 1.5 / 2 + 0, plusS, plusS * 1.5, 6); ctx.fill();
    k.rrect(-plusS * 1.5 / 2, -plusS / 2, plusS * 1.5, plusS, 6); ctx.fill();

    // Yörünge parıltıları: 6 nokta, yavaş döner (idle animasyon)
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * k.TAU + t * 0.7;                 // ~9 sn tur
      const or_ = R + 26 + k.noise1(i * 21.1 + t * 3) * 6;
      const sx = Math.cos(a) * or_, sy = Math.sin(a) * or_;
      const tw = 0.5 + 0.5 * Math.abs(Math.sin(t * 2.5 + i * 2.1));
      ctx.fillStyle = k.rgba(acc, 0.35 + tw * 0.55);
      ctx.beginPath(); ctx.arc(sx, sy, 5 + tw * 3, 0, k.TAU); ctx.fill();
      k.glow(sx, sy, 12, acc, tw * 0.35);
    }

    // Yükselen artı parçacıkları: sürekli (idle'da az, at anında çok)
    const n = wave ? 14 : 6;
    for (let i = 0; i < n; i++) {
      const speed = wave ? 1.4 : 0.55;
      const cyc = ((t * speed + k.hash(i * 33.3)) % 1);
      const px = (k.hash(i * 57.7) - 0.5) * 130;
      const py = 90 - cyc * 200;                          // aşağıdan yukarı
      const size = 8 * (1 - cyc) + 3;
      const alpha = (1 - cyc) * (wave ? 0.95 : 0.6);
      ctx.fillStyle = k.rgba(acc, alpha);
      ctx.save(); ctx.translate(px, py);
      k.rrect(-size / 2, -size * 1.4 / 2, size, size * 1.4, 3); ctx.fill();
      k.rrect(-size * 1.4 / 2, -size / 2, size * 1.4, size, 3); ctx.fill();
      ctx.restore();
    }

    // at anı: genişleyen ışık dalgası (0.6 sn)
    if (wave) {
      const pr = d / 0.6;
      const wr = 30 + (1 - Math.pow(1 - pr, 3)) * 100;
      ctx.strokeStyle = k.rgba(acc, (1 - pr) * 0.9); ctx.lineWidth = 8 * (1 - pr) + 2;
      ctx.beginPath(); ctx.arc(0, 0, wr, 0, k.TAU); ctx.stroke();
      k.glow(0, 0, wr, acc, (1 - pr) * 0.3);
    }

    ctx.restore();
  },
};
