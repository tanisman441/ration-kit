// celebration-fx/trophy-glow — kupa + parlama: 2.5 sn periyotlu parlama nabzı
// (glow alfa ≤ 0.5) ve etrafta yanıp sönen yıldız parıltıları.
// NOT: canvas y-aşağıdır; (0,0) kupa gövde merkezidir.
export default {
  name: 'trophy-glow', category: 'celebration-fx',
  desc: 'Parlayan kupa: nabız gibi atan ışıltı ve yıldız parıltılarıyla kutlama kupası',
  tags: ['kupa', 'ödül', 'şampiyon', 'birincilik', 'parlama', 'zafer', 'trophy', 'award', 'champion', 'winner', 'glow', 'celebration'],
  box: [-95, -135, 95, 135],
  bleed: 40,
  anchor: 'kupa gövde merkezi (0,0)',
  points: { top: [0, -100], base: [0, 118] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'kupa rengi (tek vurgu rengi)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5.5;
    const line = k.rgba('bg', 0.55);
    // idle animasyon: 2.5 sn periyotlu parlama nabzı
    const pulse = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI / 2.5);
    const glowA = 0.26 + 0.16 * pulse;               // ≤ 0.5
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // arka ışıltı
    k.glow(0, -30, 110 + 14 * pulse, p.color, glowA);

    // sap + kaide
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-13 - LW / 2, -38 - LW / 2, 26 + LW, 52 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-13, -38, 26, 52, 10); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-46 - LW / 2, 12 - LW / 2, 92 + LW, 24 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-46, 12, 92, 24, 10); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-58 - LW / 2, 34 - LW / 2, 116 + LW, 26 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-58, 34, 116, 26, 10); ctx.fill();

    // kulplar: iki yanda simetrik yay
    ctx.strokeStyle = line;
    ctx.lineWidth = LW + 5;
    ctx.beginPath(); ctx.arc(52, -62, 27, -1.25, 1.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(-52, -62, 27, Math.PI - 1.25, Math.PI + 1.25); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color);
    ctx.lineWidth = LW;
    ctx.beginPath(); ctx.arc(52, -62, 27, -1.25, 1.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(-52, -62, 27, Math.PI - 1.25, Math.PI + 1.25); ctx.stroke();

    // kâse
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-56 - LW / 2, -112 - LW / 2, 112 + LW, 82 + LW, 22); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-56, -112, 112, 82, 22); ctx.fill();
    // sağ alt gölge: %12 koyultma
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-6, -64, 62, 34, 16); ctx.fill();
    // ağız: içbükey koyu elips
    ctx.fillStyle = k.rgba('bg', 0.45);
    ctx.beginPath(); ctx.ellipse(0, -108, 44, 13, 0, 0, k.TAU); ctx.fill();
    // premium parlama: sol üst, beyaz alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, -84, 16, 26, -0.3, 0, k.TAU); ctx.fill();

    // yıldız parıltıları: hash dağılımlı, sırayla yanıp söner
    for (let i = 0; i < 6; i++) {
      const h1 = k.hash(i * 7 + 501), h2 = k.hash(i * 13 + 517), h3 = k.hash(i * 29 + 541);
      const tw = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI / (1.8 + h2) + h3 * k.TAU);
      if (tw < 0.25) continue;
      const x = -80 + h1 * 160, y = -120 + h2 * 210;
      const r = 6 + h3 * 9;
      const rot = t * (0.6 + h1) + h2 * k.TAU;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = k.rgba(p.color, tw * 0.85);
      ctx.beginPath();
      for (let s2 = 0; s2 < 4; s2++) {
        const a = s2 * Math.PI / 2;
        if (s2 === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        const b = a + Math.PI / 4;
        ctx.lineTo(Math.cos(b) * r * 0.22, Math.sin(b) * r * 0.22);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
};
