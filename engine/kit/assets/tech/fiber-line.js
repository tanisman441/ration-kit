// tech/fiber-line — fiber optik hat: iki bağlantı düğümü arası kablo,
// active anında ışık darbesi hattan geçer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) hat merkezidir.
export default {
  name: 'fiber-line', category: 'tech',
  desc: 'Fiber optik hat; active anında ışık darbesi soldan sağa geçer',
  tags: ['fiber', 'optik', 'hat', 'fiber optic', 'kablo', 'cable', 'internet', 'ışık', 'light', 'ağ'],
  box: [-230, -45, 230, 45],
  bleed: 30,
  anchor: 'hat merkezi (0,0)',
  points: { start: [-220, 0], mid: [0, 0], end: [220, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    active: { type: 'time', default: null, desc: 'ışık darbesi anı: darbe 1.1 sn hattan geçer' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 5;
    const sheath = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    // darbe zamanlaması
    const d = p.active == null ? -1 : t - p.active;
    const pulsing = d >= 0 && d < 1.1;
    const prog = pulsing ? k.E.inOutCubic(k.clamp(d / 1.1, 0, 1)) : -1;
    const px = -183 + prog * 366;

    // kablo (dış kılıf + iç çekirdek çizgisi)
    ctx.strokeStyle = line; ctx.lineWidth = 14 + LW;
    ctx.beginPath(); ctx.moveTo(-183, 0); ctx.lineTo(183, 0); ctx.stroke();
    ctx.strokeStyle = sheath; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(-183, 0); ctx.lineTo(183, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('cyan', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-183, 0); ctx.lineTo(183, 0); ctx.stroke();

    // ışık darbesi: parlak çekirdek + glow + sönümlenen kuyruk
    if (pulsing) {
      k.glow(px, 0, 42, 'cyan', 0.55);
      for (let i = 1; i <= 6; i++) {
        const tx = px - i * 15;
        if (tx > -183) dot(tx, 0, 7.5 - i * 0.8, k.rgba('cyan', 0.5 - i * 0.07));
      }
      dot(px, 0, 9, k.rgba('cyan', 1));
      dot(px, 0, 4, 'rgba(255,255,255,0.95)');
    }

    // bağlantı düğümleri
    const node = (x, hot) => {
      blob(x - 22, -22, 44, 44, 10, k.rgba('panel2'));
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - 10, -13, 8, 5, -0.4, 0, k.TAU); ctx.fill();
      const on = hot ? k.rgba('cyan', 0.9 + 0.1 * Math.sin(t * 20)) : k.rgba('green', 0.55 + 0.35 * Math.sin(t * 2.4 + k.hash(x) * k.TAU));
      dot(x, 0, 6, on);
      if (hot) k.glow(x, 0, 22, 'cyan', 0.4);
      else if (k.hash(x * 3) > 0.5) k.glow(x, 0, 14, 'green', 0.2);
    };
    node(-205, pulsing && prog < 0.08);
    node(205, pulsing && prog > 0.92);

    ctx.restore();
  },
};
