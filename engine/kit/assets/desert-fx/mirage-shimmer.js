// desert-fx/mirage-shimmer — çölde sıcak havada titreyen serap parıltısı.
// at anında (0.8 sn) ısı dalgası güçlenir, serap büyüyüp yukarı doğru
// ikinci bir bant çıkarır; boşta hafif dalgalanma sürer.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kum yüzeyidir, serap onun üstündedir.
export default {
  name: 'mirage-shimmer', category: 'desert-fx',
  desc: 'Kum üstünde titreyen serap bandı, at anında ısı dalgasıyla güçlenir',
  tags: ['serap', 'mirage', 'çöl', 'sıcak', 'dalgalanma', 'yansıma', 'heat haze', 'shimmer', 'desert', 'illusion'],
  box: [-150, -130, 150, 20],
  bleed: 30,
  anchor: 'kum yüzeyi (0,0); serap bandı (0,-72)',
  points: { surface: [0, 0], mirage: [0, -72] },
  params: {
    at: { type: 'time', default: null, desc: 'ısı dalgası anı (0.8 sn, serap güçlenir + ikinci bant)' },
    color: { type: 'color', default: 'cyan', desc: 'serap suyu rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const ad = p.at == null ? -1 : t - p.at;
    const active = ad >= 0 && ad < 0.8;
    const env = active ? Math.sin((ad / 0.8) * Math.PI) : 0; // 0→1→0
    const heat = 0.35 + env * 1.1; // dalgalanma şiddeti

    ctx.lineCap = 'round';

    // Kum tepesi: alt bant, yumuşak dalga formu
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-150, 20); ctx.lineTo(-150, -4);
    ctx.quadraticCurveTo(-70, -16, 0, -6);
    ctx.quadraticCurveTo(80, 2, 150, -10);
    ctx.lineTo(150, 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 0.9);
    ctx.beginPath();
    ctx.moveTo(-150, 20); ctx.lineTo(-150, -4 - LW / 2);
    ctx.quadraticCurveTo(-70, -16 - LW / 2, 0, -6 - LW / 2);
    ctx.quadraticCurveTo(80, 2 - LW / 2, 150, -10 - LW / 2);
    ctx.lineTo(150, 20); ctx.closePath(); ctx.fill();

    // Serap suyu: titreyen elips (vurgu: cyan)
    const wob = 1 + 0.06 * Math.sin(t * 3.1) * heat;
    const my = -72 - env * 8;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, my, 98 * wob + LW / 2, 18 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.35 + env * 0.3);
    ctx.beginPath(); ctx.ellipse(0, my, 98 * wob, 18, 0, 0, k.TAU); ctx.fill();
    // su üstü parlama: sol üst beyaz alfa 0.12
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-38, my - 7, 34, 6, -0.08, 0, k.TAU); ctx.fill();

    // Isı dalgası çizgileri: 4 sıra serbest dalga (serbest çizgi dili: ink)
    for (let r = 0; r < 4; r++) {
      const baseY = -40 - r * 12 - env * 6;
      const amp = 3.5 + heat * 7;
      ctx.strokeStyle = k.rgba('ink', 0.5 - r * 0.06); ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -115; x <= 115; x += 15) {
        const y = baseY + Math.sin(x * 0.09 + t * (2.2 + r * 0.8)) * amp
          + k.noise1(x * 0.05 + t * 1.5 + r * 4) * 3;
        if (x === -115) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // at olayı: ikinci yüzen bant (güçlü serap yansıması)
    if (active) {
      const by = -118 - env * 10;
      ctx.fillStyle = k.rgba(p.color, 0.30 * env);
      ctx.beginPath(); ctx.ellipse(0, by, 60 * (1 + 0.1 * Math.sin(t * 5)) * env + 1, 9 * env + 1, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.45 * env); ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = -70; x <= 70; x += 14) {
        const y = by + Math.sin(x * 0.12 + t * 4) * (3 + env * 6);
        if (x === -70) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },
};
