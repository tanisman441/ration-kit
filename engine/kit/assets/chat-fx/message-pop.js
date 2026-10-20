// chat-fx/message-pop — gelen mesaj: at anında balon alttan fırlayıp oturur, hafif esner. Contract: engine/kit/ASSETS.md
export default {
  name: 'message-pop', category: 'chat-fx',
  desc: 'Gelen mesaj balonu: at anında alttan yukarı fırlayıp esneyerek oturur, içinde sahte metin çizgileri',
  tags: ['mesaj', 'message', 'balon', 'gelen', 'sohbet', 'chat', 'pop', 'bubble', 'notification', 'incoming'],
  box: [-170, -160, 170, 60],
  bleed: 30,
  anchor: 'balonun altı (0,0)',
  points: { top: [0, -150], center: [0, -80], tail: [70, -8] },
  params: {
    at: { type: 'time', default: null, desc: 'mesajın gelme anı' },
    color: { type: 'color', default: 'panel2' },
    lines: { type: 'number', default: 3, desc: 'metin çizgisi sayısı (1-4)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0) return;

    const W = 240, H = 140, R = 26;
    const ease = k.E.outExpo(k.clamp(d / 0.5, 0, 1));          // 0.5 sn yükseliş
    const pop = k.E.outBack(k.clamp(d / 0.45, 0, 1));         // 0.45 sn ölçek
    const yOff = 90 * (1 - ease);
    // yerleşince esneme (squash & stretch)
    const settle = k.clamp((d - 0.5) / 0.4, 0, 1);
    const sx = 1 + 0.06 * Math.sin(d * 14) * (1 - settle) + 0.015 * Math.sin(t * 2.6) * settle;
    const sy = 1 - 0.05 * Math.sin(d * 14) * (1 - settle) - 0.015 * Math.sin(t * 2.6) * settle;

    const shade = (n, f) => { const c = k.col(n); return `rgb(${c[0] * f | 0},${c[1] * f | 0},${c[2] * f | 0})`; };
    const alpha = k.clamp(d / 0.15, 0, 1);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, yOff);
    ctx.scale(Math.max(0.01, pop * sx), Math.max(0.01, pop * sy));

    const top = -H;                                           // balon [-W/2, -H]..[W/2, 0]
    ctx.fillStyle = shade(p.color, 0.88);                     // gölge (sağ alt %12)
    k.rrect(-W / 2 + 7, top + 7, W, H, R); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();                                          // kuyruk (sağ alt)
    ctx.moveTo(W / 2 - 40, -6); ctx.lineTo(W / 2 - 12, 28); ctx.lineTo(W / 2 - 64, -4); ctx.closePath(); ctx.fill();
    k.rrect(-W / 2, top, W, H, R); ctx.fill();
    ctx.lineWidth = Math.max(4, W * 0.03);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    k.rrect(-W / 2, top, W, H, R); ctx.stroke();

    // premium parlama: sol üst, alfa 0.11
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-W / 2 + 52, top + 24, 46, 15, -0.4, 0, k.TAU); ctx.fill();

    // sahte metin çizgileri
    const n = Math.min(4, Math.max(1, Math.round(p.lines ?? 3)));
    ctx.fillStyle = k.rgba('ink', 0.5);
    for (let i = 0; i < n; i++) {
      const lw = (i === n - 1 ? 0.55 : 0.82) * (W - 72);
      const ly = top + 34 + i * 30;
      k.rrect(-W / 2 + 36, ly, lw, 11, 6); ctx.fill();
    }
    ctx.restore();
  },
};
