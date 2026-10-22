// spell-duel/shield-bubble — koruyucu büyü küresi: yarı saydam kubbe, yüzeyde
// hafif parlayan çizgi deseni. `at` anında: merkezden belirip ~0.45 sn'de tam
// boyuta genişler. Sonra idle: yumuşak nabız (r ±3, ~2.4 sn periyot).
// NOT: canvas y-aşağıdır; (0,0) kürenin merkezidir.
export default {
  name: 'shield-bubble', category: 'spell-duel',
  desc: 'Yarı saydam koruyucu büyü küresi; at anında belirip genişler, sonra nabız gibi atar',
  tags: ['kalkan', 'büyü', 'küre', 'koruma', 'savunma', 'shield', 'bubble', 'protection', 'ward', 'magic'],
  box: [-140, -140, 140, 140],
  bleed: 30,
  anchor: 'kürenin merkezi (0,0)',
  points: { centre: [0, 0], top: [0, -105], edge: [105, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'kalkanın kurulma anı (0.45 sn: belirip genişleme)' },
    color: { type: 'color', default: 'cyan', desc: 'kalkan rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round';

    const R = 105;
    // Genişleme: at öncesi görünmez (film öncesi kare), at anında 0.45 sn'de açılır
    let show = 1;
    if (d >= 0 && d < 0.45) show = k.E.outBack(Math.min(1, d / 0.45));
    else if (d >= 0.45) show = 1;
    else if (d < 0) show = 0.92; // at öncesi: hafifçe görünür hayalet hali
    const pulse = Math.sin(t * (k.TAU / 2.4)) * 3; // idle nabız
    const r = R * show + pulse * show;

    if (r <= 2) { ctx.restore(); return; }

    // Zemin: yarı saydam dolgu
    ctx.fillStyle = k.rgba(acc, 0.14 * Math.min(1, show));
    ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.fill();

    // Alt yarım gölge (iç derinlik)
    ctx.fillStyle = k.rgba('bg', 0.08);
    ctx.beginPath(); ctx.ellipse(0, r * 0.45, r * 0.85, r * 0.5, 0, 0, Math.PI); ctx.fill();

    // Yüzey deseni: 3 yay çizgisi (enerji dalgası), nabızla dönen hafif faz
    ctx.strokeStyle = k.rgba(acc, 0.5); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const rr = r * (0.35 + i * 0.25);
      const off = Math.sin(t * 2 + i * 2.1) * 0.25;
      ctx.beginPath(); ctx.arc(0, 0, rr, off, off + Math.PI * 1.5); ctx.stroke();
    }
    // dikey vurgu çizgisi (üstten alttan geçen enerji hattı)
    ctx.strokeStyle = k.rgba(acc, 0.35); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * 0.12, 0, 0, r); ctx.stroke();

    // Dış kabuk: çift halka
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba(acc, 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, r - 8, 0, k.TAU); ctx.stroke();

    // Sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-r * 0.42, -r * 0.5, r * 0.28, r * 0.18, -0.5, 0, k.TAU); ctx.fill();

    // Kurulum anı parıltısı: genişlerken dışa yayılan halka (0.45 sn)
    if (d >= 0 && d < 0.45) {
      const prog = d / 0.45;
      const wr = r + prog * 40;
      ctx.strokeStyle = k.rgba(acc, (1 - prog) * 0.6); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, wr, 0, k.TAU); ctx.stroke();
    }

    // hafif glow
    k.glow(0, 0, r * 1.15, acc, 0.18 + Math.abs(Math.sin(t * (k.TAU / 2.4))) * 0.08);
    ctx.restore();
  },
};
