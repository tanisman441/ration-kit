// spy-fx/disguise-swap — yüz maskesi: `at` anında yüz bir "blink" ile değişiyor
// (göz/ağız/bıyık morph + tarama çizgisi), boştayken gözler kırpıyor.
// NOT: canvas y-aşağıdır; (0,0) yüzün merkezidir.
export default {
  name: 'disguise-swap',
  category: 'spy-fx',
  desc: 'Ajan yüz maskesi: bir göz kırpmasıyla yüz değişiyor, bıyık beliriyor',
  tags: ['maske', 'yüz', 'kılık', 'değiştirme', 'ajan', 'gizli', 'bıyık', 'mask', 'face', 'disguise', 'spy', 'morph'],
  box: [-110, -130, 110, 130],
  bleed: 50,
  anchor: 'yüz merkezi (0,0)',
  points: { eyes: [0, -22], nose: [0, 8], mouth: [0, 42], forehead: [0, -70] },
  params: {
    at: { type: 'time', default: null, desc: 'kılık değiştirme anı: 0.5 sn morph + tarama çizgisi' },
    color: { type: 'color', default: 'ink', desc: 'maske ana rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    // morph 0→1 (0.05–0.55 sn)
    const morph = d < 0 ? 0 : k.clamp(k.prog(d, 0.05, 0.55), 0, 1);
    const m = k.E.inOutCubic(morph);
    ctx.save();

    // morph çakması — ilk 0.14 sn: tüm yüz dikeyde "göz kırpar" (tema bağımsız)
    if (d >= 0 && d < 0.14) {
      const f = Math.sin((d / 0.14) * Math.PI);
      ctx.scale(1, 1 - 0.88 * f);
    }

    // idle: baş hafifçe sallanıyor
    ctx.translate(k.noise1(t * 0.8) * 2, Math.sin(t * 1.7) * 2.5);
    ctx.rotate(k.noise1(t * 0.6 + 3) * 0.02);

    // yüz ovali
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.ellipse(0, 0, 74, 92, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    // premium finish: sol üst parlama + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-34, -52, 22, 34, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(38, 54, 24, 30, -0.4, 0, k.TAU); ctx.fill();

    // morph ile değişen ton: ikinci yüz biraz daha koyu
    if (m > 0) {
      ctx.fillStyle = k.rgba('bg', 0.14 * m);
      ctx.beginPath(); ctx.ellipse(0, 0, 74, 92, 0, 0, k.TAU); ctx.fill();
    }

    // göz kırpma (idle): 3–5 sn'de bir, 0.12 sn
    const blinkT = t % 4.2;
    const blink = blinkT < 0.12 ? Math.sin((blinkT / 0.12) * Math.PI) : 0;
    // morph sırasında gözler kapalı gibi (blink efekti)
    const morphBlink = morph > 0 && morph < 1 ? Math.sin(morph * Math.PI) * 0.9 : 0;
    const lid = Math.max(blink, morphBlink);

    // gözler: açık yuvarlak → kısık (morph'ta gözler daralır ve kaşlar çatılır)
    for (const s of [-1, 1]) {
      const ex = s * 28, ey = -24;
      const eyeH = k.lerp(11, 6, m); // morph: gözler daralır
      ctx.fillStyle = k.rgba('bg', 0.85);
      if (lid > 0.5) {
        ctx.strokeStyle = k.rgba('bg', 0.85); ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ex - 11, ey); ctx.lineTo(ex + 11, ey); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.ellipse(ex, ey, 11, eyeH * (1 - lid * 0.85), 0, 0, k.TAU); ctx.fill();
        // gözbebeği
        ctx.fillStyle = k.rgba('panel');
        ctx.beginPath(); ctx.arc(ex + s * 2, ey + 1, 3.5 * (1 - lid * 0.85), 0, k.TAU); ctx.fill();
      }
      // kaşlar: morph'ta iç uçlar aşağı çekilir (çatık)
      ctx.strokeStyle = k.rgba('bg', 0.85); ctx.lineWidth = 5; ctx.lineCap = 'round';
      const browY = ey - 22;
      ctx.beginPath();
      ctx.moveTo(ex - s * 14, browY - m * 7);
      ctx.lineTo(ex + s * 14, browY + m * 2);
      ctx.stroke();
    }

    // burun çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.6); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 2); ctx.quadraticCurveTo(6, 18, -2, 26); ctx.stroke();

    // ağız: nötr çizgi → morph'ta kendinden emin gülümseme
    ctx.strokeStyle = k.rgba('bg', 0.85); ctx.lineWidth = 4.5;
    ctx.beginPath();
    if (m < 0.5) {
      ctx.moveTo(-16, 44); ctx.lineTo(16, 44);
    } else {
      ctx.arc(0, 38 + m * 4, 18, Math.PI * 0.25, Math.PI * 0.75);
    }
    ctx.stroke();

    // bıyık: morph ile beliriyor
    if (m > 0.02) {
      ctx.fillStyle = k.rgba('bg', 0.85 * m);
      for (const s of [-1, 1]) {
        ctx.save(); ctx.translate(s * 16, 34); ctx.rotate(s * 0.25);
        ctx.beginPath(); ctx.ellipse(s * 12, 0, 16, 6.5, s * 0.35, 0, k.TAU); ctx.fill();
        ctx.restore();
      }
    }

    // tarama çizgisi — morph sırasında yüzü yukarıdan aşağı tarar
    if (morph > 0 && morph < 1) {
      const scanY = k.lerp(-95, 95, k.E.inOutCubic(morph));
      ctx.fillStyle = k.rgba('yellow', 0.55);
      ctx.fillRect(-74, scanY - 2, 148, 4);
      k.glow(0, scanY, 90, 'yellow', 0.25);
    }

    ctx.restore();
  },
};
