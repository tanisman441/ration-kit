// fishing-fx/splash-catch — su sıçrar, balık havaya fırlar ve yakalanır.
// at anında (0.8 sn) su tacı + damlacıklar patlar, balık sudan yükselir ve
// havada asılı kalıp kuyruk çırpar; idle: sırt yüzgeci suda gezinir, halkalar yayılır.
// NOT: canvas y-aşağıdır; (0,0) sahne merkezidir, su yüzeyi y=30'dur.
export default {
  name: 'splash-catch', category: 'fishing-fx',
  desc: 'Su sıçrayarak patlar, balık havaya fırlar ve yakalanmış halde asılı kalır',
  tags: ['sıçrama', 'balık', 'yakalama', 'su', 'olta', 'splash', 'catch', 'fish', 'water', 'leap'],
  box: [-130, -120, 130, 100],
  bleed: 45,
  anchor: 'sahne merkezi (0,0); su yüzeyi y=30, balık zirvede (0,-55)',
  points: { splash: [0, 30], fish: [0, -55] },
  params: {
    at: { type: 'time', default: null, desc: 'yakalama anı (0.8 sn, su patlar balık yükselir)' },
    color: { type: 'color', default: 'cyan', desc: 'balık rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // su yüzeyi
    ctx.strokeStyle = k.rgba('cyan', 0.55); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -130; x <= 130; x += 8) {
      const wy = 30 + Math.sin(x * 0.07 + t * 1.6) * 2.5;
      if (x === -130) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba('cyan', 0.3); ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -120; x <= 120; x += 8) {
      const wy = 44 + Math.sin(x * 0.05 + t * 1.1 + 2) * 2;
      if (x === -120) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // halka dalgalar (sürekli)
    for (let i = 0; i < 2; i++) {
      const frac = ((t * 0.6 + i * 0.5) % 1);
      ctx.strokeStyle = k.rgba('cyan', (1 - frac) * 0.45); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 32, 12 + frac * 48, 4 + frac * 11, 0, 0, k.TAU); ctx.stroke();
    }

    // balık konumu: atıştan önce su altında (sırt yüzgeci görünür),
    // atışta yükselir, sonra havada asılı kalır
    let fishY = 30, fishX = 0, fishRot = 0;
    if (d >= 0 && d < 0.5) {
      const u = d / 0.5;
      const e = 1 - (1 - u) * (1 - u);
      fishY = k.lerp(24, -55, e);
      fishRot = (1 - e) * 0.5;
    } else if (d >= 0.5) {
      fishY = -55 + Math.sin(t * k.TAU / 2.0) * 3;
      fishRot = Math.sin(t * 9) * 0.08;
    } else {
      fishX = Math.sin(t * 0.7) * 28;
      fishY = 56; // su altında (sadece sırt yüzgeci görünür)
    }

    // su altı sırt yüzgeci (atıştan önce gezinir)
    if (d < 0) {
      ctx.fillStyle = k.rgba(p.color, 0.8);
      ctx.beginPath();
      ctx.moveTo(fishX - 8, 30); ctx.lineTo(fishX, 14 + Math.sin(t * 2) * 2); ctx.lineTo(fishX + 8, 30);
      ctx.closePath(); ctx.fill();
    }

    // balık
    ctx.save();
    ctx.translate(fishX, fishY);
    ctx.rotate(fishRot);
    const wag = Math.sin(t * 9) * 0.12;
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.ellipse(0, 0, 40, 18, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.ellipse(0, 0, 40, 18, 0, 0, k.TAU); ctx.stroke();
    // parlama sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -8, 13, 6, -0.3, 0, k.TAU); ctx.fill();
    // kuyruk (çırpar)
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath();
    ctx.moveTo(-36, 0);
    ctx.lineTo(-56, -16 + wag * 30);
    ctx.lineTo(-56, 16 + wag * 30);
    ctx.closePath(); ctx.fill();
    // sırt yüzgeci
    ctx.beginPath();
    ctx.moveTo(-10, -16); ctx.lineTo(4, -28); ctx.lineTo(16, -15);
    ctx.closePath(); ctx.fill();
    // göz
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.arc(21, -5, 3.5, 0, k.TAU); ctx.fill();
    // solungaç çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(7, -11); ctx.quadraticCurveTo(2, 0, 7, 11); ctx.stroke();
    ctx.restore();

    // sıçrama patlaması: damlacıklar + su tacı (0.8 sn)
    if (d >= 0 && d < 0.8) {
      const u = d / 0.8;
      const e = 1 - (1 - u) * (1 - u);
      for (let i = 0; i < 10; i++) {
        const h = k.hash(i * 71.9);
        const ang = -Math.PI * (0.08 + h * 0.84);
        const dist = e * (20 + h * 55);
        ctx.fillStyle = k.rgba('cyan', (1 - u) * 0.85);
        ctx.beginPath(); ctx.arc(Math.cos(ang) * dist, 28 + Math.sin(ang) * dist, 2.5 + h * 3, 0, k.TAU); ctx.fill();
      }
      // su tacı: iki yay
      ctx.strokeStyle = k.rgba('cyan', (1 - u) * 0.7); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(-26, 30, 10 + e * 14, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(26, 30, 10 + e * 14, Math.PI * 1.1, Math.PI * 0.1); ctx.stroke();
      // merkez sıçrama halkası
      ctx.strokeStyle = k.rgba('cyan', (1 - u) * 0.6); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, 32, 10 + e * 40, 4 + e * 10, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
