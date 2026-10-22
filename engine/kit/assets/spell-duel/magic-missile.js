// spell-duel/magic-missile — fırlatılmaya hazır büyülü mermi: sağa bakan,
// kuyruklu parlak küre. Idle: durgun süzülme (y bob, ~2.4 sn) + kuyruk parıltısı
// titremesi. `at` anında: parlama + ileri fırlama (0.35 sn) + hız çizgileri.
// NOT: canvas y-aşağıdır; (0,0) merminin merkezidir.
export default {
  name: 'magic-missile', category: 'spell-duel',
  desc: 'Kuyruklu parlak büyü mermisi, sağa bakıyor; at anında fırlayıp parlar',
  tags: ['büyü', 'mermi', 'sihir', 'füze', 'ateşleme', 'magic', 'missile', 'bolt', 'projectile', 'spell'],
  box: [-130, -70, 130, 70],
  bleed: 40,
  anchor: 'merminin merkezi (0,0)',
  points: { tip: [95, 0], tail: [-80, 0], centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'fırlatma anı (0.35 sn: parlama + ileri hamle)' },
    color: { type: 'color', default: 'purple', desc: 'mermi rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round';

    // Idle: durgun süzülme
    const bob = Math.sin(t * (k.TAU / 2.4)) * 4;
    const fire = d >= 0 && d < 0.35;
    const fprog = fire ? d / 0.35 : 0;
    const lunge = fire ? k.E.outCubic(Math.min(1, fprog * 1.6)) * 70 : 0; // ileri hamle

    ctx.translate(lunge, bob);

    // Kuyruk: soldan sağa akan 6 parçacık + hafif titreme
    const N = 6;
    for (let i = 0; i < N; i++) {
      const h = k.hash(i * 41.7 + 3);
      const cyc = 1.6, ph = ((t * 1.2 + h * cyc) % cyc) / cyc; // kuyrukta akış
      const x = -18 - ph * 75;
      const sway = k.noise1(i * 9.3 + t * 2.0) * 6;
      const r = 7 * (1 - ph * 0.75);
      const tw = 0.45 + 0.4 * Math.abs(Math.sin(t * 9 + i * 2.1)); // parıltı titremesi
      const boost = fire ? 1 + (1 - fprog) * 1.6 : 1;
      ctx.fillStyle = k.rgba(acc, Math.min(1, tw * boost));
      ctx.beginPath(); ctx.arc(x, sway, Math.max(1, r * boost), 0, k.TAU); ctx.fill();
    }

    // Fırlama hız çizgileri (sadece at anında)
    if (fire) {
      const la = (1 - fprog) * 0.8;
      ctx.strokeStyle = k.rgba(acc, la); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const y = -26 + i * 26;
        ctx.beginPath(); ctx.moveTo(-115, y); ctx.lineTo(-55 - fprog * 40, y); ctx.stroke();
      }
    }

    // Gövde: dış kabuk + iç çekirdek + sol üst parlama
    const coreR = 26;
    const shell = fire ? 1 + (1 - fprog) * 0.35 : 1; // at anında büyüme
    k.glow(10, 0, coreR * 2.4 * shell, acc, fire ? 0.5 : 0.28);
    ctx.fillStyle = k.rgba(acc, 0.42);
    ctx.beginPath(); ctx.arc(10, 0, coreR * shell, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(10, 0, coreR * shell, 0, k.TAU); ctx.stroke();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(18, 8, coreR * 0.72, coreR * 0.6, 0.4, 0, k.TAU); ctx.fill();
    // iç çekirdek (beyaza yakın parlak)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.arc(10, 0, coreR * 0.52 * shell, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.arc(10, 0, coreR * 0.52 * shell, 0, k.TAU); ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(10 - coreR * 0.38, -coreR * 0.42, coreR * 0.42, coreR * 0.30, -0.5, 0, k.TAU); ctx.fill();
    // burun sivrileşmesi (sağa yön)
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath();
    ctx.moveTo(10 + coreR * 0.5, -coreR * 0.45);
    ctx.lineTo(95, 0);
    ctx.lineTo(10 + coreR * 0.5, coreR * 0.45);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10 + coreR * 0.5, -coreR * 0.45);
    ctx.lineTo(95, 0);
    ctx.lineTo(10 + coreR * 0.5, coreR * 0.45);
    ctx.stroke();

    // at anı flaşı (0.12 sn beyaz parıltı)
    if (fire && d < 0.12) {
      const fa = 1 - d / 0.12;
      k.glow(10, 0, coreR * 4 * (1 - fa * 0.3), 'bg', fa * 0.6);
    }
    ctx.restore();
  },
};
