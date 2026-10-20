// gesture-fx/swipe-arrow — kaydırma hareketini simgeleyen kalın ok; `at` anında fırlar, iz bırakır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) okun merkezidir, varsayılan yön sağdır.
export default {
  name: 'swipe-arrow',
  category: 'gesture-fx',
  desc: 'Kaydırma hareketini simgeleyen kalın ok; kaydırma anında fırlar, arkasında iz bırakır',
  tags: ['kaydır', 'kaydırma', 'ok', 'swipe', 'arrow', 'geçiş', 'slide', 'yön'],
  box: [-180, -75, 180, 75],
  bleed: 45,
  anchor: 'ok merkezi (0,0)',
  points: { head: [80, 0], tail: [-80, 0] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'ok rengi' },
    at: { type: 'time', default: null, desc: 'kaydırma anı: ok 0.45 sn fırlar, iz bırakır' },
    dir: { type: 'enum', values: ['right', 'left'], default: 'right', desc: 'kaydırma yönü (dikey için filmde rot: 90 kullanın)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = 6, OUT = k.rgba('bg', 0.55);
    const sh = (n, f = 0.88) => { const c = k.col(n); return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`; };
    const limb = (x1, y1, x2, y2, w, n) => {
      ctx.strokeStyle = sh(n); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1 + 6, y1 + 6); ctx.lineTo(x2 + 6, y2 + 6); ctx.stroke();
      ctx.strokeStyle = OUT; ctx.lineWidth = w + O; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba(n); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const sheen = (x, y, rx, ry, a = 0.12) => {
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.15, 0, k.TAU); ctx.fill();
    };

    const ang = p.dir === 'left' ? Math.PI : 0;
    ctx.rotate(ang);

    // ANİMASYON — idle: hafif ileri-geri hazırlık salınımı; `at`: 0.45 sn'de outBack taşmasıyla +45'e fırlar, 3 hayalet iz bırakır
    const d = p.at == null ? -1 : t - p.at;
    let sx, trail = 0, impact = 0;
    if (d < 0) {
      sx = -70 + 8 * Math.sin(t * k.TAU / 2.4);
    } else if (d < 0.45) {
      sx = -70 + 115 * k.E.outBack(d / 0.45, 1.3);
      trail = 1 - d / 0.45;
    } else {
      sx = 45;
      impact = Math.max(0, 1 - (d - 0.45) / 0.3);
    }

    const arrowAt = (ox, plain, a) => {
      ctx.save(); ctx.globalAlpha = a;
      if (plain) {
        ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 22;
        ctx.beginPath(); ctx.moveTo(-80 + ox, 0); ctx.lineTo(40 + ox, 0); ctx.stroke();
        ctx.lineWidth = 20;
        ctx.beginPath(); ctx.moveTo(36 + ox, -30); ctx.lineTo(78 + ox, 0); ctx.lineTo(36 + ox, 30); ctx.stroke();
      } else {
        limb(-80 + ox, 0, 40 + ox, 0, 26, p.color);
        limb(36 + ox, -30, 78 + ox, 0, 24, p.color);
        limb(36 + ox, 30, 78 + ox, 0, 24, p.color);
        sheen(-40 + ox, -8, 42, 10);
      }
      ctx.restore();
    };

    // iz hayaletleri
    if (trail > 0) {
      for (let i = 1; i <= 3; i++) arrowAt(sx - i * 26, true, (0.3 / i) * trail);
      // rüzgar çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.45 * trail); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const y = (i - 1) * 30, x0 = sx - 96, x1 = sx - 128 - i * 12;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      }
    }

    arrowAt(sx, false, 1);

    // varış halkası
    if (impact > 0) {
      const g = 1 - impact;
      ctx.strokeStyle = k.rgba(p.color, 0.7 * impact); ctx.lineWidth = 5 * impact + 2;
      ctx.beginPath(); ctx.arc(sx + 78, 0, 16 + g * 30, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
