// music-fx/sound-wave — hoparlörden çıkan, sağa ilerleyen sinüzoidal ses dalgaları.
// burst anında dalgalar şişer + halka yayılır (0.8 sn); boşta sürekli dalga ilerlemesi.
export default {
  name: 'sound-wave', category: 'music-fx',
  desc: 'Speaker emitting travelling sine sound waves that swell on a burst',
  tags: ['ses dalgası', 'sound wave', 'dalga', 'hoparlör', 'speaker', 'ses', 'audio', 'sine', 'yayılma'],
  box: [-180, -100, 180, 100],
  bleed: 30,
  anchor: '(0,0) dalgaların merkezi; hoparlör solda',
  points: { speaker: [-110, 0], mouth: [-60, 0], tip: [160, 0] },
  params: {
    burst: { type: 'time', default: null, desc: 'ani ses patlaması: dalgalar büyür + halka (0.8 sn)' },
    color: { type: 'color', default: 'cyan' },
    waves: { type: 'number', default: 3, desc: 'dalga çizgisi sayısı (2-4)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const n = Math.max(2, Math.min(4, Math.round(p.waves)));
    const d = p.burst == null ? -1 : t - p.burst;

    // 1) hoparlör kabini (solda)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-160 + 6, -55 + 6, 100, 110, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 9;
    ctx.beginPath(); k.rrect(-160, -55, 100, 110, 16); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-138, -38, 22, 12, -0.5, 0, k.TAU); ctx.fill();
    // koni + kapak
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(-110, 0, 36, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.arc(-110, 0, 13, 0, k.TAU); ctx.fill();

    // 2) burst şişmesi
    let boost = 1, glowA = 0;
    if (d >= 0 && d <= 0.8) {
      const g = k.prog(d, 0, 0.8);
      boost = 1 + 1.5 * (1 - g);
      glowA = 0.5 * (1 - g);
    }
    if (glowA > 0) k.glow(-60, 0, 60, p.color, glowA);

    // 3) sinüzoidal dalga çizgileri — sağa ilerler
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const yBase = (i - (n - 1) / 2) * 36;
      const alpha = 0.85 - i * 0.14;
      ctx.strokeStyle = k.rgba(p.color, Math.max(0.3, alpha));
      ctx.lineWidth = 7 - i * 1.2;
      ctx.beginPath();
      for (let x = -40; x <= 170; x += 6) {
        const amp = (7 + (x + 40) * 0.045) * boost;
        const y = yBase + amp * Math.sin(x * 0.055 - t * 7 + i * 1.7);
        if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 4) burst halkası: ağızdan yayılan şok (0.8 sn)
    if (d >= 0 && d <= 0.8) {
      const g = k.prog(d, 0, 0.8);
      const pr = 20 + 90 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - g));
      ctx.lineWidth = 8 * (1 - g) + 2;
      ctx.beginPath(); ctx.arc(-60, 0, pr, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
