// tech/data-center — veri merkezi salonu: koridorun iki yanında sunucu kabinleri,
// yük arttıkça LED'ler yanar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; zemin (0,0), salon negatif y yönünde yukarı uzar.
export default {
  name: 'data-center', category: 'tech',
  desc: 'Veri merkezi salonu; koridorun iki yanında kabinler, yük arttıkça LED yanar',
  tags: ['veri merkezi', 'sunucu', 'data center', 'server hall', 'salon', 'bilgisayar', 'ağ', 'network', 'sunucu odası'],
  box: [-420, -260, 420, 20],
  bleed: 15,
  anchor: 'zemin merkezi (0,0); salon yukarı uzar',
  points: { center: [0, -120], rackL: [-290, -105], rackR: [290, -105] },
  params: {
    color: { type: 'color', default: 'panel2' },
    load: { type: 'number', default: 0.4, desc: 'yanan LED oranı (0-1)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 5;
    const cab = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    const load = k.clamp(p.load, 0, 1);

    // kabin çizici: (cx, tabanY, w, h) -> ünite satırları ve LED'ler
    const rack = (cx, baseY, w, h, unitRows, seed) => {
      blob(cx - w / 2, baseY - h, w, h, 10, cab);
      const total = unitRows * 3;
      const lit = Math.round(load * total);
      let li = 0;
      for (let r = 0; r < unitRows; r++) {
        const uy = baseY - h + 10 + r * ((h - 20) / unitRows);
        const uh = (h - 20) / unitRows - 8;
        blob(cx - w / 2 + 8, uy, w - 16, uh, 6, k.rgba('panel'));
        for (let cix = 0; cix < 3; cix++) {
          const x = cx + w / 2 - 18 - cix * 14, y = uy + uh / 2;
          let cc;
          if (li < lit) {
            const tw = 0.72 + 0.28 * Math.sin(t * 3 + k.hash(seed + li * 3 + 1) * k.TAU);
            cc = k.rgba('green', tw);
            if (k.hash(seed + li * 7 + 2) > 0.6) k.glow(x, y, 13, 'green', 0.28);
          } else {
            cc = k.rgba('dim', 0.45);
          }
          dot(x, y, w > 110 ? 4.5 : 3.5, cc);
          li++;
        }
      }
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - w / 2 + 18, baseY - h + 16, 14, 8, -0.4, 0, k.TAU); ctx.fill();
    };

    // zemin gölgesi + koridor şeridi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 400, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.25);
    ctx.beginPath(); k.rrect(-46, -14, 92, 12, 6); ctx.fill();

    // arka sıra (küçük, derinde) + zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, -72, 300, 8, 0, 0, k.TAU); ctx.fill();
    rack(-215, -70, 96, 118, 3, 11);
    rack(0, -70, 96, 118, 3, 47);
    rack(215, -70, 96, 118, 3, 83);

    // ön sıra (büyük, koridorun iki yanı)
    rack(-292, -6, 138, 196, 4, 101);
    rack(292, -6, 138, 196, 4, 137);

    // tavan ışık barları (nesne olarak)
    const bar = (x) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - 70, -256, 140, 14, 7); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.85); ctx.beginPath(); k.rrect(x - 66, -253, 132, 8, 4); ctx.fill();
      k.glow(x, -249, 40, 'ink', 0.18);
    };
    bar(-190); bar(190);

    ctx.restore();
  },
};
