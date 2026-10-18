// health/mask — önden görünüm cerrahi maske; pilili gövde, burun teli ve kulak lastikleriyle.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) maskenin merkezidir.
export default {
  name: 'mask', category: 'health',
  desc: 'Cerrahi maske; boştayken nefes alır gibi hafifçe şişer, cough anında öksürükle damlacıklar saçar',
  tags: ['maske', 'cerrahi maske', 'korunma', 'mask', 'surgical mask', 'protection', 'covid', 'sağlık', 'hijyen'],
  box: [-110, -80, 110, 80],
  bleed: 65,
  anchor: 'maskenin merkezi (0,0)',
  points: { center: [0, 0], top: [0, -52] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'maske rengi' },
    cough: { type: 'time', default: null, desc: 'öksürük anı: şişme + damlacıklar (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.cough == null ? -1 : t - p.cough;
    const g = d < 0 ? 0 : k.prog(d, 0, 0.7);

    // idle nefes: 2.4 sn periyot
    let sx = 1 + 0.015 * Math.sin(t * 2.6 + 1);
    let sy = 1 + 0.030 * Math.sin(t * 2.6);
    if (g > 0 && g < 0.6) {   // öksürük şişmesi
      const b = 1 + 0.13 * Math.sin((g / 0.6) * Math.PI);
      sx *= b; sy *= b;
    }

    const body = () => { ctx.beginPath(); k.rrect(-72, -52, 144, 104, 34); };

    ctx.save();
    ctx.scale(sx, sy);

    // gölge (sağ alt %12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(7, 6); body(); ctx.fill(); ctx.restore();
    // dış hat + gövde
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-72 - LW / 2, -52 - LW / 2, 144 + LW, 104 + LW, 37); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); body(); ctx.fill();

    // pililer (iç ayrım çizgileri)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const py of [-20, 0, 20]) {
      ctx.beginPath(); ctx.moveTo(-56, py); ctx.lineTo(56, py); ctx.stroke();
    }
    // burun teli
    ctx.fillStyle = k.rgba('ink', 0.25);
    ctx.beginPath(); k.rrect(-30, -52, 60, 12, 6); ctx.fill();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -26, 26, 13, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();

    // kulak lastikleri (serbest çizgi: ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-72, -34); ctx.quadraticCurveTo(-102, 0, -72, 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(72, -34); ctx.quadraticCurveTo(102, 0, 72, 34); ctx.stroke();

    // öksürük damlacıkları (sağ tarafa saçılır)
    if (g > 0.2) {
      const dg = k.prog(g, 0.2, 1);
      for (let i = 0; i < 5; i++) {
        const a = (i - 2) * 0.28;
        const r = dg * (55 + k.hash(i * 7 + 1) * 30);
        ctx.save();
        ctx.globalAlpha = 1 - dg;
        ctx.fillStyle = k.rgba(p.color);
        ctx.beginPath();
        ctx.arc(72 * sx + Math.cos(a) * r, Math.sin(a) * r, 3.5 + k.hash(i * 3) * 2.5, 0, k.TAU);
        ctx.fill();
        ctx.restore();
      }
    }
  },
};
