// garden-fx/rain-barrel-drip — yağmur varili; musluktan döngülü damla, su birikintisinde
// halka, üstten yağmur damlaları varile düşer.
// NOT: canvas y-aşağıdır; damla musluk ucundan (y=42) birikintiye (y=105) düşer.
export default {
  name: 'rain-barrel-drip', category: 'garden-fx',
  desc: 'Yağmur varili: musluktan döngülü damla düşer, birikintide halka oluşur, yağmur varile yağar',
  tags: ['yağmur varili', 'fıçı', 'su biriktirme', 'damlama', 'su', 'rain barrel', 'water', 'drip', 'garden', 'barrel'],
  box: [-100, -160, 100, 120],
  bleed: 18,
  anchor: 'varil tabanı merkezi (0,95)',
  points: { spout: [60, 42], puddle: [60, 105], top: [0, -80] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // yağmur: üstten varile düşen damlalar
    ctx.strokeStyle = k.rgba(p.color, 0.55); ctx.lineWidth = 3.4;
    for (let i = 0; i < 10; i++) {
      const x = -44 + k.hash(i * 4.9) * 88;
      const yy = -160 + ((t * (140 + k.hash(i * 7.3) * 80) + k.hash(i * 2.1) * 250) % 250);
      if (yy > -88) continue;
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x - 1.5, yy + 9); ctx.stroke();
    }

    // varil gövdesi
    ctx.fillStyle = line; k.rrect(-58, -83, 116, 181, 20); ctx.fill();
    ctx.fillStyle = darker('dim'); k.rrect(-58 + 5, -83 + 6, 116, 181, 20); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); k.rrect(-55, -80, 110, 175, 18); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -52, 14, 40, 0.1, 0, k.TAU); ctx.fill();
    // çıta çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.32); ctx.lineWidth = 2.6;
    for (const sx of [-27, 0, 27]) {
      ctx.beginPath(); ctx.moveTo(sx, -66); ctx.lineTo(sx, 82); ctx.stroke();
    }
    // metal çemberler
    for (const hy of [-52, 8, 66]) {
      ctx.fillStyle = line; k.rrect(-59, hy, 118, 11, 5); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.55); k.rrect(-59, hy, 118, 11, 5); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(-28, hy + 3.6, 18, 2.2, -0.1, 0, k.TAU); ctx.fill();
    }
    // üst ağız: su yüzeyi
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -80, 55, 15, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = darker('dim');
    ctx.beginPath(); ctx.ellipse(0, -80, 48, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.85);
    ctx.beginPath(); ctx.ellipse(0, -80, 44, 10.5, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.ellipse(-12, -83, 16, 3.6, -0.15, 0, k.TAU); ctx.fill();
    // su yüzeyinde hafif dalgalanma
    ctx.strokeStyle = k.rgba(p.color, 0.5); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(Math.sin(t * 2.3) * 4, -80, 30, 7, 0, 0.3, Math.PI - 0.3); ctx.stroke();

    // musluk (önde, sağda)
    ctx.save(); ctx.translate(42, 26); ctx.rotate(0.35);
    ctx.fillStyle = line; k.rrect(-4, -8, 30, 15, 6); ctx.fill();
    ctx.fillStyle = darker('dim'); k.rrect(-4 + 3, -8 + 4, 30, 15, 6); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); k.rrect(-4, -8, 30, 15, 6); ctx.fill();
    ctx.restore();
    const tipX = 60, tipY = 42;
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.beginPath(); ctx.arc(tipX, tipY - 3, 4, 0, k.TAU); ctx.fill();

    // damla döngüsü: büyü (0–0.45) → uzama (0.45–0.6) → düşüş (0.6–1)
    const C = 2.6, ph = (t % C) / C;
    const drop = (x, y, r, stretch, alpha) => {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.1, r * 1.25 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath(); ctx.ellipse(x, y - r * 0.05, r * 0.88, r * 1.02 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.4, r * 0.28, r * 0.42, -0.4, 0, k.TAU); ctx.fill();
    };
    const baseY = 105;
    if (ph < 0.45) {
      const g = ph / 0.45;
      drop(tipX, tipY + 2, 2.5 + 8 * g, 1 + g * 0.2, 0.95);
    } else if (ph < 0.6) {
      const g = (ph - 0.45) / 0.15;
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath();
      ctx.moveTo(tipX - 3, tipY); ctx.lineTo(tipX + 3, tipY);
      ctx.lineTo(tipX + 1.5, tipY + 12 * g + 6); ctx.lineTo(tipX - 1.5, tipY + 12 * g + 6);
      ctx.closePath(); ctx.fill();
      drop(tipX, tipY + 12 * g + 4, 10 - g, 1.2 + g * 1.1, 0.95);
    } else {
      const g = (ph - 0.6) / 0.4;
      const y = tipY + 14 + (baseY - tipY - 14) * g * g;
      if (y < baseY - 2) drop(k.noise1(t * 3) * 1.5 + tipX, y, 9.5, 1 + g * 0.8, 0.95);
      else {
        const s = (g - 0.94) / 0.06;
        if (s > 0) {
          ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - s)); ctx.lineWidth = 4 * (1 - s) + 1;
          ctx.beginPath(); ctx.ellipse(tipX, baseY, 7 + 26 * s, 3 + 7 * s, 0, 0, k.TAU); ctx.stroke();
        }
      }
    }

    // birikinti
    ctx.fillStyle = k.rgba(p.color, 0.22);
    ctx.beginPath(); ctx.ellipse(tipX, 108, 26, 7, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba(p.color, 0.4); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(tipX, 108, 26, 7, 0, 0, k.TAU); ctx.stroke();
    // sürekli halka nabzı
    const rp = (t % 1.8) / 1.8;
    ctx.strokeStyle = k.rgba(p.color, 0.3 * (1 - rp)); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(tipX, 108, 10 + 16 * rp, 3 + 4 * rp, 0, 0, k.TAU); ctx.stroke();
  },
};
