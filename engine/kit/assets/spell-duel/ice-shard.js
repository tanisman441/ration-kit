// spell-duel/ice-shard — havada süzülen buz kristali parçası: keskin fasetli
// altıgen prizma, içinde soğuk ışık damarları. Idle: süzülme (y bob, ~3 sn) +
// hafif dönme (±6°, ~4 sn) + soğuk parıltı titremesi (hash tabanlı yıldızlar).
// `at` anında: kısa parlak kırılma (0.3 sn parıltı patlaması).
// NOT: canvas y-aşağıdır; (0,0) kristalin merkezidir.
export default {
  name: 'ice-shard', category: 'spell-duel',
  desc: 'Süzülen buz kristali parçası; soğuk parıltı titremesiyle at anında kırılma flaşı',
  tags: ['buz', 'kristal', 'soğuk', 'büyü', 'kırağı', 'ice', 'shard', 'crystal', 'frost', 'magic'],
  box: [-80, -130, 80, 130],
  bleed: 30,
  anchor: 'kristalin merkezi (0,0)',
  points: { top: [0, -95], bottom: [0, 95], centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'kırılma anı (0.3 sn: parıltı patlaması)' },
    color: { type: 'color', default: 'cyan', desc: 'kristal rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const bob = Math.sin(t * (k.TAU / 3.0)) * 6;      // süzülme
    const rot = Math.sin(t * (k.TAU / 4.0)) * 0.105;  // ±6° salınım
    ctx.translate(0, bob);
    ctx.rotate(rot);

    const H = 95, W = 34;
    // Kristal gövde: uzun altıgen
    const hw = W, hh = H;
    const xs = [0, hw * 0.85, hw * 0.85, 0, -hw * 0.85, -hw * 0.85];
    const ys = [-hh, -hh * 0.45, hh * 0.45, hh, hh * 0.45, -hh * 0.45];

    ctx.fillStyle = k.rgba(acc, 0.38);
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < 6; i++) ctx.lineTo(xs[i], ys[i]);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.stroke();

    // Faset damarları (ink, ince) — soğuk ışık çatlakları
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -hh); ctx.lineTo(0, hh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw * 0.85, -hh * 0.45); ctx.lineTo(hw * 0.85, -hh * 0.45); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw * 0.85, hh * 0.45); ctx.lineTo(hw * 0.85, hh * 0.45); ctx.stroke();

    // Sağ alt gölge (faset karartma)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath();
    ctx.moveTo(0, -hh);
    ctx.lineTo(hw * 0.85, -hh * 0.45);
    ctx.lineTo(hw * 0.85, hh * 0.45);
    ctx.lineTo(0, hh);
    ctx.closePath(); ctx.fill();

    // Sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-hw * 0.35, -hh * 0.6, hw * 0.32, hh * 0.28, -0.4, 0, k.TAU); ctx.fill();

    // Soğuk parıltı yıldızları: 5 nokta, hash tabanlı yanıp sönme
    const sparkle = d >= 0 && d < 0.3 ? 1.6 * (1 - d / 0.3) : 1; // at anında güçlenme
    for (let i = 0; i < 5; i++) {
      const h = k.hash(i * 27.9 + 5);
      const sx = (h - 0.5) * hw * 1.7;
      const sy = -hh + (h * 7.3 % 1) * 2 * hh;
      const ph = (t * 2.2 + h * 6.28) % 6.28;
      const a = (0.25 + 0.75 * Math.abs(Math.sin(ph))) * sparkle;
      if (a <= 0.02) continue;
      const sr = 4 * (0.6 + 0.6 * Math.abs(Math.sin(ph)));
      ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, a * 0.9).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, k.TAU); ctx.fill();
      // artı parıltısı
      ctx.strokeStyle = 'rgba(255,255,255,' + Math.min(1, a * 0.7).toFixed(3) + ')'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sx - sr * 1.8, sy); ctx.lineTo(sx + sr * 1.8, sy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, sy - sr * 1.8); ctx.lineTo(sx, sy + sr * 1.8); ctx.stroke();
    }

    // at anı kırılma flaşı: kristal kenarından saçılan 4 küçük kıvılcım
    if (d >= 0 && d < 0.3) {
      const prog = d / 0.3;
      for (let i = 0; i < 4; i++) {
        const h = k.hash(i * 53.1);
        const ang = h * k.TAU;
        const dist = prog * (60 + h * 40);
        ctx.fillStyle = k.rgba(acc, (1 - prog) * 0.8);
        ctx.beginPath(); ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, 4 * (1 - prog) + 1, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
