// nature-fx/clouds-drift — üç derinlikte bulut; döngüsel yatay kayma, kenarda yumuşakça söner.
// NOT: canvas y-aşağıdır; bulutlar aynı yükseklik bandında sürüklenir.
export default {
  name: 'clouds-drift',
  category: 'nature-fx',
  desc: 'Üç derinlikte sürüklenen bulutlar; kenardan girip kenardan çıkan döngüsel yatay kayma',
  tags: ['bulut', 'gökyüzü', 'rüzgar', 'sürüklenme', 'hava', 'cloud', 'sky', 'drift', 'wind', 'cumulus'],
  box: [-180, -110, 180, 110],
  bleed: 60,
  anchor: 'gökyüzü merkezi (0,0)',
  points: { top: [0, -95], centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    drift: { type: 'number', default: 0.5, desc: 'sürüklenme hızı 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const drift = k.clamp(p.drift, 0, 1);
    const W = 250; // kayma genişliği: -W..W bandında dolanır

    // kenar geçişi: bulut kutu dışına çıkarken yumuşakça söner
    const edgeFade = (x) => k.clamp(1 - (Math.abs(x) - 110) / 60, 0, 1);
    const drawCloud = (x, y, scale, alpha) => {
      const f = edgeFade(x);
      if (f <= 0.02) return;
      const blobs = [
        [-52, -8, 26], [-18, -20, 34], [20, -18, 32], [52, -6, 25],
        [-32, 8, 24], [8, 8, 26], [44, 8, 22],
      ];
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
      ctx.globalAlpha = f;
      for (const [bx, by, r] of blobs) {
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.arc(bx + 5, by + 6, r + LW / 2, 0, k.TAU); ctx.fill();
        ctx.fillStyle = darker(p.color);
        ctx.beginPath(); ctx.arc(bx + 5, by + 6, r, 0, k.TAU); ctx.fill();
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.arc(bx, by, r + LW / 2, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba(p.color, alpha);
        ctx.beginPath(); ctx.arc(bx, by, r, 0, k.TAU); ctx.fill();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-22, -24, 34, 15, -0.4, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    // üç bulut, derinlik = farklı hız + opaklık; kenarda dolanır (wrap)
    const wrap = (x) => ((x + W) % (W * 2)) - W;
    const bob = (s) => Math.sin(t * 1.4 + s) * 4 + k.noise1(t * 0.8 + s) * 3;

    const x1 = wrap(-80 + t * (12 + drift * 30) * 0.6);
    drawCloud(x1, -48 + bob(1), 1.0, 0.95);

    const x2 = wrap(120 + t * (12 + drift * 30) * 1.0);
    drawCloud(x2, 22 + bob(2.7), 0.72, 0.8);

    const x3 = wrap(30 + t * (12 + drift * 30) * 1.5);
    drawCloud(x3, 62 + bob(4.2), 0.5, 0.6);
  },
};
