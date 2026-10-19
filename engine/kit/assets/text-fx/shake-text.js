// text-fx/shake-text — `at` anında metin 0.4 sn sarsılır, sonra çok hafif titrer. Contract: engine/kit/ASSETS.md
export default {
  name: 'shake-text', category: 'text-fx',
  desc: 'Sarsılan metin: olay anında 0.4 sn yatay sarsıntı, boştayken neredeyse görünmez titreme',
  tags: ['sarsıntı', 'titreme', 'deprem', 'uyarı', 'metin', 'shake', 'tremble', 'vibration', 'text'],
  box: [-320, -48, 320, 48],
  bleed: 24,
  anchor: 'metin merkezi (0,0)',
  points: { center: [0, 0], baseline: [0, 22] },
  params: {
    text: { type: 'text', default: 'Merhaba', desc: 'sarsılacak metin' },
    color: { type: 'color', default: 'ink' },
    intensity: { type: 'number', default: 8, desc: 'sarsıntı genliği (birim)' },
    at: { type: 'time', default: null, desc: 'sarsıntı anı (0.4 sn sürer)' },
  },
  draw(ctx, t, p, k) {
    const txt = String(p.text ?? '');
    const d = p.at == null ? 1e9 : t - p.at;
    if (d < 0) return;
    const amp = p.intensity ?? 8;
    let dx, dy, rot;
    if (d < 0.4) {
      const I = 1 - d / 0.4;                       // sönümlenen zarf
      dx = k.noise1(d * 55) * amp * I;
      dy = k.noise1(d * 47 + 13) * amp * 0.5 * I;
      rot = k.noise1(d * 40 + 7) * 0.02 * I;
    } else {
      dx = k.noise1(t * 2.6) * 1.2;                // idle: çok hafif titreme
      dy = 0; rot = 0;
    }

    ctx.save();
    ctx.translate(dx, dy); ctx.rotate(rot);
    ctx.font = `700 44px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba(p.color);
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  },
};
