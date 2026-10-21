// horror-fx/mirror-crack — el aynası: darbe noktasından radyal yayılan çatlaklar.
// NOT: canvas y-aşağıdır; (0,-30) ayna merkezidir, sap aşağı uzar.
export default {
  name: 'mirror-crack', category: 'horror-fx',
  desc: 'El aynası: camda gezinen yansıma parlaması; at anında 0.7 sn içinde darbe noktasından 8 çatlak yayılır',
  tags: ['ayna', 'çatlak', 'cam', 'kırılma', 'korku', 'el aynası', 'mirror', 'crack', 'glass', 'shatter', 'horror', 'hand mirror'],
  box: [-70, -120, 70, 120],
  bleed: 20,
  anchor: 'ayna merkezi (0,-30)',
  points: { impact: [15, -38], top: [0, -100], handle_end: [0, 112] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'çatlama anı: 0.7 sn içinde 8 çatlak radyal yayılır, cam parlaması' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const IX = 15, IY = -38;                               // darbe noktası
    ctx.save();
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // --- sap ---
    ctx.fillStyle = darker('panel2');
    k.rrect(-10 + 6, 38 + 6, 20, 74, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    k.rrect(-10, 38, 20, 74, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5;
    k.rrect(-10, 38, 20, 74, 10); ctx.stroke();

    // --- ayna çerçevesi + cam ---
    ctx.fillStyle = darker('panel2');
    ctx.beginPath(); ctx.ellipse(6, -24, 62, 72, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(0, -30, 62, 72, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, -30, 62, 72, 0, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 0.92);
    ctx.beginPath(); ctx.ellipse(0, -30, 50, 60, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';               // sol üst parlama (premium finish)
    ctx.beginPath(); ctx.ellipse(-22, -56, 18, 9, -0.5, 0, k.TAU); ctx.fill();

    // --- cam yansıması: camda gezinen ince parlama (idle) ---
    const sweep = (t % 6) / 6;
    const gx = -38 + 76 * sweep;
    const ga = 0.28 * Math.sin(sweep * Math.PI);
    if (ga > 0.01) {
      ctx.strokeStyle = k.rgba('cyan', ga);
      ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(gx, -78); ctx.lineTo(gx + 12, 14); ctx.stroke();
    }

    // --- çatlaklar: darbeden radyal, tırtıklı, kademeli büyüme ---
    if (d >= 0) {
      const N = 8;
      for (let i = 0; i < N; i++) {
        const ang = (i / N) * k.TAU + (k.hash(i * 17 + 4) - 0.5) * 0.5;
        const L = 30 + 18 * k.hash(i * 3 + 9);
        const delay = k.hash(i * 5 + 2) * 0.25;
        const g = k.prog(d, delay, Math.min(0.7, delay + 0.35));
        if (g <= 0) continue;
        ctx.strokeStyle = k.rgba('bg', 0.78);
        ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath();
        const segs = 4;
        for (let j = 0; j <= segs; j++) {
          const rr = (j / segs) * L * g;
          const aa = ang + 0.35 * k.noise1(i * 7 + j * 2.3);
          const x = IX + Math.cos(aa) * rr, y = IY + Math.sin(aa) * rr;
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // darbe çipi + cam parlaması (ilk 0.3 sn)
      if (d < 0.5) {
        const f = 1 - k.prog(d, 0, 0.3);
        if (f > 0) k.glow(IX, IY, 26 * f, k.col('cyan'), 0.4 * f);
      }
      ctx.fillStyle = k.rgba('bg', 0.85);
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * k.TAU;
        const rr = i % 2 === 0 ? 6 : 3;
        const x = IX + Math.cos(a) * rr, y = IY + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    }

    ctx.restore();
  },
};
