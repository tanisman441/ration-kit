// text-fx/pop-word — kelime overshoot büyümeyle belirir, sonra yumuşak süzülür. Contract: engine/kit/ASSETS.md
export default {
  name: 'pop-word', category: 'text-fx',
  desc: 'Kelime overshoot (hafif aşma) büyümeyle patlayarak belirir, sonra yumuşakça süzülür',
  tags: ['kelime', 'belirme', 'pop', 'vurgu', 'metin', 'pop', 'appear', 'emphasis', 'word', 'text'],
  box: [-320, -56, 320, 56],
  bleed: 24,
  anchor: 'metin merkezi (0,0)',
  points: { center: [0, 0], baseline: [0, 22] },
  params: {
    text: { type: 'text', default: 'Merhaba', desc: 'belirecek kelime/metin' },
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'belirme anı (0.35 sn overshoot)' },
  },
  draw(ctx, t, p, k) {
    const txt = String(p.text ?? '');
    const d = p.at == null ? 1e9 : t - p.at;
    if (d < 0) return;
    // overshoot büyüme: outBack
    const x = p.at == null ? 1 : k.clamp(d / 0.35, 0, 1);
    const c1 = 1.9, c3 = c1 + 1;
    const s = p.at == null ? 1 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    const floatY = Math.sin(t * 2.2) * 4;           // idle: yumuşak süzülme

    ctx.save();
    ctx.translate(0, floatY);
    ctx.scale(Math.max(0.01, s), Math.max(0.01, s));
    ctx.font = `700 44px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba(p.color);
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  },
};
