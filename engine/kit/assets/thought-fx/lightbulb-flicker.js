// thought-fx/lightbulb-flicker — ampul: at'tan önce sönük cam; at anında 0.7 sn titreyip sonra tam yanar (ışınlar + ışıma).
// NOT: canvas y-aşağıdır; (0,0) cam merkezi.
export default {
  name: 'lightbulb-flicker', category: 'thought-fx',
  desc: 'Light bulb that flickers for 0.7s on the at moment, then turns on bright with rays',
  tags: ['ampul', 'fikir', 'ışık', 'parlak fikir', 'lightbulb', 'idea', 'flicker', 'light', 'eureka', 'bulb'],
  box: [-92, -98, 92, 72],
  bleed: 40,
  anchor: 'cam merkezi (0,0)',
  points: { glass: [0, -16], base: [0, 47], top: [0, -70] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'ışık rengi' },
    at: { type: 'time', default: null, desc: 'kıvılcım anı: 0.7 sn titreyip sonra tam yanar' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    let on;
    if (p.at == null) on = 1;                                  // varsayılan: yanık
    else if (d < 0) on = 0;                                    // olay öncesi: sönük
    else if (d < 0.7) on = k.hash(Math.floor(d * 16) + 3) > 0.45 ? 1 : 0.06;  // titreme
    else on = 1;                                               // sonra: tam yanık
    const idlePulse = 0.85 + 0.15 * Math.sin(t * 5.2);          // canlı idle: hafif nabız
    const glowA = 0.45 * on * idlePulse;
    const mark = k.rgba(p.color), line = k.rgba('bg', 0.55), sh = k.rgba('ink', 0.10);

    k.glow(0, -16, 95, p.color, Math.min(glowA, 0.5));
    // ışınlar: yanıkken nabızla parlar
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + Math.PI / 8;
      const r1 = 60, r2 = 80 + 4 * Math.sin(t * 5.2 + i);
      ctx.strokeStyle = k.rgba(p.color, 0.5 * on * idlePulse);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, -16 + Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, -16 + Math.sin(a) * r2);
      ctx.stroke();
    }
    // gölge
    ctx.fillStyle = sh;
    ctx.beginPath(); ctx.ellipse(7, -8, 44, 48, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-19, 41, 40, 26, 8); ctx.fill();
    // duy: metal taban
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-25, 33, 50, 28, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(-20, 34, 40, 26, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const yy of [42, 50]) {
      ctx.beginPath(); ctx.moveTo(-20, yy); ctx.lineTo(20, yy); ctx.stroke();
    }
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(-10, 59, 20, 10, 5); ctx.fill();
    // cam
    const glassC = on > 0.5 ? k.rgba(p.color, 0.85) : k.rgba('panel2', 0.55);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -16, 49, 53, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = glassC;
    ctx.beginPath(); ctx.ellipse(0, -16, 44, 48, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-26, 14, 52, 24, 8); ctx.fill();
    // filament
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-14, -14); ctx.lineTo(-7, -28); ctx.lineTo(0, -14); ctx.lineTo(7, -28); ctx.lineTo(14, -14);
    ctx.stroke();
    if (on > 0.5) {                                            // akkor tel parlar
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, -14); ctx.lineTo(-7, -28); ctx.lineTo(0, -14); ctx.lineTo(7, -28); ctx.lineTo(14, -14);
      ctx.stroke();
    }
    // premium parlama (sol üst camda, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, -36, 14, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
