// science/dna — DNA sarmalı: iki iplik + baz çiftleri, yavaş döner.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'dna',
  category: 'science',
  desc: 'DNA çift sarmalı: iki renkli iplik ve baz çifti basamakları, yavaşça döner',
  tags: ['dna', 'gen', 'genetik', 'sarmal', 'biyoloji', 'gene', 'genetics', 'helix', 'biology'],
  box: [-90, -130, 90, 130],
  bleed: 20,
  anchor: 'merkez (0,0)',
  points: { top: [0, -118], bottom: [0, 118] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'birinci iplik vurgu rengi' },
    rotate: { type: 'number', default: 0.4, desc: 'dönüş hızı 0–1' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const H = 118, A = 52, freq = (Math.PI * 2.6) / (2 * H);
    const phase = t * (0.4 + p.rotate * 2.2);
    ctx.save();
    ctx.lineCap = 'round';

    // baz çifti basamakları (önce, ipliklerin altında)
    for (let i = 0; i < 11; i++) {
      const y = -H + (i / 10) * 2 * H;
      const a = phase + y * freq;
      const x1 = Math.cos(a) * A, x2 = Math.cos(a + Math.PI) * A;
      const depth = Math.cos(a); // -1 arkada, +1 önde
      ctx.strokeStyle = k.rgba('ink', 0.25 + 0.35 * Math.abs(depth));
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      // baz ucu noktaları
      ctx.fillStyle = k.rgba('purple', 0.7);
      ctx.beginPath(); ctx.arc(x1, y, 4, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.7);
      ctx.beginPath(); ctx.arc(x2, y, 4, 0, k.TAU); ctx.fill();
    }

    // iki iplik — derinliğe göre ton
    const strand = (off, col, baseAlpha) => {
      ctx.strokeStyle = k.rgba(col, baseAlpha);
      ctx.lineWidth = 11;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const y = -H + (i / 60) * 2 * H;
        const a = phase + y * freq + off;
        const x = Math.cos(a) * A;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    strand(0, 'dim', 0.55);
    strand(Math.PI, acc, 0.95);

    // öndeki ipliğe parlama noktaları
    for (let i = 0; i < 11; i++) {
      const y = -H + (i / 10) * 2 * H;
      const a = phase + y * freq + Math.PI;
      if (Math.cos(a) > 0.55) {
        const x = Math.cos(a) * A;
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.beginPath(); ctx.arc(x - 2, y - 2, 3.2, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
