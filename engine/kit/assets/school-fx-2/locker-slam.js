// school-fx-2/locker-slam — okul dolabı kapak çarpması:
// at öncesinde kapak açık durur; at anında kapak 0.28 snde hızla kapanır,
// dolap sarsılır, kapak kenarından toz kalkar ve çarpma çizgileri belirir.
// canvas y-aşağı; (0,0) dolap gövde merkezi.
export default {
  name: 'locker-slam', category: 'school-fx-2',
  desc: 'Okul dolabı: at anında kapak hızla kapanır, toz ve sarsıntı efekti olur',
  tags: ['dolap', 'okul dolabı', 'kapak', 'çarpma', 'locker', 'slam', 'door', 'okul', 'koridor', 'gürültü'],
  box: [-95, -118, 95, 118],
  bleed: 22,
  anchor: 'dolap gövde merkezi',
  points: { door: [72, 0], vent: [0, -45] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'kapak rengi' },
    at: { type: 'time', default: null, desc: 'kapağın çarpma anı (0.2 sn kapanma + sarsıntı)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;

    // kapak açıklığı a: 1 = tam açık, 0 = kapalı
    let a = 1 + 0.02 * Math.sin(t * 1.1);
    if (d >= 0) {
      if (d < 0.2) a = 1 - k.E.inCubic(k.prog(d, 0, 0.2));
      else if (d < 0.6) a = Math.max(0, 0.07 * Math.sin((d - 0.2) * 28) * Math.exp(-(d - 0.2) * 9));
      else a = 0;
    }
    const th = a * 1.35;   // menteşe açısı (rad)
    // kapak üzeri nokta: u = menteşeden uzaklık (0..1), v = yükseklik (0..1)
    const P = (u, v) => [-70 + u * 140 * Math.cos(th), -100 + v * 200 + u * 14 * Math.sin(th)];

    // çarpma sarsıntısı (kapak yerine oturunca başlar)
    if (d >= 0.2 && d < 0.7) ctx.translate(5 * Math.sin((d - 0.2) * 45) * Math.exp(-(d - 0.2) * 7), 0);

    // gövde
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-64, -94, 140, 200, 12); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-76, -106, 140, 200, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-70, -100, 140, 200, 10); ctx.fill();

    // iç karanlık + raf + kitap (kapak açıkken görünür)
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); k.rrect(-62, -92, 124, 184, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-56, -30); ctx.lineTo(56, -30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-56, 28); ctx.lineTo(56, 28); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-40, -62, 26, 30, 4); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-42, -64, 26, 30, 4); ctx.fill();

    // kapak (dörtgen, menteşe solda)
    const c00 = P(0, 0), c10 = P(1, 0), c11 = P(1, 1), c01 = P(0, 1);
    ctx.beginPath();
    ctx.moveTo(c00[0], c00[1]); ctx.lineTo(c10[0], c10[1]);
    ctx.lineTo(c11[0], c11[1]); ctx.lineTo(c01[0], c01[1]);
    ctx.closePath();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.save(); ctx.translate(6, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = k.rgba('bg', 0.55); ctx.stroke();
    // parlama (sol üst)
    const hl = P(0.22, 0.16);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hl[0], hl[1], 12, 26, 0.15, 0, k.TAU); ctx.fill();
    // havalandırma yarıkları
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const v of [0.3, 0.38, 0.46]) {
      const s0 = P(0.28, v), s1 = P(0.72, v);
      ctx.beginPath(); ctx.moveTo(s0[0], s0[1]); ctx.lineTo(s1[0], s1[1]); ctx.stroke();
    }
    // kulp
    const hp = P(0.87, 0.55);
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(hp[0] - 4, hp[1] - 13, 12, 28, 6); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); k.rrect(hp[0] - 6, hp[1] - 11, 12, 24, 6); ctx.fill();

    // çarpma efektleri (kapak yerine oturduğu anda)
    if (d >= 0.2 && d < 0.9) {
      const hd = d - 0.2;
      // toz: kapak alt kenarından kalkar
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 23 + 5), h2 = k.hash(i * 37 + 13);
        const dd = hd - h1 * 0.2;
        if (dd < 0 || dd > 0.5) continue;
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - dd / 0.5));
        ctx.beginPath();
        ctx.arc(28 + h1 * 44, 94 + dd * 20, 3 + h2 * 5 + dd * 9, 0, k.TAU);
        ctx.fill();
      }
      // çarpma çizgileri
      if (hd < 0.35) {
        ctx.strokeStyle = k.rgba('ink', 0.55 * (1 - hd / 0.35));
        ctx.lineWidth = 4; ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) {
          const ang = -0.9 + i * 0.45, L = 10 + (1 - hd / 0.35) * 16;
          ctx.beginPath();
          ctx.moveTo(76 + 8 * Math.cos(ang), 8 * Math.sin(ang));
          ctx.lineTo(76 + (8 + L) * Math.cos(ang), (8 + L) * Math.sin(ang));
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  },
};
