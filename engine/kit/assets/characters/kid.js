// characters/kid — çocuk; person ailesinden, orantılı küçük figür (daha büyük kafa).
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'kid',
  category: 'characters',
  desc: 'Çocuk; orantılı küçük figür, 3 ruh hali',
  tags: ['çocuk', 'küçük', 'oğlan', 'kız', 'kid', 'child', 'boy', 'girl', 'little'],
  box: [-70, -208, 70, 10],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~205 birim',
  points: { head: [0, -194], chest: [0, -128] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'surprised'], default: 'happy' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
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
    ctx.beginPath(); ctx.ellipse(0, -5, 40, 8, 0, 0, k.TAU); ctx.fill();

    const hipY = -92, shoY = -146 - br * 0.5;

    // bacaklar
    for (const s of [-1, 1]) {
      limb(s * 9, hipY, s * 9, -16, 15, body);
      blob(s * 9 - 9, -10, 18, 10, 5, body);
    }

    // gövde
    blob(-22, -170 - br * 0.4, 44, 80, 20, body);

    // kollar
    for (const s of [-1, 1]) {
      limb(s * 20, shoY, s * 27, -96, 13, body);
      disc(s * 27, -92, 8, 8, body);
    }

    // baş (oran: biraz daha büyük)
    const hy = -178 - br * 0.6;
    disc(0, hy, 30, 28, body);

    // yüz (person dili, biraz büyük gözler)
    const ey = hy - 1, ex = 8;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex, ey + 3, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 11, 8, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 10, 5, 7, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-6, hy + 10); ctx.lineTo(6, hy + 10); ctx.stroke(); }

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-11, hy - 10, 11, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-11, -150, 6, 17, 0.12, 0, k.TAU); ctx.fill();
  },
};
