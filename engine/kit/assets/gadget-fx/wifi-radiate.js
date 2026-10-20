// gadget-fx/wifi-radiate — kaynaktan yukarı doğru yayılan wifi dalgaları.
// NOT: canvas y-aşağıdır; (0,0) yayın çıktığı nokta (kaynak), dalgalar yukarı açılır.
export default {
  name: 'wifi-radiate',
  category: 'gadget-fx',
  desc: 'Wifi signal: arc waves radiating upward from a source point, with a pulse burst event',
  tags: ['wifi', 'sinyal', 'dalga', 'kablosuz', 'internet', 'wireless', 'radiate', 'signal waves'],
  box: [-170, -130, 170, 110],
  bleed: 50,
  anchor: '(0,0) kaynak nokta (router ışığı); dalgalar yukarı doğru yayılır',
  points: { source: [0, 70], top: [0, -120], edge: [130, -60] },
  params: {
    pulse: { type: 'time', default: null, desc: 'dalga patlaması anı: parlak halka yayılır' },
    color: { type: 'color', default: 'accent' },
    arcs: { type: 'number', default: 4, desc: 'yay sayısı (3-5)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const n = Math.max(3, Math.min(5, Math.round(p.arcs)));
    const d = p.pulse == null ? -1 : t - p.pulse;
    const cy = 70;

    // 1) idle: dalgalar hafifçe nefes alır (2.4 sn döngü)
    const loop = (t % 2.4) / 2.4;

    // 2) yaylar — yukarı açılan, kalınlığı azalan çizgiler
    for (let i = 0; i < n; i++) {
      const r = 40 + i * 40;
      const breathe = 1 + 0.05 * Math.sin(loop * k.TAU - i * 0.7);
      const rr = r * breathe;
      const a0 = -Math.PI * 0.78, a1 = -Math.PI * 0.22;
      const fade = 1 - i / (n + 1);
      const alpha = (0.35 + 0.35 * fade) * (0.75 + 0.25 * Math.sin(loop * k.TAU - i * 1.1));
      ctx.strokeStyle = k.rgba(p.color, Math.max(0.12, alpha));
      ctx.lineWidth = 11 - i * 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, cy, rr, a0, a1);
      ctx.stroke();
    }

    // 3) kaynak noktası — parlak çekirdek + sol üst parlama
    const srcGlow = 0.5 + 0.2 * Math.sin(loop * k.TAU);
    k.glow(0, cy, 26, p.color, srcGlow * 0.45);
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.arc(0, cy, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-5, cy - 6, 7, 4.5, -0.6, 0, k.TAU); ctx.fill();

    // 4) pulse olayı: merkezden dışa fırlayan parlak halka (0.8 sn)
    if (d >= 0 && d <= 0.8) {
      const g = k.prog(d, 0, 0.8);
      const pr = 20 + 220 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(p.color, 0.85 * (1 - g));
      ctx.lineWidth = 10 * (1 - g) + 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, cy, pr, -Math.PI * 0.78, -Math.PI * 0.22);
      ctx.stroke();
      if (d > 0.08) {
        const g2 = k.prog(d - 0.08, 0, 0.72);
        ctx.strokeStyle = k.rgba('yellow', 0.6 * (1 - g2));
        ctx.lineWidth = 5 * (1 - g2) + 1.5;
        ctx.beginPath();
        ctx.arc(0, cy, 16 + 200 * k.E.outExpo(g2), -Math.PI * 0.78, -Math.PI * 0.22);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
