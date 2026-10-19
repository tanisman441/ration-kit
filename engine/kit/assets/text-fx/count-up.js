// text-fx/count-up — sayı 0'dan hedefe doğru sayar, sonra hafif nabız yapar. Contract: engine/kit/ASSETS.md
export default {
  name: 'count-up', category: 'text-fx',
  desc: 'Sayıcı: olay anında 0\'dan hedef sayıya doğru yumuşayarak sayar, sonra hafif nabız atar',
  tags: ['sayı', 'sayaç', 'istatistik', 'skor', 'yüzde', 'count', 'counter', 'number', 'stats', 'score'],
  box: [-320, -48, 320, 48],
  bleed: 16,
  anchor: 'sayı merkezi (0,0)',
  points: { center: [0, 0], baseline: [0, 22] },
  params: {
    to: { type: 'number', default: 100, desc: 'hedef sayı' },
    dur: { type: 'number', default: 1.2, desc: 'sayım süresi (sn)' },
    prefix: { type: 'text', default: '', desc: 'sayının önüne eklenecek önek' },
    suffix: { type: 'text', default: '', desc: 'sayının sonuna eklenecek sonek (örn. %)' },
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'sayıma başlama anı' },
  },
  draw(ctx, t, p, k) {
    const target = p.to ?? 100;
    const d = p.at == null ? 1e9 : t - p.at;
    if (d < 0) return;
    const pr = k.clamp(d / Math.max(0.05, p.dur ?? 1.2), 0, 1);
    const eased = 1 - Math.pow(1 - pr, 3);          // outCubic: hızlı başlar, yumuşak durur
    const val = Math.round(target * eased);
    const str = `${p.prefix ?? ''}${val}${p.suffix ?? ''}`;
    const pulse = 1 + 0.03 * Math.sin(t * 3);       // idle: rakam nabzı

    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.font = `700 44px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba(p.color);
    ctx.fillText(str, 0, 0);
    ctx.restore();
  },
};
