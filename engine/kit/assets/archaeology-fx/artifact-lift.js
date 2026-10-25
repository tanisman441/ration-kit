// archaeology-fx/artifact-lift — altın amfora topraktan kaldırılır; `at` anında yükselir, parıltılar saçar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) toprak yığınının merkezi.
export default {
  name: 'artifact-lift', category: 'archaeology-fx',
  desc: 'Altın amfora toprak yığınından yukarı kaldırılır; kaldırma anında parıltılar saçar, toprak kırıntıları dökülür',
  tags: ['eser', 'amfora', 'vazo', 'arkeoloji', 'kaldırma', 'altın', 'artifact', 'amphora', 'vase', 'archaeology', 'gold', 'excavation'],
  box: [-130, -110, 130, 110],
  bleed: 55,
  anchor: 'toprak yığınının merkezi (0,0); amfora merkezde yükselir',
  points: { top: [0, -84], neck: [0, -52], base: [0, 40] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'kaldırma anı — amfora yükselir, parıltı + dökülen toprak (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const lift = d >= 0 && d < 1.2;
    // yükselme eğrisi: hızlı kalkış, yumuşak duruş
    const liftP = lift ? 1 - Math.pow(1 - Math.min(d / 1.2, 1), 2) : (d >= 1.2 ? 1 : 0);
    const env = lift ? Math.sin(Math.min(d / 1.2, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // toprak yığını (alt)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-118, 34, 236, 72, 26); ctx.fill();
    blob(-118, 34, 236, 72, 26, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('ink', 0.35);
    for (let i = 0; i < 8; i++) {
      const bx = -100 + k.hash(i * 3) * 200;
      const by = 50 + k.hash(i * 3 + 1) * 40;
      ctx.beginPath(); ctx.ellipse(bx, by, 5 + k.hash(i) * 5, 3 + k.hash(i + 9) * 3, 0, 0, k.TAU); ctx.fill();
    }
    // çukur izi (eser çıkınca görünür)
    ctx.fillStyle = k.rgba('ink', 0.45);
    ctx.beginPath(); ctx.ellipse(0, 66, 34 * (0.4 + 0.6 * liftP), 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-112, 94, 224, 10, 5); ctx.fill();

    // amfora: boşta hafif parıltı nabzı, kaldırmada yükselir + hafif döner
    const shimmer = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.8);
    const rise = liftP * 78;
    ctx.save();
    ctx.translate(0, -rise);
    ctx.rotate(Math.sin(t * k.TAU / 3) * 0.015 + liftP * 0.06);

    // kulplar (yanlar)
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.arc(-34, -30, 14, Math.PI * 0.6, Math.PI * 1.45); ctx.stroke();
    ctx.beginPath(); ctx.arc(34, -30, 14, Math.PI * 1.55, Math.PI * 0.4); ctx.stroke();
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(-34, -30, 14, Math.PI * 0.6, Math.PI * 1.45); ctx.stroke();
    ctx.beginPath(); ctx.arc(34, -30, 14, Math.PI * 1.55, Math.PI * 0.4); ctx.stroke();

    // boyun + ağız
    blob(-14, -66, 28, 26, 8, k.rgba('yellow', 0.9));
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-19, -76, 38, 14, 7); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.9); ctx.beginPath(); k.rrect(-16, -73, 32, 10, 5); ctx.fill();
    // gövde (amfora silueti)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -2, 42, 48, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.ellipse(0, -2, 38, 44, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -26, 10, 20, 0.25, 0, k.TAU); ctx.fill();
    // süs bandı
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-36, -8); ctx.quadraticCurveTo(0, 0, 36, -8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-30, 12); ctx.quadraticCurveTo(0, 19, 30, 12); ctx.stroke();
    // ayak
    blob(-16, 38, 32, 12, 6, k.rgba('yellow', 0.9));
    // parıltı nabzı (boşta)
    ctx.fillStyle = k.rgba('yellow', 0.25 + 0.35 * shimmer);
    ctx.beginPath(); ctx.ellipse(-16, -26, 6, 10, 0.25, 0, k.TAU); ctx.fill();
    ctx.restore();

    // kaldırma parıltıları (yıldızlar)
    if (lift) {
      for (let i = 0; i < 8; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.25) / 0.5, 0, 1);
        if (prog <= 0) continue;
        const sx = (k.hash(i + 20) - 0.5) * 110;
        const sy = -40 - rise + (k.hash(i + 30) - 0.5) * 90 - prog * 24;
        const s = (5 + k.hash(i + 40) * 7) * (1 - prog * 0.5);
        const a = 0.95 * (1 - prog);
        ctx.strokeStyle = k.rgba('yellow', a); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(sx - s, sy); ctx.lineTo(sx + s, sy); ctx.moveTo(sx, sy - s); ctx.lineTo(sx, sy + s); ctx.stroke();
      }
      // dökülen toprak kırıntıları
      for (let i = 0; i < 8; i++) {
        const prog = k.clamp((d - k.hash(i + 60) * 0.3) / 0.6, 0, 1);
        if (prog <= 0) continue;
        const dx = (k.hash(i + 70) - 0.5) * 70;
        const dy = 40 - rise * 0.4 + prog * prog * 60;
        ctx.fillStyle = k.rgba('dim', 0.85 * (1 - prog * 0.6));
        ctx.beginPath(); ctx.ellipse(dx, dy, 4 + k.hash(i + 80) * 4, 3 + k.hash(i + 90) * 3, 0, 0, k.TAU); ctx.fill();
      }
      // halo
      ctx.fillStyle = k.rgba('yellow', 0.12 * env);
      ctx.beginPath(); ctx.ellipse(0, -40 - rise, 70, 70, 0, 0, k.TAU); ctx.fill();
    }
  },
};
