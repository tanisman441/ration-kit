// gym-fx/rope-skip — yandan görünen ip atlayan figür; ip profilde döner, figür zıplar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar. Figür sağa bakar.
// workout-fx/jump-rope önden görünümken bu yandan görünümdür; ip, el ekseninde dönen bir yay olarak çizilir.
export default {
  name: 'rope-skip',
  category: 'gym-fx',
  desc: 'Yandan görünen ip atlayan insan figürü; ip tur başına bir kez baş üstünden ayak altına döner',
  tags: ['ip atlama', 'atlama ipi', 'ip', 'rope skipping', 'skipping rope', 'kardiyo', 'cardio', 'spor salonu', 'gym'],
  box: [-150, -340, 150, 14],
  bleed: 40,
  anchor: 'ayaklar (0,0); boy ~290 birim, ip yarıçapı ~130',
  points: { head: [10, -250], hand: [30, -160], feet: [0, 0], rope: [0, -150] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    skip: { type: 'time', default: null, desc: 'atlama döngüsünün başlangıcı — 0.9 snlik turlar durmadan tekrarlanır; null ise ip önde sarkık bekler' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma

    const d = p.skip == null ? -1 : t - p.skip;
    const active = d >= 0;
    const ph = active ? (d % 0.9) / 0.9 : 0;
    const phi = ph * k.TAU;                                // ip açısı
    const hop = active ? Math.max(0, Math.sin(ph * Math.PI)) : 0;   // ip ayak altındayken zıpla
    const rise = 30 * hop;

    // zemin gölgesi (zıpladıkça küçülür)
    const shS = 1 - 0.35 * hop;
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54 * shS, 10 * shS, 0, 0, k.TAU); ctx.fill();

    const hipX = 0, hipY = -130 - rise, shoX = 8, shoY = -206 - rise - br * 0.5;
    // bacaklar (yandan, zıplamada dizler bükülü, ayaklar geriye çekili)
    limb(hipX, hipY, 16 + 8 * hop, -70 - rise * 0.5, 20, body);
    limb(16 + 8 * hop, -70 - rise * 0.5, 10 + 14 * hop, -16 - rise + 8 * hop, 17, body);
    limb(hipX - 10, hipY, 6 + 8 * hop, -70 - rise * 0.5, 18, k.rgba('panel2'));
    limb(6 + 8 * hop, -70 - rise * 0.5, 0 + 14 * hop, -16 - rise + 8 * hop, 15, k.rgba('panel2'));
    blob(10 + 14 * hop - 12, -13 - rise + 8 * hop, 26, 13, 6, body);
    blob(0 + 14 * hop - 12, -13 - rise + 8 * hop, 26, 13, 6, k.rgba('panel2'));

    // gövde (hafif öne eğik)
    ctx.save();
    ctx.translate(hipX, hipY); ctx.rotate(0.08);
    blob(-31, -112 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17, -40, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-15, -84, 9, 24, 0.12, 0, k.TAU); ctx.fill();
    ctx.restore();

    // kol: el kalça hizasında, ip sapını tutar
    const handX = 30, handY = -158 - rise;
    limb(shoX, shoY, handX, handY, 18, body);
    disc(handX, handY, 10, 10, body);
    blob(handX - 6, handY - 4, 12, 30, 6, k.rgba('panel2'));   // ip sapı

    // ip: el ekseninde dönen halka (serbest çizgi → ink). Tek uçlu quadratic
    // aynı doğruyu gidip döner, halka olmaz; cubic ile iki ayrı koldan dönen halka çizilir.
    const cx = 0, cy = -150 - rise * 0.4, R = 132;
    const ropeAt = (a) => [cx + R * Math.sin(a), cy - R * Math.cos(a) * 0.98];
    const drawRope = (a, alpha, w) => {
      const [mx, my] = ropeAt(a);
      const dx = mx - handX, dy = my - (handY + 12);
      const len = Math.hypot(dx, dy) || 1;
      const px = -dy / len, py = dx / len, bulge = 38;
      const mxp = (handX + mx) / 2, myp = (handY + 12 + my) / 2;
      ctx.strokeStyle = k.rgba('ink', alpha); ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(handX, handY + 12);
      ctx.quadraticCurveTo(mxp + px * bulge, myp + py * bulge, mx, my);
      ctx.quadraticCurveTo(mxp - px * bulge, myp - py * bulge, handX, handY + 12);
      ctx.stroke();
    };
    if (active) {
      drawRope(phi - 0.5, 0.22, 5);                        // hareket izi
      drawRope(phi, 0.72, 5);                              // ip
    } else {
      // boşta: ip elden sarkan gevşek halka yapar
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(handX, handY + 12);
      ctx.bezierCurveTo(handX + 62, handY + 40, handX + 62, handY + 120, handX + 4, handY + 12);
      ctx.stroke();
    }

    // baş
    const hy = -250 - rise - br * 0.6;
    disc(10, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(s * ex + 14, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(s * ex + 14, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(14, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(14, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(14, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(6, hy + 12); ctx.lineTo(22, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-3, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
  },
};
