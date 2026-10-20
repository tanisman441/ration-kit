// chat-fx/sticker-slam — çıkartma: at anında yukarıdan çarpıp oturur, toz halkası yayar. Contract: engine/kit/ASSETS.md
export default {
  name: 'sticker-slam', category: 'chat-fx',
  desc: 'Çarpan çıkartma: yıldız rozet at anında yukarıdan düşüp zemin çizgisine çarpar, toz halkası yayar',
  tags: ['çıkartma', 'sticker', 'çarpma', 'slam', 'yıldız', 'rozette', 'star', 'badge', 'impact', 'chat'],
  box: [-150, -430, 150, 80],
  bleed: 40,
  anchor: 'çarpma noktası / zemin (0,0)',
  points: { impact: [0, 0], center: [0, -80] },
  params: {
    at: { type: 'time', default: null, desc: 'yapıştırma (çarpma) anı' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0) return;

    const shade = (n, f) => { const c = k.col(n); return `rgb(${c[0] * f | 0},${c[1] * f | 0},${c[2] * f | 0})`; };
    const FALL = 0.45;                                          // 0.45 sn düşüş
    const fpr = k.clamp(d / FALL, 0, 1);
    const fallEase = k.E.inCubic(fpr);                          // hızlanarak düşer
    const y = -330 * (1 - fallEase) - 62;                       // çarpma: rozet merkezi y=-62
    const tilt = (1 - fpr) * 0.5 + 0.04 * Math.sin(t * 2.2) * k.clamp((d - FALL) / 0.4, 0, 1);

    // zemin çizgisi (serbest ince çizgi: ink rengi)
    ctx.save();
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 5; ctx.lineCap = 'round';
    const squish = d >= FALL ? Math.max(0, 1 - (d - FALL) * 6) : 0;
    ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(110, 0); ctx.stroke();

    // toz halkası: çarpma sonrası 0.6 sn yayılır
    const dd = d - FALL;
    if (dd >= 0 && dd < 0.6) {
      const pr = dd / 0.6;
      ctx.globalAlpha = 0.7 * (1 - pr);
      ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 6;
      ctx.beginPath(); ctx.ellipse(0, 0, 30 + pr * 95, 12 + pr * 26, 0, 0, k.TAU); ctx.stroke();
      // toz parçacıkları
      for (let i = 0; i < 8; i++) {
        const ang = Math.PI + (k.hash(i * 13 + 5) - 0.5) * 1.6;  // yukarı saçılır
        const sp = 30 + k.hash(i * 29 + 1) * 70;
        const px = Math.cos(ang) * sp * k.E.outExpo(pr);
        const py = Math.sin(ang) * sp * 0.55 * k.E.outExpo(pr) - 4;
        ctx.globalAlpha = 0.8 * (1 - pr);
        ctx.fillStyle = k.rgba('dim');
        ctx.beginPath(); ctx.arc(px, py, 4.5 * (1 - pr) + 1.5, 0, k.TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // yıldız rozet çıkartması (16 köşe, hafif düzensiz)
    ctx.translate(0, y + (d >= FALL ? 4 * squish : 0));
    ctx.rotate(tilt);
    const bounce = d >= FALL ? Math.abs(Math.sin((d - FALL) * 10)) * 6 * Math.exp(-(d - FALL) * 5) : 0;
    ctx.translate(0, -bounce);
    const N = 16, R0 = 58, R1 = 72;
    const star = (r0, r1) => {
      ctx.beginPath();
      for (let i = 0; i < N * 2; i++) {
        const a = (i / (N * 2)) * k.TAU - Math.PI / 2;
        const rr = (i % 2 === 0 ? r1 : r0) * (1 + 0.03 * k.hash(i * 7 + 2));
        const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    ctx.fillStyle = shade(p.color, 0.88); star(R0, R1); ctx.save(); ctx.translate(7, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color); star(R0, R1); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = k.rgba('bg', 0.55); star(R0, R1); ctx.stroke();

    // şimşek simgesi (ortada)
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath();
    ctx.moveTo(8, -34); ctx.lineTo(-18, 6); ctx.lineTo(-2, 6); ctx.lineTo(-10, 34);
    ctx.lineTo(18, -8); ctx.lineTo(2, -8); ctx.closePath(); ctx.fill();

    // parlama sol üst, alfa 0.11
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-26, -34, 24, 12, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
