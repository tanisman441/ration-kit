// kitchen-fx/stir — tencerede kaşıkla karıştırma; stir anında hızlı karıştırma patlaması + sıçrama.
// NOT: canvas y-aşağıdır; kaşık tencerenin içinde eliptik yörüngede döner (yandan görünüm).
export default {
  name: 'stir', category: 'kitchen-fx',
  desc: 'Tencere içinde dairesel dönen kaşık ve sıvı yüzeyinde girdap; stir anında hızlı karıştırma ve damla sıçraması',
  tags: ['karıştırma', 'tencere', 'kaşık', 'çorba', 'girdap', 'stir', 'mixing', 'pot', 'spoon', 'swirl', 'soup'],
  box: [-165, -140, 165, 120],
  bleed: 44,
  anchor: 'tencere merkezi (0,20)',
  points: { pot: [0, 50], spoon_tip: [0, -24], swirl: [56, -33], handle: [120, -120] },
  params: {
    stir: { type: 'time', default: null, desc: 'hızlı karıştırma patlaması anı (1 sn): kaşık hızlanır, damlalar sıçrar' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.stir == null ? -1 : t - p.stir;
    const bursting = d >= 0 && d <= 1.0;

    // kaşık açısı: idle'da yavaş (2.8 sn tur), burst'te hızlanır
    const burstPhase = bursting ? d * k.TAU * 2.5 : 0;
    const ang = t * (k.TAU / 2.8) + burstPhase;
    const sx = Math.cos(ang) * 58;
    const sy = -22 + Math.sin(ang) * 16;

    // --- 1) tencere gövdesi + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-104, -24, 220, 112, 16); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-110, -30, 220, 112, 16); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // kenar (rim)
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-112, -36, 236, 22, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    k.rrect(-118, -42, 236, 22, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-76, -2, 40, 26, -0.35, 0, k.TAU); ctx.fill();

    // --- 2) sıvı yüzeyi (elips)
    ctx.fillStyle = k.rgba('bg', 0.4);
    ctx.beginPath(); ctx.ellipse(0, -31, 100, 15, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.85);
    ctx.beginPath(); ctx.ellipse(0, -33, 96, 13, 0, 0, k.TAU); ctx.fill();

    // --- 3) girdap yayları (dönüş yönünde kayan kesikli yaylar)
    for (let i = 0; i < 3; i++) {
      const rx = 26 + i * 24, ry = 5 + i * 3.4;
      const off = ang * (1 - i * 0.12);
      ctx.strokeStyle = k.rgba('ink', 0.4);
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, -33, rx, ry, 0, off, off + Math.PI * 1.2);
      ctx.stroke();
    }

    // --- 4) kaşık: sap (havadan sağ üste) + kepçe
    // kepçe konumu eliptik yörüngede; sap yukarı-sağa uzar
    const hx = sx + 90, hy = sy - 92;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.8);
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hx, hy); ctx.stroke();
    // kepçe (sıvının içinde)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(sx + 6, sy + 6, 20, 13, 0.3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.ellipse(sx, sy, 20, 13, 0.3, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4.5; ctx.stroke();
    // kepçede parlama
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(sx - 6, sy - 4, 8, 4.5, -0.4, 0, k.TAU); ctx.fill();

    // --- 5) idle: sıvı yüzeyinde kabarcıklar
    for (let i = 0; i < 5; i++) {
      const bx = -70 + k.hash(i * 5 + 1) * 140;
      const cyc = 1.6, ph = ((t + k.hash(i * 5 + 3) * cyc) % cyc) / cyc;
      const r = 1.5 + 3.5 * Math.sin(ph * Math.PI);
      ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - ph * 0.4));
      ctx.beginPath(); ctx.arc(bx, -33 - ph * 4, r, 0, k.TAU); ctx.fill();
    }

    // --- 5b) idle: hafif buhar (2 kıvrım, yükselen)
    for (let i = 0; i < 2; i++) {
      const cyc = 3.6, ph = ((t * 0.8 + i * 1.8) % cyc) / cyc;
      const wob = k.noise1(t * 1.4 + i * 7) * 10;
      const bx = -60 + i * 110 + wob;
      const alpha = 0.45 * Math.sin(ph * Math.PI);
      ctx.strokeStyle = k.rgba('ink', alpha);
      ctx.lineWidth = 6 * (1 - ph * 0.5);
      ctx.beginPath();
      ctx.moveTo(bx, -52);
      ctx.quadraticCurveTo(bx + wob - 12, -52 - ph * 44, bx + wob * 0.4, -52 - ph * 62);
      ctx.stroke();
    }

    // --- 6) stir olayı: damla sıçraması (1.0 sn)
    if (bursting) {
      const g = k.prog(d, 0, 1.0);
      for (let i = 0; i < 10; i++) {
        const ang2 = -Math.PI / 2 + (k.hash(i * 7 + 5) - 0.5) * 2.0;
        const sp = (50 + k.hash(i * 7 + 9) * 80) * k.E.outCubic(g);
        const px = sx + Math.cos(ang2) * sp;
        const py = sy + Math.sin(ang2) * sp + 140 * g * g;
        const r = 3 + k.hash(i * 7 + 11) * 3.5;
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
      }
      k.glow(sx, sy, 46, 'yellow', 0.35 * (1 - g));
    }
    ctx.restore();
  },
};
