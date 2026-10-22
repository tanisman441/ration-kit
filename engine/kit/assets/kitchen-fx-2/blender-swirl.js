// kitchen-fx-2/blender-swirl — blender: sıvı sürekli girdapla döner; pulse anında turbo nabız, sıçrama ve sarsıntı.
// NOT: canvas y-aşağıdır; taban y≈120, kapak y≈-150, girdap merkezi (0,10).
export default {
  name: 'blender-swirl', category: 'kitchen-fx-2',
  desc: 'Çalışan blender: meyve suyu sürekli girdapla döner; pulse anında turbo hız, sıçrama ve sarsıntı',
  tags: ['blender', 'mikser', 'girdap', 'dönme', 'meyve suyu', 'mutfak', 'smoothie', 'vortex', 'mixer', 'juice'],
  box: [-120, -170, 120, 150],
  bleed: 42,
  anchor: 'tabanın merkezi (0,120)',
  points: { base: [0, 90], lid: [0, -148], vortex: [0, 10] },
  params: {
    pulse: { type: 'time', default: null, desc: 'turbo nabız anı (0.8 sn): girdap hızlanır, sıvı sıçrar, gövde sarsılır' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.pulse == null ? -1 : t - p.pulse;
    const pulsing = d >= 0 && d <= 0.8;
    const g = pulsing ? k.prog(d, 0, 0.8) : -1;

    // girdap fazı: idle'da sürekli dönüş (1.8 sn tur), pulse'ta hız artar
    const boost = pulsing ? g * k.TAU * 3 : 0;
    const ph = t * (k.TAU / 1.8) + boost;

    // --- 1) gövde (taban) + gölge; pulse'ta sarsılır
    const shk = pulsing ? Math.sin(d * 46) * 3 * (1 - g) : 0;
    ctx.save(); ctx.translate(shk, 0);
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-64, 66, 140, 62, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-70, 60, 140, 62, 12); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // güç düğmesi (vurgu rengi + yanıp sönen LED)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.arc(7, 97, 17, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath(); ctx.arc(1, 91, 17, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    const ledOn = k.hash(Math.floor(t * 2)) > 0.4;
    ctx.fillStyle = k.rgba('yellow', ledOn ? 0.95 : 0.35);
    ctx.beginPath(); ctx.arc(1, 91, 7, 0, k.TAU); ctx.fill();
    // taban parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-42, 74, 22, 8, -0.2, 0, k.TAU); ctx.fill();

    // --- 2) kapak
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-58, -140, 128, 28, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    k.rrect(-64, -146, 128, 28, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();

    // --- 3) hazne: cam gövde + içindeki sıvı ve girdap (kırpılmış)
    const jarPath = () => {
      ctx.beginPath();
      ctx.moveTo(-58, -118); ctx.lineTo(58, -118);
      ctx.lineTo(82, 60); ctx.lineTo(-82, 60); ctx.closePath();
    };
    ctx.save();
    jarPath(); ctx.clip();
    // cam dolgusu
    ctx.fillStyle = k.rgba('panel', 0.45);
    ctx.fillRect(-90, -150, 180, 220);
    // sıvı (alt 2/3): dalgalı yüzey
    const surf = -16 + (pulsing ? Math.sin(d * 30) * 5 * (1 - g) : Math.sin(t * 2.6) * 3);
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath();
    ctx.moveTo(-90, 70); ctx.lineTo(-90, surf);
    for (let x = -90; x <= 90; x += 10) ctx.lineTo(x, surf + Math.sin(x * 0.14 + t * 5) * 3.5);
    ctx.lineTo(90, 70); ctx.closePath(); ctx.fill();
    // girdap kolları (3 kol, sürekli dönüş)
    const vcx = 0, vcy = 14;
    for (let i = 0; i < 3; i++) {
      const a = ph + i * (k.TAU / 3);
      const rr = 20 + i * 15;
      ctx.strokeStyle = k.rgba('yellow', 0.85 - i * 0.22);
      ctx.lineWidth = 9 - i * 1.5;
      ctx.beginPath(); ctx.arc(vcx, vcy, rr, a, a + 2.1); ctx.stroke();
    }
    // merkez girdabı (dönen elips + dikey bant)
    ctx.save(); ctx.translate(vcx, vcy); ctx.rotate(ph * 1.4);
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 22, 0, 0, k.TAU); ctx.fill();
    ctx.restore();
    // pulse sıçraması: damlalar içeride yükselir
    if (pulsing) {
      for (let i = 0; i < 7; i++) {
        const dg = k.prog(d - k.hash(i * 5 + 2) * 0.2, 0, 0.6);
        if (dg > 0) {
          const dx = (k.hash(i * 5 + 4) - 0.5) * 110;
          const dy = surf - 10 - 120 * Math.sin(dg * Math.PI);
          ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - dg));
          ctx.beginPath(); ctx.arc(dx, dy, 4 + k.hash(i * 5 + 6) * 4, 0, k.TAU); ctx.fill();
        }
      }
    }
    ctx.restore();
    // hazne dış hat + parlama
    ctx.strokeStyle = line; ctx.lineWidth = 7;
    jarPath(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-56, -70, 9, 44, 0.15, 0, k.TAU); ctx.fill();

    // --- 4) pulse hız çizgileri (hazne dışında)
    if (pulsing) {
      for (let i = 0; i < 4; i++) {
        const sx = (i % 2 ? 1 : -1) * (92 + (i >> 1) * 10);
        const yy = -80 + (i >> 1) * 50 + ((t * 300) % 40);
        ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - g));
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(sx, yy); ctx.lineTo(sx, yy + 26); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.restore();
  },
};
