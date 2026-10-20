// pointer-fx/loading-ring — dönen yükleme halkası; done anında halka büzülüp tik işaretine dönüşür.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'loading-ring',
  category: 'pointer-fx',
  desc: 'Dönen yükleme halkası; done anında büzülüp onay tikine dönüşür',
  tags: ['yükleme', 'yükleniyor', 'halka', 'dönüyor', 'bekle', 'tamam', 'tik', 'loading', 'spinner', 'done'],
  box: [-110, -110, 110, 110],
  bleed: 40,
  anchor: 'halka merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    done: { type: 'time', default: null, desc: 'yükleme bitti anı: halka 0.4 sn içinde tike dönüşür' },
    color: { type: 'color', default: 'accent' },
    speed: { type: 'number', default: 1, desc: 'dönüş hızı çarpanı (0.5–2)' },
  },
  draw(ctx, t, p, k) {
    const d = p.done == null ? -1 : t - p.done;
    const R = 56;
    ctx.save();
    ctx.lineCap = 'round';

    if (d >= 0 && d < 0.4) {
      // dönüşüm: halka büzülür + tik çizgisi büyür
      const e = k.E.inOutCubic(k.clamp(d / 0.4, 0, 1));
      const rr = R * (1 - e * 0.35);
      ctx.strokeStyle = k.rgba(p.color, 0.9 * (1 - e));
      ctx.lineWidth = 12 * (1 - e) + 2;
      const head = t * k.TAU * p.speed;
      ctx.beginPath(); ctx.arc(0, 0, rr, head, head + Math.PI * 1.4); ctx.stroke();
      // tik çizgisi
      const te = k.E.outBack(k.clamp((d - 0.12) / 0.28, 0, 1));
      if (te > 0) {
        k.glow(0, 0, 50 * te, 'green', 0.4 * te);
        ctx.strokeStyle = k.rgba('green');
        ctx.lineWidth = 13 * te;
        ctx.beginPath();
        ctx.moveTo(-26 * te, 2); ctx.lineTo(-6 * te, 20 * te); ctx.lineTo(28 * te, -18 * te);
        ctx.stroke();
      }
    } else if (d >= 0.4) {
      // tamamlandı: sakin tik + parlama nabzı
      const pulse = 1 + 0.05 * Math.sin((t * k.TAU) / 2.4);
      k.glow(0, 0, 46 * pulse, 'green', 0.3);
      ctx.strokeStyle = k.rgba('green');
      ctx.lineWidth = 13 * pulse;
      ctx.beginPath();
      ctx.moveTo(-26, 2); ctx.lineTo(-6, 20); ctx.lineTo(28, -18);
      ctx.stroke();
      // sol üst parlama (tik üstünde)
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(-8, -4, 8, 4.5, -0.5, 0, k.TAU); ctx.fill();
    } else {
      // idle: dönen yay (kuyruklu)
      const head = t * k.TAU * p.speed;
      k.glow(0, 0, R + 16, p.color, 0.18);
      ctx.strokeStyle = k.rgba('bg', 0.4);
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color);
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(0, 0, R, head, head + Math.PI * 1.4); ctx.stroke();
      // uç noktada küçük parlama
      const ex = Math.cos(head + Math.PI * 1.4) * R, ey = Math.sin(head + Math.PI * 1.4) * R;
      ctx.fillStyle = k.rgba('yellow', 0.85);
      ctx.beginPath(); ctx.arc(ex, ey, 7, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
