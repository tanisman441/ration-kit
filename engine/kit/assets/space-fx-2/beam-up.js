// space-fx-2/beam-up — ışınlanma huzmesi: yukarı süzülen parçacıklı dikey ışık sütunu;
// `at` anında 0.9 sn boyunca güçlenir, sonra söner.
// NOT: canvas y-aşağıdır; (0,0) zemin tabanıdır, sütun yukarı (y-) yükselir.
export default {
  name: 'beam-up',
  category: 'space-fx-2',
  desc: 'Işınlanma huzmesi: yukarı süzülen parçacıklı dikey ışık sütunu, anı gelince parlar',
  tags: ['ışınlanma', 'huzme', 'ışın', 'sütun', 'ışık', 'teleport', 'beam', 'teleport', 'column', 'light', 'sci-fi'],
  box: [-90, -170, 90, 40],
  bleed: 50,
  anchor: 'zemin tabanı (0,0)',
  points: { base: [0, 0], top: [0, -140] },
  params: {
    at: { type: 'time', default: null, desc: 'ışınlanma anı: 0.9 sn huzme güçlenir, sonra söner' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    const H = 150 * S;   // sütun boyu
    const W = 56 * S;    // sütun genişliği

    // --- an sonrası sönümleme: 0.9 sn sonunda başlar, 1.5 sn'de biter ---
    let fade = 1;
    if (d >= 0.9) fade = 1 - k.prog(d, 0.9, 1.5);
    // --- an sırasında güç çarpanı ---
    let power = 1;
    if (d >= 0 && d < 0.9) power = 1 + 1.6 * Math.sin(Math.PI * k.prog(d, 0, 0.9));

    // --- zemin halkası: idle nabız ---
    const pulse = 0.5 + 0.5 * Math.sin(t * 4.2);
    const rr = (W * 0.85 + 6 * pulse * S) * Math.min(power, 1.8);
    ctx.strokeStyle = k.rgba('cyan', 0.75 * fade);
    ctx.lineWidth = 5 * S;
    ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * 0.32, 0, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('cyan', 0.3 * fade);
    ctx.lineWidth = 3 * S;
    ctx.beginPath(); ctx.ellipse(0, 0, rr * 1.45, rr * 0.46, 0, 0, k.TAU); ctx.stroke();
    k.glow(0, -6 * S, rr * 1.2, k.col('cyan'), 0.25 * fade * pulse);

    // --- sütun gövdesi: katmanlı dikey ışık ---
    const sway = k.noise1(t * 7) * 6 * S;                       // idle hafif salınım
    const g = ctx.createLinearGradient(0, 0, 0, -H);
    g.addColorStop(0, k.rgba('cyan', 0.85 * fade * Math.min(power, 2)));
    g.addColorStop(1, k.rgba('cyan', 0.08 * fade));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-W / 2 + sway, 0);
    ctx.lineTo(-W * 0.28 - sway * 0.6, -H);
    ctx.lineTo(W * 0.28 - sway * 0.6, -H);
    ctx.lineTo(W / 2 + sway, 0);
    ctx.closePath(); ctx.fill();
    // iç çekirdek sütunu
    ctx.fillStyle = k.rgba('bg', 0.5 * fade * Math.min(power, 1.6));
    ctx.beginPath();
    ctx.moveTo(-W * 0.16 + sway, 0);
    ctx.lineTo(-W * 0.1 - sway * 0.6, -H);
    ctx.lineTo(W * 0.1 - sway * 0.6, -H);
    ctx.lineTo(W * 0.16 + sway, 0);
    ctx.closePath(); ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = k.rgba('bg', 0.10 * fade);
    ctx.beginPath(); ctx.ellipse(-W * 0.3 + sway, -H * 0.6, W * 0.12, H * 0.18, 0, 0, k.TAU); ctx.fill();

    // --- yükselen parçacıklar: idle sürekli, an sırasında hızlı ---
    const N = 18;
    for (let i = 0; i < N; i++) {
      const h1 = k.hash(i * 7 + 51), h2 = k.hash(i * 13 + 67), h3 = k.hash(i * 29 + 83);
      const cyc = 1.6 + h2 * 1.4;                              // yükselme süresi
      const rise = ((t * (1 + 0.9 * (power - 1)) + h3 * cyc) % cyc) / cyc;
      const x = (h1 - 0.5) * W * 0.8 * (1 - rise * 0.35) + k.noise1(t * 6 + i * 3) * 8 * S;
      const y = -rise * H;
      const tw = 0.5 + 0.5 * k.noise1(t * 11 + i * 5);
      const sz = (2 + 3.5 * h2) * S * (1 - rise * 0.5);
      ctx.fillStyle = k.rgba('cyan', (0.35 + 0.55 * tw) * fade * (1 - rise * 0.4));
      ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
