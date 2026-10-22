// kitchen-fx-2/pan-flip — sote tavası: flip anında tava öne eğilir, malzemeler havaya fırlar ve geri düşer.
// NOT: canvas y-aşağıdır; tava tabanı y≈20, flip anında malzemeler yukarı (+y'nin tersine) fırlar.
export default {
  name: 'pan-flip', category: 'kitchen-fx-2',
  desc: 'Sote tavası savurması: at anında tava öne eğilir, yemek parçaları havaya fırlar ve tavaya geri düşer',
  tags: ['tava', 'savurma', 'flip', 'sote', 'yemek pişirme', 'pan flip', 'toss', 'stir fry', 'sauté', 'cooking'],
  box: [-180, -215, 225, 105],
  bleed: 55,
  anchor: 'tava gövdesinin merkezi (0,0)',
  points: { pan: [0, 20], food: [0, -50], apex: [0, -185], handle_tip: [196, 12] },
  params: {
    at: { type: 'time', default: null, desc: 'savurma anı (0.6 sn): tava eğilir, malzemeler havaya fırlar ve geri düşer' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const flipping = d >= 0 && d <= 0.6;
    const g = flipping ? k.prog(d, 0, 0.6) : -1;

    // idle: tava hafif sallanır; flip: öne (sağa) eğilir + aşağı çöker
    const sway = flipping ? 0 : Math.sin(t * 2.2) * 0.022;
    const tilt = flipping ? -0.30 * Math.sin(g * Math.PI) : 0;
    const dip = flipping ? 15 * Math.sin(g * Math.PI) : 0;
    ctx.translate(0, dip); ctx.rotate(sway + tilt);

    // --- 1) tava sapı (sağda) + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(122, 14, 84, 20, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(116, 8, 84, 20, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); ctx.arc(188, 18, 5, 0, k.TAU); ctx.fill();
    // sap parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(140, 12, 26, 5, 0, 0, k.TAU); ctx.fill();

    // --- 2) tava gövdesi (eğimli duvarlı sote tavası) + gölge
    const panPath = () => {
      ctx.beginPath();
      ctx.moveTo(-132, -14); ctx.lineTo(132, -14);
      ctx.lineTo(112, 50); ctx.lineTo(-112, 50); ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); panPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    panPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // iç yüzey (koyu şerit)
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath();
    ctx.moveTo(-120, -14); ctx.lineTo(120, -14);
    ctx.lineTo(116, 2); ctx.lineTo(-116, 2); ctx.closePath(); ctx.fill();
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-92, 8, 44, 13, -0.2, 0, k.TAU); ctx.fill();

    // --- 3) malzemeler (4 parça): idle'da hafif zıplar, flip'te parabola ile fırlar
    const chunks = [
      [-86, -58, 27, 21, 0.2], [-28, -80, 33, 25, 1.4],
      [30, -62, 27, 21, 2.7], [84, -76, 31, 23, 3.9],
    ];
    for (let i = 0; i < chunks.length; i++) {
      const [bx, by, w, h, ph] = chunks[i];
      let x = bx, y = by, rot = (k.hash(i * 7 + 1) - 0.5) * 0.6;
      if (flipping) {
        const peak = 130 + k.hash(i * 11 + 2) * 60;         // fırla tepesi
        const rise = Math.sin(g * Math.PI) * peak;           // 0 → tepe → 0
        y = by - rise;
        x = bx + (k.hash(i * 13 + 4) - 0.5) * 120 * g;       // yatay savrulma
        rot += g * 2.4 * (i % 2 ? 1 : -1);
      } else {
        y = by + Math.sin(t * 3.1 + ph) * 2.4;
      }
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = k.rgba('bg', 0.15);
      ctx.beginPath(); ctx.ellipse(6, h / 2 + 6, w / 2, h / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 1);
      ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
      // iç detay + parlama
      ctx.fillStyle = k.rgba('ink', 0.35);
      ctx.beginPath(); ctx.ellipse(0, 2, w / 2 - 8, h / 2 - 9, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(-w / 5, -h / 4, w / 5, h / 5.5, -0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // --- 4) flip hareket izleri (tava çerçevesinde, yukarı kavisli)
    if (flipping) {
      for (let i = 0; i < 4; i++) {
        const sx = -90 + i * 60;
        ctx.strokeStyle = k.rgba('ink', 0.55 * (1 - g));
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(sx, -70);
        ctx.quadraticCurveTo(sx + 10, -130, sx + (k.hash(i * 5) - 0.5) * 40, -70 - 120 * Math.sin(g * Math.PI));
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
