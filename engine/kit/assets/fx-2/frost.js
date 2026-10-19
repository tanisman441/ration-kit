// fx-2/frost — buzlanma: at anında merkezden dallanan buz kristalleri (0.5–1 sn büyüme)
// + soğuk parıltı; idle'da küçük altıgen çekirdek ve sönüp yanan kıvılcımlar.
// NOT: canvas y-aşağıdır; (0,0) buzlanmanın başladığı merkez.
export default {
  name: 'frost', category: 'fx-2',
  desc: 'Buzlanma: at anında merkezden dallanarak büyüyen buz kristalleri ve soğuk parıltı',
  tags: ['buz', 'frost', 'ice', 'kristal', 'crystal', 'donma', 'freeze', 'soğuk', 'cold', 'kar tanesi'],
  box: [-125, -125, 125, 125],
  bleed: 25,
  anchor: 'merkez (0,0) — buzlanmanın başladığı nokta',
  points: { center: [0, 0], tip: [108, 0] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'buz rengi' },
    at: { type: 'time', default: null, desc: 'buzlanma anı (kristal dallanması)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const NB = 6;

    const branch = (angle, len, w0, alpha) => {
      // ana dal (dış hat + gövde)
      const ex = Math.cos(angle) * len, ey = Math.sin(angle) * len;
      ctx.strokeStyle = k.rgba('bg', 0.55 * alpha);
      ctx.lineWidth = w0 + 3;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.9 * alpha);
      ctx.lineWidth = w0;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke();
      // beyaz buz çekirdeği
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.75 * alpha).toFixed(3) + ')';
      ctx.lineWidth = Math.max(w0 * 0.35, 1.5);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex * 0.92, ey * 0.92); ctx.stroke();
      // yan dallar (%40 ve %65 noktasında, ±0.55 rad)
      for (const f of [0.4, 0.65]) {
        for (const s of [-1, 1]) {
          const bx = Math.cos(angle) * len * f, by = Math.sin(angle) * len * f;
          const sa = angle + s * 0.55;
          const sl = len * (f > 0.5 ? 0.26 : 0.38);
          ctx.strokeStyle = k.rgba(p.color, 0.85 * alpha);
          ctx.lineWidth = w0 * 0.6;
          ctx.beginPath(); ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(sa) * sl, by + Math.sin(sa) * sl); ctx.stroke();
        }
      }
    };

    const sparkle = (x, y, s, a) => {
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
      ctx.fillRect(x - s, y - s * 0.28, s * 2, s * 0.56);
      ctx.fillRect(x - s * 0.28, y - s, s * 0.56, s * 2);
    };

    // ---- olay: 0 → 1.3 sn kristal büyümesi ----
    if (d >= 0 && d < 1.3) {
      const g = k.E.outExpo(k.prog(d, 0, 1.0));
      const al = 1 - k.prog(d, 0.9, 1.3);
      k.glow(0, 0, 46 * (1 - al * 0.4), p.color, 0.5 * (1 - al * 0.5));
      for (let i = 0; i < NB; i++) {
        const h1 = k.hash(i * 13 + 501);
        const angle = (i / NB) * k.TAU + h1 * 0.5;
        const len = 108 * g;
        branch(angle, len, 6.5 * (1 - g * 0.45) + 2, al);
        // uç kıvılcımları (büyüme tamamlanırken belirir)
        if (g > 0.45) {
          const ex = Math.cos(angle) * len, ey = Math.sin(angle) * len;
          const tw = 0.5 + 0.5 * Math.sin(t * 9 + i * 2.1);
          sparkle(ex, ey, 6, 0.85 * al * tw * k.prog(g, 0.45, 0.9));
        }
      }
      // soğuk sis halkası
      const mg = k.prog(d, 0, 1.1);
      ctx.strokeStyle = k.rgba(p.color, 0.25 * (1 - mg));
      ctx.lineWidth = 10 * (1 - mg) + 2;
      ctx.beginPath(); ctx.ellipse(0, 0, 60 + 55 * mg, 60 + 55 * mg, 0, 0, k.TAU); ctx.stroke();
      // rastgele soğuk parıltılar
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 29 + 521), h2 = k.hash(i * 37 + 541);
        const a = h1 * k.TAU, rr = 30 + h2 * 75 * g;
        const tw = 0.5 + 0.5 * Math.sin(t * 8 + i * 3.7);
        sparkle(Math.cos(a) * rr, Math.sin(a) * rr, 4, 0.7 * al * tw);
      }
    }

    // ---- idle: küçük altıgen çekirdek + sönüp yanan kıvılcımlar ----
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
      ctx.strokeStyle = k.rgba(p.color, 0.55 + 0.2 * pulse);
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * k.TAU + t * 0.15;
        const rr = 15 + 2.5 * pulse;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke();
      k.glow(0, 0, 26, p.color, 0.3 + 0.15 * pulse);
      for (let i = 0; i < 3; i++) {
        const h1 = k.hash(i * 43 + 561), h2 = k.hash(i * 47 + 571);
        const a = h1 * k.TAU, rr = 26 + h2 * 40;
        const tw = 0.5 + 0.5 * Math.sin(t * 3.1 + i * 2.4);
        sparkle(Math.cos(a) * rr, Math.sin(a) * rr, 3.5, 0.55 * tw);
      }
    }
    ctx.restore();
  },
};
