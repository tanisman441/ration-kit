// ocean-fx/jellyfish-drift — kubbe nabız gibi kasılıp gevşerken
// (pulse, ~1.8 sn periyot) dokunaçları dalgalanır; yukarı süzülür. pulse
// anında kısa bir sıkışma + yukarı itiş hissi verir.
// NOT: canvas y-aşağıdır; (0,0) kubbenin merkezidir.
export default {
  name: 'jellyfish-drift', category: 'ocean-fx',
  desc: 'Nabız gibi kasılan kubbesi ve dalgalanan dokunaçlarıyla yukarı süzülen denizanası',
  tags: ['denizanası', 'süzülme', 'dokunaç', 'nabız', 'medusa', 'jellyfish', 'drift', 'tentacles', 'pulse', 'underwater'],
  box: [-90, -120, 90, 110],
  bleed: 25,
  anchor: 'kubbenin merkezi (0,0)',
  points: { dome: [0, -60], mouth: [0, 10] },
  params: {
    pulse: { type: 'time', default: null, desc: 'güçlü kasılma anı (0.4 sn, kubbe sıkışır + itiş)' },
    color: { type: 'color', default: 'purple', desc: 'denizanası rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // Nabız: idle kasılma (1.8 sn periyot) + pulse olayı (0.4 sn güçlü kasılma)
    const idle = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.8);
    let squeeze = 0.15 * idle;
    const pd = p.pulse == null ? -1 : t - p.pulse;
    if (pd >= 0 && pd < 0.4) {
      const pp = pd / 0.4;
      squeeze += Math.sin(pp * Math.PI) * 0.45; // 0→peak→0
    }
    const driftY = Math.sin(t * k.TAU / 6) * 6;      // yavaş yukarı-aşağı süzülme
    const driftX = k.noise1(t * 0.25) * 8;

    ctx.translate(driftX, driftY);
    const wr = 70 * (1 - squeeze * 0.55); // kasılınca kubbe daralır
    const hr = 52 * (1 + squeeze * 0.35); // ve biraz uzar

    // Dokunaçlar (kubbenin altında, sine dalgası)
    const tn = 9;
    for (let i = 0; i < tn; i++) {
      const hx = -wr * 0.8 + (i / (tn - 1)) * wr * 1.6;
      const len = 55 + k.hash(i * 3.3) * 45;
      ctx.strokeStyle = k.rgba(acc, 0.75); ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hx, hr * 0.5);
      for (let s = 1; s <= 8; s++) {
        const yy = hr * 0.5 + (s / 8) * len;
        const xx = hx + Math.sin(s * 0.9 + t * 3.2 + i * 1.7) * 9 * (s / 8);
        ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }

    // Kubbe
    ctx.fillStyle = k.rgba(acc, 0.55);
    ctx.beginPath(); ctx.ellipse(0, 0, wr, hr, 0, Math.PI, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 0, wr, hr, 0, Math.PI, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-wr, 0); ctx.lineTo(wr, 0); ctx.stroke();
    // iç kıvrımlar (oral lobes)
    ctx.strokeStyle = k.rgba(acc, 0.5); ctx.lineWidth = 3;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * wr * 0.3, 0);
      ctx.quadraticCurveTo(i * wr * 0.3 + 6, 22, i * wr * 0.3, 40 + 4 * Math.sin(t * 2 + i));
      ctx.stroke();
    }
    // premium finish: kubbede sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-wr * 0.38, -hr * 0.42, wr * 0.30, hr * 0.24, -0.5, 0, k.TAU); ctx.fill();

    // yüz: uyuşuk denizanası gözleri (nokta)
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.arc(-16, -hr * 0.25, 4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(16, -hr * 0.25, 4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
