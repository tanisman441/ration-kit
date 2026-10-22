// circus-fx/clown-balloon — palyaço ve ipte sallanan balonu.
// pop anından 0.15 sn önce balon şişer, pop anında patlar (0.5 sn yıldız
// parçacıkları), sonra ip sallanmaya devam eder; palyaço şaşırır.
// NOT: canvas y-aşağıdır; (0,0) palyaçonun ayaklarıdır.
export default {
  name: 'clown-balloon', category: 'circus-fx',
  desc: 'Balon tutan palyaço: pop anında balon patlar, parçacıklar saçılır',
  tags: ['palyaço', 'balon', 'patlama', 'sirk', 'clown', 'balloon', 'pop', 'circus', 'party'],
  box: [-160, -345, 160, 45],
  bleed: 45,
  anchor: 'palyaçonun ayakları (0,0)',
  points: { hand: [58, -168], balloon: [20, -268], head: [0, -148], nose: [0, -148] },
  params: {
    pop: { type: 'time', default: null, desc: 'patlama anı (öncesi 0.15 sn şişme, 0.5 sn parçacık)' },
    color: { type: 'color', default: 'red', desc: 'balon + burun rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const pd = p.pop == null ? -1 : t - p.pop;
    const popped = pd >= 0;
    // şişme: pop öncesi 0.15 sn büyür
    let inflate = 1;
    if (!popped && pd >= -0.15 && p.pop != null) inflate = 1 + (1 - (pd + 0.15) / 0.15) * 0.28;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 6, 58, 11, 0, 0, k.TAU); ctx.fill();

    const br = Math.sin(t * k.TAU / 2.4) * 2;      // nefes
    const blink = (t % 4.6) < 0.12;

    // bacaklar + ayakkabılar
    ctx.strokeStyle = k.rgba('dim', 0.9); ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-13, -95); ctx.lineTo(-16, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(13, -95); ctx.lineTo(16, 0); ctx.stroke();
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.ellipse(-22, -2, 20, 9, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(22, -2, 20, 9, 0, 0, k.TAU); ctx.fill();

    // gövde
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-26, -188 + br * 0.4, 52, 96, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-26, -188 + br * 0.4, 52, 96, 16); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-11, -170, 11, 20, -0.35, 0, k.TAU); ctx.fill();
    // düğmeler
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.arc(0, -160 + br * 0.4, 6, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -132 + br * 0.4, 6, 0, k.TAU); ctx.fill();

    // sol kol aşağı, sağ kol balon ipini tutar
    ctx.strokeStyle = k.rgba('dim', 0.9); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-20, -165); ctx.lineTo(-42, -110); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, -165 + br * 0.4); ctx.quadraticCurveTo(48, -150, 58, -168); ctx.stroke();

    // kafa: palyaço yüzü (pop sonrası şaşkın)
    const hy = -216 + br * 0.6;
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); ctx.arc(0, hy, 30, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, hy, 30, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, hy - 10, 9, 6.5, -0.5, 0, k.TAU); ctx.fill();
    // burun: kırmızı top
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath(); ctx.arc(0, hy, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-3, hy - 3, 3, 2, -0.5, 0, k.TAU); ctx.fill();
    // gözler + ağız
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    if (blink) {
      ctx.beginPath(); ctx.moveTo(-16, hy - 10); ctx.lineTo(-8, hy - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8, hy - 10); ctx.lineTo(16, hy - 10); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(-12, hy - 10, 3.2, 0, k.TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(12, hy - 10, 3.2, 0, k.TAU); ctx.stroke();
    }
    if (popped && pd < 1.2) {
      ctx.beginPath(); ctx.arc(0, hy + 16, 7, 0, k.TAU); ctx.stroke();  // O ağız
    } else {
      ctx.beginPath(); ctx.arc(0, hy + 8, 11, 0.3, Math.PI - 0.3); ctx.stroke();
    }

    // balon: salınım idle (patlamadan önce)
    const sway = Math.sin(t * k.TAU / 3.1) * 14;
    const bx = 20 + sway * 0.6, by = -268 + Math.sin(t * k.TAU / 3.1 + 1) * 7;
    if (!popped) {
      // ip (ince, ink rengi)
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(58, -168);
      ctx.quadraticCurveTo(58 + sway * 0.3, -218, bx, by + 55 * inflate); ctx.stroke();
      // balon gövdesi
      const bwr = 44 * inflate, bhr = 54 * inflate;
      ctx.fillStyle = k.rgba(acc, 0.92);
      ctx.beginPath(); ctx.ellipse(bx, by, bwr, bhr, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.ellipse(bx, by, bwr, bhr, 0, 0, k.TAU); ctx.stroke();
      // parlama: şişerken gerilir (alfa artar)
      ctx.fillStyle = 'rgba(255,255,255,' + (inflate > 1.01 ? 0.22 : 0.10) + ')';
      ctx.beginPath(); ctx.ellipse(bx - bwr * 0.36, by - bhr * 0.34, bwr * 0.22, bhr * 0.3, -0.4, 0, k.TAU); ctx.fill();
      // düğüm
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath(); ctx.moveTo(bx - 7, by + bhr - 2); ctx.lineTo(bx + 7, by + bhr - 2); ctx.lineTo(bx, by + bhr + 9); ctx.closePath(); ctx.fill();
    } else {
      // patlama: 0.5 sn yıldız parçacıklar
      if (pd < 0.5) {
        const pr = pd / 0.5;
        for (let i = 0; i < 10; i++) {
          const a = i * k.TAU / 10 + k.hash(i) * 0.5;
          const d = 20 + pr * (60 + k.hash(i * 7) * 40);
          const sx = bx + Math.cos(a) * d, sy = by + Math.sin(a) * d;
          ctx.strokeStyle = k.rgba(acc, (1 - pr) * 0.9); ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(sx - 7 * (1 - pr * 0.5), sy); ctx.lineTo(sx + 7 * (1 - pr * 0.5), sy);
          ctx.moveTo(sx, sy - 7 * (1 - pr * 0.5)); ctx.lineTo(sx, sy + 7 * (1 - pr * 0.5));
          ctx.stroke();
        }
        k.glow(bx, by, 90 * (1 - pr * 0.6), acc, 0.3 * (1 - pr));
      }
      // ip serbest sallanır
      const fx = Math.sin(t * 9) * 10 * Math.exp(-pd * 1.5);
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(58, -168);
      ctx.quadraticCurveTo(58 + 8 + fx, -130, 58 + 14 + fx * 1.6, -105); ctx.stroke();
    }

    ctx.restore();
  },
};
