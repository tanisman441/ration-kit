// combat-fx/ko-stars — nakavt yıldızları: boşta dönen yörünge yıldızları, ko anında dışa sarmal.
// NOT: canvas y-aşağıdır; (0,0) yıldız yörüngesinin merkezi (baygın karakterin başı).
export default {
  name: 'ko-stars',
  category: 'combat-fx',
  desc: 'Nakavt yıldızları: boşta baş çevresinde dönen yıldızlar, ko anında dışa sarmal patlama',
  tags: ['yıldız', 'nakavt', 'baygın', 'sarmal', 'dönme', 'ko', 'knockout', 'stars', 'dizzy', 'spiral'],
  box: [-175, -135, 175, 135],
  bleed: 60,
  anchor: 'yıldız yörüngesinin merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    ko: { type: 'time', default: null, desc: 'nakavt anı (yıldızlar dışa sarmal, 1.2 sn)' },
    count: { type: 'number', default: 5, desc: 'yıldız sayısı (3–7)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.ko == null ? -1 : t - p.ko;
    const bursting = d >= 0 && d <= 1.25;
    const n = Math.round(k.clamp(p.count, 3, 7));
    ctx.save();

    function star(cx, cy, r, rot, alpha) {
      ctx.fillStyle = k.rgba(p.color, alpha);
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

    // 1) ko flaşı — sarmalın başındaki kısa çakma
    if (bursting && d < 0.14) {
      const f = 1 - d / 0.14;
      k.glow(0, 0, 90 * f, p.color, 0.35 * f);
    }

    // 2) yıldızlar — idle yörünge, ko anında dışa sarmal
    const spin = t * k.TAU / 2.4;
    const burstG = bursting ? k.prog(d, 0, 1.15) : 0;
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 5 + 81);
      const ang = spin * (1 + burstG * 2.2) + i * k.TAU / n + h1 * 0.6;
      // yörünge yarıçapı: ko'da 75 → 165'e sarmal açılır
      const rx = 78 + 87 * k.E.outCubic(burstG);
      const ry = 32 + 44 * k.E.outCubic(burstG);
      const x = Math.cos(ang) * rx;
      const y = Math.sin(ang) * ry - 6;
      // boyut: ko'da büyür, sonda söner
      const sr = (12 + h1 * 3) * (1 + burstG * 0.5);
      const fade = bursting ? k.clamp(1 - k.prog(d, 0.85, 1.25), 0, 1) : 1;
      const twinkle = 0.7 + 0.3 * (0.5 + 0.5 * k.noise1(t * 2 + i * 4));
      const alpha = 0.85 * twinkle * fade;
      if (alpha > 0.01) star(x, y, sr, ang * 1.5 + t * 0.8, alpha);
      // yıldız izi — ko sırasında arkalarında kalan ışık çizgisi
      if (bursting && d > 0.1 && fade > 0.05) {
        const trailA = ang - 0.5 * (1 + burstG * 2);
        const tx2 = Math.cos(trailA) * (rx - 26), ty2 = Math.sin(trailA) * (ry - 12) - 6;
        ctx.strokeStyle = k.rgba(p.color, 0.35 * fade * (1 - burstG * 0.6));
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx2, ty2);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }

    // 3) merkez şoku — ko'da küçük şok halkası
    if (bursting && d > 0.05) {
      const g = k.prog(d - 0.05, 0, 0.5);
      const rad = 24 + 70 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(p.color, 0.45 * (1 - g));
      ctx.lineWidth = 5 * (1 - g * 0.6) + 1.5;
      ctx.beginPath();
      ctx.arc(0, -6, rad, 0, k.TAU);
      ctx.stroke();
    }
    ctx.restore();
  },
};
