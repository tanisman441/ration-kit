// fantasy/castle — iki kuleli taş kale: burçlar, kemerli kapı, yanan pencereler, dalgalanan bayraklar.
// Orijinal tasarım; gerçek kale kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) taban merkezidir.
export default {
  name: 'castle',
  category: 'fantasy',
  desc: 'İki kuleli taş kale; burçlar, kemerli kapı, titreyen pencere ışıkları; signal anında burç feneri çakar',
  tags: ['kale', 'şato', 'hisar', 'ortaçağ', 'castle', 'fortress', 'medieval', 'kingdom'],
  box: [-155, -128, 155, 128],
  bleed: 50,
  anchor: 'taban merkezi (0,0)',
  points: { gate: [0, 115], beacon: [0, -68] },
  params: {
    color: { type: 'color', default: 'panel2', desc: 'taş rengi' },
    signal: { type: 'time', default: null, desc: 'burç fenerinin çaktığı an' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const blob = (x, y, w, h, r, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); k.rrect(x + 5, y + 7, w, h, r); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - 3, y - 3, w + 6, h + 6, r + 3); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); ctx.arc(x + 4, y + 5, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };

    const d = p.signal == null ? -1 : t - p.signal;
    const alert = d >= 0 && d < 0.9 ? 1 - d / 0.9 : 0;

    // yan kuleler (arkada)
    blob(-140, -8, 62, 123, 8, p.color);
    blob(78, -8, 62, 123, 8, p.color);
    for (let i = 0; i < 3; i++) {
      blob(-140 + i * 22, -32, 16, 28, 4, p.color);
      blob(78 + i * 22, -32, 16, 28, 4, p.color);
    }
    // ana burç
    blob(-58, -45, 116, 160, 8, p.color);
    for (let i = 0; i < 4; i++) blob(-58 + i * 30, -70, 20, 28, 5, p.color);

    // taş derz çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3;
    [[-45, 10, 45, 10], [-45, 55, 45, 55], [-128, 40, -88, 40], [88, 40, 128, 40]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    // kapı (kemerli)
    blob(-30, 42, 60, 73, 24, p.color, sh(p.color, 0.55));
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 58); ctx.lineTo(0, 115); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-22, 82); ctx.lineTo(22, 82); ctx.stroke();

    // ANIMASYON (idle) — pencere ışıkları titrer
    const win = (x, y, r, i) => {
      const a = 0.8 + 0.2 * Math.sin(t * 3.1 + i * 1.7);
      k.glow(x, y, r + 12, 'yellow', 0.3 * a);
      dot(x, y, r, 'yellow', k.rgba('yellow', a));
    };
    win(-26, -12, 7, 0); win(26, -12, 7, 1);
    win(-109, 34, 6, 2); win(109, 34, 6, 3);

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -20, 26, 60, -0.15, 0, k.TAU); ctx.fill();

    // ANIMASYON (idle) — bayraklar dalgalanır (signal'de daha hızlı)
    const flag = (px, py, phase) => {
      const spd = alert > 0 ? 16 : 9, amp = alert > 0 ? 10 : 6;
      const sway = Math.sin(t * spd + phase) * amp;
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(px, py + 44); ctx.lineTo(px, py); ctx.stroke();
      ctx.fillStyle = sh('red');
      ctx.beginPath();
      ctx.moveTo(px + 3, py + 3); ctx.quadraticCurveTo(px + 24, py + 2 + sway, px + 46, py + 10 + sway * 1.5);
      ctx.lineTo(px, py + 24); ctx.closePath(); ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = O;
      ctx.beginPath();
      ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 24, py + 2 + sway, px + 46, py + 10 + sway * 1.5);
      ctx.lineTo(px, py + 24); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = k.rgba('red');
      ctx.beginPath();
      ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 24, py + 2 + sway, px + 46, py + 10 + sway * 1.5);
      ctx.lineTo(px, py + 24); ctx.closePath(); ctx.fill();
    };
    flag(-29, -114, 0);
    flag(-109, -76, 2.1);
    flag(109, -76, 4.2);

    // ANIMASYON — signal olayı: burç feneri çakar (0.9 sn)
    if (alert > 0) {
      const pulse = 0.5 + 0.5 * Math.sin(d * 28);
      k.glow(0, -70, 55 * pulse + 20, 'yellow', 0.55 * alert);
      ctx.fillStyle = `rgba(255,255,255,${(0.8 * pulse * alert).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(0, -70, 10 * pulse + 6, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('yellow', 0.7 * alert); ctx.lineWidth = 4;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.3, r1 = 22 + pulse * 8, r2 = r1 + 16;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, -70 + Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, -70 + Math.sin(a) * r2);
        ctx.stroke();
      }
    }
  },
};
