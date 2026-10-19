// text-fx/typewriter-caret — metin harf harf yazılır, yanında yanıp sönen imleç. Contract: engine/kit/ASSETS.md
export default {
  name: 'typewriter-caret', category: 'text-fx',
  desc: 'Daktilo efekti: metin harf harf belirir, sonunda yanıp sönen imleç (caret) durur',
  tags: ['daktilo', 'yazma', 'yazı', 'imleç', 'metin', 'typewriter', 'typing', 'caret', 'cursor', 'text'],
  box: [-320, -48, 320, 48],
  bleed: 16,
  anchor: 'metin merkezi (0,0); yazı tam ortalanır, imleç son harfin sağındadır',
  points: { center: [0, 0], baseline: [0, 22] },
  params: {
    text: { type: 'text', default: 'Merhaba', desc: 'yazılacak metin' },
    color: { type: 'color', default: 'ink' },
    speed: { type: 'number', default: 12, desc: 'saniyedeki harf sayısı' },
    at: { type: 'time', default: null, desc: 'yazmaya başlama anı' },
  },
  draw(ctx, t, p, k) {
    const txt = String(p.text ?? '');
    const d = p.at == null ? 1e9 : t - p.at;
    if (d < 0) return;
    const spd = Math.max(1, p.speed ?? 12);
    const shown = p.at == null ? txt.length : Math.min(txt.length, Math.floor(d * spd));
    const vis = txt.slice(0, shown);

    ctx.save();
    ctx.font = `700 44px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fw = Math.max(1, ctx.measureText(txt || ' ').width);
    const vw = ctx.measureText(vis || ' ').width;
    const inkC = k.rgba(p.color);

    // görünen kısım, tam satırın sol kenarına sabitlenir (harf eklenirken metin kaymaz)
    ctx.fillStyle = inkC;
    ctx.fillText(vis, (vw - fw) / 2, 0);

    // imleç: son görünür harfin sağında, yanıp söner (idle animasyonu)
    const blink = (t * 2.2) % 1 < 0.65;
    if (blink && vis.length > 0) {
      const cx = -fw / 2 + vw + 8;
      ctx.fillStyle = inkC;
      ctx.fillRect(cx, -24, 6, 48);
    }
    ctx.restore();
  },
};
