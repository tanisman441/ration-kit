// fishing-fx/fish-jump — balık sudan yay çizerek sıçrar, diğer tarafa düşer.
// at anında (1.0 sn) balık soldan kalkar, zirveye çıkar, sağa suya iner;
// kalkış ve inişte sıçrama damlaları; idle: balık su altında süzülür.
// NOT: canvas y-aşağıdır; (0,0) sahne merkezidir, su yüzeyi y=40'tır.
export default {
  name: 'fish-jump', category: 'fishing-fx',
  desc: 'Balık sudan yay çizerek sıçrar, havada döner ve diğer tarafta suya düşer',
  tags: ['balık', 'sıçrama', 'zıplama', 'su', 'olta', 'fish', 'jump', 'leap', 'splash', 'water'],
  box: [-150, -115, 150, 95],
  bleed: 40,
  anchor: 'sahne merkezi (0,0); su yüzeyi y=40',
  points: { takeoff: [-95, 40], peak: [0, -80], landing: [95, 40] },
  params: {
    at: { type: 'time', default: null, desc: 'sıçrama anı (1.0 sn, balık yay çizerek sudan çıkar ve iner)' },
    color: { type: 'color', default: 'cyan', desc: 'balık rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // su yüzeyi
    ctx.strokeStyle = k.rgba('cyan', 0.55); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -150; x <= 150; x += 8) {
      const wy = 40 + Math.sin(x * 0.07 + t * 1.6) * 2.5;
      if (x === -150) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba('cyan', 0.3); ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -140; x <= 140; x += 8) {
      const wy = 54 + Math.sin(x * 0.05 + t * 1.1 + 2) * 2;
      if (x === -140) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // balık çizim fonksiyonu (yerel)
    const drawFish = (x, y, rot, wagAmp) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      const wag = Math.sin(t * 9) * wagAmp;
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath(); ctx.ellipse(0, 0, 34, 16, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.ellipse(0, 0, 34, 16, 0, 0, k.TAU); ctx.stroke();
      // parlama sol üst
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-10, -7, 11, 5, -0.3, 0, k.TAU); ctx.fill();
      // kuyruk (çırpar)
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath();
      ctx.moveTo(-30, 0);
      ctx.lineTo(-48, -14 + wag * 8);
      ctx.lineTo(-48, 14 + wag * 8);
      ctx.closePath(); ctx.fill();
      // sırt yüzgeci
      ctx.beginPath();
      ctx.moveTo(-8, -14); ctx.lineTo(4, -24); ctx.lineTo(14, -13);
      ctx.closePath(); ctx.fill();
      // göz
      ctx.fillStyle = k.rgba('bg', 0.85);
      ctx.beginPath(); ctx.arc(18, -4, 3, 0, k.TAU); ctx.fill();
      // solungaç çizgisi
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(6, -10); ctx.quadraticCurveTo(2, 0, 6, 10); ctx.stroke();
      ctx.restore();
    };

    // sıçrama: parabol (1.0 sn)
    if (d >= 0 && d < 1.0) {
      const u = d / 1.0;
      const fx = k.lerp(-95, 95, u);
      const fy = 40 - Math.sin(u * Math.PI) * 120;
      const rot = Math.atan2(-Math.cos(u * Math.PI) * 120 * Math.PI, 190);
      drawFish(fx, fy, rot, 0.6);
    } else if (d >= 1.0) {
      // iniş sonrası: sağda su altında süzülür
      drawFish(62 + Math.sin(t * 0.8) * 12, 64, 0.05, 1);
    } else {
      // sıçrama öncesi: solda su altında süzülür
      drawFish(-62 + Math.sin(t * 0.8) * 12, 64, -0.05, 1);
    }

    // kabarcıklar (su altında, idle)
    for (let i = 0; i < 3; i++) {
      const h = k.hash(i * 29.1);
      const cyc = 2.2, ph = ((t + h * cyc) % cyc) / cyc;
      const bx = (d >= 1.0 ? 62 : -62) + (h - 0.5) * 30;
      ctx.strokeStyle = k.rgba('cyan', 0.6 * (1 - ph)); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, 66 - ph * 22, 2 + h * 2.5, 0, k.TAU); ctx.stroke();
    }

    // kalkış sıçraması (ilk 0.25 sn)
    if (d >= 0 && d < 0.25) {
      const u = d / 0.25;
      for (let i = 0; i < 6; i++) {
        const h = k.hash(i * 47.7);
        const ang = -Math.PI * (0.15 + h * 0.7);
        const dist = u * (16 + h * 20);
        ctx.fillStyle = k.rgba('cyan', (1 - u) * 0.85);
        ctx.beginPath(); ctx.arc(-95 + Math.cos(ang) * dist, 38 + Math.sin(ang) * dist, 2 + h * 2.5, 0, k.TAU); ctx.fill();
      }
    }
    // iniş sıçraması (son 0.25 sn)
    if (d >= 0.75 && d < 1.0) {
      const u = (d - 0.75) / 0.25;
      for (let i = 0; i < 6; i++) {
        const h = k.hash(i * 53.3);
        const ang = -Math.PI * (0.15 + h * 0.7);
        const dist = u * (16 + h * 20);
        ctx.fillStyle = k.rgba('cyan', (1 - u) * 0.85);
        ctx.beginPath(); ctx.arc(95 + Math.cos(ang) * dist, 38 + Math.sin(ang) * dist, 2 + h * 2.5, 0, k.TAU); ctx.fill();
      }
      // iniş halkası
      ctx.strokeStyle = k.rgba('cyan', (1 - u) * 0.7); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(95, 42, 8 + u * 34, 3 + u * 9, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
