// liquid-fx/bubble-pop — süzülen baloncuk; at anında patlar, parçaları savrulur.
// NOT: canvas y-aşağıdır; baloncuk merkezi (0,0).
export default {
  name: 'bubble-pop',
  category: 'liquid-fx',
  desc: 'Havada süzülüp sallanan baloncuk; at anında patlayıp parçaları etrafa savrulur',
  tags: ['baloncuk', 'köpük', 'patlama', 'sabun köpüğü', 'süzülme', 'bubble', 'pop', 'soap bubble', 'burst', 'float'],
  box: [-90, -90, 90, 90],
  bleed: 46,
  anchor: 'baloncuk merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? null : t - p.at;

    const bubble = (x, y, R, wob, alpha) => {
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const an = (i / 28) * k.TAU;
        const rr = R * (1 + k.noise1(i * 0.9 + wob) * 0.05);
        const px = x + Math.cos(an) * rr, py = y + Math.sin(an) * rr;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = k.rgba(p.color, 0.16 * alpha);
      ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.6 * alpha);
      ctx.lineWidth = 5;
      ctx.stroke();
      // sol üst parlama: iç parlaklık yayı + parlama lekesi
      ctx.strokeStyle = `rgba(255,255,255,${0.28 * alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, R * 0.78, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${0.10 * alpha})`;
      ctx.beginPath(); ctx.ellipse(x - R * 0.34, y - R * 0.38, R * 0.22, R * 0.12, -0.6, 0, k.TAU); ctx.fill();
    };

    if (d == null || d < 0) {
      // süzülme: yukarı-aşağı salınım + hafif yanal kayma
      const fx = Math.sin(t * 0.7) * 5, fy = Math.sin(t * 1.1) * 8;
      bubble(fx, fy, 46, t * 3, 1);
      // yükselen minik baloncuklar (döngülü)
      for (let i = 0; i < 3; i++) {
        const cyc = 3.2;
        const ph = ((t * 0.8 + i * 1.1) % cyc) / cyc;
        const bx = fx - 30 + i * 28 + k.noise1(t * 1.5 + i * 9) * 6;
        const by = fy + 70 - ph * 130;
        ctx.strokeStyle = k.rgba(p.color, 0.5 * (1 - ph));
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(bx, by, 5 + (1 - ph) * 3, 0, k.TAU); ctx.stroke();
      }
      return;
    }
    if (d > 0.55) return;

    if (d < 0.12) {
      // patlama flaşı + büzülen zar
      const f = 1 - d / 0.12;
      k.glow(0, 0, 76 * f + 10, p.color, 0.5 * f);
      bubble(0, 0, 46 * (1 - d * 2.2), t * 3, f);
    }
    // zar parçaları: dışa savrulan yaylar
    const pf = 1 - d / 0.5;
    for (let i = 0; i < 10; i++) {
      const h = k.hash(i * 4.7 + 3);
      const an = (i / 10) * k.TAU + h * 0.5;
      const rr = 28 + d * 170;
      const x = Math.cos(an) * rr, y = Math.sin(an) * rr * 0.9;
      ctx.strokeStyle = k.rgba(p.color, 0.9 * pf);
      ctx.lineWidth = 5 * pf + 1;
      ctx.beginPath(); ctx.arc(x, y, 6 + h * 6, an, an + 1.4); ctx.stroke();
    }
    // şok halkaları
    for (let j = 0; j < 2; j++) {
      const jj = d - j * 0.09;
      if (jj < 0) continue;
      const g = jj / 0.45;
      if (g > 1) continue;
      ctx.strokeStyle = k.rgba(p.color, 0.5 * (1 - g));
      ctx.lineWidth = 4 * (1 - g) + 1;
      ctx.beginPath(); ctx.ellipse(0, 0, 16 + 92 * g, 10 + 54 * g, 0, 0, k.TAU); ctx.stroke();
    }
  },
};
