// animals/bee — uçan arı, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi.
export default {
  name: 'bee', category: 'animals',
  desc: 'Uçan arı, yandan görünüm; kanatlar hızla vızıldar, sting olayında iğne batırır',
  tags: ['arı', 'böcek', 'vızıltı', 'bal', 'bee', 'insect', 'buzz', 'sting'],
  box: [-85, -75, 85, 75],
  bleed: 65,
  anchor: 'gövde merkezi (0,0)',
  points: { sting: [-4, 50], head: [30, -3] },
  params: {
    color: { type: 'color', default: 'yellow' },
    sting: { type: 'time', default: null, desc: 'iğne batırma — yaklaşma + batış + geri çekilme (1.0 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const ds = p.sting == null ? -1 : t - p.sting;
    const stinging = ds >= 0 && ds < 1.0;
    // yaklaşma zarfı: 0–0.35 yaklaş, 0.7–1.0 geri çekil
    const e1 = stinging
      ? k.clamp(ds / 0.35, 0, 1) * (1 - k.clamp((ds - 0.7) / 0.3, 0, 1))
      : 0;
    // iğne uzama zarfı: 0.3–0.45 uzat, 0.55–1.0 topla
    const e2 = stinging
      ? k.clamp((ds - 0.3) / 0.15, 0, 1) * (1 - k.clamp((ds - 0.55) / 0.45, 0, 1))
      : 0;
    const buzz = Math.sin(t * k.TAU * 20);                           // hızlı kanat vızıltısı
    const bob = Math.sin(t * k.TAU * 2.5) * 3;                       // hafif süzülme
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    ctx.save();
    ctx.translate(36 * e1, bob + 44 * e1);                           // hedefe yaklaşma

    // kanatlar: hızlı titreme (canlı idle), yarı saydam
    for (const [wx, base] of [[-8, -0.5], [6, -0.2]]) {
      ctx.save(); ctx.translate(wx, -22); ctx.rotate(base + buzz * 0.3);
      ctx.fillStyle = k.rgba('ink', 0.28);
      ctx.beginPath(); ctx.ellipse(0, -16, 10, 22, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // gövde
    disc(0, 0, 31, 23, body);
    // çizgiler: gövdeye kırpılmış koyu bantlar
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, 0, 31, 23, 0, 0, k.TAU); ctx.clip();
    ctx.fillStyle = k.rgba('ink', 0.42);
    ctx.beginPath(); k.rrect(-12, -24, 10, 48, 5); ctx.fill();
    ctx.beginPath(); k.rrect(6, -24, 10, 48, 5); ctx.fill();
    ctx.restore();

    // baş + göz + anten
    disc(30, -3, 15, 14, body);
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(34, -7, 3.5, 3.5, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(30, -16); ctx.lineTo(40, -30); ctx.stroke();
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(40, -30, 3, 3, 0, 0, k.TAU); ctx.fill();

    // iğne: olayda karın altından uzar
    const nl = 8 + 26 * e2;
    ctx.strokeStyle = inkC; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-4, 14); ctx.lineTo(-4, 14 + nl); ctx.stroke();

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(18, -12, 9, 6, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();

    // batış flaşı: temas noktasında sarı parlama + kıvılcım çizgileri
    if (stinging && e2 > 0) {
      const fx = 36 * e1 - 4, fy = bob + 44 * e1 + 14 + 8 + 26 * e2;
      k.glow(fx, fy, 20 * e2, 'yellow', 0.5 * e2);
      ctx.strokeStyle = k.rgba('ink', 0.6 * e2); ctx.lineWidth = 3;
      for (const a of [0.3, 1.2, 2.4, 3.6, 5.1]) {
        const r1 = 14 * e2, r2 = 26 * e2;
        ctx.beginPath();
        ctx.moveTo(fx + Math.cos(a) * r1, fy + Math.sin(a) * r1);
        ctx.lineTo(fx + Math.cos(a) * r2, fy + Math.sin(a) * r2);
        ctx.stroke();
      }
    }
  },
};
