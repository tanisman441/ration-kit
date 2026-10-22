// circus-fx/trapeze-swing — salınan trapez sanatçısı.
// Canlı idle: ~3.4 sn periyotla salınım (θ = 0.55 rad genlik); ipler
// ink rengi ince çizgiler, sanatçı barda asılı dizleri karnına çekmiş halde.
// NOT: canvas y-aşağıdır; (0,0) trapez barının merkezidir.
export default {
  name: 'trapeze-swing', category: 'circus-fx',
  desc: 'Trapezde periyodik salınım yapan sanatçı, dizler karnına çekili',
  tags: ['trapez', 'salınım', 'sirk', 'akrobat', 'trapeze', 'swing', 'circus', 'acrobat', 'hava'],
  box: [-215, -45, 215, 350],
  bleed: 20,
  anchor: 'trapez barının merkezi (0,0)',
  points: { barL: [-90, 0], barR: [90, 0], hands: [0, 170], head: [0, 205] },
  params: {
    color: { type: 'color', default: 'purple', desc: 'kostüm rengi' },
    speed: { type: 'number', default: 3.4, desc: 'salınım periyodu (sn)' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const L = 170, ropeDx = 55;
    const th = 0.55 * Math.sin(t * k.TAU / p.speed);   // canlı salınım
    ctx.save();
    ctx.lineCap = 'round';

    // bar
    ctx.fillStyle = k.rgba('ink', 0.9);
    k.rrect(-95, -8, 190, 16, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(-95, -8, 190, 16, 8); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, -4, 30, 3.5, 0, 0, k.TAU); ctx.fill();

    // ellerin konumu (bar etrafında sarkaç)
    const hxL = -ropeDx + L * Math.sin(th), hxR = ropeDx + L * Math.sin(th);
    const hy = L * Math.cos(th);

    // ipler: ince, ink rengi (serbest çizgiler)
    ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-ropeDx, 0); ctx.lineTo(hxL, hy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ropeDx, 0); ctx.lineTo(hxR, hy); ctx.stroke();

    // sanatçı: ellerin orta noktasından sarkan gövde (θ ile döner)
    const mx = (hxL + hxR) / 2;
    ctx.save();
    ctx.translate(mx, hy);
    ctx.rotate(th);

    // kollar: yukarı, elleri iplerde (dönüşle tam el konumu)
    const cl = Math.cos(th), sl = Math.sin(th);
    ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-18, 42); ctx.lineTo(-ropeDx * cl, ropeDx * sl); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18, 42); ctx.lineTo(ropeDx * cl, -ropeDx * sl); ctx.stroke();
    // gövde
    ctx.fillStyle = k.rgba(acc, 0.9);
    k.rrect(-24, 40, 48, 78, 15); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-24, 40, 48, 78, 15); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, 62, 10, 20, -0.35, 0, k.TAU); ctx.fill();

    // kafa (aşağı bakar, göz kırpar)
    const blink = (t % 3.8) < 0.12;
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); ctx.arc(0, 28, 26, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 28, 26, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-9, 19, 8, 5.5, -0.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 2.5;
    if (blink) {
      ctx.beginPath(); ctx.moveTo(-11, 32); ctx.lineTo(-4, 32); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, 32); ctx.lineTo(11, 32); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(-7.5, 32, 2.8, 0, k.TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(7.5, 32, 2.8, 0, k.TAU); ctx.stroke();
    }

    // dizler karnına çekili: uyluk yukarı, baldır aşağı katlanır
    ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-16, 114); ctx.quadraticCurveTo(-46, 128, -40, 168); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, 114); ctx.quadraticCurveTo(46, 128, 40, 168); ctx.stroke();

    ctx.restore();
    ctx.restore();
  },
};
