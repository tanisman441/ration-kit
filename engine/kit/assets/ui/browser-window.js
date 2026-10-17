// ui/browser-window — tarayıcı penceresi; sekme çubuğu, adres satırı ve
// sade bir sayfa iskeleti. Contract: engine/kit/ASSETS.md
export default {
  name: 'browser-window',
  category: 'ui',
  desc: 'Tarayıcı penceresi; adres satırı ve sade sayfa iskeletiyle',
  tags: ['tarayıcı', 'pencere', 'internet', 'site', 'web', 'browser', 'window', 'web', 'internet', 'tab'],
  box: [-300, -220, 300, 220],
  bleed: 10,
  anchor: 'pencere merkezi (0,0)',
  points: { urlbar: [0, -158], content: [0, 40] },
  params: {
    color: { type: 'color', default: 'panel' },
    url: { type: 'text', default: 'ration.video' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), dimC = k.rgba('dim');
    const bodyC = k.rgba(p.color), barC = k.rgba('panel2');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const W = 560, H = 400, R = 24;
    const x0 = -W / 2, y0 = -H / 2;
    const barH = 64;

    const fit = (s, maxW, size) => {
      ctx.font = `700 ${size}px 'JetBrains Mono', monospace`;
      let out = String(s ?? '');
      while (out.length > 1 && ctx.measureText(out).width > maxW) out = out.slice(0, -1);
      if (out !== String(s ?? '')) out = out.slice(0, -1) + '…';
      return out;
    };

    ctx.save();

    // gölge
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); k.rrect(x0, y0 + 12, W, H, R); ctx.fill();
    // dış hat + gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(x0 - LW / 2, y0 - LW / 2, W + LW, H + LW, R + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(x0, y0, W, H, R); ctx.fill();

    // üst çubuk
    ctx.fillStyle = barC;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + R);
    ctx.arcTo(x0, y0, x0 + R, y0, R);
    ctx.lineTo(x0 + W - R, y0);
    ctx.arcTo(x0 + W, y0, x0 + W, y0 + R, R);
    ctx.lineTo(x0 + W, y0 + barH);
    ctx.lineTo(x0, y0 + barH);
    ctx.closePath(); ctx.fill();
    // çubuk ayracı
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0 + 8, y0 + barH); ctx.lineTo(x0 + W - 8, y0 + barH); ctx.stroke();

    // trafik ışıkları
    const dots = ['red', 'yellow', 'green'];
    dots.forEach((c, i) => {
      ctx.fillStyle = k.rgba(c);
      ctx.beginPath(); ctx.arc(x0 + 34 + i * 30, y0 + barH / 2, 10, 0, k.TAU); ctx.fill();
    });

    // adres satırı
    const ux = x0 + 130, uw = W - 160, uh = 36, uy = y0 + (barH - uh) / 2;
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); k.rrect(ux, uy, uw, uh, uh / 2); ctx.fill();
    const url = fit(p.url, uw - 56, 22);
    ctx.fillStyle = dimC;
    ctx.font = `700 22px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(url, ux + 24, uy + uh / 2 + 1);

    // sayfa iskeleti: başlık çubuğu + metin satırları + düğme
    const cx = x0 + 44, cy = y0 + barH + 48;
    ctx.fillStyle = k.rgba('accent', 0.85);
    ctx.beginPath(); k.rrect(cx, cy, 220, 30, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 0.5);
    [0, 1, 2].forEach(i => {
      const wdt = [440, 380, 300][i];
      ctx.beginPath(); k.rrect(cx, cy + 58 + i * 44, wdt, 18, 9); ctx.fill();
    });
    // düğme
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath(); k.rrect(cx, cy + 58 + 3 * 44 + 6, 150, 44, 16); ctx.fill();
    // üst parlama (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); k.rrect(x0 + 16, y0 + 10, W - 32, 16, 8); ctx.fill();

    ctx.restore();
  },
};
