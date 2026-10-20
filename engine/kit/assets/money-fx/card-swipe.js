// money-fx/card-swipe — kredi kartı kaydırma: at anında kart soldan sağa
// fırlar; ardında hayalet izi + yön okları bırakır, temassız dalgalar söner.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kaydırma çizgisinin ortasıdır.
export default {
  name: 'card-swipe', category: 'money-fx',
  desc: 'Kredi kartı kaydırma: at anında kart sağa fırlar, ardında hayalet iz ve oklar bırakır',
  tags: ['kart', 'kredi kartı', 'kaydırma', 'ödeme', 'swipe', 'card', 'payment', 'temassız', 'contactless'],
  box: [-235, -90, 235, 90],
  bleed: 10,
  anchor: 'kaydırma çizgisi merkezi (0,0)',
  points: { start: [-125, 0], end: [125, 0] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'kaydırma anı (0.55 sn uçuş)' },
  },
  draw(ctx, t, p, k) {
    const W = 210, H = 118, R = 20;
    const X0 = -125, X1 = 125, DUR = 0.55;
    const d = p.at == null ? 1e9 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // uçuş eğrisi
    const ease = e => 1 - Math.pow(1 - e, 3);
    const pos = e => X0 + (X1 - X0) * ease(e);
    const phase = d < 0 ? 0 : Math.min(d / DUR, 1);
    const idleY = d < 0 ? Math.sin(t * 2.2) * 3 : (d > DUR ? Math.sin(t * 2.2) * 1.5 : 0);

    // kaydırma çizgisi (zemin)
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(X0 - 20, 0); ctx.lineTo(X1 + 30, 0); ctx.stroke();
    ctx.setLineDash([]);

    // temassız dalgalar (hedef tarafında; kaydırınca söner)
    const waveAl = d < 0 ? 0.5 + 0.2 * Math.sin(t * 3) : Math.max(0, 0.6 * (1 - d / 0.4));
    if (waveAl > 0) {
      ctx.strokeStyle = k.rgba('yellow', waveAl); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(152, 0, 14 + i * 16, -0.9, 0.9); ctx.stroke();
      }
    }

    // kart çizen yardımcı
    const card = (cx, cy, al) => {
      ctx.save(); ctx.translate(cx, cy);
      ctx.fillStyle = k.rgba('bg', 0.55 * al);
      ctx.beginPath(); k.rrect(-W / 2 - 3.5, -H / 2 - 3.5, W + 7, H + 7, R + 4); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, al);
      ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
      // çip
      ctx.fillStyle = k.rgba('yellow', al);
      ctx.beginPath(); k.rrect(-82, -44, 44, 32, 8); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.5 * al); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-82, -28); ctx.lineTo(-38, -28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-60, -44); ctx.lineTo(-60, -12); ctx.stroke();
      // numara çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.75 * al); ctx.lineWidth = 5;
      for (let g = 0; g < 4; g++) {
        const gx = -82 + g * 46;
        ctx.beginPath(); ctx.moveTo(gx, 30); ctx.lineTo(gx + 30, 30); ctx.stroke();
      }
      // marka: iki daire
      ctx.fillStyle = k.rgba('yellow', 0.9 * al);
      ctx.beginPath(); ctx.arc(66, 40, 15, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55 * al); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(84, 40, 15, 0, k.TAU); ctx.stroke();
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,' + (0.10 * al).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(-58, -44, 40, 11, -0.3, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    // hayalet izi (uçuş sırasında)
    if (d >= 0 && d < DUR) {
      for (let i = 1; i <= 3; i++) {
        const gd = d - i * 0.07;
        if (gd < 0) continue;
        card(pos(Math.min(gd / DUR, 1)), idleY, 0.28 / i);
      }
      // yön okları (uçuş yönünde, solar)
      const ax = pos(phase) + 120;
      ctx.strokeStyle = k.rgba('yellow', 0.85 * (1 - phase)); ctx.lineWidth = 7;
      for (let i = 0; i < 2; i++) {
        const ox = ax + i * 34;
        if (ox + 20 > 243) continue; // box+bleed içinde kal
        ctx.beginPath(); ctx.moveTo(ox, -16); ctx.lineTo(ox + 20, 0); ctx.lineTo(ox, 16); ctx.stroke();
      }
    }

    // ana kart
    const cx = d < 0 ? X0 : (d >= DUR ? X1 : pos(phase));
    card(cx, idleY, 1);

    // uçuş flaşı (ilk 0.12 sn)
    if (d >= 0 && d < 0.12) {
      k.glow(cx, 0, 90 * (1 - d / 0.12), 'yellow', 0.4 * (1 - d / 0.12));
    }
  },
};
