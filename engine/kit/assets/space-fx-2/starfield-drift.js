// space-fx-2/starfield-drift — yıldız alanı: üç katmanlı paralaks yıldızlar sürekli kayar
// (idle); `warp` anında 1.2 sn yıldızlar çizgilere uzayarak hızlanır.
// NOT: canvas y-aşağıdır; (0,0) alan merkezidir. Kayma sola (x-) doğrudur.
export default {
  name: 'starfield-drift',
  category: 'space-fx-2',
  desc: 'Yıldız alanı: üç katmanlı paralaks yıldızlar sürekli kayar, anı gelince warp sıçraması',
  tags: ['yıldız', 'uzay', 'paralaks', 'kayan', 'gece', 'warp', 'sıçrama', 'starfield', 'stars', 'parallax', 'drift', 'space', 'warp'],
  box: [-190, -120, 190, 120],
  bleed: 100,
  anchor: 'alan merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    speed: { type: 'number', default: 1, desc: '0–3: kayma hızı' },
    warp: { type: 'time', default: null, desc: 'warp anı: 1.2 sn yıldızlar çizgiye uzar' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.warp == null ? -1 : t - p.warp;
    const S = k.clamp(p.size, 0.5, 1.5);
    const spd = k.clamp(p.speed, 0, 3);
    ctx.save();

    const W = 380 * S, H = 240 * S;

    // --- warp çarpanı: 1.2 sn, sinüsle girip çıkar ---
    let warpK = 0;
    if (d >= 0 && d < 1.2) warpK = Math.sin(Math.PI * k.prog(d, 0, 1.2));
    const warpBoost = 1 + 5 * warpK;

    // --- üç paralaks katmanı: uzak (yavaş, sönük) → yakın (hızlı, parlak) ---
    const layers = [
      { n: 34, v: 18, sz: 2.2, col: 'dim', a: 0.55, stretch: 0.3 },
      { n: 20, v: 46, sz: 3.4, col: 'dim', a: 0.8, stretch: 0.7 },
      { n: 12, v: 96, sz: 5.2, col: 'yellow', a: 0.95, stretch: 1.4 },
    ];
    for (let L = 0; L < 3; L++) {
      const ly = layers[L];
      for (let i = 0; i < ly.n; i++) {
        const seed = L * 1000 + i;
        const hx = k.hash(seed * 7 + 201), hy = k.hash(seed * 13 + 217), hs = k.hash(seed * 29 + 233);
        const span = W;
        // kayma + sarmalama (wrap): hız katmana göre, warp'ta hızlanır
        const xx = ((hx * span - t * ly.v * spd * warpBoost) % span + span) % span - span / 2;
        const yy = (hy - 0.5) * H + k.noise1(t * 2 + seed) * 4 * S;
        const tw = 0.6 + 0.4 * k.noise1(t * 9 + seed * 3);       // idle titreme
        const r = ly.sz * S * (0.7 + 0.6 * hs) * tw;
        const str = warpK * ly.stretch * (30 + 40 * hs) * S;     // warp uzaması
        if (str > 1) {
          // yıldız çizgiye uzar
          ctx.strokeStyle = k.rgba(ly.col, ly.a * tw);
          ctx.lineWidth = r * 1.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(xx + str, yy);
          ctx.lineTo(xx - str * 0.3, yy);
          ctx.stroke();
          ctx.fillStyle = k.rgba('bg', 0.9 * tw);
          ctx.beginPath(); ctx.arc(xx + str * 0.6, yy, r * 0.8, 0, k.TAU); ctx.fill();
        } else {
          ctx.fillStyle = k.rgba(ly.col, ly.a * tw);
          ctx.beginPath(); ctx.arc(xx, yy, r, 0, k.TAU); ctx.fill();
          // parlak yakın yıldızlarda minik parlama
          if (L === 2 && hs > 0.5) {
            ctx.fillStyle = k.rgba('bg', 0.10 * tw);
            ctx.beginPath(); ctx.ellipse(xx - r * 0.3, yy - r * 0.35, r * 0.45, r * 0.3, -0.5, 0, k.TAU); ctx.fill();
          }
        }
      }
    }

    ctx.restore();
  },
};
