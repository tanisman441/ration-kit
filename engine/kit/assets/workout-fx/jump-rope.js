// workout-fx/jump-rope — ip atlayan insan figürü, önden görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'jump-rope',
  category: 'workout-fx',
  desc: 'İp atlayan insan figürü (önden); tekrar başına ip bir tam tur döner, figür zıplar',
  tags: ['ip atlama', 'atlama ipi', 'ip', 'jump rope', 'skipping', 'kardiyo', 'cardio', 'egzersiz', 'workout'],
  box: [-150, -330, 150, 14],
  bleed: 30,
  anchor: 'ayaklar (0,0); boy ~290 birim, ip yarıçapı ~132',
  points: { head: [0, -250], chest: [0, -184], feet: [0, 0], rope: [0, -150] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    rep: { type: 'time', default: null, desc: 'ip turunun başlangıcı — bir tam tur (1.0 sn); null ise ip sarkık bekler' },
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

    const d = p.rep == null ? -1 : t - p.rep;
    const active = d >= 0 && d <= 1.0;
    const phi = active ? (d / 1.0) * k.TAU : 0;            // ip açısı (0 = ayak altında)
    const hop = active ? Math.max(0, Math.cos(phi)) : 0;   // ip ayak altındayken zıpla
    const rise = 26 * hop;

    // zemin gölgesi (zıpladıkça küçülür)
    const shS = 1 - 0.35 * hop;
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54 * shS, 10 * shS, 0, 0, k.TAU); ctx.fill();

    const hipY = -130 - rise, shoY = -206 - rise - br * 0.5;
    // bacaklar (zıplamada dizler hafif bükülü)
    for (const s of [-1, 1]) {
      const fy = -16 - 4 * hop;
      limb(s * 13, hipY, s * (14 + 6 * hop), -70 - rise * 0.5 + 14 * hop, 20, body);
      limb(s * (14 + 6 * hop), -70 - rise * 0.5 + 14 * hop, s * 14, fy, 17, body);
      blob(s * 14 - 12, fy + 3, 24, 13, 6, body);
    }

    // gövde
    blob(-31, -240 - rise - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17, -196 - rise, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-15, -214 - rise, 9, 24, 0.12, 0, k.TAU); ctx.fill();

    // kollar: eller yanda, ip saplarını tutar
    const handY = -158 - rise;
    for (const s of [-1, 1]) {
      limb(s * 29, shoY, s * 44, handY, 18, body);
      disc(s * 44, handY, 10, 10, body);
      blob(s * 44 - 6, handY - 4, 12, 34, 6, k.rgba('panel2'));   // ip sapı
    }

    // ip: saplardan geçen, tur atan yay (serbest çizgi → ink)
    const cx = 0, cy = -150, R = 132;
    const ropeAt = (ph) => [cx + R * Math.sin(ph), cy + R * Math.cos(ph)];
    const drawRope = (ph, alpha, w) => {
      const [mx, my] = ropeAt(ph);
      ctx.strokeStyle = k.rgba('ink', alpha); ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(-44, handY + 12);
      ctx.quadraticCurveTo(mx * 1.12, my * 1.02, 44, handY + 12);
      ctx.stroke();
    };
    if (active) {
      drawRope(phi - 0.55, 0.22, 5);                       // hareket izi
      drawRope(phi, 0.72, 5);                              // ip
    } else {
      // boşta: ip sarkık U yapar
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-44, handY + 12);
      ctx.quadraticCurveTo(0, -40, 44, handY + 12);
      ctx.stroke();
    }

    // baş
    const hy = -250 - rise - br * 0.6;
    disc(0, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(0, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
  },
};
