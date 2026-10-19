// vehicle-fx/propeller-spin — pervane dönüşü: sürekli dönen 3 kanat, hayalet kanatlarla motion blur.
// NOT: canvas y-aşağıdır; göbek (0,0), dönüş düzlemi ekran düzlemindedir.
export default {
  name: 'propeller-spin',
  category: 'vehicle-fx',
  desc: 'Pervane dönüşü: sürekli dönen 3 kanat; hayalet kanatlar ve bulanık disk motion blur verir',
  tags: ['pervane', 'dönüş', 'helikopter', 'uçak', 'motor', 'hız', 'propeller', 'spin', 'rotation', 'helicopter', 'plane', 'blur'],
  box: [-172, -172, 172, 172],
  bleed: 24,
  anchor: 'göbek (0,0): pervanenin dönme merkezi',
  points: { hub: [0, 0], top: [0, -150] },
  params: {
    speed: { type: 'number', default: 3, desc: 'dönüş hızı (saniyede tur)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const R = 150;                                   // kanat boyu
    const spd = k.clamp(p.speed, 0, 12);
    const A = t * spd * k.TAU;                       // o anki açı (sürekli dönüş — canlı idle)

    // 1) bulanık disk: hız hissi
    ctx.fillStyle = k.rgba(p.color, 0.07);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();

    // 2) kanat çizici (döndürülmüş çerçevede)
    const blade = (angle, alpha, tipCol) => {
      ctx.save();
      ctx.rotate(angle);
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.strokeStyle = k.rgba('bg', 0.55);
      ctx.lineWidth = 5;
      k.rrect(24, -16, R - 52, 32, 15);
      ctx.fill(); ctx.stroke();
      // kanat ucu vurgu bandı
      ctx.fillStyle = k.rgba(tipCol, alpha);
      k.rrect(R - 52, -16, 28, 32, 13);
      ctx.fill();
      // sol üst parlama (premium finish)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(60, -8, 30, 7, -0.15, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    // 3) hayalet kanatlar: geriden gelen 3 katman (motion blur)
    for (let g = 3; g >= 1; g--) {
      const lag = g * 0.14 * Math.min(spd / 3, 1.4);
      for (let b = 0; b < 3; b++) {
        blade(A - lag + (b * k.TAU) / 3, 0.16 / g, 'yellow');
      }
    }
    // 4) asıl 3 kanat
    for (let b = 0; b < 3; b++) {
      blade(A + (b * k.TAU) / 3, 0.95, 'yellow');
    }

    // 5) göbek: kapak + somun
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, k.TAU); ctx.fill();
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-9, -12, 13, 8, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
