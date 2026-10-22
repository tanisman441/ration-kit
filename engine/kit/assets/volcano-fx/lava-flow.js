// volcano-fx/lava-flow — kaya kanalında akan lav; sürekli akış + sıcaklık nabzı.
// NOT: canvas y-aşağıdır; (0,0) = kanal merkezi; lav soldan sağa akar.
export default {
  name: 'lava-flow',
  category: 'volcano-fx',
  desc: 'Kaya kanalında akan lav nehri: hareketli parlak şeritler, döngüsel kabarcıklar ve nabız gibi atan sıcaklık ışması',
  tags: ['lav', 'akan lav', 'lava', 'flow', 'magma akışı', 'eriyik', 'nehir'],
  box: [-150, -80, 150, 80],
  bleed: 40,
  anchor: 'kanal merkezi (0,0)',
  points: { inlet: [-150, 0], outlet: [150, 0] },
  params: {
    speed: { type: 'number', default: 1, desc: 'akış hızı 0-2' },
    heat: { type: 'number', default: 1, desc: 'sıcaklık 0-1 (nabız genliği)' },
  },
  draw(ctx, t, p, k) {
    const sp = Math.max(0, p.speed), ht = k.clamp(p.heat, 0, 1);
    const heatPulse = 0.6 + 0.4 * Math.sin(t * (k.TAU / 2.2)) * ht + 0.15 * ht;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // 1) dış kaya kıyısı (üst) — dim, premium finish
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-150, -80, 300, 52, 20); ctx.fill();
    // alt kaya kıyısı
    ctx.beginPath(); k.rrect(-150, 28, 300, 52, 20); ctx.fill();
    // sol üst parlama (üst kıyıda) + sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.10);
    ctx.beginPath();
    ctx.ellipse(-105, -58, 46, 14, -0.15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath();
    ctx.ellipse(105, 62, 46, 14, 0.15, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-150, -80, 300, 52, 20); ctx.stroke();
    ctx.beginPath(); k.rrect(-150, 28, 300, 52, 20); ctx.stroke();

    // 2) lav tabanı (kırmızı zemin)
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath(); k.rrect(-150, -28, 300, 56, 8); ctx.fill();

    // 3) sıcaklık nabzı — kanal üstünde atan ışıma
    k.glow(0, 0, 190, 'red', 0.30 * heatPulse);
    k.glow(0, 0, 130, 'yellow', 0.18 * heatPulse);

    // 4) akan parlak şeritler — t ile sağa kayar (sürekli akış idle)
    for (let i = 0; i < 7; i++) {
      const lane = -20 + i * 6.7;                        // şeritlerin y konumu
      const len = 40 + k.hash(i * 3 + 1) * 70;            // şerit uzunluğu
      const span = 300 - len;                            // kanal içinde kalır
      const x = -150 + ((t * 160 * sp + k.hash(i * 5 + 2) * span) % span + span) % span;
      const wobY = lane + k.noise1(i * 9 + t * 3) * 4;
      ctx.strokeStyle = k.rgba('yellow', 0.75);
      ctx.lineWidth = 5 - i % 3;
      ctx.beginPath(); ctx.moveTo(x, wobY); ctx.lineTo(x + len, wobY); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.15);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, wobY + 4); ctx.lineTo(x + len * 0.8, wobY + 4); ctx.stroke();
    }

    // 5) kabarcıklar — döngüsel: şişer, patlar, mini sıçrama (kabarma idle)
    for (let i = 0; i < 5; i++) {
      const cyc = 1.6 + k.hash(i * 7 + 3) * 1.6;
      const ph = ((t + k.hash(i * 11 + 4) * cyc) % cyc) / cyc;   // 0..1
      const bx = -120 + k.hash(i * 13 + 5) * 240;
      const by = -14 + k.hash(i * 17 + 6) * 28;
      if (ph < 0.65) {
        const g = ph / 0.65;                                     // şişme
        ctx.fillStyle = k.rgba('red', 0.9);
        ctx.beginPath(); ctx.arc(bx, by - g * 9, (5 + g * 7), 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('yellow', 0.85);
        ctx.beginPath(); ctx.arc(bx, by - g * 9, (2 + g * 3.4), 0, k.TAU); ctx.fill();
      } else if (ph < 0.8) {
        const g = (ph - 0.65) / 0.15;                            // patlama sıçraması
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - g));
        for (let j = 0; j < 5; j++) {
          const a = -Math.PI / 2 + (j - 2) * 0.5;
          const ddx = Math.cos(a) * 14 * g, ddy = Math.sin(a) * 14 * g - g * g * 10;
          ctx.beginPath(); ctx.arc(bx + ddx, by + ddy - 6, 2.6 * (1 - g), 0, k.TAU); ctx.fill();
        }
      }
    }

    // 6) kanal üstünde yükselen ısı dalgası çizgileri (hava çizgisi, ink)
    ctx.strokeStyle = k.rgba('ink', 0.28); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const ph = (t / 2.4 + k.hash(i * 19 + 8)) % 1;
      const hx = -100 + k.hash(i * 23 + 9) * 200;
      ctx.beginPath();
      for (let j = 0; j <= 8; j++) {
        const yy = -32 - ph * 20 - j * 2;
        const xx = hx + Math.sin(j * 1.2 + t * 6 + i * 2) * 6;
        if (j === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.globalAlpha = 0.4 * (1 - ph);
      ctx.stroke(); ctx.globalAlpha = 1;
    }
  },
};
