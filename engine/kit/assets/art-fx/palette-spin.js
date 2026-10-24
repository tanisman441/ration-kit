// art-fx/palette-spin — ressam paleti: spin 0-1 kadar döner,
// boştayken hafifçe sallanır; üstünde boya topakları ve başparmak deliği.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = palet merkezi.
export default {
  name: 'palette-spin', category: 'art-fx',
  desc: 'Boya topaklı ressam paleti; spin kadar döner, boştayken hafif sallanır',
  tags: ['palet', 'ressam', 'boya', 'renk', 'sanat', 'palette', 'painter', 'paint', 'colors', 'art'],
  box: [-160, -130, 160, 130],
  bleed: 0,
  anchor: 'palet merkezi (0,0)',
  points: { center: [0, 0], edge: [110, 0] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'ana boya topağının rengi' },
    spin: { type: 'number', default: 0, desc: 'dönüş miktarı (0-1: tam tur)' },
  },
  draw(ctx, t, p, k) {
    const LW = 9;
    const line = k.rgba('bg', 0.55);
    const rot = p.spin * k.TAU + Math.sin(t * 1.8) * 0.06; // dönüş + idle sallantı

    ctx.save();
    ctx.beginPath(); ctx.rect(-165, -135, 330, 270); ctx.clip();
    ctx.rotate(rot);

    // palet gövdesi (dim)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 0, 110 + LW / 2, 80 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); ctx.ellipse(0, 0, 110, 80, 0, 0, k.TAU); ctx.fill();
    // premium parlama: sol üst beyaz elips
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-48, -38, 44, 20, -0.45, 0, k.TAU); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(52, 40, 44, 20, -0.45, 0, k.TAU); ctx.fill();

    // boya topakları (hafif dalgalı daireler)
    const blob = (bx, by, r, col, seed) => {
      ctx.beginPath();
      for (let i = 0; i <= 22; i++) {
        const th = (i / 22) * k.TAU;
        const rr = r * (1 + 0.16 * k.noise1(seed + th * 1.3));
        const x = bx + Math.cos(th) * rr, y = by + Math.sin(th) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = k.rgba(col, 1); ctx.fill();
    };
    blob(-58, -28, 22, p.color, 2.2);   // ana vurgu rengi
    blob(-8, 42, 17, 'ink', 5.9);
    blob(46, -34, 15, 'dim', 8.4);
    blob(28, 56, 12, 'panel2', 11.1);
    // ana topakta parlama
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-64, -34, 9, 5, -0.5, 0, k.TAU); ctx.fill();

    // başparmak deliği
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(72, 28, 16 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 1);
    ctx.beginPath(); ctx.arc(72, 28, 16, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(72, 28, 16, 0, k.TAU); ctx.stroke();

    ctx.restore();
  },
};
