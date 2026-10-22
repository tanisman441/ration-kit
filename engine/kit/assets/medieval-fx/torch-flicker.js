// medieval-fx/torch-flicker — yanan meşale: döngülü alev titremesi + yükselen korlar.
// intensity alevi büyütür; burst anında (0.6 sn) alev parlar ve kıvılcımlar saçar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = taban.
export default {
  name: 'torch-flicker', category: 'medieval-fx',
  desc: 'Yanan meşale; alev sürekli titrer, burst anında parlayıp kıvılcım saçar',
  tags: ['meşale', 'alev', 'ateş', 'ışık', 'kale', 'gece', 'torch', 'flame', 'fire', 'medieval', 'light'],
  box: [-85, -235, 85, 15],
  bleed: 55,
  anchor: 'taban (0,0)',
  points: { flame: [0, -208], base: [0, 0] },
  params: {
    intensity: { type: 'number', default: 1, desc: 'alev büyüklüğü (0.4–1.8)' },
    burst: { type: 'time', default: null, desc: 'alev parlaması (0.6 sn: büyüme + kıvılcım)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const inten = Math.max(0.4, Math.min(1.8, p.intensity));
    const d = p.burst == null ? -1 : t - p.burst;
    const bursting = d >= 0 && d < 0.6;
    const benv = bursting ? Math.sin((d / 0.6) * Math.PI) : 0;
    const fl = inten * (1 + 0.55 * benv);
    ctx.lineCap = 'round';

    ctx.save();
    ctx.beginPath(); ctx.rect(-140, -290, 280, 340); ctx.clip();

    const fx = 0, fy = -208; // alev merkezi (kupa dudağının üstünde)

    // alev parlaması: sıcak glow
    k.glow(fx, fy, 70 * fl, 'yellow', 0.28 + 0.3 * benv);

    // alev katmanları: noise ile çeperi dalgalanan damla formları (yukarı uzayan)
    const flame = (rr, hh, seed, col, al) => {
      ctx.fillStyle = k.rgba(col, al);
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const an = (i / 24) * k.TAU;
        const q = 1 + k.noise1(seed + i * 0.8 + t * 7) * 0.2;
        const c = Math.cos(an), s2 = Math.sin(an);
        const px = fx + c * rr * q;
        const py = fy + s2 * hh * q - Math.max(0, s2) * hh * 0.9 * q;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    };
    flame(34 * fl, 52 * fl, 1.7, 'red', 0.85);
    flame(23 * fl, 38 * fl, 4.2, 'yellow', 0.9);
    flame(11 * fl, 22 * fl, 7.9, 'yellow', 0.95);

    // yükselen korlar (sürekli idle, burst'ta daha çok)
    const nEmb = Math.round(5 * inten + 7 * benv);
    for (let i = 0; i < nEmb; i++) {
      const cyc = 2.2, ph = (t / cyc + k.hash(i * 7 + 2)) % 1;
      const ex = fx + (k.hash(i * 11 + 3) - 0.5) * 44 * fl + k.noise1(i * 5 + t * 2.2) * 10;
      const ey = fy - 30 * fl - ph * (90 + k.hash(i * 13 + 4) * 60) * fl;
      ctx.fillStyle = k.rgba('yellow', 0.85 * (1 - ph));
      ctx.beginPath(); ctx.arc(ex, ey, (2.5 + (1 - ph) * 3) * fl, 0, k.TAU); ctx.fill();
    }
    // burst kıvılcımları: yana saçılır
    if (bursting) {
      for (let i = 0; i < 10; i++) {
        const g = k.prog(d, 0, 0.6);
        const a = -Math.PI / 2 + (k.hash(i * 17 + 6) - 0.5) * 2.6;
        const sp = (60 + k.hash(i * 19 + 7) * 130) * fl;
        const e = 1 - Math.pow(1 - g, 2);
        ctx.fillStyle = k.rgba(i % 2 ? 'yellow' : 'red', 0.9 * (1 - g));
        ctx.beginPath();
        ctx.arc(fx + Math.cos(a) * sp * e, fy + Math.sin(a) * sp * e - g * g * 40, 3 + k.hash(i * 23 + 8) * 3, 0, k.TAU);
        ctx.fill();
      }
    }

    // meşale sapı: ahşap (dim), üstte metal kupa
    ctx.strokeStyle = line; ctx.lineWidth = 12 + LW;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -150); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -150); ctx.stroke();
    // sap sarımı (ip çizgileri, ink ince — serbest çizgi kuralı)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const wy = -136 + i * 12;
      ctx.beginPath(); ctx.moveTo(-8, wy); ctx.quadraticCurveTo(0, wy + 5, 8, wy); ctx.stroke();
    }
    // metal kupa
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-24 - LW / 2, -196 - LW / 2, 48 + LW, 50 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); k.rrect(-24, -196, 48, 50, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -188, 12, 7, -0.4, 0, k.TAU); ctx.fill();
    // taban: küçük taş kaide
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-30 - LW / 2, -14, 60 + LW, 16, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-30, -14, 60, 16, 8); ctx.fill();

    ctx.restore();
  },
};
