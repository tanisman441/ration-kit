// time-fx/calendar-flip — duvar takvimi; `at` anında yaprak üstten çevrilir.
// NOT: canvas y-aşağıdır. Çevirme 0.7 sn sürer; sonrasında yeni gün görünür.
export default {
  name: 'calendar-flip',
  category: 'time-fx',
  desc: 'Spiralli duvar takvimi; at anında yaprak çevrilir, yeni gün açığa çıkar',
  tags: ['takvim', 'gün', 'tarih', 'sayfa', 'çevirme', 'calendar', 'date', 'flip', 'time', 'gün'],
  box: [-110, -125, 110, 125],
  bleed: 25,
  anchor: 'takvim merkezi (0,0)',
  points: { face: [0, 10], top: [0, -112] },
  params: {
    color: { type: 'color', default: 'ink' },
    day: { type: 'number', default: 15, desc: 'gün numarası' },
    month: { type: 'text', default: 'EKİM', desc: 'ay adı (kısa)' },
    at: { type: 'time', default: null, desc: 'yaprak çevirme anı (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const W = 170, H = 205, X0 = -W / 2, Y0 = -H / 2;
    const bindH = 34;                                  // spiral barı yüksekliği
    const pivotY = Y0 + bindH;                         // çevirme ekseni (barın altı)
    const d = p.at == null ? -1 : t - p.at;
    const flipping = d >= 0 && d < 0.7;
    const flipped = d >= 0.7;
    const prog = flipping ? k.E.inOutCubic(k.clamp(d / 0.7, 0, 1)) : 0;
    const dayNow = Math.round(p.day) + (flipped ? 1 : 0);

    // idle: takvim spiralden asılı hafif sallanır
    ctx.save();
    ctx.translate(0, Y0 - 8);
    ctx.rotate(0.012 * Math.sin(t * 1.3));
    ctx.translate(0, -(Y0 - 8));

    // arka yaprak (yeni gün): hep altta durur
    const page = (day, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(X0 - 4, Y0 - 4, W + 8, H + 8, 18); ctx.fill();
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); k.rrect(X0, Y0, W, H, 14); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = "700 30px 'Inter', sans-serif";
      ctx.fillStyle = k.rgba('dim');
      ctx.fillText(String(p.month).toUpperCase(), 0, Y0 + 62);
      ctx.font = "900 92px 'JetBrains Mono', monospace";
      ctx.fillStyle = k.rgba(p.color);
      ctx.fillText(String(day), 0, Y0 + 128);
    };
    page(Math.round(p.day) + 1, 1);

    // ön yaprak: çevirmede eksen etrafında döner
    ctx.save();
    ctx.translate(0, pivotY);
    if (flipping) {
      // düşeyde sıkışıp tersine dön: sayfa yukarı kalkar
      const sy = Math.cos(prog * Math.PI);
      ctx.scale(1, sy);
      ctx.globalAlpha = 0.96;
    } else if (flipped) {
      ctx.globalAlpha = 0;                             // çevrildi, görünmez
    }
    if (!flipped) {
      ctx.translate(0, -pivotY);
      // ön yaprağı eksenin altında çiz
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(X0 - 4, Y0 - 4, W + 8, H + 8, 18); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(X0, Y0, W, H, 14); ctx.fill();
      // sağ alt gölge
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); k.rrect(X0 + W - 66, Y0 + H - 30, 52, 18, 9); ctx.fill();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = "700 30px 'Inter', sans-serif";
      ctx.fillStyle = k.rgba('dim');
      ctx.fillText(String(p.month).toUpperCase(), 0, Y0 + 62);
      ctx.font = "900 92px 'JetBrains Mono', monospace";
      ctx.fillStyle = k.rgba(p.color);
      ctx.fillText(String(Math.round(p.day)), 0, Y0 + 128);
      // çevirme anında köşede hareket çizgileri
      if (flipping && prog < 0.5) {
        ctx.strokeStyle = inkC; ctx.lineWidth = 4; ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
          const yy = Y0 + H - 30 - i * 22;
          const xx = X0 + W - 26 - prog * 60;
          ctx.globalAlpha = 0.5 * (1 - prog * 2);
          ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 22, yy - 10); ctx.stroke();
        }
        ctx.globalAlpha = 0.96;
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    // spiral barı (bilgi dışı yüzey: parlama uygulanabilir)
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(X0 - 6, Y0 - 10, W + 12, bindH + 6, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(X0 + 8, Y0 - 6, W - 16, 8, 4); ctx.fill();
    // spiral halkaları
    for (const hx of [-52, 0, 52]) {
      ctx.strokeStyle = k.rgba('bg', 0.75); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(hx, Y0 - 8, 11, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('panel', 0.9); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(hx, Y0 - 8, 11, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();   // idle sallanma sonu
    void line;
  },
};
