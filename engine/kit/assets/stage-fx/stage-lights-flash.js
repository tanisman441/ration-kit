// stage-fx/stage-lights-flash — truss'ta 4 PAR ışık.
// Boşta her lamba nabız gibi yanıp söner (faz farklı); at anında 0.2 sn'lik
// flaş patlaması: ışınlar parlar, lenslerden yıldız ışınları çıkar, yerdeki
// havuzlar büyür.
// NOT: canvas y-aşağıdır; (0,0) truss'un ortasıdır.
export default {
  name: 'stage-lights-flash', category: 'stage-fx',
  desc: 'Truss üzerindeki 4 sahne lambası nabızla yanar; at anında flaş patlar',
  tags: ['ışık', 'sahne', 'flaş', 'konser', 'lamba', 'lights', 'flash', 'stage', 'concert', 'par'],
  box: [-265, -70, 265, 210],
  bleed: 35,
  anchor: 'truss ortası (0,0)',
  points: { truss: [0, -40], lens: [0, 62], floor: [0, 190] },
  params: {
    at: { type: 'time', default: null, desc: 'flaş patlaması anı (0.2 sn)' },
    color: { type: 'color', default: 'yellow', desc: 'ışın + lens rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const flash = d >= 0 ? k.clamp(1 - d / 0.2, 0, 1) : 0;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('ink', 0.10);
    ctx.beginPath(); ctx.ellipse(0, 196, 190, 13, 0, 0, k.TAU); ctx.fill();

    // truss çubuğu
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-218, -58, 436, 26, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-218, -58, 436, 26, 8); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(i * 40 - 16, -56); ctx.lineTo(i * 40 + 16, -34); ctx.stroke();
    }

    const xs = [-156, -52, 52, 156];
    // yerdeki ışık havuzları (önce, lambaların altında)
    xs.forEach((cx, i) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 2 + i * 0.9);
      const a = 0.10 + pulse * 0.10 + flash * 0.35;
      ctx.fillStyle = k.rgba(acc, Math.min(0.6, a));
      ctx.beginPath(); ctx.ellipse(cx, 192, 44 + flash * 26, 10 + flash * 5, 0, 0, k.TAU); ctx.fill();
    });

    xs.forEach((cx, i) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 2 + i * 0.9);  // nabız
      const beamA = 0.10 + pulse * 0.09 + flash * 0.38;

      // ışın konisi (aşağı doğru)
      ctx.fillStyle = k.rgba(acc, Math.min(0.55, Math.max(0.04, beamA)));
      ctx.beginPath();
      ctx.moveTo(cx - 16, 74); ctx.lineTo(cx + 16, 74);
      ctx.lineTo(cx + 46 + flash * 20, 190); ctx.lineTo(cx - 46 - flash * 20, 190);
      ctx.closePath(); ctx.fill();

      // askı
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(cx, -32); ctx.lineTo(cx, 6); ctx.stroke();

      // lamba gövdesi (PAR can)
      ctx.fillStyle = k.rgba('dim', 0.95);
      k.rrect(cx - 30, 6, 60, 68, 14); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      k.rrect(cx - 30, 6, 60, 68, 14); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';                     // sol üst parlama
      ctx.beginPath(); ctx.ellipse(cx - 13, 24, 8, 18, -0.3, 0, k.TAU); ctx.fill();
      // soğutma çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      for (let j = 0; j < 2; j++) {
        ctx.beginPath(); ctx.moveTo(cx - 18, 20 + j * 10); ctx.lineTo(cx + 18, 20 + j * 10); ctx.stroke();
      }
      // lens
      ctx.fillStyle = k.rgba(acc, 0.9);
      ctx.beginPath(); ctx.ellipse(cx, 74, 26, 11, 0, 0, k.TAU); ctx.fill();
      const lensA = 0.35 + pulse * 0.35 + flash * 0.5;
      ctx.fillStyle = k.rgba(acc, Math.min(1, lensA));
      ctx.beginPath(); ctx.ellipse(cx, 74, 17, 7, 0, 0, k.TAU); ctx.fill();
      if (pulse > 0.5 || flash > 0) k.glow(cx, 74, 34, acc, 0.15 + pulse * 0.15 + flash * 0.3);

      // flaş yıldız ışınları
      if (flash > 0.05) {
        ctx.strokeStyle = k.rgba(acc, flash * 0.85);
        ctx.lineWidth = 4;
        for (let r = 0; r < 8; r++) {
          const ang = (r / 8) * k.TAU + t * 2;
          const rl = 34 + flash * 40;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * 30, 74 + Math.sin(ang) * 14);
          ctx.lineTo(cx + Math.cos(ang) * (30 + rl), 74 + Math.sin(ang) * (14 + rl * 0.5));
          ctx.stroke();
        }
      }
    });

    ctx.restore();
  },
};
