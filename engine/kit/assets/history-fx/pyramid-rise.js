// history-fx/pyramid-rise — piramit silueti; build 0→1: katmanlar alttan üste yükselir; kum rüzgarı eser.
// NOT: canvas y-aşağıdır; (0,0) = zemin merkezi. Yükseklik negatif y yönündedir.
const LW = 5;
function C(ctx, k, x, y, r, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
}
export default {
  name: 'pyramid-rise', category: 'history-fx',
  desc: 'Piramit silueti; build 0→1 ile katmanlar alttan üste yükselir, kum rüzgarı çizgileri eser',
  tags: ['piramit', 'mısır', 'tarih', 'antik', 'çöl', 'inşaat', 'giza', 'pyramid', 'egypt', 'history', 'desert', 'ancient'],
  box: [-168, -188, 168, 30],
  bleed: 36,
  anchor: 'zemin merkezi (0,0)',
  points: { apex: [0, -150], base: [0, 0] },
  params: {
    build: { type: 'number', default: 1, desc: 'inşaat ilerlemesi 0–1 (katmanlar alttan üste yükselir)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const N = 7, H = 150, W = 280, lh = H / N;
    const b = k.clamp(p.build, 0, 1);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // güneş
    k.glow(112, -144, 48, 'yellow', 0.32);
    C(ctx, k, 112, -144, 20, k.rgba('yellow', 0.9));

    // zemin kumulları
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(-95, 8, 82, 12, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(95, 10, 96, 13, 0, 0, k.TAU); ctx.fill();

    // build=0 iken kesik çizgili hayalet kontur
    if (b <= 0.001) {
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.moveTo(-W / 2, 0); ctx.lineTo(0, -H); ctx.lineTo(W / 2, 0); ctx.closePath(); ctx.stroke();
      ctx.setLineDash([]);
    }

    const widthAt = h => W * (1 - h / H); // h: tabandan yükseklik
    for (let i = 0; i < N; i++) {
      const g = k.clamp(b * N - i, 0, 1);
      if (g <= 0) continue;
      const h0 = i * lh, h1 = (i + 1) * lh;
      const w0 = widthAt(h0) / 2 - 2, w1 = widthAt(h1) / 2 - 2;
      const yOff = (1 - k.E.outExpo(g)) * 46;
      ctx.save();
      ctx.globalAlpha = Math.min(1, g * 1.6);
      ctx.translate(0, yOff);
      // katman yamuk: kontur + gövde
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath();
      ctx.moveTo(-w0 - 2.5, -h0); ctx.lineTo(w0 + 2.5, -h0);
      ctx.lineTo(w1 + 2.5, -h1); ctx.lineTo(-w1 - 2.5, -h1);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 1);
      ctx.beginPath();
      ctx.moveTo(-w0, -h0); ctx.lineTo(w0, -h0);
      ctx.lineTo(w1, -h1); ctx.lineTo(-w1, -h1);
      ctx.closePath(); ctx.fill();
      // sağ yüz gölgesi (tek ton koyultma)
      ctx.fillStyle = k.rgba('bg', 0.16);
      ctx.beginPath();
      ctx.moveTo(w0 * 0.25, -h0); ctx.lineTo(w0, -h0);
      ctx.lineTo(w1, -h1); ctx.lineTo(w1 * 0.25, -h1);
      ctx.closePath(); ctx.fill();
      // harç çizgisi (iç ayrım)
      ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-w1, -h1); ctx.lineTo(w1, -h1); ctx.stroke();
      ctx.restore();
    }
    // sol üst parlama (piramit tamamlanınca)
    if (b > 0.9) {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-58, -108, 42, 11, -0.55, 0, k.TAU); ctx.fill();
    }

    // kum rüzgarı: sürüklenen 3 çizgi (döngüsel idle)
    for (let i = 0; i < 3; i++) {
      const ph = ((t * (26 + i * 7) + i * 130) % 340) / 340;
      const x = -170 + ph * 340;
      const y = -46 - i * 26 + k.noise1(t * 2 + i * 9) * 6;
      const len = 46 + i * 14;
      ctx.strokeStyle = k.rgba('ink', 0.35 * Math.sin(ph * Math.PI));
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - len / 2, y);
      ctx.quadraticCurveTo(x, y - 7, x + len / 2, y + 2);
      ctx.stroke();
    }
  },
};
