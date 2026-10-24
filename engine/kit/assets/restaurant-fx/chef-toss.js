// restaurant-fx/chef-toss — şef tavada malzemeyi havaya atıp tutar; "at" anında 1.2 sn'lik atış-yakalama sekansı.
// NOT: canvas y-aşağıdır; tava (0,0) merkezli, malzeme yukarı (-y) fırlar, ateş sağ altta.
export default {
  name: 'chef-toss', category: 'restaurant-fx',
  desc: 'Şefin tavada malzeme atıp tutması; atış, parabolik uçuş ve inişte buhar patlaması',
  tags: ['tava', 'şef', 'atıp tutma', 'wok', 'yemek pişirme', 'ocak', 'alev', 'chef', 'pan toss', 'flipping', 'wok toss', 'cooking'],
  box: [-200, -190, 200, 90],
  bleed: 52,
  anchor: 'tava gövdesi merkezi (0,0); sap sağa uzanır',
  points: { pan: [0, 0], handle_tip: [182, 1], apex: [0, -140], fire: [45, 64], food: [-20, -40] },
  params: {
    at: { type: 'time', default: null, desc: 'atış anı (malzeme havalanır, 1.2 sn sonra tavaya düşer)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const tossing = d >= 0 && d <= 1.25;

    // --- tava sallantısı: atışta tavayı geriye çekme (0–0.3 sn)
    const jerk = tossing ? Math.sin(k.prog(d, 0, 0.35) * Math.PI) : 0;
    const panDX = -jerk * 26, panDY = jerk * 14, panRot = jerk * -0.16;

    // --- 1) ocak ateşi (tava altında, yellow vurgu; idle'da yalpalayan alev)
    const flameH = 46 + Math.sin(t * 9) * 6 + (tossing ? Math.sin(k.prog(d, 0.3, 1.25) * Math.PI) * 12 : 0);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(46, 84, 62, 11, 0, 0, k.TAU); ctx.fill();
    k.glow(45, 56, 52, 'yellow', 0.4);
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath();
    ctx.moveTo(16, 78);
    ctx.quadraticCurveTo(8, 78 - flameH, 30 + k.noise1(t * 7) * 9, 78 - flameH - 12);
    ctx.quadraticCurveTo(52, 78 - flameH, 44, 78);
    ctx.quadraticCurveTo(58, 78 - flameH * 0.6, 66, 78);
    ctx.quadraticCurveTo(72, 78 - flameH * 0.5, 76, 78);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath();
    ctx.moveTo(26, 78);
    ctx.quadraticCurveTo(24, 78 - flameH * 0.55, 36, 78 - flameH * 0.55 - 7);
    ctx.quadraticCurveTo(48, 78 - flameH * 0.55, 46, 78);
    ctx.closePath(); ctx.fill();

    // --- tava grubu
    ctx.save();
    ctx.translate(panDX, panDY); ctx.rotate(panRot);

    // --- 2) sap (sağda)
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(106, -4, 82, 22, 11); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(100, -10, 82, 22, 11); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); ctx.arc(172, 1, 5, 0, k.TAU); ctx.fill();

    // --- 3) tava gövdesi (yandan: geniş ağız + daralan taban)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath();
    ctx.moveTo(-106, 6); ctx.lineTo(-72, 52);
    ctx.quadraticCurveTo(6, 60, 84, 52); ctx.lineTo(118, 6);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath();
    ctx.moveTo(-112, 0); ctx.lineTo(-78, 46);
    ctx.quadraticCurveTo(0, 54, 78, 46); ctx.lineTo(112, 0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 8; ctx.stroke();
    // ağız kenarı (üst elips)
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.ellipse(0, 0, 112, 20, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 8; ctx.stroke();
    // iç yüzey
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 2, 98, 14, 0, 0, k.TAU); ctx.fill();
    // gövde sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-72, 24, 32, 9, -0.45, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 4) malzeme parçaları: idle'da tavada, atışta parabolik uçuş
    // uçuş: t0=0.3 fırlatma, tepe ~0.65, iniş 1.15 (tava hareketine göreli ofset)
    const chunks = [[-52, 2, 26], [-6, -6, 32], [44, 0, 24]];
    let landed = false;
    for (let i = 0; i < chunks.length; i++) {
      const [bx, by, sz] = chunks[i];
      let cx = bx, cy = by, rot = 0, squash = 1;
      if (tossing) {
        const ft = d - 0.3 - i * 0.04; // fırlatma zamanı (hafif kademeli)
        if (ft > 0 && ft < 0.85) {
          const g = k.prog(ft, 0, 0.85);
          const H = 150 + i * 14; // tepe yüksekliği
          cx = bx + (k.hash(i * 11 + 5) - 0.5) * 40 * g;
          cy = by - 4 * H * g * (1 - g); // parabol
          rot = g * 2.2 * (i % 2 === 0 ? 1 : -1);
        } else if (ft >= 0.85) {
          // iniş: küçük ezilme
          const lg = k.prog(ft - 0.85, 0, 0.25);
          squash = 1 - 0.28 * Math.sin(lg * Math.PI);
          cy = by + (1 - squash) * 6;
          landed = true;
        }
      }
      // idle: tavada hafif zıplama
      if (!tossing) cy = by + Math.sin(t * 3.4 + i * 2.1) * 2.5;
      ctx.save();
      ctx.translate(cx, cy - sz / 2); ctx.rotate(rot); ctx.scale(1 / squash, squash);
      ctx.fillStyle = k.rgba('bg', 0.15);
      ctx.beginPath(); ctx.ellipse(5, 5, sz / 2, sz / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(i === 1 ? 'yellow' : 'dim', 1);
      ctx.beginPath(); ctx.ellipse(0, 0, sz / 2, sz / 2, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(-sz / 6, -sz / 5, sz / 5, sz / 6, -0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // --- 5) idle: kızarma buharı (tava üstünden yükselir, 3.6 sn döngü)
    for (let i = 0; i < 2; i++) {
      const cyc = 3.6, ph = ((t + i * 1.8) % cyc) / cyc;
      const sx = -40 + i * 70, wob = k.noise1(t * 1.8 + i * 13) * 12;
      const y0 = -30 - ph * 55;
      ctx.strokeStyle = k.rgba('ink', 0.4 * Math.sin(ph * Math.PI));
      ctx.lineWidth = 7 * (1 - ph * 0.5);
      ctx.beginPath();
      ctx.moveTo(sx, -30);
      ctx.bezierCurveTo(sx + wob - 14, y0 + 18, sx - wob + 14, y0 - 4, sx + wob * 0.5, y0 - 20);
      ctx.stroke();
    }

    // --- 6) iniş olayı: buhar patlaması + tavaya dönüş (d≈1.15–1.25)
    if (landed && d > 1.05) {
      const g = k.prog(d - 1.05, 0, 0.2);
      for (let i = 0; i < 8; i++) {
        const ang = -Math.PI / 2 + (k.hash(i * 3 + 21) - 0.5) * 2.2;
        const dist = (30 + k.hash(i * 3 + 23) * 60) * k.E.outExpo(g);
        ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - g));
        ctx.lineWidth = 6 * (1 - g) + 2;
        ctx.beginPath(); ctx.moveTo(-6, -10); ctx.lineTo(-6 + Math.cos(ang) * dist, -10 + Math.sin(ang) * dist); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
