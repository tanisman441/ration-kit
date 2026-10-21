// cyber-fx/keygen-spin — dönen şifre üretim çarkı.
// ANIMASYON: sürekli dönen çentikli halka + iç kadran (idle); `at` anında üretilen anahtar
// patlaması: anahtar 0.35 sn'de pop olur + 10 kıvılcım + halka flaşı. Tek vurgu: cyan.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'keygen-spin', category: 'cyber-fx',
  desc: 'Sürekli dönen şifre üretim çarkı; at anında üretilen anahtar patlayarak belirir',
  tags: ['şifre', 'anahtar', 'üretim', 'çark', 'keygen', 'siber', 'şifreleme', 'dönme', 'key', 'password', 'generator', 'spin', 'wheel', 'cyber', 'encryption'],
  box: [-110, -110, 110, 110],
  bleed: 40,
  anchor: 'çark merkezi (0,0)',
  points: { hub: [0, 0], key: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'anahtar anı: 0.35 sn pop + 0.6 sn kıvılcım yağmuru' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d < 0.6;
    const R = 70;
    ctx.save();
    ctx.lineCap = 'round';

    // patlamada kısa flaş
    if (firing && d < 0.18) {
      k.glow(0, 0, R + 40, p.color, 0.5 * (1 - k.prog(d, 0, 0.18)));
    }

    // --- dış halka: gölge, gövde, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(6, 6, R + 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 0, R + 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-(R + 10) * 0.35, -(R + 10) * 0.42, (R + 10) * 0.4, (R + 10) * 0.24, -0.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, R + 10, 0, k.TAU); ctx.stroke();

    // --- dönen çentikli halka (idle spin 0.55 rad/sn) ---
    const spin = t * 0.55;
    ctx.save(); ctx.rotate(spin);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * k.TAU;
      const x = Math.cos(a) * R, y = Math.sin(a) * R;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      ctx.fillStyle = k.rgba(i % 3 === 0 ? p.color : 'ink', i % 3 === 0 ? 0.9 : 0.55);
      ctx.beginPath(); k.rrect(-4, -9, 8, 18, 4); ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // --- iç kadran: dönen yay segmentleri (ters yön) ---
    ctx.save(); ctx.rotate(-t * 0.9);
    for (let i = 0; i < 3; i++) {
      const a0 = (i / 3) * k.TAU;
      ctx.strokeStyle = k.rgba(p.color, 0.7);
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(0, 0, 44, a0, a0 + 1.4); ctx.stroke();
    }
    ctx.restore();

    // --- merkez göbek ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(5, 5, 24, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(0, 0, 24, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 24, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, k.TAU); ctx.fill();

    // --- at anında üretilen anahtar: 0.35 sn pop ---
    if (firing) {
      const pop = k.E.outBack(k.prog(d, 0, 0.35), 2);
      if (pop > 0) {
        ctx.save();
        ctx.scale(Math.max(pop, 0.01), Math.max(pop, 0.01));
        // anahtar: halka + sap + dişler
        ctx.strokeStyle = k.rgba(p.color, 0.95); ctx.lineWidth = 9;
        ctx.beginPath(); ctx.arc(0, -28, 13, 0, k.TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(0, 34); ctx.stroke();
        ctx.fillStyle = k.rgba(p.color, 0.95);
        ctx.fillRect(0, 8, 14, 8);
        ctx.fillRect(0, 22, 11, 8);
        ctx.restore();
      }
      // kıvılcımlar: 10 parça, 0.6 sn
      for (let i = 0; i < 10; i++) {
        const start = k.hash(150 + i * 13) * 0.15;
        const fly = k.E.outCubic(k.prog(d, start, start + 0.45));
        if (fly <= 0) continue;
        const a = k.hash(190 + i * 7) * k.TAU;
        const rr = 30 + fly * 60;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        const alpha = 1 - k.prog(d, 0.3, 0.6);
        if (alpha <= 0.01) continue;
        k.glow(x, y, 10, p.color, 0.4 * alpha);
        ctx.fillStyle = k.rgba(p.color, 0.9 * alpha);
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
