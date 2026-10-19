// combat-fx/punch-impact — yumruk çarpma patlaması: impact anında radyal halkalar + yıldız kıvılcımlar.
// NOT: canvas y-aşağıdır; (0,0) çarpmanın merkezi.
export default {
  name: 'punch-impact',
  category: 'combat-fx',
  desc: 'Yumruk çarpma patlaması: impact anında radyal halka ve yıldız kıvılcımları saçan vuruş efekti',
  tags: ['yumruk', 'çarpma', 'patlama', 'vuruş', 'darbe', 'punch', 'impact', 'hit', 'strike'],
  box: [-170, -170, 170, 170],
  bleed: 50,
  anchor: 'çarpmanın merkezi (0,0)',
  points: { center: [0, 0], ring: [125, 0] },
  params: {
    impact: { type: 'time', default: null, desc: 'çarpma anı (halka + kıvılcımlar)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: patlama büyüklüğü' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.impact == null ? -1 : t - p.impact;
    if (d < 0 || d > 1.0) return;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    function star(cx, cy, r, rot, col, alpha) {
      ctx.fillStyle = k.rgba(col, alpha);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = rot + i * Math.PI / 5;
        const rr = i % 2 === 0 ? r : r * 0.45;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    // 1) ilk çakma — yıldız formunda parlak çekirdek (0.12 sn)
    if (d < 0.12) {
      const f = 1 - d / 0.12;
      k.glow(0, 0, 70 * S * f, 'yellow', 0.45 * f);
      star(0, 0, (44 - d * 160) * S, d * 9, 'yellow', 0.9 * f);
      star(0, 0, (22 - d * 60) * S, -d * 14, 'bg', 0.85 * f);
    }

    // 2) radyal halkalar — 3 kademeli genişleyen halka
    for (let r = 0; r < 3; r++) {
      const rr = d - r * 0.08;
      if (rr < 0) continue;
      const g = k.prog(rr, 0, 0.7);
      const rad = (14 + 118 * k.E.outExpo(g)) * S;
      ctx.strokeStyle = r === 0 ? k.rgba('yellow', 0.65 * (1 - g)) : k.rgba(p.color, 0.4 * (1 - g));
      ctx.lineWidth = ((r === 0 ? 8 : 5) * (1 - g * 0.6) + 1.5) * S;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, k.TAU);
      ctx.stroke();
    }

    // 3) yıldız kıvılcımlar — dışa saçılan, dönen yıldız parçacıklar
    const g = k.prog(d, 0.06, 0.85);
    for (let i = 0; i < 11; i++) {
      const h1 = k.hash(i * 5 + 41), h2 = k.hash(i * 9 + 43);
      const a = h1 * k.TAU;
      const dist = (46 + h2 * 118) * S * k.E.outCubic(g);
      const x = Math.cos(a) * dist + k.noise1(i * 3 + d * 6) * 6;
      const y = Math.sin(a) * dist + k.noise1(i * 7 + d * 6) * 6;
      const sr = (11 + h2 * 9) * S * (1 - g * 0.7);
      star(x, y, sr, a + d * (4 + h1 * 6), 'yellow', 0.85 * (1 - g));
    }

    // 4) ince toz — halka gerisinde kalan dim zerreler
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 13 + 47), h2 = k.hash(i * 17 + 49);
      const a = h2 * k.TAU;
      const dist = (30 + h1 * 95) * S * k.E.outCubic(Math.min(g * 1.2, 1));
      ctx.fillStyle = k.rgba(p.color, 0.4 * (1 - g));
      ctx.beginPath();
      ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, 2.5 + h2 * 4, 0, k.TAU);
      ctx.fill();
    }
    ctx.restore();
  },
};
