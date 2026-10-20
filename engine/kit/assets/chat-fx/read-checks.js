// chat-fx/read-checks — okundu bilgisi: at anında tek tik çift tike dönüşür ve renklenir. Contract: engine/kit/ASSETS.md
export default {
  name: 'read-checks', category: 'chat-fx',
  desc: 'Okundu tikleri: at öncesi tek gri tik, at anında ikinci tik kayarak gelir ve ikisi de renge dönüşür',
  tags: ['tik', 'okundu', 'görüldü', 'mesaj', 'whatsapp', 'read', 'check', 'seen', 'ticks', 'message', 'double'],
  box: [-80, -60, 80, 60],
  bleed: 24,
  anchor: 'tiklerin merkezi (0,0)',
  points: { center: [0, 0], right: [60, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'okunma anı (tek → çift tik)' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? 1e9 : t - p.at;                    // at yoksa direkt "okundu" hali
    const ev = k.clamp(d / 0.45, 0, 1);                         // 0.45 sn geçiş
    const ease = k.E.outBack(ev);

    const drawTick = (dx, dy, s, col) => {
      ctx.save(); ctx.translate(dx, dy); ctx.scale(s, s);
      ctx.strokeStyle = col; ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-24, 2); ctx.lineTo(-6, 20); ctx.lineTo(26, -22);
      ctx.stroke(); ctx.restore();
    };

    ctx.save();
    if (d < 0) {
      // henüz okunmadı: tek gri tik, hafif sallantı (idle)
      const sway = 2 * Math.sin(t * 1.8);
      drawTick(sway, 0, 1, k.rgba('dim'));
    } else {
      // birinci tik sola kayar + renklenir
      drawTick(-14 * ease, 0, 1, ev < 1 ? k.rgba('dim') : k.rgba(p.color));
      // ikinci tik kayarak gelir
      const slide = 34 * (1 - k.E.outExpo(ev));
      const al = k.clamp(ev * 1.6, 0, 1);
      ctx.globalAlpha = al;
      drawTick(14 * ease + slide, 0, 0.6 + 0.4 * ease, k.rgba(p.color));
      ctx.globalAlpha = 1;
      // okununca parlama patlaması
      if (d < 0.5) {
        ctx.globalAlpha = 0.6 * (1 - d / 0.5);
        ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 0, 24 + d * 90, 0, k.TAU); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  },
};
