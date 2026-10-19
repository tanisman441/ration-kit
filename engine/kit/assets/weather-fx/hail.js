// weather-fx/hail — dolu bulutu; taşlar sürekli düşer, fall anında dolu sağanağı
// başlar: hızlı taşlar + yere çarpma parçacıkları (0.6 sn sönüm).
// NOT: canvas y-aşağıdır; taşlar yukarıdan (−y) aşağıya (+y) düşer.
export default {
  name: 'hail', category: 'weather-fx',
  desc: 'Dolu bulutu; fall anında dolu sağanağı ve yere çarpma parçacıkları',
  tags: ['dolu', 'buz', 'yağış', 'fırtına', 'bulut', 'hava', 'hail', 'ice', 'storm', 'cloud'],
  box: [-160, -140, 160, 180],
  bleed: 30,
  anchor: 'bulut merkezi (0,-75); taşlar y=160 civarında yere çarpar',
  points: { top: [0, -130] },
  params: {
    color: { type: 'color', default: 'dim' },
    intensity: { type: 'number', default: 0.7, desc: 'dolu şiddeti 0–1: taş yoğunluğu' },
    fall: { type: 'time', default: null, desc: 'dolu sağanağı anı: hızlı taşlar + çarpma parçacıkları' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const inten = k.clamp(p.intensity, 0, 1);

    const d = p.fall == null ? -1 : t - p.fall;
    const bursting = d >= 0 && d < 0.9;

    // idle: bulut süzülmesi
    const bobY = Math.sin(t * 1.9) * 3;
    const bobX = k.noise1(t * 1.0) * 3;

    // dolu taşı çizimi
    const stone = (x, y, r, alpha) => {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(x, y, r + 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; // buz parlaması
      ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.32, 0, k.TAU); ctx.fill();
    };

    // sürekli düşüş (boşta)
    const H = 225, topY = -60;
    for (let i = 0; i < 22; i++) {
      if (k.hash(i * 13.7 + 2) > inten) continue;
      const x0 = -130 + k.hash(i * 3.1) * 260;
      const speed = 200 + k.hash(i * 7.7) * 140;
      const yy = topY + ((t * speed + k.hash(i * 9.3) * H) % H);
      const r = 6 + k.hash(i * 5.5) * 4;
      stone(x0 + bobX * 0.2, yy, r, 0.95);
    }

    // sağanak: hızlı ek taşlar
    if (bursting) {
      for (let i = 0; i < 22; i++) {
        const x0 = -135 + k.hash(i * 4.3 + 40) * 270;
        const yy = topY + (d / 0.9) * (H + 40) - k.hash(i * 6.1 + 40) * 60;
        if (yy < topY - 5 || yy > 168) continue;
        stone(x0, yy, 7 + k.hash(i * 8.9 + 40) * 4, 1);
      }
      // çarpma parçacıkları: kademeli çarpma anları
      for (let j = 0; j < 8; j++) {
        const dj = k.hash(j * 12.7 + 60) * 0.45; // çarpma anı
        const age = d - dj;
        if (age < 0 || age > 0.6) continue;
        const ix = -120 + k.hash(j * 3.9 + 60) * 240;
        const fade = 1 - age / 0.6;
        k.glow(ix, 160, 26, p.color, 0.5 * fade);
        for (let sgi = 0; sgi < 5; sgi++) {
          const h1 = k.hash(j * 31 + sgi * 7.7 + 60), h2 = k.hash(j * 17 + sgi * 3.1 + 61);
          const vx = (h1 - 0.5) * 190, vy = -(60 + h2 * 130);
          const px = ix + vx * age, py = 158 + vy * age + 260 * age * age;
          ctx.fillStyle = k.rgba(p.color, 0.9 * fade);
          ctx.beginPath(); ctx.arc(px, py, 2.5 + h1 * 2.5, 0, k.TAU); ctx.fill();
        }
      }
    }

    // dolu bulutu (hafif basık, yoğun)
    const disc = (x, y, r, c, sheen) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
    };
    ctx.save();
    ctx.translate(bobX, bobY);
    const bc = k.rgba(p.color), bd = darker(p.color);
    const blobs = [
      [-78, -70, 34], [-36, -88, 42], [10, -90, 40], [54, -80, 34], [86, -66, 26],
      [-52, -52, 30], [0, -50, 32], [52, -52, 28],
    ];
    for (const [x, y, r] of blobs) disc(x + 5, y + 6, r, bd, false);
    blobs.forEach(([x, y, r], i) => disc(x, y, r, bc, i === 1 || i === 2));
    ctx.restore();
  },
};
