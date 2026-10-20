// construction-fx/crumble — tuğla duvar at anında çatlar; üst tuğlalar düşer, moloz ve toz savrulur.
// NOT: canvas y-aşağıdır; (0,100) duvar tabanıdır.
export default {
  name: 'crumble', category: 'construction-fx',
  desc: 'Brick wall that cracks and crumbles when at hits, with falling bricks, debris and dust',
  tags: ['yıkım', 'duvar', 'moloz', 'çatlak', 'enkaz', 'inşaat', 'crumble', 'wall', 'rubble', 'debris', 'collapse'],
  box: [-120, -110, 120, 120],
  bleed: 80,
  anchor: 'duvar tabanı (0,100)',
  points: { center: [0, 40], debris: [70, 110] },
  params: {
    at: { type: 'time', default: null, desc: 'duvarın çatlayıp dökülmeye başladığı an' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ol = k.rgba('bg', 0.55), OW = 5;

    function brick(x, y, w, h) {
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, 8); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.beginPath(); k.rrect(x, y, w, h, 8); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(x + w * 0.3, y + h * 0.3, w * 0.2, h * 0.16, -0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = ol; ctx.lineWidth = OW;
      ctx.beginPath(); k.rrect(x, y, w, h, 8); ctx.stroke();
    }

    // 1) alt sıra — yerinde kalır, boşta hafif titreme (idle tremor)
    const trem = k.noise1(t * 6) * 1.2;
    ctx.save(); ctx.translate(trem, k.noise1(t * 6 + 9) * 1.2);
    brick(-90, 56, 56, 40); brick(-30, 56, 56, 40); brick(30, 56, 56, 40);
    // 2) üst sıra — at anında düşer
    const top = [[-90, 12], [-30, 12], [30, 12]];
    for (let i = 0; i < top.length; i++) {
      const [bx, by] = top[i];
      const g = d < 0 ? 0 : k.prog(d, i * 0.08, 1.0);
      if (g <= 0) { brick(bx, by, 56, 40); continue; }
      const fy = 95 * g * g, fx = (k.hash(i * 7 + 2) - 0.5) * 70 * g;
      ctx.save(); ctx.translate(bx + 28 + fx, by + 20 + fy); ctx.rotate((k.hash(i * 9 + 4) - 0.5) * 2.2 * g);
      ctx.globalAlpha = 1 - g * 0.15;
      brick(-28, -20, 56, 40);
      ctx.restore();
    }
    ctx.restore();

    if (d >= 0 && d < 1.5) {
      // 3) çatlak çizgileri — duvar boyunca jagged çizgi
      const cf = Math.min(d / 0.25, 1);
      ctx.strokeStyle = k.rgba('ink', 0.8 * cf); ctx.lineWidth = 4;
      ctx.beginPath();
      let cxp = -8, cyp = 4;
      ctx.moveTo(cxp, cyp);
      for (let i = 1; i <= 6; i++) {
        cxp += (k.hash(i * 3 + 1) - 0.5) * 26; cyp += 15;
        ctx.lineTo(cxp, cyp);
      }
      ctx.stroke();
      // 4) moloz parçaları — yerçekimiyle düşer (0–1.2 sn)
      const dd = Math.min(d / 1.2, 1);
      for (let i = 0; i < 8; i++) {
        const a = k.hash(i * 5 + 6) * k.TAU;
        const sp = 30 + k.hash(i * 7 + 8) * 70;
        const x = Math.cos(a) * sp * dd + (k.hash(i * 11 + 9) - 0.5) * 40 * dd;
        const y = 40 + Math.sin(a) * sp * dd * 0.5 + 110 * dd * dd;
        const sz = (5 + k.hash(i * 13 + 10) * 8);
        ctx.save(); ctx.translate(x, y); ctx.rotate(a + d * (3 + k.hash(i * 17 + 11) * 4));
        ctx.fillStyle = k.rgba('dim', 0.9 * (1 - dd * 0.6));
        ctx.beginPath(); k.rrect(-sz / 2, -sz / 3, sz, sz * 0.66, 3); ctx.fill();
        ctx.restore();
      }
      // 5) toz bulutları — yükselir ve dağılır
      for (let i = 0; i < 5; i++) {
        const g = k.prog(d, 0.1 + i * 0.07, 1.4);
        if (g <= 0) continue;
        ctx.fillStyle = k.rgba('dim', 0.4 * (1 - g));
        ctx.beginPath();
        ctx.arc(-50 + k.hash(i * 19 + 12) * 100, 60 - g * 80, 10 + g * 22, 0, k.TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  },
};
