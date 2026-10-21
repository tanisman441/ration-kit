// disaster-fx/flood-rise — sel: level yükseldikçe alttan yükselen su; su yüzeyi
// sürekli dalgalanır (idle), sürüklenen kutu ve tahta su üstünde yalpalar,
// kenarlarda su girdapları. Level düştükçe su geri çekilir.
// NOT: canvas y-aşağıdır; (0,0) sahne ortasıdır.
export default {
  name: 'flood-rise', category: 'disaster-fx',
  desc: 'Sel: yükselen su, yüzeyde sürüklenen kutu ve tahta, girdap halkaları',
  tags: ['sel', 'taşkın', 'su', 'yükselen su', 'sürüklenme', 'afet', 'flood', 'water', 'rise', 'deluge', 'disaster'],
  box: [-150, -110, 150, 90],
  bleed: 40,
  anchor: 'sahne ortası (0,0)',
  points: { water_top: [0, -20], crate: [-40, -50], plank: [70, -40] },
  params: {
    level: { type: 'number', default: 0.5, desc: 'su seviyesi 0–1 (su bu seviyeye yumuşak geçişle yükselir/alçalır)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const lvl = k.clamp(p.level, 0, 1);
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // Kurak zemin şeridi (suyun altından görünür)
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-150, 60, 300, 26, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();

    // Yarı batık ev silueti (arka plan)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(70, 20, 56, 44, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath();
    ctx.moveTo(64, 22); ctx.lineTo(98, -6); ctx.lineTo(132, 22);
    ctx.closePath(); ctx.fill();

    // Su — level'a bağlı taban yüksekliği + sürekli dalgalanan yüzey (idle)
    const surfY = 70 - lvl * 150;
    const waveAt = (x) => surfY + Math.sin(x * 0.06 + t * 2.8) * 4 + Math.sin(x * 0.15 + t * 5.1) * 1.6;
    ctx.fillStyle = k.rgba(acc, 0.78);
    ctx.beginPath();
    ctx.moveTo(-150, 90);
    ctx.lineTo(-150, waveAt(-150));
    for (let x = -150; x <= 150; x += 10) ctx.lineTo(x, waveAt(x));
    ctx.lineTo(150, 90);
    ctx.closePath(); ctx.fill();

    // yüzey köpük çizgisi
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-150, waveAt(-150));
    for (let x = -150; x <= 150; x += 10) ctx.lineTo(x, waveAt(x));
    ctx.stroke();
    // su parlama (sol üst, premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-80, surfY + 26, 70, 10, -0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.1);
    ctx.beginPath(); ctx.ellipse(90, surfY + 46, 55, 9, 0.1, 0, k.TAU); ctx.fill();
    // iç akıntı çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.25); ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const yy = surfY + 22 + i * 16 + Math.sin(t * 2 + i) * 3;
      ctx.beginPath();
      ctx.moveTo(-130, yy);
      ctx.quadraticCurveTo(-60, yy - 6, 0, yy);
      ctx.quadraticCurveTo(60, yy + 6, 130, yy);
      ctx.stroke();
    }

    // Sürüklenen kutu — su üstünde yalpa ve bob ile süzülür
    const bob = Math.sin(t * 2.4) * 4;
    const drift = Math.sin(t * 0.7) * 12;
    ctx.save();
    ctx.translate(-40 + drift, waveAt(-40 + drift) - 12 + bob);
    ctx.rotate(Math.sin(t * 1.9) * 0.12);
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(-22, -18, 44, 30, 5); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -10, 10, 4, -0.35, 0, k.TAU); ctx.fill();
    // kutu bandı
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, 12); ctx.stroke();
    ctx.restore();

    // Sürüklenen tahta
    ctx.save();
    ctx.translate(70 - drift * 0.7, waveAt(70 - drift * 0.7) - 4 + Math.sin(t * 2.9 + 1) * 3.5);
    ctx.rotate(Math.sin(t * 2.2 + 2) * 0.16);
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-34, -6, 68, 12, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();

    // Girdap halkaları — su yüksekken kenarlarda dönen akıntılar
    if (lvl > 0.15) {
      for (let i = 0; i < 3; i++) {
        const seed = i * 91 + 5;
        const ex = -110 + i * 100;
        const ey = waveAt(ex) + 30;
        const rr = 12 + 4 * Math.sin(t * 3 + seed);
        ctx.strokeStyle = k.rgba(acc, 0.6 * lvl);
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(ex, ey, rr, rr * 0.5, 0, t * 2 + seed, t * 2 + seed + Math.PI * 1.4); ctx.stroke();
      }
    }

    // Yağmur (idle — sel atmosferi)
    ctx.strokeStyle = k.rgba('cyan', 0.35); ctx.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const seed = i * 41 + 33;
      const rx = -140 + k.hash(seed) * 280;
      const ry = -110 + ((t * 90 + k.hash(seed + 1) * 100) % 120);
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 11); ctx.stroke();
    }

    ctx.restore();
  },
};
