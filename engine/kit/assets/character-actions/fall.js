// character-actions/fall — düşen insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'fall',
  category: 'character-actions',
  desc: 'Geriye düşen insan figürü; savrulan kollar, iniş sarsıntısı ve toz bulutu',
  tags: ['düşme', 'düşmek', 'yere düşme', 'tökezleme', 'yuvarlanma', 'fall', 'falling', 'trip', 'stumble'],
  box: [-320, -310, 140, 24],
  bleed: 45,
  anchor: 'ayaklar (0,0); düşüş geriye, -x yönüne',
  points: { head: [-244, -58], feet: [0, 0], hand: [-150, -30] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'surprised' },
    fall: { type: 'time', default: null, desc: 'düşme anı (dengenin bozulduğu an); null ise ayakta durur' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    const d = p.fall == null ? -1 : t - p.fall;
    const br = Math.sin(t * k.TAU / 2.4) * 2;               // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;               // göz kırpma

    // düşüş açısı: 0.75 sn'de ~77° geriye, inişte hafif sekme
    let rot = 0;
    if (d >= 0 && d < 0.75) rot = -1.35 * sstep(0, 0.75, d);
    else if (d >= 0.75) rot = -1.35 + 0.07 * Math.sin((d - 0.75) * 28) * Math.exp(-(d - 0.75) * 6);
    const falling = d >= 0 && d < 0.75;
    const landed = d >= 0.75;
    const flail = falling ? Math.sin(d * 20) * 0.9 * (1 - d / 0.75) : 0; // savrulma

    // zemin gölgesi (düşerken uzar)
    ctx.fillStyle = k.rgba('bg', 0.35);
    const shW = 54 + (falling || landed ? 150 * Math.abs(rot) / 1.35 : 0);
    ctx.beginPath(); ctx.ellipse(-shW / 2 + 20, -6, shW, 10, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.rotate(rot);
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

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar (düşerken hafif tekmeleme)
    const kick = falling ? Math.sin(d * 24) * 8 * (1 - d / 0.75) : 0;
    for (const s of [-1, 1]) {
      const fx = s * 13 + kick * s, fy = -16;
      limb(s * 13, hipY, fx, fy - 6, 20, body);
      blob(fx - 12, -13, 24, 13, 6, body);
    }

    // gövde
    blob(-31, -240 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17, -152, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kollar (düşerken savrulur, sonra yana düşer)
    for (const s of [-1, 1]) {
      const hx2 = s * 37 + flail * 40 * s, hy2 = -134 + Math.abs(flail) * 60 - (landed ? 30 : 0);
      limb(s * 29, shoY, hx2, hy2, 18, body);
      disc(hx2, hy2, 10, 10, body);
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

    ctx.restore();

    // iniş tozu (d≈0.75) — gövdenin üstüne çizilir
    if (d > 0.7 && d < 1.4) {
      const g = (d - 0.7) / 0.7;
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 3 + 5), h2 = k.hash(i * 7 + 11);
        const px = -40 - h1 * 220 * g, py = -14 - g * (14 + h2 * 34);
        ctx.fillStyle = k.rgba('dim', 0.6 * (1 - g));
        ctx.beginPath(); ctx.ellipse(px, py, 7 + g * 11, 6 + g * 8, 0, 0, k.TAU); ctx.fill();
      }
    }
  },
};
