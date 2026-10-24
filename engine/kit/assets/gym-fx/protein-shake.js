// gym-fx/protein-shake — çalkalanan protein shaker şişesi; sıvı çalkalanır, baloncuklar yükselir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; şişe tabanı (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'protein-shake',
  category: 'gym-fx',
  desc: 'Protein shaker şişesi; at anında çalkalanır, sıvı dalgalanır ve baloncuklar yükselir',
  tags: ['protein', 'shaker', 'protein shake', 'sporcu içeceği', 'çalkalama', 'shaker bottle', 'spor salonu', 'gym', 'fitness'],
  box: [-90, -200, 90, 12],
  bleed: 40,
  anchor: 'şişe tabanı (0,0); şişe boyu ~190 birim',
  points: { top: [0, -190], cap: [0, -170], liquid: [0, -80], base: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'çalkalama anı — 0.8 sn boyunca şişe hızlı sallanır, sıvı sıçrar; null ise sıvı hafif dalgalanır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), acc = k.rgba('accent');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;
    const shaking = d >= 0 && d <= 0.8;
    const env = shaking ? Math.sin((d / 0.8) * Math.PI) : 0;   // 0→1→0 zarfı
    const shX = shaking ? 13 * env * Math.sin(d * k.TAU * 6) : 0;
    const tilt = shaking ? 0.13 * env * Math.sin(d * k.TAU * 6) : 0.02 * Math.sin(t * k.TAU / 2.4);
    const wave = shaking ? 7 * env : 2;                       // sıvı dalga genliği
    const wavePh = t * k.TAU * (shaking ? 6 : 0.8);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(shX, -4, 56, 9, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.translate(shX, 0); ctx.rotate(tilt);

    // gövde
    blob(-55, -155, 110, 155, 22, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge
    ctx.beginPath(); ctx.ellipse(34, -80, 12, 55, 0.08, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-32, -110, 10, 34, -0.1, 0, k.TAU); ctx.fill();

    // sıvı: dalgalı üst yüzey, şişe içinde kırpılır gibi çizilir
    const surfY = -118;
    ctx.save();
    ctx.beginPath(); ctx.rect(-50, surfY - 14, 100, 118); ctx.clip();
    ctx.fillStyle = acc;
    ctx.beginPath();
    ctx.moveTo(-50, surfY);
    for (let x = -50; x <= 50; x += 5) {
      ctx.lineTo(x, surfY + Math.sin((x / 50) * Math.PI + wavePh) * wave);
    }
    ctx.lineTo(50, 0); ctx.lineTo(-50, 0); ctx.closePath(); ctx.fill();
    // baloncuklar (çalkalanırken yükselir)
    const nb = shaking ? 7 : 2;
    for (let i = 0; i < nb; i++) {
      const h1 = k.hash(i * 7 + 3), h2 = k.hash(i * 13 + 9);
      const rise = shaking ? ((t * 90 + h2 * 100) % 110) : h2 * 40;
      ctx.fillStyle = k.rgba('bg', 0.45);
      ctx.beginPath(); ctx.ellipse(-42 + h1 * 84, -16 - rise, 4 + h1 * 3, 4 + h1 * 3, 0, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // ölçü çizgileri (iç detay → ink, ince)
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    for (const yy of [-60, -90]) {
      ctx.beginPath(); ctx.moveTo(-50, yy); ctx.lineTo(-28, yy); ctx.stroke();
    }

    // kapak + ağızlık
    blob(-48, -188, 96, 34, 12, k.rgba('panel2'));
    blob(-20, -198, 40, 12, 6, k.rgba('panel2'));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, -178, 10, 6, -0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // çalkalama hız çizgileri + sıçrayan damlalar
    if (env > 0) {
      ctx.strokeStyle = k.rgba('ink', 0.35 * env); ctx.lineWidth = 4;
      for (const s of [-1, 1]) {
        for (let i = 0; i < 2; i++) {
          const yy = -160 - i * 30;
          ctx.beginPath(); ctx.moveTo(s * 72, yy); ctx.lineTo(s * 88, yy); ctx.stroke();
        }
      }
      for (let i = 0; i < 3; i++) {
        const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 5 + 4);
        ctx.fillStyle = acc;
        ctx.globalAlpha = 0.8 * env;
        ctx.beginPath(); ctx.ellipse(-30 + h1 * 60, -205 - h2 * 22 * env, 4, 5.5, 0, 0, k.TAU); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  },
};
