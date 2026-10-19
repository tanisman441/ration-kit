// character-emote/jump-joy — sevinçle zıplayan insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'jump-joy',
  category: 'character-emote',
  desc: 'Sevinçle zıplayan insan figürü; çömelme, yükselme, tepe pozu ve iniş tozu',
  tags: ['sevinç', 'zıplama', 'mutluluk', 'coşku', 'hoplama', 'sıçrama', 'jump', 'joy', 'happy', 'celebration', 'bounce'],
  box: [-140, -480, 140, 26],
  bleed: 40,
  anchor: 'ayaklar (0,0); zıplama tepesi ~430 birim yukarıda',
  points: { head: [0, -276], chest: [0, -184], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    jump: { type: 'time', default: null, desc: 'sevinç zıplaması anı (kalkış); null ise mutlu mini zıplama' },
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
    const spark = (x, y, s, c, a) => {
      ctx.fillStyle = k.rgba(c, a);
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.quadraticCurveTo(x + s * 0.22, y - s * 0.22, x + s, y);
      ctx.quadraticCurveTo(x + s * 0.22, y + s * 0.22, x, y + s);
      ctx.quadraticCurveTo(x - s * 0.22, y + s * 0.22, x - s, y);
      ctx.quadraticCurveTo(x - s * 0.22, y - s * 0.22, x, y - s);
      ctx.fill();
    };
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    const d = p.jump == null ? -1 : t - p.jump;
    const airborne = d >= 0 && d < 0.95;
    const air = airborne ? d / 0.95 : 0;

    // idle: mutlu mini zıplama
    const hopPhase = Math.sin(t * k.TAU / 1.4);
    const idleHop = d < 0 ? -Math.abs(hopPhase) * 9 : 0;
    const idleStretch = d < 0 ? hopPhase * 4 : 0;

    // olay: çömelme → parabolik zıplama → iniş
    const crouch = d < 0 ? sstep(-0.2, 0, d) * 0.9 : (d >= 0.95 && d < 1.5 ? 0.45 * Math.exp(-(d - 0.95) * 7) : 0);
    const yOff = airborne ? -150 * 4 * air * (1 - air) : 0;
    const squash = crouch * 24;
    const dy = idleHop + yOff - squash;

    // zemin gölgesi (yükseldikçe küçülür)
    const shScale = airborne ? 1 - 0.5 * Math.sin(air * Math.PI) : 1;
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54 * shScale, 10 * shScale, 0, 0, k.TAU); ctx.fill();

    const hipY = -130 + dy, shoY = -206 + dy - Math.abs(hopPhase) * 2;
    const br = Math.sin(t * k.TAU / 2.4) * 2;

    // bacaklar
    let kx = 0, ky = 0, fx = 0, fy = 0;
    const legPose = (kneeX, kneeY, footX, footY) => { kx = kneeX; ky = kneeY; fx = footX; fy = footY; };
    if (airborne) {
      if (air < 0.34) legPose(19, 58, 21, 116);
      else if (air < 0.66) legPose(49, -6, 25, 52);
      else legPose(29, 52, 35, 108);
    } else {
      const bend = crouch * 24;
      legPose(19 + bend * 0.5, 58 - bend * 0.3, 21 + bend * 0.25, 116 - bend);
    }
    for (const s of [-1, 1]) {
      const hx = s * 13;
      limb(hx, hipY, hx + kx * 0.9, hipY + ky, 20, body);
      limb(hx + kx * 0.9, hipY + ky, hx + fx * 0.9, hipY + fy - 4, 17, body);
      blob(hx + fx * 0.9 - 12, hipY + fy - 13, 24, 13, 6, body);
    }

    // kalkış tozu
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
    blob(-31, -240 + dy - br * 0.4 + idleStretch * 0.4, 62, 112 - idleStretch * 0.8, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17, -152 + dy, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kollar: havada yukarı, inişte toparlanır
    let armUp = 0.25 + Math.abs(hopPhase) * 0.2;
    if (airborne) armUp = air < 0.6 ? sstep(0, 0.25, air) : 1 - sstep(0.6, 0.95, air) * 0.6;
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
    const hy = -250 + dy - br * 0.6;
    disc(0, hy, 36, 34, body);

    // sevinç ışıltıları (havada)
    if (airborne && air > 0.05 && air < 0.9) {
      const g = sstep(0.05, 0.25, air) * (1 - sstep(0.6, 0.9, air));
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 13 + 2), h2 = k.hash(i * 7 + 31);
        const ang = h1 * k.TAU, rr = 62 + h2 * 30;
        spark(Math.cos(ang) * rr, hy + Math.sin(ang) * rr * 0.9, (4 + h2 * 4) * g, 'yellow', 0.9 * g);
      }
    }

    // yüz
    const ey = hy - 2, ex = 10;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
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
    ctx.beginPath(); ctx.ellipse(-15, -214 + dy, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
