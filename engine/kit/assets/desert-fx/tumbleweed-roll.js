// desert-fx/tumbleweed-roll — rüzgârla yuvarlanan kuru çalı topu.
// roll anında (0.9 sn) soldan sağa zıplayarak yuvarlanır (dönüş + toz);
// boşta yerinde hafifçe sallanır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) zemin, topun merkezi (0,-58)'dedir.
export default {
  name: 'tumbleweed-roll', category: 'desert-fx',
  desc: 'Rüzgârla yuvarlanan kuru çalı topu, roll anında zıplayarak soldan sağa gider',
  tags: ['yuvarlanan çalı', 'tumbleweed', 'çöl', 'rüzgar', 'batı', 'kuru çalı', 'rolling weed', 'desert', 'wind', 'dry bush'],
  box: [-140, -140, 140, 20],
  bleed: 35,
  anchor: 'zemin (0,0); topun merkezi (0,-58)',
  points: { centre: [0, -58], ground: [0, 0] },
  params: {
    roll: { type: 'time', default: null, desc: 'yuvarlanma geçişi (0.9 sn, soldan sağa zıplayarak)' },
    color: { type: 'color', default: 'dim', desc: 'kuru dal rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const rd = p.roll == null ? -1 : t - p.roll;
    const rolling = rd >= 0 && rd < 0.9;
    const R = 52; // top yarıçapı

    // Konum + dönüş: roll olayında soldan sağa, boşta yerinde sallanma
    let bx = 0, rot = 0, lift = 0;
    if (rolling) {
      const prog = rd / 0.9;
      bx = -80 + 160 * prog;                 // soldan sağa
      rot = prog * (160 / R);                // yuvarlanma dönüşü
      lift = Math.abs(Math.sin(prog * Math.PI * 3)) * 13 * (1 - prog * 0.25); // zıplama
    } else if (rd >= 0.9) {
      bx = 80;                               // roll bitti: sağda durur (geri ışınlanmaz)
      rot = 160 / R + Math.sin(t * 2) * 0.05;
      lift = 0;
    } else {
      rot = Math.sin(t * 0.9) * 0.18 + t * 0.12; // yerinde hafif sallanma + yavaş dönüş
      lift = Math.abs(Math.sin(t * 1.8)) * 3;
    }
    const cy = -58 - lift;

    // Toz bulutları: roll sırasında topun arkasında
    if (rolling) {
      const prog = rd / 0.9;
      for (let i = 0; i < 6; i++) {
        const f = prog * 4 - i * 0.45;
        if (f < 0 || f > 1.2) continue;
        const px = bx - 45 - i * 16 + k.noise1(t * 3 + i * 7) * 8;
        const py = -10 - f * 26 - i * 2;
        const pr = 6 + f * 14 + i * 1.5;
        ctx.fillStyle = k.rgba('dim', 0.35 * (1 - f / 1.2));
        ctx.beginPath(); ctx.arc(px, py, pr, 0, k.TAU); ctx.fill();
      }
    }

    // Çalı topu: iç içe dallı halkalar + çapraz eğri dallar
    ctx.save();
    ctx.translate(bx, cy); ctx.rotate(rot);
    ctx.lineCap = 'round';
    // iç yoğunluk: yarı saydam panel2 diski (iki temada da okunur)
    ctx.fillStyle = k.rgba('panel2', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, R * 0.72, 0, k.TAU); ctx.fill();
    // 3 halka: farklı yarıçaplarda yaylar
    for (let r = 0; r < 3; r++) {
      const rr = R * (0.55 + r * 0.22);
      ctx.strokeStyle = k.rgba('bg', 0.45); ctx.lineWidth = 5 + LW;
      ctx.beginPath(); ctx.arc(0, 0, rr + 2.5, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.85); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
    }
    // çapraz dallar: hash ile sabit açılar, eğri kirişler
    for (let i = 0; i < 12; i++) {
      const a = k.hash(i * 3 + 1) * k.TAU;
      const b = a + 1.9 + k.hash(i * 5 + 2) * 1.4;
      const x1 = Math.cos(a) * R * 0.95, y1 = Math.sin(a) * R * 0.95;
      const x2 = Math.cos(b) * R * 0.95, y2 = Math.sin(b) * R * 0.95;
      const mx = (x1 + x2) / 2 * 0.55, my = (y1 + y2) / 2 * 0.55;
      ctx.strokeStyle = k.rgba('bg', 0.45); ctx.lineWidth = 3.5 + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
    }
    // dışarı taşan ince dal uçları (serbest çizgi dili: ink)
    for (let i = 0; i < 8; i++) {
      const a = k.hash(i * 11 + 5) * k.TAU;
      const x1 = Math.cos(a) * R * 0.98, y1 = Math.sin(a) * R * 0.98;
      const x2 = Math.cos(a) * (R + 8 + k.hash(i) * 10), y2 = Math.sin(a) * (R + 8 + k.hash(i) * 10);
      ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.restore();

    // premium parlama: sol üstte beyaz alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(bx - R * 0.4, cy - R * 0.45, R * 0.3, R * 0.2, -0.5, 0, k.TAU); ctx.fill();
  },
};
