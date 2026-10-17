// economy/stock-ticker — borsa bandı: trend rozeti + akan fiyat bandı.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) panel merkezidir.
export default {
  name: 'stock-ticker', category: 'economy',
  desc: 'Borsa bandı; trend rozeti (yükselen/düşen/yatay) ve akan fiyat yazısı',
  tags: ['borsa', 'stock', 'ticker', 'hisse', 'share', 'finans', 'finance', 'band'],
  box: [-268, -56, 268, 56],
  bleed: 8,
  anchor: 'panel merkezi (0,0)',
  points: { left: [-260, 0], right: [260, 0] },
  params: {
    text: { type: 'text', default: 'RATN +2.4%  ·  TECH -1.2%  ·  FIN +0.8%  ·  ENRJ -3.1%  ·  GIDA +1.5%  ·  ', desc: 'akan fiyat yazısı' },
    trend: { type: 'enum', values: ['up', 'down', 'flat'], default: 'up', desc: 'trend yönü' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // ana panel
    blob(-260, -50, 520, 100, 16, k.rgba('panel'));

    // trend rozeti (sol)
    const trendC = p.trend === 'down' ? 'red' : p.trend === 'flat' ? 'dim' : 'green';
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(-218, 0, 33, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(trendC); ctx.beginPath(); ctx.arc(-218, 0, 30, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    if (p.trend === 'down') {
      ctx.beginPath(); ctx.moveTo(-218, 16); ctx.lineTo(-233, -6); ctx.lineTo(-203, -6); ctx.closePath(); ctx.fill();
    } else if (p.trend === 'flat') {
      ctx.beginPath(); k.rrect(-233, -5, 30, 10, 5); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(-218, -16); ctx.lineTo(-233, 6); ctx.lineTo(-203, 6); ctx.closePath(); ctx.fill();
    }

    // akan yazı (kırpma bölgesi: rozetten sağa)
    const label = String(p.text == null || p.text === '' ? 'RATN +2.4%' : p.text);
    ctx.font = '700 30px system-ui, sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const unit = ctx.measureText(label).width;
    const x0 = -172, x1 = 250;
    const speed = 55; // px/sn
    const off = (t * speed) % Math.max(unit, 1);
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, -44, x1 - x0, 88); ctx.clip();
    ctx.fillStyle = k.rgba('ink');
    for (let i = 0; i < 3; i++) ctx.fillText(label, x0 - off + i * unit, 2);
    ctx.restore();

    // premium parlama (panel sol üst, yazıdan uzakta)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-150, -38, 60, 9, -0.15, 0, k.TAU); ctx.fill();

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(10, 62, 240, 8, 0, 0, k.TAU); ctx.fill();
  },
};
