// archaeology-fx/brush-dust — kazı fırçası toz süpürür; `at` anında fırça süpürür, toz bulutu kalkar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) toprak yığınının merkezi.
export default {
  name: 'brush-dust', category: 'archaeology-fx',
  desc: 'Eğik kazı fırçası toprak üzerindeki eseri süpürür; süpürme anında toz bulutu kalkar',
  tags: ['fırça', 'kazı', 'arkeoloji', 'toz', 'süpürme', 'brush', 'archaeology', 'dust', 'excavation', 'dig'],
  box: [-130, -110, 130, 110],
  bleed: 50,
  anchor: 'toprak yığınının merkezi (0,0); fırça sağ üstten sola süpürür',
  points: { bristles: [52, 52], handle: [-78, -72], shard: [18, 62] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'süpürme anı — fırça ileri kayar, toz bulutu kalkar (1.0 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const sweep = d >= 0 && d < 1.0;
    const env = sweep ? Math.sin(Math.min(d / 1.0, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // toprak yığını (alt)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-118, 22, 236, 84, 26); ctx.fill();
    blob(-118, 22, 236, 84, 26, k.rgba('panel2'));
    // toprak benekleri
    ctx.fillStyle = k.rgba('ink', 0.35);
    for (let i = 0; i < 8; i++) {
      const bx = -100 + k.hash(i * 3) * 200;
      const by = 40 + k.hash(i * 3 + 1) * 48;
      ctx.beginPath(); ctx.ellipse(bx, by, 5 + k.hash(i) * 5, 3 + k.hash(i + 9) * 3, 0, 0, k.TAU); ctx.fill();
    }
    // gölge (sağ alt)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-112, 88, 224, 12, 6); ctx.fill();

    // yarı gömülü eser parçası (vazo kırığı)
    ctx.save();
    ctx.translate(18, 62);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-20, -16, 44, 34, 8); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.85); ctx.beginPath(); k.rrect(-16, -12, 36, 26, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, -6, 5, 8, 0.2, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-14, 2); ctx.lineTo(14, 2); ctx.stroke();
    ctx.restore();

    // fırça: boşta hafif sallanır, süpürmede ileri kayar + eğilir
    const sway = Math.sin(t * k.TAU / 2.4) * 0.03;
    const sweepX = env * 26;
    const sweepY = env * 10;
    ctx.save();
    ctx.translate(-20 + sweepX, -18 + sweepY);
    ctx.rotate(-0.62 + sway - env * 0.18);

    // sap (ahşap)
    blob(-14, -78, 28, 78, 12, k.rgba(p.color));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-6, -58, 5, 18, 0.1, 0, k.TAU); ctx.fill();
    // metal bilezik
    blob(-16, -6, 32, 14, 6, k.rgba('panel2'));
    // kıllar (yelpaze)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-16, 8); ctx.lineTo(16, 8); ctx.lineTo(30, 46); ctx.lineTo(-30, 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.moveTo(-12, 8); ctx.lineTo(12, 8); ctx.lineTo(26, 42); ctx.lineTo(-26, 42); ctx.closePath(); ctx.fill();
    // kıl ayrım çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 2.5;
    for (const lx of [-8, 0, 8]) {
      ctx.beginPath(); ctx.moveTo(lx, 10); ctx.lineTo(lx * 1.6, 42); ctx.stroke();
    }
    ctx.restore();

    // toz bulutu (süpürme anı, 1.0 sn)
    if (sweep) {
      for (let i = 0; i < 12; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.25) / 0.6, 0, 1);
        if (prog <= 0) continue;
        const dx = 30 + k.hash(i + 20) * 70 + prog * (30 + k.hash(i + 30) * 40);
        const dy = 46 - prog * (30 + k.hash(i + 40) * 34) + prog * prog * 26;
        const r = 7 + prog * 15 + k.hash(i + 50) * 7;
        ctx.fillStyle = k.rgba('dim', 0.65 * (1 - prog * 0.6));
        ctx.beginPath(); ctx.ellipse(dx, dy, r, r * 0.7, 0, 0, k.TAU); ctx.fill();
      }
      // süpürme çizgileri
      ctx.strokeStyle = k.rgba('dim', 0.6 * (1 - d));
      ctx.lineWidth = 4;
      for (const [sx, sy] of [[-30, 66], [-10, 72], [10, 66]]) {
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 22 + env * 14, sy - 4); ctx.stroke();
      }
    }
  },
};
