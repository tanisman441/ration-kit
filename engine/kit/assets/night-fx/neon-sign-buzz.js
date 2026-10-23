// night-fx/neon-sign-buzz — neon tabela: dikdörtgen çerçeve tüp + içinde zikzak şimşek
// motifi; tüpler idle'da vızıltı titremesi yapar, buzz anında 0.5 sn düşüp yeniden çakar.
// NOT: canvas y-aşağıdır; tabela duvara asılıdır, üstte askı braketleri vardır.
export default {
  name: 'neon-sign-buzz', category: 'night-fx',
  desc: 'Neon tabela: çerçeve + şimşek motifi; vızıltı titremesi, buzz anında düşüp çakar',
  tags: ['neon', 'tabela', 'vızıltı', 'ışık', 'gece', 'reklam', 'neon sign', 'buzz', 'night', 'glow', 'billboard'],
  box: [-160, -95, 160, 95],
  bleed: 35,
  anchor: 'tabela merkezi (0,0); üst askı y=-80',
  points: { top: [0, -78], centre: [0, 0], bottom: [0, 78] },
  params: {
    color: { type: 'color', default: 'purple' },
    buzz: { type: 'time', default: null, desc: 'vızıltı kesintisi anı: 0.5 sn düşüp yeniden çakma' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- parlaklık seviyesi: idle vızıltı + ara sıra çöküş + buzz olayı ---
    let lvl = 0.80 + 0.20 * k.noise1(t * 11 + 7);
    if (k.hash(Math.floor(t * 2.1) + 13) < 0.13) lvl *= 0.3;          // rastgele düşme
    const d = p.buzz == null ? -1 : t - p.buzz;
    let lvlInner = lvl;
    if (d >= 0 && d < 0.5) {                                          // buzz: düş + yeniden çak
      const q = d / 0.5;
      const strike = q < 0.4 ? 0.05 : (Math.sin(d * 90) > 0 ? 1 : 0.1) * Math.min(1, (q - 0.4) / 0.2);
      lvlInner = lvl * strike;
    }

    const tube = (col, w, alpha, pts, close) => {
      // dış hat (bg 0.55) altında tüp
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = w + 5;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      if (close) ctx.closePath();
      ctx.stroke();
      k.glow((pts[0][0] + pts[pts.length - 1][0]) / 2, (pts[0][1] + pts[pts.length - 1][1]) / 2, 90, col, 0.22 * alpha);
      ctx.strokeStyle = k.rgba(col, alpha); ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      if (close) ctx.closePath();
      ctx.stroke();
      // sıcak çekirdek çizgisi
      ctx.strokeStyle = `rgba(255,255,255,${(0.55 * alpha).toFixed(3)})`; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      if (close) ctx.closePath();
      ctx.stroke();
    };

    // --- arka plaka (koyu siluet, iki temada da okunur) ---
    ctx.fillStyle = k.rgba('bg', 0.55); ctx.beginPath(); k.rrect(-138, -62, 276, 124, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-132, -56, 264, 112, 13); ctx.fill();
    // plaka parlama (sol üst 0.10) + gölge (sağ alt)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-90, -30, 40, 12, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(90, 34, 44, 13, -0.4, 0, k.TAU); ctx.fill();

    // --- çerçeve tüpü (vurgu rengi) ---
    const a1 = k.clamp(lvl, 0, 1);
    tube(p.color, 7, a1, [[-112, -40], [112, -40], [112, 40], [-112, 40]], true);

    // --- iç motif: şimşek zikzak (aynı vurgu rengi, daha ince) ---
    const a2 = k.clamp(lvlInner, 0, 1);
    if (a2 > 0.02) {
      tube(p.color, 6, a2, [[30, -28], [-8, -6], [8, -6], [-30, 28]], false);
    }

    // --- askı braketleri (ince serbest çizgiler: ink) ---
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-70, -56); ctx.lineTo(-70, -84); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(70, -56); ctx.lineTo(70, -84); ctx.stroke();
  },
};
