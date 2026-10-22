// robot-fx/laser-scan — yatay tarama lazeri ve taranan nesne. Contract: engine/kit/ASSETS.md
export default {
  name: 'laser-scan', category: 'robot-fx',
  desc: 'Tarama ünitesinden çıkan kırmızı lazer çizgisi nesneyi yukarıdan aşağıya tarar',
  tags: ['lazer', 'tarama', 'scan', 'laser', 'scanner', 'kırmızı ışın', 'sensör', 'robot', 'okuma', 'tarayıcı'],
  box: [-190, -120, 190, 120],
  bleed: 30,
  anchor: 'tarama alanı merkezi (0,0)',
  points: { source: [-60, -56] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'tarama başlangıç anı; null ise sürekli tarama döngüsü' },
  },
  draw(ctx, t, p, k) {
    const bw = 380, LW = Math.round(bw * 0.03);
    const line = k.rgba('bg', 0.55), bodyC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    // tarama ilerlemesi: at anından 1.2 sn'lik geçiş; at null ise 2.4 sn'lik döngü
    const d = p.at == null ? -1 : t - p.at;
    let prog, beamA;
    if (d < 0) {
      if (p.at == null) { prog = (t % 2.4) / 2.4; beamA = 0.85; }
      else { prog = 0; beamA = 0; }
    } else {
      prog = k.clamp(d / 1.2, 0, 1);
      beamA = d > 1.7 ? k.clamp(1 - (d - 1.7) / 0.4, 0, 1) * 0.85 : 0.85;
    }

    // taranan nesne: sade küp (ön yüz + üst yüz)
    const ox = -30, oy = 26, os = 76;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(ox + 6, oy + 6, os, os, 10); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(ox - LW / 2, oy - LW / 2, os + LW, os + LW, 10 + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(ox, oy, os, os, 10); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.25);
    ctx.beginPath();
    ctx.moveTo(ox, oy); ctx.lineTo(ox + 22, oy - 22); ctx.lineTo(ox + os + 22, oy - 22);
    ctx.lineTo(ox + os + 22, oy); ctx.lineTo(ox + os, oy + 4); ctx.lineTo(ox, oy + 4);
    ctx.closePath(); ctx.fill();

    // lazer çizgisi + nesne üzerindeki tarama bandı
    const scanY = k.lerp(oy - 14, oy + os + 6, k.E.inOutCubic(prog));
    if (beamA > 0) {
      k.glow(0, scanY, 26, 'red', 0.35 * beamA);
      ctx.strokeStyle = k.rgba('red', beamA); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-186, scanY); ctx.lineTo(186, scanY); ctx.stroke();
      // tarama bandı: nesne üzerinde parlayan yatay bant
      const bandY = k.clamp(scanY, oy - 8, oy + os + 2);
      ctx.fillStyle = k.rgba('red', 0.30 * beamA);
      ctx.beginPath(); k.rrect(ox - 8, bandY - 9, os + 16, 18, 6); ctx.fill();
      ctx.fillStyle = k.rgba('red', 0.5 * beamA);
      ctx.beginPath(); k.rrect(ox - 8, bandY - 2.5, os + 16, 5, 2.5); ctx.fill();
    }

    // tarama ünitesi: sol üstte gövde + scanY'yi takip eden tarama başlığı
    const ex = -150, ey = -84, ew = 74, eh = 56;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(ex + 6, ey + 6, ew, eh, 12); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(ex - LW / 2, ey - LW / 2, ew + LW, eh + LW, 12 + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(ex, ey, ew, eh, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(ex + ew * 0.34, ey + 11, ew * 0.26, 8, -0.2, 0, k.TAU); ctx.fill();
    const aim = k.clamp((scanY - ey) / 140, -0.5, 0.6);
    ctx.save();
    ctx.translate(ex + ew - 6, ey + eh / 2); ctx.rotate(aim * 0.5);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-4, -13, 34, 26, 8); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(-4, -9, 30, 18, 6); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.25 + 0.75 * beamA);
    ctx.beginPath(); ctx.arc(22, 0, 7, 0, k.TAU); ctx.fill();
    if (beamA > 0) k.glow(22, 0, 14, 'red', 0.4 * beamA);
    ctx.restore();

    ctx.restore();
  },
};
