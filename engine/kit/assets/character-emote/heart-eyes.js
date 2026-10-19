// character-emote/heart-eyes — kalp gözlü, hayran figür. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'heart-eyes',
  category: 'character-emote',
  desc: 'Hayranlıkla bakan figür; gözler kalp olur, ışıltılar ve süzülen kalp yükselir',
  tags: ['aşk', 'hayranlık', 'beğenme', 'kalp', 'kalp gözler', 'love', 'crush', 'heart eyes', 'adore', 'smitten'],
  box: [-115, -390, 115, 14],
  bleed: 40,
  anchor: 'ayaklar (0,0); süzülen kalp ~370 birim yukarıda',
  points: { head: [0, -276], chest: [0, -184], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    at: { type: 'time', default: null, desc: 'kalp göz anı; kalpler belirir, ışıltılar ve süzülen kalp' },
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
    const heart = (x, y, s, c) => {
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(x, y + s * 0.85);
        ctx.bezierCurveTo(x - s * 1.45, y - s * 0.05, x - s * 0.68, y - s * 1.05, x, y - s * 0.32);
        ctx.bezierCurveTo(x + s * 0.68, y - s * 1.05, x + s * 1.45, y - s * 0.05, x, y + s * 0.85);
        ctx.fill();
      };
      ctx.save(); ctx.translate(x, y); ctx.scale(1.16, 1.16); ctx.translate(-x, -y);
      ctx.fillStyle = line; path(); ctx.restore();
      ctx.fillStyle = c; path();
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

    const d = p.at == null ? -1 : t - p.at;
    // kalpler: 0.25 sn'de overshoot ile belirir, kalıcı olur (ifade)
    const pop = d >= 0 ? sstep(0, 0.28, d) : 0;
    const over = d >= 0 && d < 0.5 ? 1 + 0.22 * Math.sin((d / 0.28) * Math.PI) * (1 - d / 0.5) : 1;
    const heartS = pop * over;

    // idle: hayalperest salınım
    const sway = Math.sin(t * k.TAU / 3.0) * 8;
    const tilt = Math.sin(t * k.TAU / 3.0 + 1.1) * 0.07;
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;

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

    // kollar: eller göğüste (hayranlık)
    for (const s of [-1, 1]) {
      limb(sway + s * 29, shoY, sway + s * 24, -196, 18, body);
      limb(sway + s * 24, -196, sway + s * 8, -188, 15, body);
      disc(sway + s * 8, -188, 10, 10, body);
    }

    // baş (hafif yana yatık)
    ctx.save();
    ctx.translate(sway, -250 - br * 0.6);
    ctx.rotate(tilt);
    ctx.translate(-sway, 250 + br * 0.6);
    disc(sway, -250 - br * 0.6, 36, 34, body);
    ctx.restore();
    const hy = -250 - br * 0.6;

    // kalp gözler + ışıltılar
    const ey = hy - 2, ex = 11;
    if (heartS > 0.01) {
      const hc = k.rgba('red');
      for (const s of [-1, 1]) heart(sway + s * ex, ey, 10 * heartS, hc);
      // göz çevresi ışıltılar (0–0.9 sn)
      if (d < 0.9) {
        const g = sstep(0.05, 0.3, d) * (1 - sstep(0.5, 0.9, d));
        for (let i = 0; i < 5; i++) {
          const h1 = k.hash(i * 17 + 4), h2 = k.hash(i * 11 + 27);
          const sx = sway + (h1 - 0.5) * 110, syy = ey - 24 - h2 * 40 * (1 + d * 0.9);
          spark(sx, syy, (4 + h2 * 4) * g, 'red', 0.9 * g);
        }
      }
    }

    // süzülen kalp (0.2–1.6 sn: yükselir, söner)
    if (d >= 0.2 && d < 1.6) {
      const g = (d - 0.2) / 1.4;
      const fy = hy - 52 - g * 56, fx = sway + 26 + Math.sin(g * 5) * 8;
      heart(fx, fy, 12 * (1 - g * 0.4), k.rgba('red', 0.95 * (1 - sstep(0.6, 1, g))));
    }

    // yüz
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    if (heartS <= 0.01) {
      for (const s of [-1, 1]) {
        if (p.mood === 'happy') {
          ctx.beginPath(); ctx.arc(sway + s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        } else {
          const r = p.mood === 'surprised' ? 5 : 4;
          ctx.beginPath(); ctx.ellipse(sway + s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
        }
      }
    }
    if (p.mood === 'happy' || heartS > 0.01) { ctx.beginPath(); ctx.arc(sway, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(sway, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(sway, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(sway - 8, hy + 12); ctx.lineTo(sway + 8, hy + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(sway - 13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(sway - 15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
