// spell-duel/mana-burst — büyü enerjisi patlaması: merkezden saçılan 14
// parçacık + genişleyen halka + iç çekirdek flaşı. `at` anında: parçacıklar
// 0.6 sn'de dışa savrulup sönümlenir. Idle: merkezde hafif mana nabzı
// (yumuşak glow, ~2 sn periyot).
// NOT: canvas y-aşağıdır; (0,0) patlamanın merkezidir.
export default {
  name: 'mana-burst', category: 'spell-duel',
  desc: 'Büyü enerjisi patlaması; at anında 14 parçacık saçılır ve 0.6 sn\'de söner',
  tags: ['patlama', 'büyü', 'enerji', 'mana', 'sihir', 'parçacık', 'burst', 'explosion', 'mana', 'particles', 'magic'],
  box: [-140, -140, 140, 140],
  bleed: 50,
  anchor: 'patlamanın merkezi (0,0)',
  points: { centre: [0, 0], edge: [110, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı (0.6 sn: parçacıklar saçılıp sönümlenir)' },
    color: { type: 'color', default: 'purple', desc: 'enerji rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round';

    // Idle mana nabzı: merkezde yumuşak soluma
    const pulse = 0.5 + 0.5 * Math.sin(t * (k.TAU / 2.0));
    k.glow(0, 0, 42 + pulse * 14, acc, 0.20 + pulse * 0.10);

    const bursting = d >= 0 && d < 0.6;
    const bprog = bursting ? d / 0.6 : -1;

    // Patlama anı: merkez flaşı + genişleyen halka + saçılan parçacıklar
    if (bursting) {
      // beyaz çekirdek flaşı (ilk 0.12 sn)
      if (d < 0.12) {
        k.glow(0, 0, 90 * (1 - d / 0.12) + 30, 'bg', (1 - d / 0.12) * 0.55);
      }
      // genişleyen halka
      const wr = 10 + k.E.outCubic(bprog) * 115;
      ctx.strokeStyle = k.rgba(acc, (1 - bprog) * 0.7); ctx.lineWidth = 5 * (1 - bprog) + 1.5;
      ctx.beginPath(); ctx.arc(0, 0, wr, 0, k.TAU); ctx.stroke();
      // 14 parçacık: hash yönlü, dışa savrulma + küçülme
      const N = 14;
      for (let i = 0; i < N; i++) {
        const h1 = k.hash(i * 41.3 + 2), h2 = k.hash(i * 17.9 + 8);
        const ang = h1 * k.TAU + h2 * 0.5;
        const dist = k.E.outCubic(bprog) * (85 + h2 * 45);
        const x = Math.cos(ang) * dist, y = Math.sin(ang) * dist;
        const r = 6 * (1 - bprog) + 1.2;
        const a = (1 - bprog) * 0.9;
        ctx.fillStyle = k.rgba(acc, a);
        ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
        // hareket yönünde kısa iz çizgisi
        ctx.strokeStyle = k.rgba(acc, a * 0.5); ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(ang) * r * 2.5, y - Math.sin(ang) * r * 2.5);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }

    // Merkez çekirdek: her zaman var, at anında büyür
    const coreR = 14 + (bursting ? (1 - bprog) * 22 : 0);
    ctx.fillStyle = k.rgba(acc, 0.55);
    ctx.beginPath(); ctx.arc(0, 0, coreR, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 0, coreR, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath(); ctx.arc(0, 0, coreR * 0.5, 0, k.TAU); ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-coreR * 0.35, -coreR * 0.4, coreR * 0.4, coreR * 0.28, -0.5, 0, k.TAU); ctx.fill();

    // süzülen mana kıvılcımları (idle): 5 nokta, yavaş yörünge
    if (!bursting) {
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 23.5 + 4);
        const ang = h * k.TAU + t * (0.3 + h * 0.4);
        const rr = 45 + h * 40 + Math.sin(t * 1.7 + i) * 6;
        const tw = 0.3 + 0.4 * Math.abs(Math.sin(t * 3 + i * 2.4));
        ctx.fillStyle = k.rgba(acc, tw);
        ctx.beginPath(); ctx.arc(Math.cos(ang) * rr, Math.sin(ang) * rr, 2.8, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
