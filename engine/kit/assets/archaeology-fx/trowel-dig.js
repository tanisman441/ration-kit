// archaeology-fx/trowel-dig — mala toprağı kazar; `at` anında mala saplanır, toprak parçaları fırlar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kazı çukurunun merkezi.
export default {
  name: 'trowel-dig', category: 'archaeology-fx',
  desc: 'Üçgen uçlu kazı malası toprak yığınına saplanır; kazı anında toprak parçaları havaya fırlar',
  tags: ['mala', 'kazı', 'arkeoloji', 'toprak', 'trowel', 'dig', 'archaeology', 'excavation', 'soil', 'shovel'],
  box: [-130, -110, 130, 110],
  bleed: 55,
  anchor: 'kazı çukurunun merkezi (0,0); mala sağ üstten sola eğik saplanır',
  points: { blade: [-8, 58], handle: [72, -62], pit: [0, 70] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'kazı anı — mala toprağa saplanır, toprak parçaları fırlar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const dig = d >= 0 && d < 0.9;
    const env = dig ? Math.sin(Math.min(d / 0.9, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // toprak yığını (alt)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-118, 30, 236, 76, 26); ctx.fill();
    blob(-118, 30, 236, 76, 26, k.rgba('panel2'));
    // toprak benekleri
    ctx.fillStyle = k.rgba('ink', 0.35);
    for (let i = 0; i < 9; i++) {
      const bx = -102 + k.hash(i * 3) * 204;
      const by = 46 + k.hash(i * 3 + 1) * 44;
      ctx.beginPath(); ctx.ellipse(bx, by, 5 + k.hash(i) * 5, 3 + k.hash(i + 9) * 3, 0, 0, k.TAU); ctx.fill();
    }
    // kazı çukuru (koyu oyuk)
    ctx.fillStyle = k.rgba('ink', 0.55);
    ctx.beginPath(); ctx.ellipse(0, 62, 46, 16, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-112, 92, 224, 10, 5); ctx.fill();

    // mala: boşta hafif yukarı-aşağı salınır, kazıda saplanır
    const bob = Math.sin(t * k.TAU / 2.2) * 3;
    const plunge = env * 26;
    ctx.save();
    ctx.translate(34 - env * 8, -6 + bob + plunge);
    ctx.rotate(0.5 - env * 0.12);

    // sap
    blob(-12, -72, 24, 62, 11, k.rgba(p.color));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-4, -52, 4, 14, 0.1, 0, k.TAU); ctx.fill();
    // sap ucu topuzu
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, -74, 15, 9, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(0, -74, 12, 6, 0, 0, k.TAU); ctx.fill();
    // metal boyun
    blob(-8, -14, 16, 16, 5, k.rgba('panel2'));
    // üçgen bıçak (aşağı bakar)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-30, 2); ctx.lineTo(30, 2); ctx.lineTo(0, 62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.moveTo(-25, 4); ctx.lineTo(25, 4); ctx.lineTo(0, 56); ctx.closePath(); ctx.fill();
    // bıçak parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-9, 22, 5, 12, 0.35, 0, k.TAU); ctx.fill();
    // bıçak orta çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(0, 50); ctx.stroke();
    ctx.restore();

    // toprak parçaları (kazı anı, 0.9 sn)
    if (dig) {
      for (let i = 0; i < 11; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.2) / 0.55, 0, 1);
        if (prog <= 0) continue;
        const dir = k.hash(i + 20) - 0.5;
        const dx = -6 + dir * 90 * prog;
        const dy = 52 - prog * (46 + k.hash(i + 40) * 40) + prog * prog * 90;
        const s = 7 + k.hash(i + 50) * 8;
        ctx.fillStyle = k.rgba('dim', 1.0 * (1 - prog * 0.4));
        ctx.save(); ctx.translate(dx, dy); ctx.rotate(dir * prog * 2);
        ctx.beginPath(); k.rrect(-s / 2, -s / 2, s, s * 0.8, 3); ctx.fill();
        ctx.restore();
      }
      // toz halkası
      ctx.strokeStyle = k.rgba('dim', 0.7 * (1 - d / 0.9));
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, 62, 50 + d * 60, 14 + d * 16, 0, 0, k.TAU); ctx.stroke();
    }
  },
};
