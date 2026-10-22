// aquarium-fx/fish-glide — yan görünümlü akvaryum balığı: kuyruk idle
// dalgalanır (~1.1 sn periyot), gövde hafifçe süzülür; dart anında
// (0.5 sn) ileri atılır, kuyruk hızlanır, hız çizgileri çıkar.
// NOT: canvas y-aşağıdır; (0,0) gövdenin merkezidir, balık sağa bakar.
export default {
  name: 'fish-glide', category: 'aquarium-fx',
  desc: 'Kuyruğu dalgalanarak süzülen yan görünümlü akvaryum balığı, dart anında ileri atılır',
  tags: ['balık', 'akvaryum', 'yüzme', 'süzülme', 'kuyruk', 'fish', 'glide', 'swim', 'aquarium', 'aquatic'],
  box: [-120, -55, 120, 55],
  bleed: 45,
  anchor: 'gövdenin merkezi (0,0), balık sağa bakar',
  points: { head: [78, -2], tail: [-72, 0], back: [0, -32] },
  params: {
    dart: { type: 'time', default: null, desc: 'ileri atılma anı (0.5 sn, kuyruk hızlanır + hız çizgileri)' },
    color: { type: 'color', default: 'cyan', desc: 'balık rengi' },
    speed: { type: 'number', default: 1, desc: 'süzülme hızı çarpanı (0.5–2)' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const sp = p.speed == null ? 1 : p.speed;
    ctx.save();
    ctx.lineCap = 'round';

    // dart olayı (0.5 sn): ileri sıçrama + kuyruk çırpıntısı + hız çizgileri
    const dd = p.dart == null ? -1 : t - p.dart;
    let dartAmp = 0, dartMove = 0, dartLines = 0;
    if (dd >= 0 && dd < 0.5) {
      const pp = dd / 0.5;
      dartMove = Math.sin(pp * Math.PI) * 46;          // ileri-giden ease
      dartAmp = Math.sin(pp * Math.PI);                 // 0→peak→0
      dartLines = 1 - pp;
    }

    // idle: hafif yukarı-aşağı süzülme + yatay sürüklenme
    const bobY = Math.sin(t * k.TAU / 2.8) * 6;
    const driftX = k.noise1(t * 0.3) * 8 * sp;
    ctx.translate(dartMove + driftX, bobY);

    const wag = Math.sin(t * k.TAU / 1.1 * sp) * (0.32 + dartAmp * 0.85);

    // kuyruk yüzgeci (geride, dalgalanır)
    ctx.save();
    ctx.translate(-64, 0); ctx.rotate(wag);
    ctx.fillStyle = k.rgba(acc, 0.85);
    ctx.beginPath();
    ctx.moveTo(6, 0); ctx.lineTo(-34, -30); ctx.lineTo(-24, 0); ctx.lineTo(-34, 30); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(6, 0); ctx.lineTo(-34, -30); ctx.lineTo(-24, 0); ctx.lineTo(-34, 30); ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // gövde: yatık elips
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.ellipse(0, 0, 72, 30, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 0, 72, 30, 0, 0, k.TAU); ctx.stroke();
    // karın: açık ton şerit
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath(); ctx.ellipse(8, 13, 48, 12, 0, 0, k.TAU); ctx.fill();
    // premium finish: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-26, -13, 26, 10, -0.4, 0, k.TAU); ctx.fill();

    // sırt yüzgeci
    ctx.fillStyle = k.rgba(acc, 0.75);
    ctx.beginPath();
    ctx.moveTo(-28, -28); ctx.quadraticCurveTo(2, -52, 30, -30); ctx.quadraticCurveTo(0, -24, -28, -28);
    ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-28, -28); ctx.quadraticCurveTo(2, -52, 30, -30); ctx.stroke();

    // göğüs yüzgeci (çırpınır)
    const fin = Math.sin(t * k.TAU / 0.9 * sp) * 0.3;
    ctx.save();
    ctx.translate(18, 18); ctx.rotate(0.5 + fin * 0.4);
    ctx.fillStyle = k.rgba(acc, 0.7);
    ctx.beginPath(); ctx.ellipse(10, 0, 14, 6, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // solungaç çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(38, 0, 16, -1.1, 1.1); ctx.stroke();

    // göz: beyaz + ink bebek
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(50, -8, 8, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.arc(52, -8, 4, 0, k.TAU); ctx.fill();

    // ağız: kısa yay
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(68, 2, 6, 0.6, 2.2); ctx.stroke();

    // dart: hız çizgileri (kuyruğun arkasında)
    if (dartLines > 0) {
      ctx.strokeStyle = k.rgba('ink', 0.45 * dartLines); ctx.lineWidth = 3.5;
      for (let i = 0; i < 3; i++) {
        const yy = -18 + i * 18;
        const len = (26 + i * 10) * dartLines;
        ctx.beginPath(); ctx.moveTo(-92, yy); ctx.lineTo(-92 - len, yy); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
