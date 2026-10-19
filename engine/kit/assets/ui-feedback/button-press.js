// ui-feedback/button-press — basılabilir yuvarlak buton; press anında içe çöker, yayla geri döner.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'button-press',
  category: 'ui-feedback',
  desc: 'Yuvarlak basılabilir buton; press anında içe çöküp yay geri dönüşü yapar',
  tags: ['buton', 'basma', 'tıklama', 'tıkla', 'bas', 'button', 'press', 'click', 'tap', 'ui'],
  box: [-110, -80, 110, 80],
  bleed: 34,
  anchor: 'buton merkezi (0,0)',
  points: { center: [0, 0], top: [0, -45] },
  params: {
    press: { type: 'time', default: null, desc: 'basılma anı: içe çökme + yay geri dönüş' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const d = p.press == null ? -1 : t - p.press;
    const W = 180, H = 90, R = 26;

    // idle: hafif nabız (2.4 sn periyot)
    const idle = 1 + 0.02 * Math.sin((t * k.TAU) / 2.4);

    // basılma ölçekleri: 0.12 sn'de içe çök, sonra outBack ile geri
    let sx = 1, sy = idle, ringA = 0;
    if (d >= 0 && d < 0.55) {
      if (d < 0.12) {
        const e = d / 0.12;
        sx = 1 + 0.10 * e;
        sy = idle * (1 - 0.22 * e);
      } else {
        const e = k.E.outBack((d - 0.12) / 0.43);
        sx = 1 + 0.10 * (1 - e);
        sy = idle * (1 - 0.22 * (1 - e));
      }
      ringA = Math.max(0, 1 - d / 0.55);
    }

    ctx.save();
    ctx.translate(0, 0);
    ctx.scale(sx, sy);

    // sağ alt gölge (%12 koyu hissi, 6 birim offset)
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-W / 2 + 6, -H / 2 + 6, W, H, R); ctx.fill();

    // gövde
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    // dış hat
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.stroke();

    // sol üst beyaz parlama (premium, alfa 0.11)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(-W / 2 + 44, -H / 2 + 20, 56, 18, -0.35, 0, k.TAU);
    ctx.fill();

    ctx.restore();

    // basılma dalgası: genişleyen, sönen yuvarlak hat
    if (ringA > 0) {
      const e = 1 - ringA;
      ctx.save();
      ctx.globalAlpha = ringA * 0.8;
      ctx.lineWidth = 6;
      ctx.strokeStyle = k.rgba(p.color);
      ctx.beginPath();
      k.rrect(-W / 2 - e * 26, -H / 2 - e * 26, W + e * 52, H + e * 52, R + e * 20);
      ctx.stroke();
      ctx.restore();
    }
  },
};
