// medical-emergency/defibrillator-shock — şok anında kıvılcım çakan defibrilatör paletleri + sıçrayan gövde.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'defibrillator-shock', category: 'medical-emergency',
  desc: 'Sol yanda defibrilatör ünitesi, göğüste iki palet; at anında yıldırım kıvılcımı ve gövde sıçraması',
  tags: ['defibrilatör', 'şok', 'elektroşok', 'kalp', 'acil', 'defibrillator', 'shock', 'cardiac', 'emergency', 'cpr', 'resuscitation', 'medical'],
  box: [-120, -85, 120, 85],
  bleed: 40,
  anchor: 'hastanın gövde merkezi',
  points: { unitTop: [-96, -58], paddleLeft: [-30, -20], paddleRight: [26, -20], chest: [0, -24] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'şok anı: 0.15 sn yıldırım kıvılcımı + 0.7 sn gövde sıçraması (0.2–1.5 sn arası)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), lw = 6;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const shock = d >= 0 && d < 0.15;
    const jolt = d >= 0 && d < 0.7 ? Math.exp(-d * 6) : 0;
    const lift = -18 * jolt;               // gövde yukarı sıçrar
    const idlePulse = 0.5 + 0.5 * Math.sin(t * 2.4);

    // defibrilatör ünitesi + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-116 + 6, -64 + 6, 52, 76, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-116, -64, 52, 76, 12); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-104, -48, 14, 7, -0.5, 0, k.TAU); ctx.fill();
    // ekran: EKG çizgisi (şokta spike)
    ctx.fillStyle = k.rgba('ink');
    k.rrect(-108, -54, 36, 24, 6); ctx.fill();
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -106; x <= -74; x += 3) {
      let y = -42;
      if (shock) y -= 12 * Math.sin((x + 106) / 32 * Math.PI); // şok spike'ı
      else if ((x + 106) % 22 < 6) y -= ((x + 106) % 22) < 3 ? 4 : -4; // nabız izi
      x <= -106 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // ünite düğmesi (hazır ışığı nabızlanır)
    ctx.fillStyle = k.rgba(p.color, 0.4 + 0.6 * idlePulse);
    ctx.beginPath(); ctx.arc(-90, -14, 6, 0, k.TAU); ctx.fill();

    // hasta gövdesi (yatay): torso + baş
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-52 + 6, -44 + 6 + lift, 120, 44, 20); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-52, -44 + lift, 120, 44, 20); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(88, -22 + lift, 20, 0, k.TAU);
    ctx.fillStyle = k.rgba('dim'); ctx.fill(); ctx.stroke();
    // parlama (torso)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, -34 + lift, 24, 8, -0.5, 0, k.TAU); ctx.fill();
    // battaniye çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-52, -20 + lift); ctx.lineTo(68, -20 + lift); ctx.stroke();

    // kablo (serbest çizgi: ink ile)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-80, 0); ctx.quadraticCurveTo(-70, -16, -40, -22 + lift); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-80, 0); ctx.quadraticCurveTo(-50, -8, 16, -22 + lift); ctx.stroke();

    // paletler (göğüste iki disk)
    for (const px of [-30, 26]) {
      ctx.fillStyle = k.rgba('panel');
      ctx.strokeStyle = line; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.arc(px, -28 + lift, 14, 0, k.TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = k.rgba(p.color, 0.85);
      ctx.beginPath(); ctx.arc(px, -28 + lift, 6, 0, k.TAU); ctx.fill();
    }

    // şok: yıldırım kıvılcımı + glow
    if (shock) {
      const glowA = 0.5 * (1 - d / 0.15);
      k.glow(-2, -28, 70, p.color, glowA);
      ctx.strokeStyle = k.rgba('yellow'); ctx.lineWidth = 6;
      ctx.beginPath();
      const zig = [[-44, -28], [-30, -44], [-16, -22], [-2, -40], [12, -22], [26, -38], [40, -28]];
      zig.forEach(([zx, zy], i) => { i ? ctx.lineTo(zx, zy + lift) : ctx.moveTo(zx, zy + lift); });
      ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 3;
      ctx.stroke();
    }
    // şok sonrası solan ışık (0.5 sn)
    if (d >= 0.15 && d < 0.6) k.glow(-2, -28, 50, p.color, 0.3 * (1 - d / 0.6));

    ctx.restore();
  },
};
