// robot-fx/robot-eye-glow — parlayan göz paneline sahip robot kafası. Contract: engine/kit/ASSETS.md
export default {
  name: 'robot-eye-glow', category: 'robot-fx',
  desc: 'Parlayan göz vizörlü robot kafası; nabız ve tarama animasyonu, tehlike modunda gözler kırmızı',
  tags: ['robot kafası', 'robot gözü', 'vizör', 'robot head', 'eye', 'göz', 'parlama', 'glow', 'tehlike', 'danger', 'android'],
  box: [-130, -115, 130, 115],
  bleed: 24,
  anchor: 'kafa merkezi (0,0)',
  points: { top: [0, -78], panel: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    danger: { type: 'enum', values: ['off', 'on'], default: 'off', desc: 'tehlike modu: gözler kırmızıya döner' },
  },
  draw(ctx, t, p, k) {
    const bw = 260, LW = Math.round(bw * 0.03);
    const line = k.rgba('bg', 0.55), bodyC = k.rgba(p.color);
    const danger = p.danger === 'on';
    const eyeC = danger ? 'red' : 'cyan';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    // anten
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, -68); ctx.lineTo(0, -96); ctx.stroke();
    const ab = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * k.TAU / (danger ? 0.5 : 1.4)));
    k.glow(0, -100, 13, eyeC, 0.4 * ab);
    ctx.fillStyle = k.rgba(eyeC, ab);
    ctx.beginPath(); ctx.arc(0, -100, 7, 0, k.TAU); ctx.fill();

    // yan kulak diskleri
    for (const exx of [-92, 92]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(exx, 0, 20 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.arc(exx, 0, 20, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.6);
      ctx.beginPath(); ctx.arc(exx, 0, 9, 0, k.TAU); ctx.fill();
    }

    // kafa: dış hat + dolgu + gölge + sol üst parlama
    const hx = -78, hy = -68, hw = 156, hh = 136, hr = 36;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(hx + 6, hy + 6, hw, hh, hr); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(hx - LW / 2, hy - LW / 2, hw + LW, hh + LW, hr + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(hx, hy, hw, hh, hr); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx + hw * 0.32, hy + 22, hw * 0.26, 16, -0.2, 0, k.TAU); ctx.fill();

    // göz paneli: koyu vizör alanı
    const px = -58, py = -24, pw = 116, ph = 44, pr = 16;
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(px - LW / 2, py - LW / 2, pw + LW, ph + LW, pr + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(px, py, pw, ph, pr); ctx.fill();

    // göz nabzı: yumuşak parlama (tehlikede hızlı ve kırmızı)
    const period = danger ? 0.7 : 2.0;
    const pulse = 0.72 + 0.28 * Math.sin(t * k.TAU / period);
    k.glow(0, 0, 52, eyeC, 0.42 * pulse);
    // vizör ışığı
    ctx.fillStyle = k.rgba(eyeC, 0.28 * pulse);
    ctx.beginPath(); k.rrect(px + 6, py + 6, pw - 12, ph - 12, 12); ctx.fill();
    // iki göz merceği
    for (const exx of [-27, 27]) {
      k.glow(exx, 0, 20, eyeC, 0.45 * pulse);
      ctx.fillStyle = k.rgba(eyeC, 0.95 * pulse);
      ctx.beginPath(); k.rrect(exx - 15, -12, 30, 24, 12); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.arc(exx - 5, -5, 3.4, 0, k.TAU); ctx.fill();
    }
    // tarama noktası: tehlike kapalıyken vizörde gezer
    if (!danger) {
      const sx = k.lerp(px + 16, px + pw - 16, (t * 0.45) % 1);
      k.glow(sx, 0, 14, eyeC, 0.5);
      ctx.fillStyle = k.rgba(eyeC, 1);
      ctx.beginPath(); ctx.arc(sx, 0, 5, 0, k.TAU); ctx.fill();
    }

    // alt ızgara: konuşmacı çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const yy = 46 + i * 10;
      ctx.moveTo(-26, yy); ctx.lineTo(26, yy);
    }
    ctx.stroke();

    ctx.restore();
  },
};
