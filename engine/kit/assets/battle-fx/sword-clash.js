// battle-fx/sword-clash — kılıç çarpışması kıvılcımı: çaprazlanan iki kılıç, temas anında kıvılcım yağmuru.
// NOT: canvas y-aşağıdır; (0,0) kılıçların temas noktasıdır.
export default {
  name: 'sword-clash',
  category: 'battle-fx',
  desc: 'Kılıç çarpışması: çaprazlanan iki kılıcın temas noktasından saçılan kıvılcım yağmuru',
  tags: ['kılıç', 'çarpışma', 'kıvılcım', 'dövüş', 'savaş', 'sword', 'clash', 'spark', 'fight'],
  box: [-170, -170, 170, 170],
  bleed: 50,
  anchor: 'kılıçların temas noktası (0,0)',
  points: { contact: [0, 0], tipA: [-118, -118], tipB: [118, -118] },
  params: {
    clash: { type: 'time', default: null, desc: 'temas anı (0.5 sn: çakma + kıvılcım yağmuru)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: kılıç boyutu' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.clash == null ? -1 : t - p.clash;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- idle: kılıçlar hafif titrer (gerilim) ---
    const trem = d < 0 || d > 0.8 ? k.noise1(t * 7) * 2.5 : 0;

    function blade(fromLeft, trem2) {
      // kılıç: kabza + siperlik + namlu (yukarı bakacak şekilde)
      const sign = fromLeft ? -1 : 1;
      ctx.save();
      ctx.translate(sign * 62 * S, 78 * S + trem2);
      ctx.rotate(sign * 0.62 + trem2 * 0.004);
      // kabza
      ctx.fillStyle = k.rgba('ink', 0.9);
      ctx.strokeStyle = k.rgba('bg', 0.55);
      ctx.lineWidth = 3 * S;
      ctx.beginPath(); k.rrect(-9 * S, 6 * S, 18 * S, 44 * S, 8 * S); ctx.fill(); ctx.stroke();
      // siperlik
      ctx.fillStyle = k.rgba(p.color, 1);
      ctx.beginPath(); k.rrect(-34 * S, -6 * S, 68 * S, 14 * S, 6 * S); ctx.fill(); ctx.stroke();
      // namlu
      ctx.fillStyle = k.rgba(p.color, 1);
      ctx.beginPath();
      ctx.moveTo(-11 * S, -6 * S);
      ctx.lineTo(-11 * S, -128 * S);
      ctx.lineTo(0, -152 * S);
      ctx.lineTo(11 * S, -128 * S);
      ctx.lineTo(11 * S, -6 * S);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // namlu sol üst parlaması
      ctx.fillStyle = k.rgba('bg', 0.11);
      ctx.beginPath();
      ctx.ellipse(-5 * S, -80 * S, 5 * S, 44 * S, 0, 0, k.TAU);
      ctx.fill();
      ctx.restore();
    }
    blade(true, trem);
    blade(false, -trem);

    if (d < 0 || d > 0.9) { ctx.restore(); return; }

    // --- temas çakması (0.16 sn) ---
    if (d < 0.16) {
      const f = 1 - d / 0.16;
      k.glow(0, 0, 90 * S * f, 'yellow', 0.5 * f);
      ctx.fillStyle = k.rgba('yellow', 0.9 * f);
      ctx.save();
      ctx.translate(0, 0);
      ctx.rotate(Math.PI / 4 + d * 6);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        const rr = i % 2 === 0 ? (46 - d * 160) * S : (16 - d * 60) * S;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // --- kıvılcım yağmuru: 14 kıvılcım yukarı-aşağı saçılır (0.5 sn) ---
    const g = k.prog(d, 0.02, 0.6);
    for (let i = 0; i < 14; i++) {
      const h1 = k.hash(i * 5 + 61), h2 = k.hash(i * 11 + 63);
      const a = -Math.PI / 2 + (h1 - 0.5) * 2.4; // yukarı ağırlıklı koni
      const e = k.E.outCubic(g);
      const dist = (22 + h2 * 118) * S * e;
      const x = Math.cos(a) * dist + k.noise1(i * 3 + d * 9) * 5;
      const y = Math.sin(a) * dist + e * e * 46 * S + k.noise1(i * 7 + d * 9) * 5;
      ctx.fillStyle = k.rgba(h2 > 0.55 ? 'yellow' : p.color, 0.9 * (1 - g));
      ctx.beginPath();
      ctx.arc(x, y, (4.5 - g * 2.5) * S, 0, k.TAU);
      ctx.fill();
      // kısa kuyruk çizgisi
      ctx.strokeStyle = k.rgba('yellow', 0.55 * (1 - g));
      ctx.lineWidth = 2.2 * S;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(a) * 12 * S * e, y - Math.sin(a) * 12 * S * e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // --- şok halkası ---
    const rg = k.prog(d, 0.05, 0.5);
    if (rg < 1) {
      ctx.strokeStyle = k.rgba('yellow', 0.5 * (1 - rg));
      ctx.lineWidth = (5 * (1 - rg) + 1) * S;
      ctx.beginPath();
      ctx.arc(0, 0, (14 + 88 * k.E.outCubic(rg)) * S, 0, k.TAU);
      ctx.stroke();
    }
    ctx.restore();
  },
};
