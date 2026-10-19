// ui-feedback/progress-ring — TAMAMLANMA mikro-animasyonu: halka 0→%100 dolar, bitince patlama + tik.
// (ui/progress-ring'den farklı: o sürekli dönen spinner'dır; bu tek seferlik dolum+onay animasyonudur.)
// Contract: engine/kit/ASSETS.md
export default {
  name: 'progress-ring',
  category: 'ui-feedback',
  desc: 'Tamamlanma mikro-animasyonu: halka fill anında dolar, bitince patlar ve tik belirir',
  tags: ['tamamlanma', 'ilerleme', 'halka', 'tik', 'onay', 'complete', 'progress', 'ring', 'success', 'ui'],
  box: [-80, -80, 80, 80],
  bleed: 44,
  anchor: 'merkez (0,0)',
  points: { center: [0, 0] },
  params: {
    fill: { type: 'time', default: null, desc: 'doldurmanın tamamlandığı an (1.2 sn dolum + patlama + tik)' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    const d = p.fill == null ? -1 : t - p.fill;
    const R = 44, LW = 12;

    // dolum ilerlemesi: fill anından 1.2 sn önce başlar, fill anında %100 olur
    let prog = 0;
    if (d >= 0) prog = 1;
    else if (d >= -1.2) prog = k.E.inOutCubic((d + 1.2) / 1.2);

    // idle: halka nabzı (2.4 sn)
    const pulse = 1 + 0.03 * Math.sin((t * k.TAU) / 2.4);
    const trackC = k.rgba('dim', 0.3), fillC = k.rgba(p.color);
    ctx.lineCap = 'round';

    ctx.save();
    ctx.scale(pulse, pulse);

    // zemin halka
    ctx.lineWidth = LW;
    ctx.strokeStyle = trackC;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();

    // dolum yayı (tepeden başlar)
    if (prog > 0.005) {
      const a0 = -Math.PI / 2, a1 = a0 + prog * k.TAU;
      if (prog >= 0.999) k.glow(0, 0, R + 16, p.color, 0.35);
      ctx.strokeStyle = fillC;
      ctx.beginPath(); ctx.arc(0, 0, R, a0, a1); ctx.stroke();
      ctx.fillStyle = fillC;
      ctx.beginPath(); ctx.arc(Math.cos(a1) * R, Math.sin(a1) * R, LW / 2, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // bitince patlama + tik (0.7 sn)
    if (d >= 0 && d < 0.7) {
      const e = d / 0.7;
      // genişleyen halka
      ctx.save();
      ctx.globalAlpha = (1 - e) * 0.8;
      ctx.lineWidth = 6;
      ctx.strokeStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(0, 0, R + 10 + e * 44, 0, k.TAU); ctx.stroke();
      // 8 kıvılcım
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + k.hash(i * 7.3);
        const rr = R + 6 + e * 52;
        ctx.globalAlpha = (1 - e) * 0.9;
        ctx.fillStyle = k.rgba('yellow');
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 4.5 * (1 - e * 0.5), 0, k.TAU); ctx.fill();
      }
      ctx.restore();

      // tik: 0.25 sn'de çizilerek belirir
      const te = k.E.outCubic(k.clamp(d / 0.25, 0, 1));
      ctx.save();
      ctx.strokeStyle = k.rgba('ink', 0.92);
      ctx.lineWidth = 10;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const p1 = [-20, 2], p2 = [-5, 17], p3 = [22, -14];
      const l1 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const l2 = Math.hypot(p3[0] - p2[0], p3[1] - p2[1]);
      const total = (l1 + l2) * te;
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]);
      if (total <= l1) {
        const f = l1 > 0 ? total / l1 : 0;
        ctx.lineTo(p1[0] + (p2[0] - p1[0]) * f, p1[1] + (p2[1] - p1[1]) * f);
      } else {
        ctx.lineTo(p2[0], p2[1]);
        const f = l2 > 0 ? (total - l1) / l2 : 0;
        ctx.lineTo(p2[0] + (p3[0] - p2[0]) * f, p2[1] + (p3[1] - p2[1]) * f);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
};
