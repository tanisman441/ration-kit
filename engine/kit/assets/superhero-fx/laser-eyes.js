// superhero-fx/laser-eyes — maskeli kahraman kafası: at anında gözlerden lazer ışınları.
// NOT: canvas y-aşağıdır; (0,0) kafa merkezi. Işınlar sağa doğru çıkar.
export default {
  name: 'laser-eyes', category: 'superhero-fx',
  desc: 'Maskeli kahraman kafası: at anında gözlerden iki lazer ışını fırlatır, boşta gözler nabız gibi parlar',
  tags: ['lazer', 'göz', 'kahraman', 'maske', 'ışın', 'laser', 'eyes', 'hero', 'mask', 'beam'],
  box: [-115, -95, 215, 95],
  bleed: 60,
  anchor: 'kafa merkezi (0,0)',
  points: { head: [0, 0], eyeTop: [30, -17], eyeBottom: [30, 17], beamEnd: [215, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'lazer anı (gözlerden ışın, 0.5 sn)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d <= 0.7;
    const pulse = 0.45 + 0.35 * Math.sin(t * 3.2);   // idle göz nabzı
    ctx.save();

    // kafa
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 0, 78, 0, k.TAU); ctx.fill();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-26, -40, 30, 15, -0.5, 0, k.TAU); ctx.fill();
    // premium: sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(34, 44, 30, 15, -0.5, 0, k.TAU); ctx.fill();

    // maske bandı
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-70, -38, 140, 76, 24); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-70, -38, 140, 76, 24); ctx.stroke();

    // göz yarıkları
    const glowA = firing ? 1 : pulse;
    for (const ey of [-17, 17]) {
      k.glow(30, ey, 26, 'yellow', 0.45 * glowA);
      ctx.fillStyle = k.rgba('yellow', 0.95 * glowA + 0.05);
      ctx.beginPath();
      if (ctx.roundRect) { ctx.roundRect(8, ey - 8, 44, 16, 8); } else { k.rrect(8, ey - 8, 44, 16, 8); }
      ctx.fill();
    }

    // dış hat
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, 0, 78, 0, k.TAU); ctx.stroke();

    // ---- lazer olayı: at anı (0.5 sn) ----
    if (firing) {
      const g = k.prog(d, 0, 0.55);
      const alpha = d < 0.42 ? 1 : 1 - (d - 0.42) / 0.13;
      const flick = 0.75 + 0.25 * k.noise1(t * 40);
      const reach = 78 + (215 + 60 - 78) * k.E.outCubic(Math.min(g * 2.2, 1)); // hızlı uzama
      for (const ey of [-17, 17]) {
        // dış ışıma kuşağı
        k.glow(60, ey, 40 * flick, 'yellow', 0.35 * alpha);
        ctx.fillStyle = k.rgba('yellow', 0.38 * alpha * flick);
        const y0 = ey - 17 * flick, y1 = ey + 17 * flick;
        ctx.beginPath();
        ctx.moveTo(56, y0); ctx.lineTo(reach, ey - 8 * flick);
        ctx.lineTo(reach, ey + 8 * flick); ctx.lineTo(56, y1);
        ctx.closePath(); ctx.fill();
        // çekirdek ışın
        ctx.fillStyle = k.rgba('bg', 0.9 * alpha);
        ctx.beginPath();
        ctx.moveTo(56, ey - 6); ctx.lineTo(reach, ey - 3);
        ctx.lineTo(reach, ey + 3); ctx.lineTo(56, ey + 6);
        ctx.closePath(); ctx.fill();
      }
      // gözlerde ateşleme parlaması
      if (d < 0.15) {
        const f = 1 - d / 0.15;
        k.glow(30, 0, 70 * f, 'yellow', 0.5 * f);
      }
    }
    ctx.restore();
  },
};
