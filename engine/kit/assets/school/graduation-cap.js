// school/graduation-cap — mezuniyet kepi; tassel anında püskül sağdan sola savrulur
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) kep tablası merkezidir.
export default {
  name: 'graduation-cap', category: 'school',
  desc: 'Mezuniyet kepi; tassel anında püskül mezuniyet törenindeki gibi sağdan sola savrulur',
  tags: ['kep', 'mezuniyet', 'graduation', 'cap', 'üniversite', 'diploma', 'tören'],
  box: [-115, -60, 115, 95],
  bleed: 60,
  anchor: 'kep tablası merkezi (0,0)',
  points: { top: [0, -6], tassel: [62, 30] },
  params: {
    tassel: { type: 'time', default: null, desc: 'püskül savrulma anı (sağdan sola, ~0.9 sn)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const cap = k.rgba(p.color);
    const d = p.tassel == null ? -1 : t - p.tassel;
    const bob = Math.sin(t * (k.TAU / 2.4)) * 3; // hafif süzülme (idle)

    // püskül açısı: dinlenmede sağda sarkar, olayda sola savrulur
    let ang;
    if (d >= 0 && d < 0.9) {
      const q = d / 0.9;
      const e = q * q * (3 - 2 * q);
      ang = 1.05 - e * 2.1 + Math.sin(q * 14) * 0.3 * (1 - q);
    } else {
      ang = 1.05 + k.noise1(t * 1.2) * 0.10; // hafif salınım (idle)
    }
    const TL = 74; // püskül ip uzunluğu
    const tx = Math.sin(ang) * TL, ty = -6 + Math.cos(ang) * TL;

    ctx.save();
    ctx.translate(0, bob);

    // kafa bandı (tablanın altında, yanlardan ve alttan görünür)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-56 - LW / 2, 0 - LW / 2, 112 + LW, 58 + LW, 18); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-56, 0, 112, 58, 18); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-56, 30, 112, 28, 16); ctx.fill();

    // tabla (eşkenar dörtgen)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-108, 0); ctx.lineTo(0, -44); ctx.lineTo(108, 0); ctx.lineTo(0, 44);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = cap;
    ctx.beginPath();
    ctx.moveTo(-102, 0); ctx.lineTo(0, -38); ctx.lineTo(102, 0); ctx.lineTo(0, 38);
    ctx.closePath(); ctx.fill();
    // alt yarı gölge + sol üst parlama
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(-102, 0); ctx.lineTo(0, 38); ctx.lineTo(102, 0); ctx.lineTo(0, 8);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -18, 34, 12, -0.35, 0, k.TAU); ctx.fill();

    // düğme (püskül kökü)
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, -6, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.arc(0, -6, 7, 0, k.TAU); ctx.fill();

    // püskül ipi (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.quadraticCurveTo(tx * 0.4, ty * 0.55 - 6, tx, ty);
    ctx.stroke();
    // püskül başı + saçağı
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.arc(tx, ty, 11, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(tx, ty, 11, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('accent'); ctx.lineWidth = 4;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(tx + i * 6, ty + 6);
      ctx.lineTo(tx + i * 8, ty + 24);
      ctx.stroke();
    }

    ctx.restore();
  },
};
