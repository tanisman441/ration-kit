// commerce-fx/coupon-tear — perforasyonlu indirim kuponu; `at` anında yırtılır, iki parça ayrılır.
// NOT: canvas y-aşağıdır. Idle: 3 sn periyotlu hafif sallanma; at olayı ~1 sn sürer.
export default {
  name: 'coupon-tear', category: 'commerce-fx',
  desc: 'Perforasyonlu indirim kuponu; yırtılma anında iki parça zikzak kenarla ayrılır',
  tags: ['kupon', 'indirim', 'yırtılma', 'kampanya', 'çek', 'coupon', 'discount', 'tear', 'voucher', 'promo', 'sale'],
  box: [-145, -85, 145, 85],
  bleed: 70,
  anchor: 'kuponun merkezi (yırtılma çizgisi x=0)',
  points: { tear: [0, 0], left: [-70, 0], right: [70, 0] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'yırtılma anı: zikzak flaş + parçalar ayrılır (1 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // ayrılma: 0.2–0.7 sn'de parçalar uzaklaşır, sonra ayrık kalır
    const sep = d < 0.2 ? 0 : k.E.outCubic(k.prog(d, 0.2, 0.7)) * 46;
    const sway = d < 0 ? 0.035 * Math.sin(t * k.TAU / 3) : 0;

    const half = (side) => { // side: -1 sol, +1 sağ
      ctx.save();
      ctx.translate(side * sep, -side * sep * 0.15);
      ctx.rotate(sway + side * sep * 0.0035);
      const x0 = side < 0 ? -128 : 0, x1 = side < 0 ? 0 : 128;
      // zikzak yırtık kenar
      const zig = (dy) => {
        ctx.beginPath();
        ctx.moveTo(side < 0 ? x0 : x1, -62 + dy);
        ctx.lineTo(side < 0 ? x1 : x0, -62 + dy);
        for (let i = 0; i <= 10; i++) {
          const zy = -62 + (i / 10) * 124;
          ctx.lineTo((side < 0 ? x1 : x0) + side * (i % 2 === 0 ? 0 : 10), zy + dy);
        }
        ctx.lineTo(side < 0 ? x0 : x1, 62 + dy);
        ctx.closePath();
      };
      zig(6); ctx.fillStyle = line; ctx.fill();
      zig(0); ctx.fillStyle = k.rgba('panel2'); ctx.fill();
      // sağ alt gölge tonu
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fillRect(side < 0 ? x0 + 70 : x0, 30, 52, 28);
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(side < 0 ? x0 + 34 : x0 + 34, -44, 24, 7, -0.3, 0, k.TAU); ctx.fill();
      // perforasyon çentikleri (dış kenar)
      ctx.fillStyle = k.rgba('bg', 0.9);
      const ex = side < 0 ? x0 : x1;
      ctx.beginPath(); ctx.arc(ex, -62, 12, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(ex, 62, 12, 0, k.TAU); ctx.fill();
      // yazılar
      ctx.fillStyle = k.rgba('ink');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (side < 0) {
        ctx.font = '800 56px system-ui, sans-serif';
        ctx.fillText('%20', -64, -8);
        ctx.font = '700 20px system-ui, sans-serif';
        ctx.fillStyle = k.rgba(p.color);
        ctx.fillText('İNDİRİM', -64, 34);
      } else {
        ctx.font = '800 34px system-ui, sans-serif';
        ctx.fillStyle = k.rgba(p.color);
        ctx.fillText('KUPON', 64, -10);
        ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5;
        ctx.setLineDash([10, 8]);
        ctx.beginPath(); ctx.moveTo(20, 30); ctx.lineTo(108, 30); ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    };

    half(-1); half(1);

    // yırtılma flaşı: 0–0.3 sn'de perforasyon boyunca parlak zikzak
    if (d >= 0 && d < 0.35) {
      const fa = 1 - d / 0.35;
      k.glow(0, 0, 40, 'yellow', 0.45 * fa);
      ctx.strokeStyle = k.rgba('yellow', 0.95 * fa);
      ctx.lineWidth = 6;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const zy = -62 + (i / 12) * 124;
        const zx = (i % 2 === 0 ? 0 : -8);
        if (i === 0) ctx.moveTo(zx, zy); else ctx.lineTo(zx, zy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      // uçuşan kağıt parçacıkları
      for (let i = 0; i < 8; i++) {
        const px = k.noise1(i * 7.7) * 30 + d * (60 + k.hash(i * 3.1) * 80) * (i % 2 === 0 ? 1 : -1);
        const py = -50 + k.hash(i * 5.9) * 100 - d * 120;
        ctx.fillStyle = k.rgba('dim', 0.85 * fa);
        ctx.save(); ctx.translate(px, py); ctx.rotate(d * 9 + i);
        ctx.fillRect(-5, -3, 10, 6);
        ctx.restore();
      }
    }

    // perforasyon çizgisi (yırtılmadan önce görünür)
    if (d < 0.05) {
      ctx.strokeStyle = k.rgba('ink', 0.45); ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(0, 58); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
};
