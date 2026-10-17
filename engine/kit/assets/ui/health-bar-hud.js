// ui/health-bar-hud — oyun içi can barı; hp 0–1, düşük canda nabız gibi atar.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'health-bar-hud',
  category: 'ui',
  desc: 'Oyun içi can barı; hp oranına göre dolar, düşük canda nabız gibi atar',
  tags: ['can', 'bar', 'sağlık', 'hud', 'oyun', 'health', 'bar', 'hud', 'game', 'hp'],
  box: [-230, -44, 230, 44],
  bleed: 10,
  anchor: 'bar merkezi (0,0)',
  points: { left: [-200, 0], right: [200, 0] },
  params: {
    hp: { type: 'number', default: 0.75, desc: 'can oranı 0–1' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const hp = k.clamp(Number(p.hp ?? 0.75), 0, 1);
    const low = hp < 0.3;
    const pulse = low ? 0.72 + 0.28 * Math.sin(t * 9) : 1;   // düşük can nabzı
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const backC = k.rgba('panel2'), fillC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const W = 400, H = 44, R = 16;
    const ix = -W / 2 + 10, iw = W - 20, ih = H - 20;

    ctx.save();

    // dış çerçeve
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-W / 2 - LW / 2, -H / 2 - LW / 2, W + LW, H + LW, R + LW / 2); ctx.fill();
    // zemin
    ctx.fillStyle = backC;
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();

    // dolgu
    const fw = Math.max(0, iw * hp);
    if (fw > 1) {
      ctx.globalAlpha = pulse;
      ctx.fillStyle = fillC;
      ctx.beginPath(); k.rrect(ix, -ih / 2, fw, ih, Math.min(10, fw / 2)); ctx.fill();
      ctx.globalAlpha = 1;
      // üst parlama (premium)
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath(); k.rrect(ix + 6, -ih / 2 + 5, Math.max(0, fw - 12), 10, 5); ctx.fill();
    }

    // %25 dilim çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.45); ctx.lineWidth = 3;
    for (let i = 1; i < 4; i++) {
      const x = ix + (iw * i) / 4;
      ctx.beginPath(); ctx.moveTo(x, -ih / 2 + 4); ctx.lineTo(x, ih / 2 - 4); ctx.stroke();
    }

    // hp etiketi (bar ortasında)
    ctx.fillStyle = inkC;
    ctx.font = `700 24px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(hp * 100)}`, 0, 1);

    ctx.restore();
  },
};
