// elevator-fx/doors-slide — asansör kapıları; `at` anında yana kayarak açılır, sonra kapanır.
// ANIMASYON: `at` anında kapılar 0.6 sn'de yana kayar (0→1), 0.8 sn açık kalır, 0.6 sn'de
// kapanır; açılırken aradan sıcak iç ışık sızar. Idle'da üstteki küçük gösterge yumuşak nabız.
// Tek vurgu: iç ışık (yellow). Contract: engine/kit/ASSETS.md
export default {
  name: 'doors-slide',
  category: 'elevator-fx',
  desc: 'Asansör kapıları; at anında yana kayarak açılır, aradan iç ışık sızar',
  tags: ['asansör', 'kapı', 'kayarak açılma', 'kat', 'bina', 'elevator', 'lift', 'sliding doors', 'floor', 'building'],
  box: [-112, -150, 112, 150],
  bleed: 24,
  anchor: 'kapı merkezi (0,0)',
  points: { centre: [0, 0], top: [0, -150] },
  params: {
    at: { type: 'time', default: null, desc: 'kapıların kayarak açılma anı (açılış 0.6 sn, kapanış 0.6 sn)' },
    open: { type: 'number', default: 0, desc: 'elle açıklık (0 kapalı, 1 açık); animasyona eklenir' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    // animasyonlu açıklık: 0.6 sn açıl, 0.8 sn bekle, 0.6 sn kapan
    const anim = d < 0 ? 0
      : k.E.outCubic(k.prog(d, 0, 0.6)) - k.E.outCubic(k.prog(d, 1.4, 2.0));
    const open = k.clamp((p.open ?? 0) + Math.max(anim, 0), 0, 1);

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- dış çerçeve ---
    plate(-104, -124, 208, 248, 14, k.rgba('dim'));
    // kabin içi (kapılar açılınca görünür)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(-82, -104, 164, 208, 6); ctx.fill();
    // iç ışık sızıntısı (açıklıkla belirir)
    ctx.fillStyle = k.rgba('yellow', 0.16 * open + 0.02);
    ctx.beginPath(); k.rrect(-82, -104, 164, 208, 6); ctx.fill();
    // kabin arka duvarı: dikey panel çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.28); ctx.lineWidth = 3;
    for (const gx of [-41, 0, 41]) {
      ctx.beginPath(); ctx.moveTo(gx, -104); ctx.lineTo(gx, 104); ctx.stroke();
    }

    // --- kapılar (çerçeveye clip'lenir) ---
    ctx.save();
    ctx.beginPath(); ctx.rect(-104, -124, 208, 248); ctx.clip();
    const dw = 82, shift = dw * open;
    plate(-82 - shift, -104, dw, 208, 6, k.rgba('panel2')); // sol
    plate(0 + shift, -104, dw, 208, 6, k.rgba('panel2'));   // sağ
    ctx.restore();
    // kapı parlama (sol üst, kapılar kapalıyken belli)
    if (open < 0.5) {
      ctx.fillStyle = k.rgba('#ffffff', 0.10 * (1 - open * 2) + 0.02);
      ctx.beginPath(); ctx.ellipse(-58 - shift, -86, 15, 9, -0.2, 0, k.TAU); ctx.fill();
    }
    // kapı kenar çizgileri (açıklıkla dışa kayar)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-shift, -104); ctx.lineTo(-shift, 104); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(shift, -104); ctx.lineTo(shift, 104); ctx.stroke();
    // kapı kolları (ince dikey tutamak)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-10 - shift, -30); ctx.lineTo(-10 - shift, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10 + shift, -30); ctx.lineTo(10 + shift, 30); ctx.stroke();

    // --- üst gösterge (nabız) ---
    const pulse = 0.35 + 0.15 * Math.sin(t * 2.2);
    plate(-26, -146, 52, 20, 8, k.rgba('ink'));
    if (d >= 0) k.glow(0, -136, 14, 'yellow', 0.45);
    ctx.fillStyle = k.rgba('yellow', d >= 0 ? 0.9 : pulse);
    ctx.beginPath(); ctx.arc(0, -136, 6, 0, k.TAU); ctx.fill();

    // --- eşik ---
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-92, 104, 184, 12, 6); ctx.fill();
    ctx.restore();
  },
};
