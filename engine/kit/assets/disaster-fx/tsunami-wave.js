// disaster-fx/tsunami-wave — tsunami: kıvrılan dev dalga, beyaz köpük tepesi.
// surge anında dalga kabarır, kırılır ve su püskürür (0.9 sn); sonrasında dalga
// geri çekilir. Sürekli: yüzeyi dalgalanır, köpük kıpırdar (idle).
// NOT: canvas y-aşağıdır; (0,0) dalga tabanıdır.
export default {
  name: 'tsunami-wave', category: 'disaster-fx',
  desc: 'Tsunami: kabaran dev dalga, köpük tepesi, kırılma ve su püskürmesi',
  tags: ['tsunami', 'dalga', 'dev dalga', 'sel', 'köpük', 'afet', 'wave', 'tsunami', 'surf', 'foam', 'disaster', 'flood'],
  box: [-150, -130, 150, 60],
  bleed: 50,
  anchor: 'dalga tabanı (0,0)',
  points: { crest: [60, -95], foam: [-30, -80], base: [0, 10] },
  params: {
    surge: { type: 'time', default: null, desc: 'dalganın kabarıp kırıldığı an (0.9 sn sürer, sonra geri çekilir)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.surge == null ? -1 : t - p.surge;
    const acc = p.color;
    ctx.save();

    // Kabarma eğrisi: surge yoksa sakin, varsa 0.9 sn'de kabar-kır-çekil
    const burst = d < 0 ? 0 : k.prog(d, 0, 0.45) * (1 - k.prog(d, 0.55, 0.95));
    const H = 70 + burst * 45;
    const sway = Math.sin(t * 1.6) * 4;

    // Dalga gövdesi — kıvrılan duvar (soldan sağa tırmanan eğri)
    ctx.fillStyle = k.rgba(acc, 0.85);
    ctx.beginPath();
    ctx.moveTo(-150, 40);
    ctx.lineTo(-150, -30);
    ctx.bezierCurveTo(-110, -55 - H * 0.15, -70, -H - 10, -30, -H - 6 + sway);
    ctx.bezierCurveTo(10, -H - 14, 55, -H + 6, 95, -H + 28 + sway);
    // kırılma tepesi — içe kıvrılan köpük dudağı
    ctx.bezierCurveTo(118, -H + 40, 105, -H + 62, 78, -H + 58);
    ctx.bezierCurveTo(95, -H + 30, 60, -H + 18, 20, -H + 8);
    ctx.bezierCurveTo(-30, -H + 2, -80, -20, -110, 40);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.stroke();

    // iç tonlama — sağ üstte koyu iç hacim, sol üstte parlama (premium finish)
    ctx.fillStyle = k.rgba('ink', 0.1);
    ctx.beginPath(); ctx.ellipse(70, -H + 30, 42, 16, 0.3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-75, -H * 0.55 - 8, 44, 13, -0.25, 0, k.TAU); ctx.fill();

    // Köpük tepesi — kabarık köpük topakları, sürekli kıpırdar (idle)
    const nFoam = 12;
    for (let i = 0; i < nFoam; i++) {
      const seed = i * 61 + 8;
      const fx = -40 + k.hash(seed) * 150 + sway * 0.6;
      const fy = -H + 18 + k.hash(seed + 1) * 22;
      const wr = 5 + k.hash(seed + 2) * 9 + burst * 5;
      const wob = 1 + 0.18 * Math.sin(t * 5 + seed);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.75 + 0.15 * burst).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(fx, fy - Math.abs(Math.sin(t * 2.2 + seed)) * 4, wr * wob, 0, k.TAU); ctx.fill();
    }

    // Deniz yüzeyi şeridi — altta dalgalanan su çizgisi
    ctx.fillStyle = k.rgba(acc, 0.5);
    ctx.beginPath();
    ctx.moveTo(-150, 40);
    for (let x = -150; x <= 150; x += 12) {
      ctx.lineTo(x, 40 + Math.sin(x * 0.08 + t * 3) * 4);
    }
    ctx.lineTo(150, 60); ctx.lineTo(-150, 60);
    ctx.closePath(); ctx.fill();

    // Kırılma püskürmesi — surge'un 0.15–0.9 sn arası su damlaları
    if (d >= 0.12 && d < 0.95) {
      const g = k.prog(d, 0.12, 0.95);
      for (let i = 0; i < 16; i++) {
        const seed = i * 47 + 19;
        const px = 60 + (k.hash(seed) - 0.4) * 90;
        const h = g * (40 + k.hash(seed + 1) * 70) * (1 - g * 0.5);
        const py = -H + 30 - h;
        ctx.fillStyle = k.rgba(acc, 0.9 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 2.4 * (1 - g) + 0.8, 0, k.TAU); ctx.fill();
      }
      // beyaz patlama bulutu
      ctx.fillStyle = 'rgba(255,255,255,' + (0.65 * (1 - g)).toFixed(3) + ')';
      ctx.beginPath();
      ctx.ellipse(70, -H + 44, 30 + g * 42, 14 + g * 20, 0.15, 0, k.TAU);
      ctx.fill();
    }

    ctx.restore();
  },
};
