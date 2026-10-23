// medical-emergency/stretcher-roll — yuvarlanan sedye; tekerlekler döner, gövde hafif sallar.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'stretcher-roll', category: 'medical-emergency',
  desc: 'Yan görünüm sedye; tekerlekler sürekli döner, battaniye dalgalanır, hasta nefes alır',
  tags: ['sedye', 'tekerlek', 'hasta taşıma', 'acil', 'ambulans', 'stretcher', 'gurney', 'wheels', 'emergency', 'patient transport', 'medical'],
  box: [-120, -90, 120, 90],
  bleed: 16,
  anchor: 'şase merkezi',
  points: { head: [-88, -52], foot: [88, -52], rail: [0, -66], wheelRear: [-70, 58], wheelFront: [70, 58] },
  params: {
    color: { type: 'color', default: 'red' },
    speed: { type: 'number', default: 1, desc: 'yuvarlanma hızı çarpanı (tekerlek dönüş + sallantı)' },
    at: { type: 'time', default: null, desc: 'ani fren: 0.5 sn sarsıntı, tekerlekler kilitlenir, battaniye savrulur' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), lw = 6;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const brake = d >= 0 && d < 0.5 ? Math.exp(-d * 5) : 0;
    const roll = brake > 0.01 ? t - d : t; // fren anında tekerlekler durur
    const bounce = (1 - brake) * 2.2 * Math.sin(t * 7 * p.speed);
    const sway = -8 * brake * Math.exp(-d * 4); // fren sarsıntısı öne
    const sheetFlap = (1 - brake) * 4 * Math.sin(t * 5.2 * p.speed + 1);

    // hasta (battaniye + baş): nefes alır
    const breath = 1.6 * Math.sin(t * 2.6);
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-98 + 6, -66 + 6 + bounce + breath, 180, 26, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-98 + sway, -66 + bounce + breath, 180, 26, 12); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-64 + sway, -60 + bounce + breath, 34, 8, -0.5, 0, k.TAU); ctx.fill();
    // baş
    ctx.beginPath(); ctx.arc(-102 + sway, -56 + bounce + breath * 0.5, 14, 0, k.TAU);
    ctx.fillStyle = k.rgba('dim'); ctx.fill(); ctx.stroke();
    // yastık
    ctx.fillStyle = k.rgba('panel'); ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-86 + sway, -78 + bounce, 34, 16, 7); ctx.fill(); ctx.stroke();
    // battaniye dalgalı kenar
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -96; x <= 80; x += 8) {
      const y = -44 + bounce + breath + Math.sin(x * 0.15 + t * 6 * p.speed) * (3 + sheetFlap * 0.3);
      x <= -96 ? ctx.moveTo(x + sway, y) : ctx.lineTo(x + sway, y);
    }
    ctx.stroke();
    // kırmızı haç işareti (yan)
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-14 + sway, -62 + bounce + breath, 28, 10, 3); ctx.fill();
    k.rrect(-9 + sway, -67 + bounce + breath, 18, 20, 3); ctx.fill();

    // korkuluk
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(-80 + sway, -80 + bounce); ctx.lineTo(60 + sway, -80 + bounce); ctx.stroke();

    // bacaklar (serbest dururlar, üstte sedyeye bağlı)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 7;
    for (const lx of [-58, 58]) {
      ctx.beginPath(); ctx.moveTo(lx + sway, -40 + bounce); ctx.lineTo(lx + sway * 1.4, 34); ctx.stroke();
    }

    // tekerlekler: dönen kollu
    for (const wx of [-70, 70]) {
      const cx = wx + sway * 1.4;
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.arc(cx + 6, 58 + 6, 20, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.strokeStyle = line; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.arc(cx, 58, 20, 0, k.TAU); ctx.fill(); ctx.stroke();
      // kollar döner
      const ang = roll * 4.5 * p.speed + (wx > 0 ? Math.PI / 3 : 0);
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 4;
      for (let s = 0; s < 3; s++) {
        const a = ang + s * k.TAU / 3;
        ctx.beginPath(); ctx.moveTo(cx, 58);
        ctx.lineTo(cx + 13 * Math.cos(a), 58 + 13 * Math.sin(a)); ctx.stroke();
      }
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(cx, 58, 5, 0, k.TAU); ctx.fill();
    }

    // fren tozu
    if (brake > 0.2) {
      ctx.fillStyle = k.rgba('dim', 0.5 * (1 - brake));
      for (let i = 0; i < 4; i++) {
        const px = 92 + k.hash(i + 7) * 30 * brake, py = 60 + (k.hash(i + 3) - 0.5) * 26;
        ctx.beginPath(); ctx.arc(px, py, 4 + 5 * k.hash(i + 11), 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
