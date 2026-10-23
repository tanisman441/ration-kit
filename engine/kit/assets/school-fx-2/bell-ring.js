// school-fx-2/bell-ring — duvara monte klasik okul zili:
// at anında zil sönümlü salınır (~1.2 sn), tokmak karşı fazda vurur ve
// ağızdan ses dalgaları yayılır; idle'da hafif salınım.
// canvas y-aşağı; (0,0) duvar kaidesi merkezi.
export default {
  name: 'bell-ring', category: 'school-fx-2',
  desc: 'Duvar tipi okul zili: at anında sallanır, tokmak vurur, ses dalgaları yayılır',
  tags: ['zil', 'okul zili', 'teneffüs', 'ders zili', 'çan', 'bell', 'school bell', 'ring', 'alarm', 'çalma'],
  box: [-115, -105, 115, 110],
  bleed: 40,
  anchor: 'duvar kaidesi merkezi',
  points: { mount: [-86, -10], mouth: [10, 62] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'zil gövde rengi' },
    at: { type: 'time', default: null, desc: 'çalma anı — salınım + ses dalgaları (~1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const ringing = d >= 0 && d < 1.6;

    // salınım: çalarken sönümlü güçlü, idle'da hafif
    const swing = ringing
      ? 0.38 * Math.exp(-2.4 * d) * Math.sin(d * 22)
      : 0.045 * Math.sin(t * 1.3);

    // duvar kaidesi (sabit)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-94, -46, 32, 84, 12); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-102, -52, 32, 84, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-98, -48, 32, 84, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -34, 6, 16, 0.15, 0, k.TAU); ctx.fill();

    // kol: kaideden pivot noktasına
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 17; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-70, -30); ctx.lineTo(10, -30); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-70, -30); ctx.lineTo(10, -30); ctx.stroke();

    // zil gövdesi (pivot etrafında döner)
    ctx.save();
    ctx.translate(10, -30); ctx.rotate(swing);

    // askı çubuğu
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 20); ctx.stroke();

    // kubbe
    ctx.beginPath();
    ctx.moveTo(-46, 80);
    ctx.lineTo(-31, 32);
    ctx.quadraticCurveTo(-16, 18, 0, 18);
    ctx.quadraticCurveTo(16, 18, 31, 32);
    ctx.lineTo(46, 80);
    ctx.ellipse(0, 80, 46, 11, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.save(); ctx.translate(6, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = k.rgba('bg', 0.55); ctx.stroke();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, 38, 15, 9, -0.3, 0, k.TAU); ctx.fill();
    // ağız iç çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 80, 46, 11, 0, 0, Math.PI); ctx.stroke();

    // tokmak: zile karşı fazda sallanır
    const rel = -2.1 * swing;
    const bx = 44 * Math.sin(rel), by = 26 + 44 * Math.cos(rel);
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 24); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(bx + 2, by + 3, 11, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.arc(bx, by, 10, 0, k.TAU); ctx.fill();
    ctx.restore();

    // pivot vidası
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(10, -30, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); ctx.arc(10, -30, 6.5, 0, k.TAU); ctx.fill();

    // ses dalgaları: ağızdan aşağı doğru genişleyen 3 halka
    if (ringing && d < 1.1) {
      const mx = 10 - 91 * Math.sin(swing), my = -30 + 91 * Math.cos(swing);
      for (let i = 0; i < 3; i++) {
        const dd = d - i * 0.13;
        if (dd < 0 || dd > 1.0) continue;
        const r = 20 + (dd / 1.0) * 56;
        ctx.strokeStyle = k.rgba(p.color, 0.65 * (1 - dd / 1.0));
        ctx.lineWidth = 7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(mx, my, r, 0.35, Math.PI - 0.35); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
