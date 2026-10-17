// economy/money-stack — banknot destesi: katmanlı banknotlar + ortada kâğıt bant.
// amount arttıkça deste yükselir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) tabandadır (en alt banknotun altı).
export default {
  name: 'money-stack', category: 'economy',
  desc: 'Banknot destesi; amount arttıkça katman sayısı ve yükseklik artar',
  tags: ['para', 'banknot', 'deste', 'money', 'cash', 'banknote', 'stack', 'zengin'],
  box: [-95, -158, 95, 20],
  bleed: 10,
  anchor: 'taban (0,0) — en alt banknotun altı',
  points: { top: [0, -118] },
  params: {
    color: { type: 'color', default: 'green' },
    amount: { type: 'number', default: 0.6, desc: 'deste doluluğu (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const BW = 150, BH = 58, STEP = 12;
    const n = 3 + Math.round(k.clamp(p.amount, 0, 1) * 5); // 3..8 katman
    const topY = -(n - 1) * STEP - BH;

    const bill = (i, top) => {
      const x = (k.hash(i * 7 + 1) - 0.5) * 10;
      const y = -i * STEP - BH;
      // dış hat + gövde
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - BW / 2 - LW / 2, y - LW / 2, BW + LW, BH + LW, 10); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); k.rrect(x - BW / 2, y, BW, BH, 10); ctx.fill();
      // iç çerçeve çizgisi
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      ctx.beginPath(); k.rrect(x - BW / 2 + 10, y + 8, BW - 20, BH - 16, 6); ctx.stroke();
      if (top) {
        // üst banknot amblemi
        ctx.fillStyle = k.rgba('ink', 0.5);
        ctx.beginPath(); ctx.arc(x, y + BH / 2, 13, 0, k.TAU); ctx.fill();
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.arc(x, y + BH / 2, 8, 0, k.TAU); ctx.fill();
        // premium parlama (sol üst)
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - BW / 4, y + 14, 26, 9, -0.3, 0, k.TAU); ctx.fill();
      }
      return { x, y };
    };

    for (let i = 0; i < n; i++) bill(i, i === n - 1);

    // kâğıt bant (ortada, dikey)
    const bandH = (n - 1) * STEP + BH;
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-17 - LW / 2, -bandH - LW / 2, 34 + LW, bandH + LW, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); k.rrect(-17, -bandH, 34, bandH, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-17, -bandH + 12); ctx.lineTo(17, -bandH + 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-17, -12); ctx.lineTo(17, -12); ctx.stroke();

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(6, 8, 78, 8, 0, 0, k.TAU); ctx.fill();
  },
};
