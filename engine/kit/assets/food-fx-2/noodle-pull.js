// food-fx-2/noodle-pull — çubuklarla kaldırılan noodle: idle'da iplikler sallanır, buhar yükselir; slurp anında noodle yukarı çekilir, gerilir ve geri sarkar.
// NOT: canvas y-aşağıdır; noodle yukarı (negatif y) kaldırılır.
export default {
  name: 'noodle-pull', category: 'food-fx-2',
  desc: 'Noodle çekme: çubuklardaki noodle yumağı boşta sallanır; slurp anında yukarı çekilip gerilir, sonra sarkarak yerine döner',
  tags: ['noodle', 'ramen', 'çubuk', 'makarna', 'yemek', 'noodles', 'ramen', 'chopsticks', 'slurp', 'asian food'],
  box: [-130, -200, 130, 155],
  bleed: 45,
  anchor: 'kase tabanı (0,125)',
  points: { bowl: [0, 95], chopsticks: [62, -140], noodles: [26, -40] },
  params: {
    slurp: { type: 'time', default: null, desc: 'çekme anı (1.2 sn): noodle yukarı çekilir, gerilir, sarkarak döner' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.slurp == null ? -1 : t - p.slurp;
    const slurping = d >= 0 && d <= 1.2;
    const g = slurping ? k.prog(d, 0, 1.2) : -1;

    // kaldırma eğrisi: hızlı çek (0–0.35), tut (0.35–0.6), sarkarak dön (0.6–1.2)
    const lift = slurping
      ? k.E.outCubic(k.prog(d, 0, 0.35)) - k.E.inOutCubic(k.prog(d, 0.6, 1.2))
      : 0;
    const clumpX = 26, clumpY = -84 - 54 * lift;
    const taut = k.clamp(lift, 0, 1); // 1 = gergin

    // --- 1) kase
    const bowlPath = () => {
      ctx.beginPath();
      ctx.moveTo(-95, 55);
      ctx.quadraticCurveTo(-92, 118, 0, 124);
      ctx.quadraticCurveTo(92, 118, 95, 55);
      ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); bowlPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    bowlPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // desen bandı (ink detay)
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-88, 92); ctx.quadraticCurveTo(0, 116, 88, 92); ctx.stroke();
    // ayak
    ctx.fillStyle = k.rgba('ink', 1);
    k.rrect(-30, 122, 60, 14, 7); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    // kase parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-58, 84, 12, 22, 0.2, 0, k.TAU); ctx.fill();
    // çorba yüzeyi
    ctx.fillStyle = k.rgba('yellow', 0.85);
    ctx.beginPath(); ctx.ellipse(0, 55, 80, 13, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    // yüzeydeki noodle kıvrımları (sabit desen)
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 6;
    for (let i = 0; i < 3; i++) {
      const nx = -40 + i * 40;
      ctx.beginPath(); ctx.arc(nx, 55, 12, 0.3, Math.PI - 0.3); ctx.stroke();
    }
    // yüzey dalgası (slurp'ta)
    if (slurping) {
      const wr = (d * 60) % 26;
      ctx.strokeStyle = k.rgba('yellow', 0.6 * (1 - wr / 26));
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.ellipse(0, 55, 80 + wr, 13 + wr * 0.3, 0, 0, k.TAU); ctx.stroke();
    }

    // --- 2) çubuklar (hafif sallanır)
    const sway = Math.sin(t * 1.6) * 0.02 + (slurping ? Math.sin(d * 30) * 0.015 * (1 - g) : 0);
    ctx.save(); ctx.translate(70, -178); ctx.rotate(sway); ctx.translate(-70, 178);
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(58, -176); ctx.lineTo(clumpX - 8, clumpY + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(78, -170); ctx.lineTo(clumpX + 10, clumpY + 8); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 1); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(58, -176); ctx.lineTo(clumpX - 8, clumpY + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(78, -170); ctx.lineTo(clumpX + 10, clumpY + 8); ctx.stroke();
    ctx.restore();

    // --- 3) noodle iplikleri (7 adet): yumaktan kaseye sarkar
    const strand = (x0, y0, x1, y1, amp, w, seed, bow) => {
      const mx = (x0 + x1) / 2 + k.noise1(t * 2.6 + seed) * amp + bow;
      const my = (y0 + y1) / 2 + k.noise1(t * 2.1 + seed * 1.7) * amp * 0.5;
      ctx.strokeStyle = line; ctx.lineWidth = w + 4.5;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
      ctx.strokeStyle = k.rgba('yellow', 1); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
      // parlama çizgisi
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = Math.max(w * 0.32, 1.5);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
    };
    const amp = 15 - 10 * taut;
    for (let i = 0; i < 7; i++) {
      const fx = (i - 3) / 3; // -1..1
      const x0 = clumpX + fx * 15;
      const x1 = fx * 52 + k.noise1(t * 1.2 + i * 4.4) * 6;
      strand(x0, clumpY + 8, x1, 54, amp * (0.7 + 0.6 * Math.abs(fx)), 5.5, i * 7.3 + 1, fx * 20);
    }

    // --- 4) yumak (çubuk ucundaki düğüm)
    for (let i = 0; i < 4; i++) {
      const kx = clumpX + (k.hash(i * 3.1 + 2) - 0.5) * 26;
      const ky = clumpY + (k.hash(i * 5.7 + 4) - 0.5) * 14;
      ctx.fillStyle = k.rgba('bg', 0.4);
      ctx.beginPath(); ctx.arc(kx + 2, ky + 2, 8, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 1);
      ctx.beginPath(); ctx.arc(kx, ky, 8, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 3.5; ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath(); ctx.ellipse(clumpX - 6, clumpY - 4, 9, 5, -0.3, 0, k.TAU); ctx.fill();

    // --- 5) buhar (kaseden yükselir; slurp'ta hızlanır)
    for (let i = 0; i < 3; i++) {
      const cyc = slurping ? 1.6 : 3;
      const ph = ((t * (slurping ? 1.7 : 1) + k.hash(i * 6.3 + 9) * cyc) % cyc) / cyc;
      const sx = -40 + i * 40;
      const y0 = 40 - ph * 90;
      const wob = k.noise1(t * 2.5 + i * 11) * 12;
      ctx.strokeStyle = k.rgba('dim', 0.5 * Math.sin(ph * Math.PI));
      ctx.lineWidth = 5 * (1 - ph * 0.5);
      ctx.beginPath();
      ctx.moveTo(sx, 40);
      ctx.bezierCurveTo(sx + wob - 9, y0 + 28, sx - wob + 9, y0 + 2, sx + wob * 0.5, y0 - 18);
      ctx.stroke();
    }

    // --- 6) slurp damlaları: düşüş fazında ipliklerden kopar, kaseye düşer
    if (slurping && d > 0.55) {
      for (let i = 0; i < 6; i++) {
        const dg = k.prog(d - 0.55 - k.hash(i * 4.4 + 3) * 0.25, 0, 0.5);
        if (dg <= 0) continue;
        const dx = (k.hash(i * 8.1 + 7) - 0.5) * 90;
        const dy = clumpY + 20 + 130 * dg * dg;
        const fade = 1 - k.prog(dg, 0.7, 1.0);
        if (fade <= 0 || dy > 56) continue;
        ctx.fillStyle = k.rgba('yellow', 0.9 * fade);
        ctx.beginPath(); ctx.arc(dx, dy, 3.5, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
