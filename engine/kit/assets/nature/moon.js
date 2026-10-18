// nature/moon — hilal ay; phase anında hilalden dolunaya geçer, normalde yumuşak parıltıyla nabız atar.
// NOT: hilal, iki yaydan kurulu tek path ile çizilir (zemin boyası yok).
export default {
  name: 'moon',
  category: 'nature',
  desc: 'Hilal ay; phase anında hilalden dolunaya geçer, yumuşak parıltıyla nabız atar',
  tags: ['ay', 'hilal', 'dolunay', 'gece', 'gökyüzü', 'moon', 'crescent', 'night', 'lunar', 'sky'],
  box: [-95, -95, 95, 95],
  bleed: 45,
  anchor: 'ay merkezi (0,0)',
  points: { centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow' },
    phase: { type: 'time', default: null, desc: 'hilal→dolunay geçiş anı (~2 sn sürer)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // phase: olay yoksa hilal; olayda 2 sn'de dolunaya
    const d = p.phase == null ? -1 : t - p.phase;
    const prog = d < 0 ? 0 : k.clamp(d / 2, 0, 1);

    // idle: yumuşak parıltı nabzı + hafif süzülme
    const glowPulse = 0.5 + 0.5 * Math.sin(t * 1.8);
    const floatY = Math.sin(t * 1.1) * 3;

    const R = 58;
    // terminator: hilal (w=0.75R) → yarı (w=0) → şişkin (w<0) → dolunay (w=-R)
    const w = R * (0.75 - 1.75 * k.E.inOutCubic(prog));

    k.glow(0, floatY, R + 20, p.color, 0.14 + 0.08 * glowPulse);

    // ay gövdesi: sağ dış yay + terminator (alttan üste)
    const moonPath = () => {
      ctx.beginPath();
      ctx.arc(0, floatY, R, -Math.PI / 2, Math.PI / 2);
      if (w >= 0) ctx.ellipse(0, floatY, Math.max(1, w), R, 0, Math.PI / 2, -Math.PI / 2, true);
      else ctx.ellipse(0, floatY, Math.max(1, -w), R, 0, Math.PI / 2, Math.PI * 1.5, false);
      ctx.closePath();
    };

    // sağ alt gölge
    ctx.save(); ctx.translate(5, 6); ctx.fillStyle = darker(p.color); moonPath(); ctx.fill(); ctx.restore();
    // dış hat
    ctx.lineWidth = LW; ctx.strokeStyle = line; moonPath(); ctx.stroke();
    // gövde
    ctx.fillStyle = k.rgba(p.color); moonPath(); ctx.fill();

    // kraterler (aydınlık bölgede kalanlar görünür)
    ctx.save(); moonPath(); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.18);
    const craters = [[-18, -12, 10], [8, 14, 13], [-6, -30, 7], [22, -20, 6]];
    for (const [cx, cy, cr] of craters) {
      ctx.beginPath(); ctx.arc(cx, cy + floatY, cr, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-R * 0.34, floatY - R * 0.4, R * 0.4, R * 0.24, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
