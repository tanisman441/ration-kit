// tech/database — silindir veritabanı: aktivite arttıkça veri akışı hızlanır, bant LED'leri yanar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), silindir negatif y yönünde yukarı uzar.
export default {
  name: 'database', category: 'tech',
  desc: 'Silindir veritabanı; aktivite arttıkça içinde veri parçacıkları yükselir, bant LEDleri yanar',
  tags: ['veritabanı', 'database', 'veri', 'silindir', 'sql', 'depolama', 'data', 'storage', 'server'],
  box: [-80, -172, 80, 10],
  bleed: 10,
  anchor: 'taban (0,0); silindir yukarı uzar',
  points: { top: [0, -162], side: [64, -75] },
  params: {
    color: { type: 'color', default: 'panel2' },
    activity: { type: 'number', default: 0.5, desc: 'aktivite (0-1): veri akış hızı ve yanan LED sayısı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const act = k.clamp(p.activity, 0, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 72, 9, 0, 0, k.TAU); ctx.fill();

    // gövde
    blob(-60, -148, 120, 140, 22, body);
    // üst kapak (elips) + iç açıklık
    disc(0, -148, 60, 17, k.rgba('panel'));
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.ellipse(0, -148, 42, 11, 0, 0, k.TAU); ctx.fill();

    // bant ayraçları (2 çizgi → 3 bant)
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    for (const by of [-104, -60]) {
      ctx.beginPath(); ctx.moveTo(-58, by); ctx.lineTo(58, by); ctx.stroke();
    }

    // bant LED'leri (sağda)
    const lit = Math.round(act * 3);
    const bands = [-126, -82, -38];
    bands.forEach((by, i) => {
      if (i < lit) {
        const tw = 0.65 + 0.35 * Math.sin(t * (2 + act * 5) + i * 2.2);
        dot(44, by, 5, k.rgba('cyan', tw));
        if (tw > 0.85) k.glow(44, by, 15, 'cyan', 0.28);
      } else {
        dot(44, by, 5, k.rgba('dim', 0.45));
      }
    });

    // veri akışı: yükselen parçacıklar (hız aktiviteye bağlı)
    if (act > 0.02) {
      const n = 2 + Math.round(act * 4);
      for (let i = 0; i < n; i++) {
        const ph = (t * (0.25 + act * 0.9) + k.hash(i * 13) ) % 1;
        const y = -24 - ph * 108;
        const x = (k.hash(i * 7) - 0.5) * 76;
        const a = Math.sin(ph * Math.PI) * (0.35 + act * 0.55);
        dot(x, y, 3.5, k.rgba('cyan', a));
      }
    }
  },
};
