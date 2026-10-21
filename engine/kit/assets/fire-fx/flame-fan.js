// fire-fx/flame-fan — yelpaze ile alev: fan çalıştıkça pervane döner, alev yana eğilir ve dalgalanır.
// NOT: canvas y-aşağıdır; (0,0) fan tabanıyla alev tabanının ortasıdır; rüzgâr sağa eser.
export default {
  name: 'flame-fan',
  category: 'fire-fx',
  desc: 'Yelpaze ile alev: fan çalıştıkça pervane döner, rüzgâr çizgileri eser, alev yana eğilir',
  tags: ['fan', 'yelpaze', 'rüzgâr', 'alev', 'eğilme', 'ateş', 'fan', 'wind', 'flame', 'blow', 'fire'],
  box: [-150, -180, 150, 60],
  bleed: 45,
  anchor: 'fan tabanı + alev tabanı ortası (0,0)',
  points: { base: [0, 0], flame: [70, -40], fan: [-90, -30] },
  params: {
    fan: { type: 'number', default: 0.8, desc: '0–1: fan hızı (pervane dönüşü + alev eğilmesi)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: sahne büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const F = k.clamp(p.fan, 0, 1);
    const S = k.clamp(p.size, 0.5, 1.5);
    const fanX = -90 * S, fanY = -38 * S;
    ctx.save();

    // --- fan gövdesi: direk + ızgara ---
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-102 * S, -6 * S, 24 * S, 26 * S, 8 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5 * S;
    ctx.beginPath(); k.rrect(-102 * S, -6 * S, 24 * S, 26 * S, 8 * S); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-98 * S, 0, 7 * S, 5 * S, -0.4, 0, k.TAU); ctx.fill(); // sol üst parlama
    // ızgara halkası
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 5 * S;
    ctx.beginPath(); ctx.arc(fanX, fanY, 34 * S, 0, k.TAU); ctx.stroke();
    // ızgara telleri (ink, havada ince çizgiler)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2 * S;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(fanX - Math.cos(a) * 32 * S, fanY - Math.sin(a) * 32 * S);
      ctx.lineTo(fanX + Math.cos(a) * 32 * S, fanY + Math.sin(a) * 32 * S);
      ctx.stroke();
    }

    // --- pervane: fan hızıyla dönen 3 kanat ---
    const spin = t * (2 + 22 * F);
    for (let i = 0; i < 3; i++) {
      const a = spin + (i / 3) * k.TAU;
      ctx.save();
      ctx.translate(fanX, fanY); ctx.rotate(a);
      ctx.fillStyle = k.rgba(F > 0.05 ? 'accent' : 'dim', F > 0.05 ? 0.85 : 0.6);
      ctx.beginPath(); ctx.ellipse(16 * S, 0, 14 * S, 8 * S, 0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.arc(fanX, fanY, 8 * S, 0, k.TAU); ctx.fill();

    // --- rüzgâr çizgileri: sağa akan hız çizgileri, fan'la yoğunlaşır ---
    if (F > 0.03) {
      const N = Math.round(4 + 6 * F);
      for (let i = 0; i < N; i++) {
        const h = k.hash(i * 53 + 301);
        const yy = fanY + (h - 0.5) * 90 * S;
        const cyc = 1.4 - 0.8 * F;
        const ph = ((t / cyc) + k.hash(i * 59 + 307)) % 1;
        const x0 = fanX + 40 * S + ph * 110 * S;
        const wob = k.noise1(t * 7 + i * 11) * 6 * S;
        ctx.strokeStyle = k.rgba('cyan', 0.4 * F * (1 - ph));
        ctx.lineWidth = 2.6 * S;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x0, yy + wob);
        ctx.quadraticCurveTo(x0 + 26 * S, yy + wob * 1.6, x0 + 52 * S, yy + wob * 2);
        ctx.stroke();
      }
    }

    // --- alev: fan arttıkça sağa eğilir ve dalgalanır ---
    const flameX = 70 * S;
    const lean = F * 64 * S;                       // yana eğilme
    const wob = (2 + 14 * F) * k.noise1(t * (6 + 10 * F) + 9);
    const fh = (120 - 26 * F) * S;                 // rüzgârda biraz basık
    const fw = 52 * S * (1 + 0.25 * F);
    // dış alev
    ctx.fillStyle = k.rgba('red', 0.92);
    ctx.beginPath();
    ctx.moveTo(flameX - fw / 2, 8 * S);
    ctx.bezierCurveTo(flameX - fw / 2 - 8 * S, -fh * 0.4, flameX + lean * 0.3 + wob, -fh * 0.7, flameX + lean + wob * 1.4, -fh);
    ctx.bezierCurveTo(flameX + lean * 0.5 + wob, -fh * 0.55, flameX + fw / 2 + 6 * S, -fh * 0.3, flameX + fw / 2, 8 * S);
    ctx.closePath(); ctx.fill();
    // iç alev
    ctx.fillStyle = k.rgba('yellow', 0.95);
    ctx.beginPath();
    ctx.moveTo(flameX - fw * 0.24, 8 * S);
    ctx.quadraticCurveTo(flameX - fw * 0.24, -fh * 0.35, flameX + lean * 0.35 + wob * 0.7, -fh * 0.62);
    ctx.quadraticCurveTo(flameX + lean * 0.4 + wob, -fh * 0.4, flameX + fw * 0.24, 8 * S);
    ctx.closePath(); ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(flameX - fw * 0.2, -fh * 0.32, fw * 0.18, fh * 0.14, -0.5, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('red', 0.12);
    ctx.beginPath(); ctx.ellipse(flameX + fw * 0.28, -fh * 0.18, fw * 0.2, fh * 0.2, 0.45, 0, k.TAU); ctx.fill();
    k.glow(flameX + lean * 0.5, -fh * 0.4, 60 * S, k.col('yellow'), 0.28);
    // köz tabanı
    ctx.fillStyle = k.rgba('red', 0.7);
    ctx.beginPath(); ctx.arc(flameX, 10 * S, 12 * S, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
