// character-emote/sweat-drop — ter damlası fırlatan endişeli figür. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'sweat-drop',
  category: 'character-emote',
  desc: 'Endişeli insan figürü; gerginlik anında şakağından ter damlası fırlar',
  tags: ['ter', 'terleme', 'endişe', 'gerginlik', 'stres', 'sweat', 'nervous', 'anxiety', 'stress', 'drop'],
  box: [-115, -360, 115, 14],
  bleed: 40,
  anchor: 'ayaklar (0,0); boy ~300 birim',
  points: { head: [0, -276], chest: [0, -184], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad'], default: 'neutral' },
    at: { type: 'time', default: null, desc: 'gerginlik anı; ter damlası şakaktan fırlar ve söner' },
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
    const drop = (x, y, s, a) => {
      ctx.fillStyle = k.rgba('cyan', a);
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.bezierCurveTo(x + s * 0.72, y - s * 0.08, x + s * 0.58, y + s * 0.62, x, y + s * 0.62);
      ctx.bezierCurveTo(x - s * 0.58, y + s * 0.62, x - s * 0.72, y - s * 0.08, x, y - s);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath(); ctx.ellipse(x - s * 0.18, y + s * 0.12, s * 0.14, s * 0.24, -0.3, 0, k.TAU); ctx.fill();
    };
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    const d = p.at == null ? -1 : t - p.at;

    // idle: endişeli sallantı
    const sway = Math.sin(t * k.TAU / 1.8) * 6;
    const swayTilt = Math.sin(t * k.TAU / 1.8 + 0.6) * 0.05;
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 3.1) < 0.12 ? 0.2 : 1;    // gergin, daha sık kırpar

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(sway * 0.5, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar
    for (const s of [-1, 1]) {
      limb(sway + s * 13, hipY, sway + s * 16, -68, 20, body);
      limb(sway + s * 16, -68, sway + s * 20, -16, 17, body);
      blob(sway + s * 20 - 12, -13, 24, 13, 6, body);
    }

    // gövde
    blob(sway - 31, -240 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(sway + 17, -152, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kollar: eller göğüste kavuşmuş (endişe)
    for (const s of [-1, 1]) {
      limb(sway + s * 29, shoY, sway + s * 22, -196, 18, body);
      limb(sway + s * 22, -196, sway + s * 6, -186, 15, body);
      disc(sway + s * 6, -186, 10, 10, body);
    }

    // baş (hafif yana eğik, sallantıyla)
    const hy = -250 - br * 0.6;
    disc(sway, hy, 36, 34, body);

    // ter damlası: şakaktan fırlar, yay çizip söner
    if (d >= 0 && d < 0.9) {
      const g = d / 0.9;
      const a = 1 - sstep(0.55, 0.9, d);
      const sx = sway + 26, sy = hy - 14;                 // şakak
      const dx = sx + 66 * g, dy = sy - 58 * g + 130 * g * g;  // yay
      const grow = sstep(0, 0.2, d);
      drop(dx, dy, 16 * grow, 0.95 * a);
      // küçük kardeş damla (iz)
      if (g > 0.1 && g < 0.65) {
        const g2 = g - 0.1;
        drop(sx + 72 * g2, sy - 62 * g2 + 130 * g2 * g2, 9 * sstep(0, 0.08, g2), 0.85 * (1 - g2));
      }
    }

    // yüz: gerginlik anında dalgalı ağız
    const tense = d >= 0 && d < 0.9;
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(sway + s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.ellipse(sway + s * ex, ey, 4, 4 * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (tense) {
      // dalgalı gergin ağız
      ctx.beginPath();
      for (let i = 0; i <= 16; i++) {
        const wx = sway - 10 + (i / 16) * 20;
        const wy = hy + 14 + Math.sin(i * 1.7) * 2.4;
        i ? ctx.lineTo(wx, wy) : ctx.moveTo(wx, wy);
      }
      ctx.stroke();
      // kaşlar hafif kalkık
      ctx.lineWidth = 3;
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(sway + s * (ex - 8), ey - 12); ctx.lineTo(sway + s * (ex + 8), ey - 9); ctx.stroke();
      }
    } else if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(sway, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(sway, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(sway - 8, hy + 12); ctx.lineTo(sway + 8, hy + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(sway - 13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(sway - 15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
