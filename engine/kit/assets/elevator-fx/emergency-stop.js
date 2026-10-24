// elevator-fx/emergency-stop — acil durdurma düğmesi; `at` anında basılır, alarm çalar.
// ANIMASYON: `at` anında düğme 0.12 sn'de içeri çöker, kırmızı halka yanıp söner (0.5 sn
// aralıkla 1.2 sn), alarm ışınları dışa fırlar. Idle'da düğme çevresindeki LED yavaş nabız.
// Tek vurgu: alarm (red). Contract: engine/kit/ASSETS.md
export default {
  name: 'emergency-stop',
  category: 'elevator-fx',
  desc: 'Acil durdurma düğmesi; at anında çöker, kırmızı alarm yanıp söner',
  tags: ['asansör', 'acil', 'durdurma', 'alarm', 'güvenlik', 'kırmızı düğme', 'elevator', 'emergency', 'stop', 'alarm', 'safety', 'button'],
  box: [-110, -130, 110, 130],
  bleed: 44,
  anchor: 'düğme merkezi (0,0)',
  points: { button: [0, -6], top: [0, -130] },
  params: {
    at: { type: 'time', default: null, desc: 'acil durdurmaya basılma anı (çökme 0.12 sn, alarm 1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const alarming = d >= 0 && d < 1.2;
    // düğme çökmesi: 0.12 sn'de içeri, kalır
    const sink = d < 0 ? 0 : k.prog(d, 0, 0.12);
    // alarm yanıp sönme: 0.5 sn aralık
    const blink = alarming ? (Math.floor(d / 0.25) % 2 === 0 ? 1 : 0.15) : 0;
    const idle = 0.3 + 0.12 * Math.sin(t * 2.0);

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- panel gövdesi ---
    plate(-88, -112, 176, 224, 18, k.rgba('dim'));
    // parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-58, -90, 20, 11, -0.3, 0, k.TAU); ctx.fill();

    // --- sarı uyarı halkası (düğme yuvası) ---
    ctx.fillStyle = k.rgba('yellow', alarming ? 0.85 : 0.5);
    ctx.beginPath(); ctx.arc(0, -6, 56, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); ctx.arc(0, -6, 50, 0, k.TAU); ctx.fill();

    // --- alarm ışınları (dışa fırlar) ---
    if (alarming) {
      const rays = 8;
      for (let i = 0; i < rays; i++) {
        const a = (i / rays) * k.TAU + t * 0.4;
        const len = 66 + 14 * Math.sin(t * 8 + i);
        ctx.strokeStyle = k.rgba('red', 0.7 * blink);
        ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 62, -6 + Math.sin(a) * 62);
        ctx.lineTo(Math.cos(a) * len, -6 + Math.sin(a) * len);
        ctx.stroke();
      }
      k.glow(0, -6, 46, 'red', 0.45 * blink);
    }

    // --- kırmızı düğme (çöker) ---
    const by = -6 + sink * 10;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, by, 42, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red', alarming ? 0.95 : 0.85);
    ctx.beginPath(); ctx.arc(0, by, 37, 0, k.TAU); ctx.fill();
    // düğme parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.12);
    ctx.beginPath(); ctx.ellipse(-14, by - 16, 13, 8, -0.4, 0, k.TAU); ctx.fill();

    // --- alt LED (nabız / alarmda yanıp söner) ---
    const led = alarming ? blink : idle;
    if (alarming) k.glow(0, 76, 14, 'red', 0.4 * led);
    ctx.fillStyle = k.rgba('red', Math.max(led, 0.2));
    ctx.beginPath(); ctx.arc(0, 76, 9, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 76, 12, 0, k.TAU); ctx.stroke();
    // alt çizgi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-28, 100); ctx.lineTo(28, 100); ctx.stroke();
    ctx.restore();
  },
};
