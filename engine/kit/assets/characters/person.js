// characters/person — sade, cinsiyetsiz insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'person',
  category: 'characters',
  desc: 'Sade, cinsiyetsiz insan figürü; önden görünüm, yuvarlak hatlar, 5 poz',
  tags: ['insan', 'kişi', 'karakter', 'figür', 'person', 'character', 'human', 'figure'],
  box: [-95, -292, 95, 12],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~290 birim',
  points: { head: [0, -276], chest: [0, -184] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    pose: { type: 'enum', values: ['stand', 'walk', 'point', 'think', 'cheer'], default: 'stand' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const br = Math.sin(t * k.TAU / 2.4) * 2;            // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;            // göz kırpma
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

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const pose = p.pose, ph = t * 5.2;
    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar
    const leg = (side) => {
      let fx = side * 13, fy = -16;
      if (pose === 'walk') {
        const s = Math.sin(ph + (side < 0 ? 0 : Math.PI));
        fx = side * 13 + s * 22; fy = -16 - Math.max(0, Math.cos(ph + (side < 0 ? 0 : Math.PI))) * 12;
      }
      limb(side * 13, hipY, fx, fy - 6, 20, body);
      blob(fx - 12, -13, 24, 13, 6, body);
    };
    leg(-1); leg(1);

    // gövde
    blob(-31, -240 - br * 0.4, 62, 112, 28, body);

    // kollar
    const hand = (side) => {
      if (pose === 'point' && side > 0) return [88, -200];
      if (pose === 'think' && side > 0) return [12, -234];
      if (pose === 'cheer') return [side * 54, -272];
      if (pose === 'walk') {
        const s = Math.sin(ph + (side < 0 ? Math.PI : 0));
        return [side * 38, -134 + s * 16];
      }
      return [side * 37, -134];
    };
    for (const s of [-1, 1]) {
      const [hx, hy] = hand(s);
      limb(s * 29, shoY, hx, hy, 18, body);
      disc(hx, hy, 10, 10, body);
    }

    // baş
    const hy = -250 - br * 0.6;
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
    ctx.beginPath(); ctx.ellipse(-15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
