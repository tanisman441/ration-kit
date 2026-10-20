// time-fx/countdown-ring — geri sayan halka; sıfırda flaş patlar.
// NOT: canvas y-aşağıdır. `at` verilirse bitiş t=`at` olur; verilmezse döngüsel sayar.
export default {
  name: 'countdown-ring',
  category: 'time-fx',
  desc: 'Geri sayan halka ilerleme çemberi; sıfıra ulaşınca flaş patlaması',
  tags: ['geri sayım', 'sayaç', 'halka', 'süre', 'zamanlayıcı', 'countdown', 'ring', 'timer', 'time', 'süre'],
  box: [-140, -140, 140, 140],
  bleed: 40,
  anchor: 'halka merkezi (0,0)',
  points: { face: [0, 0], top: [0, -110] },
  params: {
    color: { type: 'color', default: 'ink' },
    from: { type: 'number', default: 10, desc: 'geri sayım süresi (sn)' },
    at: { type: 'time', default: null, desc: 'sayım bitiş anı: flaş patlaması' },
  },
  draw(ctx, t, p, k) {
    const S = Math.max(1, p.from);
    ctx.lineCap = 'round';
    // at verilirse sayaç bitişi t=at olur; yoksa döngüsel
    const tt = p.at == null ? t : t - (p.at - S);
    const period = S + 1.0;
    const cyc = (((tt % period) + period) % period);
    const rem = cyc < S ? S - cyc : 0;
    const frac = rem / S;
    const d = p.at == null ? -1 : t - p.at;
    const flash = d >= 0 && d < 0.8 ? 1 - d / 0.8 : 0;
    const R = 100, LW = 22;

    // zemin halka
    ctx.strokeStyle = k.rgba('dim', 0.45); ctx.lineWidth = LW;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();

    // ilerleme yayı: yukarıdan başlar, saat yönünde boşalır
    const a0 = -Math.PI / 2, a1 = a0 + frac * k.TAU;
    const urgent = rem <= 3 && rem > 0;
    const ringCol = urgent ? 'red' : 'accent';
    if (frac > 0.001) {
      ctx.strokeStyle = k.rgba(ringCol); ctx.lineWidth = LW;
      ctx.beginPath(); ctx.arc(0, 0, R, a0, a1); ctx.stroke();
      // yuvarlak uç + sol üst parlama
      const ex = Math.cos(a1) * R, ey = Math.sin(a1) * R;
      ctx.fillStyle = k.rgba(ringCol);
      ctx.beginPath(); ctx.arc(ex, ey, LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(ex - 3, ey - 5, LW / 3, LW / 4, 0, 0, k.TAU); ctx.fill();
    }

    // kalan saniye (bilgi yüzeyi: parlama yok)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = "900 64px 'JetBrains Mono', monospace";
    ctx.fillStyle = (urgent || flash > 0) ? k.rgba('red') : k.rgba(p.color);
    ctx.fillText(String(Math.ceil(rem)), 0, 8);

    // son 3 sn tik nabzı: iç halka büyür
    if (urgent) {
      const beat = (3 - rem) % 1;
      ctx.strokeStyle = k.rgba('red', 0.5 * (1 - beat));
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 56 + beat * 14, 0, k.TAU); ctx.stroke();
    }
    // bitiş flaşı: parlama + genişleyen halka
    if (flash > 0) {
      k.glow(0, 0, 130 * flash, 'yellow', 0.5 * flash);
      const rr = 60 + 120 * k.E.outExpo(k.clamp(d / 0.6, 0, 1));
      ctx.strokeStyle = k.rgba('accent', 0.9 * flash);
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
    }
  },
};
