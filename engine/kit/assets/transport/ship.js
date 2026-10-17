// transport/ship — yandan görünüm gemi (pruva sağa); sailing ile dalga salınımı ve baca dumanı.
// NOT: canvas y-aşağıdır; (0,0) su hattı merkezidir.
export default {
  name: 'ship',
  category: 'transport',
  desc: 'Yandan görünüm gemi; bacadan duman çıkar, sailing arttıkça dalgalarda salınır',
  tags: ['gemi', 'ship', 'boat', 'tekne', 'deniz', 'sea', 'yolculuk', 'voyage', 'liman'],
  box: [-155, -130, 155, 35],
  bleed: 45,
  anchor: 'su hattı merkezi (0,0); gövde yukarı uzar',
  points: { bow: [130, -40], stern: [-130, -40], deck: [0, -95] },
  params: {
    color: { type: 'color', default: 'dim' },
    sailing: { type: 'number', default: 0.5, desc: 'dalga salınım şiddeti (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.7))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const sail = k.clamp(p.sailing, 0, 1);
    const bobY = Math.sin(t * 1.3) * 4 * sail + k.noise1(t * 0.9) * 2 * sail;
    const roll = Math.sin(t * 0.9 + 1) * 0.02 * sail;

    ctx.save();
    ctx.translate(0, bobY);
    ctx.rotate(roll);

    // gövde (yamuk, pruva sağda sivri)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-138, -52); ctx.lineTo(118, -52); ctx.lineTo(142, -30);
    ctx.lineTo(108, -4); ctx.lineTo(-108, -4); ctx.lineTo(-138, -30);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-134, -50); ctx.lineTo(116, -50); ctx.lineTo(138, -30);
    ctx.lineTo(106, -7); ctx.lineTo(-106, -7); ctx.lineTo(-134, -31);
    ctx.closePath(); ctx.fill();
    // su hattı şeridi (kırmızı vurgu)
    ctx.strokeStyle = k.rgba('red', 0.8); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-132, -38); ctx.lineTo(120, -38); ctx.stroke();
    // lombozlar
    ctx.fillStyle = k.rgba('bg', 0.85);
    for (let x = -100; x < 90; x += 32) {
      ctx.beginPath(); ctx.arc(x, -22, 6, 0, k.TAU); ctx.fill();
    }

    // güverte kabini
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-52, -98, 104, 50, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-50, -96, 100, 46, 7); ctx.fill();
    // kabin pencereleri
    ctx.fillStyle = k.rgba('bg', 0.85);
    for (let x = -38; x <= 38; x += 25) {
      ctx.beginPath(); k.rrect(x - 8, -88, 16, 14, 4); ctx.fill();
    }
    // köprü üstü
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-30, -118, 60, 24, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-28, -116, 56, 20, 5); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(-22, -112, 44, 10, 4); ctx.fill();

    // baca
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-102, -108, 26, 60, 6); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); k.rrect(-100, -106, 22, 56, 5); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath(); k.rrect(-100, -106, 22, 12, 5); ctx.fill();

    // baca dumanı (yumuşak puflar, yukarı)
    for (let i = 0; i < 4; i++) {
      const ph = (t * 0.5 + i / 4) % 1;
      const dx = -89 + k.noise1(i * 13 + t * 0.7) * 18 + ph * 30;
      const dy = -112 - ph * 70;
      const r = 10 + ph * 16;
      ctx.fillStyle = k.rgba('dim', 0.35 * (1 - ph));
      ctx.beginPath(); ctx.arc(dx, dy, r, 0, k.TAU); ctx.fill();
    }

    // premium parlama (gövde sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-90, -44, 40, 6, -0.1, 0, k.TAU); ctx.fill();

    ctx.restore();

    // dalgalar (su hattı)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const [wy, phase] of [[14, 0], [24, 3]]) {
      ctx.beginPath();
      for (let x = -150; x <= 150; x += 10) {
        const y = wy + Math.sin(x * 0.06 + t * 2 + phase) * 3 * (0.5 + sail * 0.5);
        if (x === -150) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // pruva köpüğü (sailing yüksekken)
    if (sail > 0.5) {
      ctx.fillStyle = k.rgba('ink', 0.25 * sail);
      for (let i = 0; i < 5; i++) {
        const fx = 132 + k.hash(i * 7) * 22;
        const fy = 8 + k.noise1(t * 2 + i * 11) * 6;
        ctx.beginPath(); ctx.arc(fx, fy, 4 + k.hash(i * 3) * 4, 0, k.TAU); ctx.fill();
      }
    }
  },
};
