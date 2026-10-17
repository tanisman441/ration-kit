// tech/gpu — yatay ekran kartı: dönen fan, soğutucu kanatçıklar, yük LED şeridi.
// load arttıkça fan hızlanır, LED parlar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'gpu', category: 'tech',
  desc: 'Yatay ekran kartı; load arttıkça fan hızlanır ve LED şeridi parlar',
  tags: ['ekran kartı', 'gpu', 'grafik kartı', 'fan', 'donanım', 'graphics card', 'hardware', 'soğutma'],
  box: [-195, -75, 195, 75],
  bleed: 10,
  anchor: 'gövde merkezi (0,0)',
  points: { fan: [-95, 0] },
  params: {
    color: { type: 'color', default: 'panel2' },
    load: { type: 'number', default: 0.5, desc: 'fan hızı ve LED parlaklığı (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    const load = k.clamp(p.load, 0, 1);

    // braket (sol uç metal parça)
    blob(-195, -48, 26, 96, 6, k.rgba('dim'));

    // kart gövdesi
    blob(-172, -55, 354, 110, 12, body);
    // üst kenar çizgisi (iç ayrım)
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-160, -38); ctx.lineTo(170, -38); ctx.stroke();
    // premium parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-120, -44, 44, 8, -0.1, 0, k.TAU); ctx.fill();

    // LED şeridi (üst kenar)
    const ledA = 0.25 + load * 0.75;
    ctx.fillStyle = k.rgba('cyan', ledA);
    ctx.beginPath(); k.rrect(-150, -52, 300 * (0.25 + load * 0.75), 6, 3); ctx.fill();
    if (load > 0.1) k.glow(0, -49, 30 + load * 40, 'cyan', 0.15 + load * 0.25);

    // fan
    const fx = -95, fy = 2, fr = 40;
    dot(fx, fy, fr + LW / 2, line);
    dot(fx, fy, fr, k.rgba('bg', 0.85));
    // kanatlar
    const ang = t * (1.5 + load * 9);
    ctx.fillStyle = k.rgba('dim', 0.95);
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.translate(fx, fy); ctx.rotate(ang + i * k.TAU / 5);
      ctx.beginPath(); ctx.ellipse(20, 0, 17, 10, 0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    dot(fx, fy, 11, line);
    dot(fx, fy, 8, k.rgba('cyan', 0.35 + load * 0.65));

    // soğutucu kanatçıklar (sağ bölüm)
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 4;
    for (let i = 0; i < 7; i++) {
      const x = 8 + i * 22;
      ctx.beginPath(); ctx.moveTo(x, -24); ctx.lineTo(x, 34); ctx.stroke();
    }
    // marka yerine geometrik logo (orijinal)
    ctx.strokeStyle = k.rgba('cyan', 0.7); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(128, -14); ctx.lineTo(146, 4); ctx.lineTo(128, 22); ctx.stroke();

    // PCIe bağlantısı (alt)
    blob(-60, 55, 130, 16, 4, k.rgba('dim', 0.9));
    ctx.fillStyle = k.rgba('bg', 0.5);
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); k.rrect(-50 + i * 15, 58, 8, 10, 2); ctx.fill();
    }
  },
};
