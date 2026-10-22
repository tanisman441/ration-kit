// superhero-fx/speed-lines — hız çizgisi patlaması: at anında çizgiler merkezden dışa fırlar.
// NOT: canvas y-aşağıdır; (0,0) patlamanın merkezi.
export default {
  name: 'speed-lines', category: 'superhero-fx',
  desc: 'Hız çizgisi patlaması: at anında çizgiler merkezden dışa fırlar, boşta hafif titrer',
  tags: ['hız', 'çizgi', 'patlama', 'hareket', 'sürat', 'speed', 'lines', 'burst', 'motion'],
  box: [-185, -185, 185, 185],
  bleed: 30,
  anchor: 'patlamanın merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'hız patlaması anı (çizgiler dışa fırlar, 0.4 sn)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const N = 18;
    ctx.save();
    ctx.lineCap = 'round';

    if (d >= 0 && d <= 0.6) {
      // ---- patlama: çizgiler dışa doğru (0.4 sn) ----
      const g = k.prog(d, 0, 0.4);
      const fade = d < 0.32 ? 1 : 1 - (d - 0.32) / 0.28;
      for (let i = 0; i < N; i++) {
        const h1 = k.hash(i * 3 + 101), h2 = k.hash(i * 7 + 103);
        const a = h1 * k.TAU + d * (h2 - 0.5) * 0.35;   // hafif dönme
        const r0 = 34 + h2 * 30;
        const r1 = r0 + (90 + h1 * 80) * k.E.outCubic(g);
        const x0 = Math.cos(a) * r0, y0 = Math.sin(a) * r0;
        const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1;
        // çizgi: içte kalın, dışa incelen
        ctx.strokeStyle = k.rgba(p.color, (0.85 - h2 * 0.25) * fade);
        ctx.lineWidth = (7 - h1 * 3.5) * (1 - g * 0.4);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        // hız zerresi: çizgi ucunda nokta
        ctx.fillStyle = k.rgba(p.color, 0.6 * fade);
        ctx.beginPath(); ctx.arc(x1, y1, 3.5 - h2 * 1.5, 0, k.TAU); ctx.fill();
      }
      // merkez çakması
      if (d < 0.12) {
        const f = 1 - d / 0.12;
        k.glow(0, 0, 60 * f, p.color, 0.4 * f);
      }
    } else {
      // ---- idle: hafif titreşim ----
      for (let i = 0; i < N; i++) {
        const h1 = k.hash(i * 3 + 101), h2 = k.hash(i * 7 + 103);
        const a = h1 * k.TAU;
        const jx = k.noise1(i * 2.3 + t * 6) * 2.5;
        const jy = k.noise1(i * 3.1 + t * 6) * 2.5;
        const r0 = 30 + h2 * 34, r1 = r0 + 26 + h1 * 30;
        const x0 = Math.cos(a) * r0 + jx, y0 = Math.sin(a) * r0 + jy;
        const x1 = Math.cos(a) * r1 + jx, y1 = Math.sin(a) * r1 + jy;
        ctx.strokeStyle = k.rgba(p.color, 0.28 + 0.1 * Math.sin(t * 3 + i * 1.7));
        ctx.lineWidth = 4 - h1 * 1.5;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
