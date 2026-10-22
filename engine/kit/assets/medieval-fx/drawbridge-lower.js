// medieval-fx/drawbridge-lower — kale kapısı, yandan cephe: at anında asma köprü
// 90°→0° iner (kapalıyken kapıyı örter, açılınca hendek üstüne yatar).
// Boşta kule flaması dalgalanır, hendek suyu dalgalanır, parmaklık titrer;
// olayda (1.4 sn) köprü yumuşakça iner, zincirler gerilir, inişte toz kalkar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = zemin, menteşe (0,-34).
export default {
  name: 'drawbridge-lower', category: 'medieval-fx',
  desc: 'Kale kapısında asma köprü; at anında 90° dikeyden hendek üstüne yataya iner',
  tags: ['asma köprü', 'kale', 'kapı', 'zincir', 'hendek', 'kuşatma', 'ortaçağ', 'drawbridge', 'castle', 'moat', 'medieval'],
  box: [-235, -250, 235, 15],
  bleed: 60,
  anchor: 'zemin (0,0); köprü menteşesi (0,-34)',
  points: { hinge: [0, -34], gate: [0, -120], moat: [115, -45] },
  params: {
    at: { type: 'time', default: null, desc: 'köprü indirme anı (1.4 sn: 90°→0° + toz)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const stone = k.rgba('dim', 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const d = p.at == null ? -1 : t - p.at;
    const lowering = d >= 0 && d < 1.4;
    // köprü açısı: π/2 (dikey, kapalı) → 0 (yatay, açık)
    let ang = Math.PI / 2;
    if (lowering) {
      const g = k.prog(d, 0, 1.2);
      ang = (Math.PI / 2) * (1 - (g < 0.5 ? 2 * g * g : 1 - Math.pow(-2 * g + 2, 2) / 2));
    } else if (d >= 1.2) ang = 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    ctx.beginPath(); ctx.rect(-295, -310, 590, 360); ctx.clip();

    // zemin şeridi
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-295, -14, 590, 30, 8); ctx.fill();
    ctx.fillStyle = stone; ctx.beginPath(); k.rrect(-291, -16, 582, 26, 8); ctx.fill();

    // hendek: x∈[30,150], su (cyan) + dalga çizgileri (idle)
    ctx.fillStyle = k.rgba('cyan', 0.35);
    ctx.beginPath(); k.rrect(30, -58, 120, 66, 10); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.25);
    ctx.beginPath(); k.rrect(30, -40, 120, 48, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const wy = -48 + i * 13;
      const wph = k.noise1(t * 1.7 + i * 2.2) * 8;
      ctx.beginPath(); ctx.moveTo(44 + wph, wy);
      ctx.quadraticCurveTo(90, wy + 5, 136 + wph, wy); ctx.stroke();
    }
    // hendek taş kenarları
    for (const ex of [30, 150]) {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(ex - 9 - LW / 2, -62 - LW / 2, 18 + LW, 52 + LW, 6); ctx.fill();
      ctx.fillStyle = stone; ctx.beginPath(); k.rrect(ex - 9, -62, 18, 52, 6); ctx.fill();
    }

    // kale: kule (sol) + duvar
    const towerCX = -175;
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(towerCX - 58 - LW / 2, -230 - LW / 2, 116 + LW, 234 + LW, 10); ctx.fill();
    ctx.fillStyle = stone; ctx.beginPath(); k.rrect(towerCX - 58, -230, 116, 234, 10); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const bx = towerCX - 52 + i * 30;
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(bx - LW / 2, -256 - LW / 2, 26 + LW, 30 + LW, 6); ctx.fill();
      ctx.fillStyle = stone; ctx.beginPath(); k.rrect(bx, -256, 26, 30, 6); ctx.fill();
    }
    // duvar
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-117 - LW / 2, -150 - LW / 2, 192 + LW, 154 + LW, 8); ctx.fill();
    ctx.fillStyle = stone; ctx.beginPath(); k.rrect(-117, -150, 192, 154, 8); ctx.fill();
    // taş derzleri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath(); ctx.moveTo(-110, -112 + i * 52); ctx.lineTo(68, -112 + i * 52); ctx.stroke();
    }
    // sağ alt gölge + sol üst parlama (kule)
    ctx.save();
    ctx.beginPath(); k.rrect(towerCX - 58, -230, 116, 234, 10); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12); ctx.fillRect(towerCX + 10, -230, 48, 234);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(towerCX - 34, -212, 20, 12, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // kapı kemeri (karanlık iç) + parmaklık (idle titrer)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-46 - LW / 2, -150 - LW / 2, 92 + LW, 120 + LW, 30); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.85); ctx.beginPath(); k.rrect(-46, -150, 92, 120, 30); ctx.fill();
    const rattle = k.noise1(t * 3.1) * 1.5;
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 6;
    for (let i = 0; i < 5; i++) {
      const px = -32 + i * 16 + rattle * (i % 2 ? 1 : -1);
      ctx.beginPath(); ctx.moveTo(px, -142); ctx.lineTo(px, -44); ctx.stroke();
    }

    // kule flaması (idle dalgalanma)
    const fw = k.noise1(t * 4.2) * 7, fw2 = k.noise1(t * 4.2 + 2.1) * 7;
    ctx.strokeStyle = line; ctx.lineWidth = 5 + LW;
    ctx.beginPath(); ctx.moveTo(towerCX, -256); ctx.lineTo(towerCX, -296); ctx.stroke();
    ctx.strokeStyle = dark; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(towerCX, -256); ctx.lineTo(towerCX, -296); ctx.stroke();
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath();
    ctx.moveTo(towerCX, -296);
    ctx.quadraticCurveTo(towerCX + 28, -288 + fw * 0.5, towerCX + 50, -280 + fw);
    ctx.quadraticCurveTo(towerCX + 28, -274 + fw2 * 0.4, towerCX, -268);
    ctx.closePath(); ctx.fill();

    // asma köprü: menteşe (0,-34) etrafında, boy 190
    const BL = 190, BW = 92;
    const tipX = Math.cos(ang) * BL, tipY = -34 - Math.sin(ang) * BL;
    ctx.save();
    ctx.translate(0, -34); ctx.rotate(-Math.PI / 2 - ang);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-BW / 2 - LW / 2, -LW / 2, BW + LW, BL + LW, 10); ctx.fill();
    ctx.fillStyle = stone; ctx.beginPath(); k.rrect(-BW / 2, 0, BW, BL, 10); ctx.fill();
    // tahta derzleri (ink ince)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 1; i < 6; i++) {
      const dy = (i / 6) * BL;
      ctx.beginPath(); ctx.moveTo(-BW / 2 + 4, dy); ctx.lineTo(BW / 2 - 4, dy); ctx.stroke();
    }
    // metal şeritler
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); k.rrect(-BW / 2, BL * 0.3, BW, 10, 5); ctx.fill();
    ctx.beginPath(); k.rrect(-BW / 2, BL * 0.68, BW, 10, 5); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-BW / 4, 30, 18, 10, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
    // menteşe göbekleri
    for (const hx of [-BW / 2, BW / 2]) {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(hx, -34, 10 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(hx, -34, 10, 0, k.TAU); ctx.fill();
    }

    // zincirler: kapı üstü (±52,-148) → köprü uç köşeleri (ink serbest çizgi)
    for (const sgn of [-1, 1]) {
      const ax = sgn * 52, ay = -148;
      const ex = tipX + sgn * (BW / 2 - 6), ey = tipY;
      const slack = lowering ? 10 * Math.sin((d / 1.2) * Math.PI) : 0;
      const mx = (ax + ex) / 2, my = (ay + ey) / 2 + 12 + slack;
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
      for (let i = 1; i < 6; i++) {
        const gg = i / 6;
        const qx = (1 - gg) * (1 - gg) * ax + 2 * (1 - gg) * gg * mx + gg * gg * ex;
        const qy = (1 - gg) * (1 - gg) * ay + 2 * (1 - gg) * gg * my + gg * gg * ey;
        ctx.fillStyle = k.rgba('ink', 0.75);
        ctx.beginPath(); ctx.arc(qx, qy, 4.5, 0, k.TAU); ctx.fill();
      }
    }

    // iniş tozu: köprü ucu karşı kıyıya değince (1.15–1.7 sn)
    if (d >= 1.15 && d < 1.7) {
      const g = k.prog(d, 1.15, 1.7), al = 1 - g;
      for (let i = 0; i < 7; i++) {
        const px = tipX - 40 + k.hash(i * 7 + 3) * 100 + g * (k.hash(i * 11 + 4) - 0.5) * 70;
        ctx.fillStyle = k.rgba('dim', 0.5 * al);
        ctx.beginPath(); ctx.arc(px, -6 - g * 24, 7 + g * 10, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
