// cyber-fx/virus-infect — dikenli virüs topu, sürekli bulaşma yayar.
// ANIMASYON: `at` anında 0.7 sn bulaşma flaşı (parlama + dalga + 14 parça); idle'da
// 2.8 sn döngüyle yayılan enfeksiyon noktaları + nabız atan çekirdek. Tek vurgu: green.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'virus-infect', category: 'cyber-fx',
  desc: 'Dikenli virüs topu; idle’da bulaşma noktaları yayar, at anında bulaşma flaşı patlar',
  tags: ['virüs', 'bulaşma', 'enfeksiyon', 'mikrop', 'siber', 'saldırı', 'zararlı', 'virus', 'infect', 'infection', 'malware', 'cyber', 'attack', 'bug'],
  box: [-120, -120, 120, 120],
  bleed: 50,
  anchor: 'çekirdek merkezi (0,0)',
  points: { core: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'bulaşma anı: 0.7 sn flaş + şok dalgası + parça yağmuru' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.7;
    const R = 34;
    ctx.save();
    ctx.lineCap = 'round';

    // --- dikenler (idle'da hafif solunur, patlamada büyür) ---
    const spikeScale = burst ? 1 + 0.28 * Math.sin(k.prog(d, 0, 0.3) * Math.PI) : 1 + 0.05 * k.noise1(t * 2.2);
    ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 9;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * k.TAU + 0.2;
      const x1 = Math.cos(a) * (R - 4) * spikeScale, y1 = Math.sin(a) * (R - 4) * spikeScale;
      const x2 = Math.cos(a) * (R + 22) * spikeScale, y2 = Math.sin(a) * (R + 22) * spikeScale;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.fillStyle = k.rgba(p.color, burst ? 0.95 : 0.8);
      ctx.beginPath(); ctx.arc(x2, y2, 6, 0, k.TAU); ctx.fill();
    }

    // --- gövde: gölge, panel2, sol üst parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(6, 6, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-R * 0.35, -R * 0.42, R * 0.42, R * 0.26, -0.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();

    // --- çekirdek: nabız atan yeşil öz ---
    const pulse = burst ? 1 : 0.65 + 0.35 * (0.5 + 0.5 * k.noise1(t * 3.6));
    k.glow(0, 0, R * 1.7, p.color, 0.4 * pulse);
    ctx.fillStyle = k.rgba(p.color, 0.9 * pulse);
    ctx.beginPath(); ctx.arc(0, 0, 13 * (burst ? 1.25 : 1), 0, k.TAU); ctx.fill();
    // çekirdek benekleri
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * k.TAU + t * 0.7;
      ctx.fillStyle = k.rgba('bg', 0.5 * pulse);
      ctx.beginPath(); ctx.arc(Math.cos(a) * 22, Math.sin(a) * 22, 5, 0, k.TAU); ctx.fill();
    }

    // --- idle bulaşma: 3 dalga, 2.8 sn döngüyle yayılan noktalar ---
    if (!burst) {
      for (let w = 0; w < 3; w++) {
        const ph = ((t / 2.8) + w / 3) % 1;
        const rr = R + 14 + ph * 66;
        const alpha = 0.55 * Math.sin(ph * Math.PI);
        if (alpha <= 0.01) continue;
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * k.TAU + w * 0.9 + ph * 0.4;
          const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
          ctx.fillStyle = k.rgba(p.color, alpha);
          ctx.beginPath(); ctx.arc(x, y, 3.5 - ph * 1.5, 0, k.TAU); ctx.fill();
        }
      }
    }

    // --- patlama: flaş + şok dalgası + 14 parça ---
    if (burst) {
      const fl = 1 - k.prog(d, 0, 0.18);
      if (fl > 0) k.glow(0, 0, 95, p.color, 0.6 * fl);
      const wr = R + k.prog(d, 0, 0.55) * 90;
      const wa = 0.65 * (1 - k.prog(d, 0, 0.55));
      if (wa > 0.01) {
        ctx.strokeStyle = k.rgba(p.color, wa);
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(0, 0, wr, 0, k.TAU); ctx.stroke();
      }
      for (let i = 0; i < 14; i++) {
        const start = k.hash(90 + i * 19) * 0.2;
        const fly = k.E.outCubic(k.prog(d, start, start + 0.5));
        if (fly <= 0) continue;
        const a = k.hash(140 + i * 11) * k.TAU;
        const rr = R + fly * 85;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        const alpha = 1 - k.prog(d, 0.35, 0.7);
        if (alpha <= 0.01) continue;
        k.glow(x, y, 11, p.color, 0.45 * alpha);
        ctx.fillStyle = k.rgba(p.color, 0.9 * alpha);
        ctx.beginPath(); ctx.arc(x, y, 4, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
