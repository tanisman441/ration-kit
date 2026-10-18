// home/tv — düz ekran TV; screen varyantı (static|news|sports|blank), ekran titrer
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) ekran merkezidir.
export default {
  name: 'tv', category: 'home',
  desc: 'Düz ekran TV; ekran içeriği varyantla değişir, ekran hafif titrer',
  tags: ['tv', 'televizyon', 'television', 'ekran', 'screen', 'haber', 'maç', 'ev', 'home'],
  box: [-125, -90, 125, 105],
  bleed: 30,
  anchor: 'ekran merkezi (0,0); zemin y=98',
  points: { screen: [0, 0], stand: [0, 72] },
  params: {
    screen: { type: 'enum', values: ['static', 'news', 'sports', 'blank'], default: 'static', desc: 'ekran içeriği' },
    color: { type: 'color', default: 'ink', desc: 'çerçeve rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), shadow = 'rgba(0,0,0,0.12)';
    const SX0 = -95, SY0 = -58, SX1 = 95, SY1 = 48, SW = SX1 - SX0, SH = SY1 - SY0;
    // ekran titremesi (açıkken): parlaklıkta hafif dalgalanma
    const flick = p.screen === 'blank' ? 0 : 0.94 + 0.06 * k.noise1(t * 10 + 1.7);

    ctx.save();

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-118, 92); ctx.lineTo(118, 92); ctx.stroke();

    // ayak + boyun
    ctx.fillStyle = shadow; k.rrect(-34, 64, 68, 28, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-10, 52, 20, 22, 6); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-10, 52, 20, 22, 6); ctx.stroke();
    ctx.fillStyle = shadow;
    ctx.beginPath(); ctx.ellipse(7, 90, 42, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.ellipse(0, 84, 42, 10, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.ellipse(0, 84, 42, 10, 0, 0, k.TAU); ctx.stroke();

    // çerçeve
    ctx.fillStyle = shadow; k.rrect(-99, -62, 210, 132, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-105, -68, 210, 132, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-105, -68, 210, 132, 14); ctx.stroke();

    // ekran içeriği (kırpılmış)
    ctx.save();
    k.rrect(SX0, SY0, SW, SH, 10); ctx.clip();
    if (p.screen === 'blank') {
      ctx.fillStyle = k.rgba('bg', 0.85);
      ctx.fillRect(SX0, SY0, SW, SH);
    } else if (p.screen === 'static') {
      // parazit: ızgara noktalar, zamanla değişen parlaklık
      ctx.fillStyle = k.rgba('bg', 0.9);
      ctx.fillRect(SX0, SY0, SW, SH);
      const fr = Math.floor(t * 12);
      for (let gx = 0; gx < 12; gx++) for (let gy = 0; gy < 7; gy++) {
        const v = k.hash(gx * 131 + gy * 17 + fr * 1009);
        ctx.fillStyle = k.rgba('ink', (0.15 + 0.75 * v) * flick);
        const dx = SX0 + 10 + gx * (SW - 20) / 11, dy = SY0 + 10 + gy * (SH - 20) / 6;
        ctx.beginPath(); ctx.arc(dx, dy, 3.4, 0, k.TAU); ctx.fill();
      }
    } else if (p.screen === 'news') {
      // haber: stüdyo zemini + alt bant (alt yazı)
      ctx.fillStyle = k.rgba('bg', 0.88);
      ctx.fillRect(SX0, SY0, SW, SH);
      ctx.fillStyle = k.rgba('cyan', 0.25 * flick);
      ctx.fillRect(SX0, SY0, SW, SH * 0.55);
      // alt bant
      ctx.fillStyle = k.rgba('accent', 0.95);
      ctx.fillRect(SX0, SY1 - 30, SW, 30);
      ctx.fillStyle = k.rgba('bg', 0.9);
      ctx.fillRect(SX0 + 10, SY1 - 22, 90 * flick + 30, 6);
      ctx.fillRect(SX0 + 10, SY1 - 12, 130 * flick, 5);
      // CANLI noktası (yanıp söner)
      const liveOn = (t % 1.2) < 0.7;
      ctx.fillStyle = k.rgba('red', liveOn ? 0.95 : 0.25);
      ctx.beginPath(); ctx.arc(SX1 - 18, SY0 + 16, 6, 0, k.TAU); ctx.fill();
    } else { // sports
      // maç: yeşil saha + çizgiler + skor bandı
      ctx.fillStyle = k.rgba('green', 0.55 * flick + 0.25);
      ctx.fillRect(SX0, SY0, SW, SH);
      ctx.strokeStyle = k.rgba('bg', 0.7); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(SX0 + SW / 2, SY0); ctx.lineTo(SX0 + SW / 2, SY1); ctx.stroke();
      ctx.beginPath(); ctx.arc(SX0 + SW / 2, SY0 + SH / 2, 16, 0, k.TAU); ctx.stroke();
      // top (saha içinde seker)
      const bx = SX0 + SW * (0.5 + 0.32 * Math.sin(t * 3.1));
      const by = SY0 + SH * (0.58 + 0.22 * Math.abs(Math.cos(t * 3.1)));
      ctx.fillStyle = k.rgba('bg', 0.95);
      ctx.beginPath(); ctx.arc(bx, by, 7, 0, k.TAU); ctx.fill();
      // skor bandı
      ctx.fillStyle = k.rgba('bg', 0.9);
      k.rrect(SX0 + 8, SY0 + 8, 74, 22, 6); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.9);
      const s1 = Math.floor(t / 20) % 3, s2 = Math.floor(t / 30) % 2;
      ctx.font = "700 15px monospace"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`${s1} - ${s2}`, SX0 + 45, SY0 + 20);
    }
    // ekran parlaması (bilgi yüzeyi değil — yansıma bandı, alfa düşük)
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(SX0, SY1); ctx.lineTo(SX0 + SW * 0.45, SY0); ctx.lineTo(SX0 + SW * 0.7, SY0); ctx.lineTo(SX0 + SW * 0.25, SY1);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // ekran iç çizgisi
    ctx.strokeStyle = line; ctx.lineWidth = 3;
    k.rrect(SX0, SY0, SW, SH, 10); ctx.stroke();

    // açıkken hafif ışıma
    if (p.screen !== 'blank') k.glow(0, -5, 120, p.screen === 'static' ? 'ink' : p.screen === 'news' ? 'cyan' : 'green', 0.10 * flick);

    ctx.restore();
  },
};
