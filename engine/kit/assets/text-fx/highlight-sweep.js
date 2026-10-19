// text-fx/highlight-sweep — fosforlu kalem vurgusu metnin üzerinden süpürülür. Contract: engine/kit/ASSETS.md
export default {
  name: 'highlight-sweep', category: 'text-fx',
  desc: 'Fosforlu kalem vurgusu metnin üzerinden soldan sağa süpürülür; ardından hafif parlama nabzı devam eder',
  tags: ['vurgu', 'fosforlu', 'kalem', 'işaretleme', 'metin', 'highlight', 'marker', 'sweep', 'text'],
  box: [-340, -48, 340, 48],
  bleed: 20,
  anchor: 'metin merkezi (0,0)',
  points: { center: [0, 0], baseline: [0, 22] },
  params: {
    text: { type: 'text', default: 'Merhaba', desc: 'vurgulanacak metin' },
    color: { type: 'color', default: 'yellow', desc: 'vurgu (kalem) rengi' },
    textColor: { type: 'color', default: 'ink', desc: 'metin rengi' },
    at: { type: 'time', default: null, desc: 'süpürmenin başlama anı (0.7 sn sürer)' },
  },
  draw(ctx, t, p, k) {
    const txt = String(p.text ?? '');
    const d = p.at == null ? 1e9 : t - p.at;
    if (d < 0) return;

    ctx.save();
    ctx.font = `700 44px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fw = Math.max(1, ctx.measureText(txt || ' ').width);
    const x0 = -fw / 2 - 18, totalW = fw + 36;

    // süpürme ilerlemesi (outCubic)
    const pr = p.at == null ? 1 : k.clamp(d / 0.7, 0, 1);
    const e = 1 - Math.pow(1 - pr, 3);
    const sw = e * totalW;

    // idle: vurgunun üzerinde hafif parlama nabzı
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    if (sw > 0) {
      ctx.fillStyle = k.rgba(p.color, 0.42 + 0.10 * pulse);
      ctx.beginPath(); k.rrect(x0, -25, sw, 50, 10); ctx.fill();
      // vurgu şeridinin sağ kenarında taze "ıslak" şerit
      if (pr < 1) {
        ctx.fillStyle = k.rgba(p.color, 0.85);
        ctx.beginPath(); k.rrect(x0 + sw - 6, -25, 10, 50, 5); ctx.fill();
      }
    }

    // metin (vurgunun üstünde; bilgi yüzeyine parlama uygulanmaz)
    ctx.fillStyle = k.rgba(p.textColor);
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  },
};
