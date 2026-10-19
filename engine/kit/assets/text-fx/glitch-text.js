// text-fx/glitch-text — `at` anında 0.5 sn RGB kaymalı bozulma, sonra ara sıra mikro seğirme. Contract: engine/kit/ASSETS.md
export default {
  name: 'glitch-text', category: 'text-fx',
  desc: 'Bozuk metin: olay anında 0.5 sn RGB dilim kaymaları, boştayken ara sıra mikro seğirme',
  tags: ['bozuk', 'glitch', 'hata', 'cyber', 'sinyal', 'metin', 'glitch', 'corrupt', 'cyber', 'text', 'error'],
  box: [-340, -48, 340, 48],
  bleed: 30,
  anchor: 'metin merkezi (0,0)',
  points: { center: [0, 0], baseline: [0, 22] },
  params: {
    text: { type: 'text', default: 'Merhaba', desc: 'bozulacak metin' },
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'bozulma anı (0.5 sn sürer)' },
  },
  draw(ctx, t, p, k) {
    const txt = String(p.text ?? '');
    const d = p.at == null ? 1e9 : t - p.at;
    if (d < 0) return;

    ctx.save();
    ctx.font = `700 44px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fw = Math.max(1, ctx.measureText(txt || ' ').width);
    const baseC = k.rgba(p.color);

    if (d < 0.5) {
      // === bozulma olayı: RGB kayma + yatay dilim yer değiştirmeleri ===
      const I = 1 - d / 0.5;                        // sönümlenen yoğunluk
      const frame = Math.floor(t * 24);             // deterministik kare
      // kromatik sapma: kırmızı ve camgöbeği kopyalar
      ctx.globalAlpha = 0.75 * I;
      ctx.fillStyle = k.rgba('red');
      ctx.fillText(txt, (k.hash(frame * 3 + 1) - 0.5) * 14 * I, 0);
      ctx.fillStyle = k.rgba('cyan');
      ctx.fillText(txt, (k.hash(frame * 3 + 2) - 0.5) * 14 * I, 0);
      ctx.globalAlpha = 1;
      // 5 yatay dilim, her biri bağımsız x kayması
      const n = 5;
      for (let i = 0; i < n; i++) {
        const y0 = -24 + (48 * i) / n;
        ctx.save();
        ctx.beginPath(); ctx.rect(-fw / 2 - 40, y0, fw + 80, 48 / n + 1); ctx.clip();
        ctx.fillStyle = baseC;
        ctx.fillText(txt, (k.hash(frame * 7 + i * 13) - 0.5) * 22 * I, 0);
        ctx.restore();
      }
    } else {
      // === idle: ~2.1 sn'de bir 0.07 sn'lik mikro seğirme ===
      const slot = Math.floor(t / 2.1);
      let jx = 0;
      if (k.hash(slot * 11 + 5) > 0.9 && (t % 2.1) < 0.07) jx = (k.hash(slot) - 0.5) * 6;
      ctx.fillStyle = baseC;
      ctx.fillText(txt, jx, 0);
    }
    ctx.restore();
  },
};
