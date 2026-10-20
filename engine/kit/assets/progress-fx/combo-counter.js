// progress-fx/combo-counter — kombo sayacı: at anında "xN" büyür, alev kıvılcımları fırlar (0.6 sn).
// Boşta sayaç hafif nabız atar (kombo büyüdükçe nabız hızlanır). (0,0) = metin merkezi.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır.
export default {
  name: 'combo-counter', category: 'progress-fx',
  desc: 'Kombo sayacı: vuruş anında "xN" pop ile büyür, alev kıvılcımları saçılır',
  tags: ['kombo', 'combo', 'sayaç', 'counter', 'vuruş', 'hit', 'streak', 'seri', 'skor', 'score'],
  box: [-140, -85, 140, 85],
  bleed: 60,
  anchor: 'metin merkezi (0,0)',
  points: { center: [0, 0], flames: [0, 45] },
  params: {
    combo: { type: 'number', default: 5, desc: 'gösterilen kombo sayısı' },
    at: { type: 'time', default: null, desc: 'vuruş anı: sayaç büyür + alev kıvılcımı (0.6 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const n = Math.max(1, Math.round(p.combo ?? 5));
    const ev = d >= 0 && d <= 0.6;
    const g = ev ? k.prog(d, 0, 0.6) : 1;

    // idle: kombo sayısı arttıkça hızlanan nabız
    const rate = 2.4 + Math.min(10, n) * 0.35;
    let s = 1 + 0.04 * Math.sin(t * rate);
    let rot = 0;
    if (ev) {
      const pop = Math.min(1, d / 0.18);
      s *= 1 + 0.6 * k.E.outBack(pop, 2.4) * 0.55;
      rot = 0.06 * Math.sin(d * 40) * (1 - g);      // vuruş sarsıntısı
    }
    ctx.rotate(rot); ctx.scale(s, s);

    // alev kıvılcımları: alttan yukarı fırlar, solar
    if (ev) {
      for (let i = 0; i < 12; i++) {
        const a = -Math.PI / 2 + (k.hash(i) - 0.5) * 1.8;
        const dist = (25 + k.hash(i + 30) * 65) * k.E.outExpo(g);
        const fx = Math.cos(a) * dist, fy = 45 - dist;
        const fs = (4 + k.hash(i + 70) * 6) * (1 - g * 0.5);
        k.glow(fx, fy, fs * 3, k.rgba(col), 0.45 * (1 - g));
        ctx.fillStyle = k.rgba(col, 1 - g * 0.7);
        ctx.beginPath(); ctx.arc(fx, fy, fs, 0, k.TAU); ctx.fill();
      }
    }

    // ana metin: "x5"
    const str = `x${n}`;
    ctx.font = `800 64px system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // dış hat (bg 0.55)
    ctx.lineWidth = 10; ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.strokeText(str, 0, 0);
    ctx.fillStyle = k.rgba(col);
    ctx.fillText(str, 0, 0);
    // üst mini etiket (iki temada da okunur)
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.font = `700 20px system-ui, sans-serif`;
    ctx.fillText('COMBO', 0, -52);
    ctx.restore();
  },
};
