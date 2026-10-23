// night-fx/moon-rise — ay: krater detaylı dolunay; rise 0–1 ile ufuk çizgisinden
// yükselir, ayrıca ~12 sn'lik yavaş yükselme-alçalma döngüsüyle canlı kalır.
// NOT: canvas y-aşağıdır; ufuk y≈110'dadır, ay rise=0'da ufukta, rise=1'de tepededir.
export default {
  name: 'moon-rise', category: 'night-fx',
  desc: 'Kraterli dolunay; rise ile ufuktan yükselir, yavaş döngüyle salınır',
  tags: ['ay', 'dolunay', 'gece', 'gökyüzü', 'ufuk', 'krater', 'moon', 'night', 'sky', 'horizon', 'lunar'],
  box: [-170, -170, 170, 140],
  bleed: 30,
  anchor: 'merkez (0,0); ufuk çizgisi y=110',
  points: { crest: [0, -110], horizon: [0, 110] },
  params: {
    color: { type: 'color', default: 'yellow' },
    rise: { type: 'number', default: 0.65, desc: '0–1: ayın ufuk üstü yüksekliği (0=ufukta, 1=tepede)' },
  },
  draw(ctx, t, p, k) {
    const LW = 8;
    const line = k.rgba('bg', 0.55);
    const R = k.clamp(p.rise, 0, 1);
    // yavaş döngü: ~12 sn'de yükselip alçalma (±14 birim)
    const cyc = Math.sin((t / 12) * k.TAU) * 14;
    const my = 110 - (110 + 96) * R + cyc * (1 - Math.abs(R - 0.5));
    const mx = 0 + Math.sin(t * 0.22) * 5;

    // --- ay diski ---
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(mx, my, 62 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(mx, my, 62, 0, k.TAU); ctx.fill();
    // hale
    k.glow(mx, my, 110, p.color, 0.28);
    // kraterler (iç detay: ink alfa 0.35, ince)
    const craters = [[-18, -14, 12], [14, -22, 9], [4, 8, 15], [-26, 18, 7], [26, 14, 6]];
    ctx.fillStyle = k.rgba('ink', 0.18);
    for (const [cx, cy, cr] of craters) {
      ctx.beginPath(); ctx.arc(mx + cx, my + cy, cr, 0, k.TAU); ctx.fill();
    }
    ctx.strokeStyle = k.rgba('ink', 0.30); ctx.lineWidth = 3;
    for (const [cx, cy, cr] of craters) {
      ctx.beginPath(); ctx.arc(mx + cx, my + cy, cr, 0, k.TAU); ctx.stroke();
    }
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(mx - 22, my - 26, 24, 14, -0.5, 0, k.TAU); ctx.fill();

    // --- ufuk silueti (koyu bant: ink/dim, arka plan boyası değil) ---
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-170, 140);
    ctx.lineTo(-170, 112);
    const roofs = [[-170, 108], [-128, 96], [-96, 108], [-60, 100], [-28, 110], [8, 94], [44, 108], [80, 98], [116, 110], [150, 102], [170, 110]];
    for (const [rx, ry] of roofs) ctx.lineTo(rx, ry);
    ctx.lineTo(170, 112); ctx.lineTo(170, 140);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath();
    ctx.moveTo(-170, 140);
    ctx.lineTo(-170, 108);
    for (const [rx, ry] of roofs) ctx.lineTo(rx, ry - 4);
    ctx.lineTo(170, 108); ctx.lineTo(170, 140);
    ctx.closePath(); ctx.fill();

    // --- birkaç yıldız (y-aşağı: yıldızlar yukarıda) ---
    for (let i = 0; i < 14; i++) {
      const sx = -150 + k.hash(i * 7.3 + 2) * 300;
      const sy = -160 + k.hash(i * 3.9 + 5) * 130;
      const tw = 0.35 + 0.30 * Math.sin(t * 2.4 + i * 1.7);
      if (tw <= 0.05) continue;
      ctx.fillStyle = k.rgba('ink', tw);
      ctx.beginPath(); ctx.arc(sx, sy, 1.6 + k.hash(i * 11.1) * 1.8, 0, k.TAU); ctx.fill();
    }
  },
};
