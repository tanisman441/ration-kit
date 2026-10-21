// factory-fx/weld-sparks — kaynak kıvılcımları.
// ANIMASYON: `at` anında kaynak başlar (1.25 sn): uçta yoğun parlama,
// sağa doğru yerçekimli kıvılcım konisi, yükselen duman. Idle'da uç hafifçe
// titrer ve ~2.6 sn'de bir tek kıvılcım patlar. Tek vurgu: yellow.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'weld-sparks',
  category: 'factory-fx',
  desc: 'Kaynak torcu; at anında yoğun kıvılcım konisi ve duman, idle’da tek tek patlar',
  tags: ['kaynak', 'kıvılcım', 'torç', 'fabrika', 'metal', 'duman', 'welding', 'sparks', 'torch', 'factory', 'metal', 'smoke'],
  box: [-120, -90, 120, 90],
  bleed: 45,
  anchor: 'torç ucu (30,10)',
  points: { tip: [30, 10], seam: [70, 10], handle: [-110, 4] },
  params: {
    at: { type: 'time', default: null, desc: 'kaynağın başlama anı (1.25 sn yoğun kıvılcım)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const TX = 30, TY = 10;
    const d = p.at == null ? -1 : t - p.at;
    const welding = d >= 0 && d < 1.25;
    ctx.lineCap = 'round';

    // --- iş parçası (dikey plaka) ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(70 + 6, -55 + 6, 22, 110, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(70, -55, 22, 110, 6); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(77, -45, 4, 12, 0.1, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(70, -55, 22, 110, 6); ctx.stroke();
    // kaynak dikişi
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(70, -48); ctx.lineTo(70, 48); ctx.stroke();
    if (welding) {
      const wg = k.prog(d, 0, 0.3) * (1 - k.prog(d, 0.95, 1.25));
      ctx.strokeStyle = k.rgba(p.color, 0.9 * wg); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(70, -48); ctx.lineTo(70, 48); ctx.stroke();
    }

    // --- torç gövdesi ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-110 + 6, -8 + 6, 58, 24, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-110, -8, 58, 24, 8); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-95, -1, 12, 5, -0.1, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-110, -8, 58, 24, 8); ctx.stroke();
    // boyun (uç doğru incelir)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath();
    ctx.moveTo(-52, -4); ctx.lineTo(TX - 8, TY - 5);
    ctx.lineTo(TX - 8, TY + 5); ctx.lineTo(-52, 12);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();

    // --- uç parıltısı ---
    const flick = 0.5 + 0.5 * k.noise1(t * 22);
    const glowA = welding ? 1 : 0.25 + 0.2 * flick;
    k.glow(TX, TY, welding ? 30 : 12, p.color, 0.5 * glowA);
    ctx.fillStyle = k.rgba(p.color, 0.9 * glowA);
    ctx.beginPath(); ctx.arc(TX, TY, welding ? 7 : 4, 0, k.TAU); ctx.fill();
    if (welding) {
      ctx.fillStyle = k.rgba('#ffffff', 0.95 * (1 - k.prog(d, 0, 0.2)));
      ctx.beginPath(); ctx.arc(TX, TY, 4, 0, k.TAU); ctx.fill();
    }

    // --- idle: ~2.6 sn'de bir tek kıvılcım ---
    if (!welding) {
      const cyc = (t % 2.6) / 2.6;
      if (cyc < 0.12) {
        const pp = cyc / 0.12;
        const ang = -0.5 + k.hash(3) * 1.0;
        const sx = TX + Math.cos(ang) * pp * 46;
        const sy = TY + Math.sin(ang) * pp * 46 + pp * pp * 30;
        k.glow(sx, sy, 9, p.color, 0.4 * (1 - pp));
        ctx.strokeStyle = k.rgba(p.color, 0.9 * (1 - pp));
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(TX, TY); ctx.lineTo(sx, sy); ctx.stroke();
      }
    }

    // --- kaynak: kıvılcım konisi ---
    if (welding) {
      const fl = 1 - k.prog(d, 0, 0.18);
      if (fl > 0) k.glow(TX, TY, 52, p.color, 0.5 * fl);
      for (let i = 0; i < 16; i++) {
        const start = k.hash(20 + i * 7) * 0.25;
        const tau = (d - start) / 0.75;
        if (tau <= 0 || tau >= 1) continue;
        const ang = -0.55 + k.hash(10 + i * 7) * 1.1;   // sağa açılan koni
        const dist = (0.25 + 0.75 * k.E.outCubic(tau)) * 95;
        const sx = TX + Math.cos(ang) * dist;
        const sy = TY + Math.sin(ang) * dist + tau * tau * 46; // yerçekimi
        const alpha = 1 - tau;
        const tw = 0.6 + 0.4 * k.noise1(t * 30 + i * 3);
        k.glow(sx, sy, 12, p.color, 0.45 * alpha * tw);
        ctx.strokeStyle = k.rgba(p.color, 0.95 * alpha * tw);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - Math.cos(ang) * (10 + tau * 14), sy - Math.sin(ang) * (10 + tau * 14) - tau * 8);
        ctx.stroke();
        ctx.fillStyle = k.rgba('#ffffff', 0.9 * alpha * tw);
        ctx.beginPath(); ctx.arc(sx, sy, 2.4, 0, k.TAU); ctx.fill();
      }
      // duman
      for (let i = 0; i < 4; i++) {
        const sp = k.prog(d, 0.15 + i * 0.25, 0.4 + i * 0.25 + 0.5);
        if (sp <= 0 || sp >= 1) continue;
        const dx = TX - 6 + (k.hash(i * 13 + 5) - 0.5) * 26 + sp * 18;
        const dy = TY - 18 - sp * 52;
        ctx.fillStyle = k.rgba('dim', 0.42 * (1 - sp));
        ctx.beginPath(); ctx.arc(dx, dy, 7 + sp * 10, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
