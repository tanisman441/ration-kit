// workout-fx/treadmill-run — koşu bandında koşan insan figürü, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; bant üstü (0,-28), figür sola doğru koşar.
export default {
  name: 'treadmill-run',
  category: 'workout-fx',
  desc: 'Koşu bandında koşan insan figürü (yandan); tekrarla bir tam adım turu atar, bant sürekli kayar',
  tags: ['koşu bandı', 'koşu', 'koşmak', 'treadmill', 'running', 'run', 'kardiyo', 'cardio', 'egzersiz', 'workout'],
  box: [-140, -300, 140, 14],
  bleed: 30,
  anchor: 'bant üstü (~-28); figür sola bakar, konsol sağda',
  points: { head: [-24, -248], chest: [-8, -190], console: [88, -176], beltFront: [120, -22] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    rep: { type: 'time', default: null, desc: 'adım döngüsünün başlangıcı — bir tam adım turu (0.9 sn); null ise ayakta bekler' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55), pan2 = k.rgba('panel2');
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
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma
    const gy = -28;                                       // bant üstü

    // koşu bandı (statik gövde + kayan bant)
    blob(-125, -30, 250, 30, 12, pan2);
    disc(-112, -15, 11, 11, pan2); disc(112, -15, 11, 11, pan2);
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-104, -24); ctx.lineTo(104, -24); ctx.stroke();
    for (let i = 0; i < 5; i++) {                         // kayan bant çizgileri
      const bx = -100 + ((t * 170 + i * 44) % 220);
      ctx.fillStyle = k.rgba('ink', 0.28);
      ctx.beginPath(); k.rrect(bx - 9, -27, 18, 5, 2); ctx.fill();
    }
    limb(88, -28, 88, -152, 14, pan2);                     // konsol direği
    blob(56, -198, 64, 48, 10, pan2);                      // konsol
    ctx.fillStyle = k.rgba('cyan', 0.9);                   // ekran (vurgu)
    ctx.beginPath(); k.rrect(66, -188, 44, 26, 6); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.8);
    for (let i = 0; i < 3; i++) ctx.fillRect(72 + i * 13, -172 - (i % 2) * 6 - 4, 6, 10 + (i % 2) * 6);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 110, 10, 0, 0, k.TAU); ctx.fill();

    // adım fazı
    const d = p.rep == null ? -1 : t - p.rep;
    const active = d >= 0 && d <= 0.9;
    const phi = active ? (d / 0.9) * k.TAU : 0;
    const bounce = active ? Math.abs(Math.sin(phi)) * 8 : 0;

    const H = [0, -158 - bounce], S = [-10, -216 - bounce];
    // bacaklar: eliptik adım yörüngesi
    for (let i = 0; i < 2; i++) {
      const ph = phi + i * Math.PI;
      let fx, fy;
      if (active) { fx = 36 * Math.sin(ph); fy = gy + 2 - 34 * Math.max(0, Math.cos(ph)); }
      else { fx = i === 0 ? -14 : 16; fy = gy + 2; }
      const kx = (H[0] + fx) / 2 + 16, ky = (H[1] + fy) / 2 - 4;
      limb(H[0] + (i === 0 ? -4 : 4), H[1], kx, ky, 20, body);
      limb(kx, ky, fx, fy - 4, 17, body);
      blob(fx - 4, fy - 12, 28, 12, 6, body);
    }

    // gövde (hafif öne eğik kapsül)
    limb(S[0], S[1], H[0], H[1], 52, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, -196 - bounce, 9, 20, 0.12, 0, k.TAU); ctx.fill();

    // kollar: bacakların tersi fazda pompa
    for (let i = 0; i < 2; i++) {
      const ps = phi + i * Math.PI + Math.PI;
      let hx2, hy2;
      if (active) { hx2 = S[0] + 30 * Math.sin(ps); hy2 = S[1] + 58 - 22 * Math.cos(ps); }
      else { hx2 = S[0] + (i === 0 ? -26 : 22); hy2 = S[1] + 62; }
      const ex = (S[0] + hx2) / 2 - 10, ey = (S[1] + hy2) / 2 + 4;
      limb(S[0] + (i === 0 ? -6 : 6), S[1], ex, ey, 18, body);
      limb(ex, ey, hx2, hy2, 15, body);
      disc(hx2, hy2, 10, 10, body);
    }

    // baş
    const hy = -248 - bounce - br * 0.4;
    disc(-24, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-24 + s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(-24 + s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-24, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(-24, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(-24, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-32, hy + 12); ctx.lineTo(-16, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-37, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // hız çizgileri (koşarken)
    if (active) {
      ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const yy = -160 - i * 34 - bounce, len = 34 + k.hash(i * 3 + 1) * 26;
        ctx.beginPath(); ctx.moveTo(-118, yy); ctx.lineTo(-118 + len, yy); ctx.stroke();
      }
    }
  },
};
