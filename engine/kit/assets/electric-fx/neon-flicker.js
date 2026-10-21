// electric-fx/neon-flicker — titreyen neon tüpü.
// ANIMASYON: canlı idle — noise-tabanlı titreme + rastgele voltaj düşüşleri;
// `dip` anında 0.35 sn'lik derin kararma (kahverengi geridönüş). Tek vurgu: yellow.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'neon-flicker',
  category: 'electric-fx',
  desc: 'Titreyen neon tüpü; idle’da voltaj dalgalanır, dip anında kısa kararma olur',
  tags: ['neon', 'ışık', 'titreme', 'tabela', 'ışıldama', 'voltaj', 'neon', 'flicker', 'light', 'sign', 'glow', 'voltage', 'tube'],
  box: [-100, -60, 100, 60],
  bleed: 55,
  anchor: 'tüp merkezi (0,0)',
  points: { left: [-82, 0], right: [82, 0], centre: [0, 0] },
  params: {
    dip: { type: 'time', default: null, desc: 'kararma anı: 0.35 sn derin voltaj düşüşü' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round';

    // --- askı blokları ---
    for (const sx of [-1, 1]) {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(sx * 78 - 9 + 5, -34 + 5, 18, 68, 7); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(sx * 78 - 9, -34, 18, 68, 7); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);
      ctx.beginPath(); ctx.ellipse(sx * 78 - 4, -24, 4, 9, 0.3, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5;
      ctx.beginPath(); k.rrect(sx * 78 - 9, -34, 18, 68, 7); ctx.stroke();
    }

    // --- parlaklık: titreme + rastgele voltaj düşüşleri ---
    let f = 0.78 + 0.22 * (0.5 + 0.5 * k.noise1(t * 6.5));
    if (k.noise1(t * 0.9 + 3.7) < -0.52) f *= 0.35;      // doğal düşüşler
    const d = p.dip == null ? -1 : t - p.dip;
    if (d >= 0 && d < 0.4) {
      const dipEnv = Math.sin(k.prog(d, 0, 0.4) * Math.PI);  // 0.35 sn kararma
      f = k.lerp(f, 0.08, dipEnv);
    }
    f = k.clamp(f, 0.05, 1);

    // --- neon tüpü: dış glow, tüp, beyaz çekirdek ---
    k.glow(0, 0, 58, p.color, 0.5 * f);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-74 + 5, -14 + 5, 148, 28, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.55 + 0.35 * f);
    ctx.beginPath(); k.rrect(-74, -14, 148, 28, 14); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10 * f + 0.04);
    ctx.beginPath(); ctx.ellipse(-44, -6, 22, 5, -0.25, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 4.5;
    ctx.beginPath(); k.rrect(-74, -14, 148, 28, 14); ctx.stroke();
    // çekirdek ışık çizgisi
    ctx.strokeStyle = k.rgba('#ffffff', 0.75 * f);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-64, 0); ctx.lineTo(64, 0); ctx.stroke();
    // titreme parçacıkları (sönük anlarda)
    if (f < 0.55) {
      for (let i = 0; i < 4; i++) {
        const px = (k.hash(i * 13 + Math.floor(t * 8) * 7) - 0.5) * 130;
        ctx.fillStyle = k.rgba(p.color, 0.6 * (0.55 - f));
        ctx.beginPath(); ctx.arc(px, (k.hash(i * 5) - 0.5) * 20, 2.5, 0, k.TAU); ctx.fill();
      }
    }
  },
};
