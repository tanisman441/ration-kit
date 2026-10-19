// combat-fx/charge-up — güç toplama: boşta nabız gibi atan enerji küresi + yörünge parçacıkları,
// release anında patlama.
// NOT: canvas y-aşağıdır; (0,0) kürenin merkezi.
export default {
  name: 'charge-up',
  category: 'combat-fx',
  desc: 'Güç toplama: boşta nabız gibi atan enerji küresi, release anında içe çöküp patlayan parlama',
  tags: ['güç', 'enerji', 'toplama', 'şarj', 'patlama', 'charge', 'power', 'energy', 'orb', 'blast'],
  box: [-150, -150, 150, 150],
  bleed: 60,
  anchor: 'enerji küresinin merkezi (0,0)',
  points: { core: [0, 0], orbit: [95, 0] },
  params: {
    release: { type: 'time', default: null, desc: 'güç boşalması anı (patlama)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.release == null ? -1 : t - p.release;
    const bursting = d >= 0 && d <= 0.7;
    ctx.save();

    // 1) idle nabız — küre 1.6 sn periyotla atar
    const pulse = 1 + 0.08 * Math.sin(t * k.TAU / 1.6);
    const idleA = bursting ? k.clamp(1 - d / 0.18, 0, 1) : 1;

    if (idleA > 0.01) {
      // sağ alt gölge
      ctx.fillStyle = k.rgba('ink', 0.12 * idleA);
      ctx.beginPath(); ctx.arc(6, 6, 46 * pulse, 0, k.TAU); ctx.fill();
      // küre gövdesi — sıcak çekirdek
      ctx.fillStyle = k.rgba('yellow', 0.85 * idleA);
      ctx.beginPath(); ctx.arc(0, 0, 46 * pulse, 0, k.TAU); ctx.fill();
      // iç parlama
      k.glow(0, 0, (60 + 14 * (pulse - 1)) * idleA, 'yellow', 0.32 * idleA);
      // sol üst parlama — beyaz alfa 0.10, kontursuz
      ctx.fillStyle = k.rgba('bg', 0.10 * idleA);
      ctx.beginPath();
      ctx.ellipse(-16, -19, 22, 13, -0.5, 0, k.TAU);
      ctx.fill();
      // dış hat — bg alfa 0.55
      ctx.strokeStyle = k.rgba('bg', 0.55 * idleA);
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 46 * pulse, 0, k.TAU); ctx.stroke();
    }

    // 2) yörünge parçacıkları — içe doğru spiral çeken enerji zerreleri (idle)
    if (idleA > 0.01) {
      for (let i = 0; i < 9; i++) {
        const h1 = k.hash(i * 5 + 61), h2 = k.hash(i * 9 + 63);
        const ang = i * k.TAU / 9 + t * (0.6 + h1 * 0.5);
        const rr = 100 - 12 * (0.5 + 0.5 * k.noise1(t * 0.8 + i * 2));
        const x = Math.cos(ang) * rr, y = Math.sin(ang) * rr;
        const al = (0.35 + 0.35 * (0.5 + 0.5 * k.noise1(t * 1.2 + i * 3))) * idleA;
        ctx.fillStyle = k.rgba('yellow', al);
        ctx.beginPath();
        ctx.arc(x, y, 4 + h2 * 4, 0, k.TAU);
        ctx.fill();
      }
    }

    // 3) release patlaması — 0.6 sn: flaş + halka + saçılan kıvılcımlar
    if (bursting) {
      if (d < 0.15) {
        const f = 1 - d / 0.15;
        k.glow(0, 0, 120 * f, 'yellow', 0.5 * f);
      }
      const g = k.prog(d, 0, 0.6);
      // genişleyen halka
      const rad = 50 + 105 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba('yellow', 0.65 * (1 - g));
      ctx.lineWidth = 8 * (1 - g * 0.6) + 1.5;
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, k.TAU); ctx.stroke();
      // kıvılcımlar
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 7 + 67), h2 = k.hash(i * 11 + 71);
        const a = h1 * k.TAU;
        const dist = (40 + h2 * 110) * k.E.outCubic(g);
        const x = Math.cos(a) * dist, y = Math.sin(a) * dist;
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - g));
        ctx.beginPath();
        ctx.arc(x, y, 3 + h2 * 5 * (1 - g), 0, k.TAU);
        ctx.fill();
      }
      // kalkan toz — dim zerreler
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 13 + 73), h2 = k.hash(i * 17 + 79);
        const a = h2 * k.TAU;
        const dist = (30 + h1 * 80) * k.E.outCubic(Math.min(g * 1.3, 1));
        ctx.fillStyle = k.rgba(p.color, 0.45 * (1 - g));
        ctx.beginPath();
        ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, 2.5 + h2 * 4, 0, k.TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  },
};
