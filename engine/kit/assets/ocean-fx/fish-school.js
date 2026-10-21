// ocean-fx/fish-school — balık sürüsü: balıklar formasyon içinde sine
// dalgasıyla yüzerek sağa/sola hareket eder (idle); scatter anında (0.8 sn)
// sürü patlayıp dağılır, sonra tekrar toplanır.
// NOT: canvas y-aşağıdır; (0,0) sürünün merkezidir.
export default {
  name: 'fish-school', category: 'ocean-fx',
  desc: 'Formasyon içinde dalgalanarak yüzen balık sürüsü, scatter anında dağılıp toplanır',
  tags: ['balık', 'sürü', 'formasyon', 'dağılma', 'school', 'fish', 'schooling', 'scatter', 'swarm', 'underwater'],
  box: [-220, -150, 220, 150],
  bleed: 40,
  anchor: 'sürünün merkezi (0,0)',
  points: { centre: [0, 0], leader: [90, 0] },
  params: {
    scatter: { type: 'time', default: null, desc: 'dağılma anı (0.8 sn, sürü patlar sonra toplanır)' },
    color: { type: 'color', default: 'cyan', desc: 'balık rengi' },
    count: { type: 'number', default: 9, desc: 'balık sayısı (4–12)' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();

    // Scatter: 0–0.8 sn içinde balıklar merkezden dışa patlar, sonra geri toplanır
    const sd = p.scatter == null ? -1 : t - p.scatter;
    let blast = 0;
    if (sd >= 0 && sd < 0.8) blast = Math.sin((sd / 0.8) * Math.PI);

    const N = Math.max(4, Math.min(12, Math.round(p.count == null ? 9 : p.count)));

    for (let i = 0; i < N; i++) {
      const h1 = k.hash(i * 17.3), h2 = k.hash(i * 5.9 + 2);
      // formasyon: oval dizilim
      const ang = (i / N) * k.TAU;
      const fx = Math.cos(ang) * 110, fy = Math.sin(ang) * 60;
      const wx = Math.sin(t * 2.2 + i * 1.9) * 14; // sine yüzüş dalgası
      const wy = Math.cos(t * 2.7 + i * 2.3) * 12;
      // scatter'da merkezden dışa fırlama
      const bx = fx * (1 + blast * 0.9) + wx;
      const by = fy * (1 + blast * 0.9) + wy;
      const s = 0.8 + h1 * 0.5; // boy varyasyonu
      const tailWag = Math.sin(t * 10 + i * 2.4) * 6; // kuyruk çırpma (kıvrak yüzüş)
      const a = 0.92;

      ctx.save();
      ctx.translate(bx, by);
      ctx.scale(s, s);
      // gövde: oval
      ctx.fillStyle = k.rgba(acc, a);
      ctx.beginPath(); ctx.ellipse(0, 0, 22, 12, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.ellipse(0, 0, 22, 12, 0, 0, k.TAU); ctx.stroke();
      // kuyruk: çırpınan üçgen
      ctx.fillStyle = k.rgba(acc, a);
      ctx.beginPath();
      ctx.moveTo(-20, 0); ctx.lineTo(-32, -9 + tailWag); ctx.lineTo(-32, 9 + tailWag);
      ctx.closePath(); ctx.fill();
      // sırt yüzgeci
      ctx.beginPath();
      ctx.moveTo(-4, -11); ctx.lineTo(2, -19); ctx.lineTo(8, -10);
      ctx.closePath(); ctx.fill();
      // premium finish: sol üst parlama (gövde)
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(-7, -4, 8, 4, -0.4, 0, k.TAU); ctx.fill();
      // göz
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.arc(11, -3, 3.2, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
};
