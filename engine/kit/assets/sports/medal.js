// sports/medal — madalya: daire + kurdele (V şeridi) + iç yıldız; award anında parıltı
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) madalyonun merkezidir.
export default {
  name: 'medal', category: 'sports',
  desc: 'Kurdeleli madalya; award anında yıldız kabartması parlar',
  tags: ['madalya', 'medal', 'ödül', 'award', 'kurdele', 'ribbon', 'şampiyon', 'winner', 'spor', 'altın'],
  box: [-70, -130, 70, 70],
  bleed: 30,
  anchor: 'madalyonun merkezi (0,0)',
  points: { top: [0, -115] },
  params: {
    color: { type: 'color', default: 'yellow' },
    award: { type: 'time', default: null, desc: 'ödül anı (parıltı)' },
  },
  draw(ctx, t, p, k) {
    const R = 52;
    const LW = 5;
    const metal = k.rgba(p.color), line = k.rgba('bg', 0.55);

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const star = (cx, cy, r, fill) => {
      ctx.fillStyle = fill; ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };

    // award parıltısı: 0.6 sn
    const d = p.award == null ? -1 : t - p.award;
    const awarding = d >= 0 && d < 0.6;
    const aa = awarding ? 1 - d / 0.6 : 0;

    // kurdele (V şeridi, arkada): iki bant yukarı doğru
    const ribbon = (dx) => {
      ctx.beginPath();
      ctx.moveTo(dx * 0.55 - 13, -30); ctx.lineTo(dx, -118);
      ctx.lineTo(dx + 22, -118); ctx.lineTo(dx * 0.55 + 13, -30);
      ctx.closePath();
    };
    ribbon(-12); ctx.fillStyle = k.rgba('red'); ctx.fill();
    ribbon(12); ctx.fillStyle = k.rgba('red'); ctx.fill();
    // kurdele iç çizgisi (ink 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ribbon(-12); ctx.stroke();
    ribbon(12); ctx.stroke();

    // sağ alt gölge (%12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(6, 6, R, 0, k.TAU); ctx.fill();

    // madalyon: dış hat + ana disk
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = metal;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();

    // iç halka (ink 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, R - 13, 0, k.TAU); ctx.stroke();

    // iç yıldız kabartması (ink 0.75)
    star(0, 0, 22, k.rgba('ink', 0.75));

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-17, -19, 15, 9, -0.4, 0, k.TAU); ctx.fill();

    // award efekti: parıltı yıldızları (0.6 sn)
    if (awarding) {
      ctx.save(); ctx.globalAlpha = aa;
      star(-R - 18, -R - 6, 12, 'rgba(255,255,255,0.9)');
      star(R + 16, -R + 4, 9, 'rgba(255,255,255,0.9)');
      ctx.restore();
    }
  },
};
