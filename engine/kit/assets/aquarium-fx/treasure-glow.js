// aquarium-fx/treasure-glow — hazine sandığı: kapak aralığından idle
// altın ışık sızar (~1.6 sn nabız), parıltılar yanıp söner; burst
// anında (0.6 sn) kapak açılır, ışık patlar, altınlar havaya savrulur.
// NOT: canvas y-aşağıdır; (0,0) sandığın tabanıdır.
export default {
  name: 'treasure-glow', category: 'aquarium-fx',
  desc: 'Aralığından altın ışık sızan hazine sandığı, burst anında kapak açılıp ışık patlar',
  tags: ['hazine', 'sandık', 'altın', 'parıltı', 'ışık', 'treasure', 'chest', 'gold', 'glow', 'sparkle'],
  box: [-110, -120, 110, 30],
  bleed: 80,
  anchor: 'sandığın tabanı (0,0)',
  points: { lid: [0, -72], glow: [0, -42] },
  params: {
    burst: { type: 'time', default: null, desc: 'kapak açılışı anı (0.6 sn, ışık patlaması + altınlar savrulur)' },
    color: { type: 'color', default: 'yellow', desc: 'altın/ışık rengi' },
  },
  draw(ctx, t, p, k) {
    const gold = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // burst olayı (0.6 sn): kapak açılır, ışık patlar
    const bd = p.burst == null ? -1 : t - p.burst;
    let open = 0.07; // idle: kapak aralık
    let flash = 0;
    if (bd >= 0 && bd < 0.6) {
      const pp = bd / 0.6;
      open = 0.07 + Math.sin(pp * Math.PI * 0.5) * 0.55; // kapak açılır
      flash = Math.sin(pp * Math.PI);                     // 0→peak→0
    }

    // ışık nabzı (idle, 1.6 sn) + burst flaşı
    const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.6);
    const glowA = 0.22 + pulse * 0.18 + flash * 0.5;

    // sandık gövdesi
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(-80, -58, 160, 58, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    k.rrect(-80, -58, 160, 58, 10); ctx.stroke();
    // metal şeritler
    ctx.fillStyle = k.rgba('dim', 0.7);
    k.rrect(-58, -58, 12, 58, 5); ctx.fill();
    k.rrect(46, -58, 12, 58, 5); ctx.fill();
    // toka
    ctx.fillStyle = k.rgba(gold, 0.9);
    k.rrect(-9, -46, 18, 22, 5); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    k.rrect(-9, -46, 18, 22, 5); ctx.stroke();

    // altın yığını (kapak aralığında görünür)
    for (let i = 0; i < 7; i++) {
      const h = k.hash(i * 13.1);
      const cx = -52 + h * 104;
      const cy = -58 + (h * 29 % 1) * 12;
      ctx.fillStyle = k.rgba(gold, 0.95);
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, k.TAU); ctx.stroke();
    }

    // kapak: soldan menteşeli, open kadar açılır
    ctx.save();
    ctx.translate(-80, -58); ctx.rotate(-open);
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(0, -26, 160, 26, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    k.rrect(0, -26, 160, 26, 12); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(36, -17, 26, 7, -0.2, 0, k.TAU); ctx.fill();
    ctx.restore();

    // sızan ışık: kapak aralığından yukarı ışınlar
    k.glow(0, -52, 60 + flash * 60, gold, Math.min(0.5, glowA));
    ctx.fillStyle = k.rgba(gold, 0.14 + flash * 0.25);
    for (let i = -1; i <= 1; i++) {
      const wob = k.noise1(i * 4.4 + t * 0.7) * 10;
      ctx.beginPath();
      ctx.moveTo(i * 40 - 12 + wob * 0.3, -58);
      ctx.lineTo(i * 40 + 12 + wob * 0.3, -58);
      ctx.lineTo(i * 52 + wob, -58 - 46 - flash * 40);
      ctx.lineTo(i * 28 + wob, -58 - 46 - flash * 40);
      ctx.closePath(); ctx.fill();
    }

    // parıltı yıldızları (idle yanıp söner)
    for (let i = 0; i < 5; i++) {
      const h = k.hash(i * 47.7 + 3);
      const sx = -70 + h * 140;
      const sy = -66 - (h * 61 % 1) * 30 - flash * 26;
      const tw = 0.5 + 0.5 * Math.sin(t * 3.4 + i * 2.1);
      const a = (0.25 + tw * 0.55) * (0.6 + flash * 0.4);
      const r = 4 + h * 4 + flash * 4;
      ctx.strokeStyle = k.rgba(gold, a); ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sx - r, sy); ctx.lineTo(sx + r, sy);
      ctx.moveTo(sx, sy - r); ctx.lineTo(sx, sy + r);
      ctx.stroke();
    }

    // burst: havaya savrulan altınlar (0.6 sn)
    if (flash > 0) {
      for (let i = 0; i < 6; i++) {
        const h = k.hash(i * 71.3);
        const up = Math.sin(Math.min(bd / 0.6, 1) * Math.PI);
        const cx = (h - 0.5) * 150;
        const cy = -60 - up * (50 + h * 50);
        ctx.fillStyle = k.rgba(gold, 0.95);
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, k.TAU); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
