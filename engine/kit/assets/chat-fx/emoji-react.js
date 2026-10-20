// chat-fx/emoji-react — tepki anında mesajın üstünde emoji patlar (kalp/kahkaha/beğen). Contract: engine/kit/ASSETS.md
export default {
  name: 'emoji-react', category: 'chat-fx',
  desc: 'Emoji tepkisi: at anında seçilen emoji mesajın üstünde parçacıklarla patlayıp belirir, sonra süzülür',
  tags: ['emoji', 'tepki', 'kalp', 'beğen', 'kahkaha', 'reaksiyon', 'reaction', 'like', 'heart', 'laugh', 'message'],
  box: [-150, -200, 150, 70],
  bleed: 40,
  anchor: 'mesaj balonunun merkezi (0,0)',
  points: { emoji: [0, -130], center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'tepkinin patlama anı' },
    emoji: { type: 'enum', values: ['heart', 'laugh', 'like'], default: 'heart', desc: 'emoji türü' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0) return;
    const em = p.emoji ?? 'heart';
    const ac = em === 'heart' ? 'red' : em === 'laugh' ? 'yellow' : 'accent';
    const shade = (n, f) => { const c = k.col(n); return `rgb(${c[0] * f | 0},${c[1] * f | 0},${c[2] * f | 0})`; };

    // küçük mesaj balonu (zemin)
    ctx.save();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-90, -28, 180, 56, 20); ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = k.rgba('bg', 0.55);
    k.rrect(-90, -28, 180, 56, 20); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.45);
    k.rrect(-66, -6, 100, 12, 6); ctx.fill();
    ctx.restore();

    // emoji yükselişi: 0.55 sn patlama, sonra süzülme
    const rise = k.E.outCubic(k.clamp(d / 0.55, 0, 1));
    const sc = k.E.outBack(k.clamp(d / 0.45, 0, 1));
    const ey = -34 - 110 * rise + 7 * Math.sin(t * 2.4) * k.clamp((d - 0.6) / 0.4, 0, 1);

    // patlama parçacıkları (0.7 sn)
    const pd = d;
    if (pd < 0.7) {
      const pr = pd / 0.7;
      for (let i = 0; i < 10; i++) {
        const ang = k.hash(i * 17 + 3) * k.TAU;
        const sp = 40 + k.hash(i * 31 + 7) * 80;
        const px = Math.cos(ang) * sp * k.E.outExpo(pr);
        const py = -60 - 60 * rise + Math.sin(ang) * sp * k.E.outExpo(pr);
        ctx.globalAlpha = 0.9 * (1 - pr);
        ctx.fillStyle = k.rgba(ac);
        ctx.beginPath(); ctx.arc(px, py, 5 * (1 - pr) + 2, 0, k.TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // nabız halkası
    if (d < 0.9) {
      ctx.globalAlpha = 0.5 * (1 - d / 0.9);
      ctx.strokeStyle = k.rgba(ac); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, ey, 30 + d * 130, 0, k.TAU); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // emoji gövdesi
    ctx.save();
    ctx.translate(0, ey);
    ctx.scale(Math.max(0.01, sc), Math.max(0.01, sc));
    ctx.fillStyle = shade(ac, 0.88);                         // gölge (sağ alt)
    const R = 44;
    if (em === 'heart') {
      // kalp: iki daire + üçgen (üst üste biner, dikiş görünmez)
      const heart = () => {
        ctx.beginPath(); ctx.arc(-18, -10, 22, 0, k.TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(18, -10, 22, 0, k.TAU); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-38, -2); ctx.lineTo(38, -2); ctx.lineTo(0, 44); ctx.closePath(); ctx.fill();
      };
      ctx.save(); ctx.translate(7, 7); heart(); ctx.restore();
      ctx.fillStyle = k.rgba(ac); heart();
    } else if (em === 'laugh') {
      ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(ac);
      ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
      // kahkaha yüzü: ^^ gözler + açık ağız
      ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-17, -10, 9, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.beginPath(); ctx.arc(17, -10, 9, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.9);
      ctx.beginPath(); ctx.ellipse(0, 14, 15, 12, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(ac);
      ctx.beginPath(); ctx.ellipse(0, 8, 8, 5, 0, 0, k.TAU); ctx.fill(); // dil
    } else {
      // beğen (başparmak): rozet + parmak
      ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(ac);
      ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel');
      k.rrect(-22, -2, 30, 34, 10); ctx.fill();               // yumruk
      ctx.beginPath();                                        // başparmak
      ctx.roundRect(-18, -40, 16, 46, 8); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(-18, -40, 16, 46, 8); ctx.stroke();
    }
    // parlama: sol üst, alfa 0.11
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-16, -22, 18, 9, -0.4, 0, k.TAU); ctx.fill();
    // dış hat
    ctx.lineWidth = 5; ctx.strokeStyle = k.rgba('bg', 0.55);
    if (em !== 'heart') { ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke(); }
    ctx.restore();
  },
};
