// home/lamp — abajurlu lambader; on paramıyla ışık açılır, titrer
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) lambanın gövdesi merkezidir.
export default {
  name: 'lamp', category: 'home',
  desc: 'Abajurlu lambader; on ile ışık açılır, ışık huzmesi hafif titrer',
  tags: ['lamba', 'lambader', 'lamp', 'ışık', 'light', 'abajur', 'aydınlatma', 'ev', 'home'],
  box: [-95, -115, 95, 100],
  bleed: 45,
  anchor: 'lambanın gövdesi merkezi (0,0); zemin y=92',
  points: { bulb: [0, -62], shade: [0, -84], base: [0, 84] },
  params: {
    on: { type: 'number', default: 1, desc: 'ışık şiddeti 0–1' },
    color: { type: 'color', default: 'accent', desc: 'abajur rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), shadow = 'rgba(0,0,0,0.12)', gloss = 'rgba(255,255,255,0.10)';
    const on = k.clamp(p.on ?? 1, 0, 1);
    // ışık titremesi: hızlı gürültü, açıkken belirgin
    const flick = 0.88 + 0.12 * k.noise1(t * 7 + 3.3);
    const glowA = on * flick;

    ctx.save();

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-88, 86); ctx.lineTo(88, 86); ctx.stroke();

    // ışık huzmesi (abajurdan aşağı — açıkken)
    if (on > 0.01) {
      ctx.save();
      ctx.globalAlpha = 0.10 * on * flick;
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath();
      ctx.moveTo(-30, -58); ctx.lineTo(30, -58);
      ctx.lineTo(72, 84); ctx.lineTo(-72, 84);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // taban
    ctx.fillStyle = shadow;
    ctx.beginPath(); ctx.ellipse(7, 80, 40, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(0, 74, 40, 12, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.ellipse(0, 74, 40, 12, 0, 0, k.TAU); ctx.stroke();

    // gövde direği
    ctx.fillStyle = shadow; k.rrect(-4, -56, 16, 132, 7); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    k.rrect(-10, -60, 16, 132, 7); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-10, -60, 16, 132, 7); ctx.stroke();

    // abajur (trapez)
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(-34, -56); ctx.lineTo(34, -56);
    ctx.lineTo(46, -100); ctx.lineTo(-46, -100);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-40, -60); ctx.lineTo(40, -60);
    ctx.lineTo(52, -104); ctx.lineTo(-52, -104);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();
    // abajur parlama (sol üst)
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(-36, -88, 7, 14, 0.25, 0, k.TAU); ctx.fill();

    // ampul + ışıma
    if (on > 0.01) {
      k.glow(0, -56, 34, 'yellow', 0.4 * glowA);
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath(); ctx.arc(0, -56, 9, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -56, 9, 0, k.TAU); ctx.stroke();
      // titreyen ışınlar (3 kısa çizgi)
      ctx.strokeStyle = k.rgba('yellow', 0.5 * glowA); ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) {
        const rl = 14 + k.noise1(t * 9 + i * 5.7) * 6;
        ctx.beginPath();
        ctx.moveTo(i * 22, -44); ctx.lineTo(i * 26, -44 + rl);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(0, -56, 9, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -56, 9, 0, k.TAU); ctx.stroke();
    }

    // serbest kablo (zeminde, ink rengiyle)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(38, 78); ctx.quadraticCurveTo(66, 82, 82, 70);
    ctx.stroke();

    ctx.restore();
  },
};
