// battle-fx/hit-spark — vuruşta parıltı: darbe anında 4-köşe yıldız çakması + ince kıvılcım çizgileri.
// NOT: canvas y-aşağıdır; (0,0) vuruş noktasıdır. Idle'da hedef işareti hafifçe nabız atar.
export default {
  name: 'hit-spark',
  category: 'battle-fx',
  desc: 'Vuruş parıltısı: darbe anında 4-köşe yıldız çakması ve etrafa saçılan ince kıvılcım çizgileri',
  tags: ['vuruş', 'darbe', 'parıltı', 'kıvılcım', 'çarpma', 'hit', 'spark', 'strike', 'impact'],
  box: [-150, -150, 150, 150],
  bleed: 40,
  anchor: 'vuruş noktası (0,0)',
  points: { center: [0, 0], edge: [110, 0] },
  params: {
    hit: { type: 'time', default: null, desc: 'vuruş anı (0.35 sn: yıldız çakması + kıvılcımlar)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: parıltı büyüklüğü' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.hit == null ? -1 : t - p.hit;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // Idle: hedef noktada hafif nabız — vuruş öncesi gerilim
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      ctx.strokeStyle = k.rgba(p.color, 0.25 + 0.2 * pulse);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, (18 + 6 * pulse) * S, 0, k.TAU);
      ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.5 + 0.3 * pulse);
      ctx.beginPath();
      ctx.moveTo(-14 * S, 0); ctx.lineTo(-6 * S, 0);
      ctx.moveTo(14 * S, 0); ctx.lineTo(6 * S, 0);
      ctx.moveTo(0, -14 * S); ctx.lineTo(0, -6 * S);
      ctx.moveTo(0, 14 * S); ctx.lineTo(0, 6 * S);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (d > 0.6) { ctx.restore(); return; }

    function star(cx, cy, r, rot, col, alpha) {
      ctx.fillStyle = k.rgba(col, alpha);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = rot + i * Math.PI / 4;
        const rr = i % 2 === 0 ? r : r * 0.32;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    // 1) çekirdek çakma — 0.14 sn'lik parlak 4-köşe yıldız
    if (d < 0.14) {
      const f = 1 - d / 0.14;
      k.glow(0, 0, 78 * S * f, p.color, 0.5 * f);
      star(0, 0, (56 - d * 210) * S, d * 10, p.color, 0.95 * f);
      star(0, 0, (28 - d * 110) * S, -d * 16, 'bg', 0.9 * f);
    }

    // 2) kıvılcım çizgileri — merkezden dışa fırlayan ince çizgiler (0.35 sn)
    const g = k.prog(d, 0.03, 0.5);
    for (let i = 0; i < 9; i++) {
      const h1 = k.hash(i * 7 + 11), h2 = k.hash(i * 13 + 17);
      const a = h1 * k.TAU;
      const e = k.E.outExpo(g);
      const r0 = 20 * S, r1 = (52 + h2 * 88) * S;
      const e2 = k.E.outExpo(Math.min(g * 1.15, 1));
      const x1 = Math.cos(a) * (r0 + (r1 - r0) * e2);
      const y1 = Math.sin(a) * (r0 + (r1 - r0) * e2);
      const xa = Math.cos(a) * (r0 + (r1 - r0) * e);
      const ya = Math.sin(a) * (r0 + (r1 - r0) * e);
      ctx.strokeStyle = k.rgba(h2 > 0.5 ? p.color : 'ink', 0.85 * (1 - g));
      ctx.lineWidth = (3.5 * (1 - g) + 1) * S;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(xa, ya);
      ctx.lineTo(xa + (x1 - xa) * 0.4, ya + (y1 - ya) * 0.4);
      ctx.stroke();
      // çizgi ucunda küçük kıvılcım noktası
      ctx.fillStyle = k.rgba(p.color, 0.9 * (1 - g));
      ctx.beginPath();
      ctx.arc(x1, y1, (4.5 - g * 2.5) * S, 0, k.TAU);
      ctx.fill();
    }

    // 3) genişleyen ince halka — etki hissi
    const rg = k.prog(d, 0.05, 0.45);
    if (rg < 1) {
      ctx.strokeStyle = k.rgba(p.color, 0.55 * (1 - rg));
      ctx.lineWidth = (6 * (1 - rg) + 1) * S;
      ctx.beginPath();
      ctx.arc(0, 0, (16 + 104 * k.E.outCubic(rg)) * S, 0, k.TAU);
      ctx.stroke();
    }
    ctx.restore();
  },
};
