// medical-emergency/bandage-wrap — diz çevresinde dönen sargı rulosu; döngülü sarım + yeni tur atma anı.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'bandage-wrap', category: 'medical-emergency',
  desc: 'Yatay diz/bacak; sargı rulosu bacak çevresinde döner, at anında yeni bir sargı turu sarılır',
  tags: ['bandaj', 'sargı', 'sarma', 'diz', 'bacak', 'ilk yardım', 'bandage', 'wrap', 'knee', 'leg', 'first aid', 'emergency', 'medical'],
  box: [-120, -100, 120, 100],
  bleed: 26,
  anchor: 'diz merkezi',
  points: { knee: [0, 0], roll: [0, -64], thigh: [-90, 0], shin: [90, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
    at: { type: 'time', default: null, desc: 'sargı turu: 1 sn içinde rulo bacağı bir tur döner ve yeni şerit sarılır (0.2–1.5 sn arası)' },
    speed: { type: 'number', default: 1, desc: 'döngülü sarım hızı çarpanı' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), lw = 6;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    // rulo bacak çevresinde sürekli döner (döngülü sarım)
    const orbit = t * 2.2 * p.speed;
    // at anında ekstra hızlı bir tur (1 sn)
    const extra = d >= 0 && d < 1 ? k.E.inOutCubic(k.prog(d, 0, 1)) * k.TAU : (d >= 1 ? k.TAU : 0);
    const ang = orbit + extra;
    const R = 52;
    const rollX = R * Math.cos(ang - Math.PI / 2), rollY = R * Math.sin(ang - Math.PI / 2) * 1.15;

    // bacak (yatay) + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-104 + 6, -26 + 6, 208, 52, 24); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-104, -26, 208, 52, 24); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-66, -16, 30, 8, -0.5, 0, k.TAU); ctx.fill();
    // mevcut sargı şeritleri (çapraz)
    ctx.strokeStyle = k.rgba(p.color, 0.9); ctx.lineWidth = 8;
    for (let i = -2; i <= 2; i++) {
      const sx = i * 24 - 8;
      ctx.beginPath(); ctx.moveTo(sx - 10, -26); ctx.lineTo(sx + 14, 26); ctx.stroke();
    }
    // at anında beliren yeni şerit (tur tamamlanınca)
    if (d >= 0) {
      const ne = k.prog(d, 0.5, 1.0);
      if (ne > 0) {
        ctx.strokeStyle = k.rgba(p.color, 0.9 * Math.min(1, ne * 2)); ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(44, -26); ctx.lineTo(68, 26); ctx.stroke();
      }
    }

    // sargı şeridi (rulodan bacağa uzanan kurdele)
    ctx.strokeStyle = k.rgba(p.color, 0.85); ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(rollX, rollY);
    ctx.quadraticCurveTo(rollX * 0.4, rollY * 0.4, 0, rollY > 0 ? 24 : -24);
    ctx.stroke();

    // sargı rulosu (dönen)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(rollX + 6, rollY + 6, 18, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(rollX, rollY, 18, 0, k.TAU); ctx.fill(); ctx.stroke();
    // iç sarmal (dönüşü gösterir)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath();
    const spin = t * 5 * p.speed + extra * 2;
    ctx.arc(rollX, rollY, 8, spin, spin + 4.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(rollX, rollY, 3.5, 0, k.TAU); ctx.stroke();
    // parlama (rulo)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(rollX - 6, rollY - 7, 7, 4, -0.5, 0, k.TAU); ctx.fill();

    // at anında tur tamamlama flaşı
    if (d >= 0.5 && d < 1.1) {
      const fa = 1 - (d - 0.5) / 0.6;
      ctx.strokeStyle = k.rgba(p.color, 0.8 * fa); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 56 + 14 * (1 - fa), 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
