// transport/rocket — dikey roket; launch anında alev büyür, duman çıkar ve yükselir.
// NOT: canvas y-aşağıdır; (0,0) roket tabanıdır, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'rocket',
  category: 'transport',
  desc: 'Dikey roket; launch anında motor alevi büyür, duman çıkar ve gökyüzüne yükselir',
  tags: ['roket', 'rocket', 'füze', 'uzay', 'space', 'fırlatma', 'launch', 'nasa', 'yörünge'],
  box: [-62, -178, 62, 20],
  bleed: 140,
  anchor: 'roket tabanı (0,0); gövde yukarı uzar',
  points: { nose: [0, -172], base: [0, 0], window: [0, -105] },
  params: {
    color: { type: 'color', default: 'dim' },
    launch: { type: 'time', default: null, desc: 'fırlatma anı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const d = p.launch == null ? -1 : t - p.launch;
    const flying = d >= 0;
    const rise = flying ? k.E.outCubic(Math.min(1, d / 1.7)) * 110 : 0;
    const shake = flying && d < 0.8 ? k.noise1(t * 9) * 3 : 0;

    // fırlatma rampası (sabit, yükselmez)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-44, -4, 88, 12, 4); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-42, -2, 84, 8, 3); ctx.fill();

    // duman (fırlatma sonrası 2 sn)
    if (flying && d < 2.2) {
      const sa = 1 - d / 2.2;
      for (let i = 0; i < 7; i++) {
        const ph = ((t * 0.6 + i / 7) % 1);
        const side = i % 2 === 0 ? -1 : 1;
        const dx = side * (20 + ph * (50 + k.hash(i * 5) * 30));
        const dy = 6 - ph * 26 + k.noise1(i * 17 + t) * 8;
        const r = 12 + ph * 22;
        ctx.fillStyle = k.rgba('dim', 0.4 * sa * (1 - ph * 0.6));
        ctx.beginPath(); ctx.arc(dx, dy, r, 0, k.TAU); ctx.fill();
      }
    }

    ctx.save();
    ctx.translate(shake, -rise);

    // kanatçıklar
    for (const s of [-1, 1]) {
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.moveTo(s * 24, -52); ctx.lineTo(s * 52, -2); ctx.lineTo(s * 24, -2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('red', 0.85);
      ctx.beginPath();
      ctx.moveTo(s * 25, -48); ctx.lineTo(s * 48, -4); ctx.lineTo(s * 25, -4);
      ctx.closePath(); ctx.fill();
    }

    // gövde
    blob(-28, -142, 56, 142, 16, k.rgba(p.color));
    // kırmızı kuşak
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath(); k.rrect(-28, -52, 56, 16, 6); ctx.fill();
    // burun konisi
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-28, -140); ctx.quadraticCurveTo(-24, -170, 0, -174);
    ctx.quadraticCurveTo(24, -170, 28, -140); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath();
    ctx.moveTo(-25, -141); ctx.quadraticCurveTo(-21, -167, 0, -171);
    ctx.quadraticCurveTo(21, -167, 25, -141); ctx.closePath(); ctx.fill();
    // pencere
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -105, 15 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(0, -105, 15, 0, k.TAU); ctx.fill();
    k.glow(0, -105, 26, 'cyan', 0.3);

    // premium parlama (gövde sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -120, 10, 26, 0.15, 0, k.TAU); ctx.fill();

    // motor alevi
    const flameLen = flying
      ? 70 + k.noise1(t * 8) * 22
      : 14 + k.noise1(t * 6) * 6;
    // dış alev (sarı)
    ctx.fillStyle = k.rgba('yellow', flying ? 0.95 : 0.7);
    ctx.beginPath();
    ctx.moveTo(-16, -2);
    ctx.quadraticCurveTo(-20, flameLen * 0.5, -6 + k.noise1(t * 7) * 8, flameLen);
    ctx.quadraticCurveTo(6 + k.noise1(t * 7 + 4) * 8, flameLen * 0.6, 16, -2);
    ctx.closePath(); ctx.fill();
    // iç alev (açık)
    ctx.fillStyle = k.rgba('ink', 0.55);
    ctx.beginPath();
    ctx.moveTo(-8, -2);
    ctx.quadraticCurveTo(-10, flameLen * 0.4, 0, flameLen * 0.7);
    ctx.quadraticCurveTo(8, flameLen * 0.4, 8, -2);
    ctx.closePath(); ctx.fill();
    if (flying) k.glow(0, flameLen * 0.4, 46, 'yellow', 0.4);

    ctx.restore();
  },
};
