// vehicle-arrival/train-pass — tren, yandan: sağdan sola SÜREKLİ geçiş
// (canlı idle döngü). Tekerlekler döner, ön far yanar, vagonlar hafif sallanır.
// (0,0) = raylar. Contract: engine/kit/ASSETS.md — canvas y-aşağı, saf draw.
export default {
  name: 'train-pass', category: 'vehicle-arrival',
  desc: 'Yandan 3 vagonlu tren; sağdan sola sürekli geçer, tekerlekler döner, far yanar',
  tags: ['tren', 'geçiş', 'ray', 'vagon', 'demiryolu', 'ulaşım', 'train', 'passing', 'railway', 'wagon', 'transport'],
  box: [-330, -160, 330, 50],
  bleed: 90,
  anchor: 'zemin (0,0); raylar',
  points: { rail: [0, 0] },
  params: {
    speed: { type: 'number', default: 300, desc: 'geçiş hızı (birim/sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const car = k.rgba(p.color, 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const CARW = 196, GAP = 16, N = 3;
    const TRAINW = N * CARW + (N - 1) * GAP;
    const L = 660 + TRAINW + 160; // bir tam döngü mesafesi
    const dist = (t * p.speed) % L;
    const frontX = 330 + 80 - dist; // ön (sol uç) konumu: sağdan girer sola çıkar

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();
    ctx.beginPath(); ctx.rect(-420, -250, 840, 340); ctx.clip(); // box+bleed

    // raylar + traversler (sabit)
    ctx.fillStyle = k.rgba('bg', 0.3);
    for (let i = 0; i < 22; i++) {
      const sx = -420 + i * 40;
      ctx.beginPath(); k.rrect(sx, -4, 24, 12, 3); ctx.fill();
    }
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-420, -18, 840, 8, 4); ctx.fill();
    ctx.beginPath(); k.rrect(-420, 6, 840, 8, 4); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.beginPath(); k.rrect(-420, -16, 840, 5, 2); ctx.fill();
    ctx.beginPath(); k.rrect(-420, 8, 840, 5, 2); ctx.fill();

    for (let c = 0; c < N; c++) {
      const cx = frontX + c * (CARW + GAP); // vagon sol kenarı (ön vagon c=0, solda)
      const bobY = k.noise1(t * 3.1 + c * 5.7) * 2.2;
      const isFront = c === 0;
      ctx.save();
      ctx.translate(cx, bobY);

      // gövde
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-LW / 2, -136 - LW / 2, CARW + LW, 104 + LW, 16); ctx.fill();
      ctx.fillStyle = car; ctx.beginPath(); k.rrect(0, -136, CARW, 104, 16); ctx.fill();
      ctx.save();
      ctx.beginPath(); k.rrect(0, -136, CARW, 104, 16); ctx.clip();
      ctx.fillStyle = k.rgba('bg', 0.12); ctx.fillRect(CARW / 2 - 30, -136, 120, 104);
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(CARW / 4, -122, 34, 12, -0.35, 0, k.TAU); ctx.fill();
      ctx.restore();
      // ön vagon burnu (sol uç eğik)
      if (isFront) {
        ctx.fillStyle = line; ctx.beginPath(); k.rrect(-34 - LW / 2, -136 - LW / 2, 40 + LW, 104 + LW, 14); ctx.fill();
        ctx.fillStyle = car; ctx.beginPath(); k.rrect(-34, -136, 40, 104, 14); ctx.fill();
      }
      // cam bandı
      ctx.fillStyle = k.rgba('ink', 0.72);
      ctx.beginPath(); k.rrect(10, -126, CARW - 20, 34, 8); ctx.fill();
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = k.rgba('bg', 0.5);
        ctx.fillRect(22 + i * 46, -126, 5, 34);
      }
      // vurgu şeridi (tek vurgu: accent)
      ctx.fillStyle = k.rgba('accent', 0.95);
      ctx.beginPath(); k.rrect(0, -72, CARW, 12, 6); ctx.fill();
      // kapı çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
      for (const dx of [CARW / 2 - 14, CARW / 2 + 14]) {
        ctx.beginPath(); ctx.moveTo(dx, -66); ctx.lineTo(dx, -32); ctx.stroke();
      }
      // pantograf (orta vagonda, havada ince ink çizgiler)
      if (c === 1) {
        ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(CARW / 2 - 44, -136); ctx.lineTo(CARW / 2 - 14, -178);
        ctx.lineTo(CARW / 2 + 14, -178); ctx.lineTo(CARW / 2 + 44, -136);
        ctx.stroke();
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(CARW / 2 - 30, -178); ctx.lineTo(CARW / 2 + 30, -178); ctx.stroke();
      }

      // tekerlekler: dönüş kat edilen yola bağlı
      const wheelA = dist / 15;
      for (const wx of [34, CARW - 34]) {
        ctx.fillStyle = line; ctx.beginPath(); ctx.arc(wx, -16, 16 + LW / 2, 0, k.TAU); ctx.fill();
        ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(wx, -16, 16, 0, k.TAU); ctx.fill();
        ctx.save();
        ctx.translate(wx, -16); ctx.rotate(wheelA);
        ctx.strokeStyle = k.rgba('panel2', 1); ctx.lineWidth = 5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(i * k.TAU / 3) * 11, Math.sin(i * k.TAU / 3) * 11); ctx.stroke();
        }
        ctx.restore();
      }
      // ön far + ışık hüzmesi (sadece ön vagonda)
      if (isFront) {
        ctx.fillStyle = k.rgba('yellow', 0.9);
        ctx.beginPath(); ctx.arc(-34, -84, 9, 0, k.TAU); ctx.fill();
        k.glow(-34, -84, 30, 'yellow', 0.4);
        ctx.fillStyle = k.rgba('yellow', 0.10);
        ctx.beginPath();
        ctx.moveTo(-34, -84); ctx.lineTo(-190, -130); ctx.lineTo(-190, -40);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    // hız çizgileri (tren kutudayken, gövde arkalarında)
    const trainVisible = frontX < 330 && frontX + TRAINW > -330;
    if (trainVisible) {
      ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        const hy = -120 + i * 20 + k.noise1(t * 5 + i) * 4;
        const hx = frontX + TRAINW + 20 + k.hash(i * 7 + 1) * 120;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 60, hy); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
