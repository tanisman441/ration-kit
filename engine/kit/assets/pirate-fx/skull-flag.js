// pirate-fx/skull-flag — Kuru kafalı korsan bayrağı: kumaş rüzgarda sürekli döngülü dalgalanır,
// kuru kafa deseni kumaşın dalgasını takip eder.
// NOT: canvas y-aşağıdır; (0,0) direk tabanıdır, bayrak direğin sağına açılır.
export default {
  name: 'skull-flag', category: 'pirate-fx',
  desc: 'Kuru kafa desenli korsan bayrağı: kumaş rüzgarda sürekli döngülü dalgalanır, desen dalgayı takip eder',
  tags: ['korsan bayrağı', 'kuru kafa', 'jolly roger', 'bayrak', 'rüzgar', 'gemi', 'skull', 'pirate', 'flag', 'jolly roger', 'banner', 'wind'],
  box: [-115, -135, 115, 110],
  bleed: 30,
  anchor: 'direk tabanı',
  points: { top: [-90, -112], fly: [100, 0] },
  params: {
    color: { type: 'color', default: 'ink', desc: 'bayrak kumaşı' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    // kumaş dalgası: direğe yakın sabit, uca doğru büyüyen genlik (döngülü)
    const wave = x => {
      const u = (x + 90) / 190;
      return Math.sin(x * 0.045 - t * 3.6) * (6 + u * 8.5) + Math.sin(x * 0.11 - t * 7) * 3 * u;
    };
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // direk hafif sallanır
    ctx.translate(-90, 95);
    ctx.rotate(0.02 * Math.sin(t * 1.3));
    ctx.translate(90, -95);

    // direk
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-97 - LW / 2, -105 - LW / 2, 14 + LW, 200 + LW, 7); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-97, -105, 14, 200, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-94, -100, 5, 190, 2.5); ctx.fill();
    // tepelik
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(-90, -114, 12, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); ctx.arc(-90, -114, 9, 0, k.TAU); ctx.fill();
    k.glow(-90, -114, 20, 'yellow', 0.25 + 0.1 * Math.sin(t * 2.4));

    // kumaş: dalgalı üst/alt kenar
    ctx.beginPath();
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const x = -90 + (190 * i) / steps;
      const y = -50 + wave(x);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = steps; i >= 0; i--) {
      const x = -90 + (190 * i) / steps;
      ctx.lineTo(x, 50 + wave(x));
    }
    ctx.closePath();
    ctx.fillStyle = line;
    ctx.fill();
    // iç dolgu: kenarı biraz içerde çiz (dış hat efekti)
    ctx.save();
    ctx.clip();
    ctx.fillStyle = k.rgba(p.color);
    ctx.fillRect(-100, -70, 220, 140);
    // premium parlama: kumaş üstünde sol üstten ince şerit
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = -90 + (190 * i) / steps;
      const y = -50 + wave(x);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = steps; i >= 0; i--) {
      const x = -90 + (190 * i) / steps;
      ctx.lineTo(x, -28 + wave(x));
    }
    ctx.closePath(); ctx.fill();
    // sağ alt gölge şeridi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = -90 + (190 * i) / steps;
      const y = 28 + wave(x);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = steps; i >= 0; i--) {
      const x = -90 + (190 * i) / steps;
      ctx.lineTo(x, 50 + wave(x));
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // kuru kafa deseni: dalgayı takip eder (orta noktadaki dalga kadar kayar)
    const so = wave(5) * 0.9;
    ctx.save();
    ctx.translate(5, so);
    // çapraz kemikler
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-40, -24); ctx.lineTo(46, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-40, 20); ctx.lineTo(46, -24); ctx.stroke();
    for (const [ex, ey] of [[-40, -24], [46, 20], [-40, 20], [46, -24]]) {
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.arc(ex, ey, 8, 0, k.TAU); ctx.fill();
    }
    // kafatası
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -8, 27, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-17 - 3, 2 - 3, 34 + 6, 22 + 6, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, -8, 24, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-17, 2, 34, 22, 8); ctx.fill();
    // gözler (kumaş rengiyle oyulmuş)
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(-9, -12, 7, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(11, -12, 7, 0, k.TAU); ctx.fill();
    // burun + diş çizgileri
    ctx.beginPath();
    ctx.moveTo(1, 2); ctx.lineTo(-5, 12); ctx.lineTo(7, 12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba(p.color, 0.8); ctx.lineWidth = 2.5;
    for (const tx of [-8, 1, 10]) {
      ctx.beginPath(); ctx.moveTo(tx, 14); ctx.lineTo(tx, 22); ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  },
};
