// airport-fx/baggage-belt — bagaj bandı döngüsel akar; valizler bandın üstünde soldan sağa geçer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bandın merkezidir, valizler bandın üst yüzeyinde durur.
export default {
  name: 'baggage-belt', category: 'airport-fx',
  desc: 'Bagaj bandı döngüsel akar; üç valiz bandın üstünde soldan sağa geçer, bant üzerindeki oklar akışı gösterir',
  tags: ['bagaj', 'bavul', 'valiz', 'bant', 'konveyör', 'havalimanı', 'baggage', 'luggage', 'suitcase', 'conveyor', 'belt', 'airport'],
  box: [-165, -85, 165, 85],
  bleed: 20,
  anchor: 'bagaj bandının merkezi (0,0); valizlerin tabanı bandın üst yüzeyindedir',
  points: { belt: [0, 41], load: [0, 18] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'bant akış hızı çarpanı (1 = ~6 sn bir tur)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // bant ayakları
    ctx.fillStyle = k.rgba('ink', 0.55);
    ctx.beginPath(); k.rrect(-128, 64, 10, 18, 4); ctx.fill();
    ctx.beginPath(); k.rrect(118, 64, 10, 18, 4); ctx.fill();

    // bant gövdesi
    blob(-165, 18, 330, 46, 12, k.rgba(p.color));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-140, 26, 26, 5, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(96, 52, 56, 8, 4); ctx.fill();

    // bant üzerinde akan oklar (döngüsel)
    ctx.fillStyle = k.rgba('panel2', 0.85);
    for (let i = 0; i < 9; i++) {
      const ax = (((i * 36 + t * 55 * sp) % 324) + 324) % 324 - 162;
      ctx.beginPath();
      ctx.moveTo(ax - 6, 30); ctx.lineTo(ax + 4, 41); ctx.lineTo(ax - 6, 52);
      ctx.lineTo(ax - 6, 47); ctx.lineTo(ax - 12, 41); ctx.lineTo(ax - 6, 35);
      ctx.closePath(); ctx.fill();
    }

    // valizler: döngüsel geçiş
    const cols = ['dim', 'panel2', 'ink'];
    for (let i = 0; i < 3; i++) {
      const span = 284;
      const x = (((t * 55 * sp + i * 95) % span) + span) % span - 142;
      const bob = 1.5 * Math.sin(t * k.TAU / 0.9 + i * 2.1);
      const w = 46, h = 54;
      const sx = x - w / 2, sy = 18 - h + bob;
      // sap
      ctx.strokeStyle = line; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(sx + 14, sy); ctx.lineTo(sx + 14, sy - 8); ctx.lineTo(sx + 32, sy - 8); ctx.lineTo(sx + 32, sy); ctx.stroke();
      // gövde
      blob(sx, sy, w, h, 8, k.rgba(cols[i]));
      // yatay şerit (vurgu: ortadaki valizde cyan)
      ctx.fillStyle = i === 1 ? k.rgba('cyan', 0.9) : k.rgba('ink', 0.35);
      ctx.fillRect(sx, sy + h / 2 - 3, w, 6);
      // tekerlekler
      ctx.fillStyle = k.rgba('ink', 0.7);
      ctx.beginPath(); ctx.arc(sx + 10, sy + h - 2, 4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(sx + w - 10, sy + h - 2, 4, 0, k.TAU); ctx.fill();
      // parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(sx + 10, sy + 8, 8, 3, 0, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
