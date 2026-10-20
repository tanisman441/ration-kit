// time-fx/fast-forward — ileri sarma çift okları; `active` anında hız patlaması.
// NOT: canvas y-aşağıdır. Oklar idle'da sağa doğru sıra sıra nabızlanır.
export default {
  name: 'fast-forward',
  category: 'time-fx',
  desc: 'İleri sarma çift okları; active anında hız çizgileriyle patlama yapar',
  tags: ['ileri sar', 'hızlandır', 'ok', 'hız', 'video', 'fast forward', 'speed', 'arrow', 'time'],
  box: [-165, -85, 165, 85],
  bleed: 40,
  anchor: 'oklar merkezi (0,0)',
  points: { tip: [95, 0], face: [0, 0] },
  params: {
    color: { type: 'color', default: 'ink' },
    active: { type: 'time', default: null, desc: 'aktifleşme anı: hız patlaması (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.active == null ? -1 : t - p.active;
    const burst = d >= 0 && d < 0.6 ? 1 - d / 0.6 : 0;

    // arka hız çizgileri: sürekli sağa akar (idle) — box'a kırpılır
    ctx.save();
    ctx.beginPath(); ctx.rect(-165, -85, 330, 170); ctx.clip();
    const speed = burst > 0 ? 2.2 : 1;
    for (let i = 0; i < 4; i++) {
      const cyc = (((t * 1.6 * speed + i * 0.37) % 1) + 1) % 1;
      const x = -160 + cyc * 200;
      ctx.strokeStyle = k.rgba('dim', 0.4 * (1 - cyc) + 0.08);
      ctx.lineWidth = burst > 0 ? 7 : 5;
      const len = 26 + cyc * 40 + burst * 40;
      ctx.beginPath(); ctx.moveTo(x - len, -52 + i * 34); ctx.lineTo(x, -52 + i * 34); ctx.stroke();
    }
    ctx.restore();

    // üç şevron: sıra sıra nabız (soldan sağa akış hissi)
    const xs = [-72, -18, 36];
    for (let i = 0; i < 3; i++) {
      const pulse = 0.55 + 0.45 * Math.sin(t * 5 - i * 1.5);
      const col = burst > 0 ? 'yellow' : p.color;
      const alpha = burst > 0 ? 1 : 0.55 + 0.45 * pulse;
      const x = xs[i];
      ctx.save();
      if (burst > 0) {
        const s = 1 + 0.14 * burst;
        ctx.translate(x, 0); ctx.scale(s, s); ctx.translate(-x, 0);
      }
      ctx.strokeStyle = k.rgba(col, alpha);
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.moveTo(x, -48); ctx.lineTo(x + 42, 0); ctx.lineTo(x, 48);
      ctx.stroke();
      // sol üst parlama (şevron üzerinde)
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(x + 4, -40); ctx.lineTo(x + 22, -22); ctx.stroke();
      ctx.restore();
    }

    // patlama anı: parlama + dışa yayılan halka
    if (burst > 0) {
      k.glow(10, 0, 90 * burst + 30, 'yellow', 0.45 * burst);
      const rr = 50 + 70 * k.E.outExpo(k.clamp(d / 0.5, 0, 1));
      ctx.strokeStyle = k.rgba('yellow', 0.8 * burst);
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(10, 0, rr, 0, k.TAU); ctx.stroke();
    }
    void line; void inkC;
  },
};
