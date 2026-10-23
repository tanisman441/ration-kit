// city-fx/elevator-doors — asansör kapıları; `at` anında açılır, kat lambası yanar.
// ANIMASYON: `at` anında kapılar 0.5 sn'de açılır (0→1), 0.7 sn açık kalır, 0.5 sn'de
// kapanır; üstteki kat lambası ok işaretiyle yeşil yanar. Idle'da lamba yumuşak nabız.
// Tek vurgu: kat lambası (green). Contract: engine/kit/ASSETS.md
export default {
  name: 'elevator-doors',
  category: 'city-fx',
  desc: 'Asansör kapıları; at anında açılıp kapanır, üstte kat lambası yanar',
  tags: ['asansör', 'kapı', 'kat', 'bina', 'ofis', 'açılan kapı', 'şehir', 'elevator', 'lift', 'doors', 'floor', 'building', 'city'],
  box: [-112, -152, 112, 152],
  bleed: 30,
  anchor: 'kapı merkezi (0,0)',
  points: { centre: [0, 10] },
  params: {
    at: { type: 'time', default: null, desc: 'kapıların açılma anı (açılış 0.5 sn, kapanış 0.5 sn)' },
    open: { type: 'number', default: 0, desc: 'elle açıklık (0 kapalı, 1 açık); animasyona eklenir' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    // animasyonlu açıklık: 0.5 sn açıl, 0.7 sn bekle, 0.5 sn kapan
    const anim = d < 0 ? 0
      : k.E.outCubic(k.prog(d, 0, 0.5)) - k.E.outCubic(k.prog(d, 1.2, 1.7));
    const open = k.clamp((p.open ?? 0) + Math.max(anim, 0), 0, 1);
    const lampOn = d >= 0;

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- dış çerçeve ---
    plate(-100, -118, 200, 246, 14, k.rgba('dim'));
    // kabin içi (kapılar açılınca görünür)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(-78, -98, 156, 204, 6); ctx.fill();
    // iç ışık (açıklıkla belirir)
    ctx.fillStyle = k.rgba('yellow', 0.14 * open + 0.02);
    ctx.beginPath(); k.rrect(-78, -98, 156, 204, 6); ctx.fill();
    // kabin arka duvar çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.25); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-40 * (1 - open), -98); ctx.lineTo(-40 * (1 - open), 106); ctx.stroke();

    // --- kapılar (çerçeveye clip'lenir: duvar içine kayan kapı görünümü) ---
    ctx.save();
    ctx.beginPath(); ctx.rect(-100, -118, 200, 246); ctx.clip();
    const dw = 78, shift = dw * open;
    plate(-78 - shift, -98, dw, 204, 6, k.rgba('panel2')); // sol
    plate(0 + shift, -98, dw, 204, 6, k.rgba('panel2'));  // sağ
    ctx.restore();
    // kapı parlama (sol üst, kapılar kapalıyken belli)
    if (open < 0.5) {
      ctx.fillStyle = k.rgba('#ffffff', 0.10 * (1 - open * 2 > 0 ? 1 - open * 2 : 0) + 0.02);
      ctx.beginPath(); ctx.ellipse(-56 - shift, -80, 14, 8, -0.2, 0, k.TAU); ctx.fill();
    }
    // orta çizgi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-shift, -98); ctx.lineTo(-shift, 106); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(shift, -98); ctx.lineTo(shift, 106); ctx.stroke();

    // --- kat lambası (yukarı ok) ---
    plate(-32, -148, 64, 28, 8, k.rgba('ink'));
    const pulse = lampOn ? 0.85 + 0.15 * Math.sin(t * 4) : 0.3 + 0.12 * Math.sin(t * 1.8);
    if (lampOn) k.glow(0, -134, 18, 'green', 0.5 * pulse);
    ctx.fillStyle = k.rgba('green', lampOn ? pulse : 0.25);
    ctx.beginPath();
    ctx.moveTo(0, -143); ctx.lineTo(11, -131); ctx.lineTo(4.5, -131);
    ctx.lineTo(4.5, -125); ctx.lineTo(-4.5, -125); ctx.lineTo(-4.5, -131); ctx.lineTo(-11, -131);
    ctx.closePath(); ctx.fill();

    // --- eşik ---
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-88, 106, 176, 12, 6); ctx.fill();
    ctx.restore();
  },
};
