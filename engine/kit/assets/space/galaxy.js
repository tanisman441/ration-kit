// space/galaxy — spiral galaksi (yandan hafif eğik bakış); kollar yavaşça döner,
// merkez nabız gibi parlar. Vurgu rengi: purple.
// NOT: canvas y-aşağıdır; (0,0) galaksi merkezidir.
export default {
  name: 'galaxy', category: 'space',
  desc: 'Spiral galaksi; kolları döner, merkezi nabız gibi parlar',
  tags: ['galaksi', 'uzay', 'spiral', 'yıldız', 'galaxy', 'space', 'spiral galaxy', 'stars', 'evren'],
  box: [-175, -120, 175, 120],
  bleed: 30,
  anchor: 'galaksi merkezi (0,0)',
  points: { center: [0, 0], rim: [150, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const armC = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // merkez nabzı (canlı idle): ~2.8 sn periyot
    const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.8);
    const coreR = 30 * (1 + pulse * 0.08);

    ctx.save();
    // galaksiye yandan hafif eğik bakış
    ctx.scale(1, 0.66);

    // hale (arkaplan parıltısı — hafif, arka planı boyamaz)
    const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, 170);
    halo.addColorStop(0, k.rgba('purple', 0.10 + 0.05 * pulse));
    halo.addColorStop(1, k.rgba('purple', 0));
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, 170, 0, k.TAU); ctx.fill();

    // spiral kollar: iki kol, yavaş döngüsel dönüş (tam tur ~50 sn)
    const spin = t * k.TAU / 50;
    for (let arm = 0; arm < 2; arm++) {
      const phase = spin + arm * Math.PI;
      // yıldız tozu şeridi (geniş, yumuşak)
      ctx.save();
      ctx.rotate(phase);
      ctx.strokeStyle = armC; ctx.lineWidth = 34;
      ctx.beginPath();
      for (let s = 0; s <= 40; s++) {
        const u = s / 40;
        const r = 34 + u * 170;
        const a = u * Math.PI * 1.15;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
    // kol üstü parlak damarlar (daha dar, vurgu)
    for (let arm = 0; arm < 2; arm++) {
      const phase = spin + arm * Math.PI;
      ctx.save(); ctx.rotate(phase);
      ctx.strokeStyle = k.rgba('purple', 0.55); ctx.lineWidth = 10;
      ctx.beginPath();
      for (let s = 0; s <= 40; s++) {
        const u = s / 40;
        const r = 40 + u * 160;
        const a = u * Math.PI * 1.15;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
    // kollardaki yıldızlar (hash tabanlı, titrek)
    for (let i = 0; i < 26; i++) {
      const h1 = k.hash(i * 13 + 1), h2 = k.hash(i * 29 + 5);
      const r = 55 + h1 * 160, a = h2 * k.TAU + spin;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      const tw = 0.5 + 0.5 * Math.sin(t * 3 + h1 * 20);
      ctx.fillStyle = k.rgba('ink', 0.35 + 0.55 * tw * h2);
      ctx.beginPath(); ctx.arc(x, y, 2.2 + 2.4 * h2, 0, k.TAU); ctx.fill();
    }

    // merkez çekirdek (parlak disk + nabız glow'u)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, coreR + LW / 2, 0, k.TAU); ctx.fill();
    const coreGrad = ctx.createRadialGradient(-coreR * 0.3, -coreR * 0.3, 4, 0, 0, coreR);
    coreGrad.addColorStop(0, k.rgba('yellow', 0.95));
    coreGrad.addColorStop(0.55, k.rgba('purple', 0.9));
    coreGrad.addColorStop(1, k.rgba('purple', 0.55));
    ctx.fillStyle = coreGrad;
    ctx.beginPath(); ctx.arc(0, 0, coreR, 0, k.TAU); ctx.fill();
    k.glow(0, 0, coreR + 26 * pulse, 'purple', 0.4);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-coreR * 0.35, -coreR * 0.42, coreR * 0.34, coreR * 0.2, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
