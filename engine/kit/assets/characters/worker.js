// characters/worker — baretli işçi; person ailesinden.
// NOT: canvas y-aşağıdır; zemin (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'worker',
  category: 'characters',
  desc: 'Baretli işçi; sarı baret ve reflektörlü yelek, 3 ruh hali',
  tags: ['işçi', 'baret', 'inşaat', 'emekçi', 'worker', 'construction', 'hardhat', 'helmet', 'laborer'],
  box: [-95, -300, 95, 12],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~295 birim',
  points: { head: [0, -282], hand: [44, -138] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'surprised'], default: 'neutral' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const hat = k.rgba('yellow');
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
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar + botlar
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -22, 20, body);
      blob(s * 13 - 13, -13, 26, 14, 6, body);
    }

    // gövde
    blob(-31, -240 - br * 0.4, 62, 112, 28, body);
    // reflektörlü yelek: iki sarı şerit
    ctx.fillStyle = hat;
    ctx.beginPath(); k.rrect(-24, -222 - br * 0.4, 48, 11, 5); ctx.fill();
    ctx.beginPath(); k.rrect(-24, -188 - br * 0.4, 48, 11, 5); ctx.fill();

    // kollar
    for (const s of [-1, 1]) {
      limb(s * 29, shoY, s * 37, -136, 18, body);
      disc(s * 37, -132, 10, 10, body);
    }

    // baş
    const hy = -250 - br * 0.6;
    disc(0, hy, 36, 34, body);

    // yüz (person dili)
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
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }

    // baret: kubbe + siperlik (sarı vurgu)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, hy - 8, 42, 36, 0, Math.PI, k.TAU); ctx.fill();
    ctx.fillStyle = hat;
    ctx.beginPath(); ctx.ellipse(0, hy - 8, 39.5, 33.5, 0, Math.PI, k.TAU); ctx.fill();
    blob(-46, hy - 14, 92, 12, 6, hat);                   // siperlik
    // baret kaburgası
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, hy - 42); ctx.lineTo(0, hy - 12); ctx.stroke();
    // baret parlaması (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(-15, hy - 28, 13, 8, -0.4, 0, k.TAU); ctx.fill();
  },
};
