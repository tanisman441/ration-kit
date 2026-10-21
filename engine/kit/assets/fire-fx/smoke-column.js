// fire-fx/smoke-column — yükselen duman sütunu: kıvrılan puflar, yoğunlukla ölçeklenir, dağılır.
// NOT: canvas y-aşağıdır; (0,0) sütunun tabanıdır.
export default {
  name: 'smoke-column',
  category: 'fire-fx',
  desc: 'Yükselen duman sütunu: kıvrılarak yukarı süzülen puflar, yoğunluğa göre kalınlık ve hız',
  tags: ['duman', 'sütun', 'yükselme', 'kıvrılma', 'yangın', 'smoke', 'column', 'rising', 'fire', 'haze'],
  box: [-130, -200, 130, 40],
  bleed: 40,
  anchor: 'sütunun tabanı (0,0)',
  points: { base: [0, 0], top: [0, -180] },
  params: {
    intensity: { type: 'number', default: 0.7, desc: '0–1: duman yoğunluğu (kalınlık + yükselme hızı)' },
    color: { type: 'color', default: 'dim', desc: 'duman tonu' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: sütun büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const I = k.clamp(p.intensity, 0, 1);
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- kor közü: tabanda nabız gibi yanan köz ---
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.6);
    k.glow(0, 6 * S, 40 * S * I + 14, k.col('red'), 0.25 * I * (0.6 + 0.4 * pulse));
    ctx.fillStyle = k.rgba('red', 0.5 * I);
    ctx.beginPath(); ctx.arc(0, 6 * S, 10 * S * I + 4, 0, k.TAU); ctx.fill();

    // --- sütun: 14 döngülü puff, altta kalın → yukarıda incelip dağılır ---
    const N = 14;
    for (let i = 0; i < N; i++) {
      const cyc = 7 * (0.7 + 0.6 * I);          // tam tur süresi (sn)
      const ph = ((t / cyc) + i / N) % 1;        // 0 = taban, 1 = tepede
      const y = -ph * 205 * S;
      // kıvrılma: iki sinüsün karışımı, yukarıda büyür
      const sway = (k.noise1(t * 0.9 + i * 17) * 34 + Math.sin(t * 1.7 + i * 2.1) * 12) * ph * S;
      const r = (14 + 30 * ph) * S * (0.4 + 0.6 * I); // büyüyerek dağılma
      const alpha = (1 - ph) * (1 - ph) * 0.5 * (0.25 + 0.75 * I);
      if (alpha < 0.01) continue;
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath(); ctx.arc(sway, y, r, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(sway + r * 0.5, y - r * 0.35, r * 0.72, 0, k.TAU); ctx.fill();
      // sol üst parlama (premium finish, alfa 0.10) — duman pufunun aydınlık tarafı
      ctx.fillStyle = k.rgba('bg', 0.10 * (1 - ph));
      ctx.beginPath(); ctx.ellipse(sway - r * 0.28, y - r * 0.3, r * 0.4, r * 0.22, -0.5, 0, k.TAU); ctx.fill();
      // sağ alt gölge
      ctx.fillStyle = k.rgba(p.color, alpha * 0.35);
      ctx.beginPath(); ctx.ellipse(sway + r * 0.3, y + r * 0.32, r * 0.38, r * 0.2, 0.5, 0, k.TAU); ctx.fill();
    }

    // --- canlı idle: sütun tabanında süzülen ısı çizgileri ---
    for (let i = 0; i < 5; i++) {
      const h = k.hash(i * 31 + 2);
      const x = (h - 0.5) * 70 * S;
      const wob = k.noise1(t * 6 + i * 5) * 5 * S;
      ctx.strokeStyle = k.rgba('yellow', 0.28 * I);
      ctx.lineWidth = 2.4 * S;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, -8 * S);
      ctx.quadraticCurveTo(x + wob, -26 * S, x + wob * 2, -44 * S);
      ctx.stroke();
    }

    ctx.restore();
  },
};
