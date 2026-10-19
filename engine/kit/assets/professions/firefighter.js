// professions/firefighter — baretli itfaiyeci; hortum tutar, spray anında su fışkırtır.
// Orijinal tasarım; gerçek itfaiye üniforması kopyası değildir.
// NOT: canvas y-aşağıdır; ayaklar (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'firefighter',
  category: 'professions',
  desc: 'Baretli itfaiyeci (reflektör şeritli mont); spray anında hortumdan 0.8 sn su fışkırır',
  tags: ['itfaiyeci', 'itfaiye', 'yangın', 'hortum', 'baret', 'firefighter', 'fireman', 'hose', 'water'],
  box: [-115, -330, 320, 12],
  bleed: 70,
  anchor: 'ayaklar (0,0); baret üstü ~-300',
  points: { head: [0, -276], chest: [0, -184], left_hand: [-30, -150], right_hand: [40, -170], nozzle: [56, -192] },
  params: {
    color: { type: 'color', default: 'red', desc: 'mont rengi' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    spray: { type: 'time', default: null, desc: 'su fışkırtma anı: hortumdan su çıkar (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const body = k.rgba(p.color);
    const dark = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, name, fill) => {
      ctx.fillStyle = dark(name); ctx.beginPath(); k.rrect(x + 5, y + 7, w, h, r); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = fill || k.rgba(name); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, name, fill) => {
      ctx.fillStyle = dark(name); ctx.beginPath(); ctx.ellipse(x + 5, y + 7, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = fill || k.rgba(name); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const shine = (x, y, rx, ry, rot = -0.4) => {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, k.TAU); ctx.fill();
    };
    const face = (hx, hy) => {
      const blink = ((t + 1.3) % 4.2) < 0.12 ? 0.2 : 1;
      ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
      for (const s of [-1, 1]) {
        if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(s * 10, hy + 2, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
        else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(s * 10, hy - 2, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
      }
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
      else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(0, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }
    };

    const br = Math.sin(t * k.TAU / 2.4) * 2;                 // nefes
    const shoY = -206 - br * 0.5, hipY = -130;
    const hy = -250 - br * 0.6;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 58, 10, 0, 0, k.TAU); ctx.fill();

    // bacaklar + bot
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -22, 20, body);
      blob(s * 13 - 13, -13, 28, 13, 6, p.color, dark(p.color, 0.55));
    }
    // mont + reflektör şeritler (vurgu: yellow)
    blob(-31, -240 - br * 0.4, 62, 112, 28, p.color);
    blob(-31, -212 - br * 0.4, 62, 11, 5, 'yellow');
    blob(-31, -186 - br * 0.4, 62, 11, 5, 'yellow');

    // hortum: sol elden sağ ele, nozul yukarı-sağa bakar
    const LH = [-30, -150], RH = [40, -170], NZ = [56, -192];
    ctx.strokeStyle = line; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(LH[0], LH[1]); ctx.quadraticCurveTo(20, -96, RH[0], RH[1]); ctx.stroke();
    ctx.strokeStyle = dark(p.color, 0.7); ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(LH[0], LH[1]); ctx.quadraticCurveTo(20, -96, RH[0], RH[1]); ctx.stroke();
    // nozul
    limb(RH[0], RH[1], NZ[0], NZ[1], 13, dark(p.color, 0.65));
    disc(NZ[0], NZ[1], 8, 8, p.color, dark(p.color, 0.55));

    // kollar (hortum tutar) + eller
    limb(-29, shoY, LH[0], LH[1], 18, body);
    disc(LH[0], LH[1], 10, 10, p.color);
    limb(29, shoY, RH[0], RH[1], 18, body);
    disc(RH[0], RH[1], 10, 10, p.color);

    // baş
    disc(0, hy, 36, 34, p.color);
    face(hy);
    // baret: kubbe + siperlik + ön rozet
    disc(0, hy - 20, 42, 30, 'yellow');
    blob(-48, hy - 26, 96, 12, 6, 'yellow', dark('yellow', 0.8));
    disc(0, hy - 26, 8, 8, p.color);
    shine(-15, hy - 32, 13, 7);

    // ANIMASYON — spray: nozuldan su fışkırır (0.8 sn)
    const d = p.spray == null ? -1 : t - p.spray;
    if (d >= 0 && d < 0.8) {
      const g = d / 0.8;
      k.glow(NZ[0], NZ[1], 26 * (1 - g) + 12, 'cyan', 0.45 * (1 - g));
      for (let i = 0; i < 14; i++) {
        const h1 = k.hash(i * 3 + 51), h2 = k.hash(i * 5 + 52), h3 = k.hash(i * 7 + 53);
        const ang = -0.55 + h1 * 0.55;                       // yukarı-sağa
        const sp = 180 + h2 * 120;
        const dd = Math.min(d / 0.7, 1) * (0.55 + 0.45 * h3);
        const x = NZ[0] + Math.cos(ang) * sp * dd;
        const y = NZ[1] - Math.sin(ang) * sp * dd + 260 * dd * dd;
        ctx.fillStyle = i % 3 === 0 ? k.rgba('panel', 1 - g) : k.rgba('cyan', 0.9 * (1 - g));
        ctx.beginPath(); ctx.arc(x, y, 3 + h3 * 5, 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama
    shine(-13, hy - 12, 13, 9);
    shine(-15, -214, 9, 24, 0.12);
  },
};
