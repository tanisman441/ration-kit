// thought-fx/brain-wave — sevimli kafa ikonu; içinde beyin, üstünde döngüsel nabız dalgaları. pulse hız çarpanıdır.
// NOT: canvas y-aşağıdır; (0,0) kafa merkezi.
export default {
  name: 'brain-wave', category: 'thought-fx',
  desc: 'Cute head icon with a brain inside and looping pulse waves radiating from the top',
  tags: ['beyin', 'kafa', 'düşünce', 'dalga', 'brain', 'head', 'mind', 'wave', 'pulse', 'zeka'],
  box: [-88, -92, 88, 78],
  bleed: 30,
  anchor: 'kafa merkezi (0,0)',
  points: { head: [0, -4], brain: [0, -28], top: [0, -70] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'dalga rengi' },
    pulse: { type: 'number', default: 1, desc: 'nabız hızı çarpanı (0.2–3)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const sp = k.clamp(p.pulse ?? 1, 0.2, 3);
    const floatY = Math.sin(t * k.TAU / 2.4) * 2.5;            // canlı idle: hafif süzülme
    ctx.translate(0, floatY);
    const line = k.rgba('bg', 0.55), sh = k.rgba('ink', 0.10), inkC = k.rgba('ink');

    // kafa
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(7, 4, 56, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -4, 60, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.arc(0, -4, 56, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst kafada, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-26, -32, 18, 11, -0.5, 0, k.TAU); ctx.fill();
    // beyin: üstte çıkıntılı yumru (nabızla hafif şişer)
    const bs = 1 + 0.04 * Math.sin(t * k.TAU * sp / 2.4);
    ctx.save(); ctx.translate(0, -30); ctx.scale(bs, bs);
    const bumps = [[-26, 2, 17, 15], [0, -8, 19, 16], [26, 2, 17, 15], [0, 6, 32, 20]];
    ctx.fillStyle = line;
    for (const [x, y, rx, ry] of bumps) { ctx.beginPath(); ctx.ellipse(x, y, rx + 4, ry + 4, 0, 0, k.TAU); ctx.fill(); }
    ctx.fillStyle = k.rgba('dim');
    for (const [x, y, rx, ry] of bumps) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill(); }
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-6, -2, 12, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(10, 2, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.restore();
    // yüz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(-17, 8, 5, 5, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(17, 8, 5, 5, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 16, 14, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
    // nabız dalgaları: kafadan yukarı yayılan döngüsel halkalar
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.55 * sp + i / 3) % 1;
      const r = 62 + ph * 52;
      ctx.strokeStyle = k.rgba(p.color, 0.55 * (1 - ph));
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, -4, r, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    }
    ctx.restore();
  },
};
