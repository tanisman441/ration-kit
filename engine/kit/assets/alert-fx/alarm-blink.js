// alert-fx/alarm-blink — duvara monte kırmızı alarm lambası; sürekli yanıp söner, `at` anında ışık hüzmeleriyle patlar.
// NOT: canvas y-aşağıdır. Idle: 1.2 sn periyotlu yumuşak yanıp sönme; at olayı 0.8 sn sürer.
export default {
  name: 'alarm-blink',
  category: 'alert-fx',
  desc: 'Duvara monte kırmızı alarm lambası; yanıp sönen kubbe ve patlama hüzmeleri',
  tags: ['alarm', 'alarm lambası', 'uyarı', 'siren', 'tehlike', 'alarm lamp', 'siren', 'warning', 'danger', 'beacon'],
  box: [-100, -125, 100, 45],
  bleed: 90,
  anchor: 'montaj tabanı (0,30)',
  points: { lens: [0, -70], base: [0, 28] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'alarm anı: parlama + ışık hüzmeleri (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d < 0.8;
    const env = firing ? 1 - d / 0.8 : 0;
    // idle yanıp sönme: 1.2 sn periyot, yumuşak sinüs
    const idlePulse = 0.55 + 0.45 * Math.sin(t * k.TAU / 1.2);
    const glowI = firing ? 1 : idlePulse * 0.6;

    // montaj kolu
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-14, -6, 28, 44, 10); ctx.fill();
    // taban plakası
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-66, 28, 132, 24, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-60, 30, 120, 18, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, 36, 30, 5, -0.15, 0, k.TAU); ctx.fill();

    // kubbe tutucu halka
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(0, -38, 46, 0, k.TAU); ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = line;
    ctx.beginPath(); ctx.arc(0, -38, 46, 0, k.TAU); ctx.stroke();

    // kubbe (alarm lambası)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -70, 42, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, -70, 38, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-13, -84, 15, 9, -0.5, 0, k.TAU); ctx.fill();
    // iç çekirdek: yanıp sönmeye göre parlaklık
    ctx.fillStyle = k.rgba('yellow', 0.25 + 0.65 * glowI);
    ctx.beginPath(); ctx.arc(0, -70, 20 * (0.7 + 0.3 * glowI), 0, k.TAU); ctx.fill();
    k.glow(0, -70, 55 + 45 * glowI, p.color, 0.18 + 0.3 * glowI);

    // at olayı: ışık hüzmeleri
    if (firing) {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.2;
        const r1 = 48, r2 = 48 + 95 * k.E.outCubic(env);
        ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - k.prog(d, 0.15, 0.8)));
        ctx.lineWidth = 9 * (1 - k.prog(d, 0, 0.8)) + 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, -70 + Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, -70 + Math.sin(a) * r2);
        ctx.stroke();
      }
    }
  },
};
