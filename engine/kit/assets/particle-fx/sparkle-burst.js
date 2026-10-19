// particle-fx/sparkle-burst — patlayan yıldız kıvılcımı: at anında merkezden fışkıran
// 4-köşe sparkle yıldızları; öncesinde hafif toplanma titremesi, sonra sönümlenme.
// NOT: canvas y-aşağıdır; (0,0) patlamanın merkezi.
export default {
  name: 'sparkle-burst', category: 'particle-fx',
  desc: 'Patlayan yıldız kıvılcımı: at anında merkezden fışkıran dört köşeli parıltı yıldızları',
  tags: ['kıvılcım', 'parıltı', 'patlama', 'yıldız', 'sparkle', 'burst', 'glitter', 'shine', 'magic'],
  box: [-110, -110, 110, 110],
  bleed: 60,
  anchor: 'merkez (0,0) — patlamanın gerçekleştiği nokta',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'kıvılcım rengi' },
    at: { type: 'time', default: null, desc: 'patlama anı (yıldızlar fışkırır)' },
    size: { type: 'number', default: 1, min: 0.5, max: 1.3, desc: 'patlama büyüklüğü çarpanı' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const s = p.size;

    // 4-köşe sparkle yıldızı çizen yardımcı (içbükey kenarlı)
    const sparkle = (x, y, r, rot, alpha, col, whiteHot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = whiteHot ? 'rgba(255,255,255,' + alpha.toFixed(3) + ')' : k.rgba(col, alpha);
      ctx.beginPath();
      const w = r * 0.28; // içbükey bel
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2;
        const ca = Math.cos(a), sa = Math.sin(a);
        if (i === 0) ctx.moveTo(ca * r, sa * r);
        else ctx.lineTo(ca * r, sa * r);
        const b = a + Math.PI / 4;
        ctx.quadraticCurveTo(Math.cos(b) * w * 0.4, Math.sin(b) * w * 0.4, Math.cos(b) * w, Math.sin(b) * w);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    if (d >= 0 && d < 1.0) {
      const g = k.prog(d, 0, 1.0);           // 0 → 1 patlama ilerlemesi
      const al = 1 - g * g;
      const e = 1 - Math.pow(1 - Math.min(d * 2.2, 1), 3); // hızlı fırlama

      // merkez parlaması (ilk 0.18 sn)
      if (d < 0.18) {
        const f = 1 - d / 0.18;
        k.glow(0, 0, 90 * s * f, p.color, 0.55 * f);
        sparkle(0, 0, 34 * s * (1 + d * 3), d * 4, 0.95 * f, p.color, true);
      }

      // fışkıran yıldızlar
      const n = 14;
      for (let i = 0; i < n; i++) {
        const h1 = k.hash(i * 7 + 101), h2 = k.hash(i * 13 + 137), h3 = k.hash(i * 29 + 173);
        const ang = h1 * k.TAU;
        const dist = (22 + h2 * 78) * s * e;
        const x = Math.cos(ang) * dist;
        const y = Math.sin(ang) * dist * 0.92;
        const r = (7 + h3 * 13) * s * (1 - g * 0.55);
        const rot = d * (2 + h2 * 4) * (h1 > 0.5 ? 1 : -1) + h3 * k.TAU;
        sparkle(x, y, r, rot, al * (0.55 + h2 * 0.45), p.color, h3 > 0.75 && g < 0.4);
      }

      // halka şoku (ilk 0.4 sn)
      if (d < 0.4) {
        const gg = d / 0.4;
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - gg));
        ctx.lineWidth = 5 * (1 - gg) + 1.5;
        ctx.beginPath(); ctx.arc(0, 0, (18 + 78 * gg) * s, 0, k.TAU); ctx.stroke();
      }
      return;
    }

    // idle: patlamadan önce merkezde toplanan hafif parıltılar (döngülü)
    if (d < 0) {
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 5 + 211), h2 = k.hash(i * 11 + 227);
        const a = h1 * k.TAU + t * 1.6 * (0.7 + h2 * 0.6);
        const rr = 26 + ((h2 * 34 + t * 18) % 34);
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.9;
        const tw = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 5 + i * 2.1));
        sparkle(x, y, 5 + h2 * 5, t * 1.2 + i, tw, p.color, false);
      }
    }
  },
};
