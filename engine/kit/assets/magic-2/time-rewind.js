// magic-2/time-rewind — zamanı geri sarma: rewind anında 1.5 sn'de ibreleri
// tersine dönen saat, içe sarmal ışık halkaları ve hayalet ibre izleri;
// öncesinde saniye ibresi yavaşça ileri tikler.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) saatin merkezidir.
export default {
  name: 'time-rewind', category: 'magic-2',
  desc: 'Zamanı geri sarma: rewind anında ibreleri tersine dönen saat ve içe sarmal ışıklar',
  tags: ['zaman', 'geri sarma', 'rewind', 'saat', 'time', 'clock', 'zaman yolculuğu', 'büyü', 'reverse', 'ters'],
  box: [-130, -130, 130, 130],
  bleed: 45,
  anchor: 'merkez (0,0) — saatin merkezi',
  points: { center: [0, 0], rim: [100, 0] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'zaman enerjisinin rengi' },
    rewind: { type: 'time', default: null, desc: 'geri sarma anı (1.5 sn ters dönüş + sarmal)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.rewind == null ? -1 : t - p.rewind;
    const col = p.color;
    const active = d >= 0 && d <= 1.5;
    const e = active ? 1 - Math.pow(1 - d / 1.5, 2) : 0;   // sarma ilerlemesi

    // ---- kadran ----
    ctx.fillStyle = k.rgba('panel', 0.9);
    ctx.beginPath(); ctx.arc(0, 0, 92, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(0, 0, 100, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba(col, 0.75);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 92, 0, k.TAU); ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * k.TAU - Math.PI / 2;
      const big = i % 3 === 0;
      ctx.strokeStyle = k.rgba('ink', big ? 0.75 : 0.45);
      ctx.lineWidth = big ? 5 : 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (big ? 78 : 82), Math.sin(a) * (big ? 78 : 82));
      ctx.lineTo(Math.cos(a) * 88, Math.sin(a) * 88);
      ctx.stroke();
    }
    // sol üst parlama (beyaz alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -38, 30, 20, -0.5, 0, k.TAU); ctx.fill();

    // ---- ibre açıları ----
    let sa, ma, ha;
    if (active) {
      const spin = e * 3 * k.TAU;          // saniye ibresi 3 ters tur
      sa = -Math.PI / 2 - spin;
      ma = -Math.PI / 2 + 0.9 - e * 2 * k.TAU;
      ha = -Math.PI / 2 + 0.45 - e * k.TAU;
    } else {
      const et = d > 1.5 ? d - 1.5 : t;    // sarma sonrası d bazlı: açı sürekliliği
      sa = -Math.PI / 2 + et * k.TAU / 12; // idle: 12 sn'de bir tur ileri
      ma = -Math.PI / 2 + 0.9 + et * 0.02;
      ha = -Math.PI / 2 + 0.45 + et * 0.005;
    }

    // ---- sarmal ışık halkaları (sadece sarma sırasında) ----
    if (active) {
      const sal = Math.sin(Math.PI * e);
      k.glow(0, 0, 110, col, 0.35 * sal);
      for (let j = 0; j < 3; j++) {
        const a0 = -Math.PI / 2 - e * 3 * k.TAU * 0.5 + j * k.TAU / 3;
        const rr = 70 - e * 28;
        ctx.strokeStyle = k.rgba(col, 0.6 * sal * (1 - j * 0.2));
        ctx.lineWidth = 6 - j;
        ctx.beginPath(); ctx.arc(0, 0, rr - j * 9, a0, a0 + 1.3); ctx.stroke();
      }
      // hayalet ibre izleri (önceki açıların silüetleri)
      for (let j = 1; j <= 3; j++) {
        const ga = sa + j * 0.35;
        ctx.strokeStyle = k.rgba(col, 0.18 * sal);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ga) * 80, Math.sin(ga) * 80); ctx.stroke();
      }
    }

    // ---- ibreler ----
    function hand(angle, len, w, style) {
      ctx.strokeStyle = style;
      ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len); ctx.stroke();
    }
    hand(ha, 45, 9, k.rgba('ink', 0.9));
    hand(ma, 68, 6, k.rgba('ink', 0.9));
    hand(sa, 80, 3, k.rgba(col, 0.95));
    // merkez pimi
    ctx.fillStyle = k.rgba(col, 0.95);
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(-2, -2, 2.5, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
