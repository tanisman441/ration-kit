// kitchen-fx/whisk-spin — tel çırpıcı; teller dönüşü simüle eder, spin anında hızlı döndürme + damla savurma.
// NOT: canvas y-aşağıdır; çırpıcı dikey durur, tel halkaları yandan görünümde yatay genişleyip daralarak döner.
export default {
  name: 'whisk-spin', category: 'kitchen-fx',
  desc: 'Tel çırpıcı: halkalar dönüşü simüle eder; spin anında hızlı döndürme, bulanıklık ve damla savurma',
  tags: ['çırpıcı', 'tel çırpıcı', 'çırpma', 'döndürme', 'mutfak', 'whisk', 'spin', 'beating', 'mixing', 'kitchen'],
  box: [-110, -140, 110, 140],
  bleed: 40,
  anchor: 'sapın ortası (0,-60)',
  points: { handle_top: [0, -128], wires: [40, 40], tip: [0, 112] },
  params: {
    spin: { type: 'time', default: null, desc: 'hızlı döndürme olayı (0.8 sn): tel bulanıklığı + damla savurma' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.spin == null ? -1 : t - p.spin;
    const bursting = d >= 0 && d <= 0.8;

    // dönüş fazı: idle'da yavaş (2 sn tur), burst'te hızlı
    const boost = bursting ? (k.prog(d, 0, 0.8) * k.TAU * 4) : 0;
    const ph = t * (k.TAU / 2.0) + boost;

    // --- 1) sap + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-8, -124, 30, 84, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-14, -130, 30, 84, 12); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // sap tepesi (topuz)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.arc(7, -124, 12, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.arc(1, -130, 12, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    // sap parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-5, -100, 6, 26, 0.15, 0, k.TAU); ctx.fill();
    // bilezik (tellerin sapa bağlandığı yer)
    ctx.fillStyle = k.rgba('ink', 1);
    k.rrect(-20, -52, 42, 22, 9); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();

    // --- 2) tel halkaları (3 halka; yatay genişlik cos ile değişir = dönüş)
    const wire = (phase, alpha) => {
      for (let i = 0; i < 3; i++) {
        const a = phase + i * (Math.PI / 3);
        const rx = 14 + 52 * Math.abs(Math.cos(a));
        ctx.strokeStyle = k.rgba('ink', alpha);
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(0, 42, rx, 72, 0, 0, k.TAU);
        ctx.stroke();
      }
      // uç noktası
      ctx.fillStyle = k.rgba('ink', alpha);
      ctx.beginPath(); ctx.arc(0, 112, 7, 0, k.TAU); ctx.fill();
    };
    if (bursting) {
      const g = k.prog(d, 0, 0.8);
      // bulanıklık: 3 hayalet faz
      wire(ph, 0.9);
      wire(ph - 0.35, 0.35 * (1 - g * 0.5));
      wire(ph + 0.35, 0.35 * (1 - g * 0.5));
      // dönüş hız çizgileri
      for (let i = 0; i < 3; i++) {
        const yy = 0 + i * 40;
        ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - g));
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(0, yy + 22, 78 + i * 6, 10, 0, 0, k.TAU); ctx.stroke();
      }
      // savrulan damlalar
      for (let i = 0; i < 8; i++) {
        const ang = k.hash(i * 5 + 1) * k.TAU;
        const dist = (70 + k.hash(i * 5 + 3) * 55) * k.E.outCubic(g);
        const px = Math.cos(ang) * dist, py = 42 + Math.sin(ang) * dist * 0.9;
        ctx.fillStyle = k.rgba('yellow', 0.85 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 3 + k.hash(i * 5 + 7) * 3, 0, k.TAU); ctx.fill();
      }
    } else {
      wire(ph, 0.95);
    }

    // --- 3) idle: teller hafifçe salınır (nefes)
    if (!bursting) {
      const sway = Math.sin(t * 1.7) * 3;
      ctx.strokeStyle = k.rgba('ink', 0.25);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(sway, 42, 84, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }
    ctx.restore();
  },
};
