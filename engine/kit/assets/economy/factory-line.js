// economy/factory-line — fabrika hattı: hareketli bant, dönen merdaneler, akan kutular.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bant hattıdır (kutular negatif y'de).
export default {
  name: 'factory-line', category: 'economy',
  desc: 'Fabrika üretim hattı; speed arttıkça bant, merdane ve kutular hızlanır',
  tags: ['fabrika', 'factory', 'üretim', 'production', 'bant', 'conveyor', 'sanayi', 'hat', 'line'],
  box: [-238, -150, 238, 58],
  bleed: 10,
  anchor: 'bant hattı (0,0) — kutular negatif y yönünde yukarıdadır',
  points: { start: [-220, -14], end: [220, -14] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 0.5, desc: 'bant hızı (0–1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const sp = k.clamp(p.speed, 0, 1);

    // ayaklar
    blob(-208, 14, 26, 32, 8, body);
    blob(182, 14, 26, 32, 8, body);

    // bant gövdesi
    blob(-224, -16, 448, 30, 12, k.rgba('panel'));
    // bant yüzeyi: akan çizgiler
    const dashW = 26, gapW = 34, period = dashW + gapW;
    const off = (t * sp * 140) % period;
    ctx.save();
    ctx.beginPath(); ctx.rect(-218, -10, 436, 18); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.6);
    for (let x = -224 - off; x < 228; x += period) {
      ctx.beginPath(); k.rrect(x, -8, dashW, 14, 7); ctx.fill();
    }
    ctx.restore();

    // merdaneler (bant altında, dönen parmaklıklı)
    for (let i = 0; i < 7; i++) {
      const x = -180 + i * 60;
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, 24, 13, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); ctx.arc(x, 24, 10, 0, k.TAU); ctx.fill();
      const ang = t * sp * 6 + k.hash(i * 7 + 1) * k.TAU;
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
      for (let s = 0; s < 3; s++) {
        const a = ang + s * k.TAU / 3;
        ctx.beginPath(); ctx.moveTo(x, 24);
        ctx.lineTo(x + Math.cos(a) * 8, 24 + Math.sin(a) * 8); ctx.stroke();
      }
    }

    // kutular (bant üstünde, sağdan sola akar; kutuya kırpılır)
    const BW = 52, BH = 48, n = 5, span = 500;
    ctx.save();
    ctx.beginPath(); ctx.rect(-236, -148, 472, 206); ctx.clip();
    for (let i = 0; i < n; i++) {
      const phase = ((i * span / n) - t * sp * 140) % span;
      const x = -250 + (phase < 0 ? phase + span : phase) - BW / 2;
      const y = -16 - BH;
      blob(x, y, BW, BH, 9, body);
      // kutu bandı + alt gölge şeridi (banttan ayrışsın) + premium parlama
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.beginPath(); k.rrect(x + 10, y + 8, BW - 20, 10, 5); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath(); k.rrect(x + 4, y + BH - 12, BW - 8, 9, 4); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x + 14, y + 13, 10, 7, -0.4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(10, 48, 210, 8, 0, 0, k.TAU); ctx.fill();
  },
};
