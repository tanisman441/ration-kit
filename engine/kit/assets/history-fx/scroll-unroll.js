// history-fx/scroll-unroll — antika parşömen tomarı; at anında rulo açılır, mürekkep satırlar belirir.
// NOT: canvas y-aşağıdır; (0,0) = tomarın merkezi. Açılma soldan sağa doğrudur.
const LW = 5;
function R(ctx, k, x, y, w, h, r, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
}
function C(ctx, k, x, y, r, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
}
export default {
  name: 'scroll-unroll', category: 'history-fx',
  desc: 'Antika parşömen tomarı; at anında soldan sağa açılır, mürekkep satırlar ve mühür belirir',
  tags: ['parşömen', 'tomar', 'tarih', 'antik', 'yazı', 'mühür', 'fırça', 'scroll', 'parchment', 'history', 'ancient', 'manuscript'],
  box: [-178, -64, 178, 64],
  bleed: 26,
  anchor: 'tomarın merkezi (0,0); açılma soldan sağa',
  points: { tip: [118, 0], roll: [-140, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'tomarın açılma anı (1.2 sn: rulo açılışı + satırlar + mühür)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const prog = d < 0 ? 0 : (d >= 1.2 ? 1 : k.E.outExpo(k.prog(d, 0, 1.2)));
    const sheetW = 14 + prog * 218;              // 14 → 232
    const edgeX = -114 + sheetW;                 // sağ uç
    const edgeBob = k.noise1(t * 1.4) * 2.5;     // uçta hafif dalgalanma (idle)
    const parch = k.rgba(p.color, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // tomar gövdesi: sağ alt gölge + gövde
    ctx.fillStyle = k.rgba('bg', 0.28);
    ctx.save(); ctx.translate(6, 7);
    ctx.beginPath(); k.rrect(-114, -40, sheetW, 80, 8); ctx.fill();
    ctx.restore();
    R(ctx, k, -114, -40, sheetW, 80, 8, parch);
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-114 + Math.min(sheetW * 0.22, 44), -26, Math.min(sheetW * 0.2, 40), 9, -0.15, 0, k.TAU); ctx.fill();

    // mürekkep satırları: tomar açıldıkça belirir
    const lines = [-22, -4, 14, 32];
    for (let i = 0; i < lines.length; i++) {
      const ly = lines[i], endX = 96 - i * 7;
      const rev = k.clamp((sheetW - (endX + 114)) / 26, 0, 1);
      if (rev <= 0) continue;
      const drawTo = Math.min(endX, -114 + sheetW);
      ctx.strokeStyle = k.rgba('ink', 0.8 * rev); ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let x = -100; x <= drawTo; x += 8) {
        const y = ly + k.noise1(x * 0.13 + i * 7.3) * 2;
        if (x === -100) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // mühür: tomarın 3/4'ü açılınca belirir
    const sealA = k.clamp((sheetW - 168) / 22, 0, 1);
    if (sealA > 0) {
      ctx.save(); ctx.globalAlpha = sealA;
      ctx.fillStyle = k.rgba('red', 0.95);
      ctx.beginPath(); ctx.moveTo(52, 8); ctx.lineTo(44, 26); ctx.lineTo(52, 22); ctx.lineTo(60, 26); ctx.closePath(); ctx.fill();
      C(ctx, k, 52, -2, 11, k.rgba('red', 0.95));
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.arc(52, -2, 5, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // sol rulo (sarılı tomar kesiti)
    C(ctx, k, -140, 0, 27, parch);
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const [r, a0] of [[18, 0.4], [11, 2.2], [5.5, 4.1]]) {
      ctx.beginPath(); ctx.arc(-140, 0, r, a0, a0 + 4.4); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-150, -12, 12, 7, -0.5, 0, k.TAU); ctx.fill();

    // sağ uç: ahşap tutamak çubuğu (uç dalgalanmasıyla birlikte)
    ctx.save(); ctx.translate(0, edgeBob);
    const wood = k.rgba('ink', 0.55);
    R(ctx, k, edgeX - 7, -56, 14, 112, 7, wood);
    C(ctx, k, edgeX, -56, 9, wood);
    C(ctx, k, edgeX, 56, 9, wood);
    // gevşek uç kıvrımı
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(edgeX + 7, 8);
    ctx.quadraticCurveTo(edgeX + 25, 14, edgeX + 21, 27); ctx.stroke();
    C(ctx, k, edgeX + 21, 29, 6, parch);
    ctx.restore();
  },
};
