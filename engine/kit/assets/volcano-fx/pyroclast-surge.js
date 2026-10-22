// volcano-fx/pyroclast-surge — piroklastik akıntı dalgası: at anında soldan sağa
// hızla süpüren kül bulutu; önde köz parıltısı, arkada kalın duman.
// NOT: canvas y-aşağıdır; (0,0) = zemin çizgisi merkezi.
export default {
  name: 'pyroclast-surge',
  category: 'volcano-fx',
  desc: 'Piroklastik akıntı dalgası: at anında zeminden süpürerek geçen kül bulutu, ön cephesinde köz parıltısı',
  tags: ['piroklastik', 'akıntı', 'dalga', 'pyroclastic', 'surge', 'kül bulutu', 'süpürme', 'volkan'],
  box: [-170, -130, 170, 80],
  bleed: 90,
  anchor: 'zemin çizgisi merkezi (0,0)',
  points: { start: [-170, 20], crest: [0, -70] },
  params: {
    at: { type: 'time', default: null, desc: 'dalganın süpürme anı' },
    size: { type: 'number', default: 1, desc: 'büyüklük çarpanı' },
  },
  draw(ctx, t, p, k) {
    const s = Math.max(0.3, p.size);
    ctx.lineCap = 'round';

    // 1) zemin çizgisi — her zaman çizilir (ink hava çizgisi)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 5 * s;
    ctx.beginPath(); ctx.moveTo(-170 * s, 30 * s); ctx.lineTo(170 * s, 30 * s); ctx.stroke();

    // 2) bekleyen hafif zemin pusu (sürekli idle, nefes)
    const haze = 0.5 + 0.5 * Math.sin(t * (k.TAU / 3.4));
    ctx.fillStyle = k.rgba('dim', 0.10 + 0.06 * haze);
    ctx.beginPath();
    ctx.ellipse(0, 18 * s, 150 * s, 22 * s, 0, 0, k.TAU); ctx.fill();

    // 3) süpürme olayı — 0–1.5 sn: bulut soldan sağa geçer
    const d = p.at == null ? -1 : t - p.at;
    if (d >= 0 && d <= 1.6) {
      const g = k.E.outExpo(k.prog(d, 0, 1.3));           // hızlı çıkış, yumuşak yavaşlama
      const headX = (-150 + g * 330) * s;                 // ön cephe x konumu
      const al = d < 1.3 ? 1 : 1 - (d - 1.3) / 0.3;       // 1.3–1.6 sn arası çözülme

      // 3a) ana bulut gövdesi — önde kabarık, arkada sürüklenen
      for (let i = 0; i < 16; i++) {
        const trail = k.hash(i * 3 + 1);                  // 0 = ön cephe, 1 = kuyruk
        const px = headX - trail * (60 + 130 * g) * s + k.noise1(i * 7 + t * 5) * 14 * s;
        const py = (-30 - trail * 55 + k.hash(i * 5 + 2) * 45 - k.noise1(i * 11 + t * 4) * 20) * s;
        const r = (24 + (1 - trail * 0.45) * 36 + k.hash(i * 13 + 3) * 12) * s;
        ctx.fillStyle = k.rgba('dim', (0.68 - trail * 0.16) * al);
        ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
      }

      // 3b) ön cephede köz parıltısı (sıcak cephe)
      const emberA = (1 - g * 0.7) * al;
      k.glow(headX, -20 * s, 60 * s, 'red', 0.45 * emberA);
      for (let i = 0; i < 8; i++) {
        const ex = headX - k.hash(i * 17 + 4) * 60 * s;
        const ey = (-15 - k.hash(i * 19 + 5) * 55 + k.noise1(i * 23 + t * 9) * 10) * s;
        ctx.fillStyle = k.rgba('yellow', 0.8 * emberA);
        ctx.beginPath(); ctx.arc(ex, ey, (2 + k.hash(i * 29 + 6) * 3) * s, 0, k.TAU); ctx.fill();
      }

      // 3c) önde savrulan kaya parçaları — 0–1.0 sn
      if (d < 1.0) {
        const dd = d / 1.0, pal = 1 - dd;
        for (let i = 0; i < 10; i++) {
          const a = (k.hash(i * 31 + 7) - 0.5) * 1.4;
          const spd = (120 + k.hash(i * 37 + 8) * 120) * s;
          const e = 1 - Math.pow(1 - dd, 2);
          const px = headX + Math.cos(a) * spd * e;
          const py = -10 * s + Math.sin(a) * spd * e * 0.6 + dd * dd * 60 * s;
          ctx.fillStyle = k.rgba('dim', 0.8 * pal);
          const sz = (4 + k.hash(i * 41 + 9) * 6) * s;
          ctx.save(); ctx.translate(px, py); ctx.rotate(a + d * 8);
          ctx.fillRect(-sz / 2, -sz / 3, sz, sz * 0.66);
          ctx.restore();
        }
      }

      // 3d) arkada kalan duman perdesi (ink parlama yansıması)
      ctx.fillStyle = k.rgba('ink', 0.09 * al);
      ctx.beginPath(); ctx.ellipse(headX - 90 * s, -70 * s, 80 * s, 40 * s, -0.2, 0, k.TAU); ctx.fill();
    }
  },
};
