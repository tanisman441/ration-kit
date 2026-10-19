// character-actions/jump — zıplama anındaki insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'jump',
  category: 'character-actions',
  desc: 'Zıplama anındaki insan figürü; çömelme, yükselme, diz çekme ve iniş tozu',
  tags: ['zıplama', 'zıplamak', 'hoplama', 'sıçrama', 'havaya zıplama', 'jump', 'jumping', 'leap', 'hop'],
  box: [-130, -470, 130, 24],
  bleed: 45,
  anchor: 'ayaklar (0,0); tepe noktası ~150 birim yukarıda',
  points: { head: [0, -276], chest: [0, -184], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'surprised' },
    jump: { type: 'time', default: null, desc: 'zıplama anı (kalkış); null ise ayakta durur' },
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
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    const d = p.jump == null ? -1 : t - p.jump;
    const br = Math.sin(t * k.TAU / 2.4) * 2;               // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;               // göz kırpma

    // fazlar: çömelme (d<0) → yükselme (0–0.32) → tepe (0.32–0.62) → düşüş (0.62–0.95) → iniş
    const crouch = d < 0 ? sstep(-0.3, 0, d) * 0.9 : (d > 0.95 ? 0.5 * Math.exp(-(d - 0.95) * 8) : 0);
    const air = d >= 0 && d < 0.95 ? d / 0.95 : 0;
    const airborne = d >= 0 && d < 0.95;
    const yOff = airborne ? -150 * 4 * air * (1 - air) : 0;  // parabolik yörünge
    const squash = crouch * 26;                             // çömelmede alçalma

    // zemin gölgesi (yükseldikçe küçülür)
    const shScale = airborne ? 1 - 0.45 * Math.sin(air * Math.PI) : 1;
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54 * shScale, 10 * shScale, 0, 0, k.TAU); ctx.fill();

    const hipY = -130 - squash + yOff, shoY = -206 - squash + yOff - br * 0.5;

    // bacak pozu (doğrudan diz/ayak konumları — her fazda okunaklı siluet)
    let kx = 0, ky = 0, fx = 0, fy = 0;
    const legPose = (kneeX, kneeY, footX, footY) => { kx = kneeX; ky = kneeY; fx = footX; fy = footY; };
    if (airborne) {
      if (air < 0.34) legPose(19, 58, 21, 116);        // yükselme: gergin bacaklar
      else if (air < 0.66) legPose(49, -6, 25, 52);    // tepe: dizler karna çekili
      else legPose(29, 52, 35, 108);                  // düşüş: inişe hazırlık
    } else {
      const bendK = crouch * 22, bendF = crouch * 30;  // çömelmede dizler bükülür
      legPose(19 + bendK * 0.6, 58 - bendK * 0.4, 21 + bendF * 0.3, 116 - bendF);
    }
    for (const s of [-1, 1]) {
      const hx = s * 13, hy = hipY;
      limb(hx, hy, hx + kx * 0.9, hy + ky, 20, body);
      limb(hx + kx * 0.9, hy + ky, hx + fx * 0.9, hy + fy - 4, 17, body);
      blob(hx + fx * 0.9 - 12, hy + fy - 13, 24, 13, 6, body);
    }

    // kalkış tozu (d≈0.05)
    if (d > 0 && d < 0.5) {
      const g = d / 0.5;
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 3 + 5), h2 = k.hash(i * 7 + 11);
        const px = (h1 - 0.5) * 130 * g, py = -10 - g * (16 + h2 * 26);
        ctx.fillStyle = k.rgba('dim', 0.45 * (1 - g));
        ctx.beginPath(); ctx.ellipse(px, py, 5 + g * 8, 4 + g * 6, 0, 0, k.TAU); ctx.fill();
      }
    }

    // gövde
    blob(-31, -240 - squash + yOff - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17, -152 - squash + yOff, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kol pozu
    let armUp = 0;                                          // 0: yanda, 1: yukarıda
    if (d < 0) armUp = -0.35 * crouch;                      // çömelmede kollar geride
    else if (airborne) armUp = air < 0.6 ? sstep(0, 0.25, air) : 1 - sstep(0.6, 0.95, air) * 0.7;
    else if (d >= 0.95) armUp = 0.3 * Math.exp(-(d - 0.95) * 6);
    for (const s of [-1, 1]) {
      const hx2 = s * (37 + 6 * armUp), hy2 = shoY + 72 * (1 - armUp) - 92 * armUp;
      const ax = s * 29, ay = shoY;
      const ex = ax + (hx2 - ax) * 0.55, ey = ay + (hy2 - ay) * 0.55 + 10 * (1 - Math.abs(armUp));
      limb(ax, ay, ex, ey, 18, body);
      limb(ex, ey, hx2, hy2, 15, body);
      disc(hx2, hy2, 10, 10, body);
    }

    // baş
    const hy = -250 - squash + yOff - br * 0.6;
    disc(0, hy, 36, 34, body);

    // yüz
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(0, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-15, -214 - squash + yOff, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
