// social-fx/share-arrows — paylaşım okları: üç kavisli ok boşta merkez çevresinde
// döngülü uçar; at anında dışa doğru burst yapıp solar.
export default {
  name: 'share-arrows', category: 'social-fx',
  desc: 'Three curved arrows looping around a centre point, bursting outward on tap',
  tags: ['paylaş', 'share', 'ok', 'arrow', 'gönder', 'send', 'döngü', 'loop', 'forward'],
  box: [-130, -130, 130, 130],
  bleed: 60,
  anchor: 'döngü merkezi',
  points: { centre: [0, 0], out1: [110, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'paylaşım anı: oklar dışa fırlar + iz bırakır (0.9 sn)' },
    color: { type: 'color', default: 'cyan' },
    speed: { type: 'number', default: 1.4, desc: 'döngü hızı (rad/sn, 0.5-3)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const sp = Math.max(0.5, Math.min(3, p.speed));
    const bursting = d >= 0 && d <= 0.9;
    const g = bursting ? k.prog(d, 0, 0.9) : 0;

    for (let i = 0; i < 3; i++) {
      const th = t * sp + (i / 3) * k.TAU + k.hash(i * 7) * 0.5;
      const rad = 58 + (bursting ? 105 * k.E.outExpo(g) : 4 * Math.sin(t * 2 + i * 2.1));
      const x = Math.cos(th) * rad, y = Math.sin(th) * rad * 0.82;
      // teğet yönü (dönüş yönünde)
      const dx = -Math.sin(th), dy = Math.cos(th) * 0.82;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const alpha = bursting ? 1 - g : 1;
      const sc = bursting ? 1 + 0.6 * g : 1;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(uy, ux));
      ctx.scale(sc, sc);
      // iz çizgisi
      if (bursting) {
        ctx.strokeStyle = k.rgba(col, 0.35 * (1 - g));
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(-14, 0); ctx.stroke();
      }
      // kavisli gövde
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-16, 10); ctx.quadraticCurveTo(2, 2, 12, -6); ctx.stroke();
      ctx.strokeStyle = k.rgba(col, alpha);
      ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(-16, 10); ctx.quadraticCurveTo(2, 2, 12, -6); ctx.stroke();
      // ok ucu
      ctx.fillStyle = k.rgba(col, alpha);
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(26, -13); ctx.lineTo(6, -10); ctx.lineTo(16, 4); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // merkez noktası — idle'da nabız
    const pulse = 1 + 0.08 * Math.sin(t * 3);
    ctx.fillStyle = k.rgba(col, bursting ? 1 - g : 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 11 * pulse, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.restore();
  },
};
