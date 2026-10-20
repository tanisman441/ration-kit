// progress-fx/xp-bar-fill — XP barı: fill kadar dolar; at anında bar dolma animasyonu yapar, uçta kıvılcımlar.
// Boşta dolu kısımda parlak bir şerit kayar (shine). (0,0) = bar merkezi.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır.
export default {
  name: 'xp-bar-fill', category: 'progress-fx',
  desc: 'Deneyim puanı barı: olay anında animasyonla dolar, kıvılcımlar saçılır',
  tags: ['xp', 'deneyim', 'experience', 'bar', 'ilerleme', 'progress', 'dolum', 'fill', 'tecrübe', 'seviye barı'],
  box: [-180, -50, 180, 50],
  bleed: 60,
  anchor: 'bar merkezi (0,0)',
  points: { left: [-160, 0], right: [160, 0], top: [0, -22] },
  params: {
    fill: { type: 'number', default: 0.6, desc: 'xp doluluk oranı (0-1)' },
    at: { type: 'time', default: null, desc: 'dolma anı: bar sıfırdan hedefe dolar + kıvılcım (0.8 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const line = k.rgba('bg', 0.55);
    const W = 320, H = 34, X0 = -W / 2;
    const target = k.clamp(p.fill ?? 0.6, 0, 1);

    // dolum animasyonu: at anında 0 -> hedef (0.8 sn), sonrası sabit
    let f = target;
    if (d >= 0 && d <= 0.8) f = target * k.E.outExpo(k.prog(d, 0, 0.8));
    else if (d > 0.8) f = target;

    // arka zemin (bar yuvası)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(X0 + 5, -H / 2 + 6, W, H, 16); ctx.fill();           // sağ alt gölge
    ctx.fillStyle = line;
    k.rrect(X0 - 3, -H / 2 - 3, W + 6, H + 6, 18); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    k.rrect(X0, -H / 2, W, H, 16); ctx.fill();

    // dolu kısım
    const fw = Math.max(0.001, f * W);
    if (fw > 2) {
      const grad = ctx.createLinearGradient(X0, 0, X0 + fw, 0);
      grad.addColorStop(0, k.rgba(col, 0.75));
      grad.addColorStop(1, k.rgba(col, 1));
      ctx.fillStyle = grad;
      k.rrect(X0, -H / 2, fw, H, 16); ctx.fill();
      // sol üst parlama (dolgulu yüzeyde)
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(X0 + Math.min(fw, 130) * 0.28, -H / 2 + 7, Math.min(fw, 130) * 0.24, 5.5, 0, 0, k.TAU); ctx.fill();

      // idle: parlak şerit kayması (~3 sn döngü)
      const cyc = (t % 3) / 3;
      const sx = X0 + (cyc * (fw + 120) - 60);
      const sh = ctx.createLinearGradient(sx - 30, 0, sx + 30, 0);
      sh.addColorStop(0, 'rgba(255,255,255,0)');
      sh.addColorStop(0.5, 'rgba(255,255,255,0.35)');
      sh.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sh;
      k.rrect(X0, -H / 2, fw, H, 16); ctx.fill();

      // dolum ucu parlaması
      k.glow(X0 + fw, 0, 26, k.rgba(col), 0.4);
      ctx.fillStyle = k.rgba(col, 0.9);
      ctx.beginPath(); ctx.arc(X0 + fw, 0, 6.5, 0, k.TAU); ctx.fill();
    }

    // kıvılcımlar (dolma anında uçtan fırlar)
    if (d >= 0 && d <= 0.8) {
      const g = k.prog(d, 0, 0.8);
      const tip = X0 + f * W;
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (k.hash(i) - 0.5) * 2.4;
        const dist = (30 + k.hash(i + 30) * 55) * k.E.outExpo(g);
        const px = tip + Math.cos(a) * dist * 0.6;
        const py = Math.sin(a) * dist - 4;
        ctx.fillStyle = k.rgba(col, 1 - g);
        ctx.beginPath(); ctx.arc(px, py, 2.5 + k.hash(i + 70) * 3 * (1 - g), 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
