// celebration-fx/fireworks — havai fişek patlaması: at anında kısa beyaz flaş,
// ardından tek vurgu renginde genişleyip sönümlenen kıvılcım halkası.
// NOT: canvas y-aşağıdır; (0,0) patlamanın merkezidir.
export default {
  name: 'fireworks', category: 'celebration-fx',
  desc: 'Havai fişek patlaması: at anında flaş, sonra sönümlenen tek renkli kıvılcım halkası',
  tags: ['havai fişek', 'fişek', 'patlama', 'kutlama', 'gösteri', 'gece', 'fireworks', 'pyrotechnic', 'burst', 'celebration', 'spark', 'display'],
  box: [-140, -140, 140, 140],
  bleed: 45,
  anchor: 'patlama merkezi (0,0)',
  points: { burst: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'fişek rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'patlama anı: 0.15 sn flaş + 0.4-0.8 sn sönümlenen halka' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 0.85) return;
    ctx.save();
    ctx.lineCap = 'round';

    // flaş: ilk 0.15 sn (beyaz merkez + renkli glow)
    if (d < 0.15) {
      const f = 1 - d / 0.15;
      k.glow(0, 0, 120 * f, p.color, 0.5 * f);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * f).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(0, 0, 14 * f + 5, 0, k.TAU); ctx.fill();
    }

    // parçacık halkası: kademeli fırlama, yavaşlayıp sönümlenme (0.4–0.8 sn)
    const n = 48;
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 7 + 11), h2 = k.hash(i * 13 + 37), h3 = k.hash(i * 29 + 53);
      const ang = h1 * k.TAU;
      const dd = Math.max(d - h3 * 0.1, 0);
      const e = 1 - Math.pow(1 - Math.min(dd / 0.55, 1), 2.2);
      const dist = (30 + h2 * 96) * e;
      const x = Math.cos(ang) * dist;
      const y = Math.sin(ang) * dist + 30 * dd * dd;
      if (x < -178 || x > 178 || y < -178 || y > 178) continue;
      const fade = 1 - k.prog(dd, 0.3, 0.8);
      if (fade <= 0) continue;
      const hot = dd < 0.12;
      const col = hot
        ? 'rgba(255,255,255,' + fade.toFixed(3) + ')'
        : k.rgba(p.color, fade * (0.55 + h2 * 0.45));
      // kıvılcım izi: radyal kısa çizgi
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.4 + h1 * 3.4;
      const tl = 6 + h2 * 11;
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(ang) * tl, y - Math.sin(ang) * tl);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // iç şok halkası: ilk 0.35 sn
    if (d < 0.35) {
      const g = d / 0.35;
      ctx.strokeStyle = k.rgba(p.color, 0.55 * (1 - g));
      ctx.lineWidth = 5 * (1 - g) + 1.5;
      ctx.beginPath(); ctx.arc(0, 0, 16 + 84 * g, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
