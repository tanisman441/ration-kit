// factory-fx/safety-laser — güvenlik lazeri.
// ANIMASYON: `trip` anında ışın ortadan kesilir (0.9 sn): iki uç titrer,
// alarm lambası strobo yapar. Idle'da ışın üzerinde enerji nabızları akar,
// hafif titreme vardır. Tek vurgu: red.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'safety-laser',
  category: 'factory-fx',
  desc: 'İki direk arası güvenlik lazeri; trip anında ışın kesilir, alarm çakar',
  tags: ['lazer', 'güvenlik', 'ışın', 'fabrika', 'alarm', 'kesilme', 'laser', 'safety', 'beam', 'factory', 'alarm', 'trip'],
  box: [-132, -82, 132, 82],
  bleed: 30,
  anchor: 'ışın çizgisi (0,-24)',
  points: { beam_left: [-94, -24], beam_right: [94, -24], break: [0, -24], alarm: [-106, -74] },
  params: {
    trip: { type: 'time', default: null, desc: 'ışının kesilme anı (0.9 sn alarm + titreyen uçlar)' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.trip == null ? -1 : t - p.trip;
    const broken = d >= 0 && d < 0.9;
    const BY = -24;
    ctx.lineCap = 'round';

    // --- direkler ---
    for (const [px, sgn] of [[-118, -1], [94, 1]]) {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(px + 6, -62 + 6, 24, 124, 8); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(px, -62, 24, 124, 8); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);
      ctx.beginPath(); ctx.ellipse(px + 7, -52, 4, 10, 0.2, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); k.rrect(px, -62, 24, 124, 8); ctx.stroke();
      // taban
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); k.rrect(px - 8, 52, 40, 14, 6); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
      ctx.beginPath(); k.rrect(px - 8, 52, 40, 14, 6); ctx.stroke();
      // yayıcı başlık
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); k.rrect(px + 4, BY - 10, 16, 20, 6); ctx.fill();
    }

    // --- alarm lambası (sol direk üstü) ---
    const strobe = broken ? (Math.sin(t * 40) > 0 ? 1 : 0.15) : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 2.2));
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-118, -82, 24, 20, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); k.rrect(-118, -82, 24, 20, 6); ctx.stroke();
    k.glow(-106, -72, 15, p.color, 0.45 * strobe);
    ctx.fillStyle = k.rgba(p.color, strobe);
    ctx.beginPath(); ctx.arc(-106, -72, 6.5, 0, k.TAU); ctx.fill();

    // --- ışın ---
    const flick = 0.85 + 0.15 * k.noise1(t * 18);
    if (!broken) {
      k.glow(0, BY, 26, p.color, 0.30 * flick);
      ctx.strokeStyle = k.rgba(p.color, 0.9 * flick);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-94, BY); ctx.lineTo(94, BY); ctx.stroke();
      // akan enerji nabızları (1.6 sn döngü)
      for (let i = 0; i < 3; i++) {
        const ph = ((t / 1.6) + i / 3) % 1;
        const px = k.lerp(-94, 94, ph);
        const pa = 0.85 * Math.sin(ph * Math.PI);
        k.glow(px, BY, 9, p.color, 0.5 * pa);
        ctx.fillStyle = k.rgba('#ffffff', 0.9 * pa);
        ctx.beginPath(); ctx.arc(px, BY, 3, 0, k.TAU); ctx.fill();
      }
    } else {
      // kesik ışın: iki titreyen uç
      const f1 = 0.5 + 0.5 * k.noise1(t * 45), f2 = 0.5 + 0.5 * k.noise1(t * 45 + 7);
      for (const [x0, x1, ff] of [[-94, -30, f1], [30, 94, f2]]) {
        k.glow((x0 + x1) / 2, BY, 20, p.color, 0.28 * ff);
        ctx.strokeStyle = k.rgba(p.color, 0.9 * ff);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x0, BY); ctx.lineTo(x1, BY); ctx.stroke();
        // kopuk uçta kıvılcım
        k.glow(x1 === 30 ? 30 : -30, BY, 12, p.color, 0.5 * ff);
      }
      // kesik noktada çarpı işareti
      const xa = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 26));
      ctx.strokeStyle = k.rgba(p.color, xa); ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-12, BY - 12); ctx.lineTo(12, BY + 12);
      ctx.moveTo(12, BY - 12); ctx.lineTo(-12, BY + 12);
      ctx.stroke();
      const alarmFade = 1 - k.prog(d, 0.6, 0.9);
      if (alarmFade > 0) {
        ctx.strokeStyle = k.rgba(p.color, 0.35 * alarmFade); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, BY, 26 + d * 40, 0, k.TAU); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
