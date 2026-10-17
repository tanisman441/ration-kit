// characters/robot — robot; metal gövde, anten, LED gözler.
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'robot',
  category: 'characters',
  desc: 'Robot; metal gövde, anten ve LED gözler, active anında tarama animasyonu',
  tags: ['robot', 'android', 'makine', 'yapay zeka', 'droid', 'bot'],
  box: [-95, -320, 95, 12],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~295 birim',
  points: { head: [0, -272], chest: [0, -184] },
  params: {
    color: { type: 'color', default: 'panel2' },
    active: { type: 'time', default: null, desc: 'göz taraması + LED yanıp sönme anı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const led = k.rgba('cyan');
    const br = Math.sin(t * k.TAU / 2.4) * 2;
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

    // active anı: 0.8 sn'lik tarama
    const d = p.active == null ? -1 : t - p.active;
    const scan = d >= 0 && d < 0.8 ? k.E.inOutCubic(d / 0.8) : -1;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar (segmentli)
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -72, 20, body);
      limb(s * 13, -72, s * 13, -24, 16, k.rgba('dim'));
      blob(s * 13 - 13, -13, 26, 14, 6, body);
    }

    // gövde (kutu gövde)
    blob(-34, -240 - br * 0.4, 68, 112, 18, body);
    const cy = -240 - br * 0.4;
    // göğüs paneli + LED
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-18, cy + 38, 36, 26, 8); ctx.fill();
    const chestLed = scan >= 0 ? 1 : (0.4 + 0.3 * Math.sin(t * 2.2));
    ctx.fillStyle = k.rgba('cyan', chestLed);
    ctx.beginPath(); ctx.ellipse(0, cy + 51, 6, 6, 0, 0, k.TAU); ctx.fill();
    if (chestLed > 0.5) k.glow(0, cy + 51, 18, 'cyan', 0.35);

    // kollar (segmentli)
    for (const s of [-1, 1]) {
      limb(s * 32, shoY, s * 38, -170, 18, body);
      limb(s * 38, -170, s * 38, -138, 14, k.rgba('dim'));
      disc(s * 38, -132, 9, 9, body);
    }

    // baş (kutu kafa)
    const hy = -252 - br * 0.6;
    blob(-30, hy - 30, 60, 56, 16, body);
    // anten
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, hy - 30); ctx.lineTo(0, hy - 52); ctx.stroke();
    ctx.strokeStyle = inkC; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, hy - 30); ctx.lineTo(0, hy - 52); ctx.stroke();
    const antLed = scan >= 0 ? (0.6 + 0.4 * Math.sin(t * 40)) : (0.35 + 0.25 * Math.sin(t * 2.5));
    ctx.fillStyle = k.rgba('red', antLed);
    ctx.beginPath(); ctx.ellipse(0, hy - 56, 6, 6, 0, 0, k.TAU); ctx.fill();
    if (antLed > 0.4) k.glow(0, hy - 56, 16, 'red', 0.3);

    // gözler: LED vizör
    const eyeA = scan >= 0 ? 1 : 0.85;
    ctx.fillStyle = k.rgba('bg', 0.6);
    ctx.beginPath(); k.rrect(-24, hy - 18, 48, 20, 10); ctx.fill();
    // tarama ışığı soldan sağa
    const scanX = scan >= 0 ? -16 + 32 * scan : 0;
    if (scan >= 0) {
      ctx.fillStyle = led;
      ctx.beginPath(); ctx.ellipse(scanX, hy - 8, 14, 7, 0, 0, k.TAU); ctx.fill();
      k.glow(scanX, hy - 8, 24, 'cyan', 0.5);
    }
    for (const s of [-1, 1]) {
      ctx.fillStyle = k.rgba('cyan', eyeA);
      ctx.beginPath(); ctx.ellipse(s * 11, hy - 8, 5.5, 7, 0, 0, k.TAU); ctx.fill();
    }
    if (eyeA > 0.5) k.glow(0, hy - 8, 30, 'cyan', 0.25);

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, hy - 20, 10, 8, -0.4, 0, k.TAU); ctx.fill();
  },
};
