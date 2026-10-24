// art-fx/paint-splat — boya sıçraması: merkez leke patlayarak büyür,
// damlalar fırlayıp düşer, halka yayılır; sonra leke hafifçe nefes alır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = lekenin merkezi değil, leke (0,18)'dedir.
export default {
  name: 'paint-splat', category: 'art-fx',
  desc: 'Patlayarak büyüyen boya lekesi; damlalar fırlayıp düşer, halka yayılır',
  tags: ['boya', 'sıçrama', 'leke', 'damla', 'sanat', 'paint', 'splat', 'splash', 'droplet', 'art'],
  box: [-150, -130, 150, 130],
  bleed: 60,
  anchor: 'leke merkezi (0,18)',
  points: { center: [0, 18] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'boya rengi' },
    at: { type: 'time', default: null, desc: 'sıçrama anı (0.7 sn: patlama + damlalar)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const g = k.prog(d, 0, 0.7);
    const ev = d >= 0;
    // büyüme + hafif taşma (overshoot)
    let s = ev ? 1 - Math.pow(1 - g, 3) : 0;
    s = s * (1 + 0.28 * Math.sin(g * Math.PI) * (1 - g));
    const br = ev && g >= 1 ? 1 + 0.03 * Math.sin(t * 2.6) : 1; // idle nefes
    const CX = 0, CY = 18;

    ctx.save();
    ctx.beginPath(); ctx.rect(-215, -195, 430, 390); ctx.clip();

    const blobR = th => 46 * (1 + 0.22 * k.noise1(3.1 + th * 0.7) + 0.10 * k.noise1(9.7 + th * 1.9));
    const blobPath = (rr) => {
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) {
        const th = (i / 30) * k.TAU;
        const r = blobR(th) * rr;
        const x = CX + Math.cos(th) * r, y = CY + Math.sin(th) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    if (ev && s > 0.01) {
      // yayılan halka (ilk 0.4 sn)
      if (d < 0.4) {
        const e3 = k.prog(d, 0, 0.4);
        ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - e3));
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(CX, CY, 46 * s + e3 * 90, 0, k.TAU); ctx.stroke();
      }
      // ana leke
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 9;
      blobPath(s * br); ctx.stroke();
      ctx.fillStyle = k.rgba(p.color, 0.95);
      blobPath(s * br); ctx.fill();
      // premium parlama: sol üstte beyaz elips
      if (s > 0.5) {
        ctx.fillStyle = 'rgba(255,255,255,0.11)';
        ctx.beginPath(); ctx.ellipse(CX - 17, CY - 20, 15 * s, 8 * s, -0.5, 0, k.TAU); ctx.fill();
      }
      // uydu lekeler (kenarda küçük damlalar)
      for (let i = 0; i < 3; i++) {
        const a = k.hash(i * 7 + 1) * k.TAU;
        const rr = (52 + k.hash(i * 11 + 2) * 22) * s;
        ctx.fillStyle = k.rgba(p.color, 0.9);
        ctx.beginPath(); ctx.arc(CX + Math.cos(a) * rr, CY + Math.sin(a) * rr, (5 + k.hash(i * 13 + 3) * 5) * s, 0, k.TAU); ctx.fill();
      }
      // fırlayan damlalar (yerçekimli yay)
      if (d > 0.03) {
        const e2 = k.prog(d - 0.03, 0, 0.75);
        for (let i = 0; i < 9; i++) {
          const a = -Math.PI / 2 + (k.hash(i * 3 + 1) - 0.5) * 2.6;
          const sp = 55 + k.hash(i * 5 + 2) * 75;
          const px = CX + Math.cos(a) * sp * e2;
          const py = CY + Math.sin(a) * sp * e2 + e2 * e2 * 110;
          ctx.fillStyle = k.rgba(i % 2 ? p.color : 'ink', 0.9 * (1 - e2));
          ctx.beginPath(); ctx.arc(px, py, 4 + k.hash(i * 7 + 3) * 5, 0, k.TAU); ctx.fill();
        }
      }
    }

    ctx.restore();
  },
};
