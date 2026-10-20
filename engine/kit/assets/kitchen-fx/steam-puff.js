// kitchen-fx/steam-puff — yükselen kıvrımlı buhar; puff anında ani buhar püskürmesi.
// NOT: canvas y-aşağıdır; buhar alttan (+y) yükselir, yükselirken genişler ve dağılır.
export default {
  name: 'steam-puff', category: 'kitchen-fx',
  desc: 'Alttan yükselip kıvrılarak genişleyen buhar; puff anında ani ve yoğun buhar püskürmesi',
  tags: ['buhar', 'duman', 'sıcak', 'yükselen', 'püskürme', 'steam', 'vapor', 'puff', 'rising steam', 'hot'],
  box: [-130, -150, 130, 90],
  bleed: 34,
  anchor: 'buharın çıktığı taban (0,60)',
  points: { base: [0, 60], top: [0, -120], edge: [90, -60] },
  params: {
    puff: { type: 'time', default: null, desc: 'ani buhar püskürmesi anı (0.9 sn): yoğun, genişleyen bulut' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.puff == null ? -1 : t - p.puff;
    const bursting = d >= 0 && d <= 0.9;

    // --- tek kıvrım çizen yardımcı
    const wisp = (x0, rise, wob, width, alpha, lean) => {
      ctx.strokeStyle = k.rgba(p.color, alpha);
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x0, 70);
      ctx.bezierCurveTo(
        x0 - lean + wob - 22, 70 - rise * 0.35,
        x0 + lean + wob + 22, 70 - rise * 0.7,
        x0 + wob * 0.6, 70 - rise
      );
      ctx.stroke();
    };

    // --- 1) idle: sürekli yükselen 4 kıvrım (döngülü, her biri 3.2 sn)
    const N = 4;
    for (let i = 0; i < N; i++) {
      const cyc = 3.2;
      const ph = ((t * 0.95 + i * (cyc / N)) % cyc) / cyc;
      const x0 = -45 + i * 30 + (k.hash(i * 7 + 2) - 0.5) * 18;
      const rise = 30 + ph * 130;
      const wob = k.noise1(t * 1.5 + i * 13) * 16;
      const alpha = 0.62 * Math.sin(ph * Math.PI) * (bursting ? 0.5 : 1);
      const width = 8 + ph * 10;
      const lean = (k.hash(i * 7 + 5) - 0.5) * 40;
      wisp(x0, rise, wob, width, alpha, lean);
    }

    // --- 2) puff olayı: yoğun püskürme (0.9 sn) — büyük genişleyen halkalar + kıvrımlar
    if (bursting) {
      const g = k.prog(d, 0, 0.9);
      k.glow(0, 30, 80 * (1 - g) + 30, 'cyan', 0.4 * (1 - g));
      // genişleyen buhar halkaları
      for (let i = 0; i < 3; i++) {
        const gi = k.prog(d - i * 0.12, 0, 0.78);
        if (gi > 0) {
          const r = 16 + gi * 78;
          const yy = 30 - gi * 90;
          ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - gi));
          ctx.lineWidth = 11 * (1 - gi) + 3;
          ctx.beginPath(); ctx.arc(0, yy, r, 0, k.TAU); ctx.stroke();
        }
      }
      // hızlı fırlayan kıvrımlar
      for (let i = 0; i < 5; i++) {
        const gi = k.prog(d - i * 0.07, 0, 0.83);
        if (gi > 0) {
          const e = k.E.outExpo(gi);
          const x0 = (k.hash(i * 3 + 1) - 0.5) * 70;
          wisp(x0, 60 + e * 130, k.noise1(i * 5 + 3) * 20, 9 * (1 - gi) + 3, 0.65 * (1 - gi), (k.hash(i * 3 + 4) - 0.5) * 60);
        }
      }
    }
    ctx.restore();
  },
};
