// electric-fx/spark-shower — yukarıdan yağan kıvılcım yağmuru.
// ANIMASYON: `at` anında yoğun patlama (0.9 sn, yerçekimli kıvılcım izleri);
// idle'da damla damla süzülen 3 kıvılcım (döngüsel). Tek vurgu: yellow.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'spark-shower',
  category: 'electric-fx',
  desc: 'Yukarıdan yağan kıvılcım yağmuru; at anında yoğun patlama, idle’da damla damla süzülür',
  tags: ['kıvılcım', 'yağmur', 'parıltı', 'kaynak', 'patlama', 'ateş', 'spark', 'shower', 'rain', 'sparks', 'welding', 'glow'],
  box: [-100, -110, 100, 110],
  bleed: 50,
  anchor: 'yayılım merkezi (0,-55)',
  points: { emitter: [0, -55], fall_zone: [0, 80] },
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı: 0.9 sn yoğun kıvılcım yağmuru' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const bursting = d >= 0 && d < 0.95;
    const EX = 0, EY = -55;
    ctx.lineCap = 'round';

    // --- yayıcı başlık: gölge, gövde, sol üst parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-26 + 6, EY - 16 + 6, 52, 34, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-26, EY - 16, 52, 34, 12); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-14, EY - 8, 7, 9, 0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-26, EY - 16, 52, 34, 12); ctx.stroke();
    // ağız
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-14, EY + 14, 28, 12, 5); ctx.fill();

    // ağız parıltısı: idle'da hafif nabız, patlamada güçlü
    const pulse = bursting ? 1 : 0.55 + 0.25 * (0.5 + 0.5 * k.noise1(t * 4));
    k.glow(EX, EY + 20, 20, p.color, 0.35 * pulse);
    ctx.fillStyle = k.rgba(p.color, 0.9 * pulse);
    ctx.beginPath(); ctx.arc(EX, EY + 20, 6, 0, k.TAU); ctx.fill();

    // --- idle damlaları: 3 kıvılcım, 2.4 sn döngüyle süzülür ---
    if (!bursting) {
      for (let i = 0; i < 3; i++) {
        const ph = ((t / 2.4) + i / 3) % 1;
        const x = EX + (k.hash(i * 7 + 1) - 0.5) * 56;
        const y = k.lerp(EY + 30, 96, ph * ph);            // yerçekimiyle hızlanır
        const alpha = 0.7 * Math.sin(ph * Math.PI);
        if (alpha <= 0.01) continue;
        k.glow(x, y, 10, p.color, 0.3 * alpha);
        ctx.strokeStyle = k.rgba(p.color, alpha);
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 10 - ph * 14); ctx.stroke();
      }
    }

    // --- patlama: 12 kıvılcım, yerçekimli izler ---
    if (bursting) {
      const fl = 1 - k.prog(d, 0, 0.18);                  // ilk an flaşı
      if (fl > 0) k.glow(EX, EY + 20, 44, p.color, 0.5 * fl);
      for (let i = 0; i < 12; i++) {
        const start = k.hash(20 + i * 7) * 0.22;
        const fly = k.E.outCubic(k.prog(d, start, start + 0.6));
        const x = EX + (k.hash(10 + i * 7) - 0.5) * 110 * (0.3 + fly * 0.7);
        const y = k.lerp(EY + 24, 100, fly * fly);
        const alpha = 1 - k.prog(d, 0.45, 0.95);
        if (alpha <= 0.01 || fly <= 0) continue;
        const tw = 0.6 + 0.4 * k.noise1(t * 30 + i * 3);   // titreme
        k.glow(x, y, 13, p.color, 0.45 * alpha * tw);
        ctx.strokeStyle = k.rgba(p.color, 0.95 * alpha * tw);
        ctx.lineWidth = 4;
        const tail = 12 + fly * 16;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - tail); ctx.stroke();
        ctx.fillStyle = k.rgba('#ffffff', 0.9 * alpha * tw);
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, k.TAU); ctx.fill();
      }
      // zeminde parıltı birikimi
      const gz = k.prog(d, 0.15, 0.5) * (1 - k.prog(d, 0.6, 0.95));
      if (gz > 0) {
        ctx.fillStyle = k.rgba(p.color, 0.18 * gz);
        ctx.beginPath(); ctx.ellipse(EX, 100, 60 * gz + 10, 8, 0, 0, k.TAU); ctx.fill();
      }
    }
  },
};
