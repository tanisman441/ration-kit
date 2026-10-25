// blacksmith-fx/forge-glow — demirci ocağı; korlar yanıp söner, alevler dans eder, kor parçaları yükselir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ocak ağzı / kor merkezi.
export default {
  name: 'forge-glow', category: 'blacksmith-fx',
  desc: 'Taş demirci ocağı; kor yatağı yanıp söner, üç alev dili dans eder, kor parçaları yükselir',
  tags: ['ocak', 'demirci', 'kor', 'alev', 'ateş', 'forge', 'blacksmith', 'fire', 'ember', 'glow', 'coals'],
  box: [-130, -110, 130, 110],
  bleed: 50,
  anchor: 'ocak ağzı / kor merkezi (0,0); ocak tabanı y ~100',
  points: { fire: [0, -10], coals: [0, 30], chimney: [0, -100] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // kor nabzı: 2.2 sn periyot
    const pulse = 0.6 + 0.4 * Math.sin(t * k.TAU / 2.2);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // baca (üstte)
    blob(-34, -108, 68, 46, 10, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-28, -104, 56, 8, 4); ctx.fill();

    // ocak gövdesi: taş kemer
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-104, -70, 208, 164, 18); ctx.fill();
    blob(-104, -70, 208, 164, 18, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, -52, 20, 8, 0, 0, k.TAU); ctx.fill();
    // taş derzleri
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-104, -20); ctx.lineTo(-78, -20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(78, -20); ctx.lineTo(104, -20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-104, 40); ctx.lineTo(-78, 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(78, 40); ctx.lineTo(104, 40); ctx.stroke();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-60, 88, 164, 10, 5); ctx.fill();

    // ocak ağzı (iç oyuk)
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-72, -58, 144, 118, 14); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-66, -52, 132, 106, 12); ctx.fill();

    // kor yatağı: yanıp sönen kor parçaları
    k.glow(0, 20, 62, 'red', 0.3 + 0.25 * pulse);
    for (let i = 0; i < 7; i++) {
      const cx = -52 + i * 17 + k.noise1(i * 5) * 4;
      const cy = 34 + k.hash(i + 20) * 12;
      const glowI = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.2 + i * 1.3);
      ctx.fillStyle = k.rgba('red', 0.5 + 0.4 * glowI);
      ctx.beginPath(); ctx.ellipse(cx, cy, 11, 8, k.hash(i) * 0.6 - 0.3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.75 * glowI);
      ctx.beginPath(); ctx.ellipse(cx, cy - 2, 5, 3.5, 0, 0, k.TAU); ctx.fill();
    }

    // alevler: üç dil, noise ile dans eder
    const flame = (fx, baseH, wdt, seed) => {
      const h = baseH * (0.75 + 0.45 * (0.5 + 0.5 * k.noise1(t * 2.6 + seed)));
      const sway = k.noise1(t * 1.8 + seed * 3) * 7;
      ctx.fillStyle = k.rgba('red', 0.9);
      ctx.beginPath();
      ctx.moveTo(fx - wdt, 30);
      ctx.bezierCurveTo(fx - wdt - 6, -h * 0.4, fx + sway - wdt * 0.4, -h * 0.75, fx + sway, -h);
      ctx.bezierCurveTo(fx + sway + wdt * 0.4, -h * 0.75, fx + wdt + 6, -h * 0.4, fx + wdt, 30);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath();
      ctx.moveTo(fx - wdt * 0.55, 30);
      ctx.bezierCurveTo(fx - wdt * 0.5, -h * 0.35, fx + sway * 0.7 - wdt * 0.2, -h * 0.55, fx + sway * 0.7, -h * 0.62);
      ctx.bezierCurveTo(fx + sway * 0.7 + wdt * 0.2, -h * 0.55, fx + wdt * 0.5, -h * 0.35, fx + wdt * 0.55, 30);
      ctx.closePath(); ctx.fill();
    };
    flame(-34, 52, 15, 3);
    flame(2, 72, 19, 11);
    flame(38, 46, 14, 23);

    // yükselen kor parçaları
    for (let i = 0; i < 6; i++) {
      const cyc = (t * 0.55 + k.hash(i + 60)) % 1;
      const px = (k.hash(i + 70) - 0.5) * 70 + Math.sin(cyc * 8 + i) * 5;
      const py = 10 - cyc * 78;
      ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - cyc));
      ctx.beginPath(); ctx.ellipse(px, py, 3, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};
