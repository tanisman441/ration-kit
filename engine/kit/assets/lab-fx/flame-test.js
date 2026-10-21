// lab-fx/flame-test — bunsen beki: ayaklı cam gövde, üstten gaz hortumu,
// ignite anında tutuşan alev. Tutuşmadan önce uçta gaz titremesi (idle);
// alev yanınca iç mavi koni + dış sarı dil, sürekli titreşen canlı alev.
// NOT: canvas y-aşağıdır; (0,0) bekin ayak tabanındadır.
export default {
  name: 'flame-test', category: 'lab-fx',
  desc: 'Bunsen beki: tutuşma anında beliren, titreyen laboratuvar alevi',
  tags: ['bunsen', 'alev', 'ateş', 'tutuşma', 'deney', 'flame', 'fire', 'burner', 'ignite', 'lab'],
  box: [-75, -200, 75, 12],
  bleed: 45,
  anchor: 'ayak tabanı (0,0)',
  points: { nozzle: [0, -118], base: [0, 0], hose: [-64, -30] },
  params: {
    ignite: { type: 'time', default: null, desc: 'tutuşma anı (alev 0.3 sn içinde belirir, sonra titreyerek yanar)' },
    color: { type: 'color', default: 'accent', desc: 'alev test rengi (element rengi)' },
  },
  draw(ctx, t, p, k) {
    const d = p.ignite == null ? -1 : t - p.ignite;
    const lit = d >= 0;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // ölçü
    const footY = 0, bodyW = 13, bodyTop = -112, bodyBot = -22;

    // ayak — üçgen kaide
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath();
    ctx.moveTo(-30, footY); ctx.lineTo(30, footY); ctx.lineTo(8, footY - 16);
    ctx.lineTo(-8, footY - 16); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-30, footY); ctx.lineTo(30, footY); ctx.lineTo(8, footY - 16);
    ctx.lineTo(-8, footY - 16); ctx.closePath(); ctx.stroke();
    // ayak sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath();
    ctx.moveTo(8, footY - 16); ctx.lineTo(30, footY); ctx.lineTo(14, footY); ctx.lineTo(2, footY - 14);
    ctx.closePath(); ctx.fill();

    // boru gövde
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); k.rrect(-bodyW, bodyTop, bodyW * 2, bodyBot - bodyTop, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 4.5;
    ctx.beginPath(); k.rrect(-bodyW, bodyTop, bodyW * 2, bodyBot - bodyTop, 6); ctx.stroke();
    // hava deliği bandı
    ctx.fillStyle = k.rgba('ink', 0.55);
    ctx.beginPath(); k.rrect(-bodyW - 2, -58, (bodyW + 2) * 2, 14, 7); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-bodyW - 2, -51); ctx.lineTo(bodyW + 2, -51); ctx.stroke();
    // boru parlaması (sol üst premium)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-6.5, -84, 3.5, 16, 0.12, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.strokeStyle = k.rgba('ink', 0.12);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(bodyW - 2, bodyTop + 12); ctx.lineTo(bodyW - 2, bodyBot - 12); ctx.stroke();

    // ağızlık — üst yaka
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); k.rrect(-bodyW - 4, bodyTop - 10, (bodyW + 4) * 2, 16, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 3.5;
    ctx.beginPath(); k.rrect(-bodyW - 4, bodyTop - 10, (bodyW + 4) * 2, 16, 6); ctx.stroke();

    // gaz hortumu — sol alta kıvrılan serbest çizgi (ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.65);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-10, -38);
    ctx.bezierCurveTo(-40, -30, -52, -44, -58, -70);
    ctx.stroke();

    const flick = (x, seed) => k.noise1(seed + t * 11) * 6 + k.noise1(seed * 2 + t * 23) * 3;

    // tutuşmadan önce: uçta gaz titremesi (idle — 3 sn döngü)
    if (!lit) {
      const c = (t / 3) % 1;
      const al = 0.25 + 0.35 * Math.sin(c * k.TAU);
      ctx.strokeStyle = k.rgba('dim', Math.max(al, 0.08));
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const yy = bodyTop - 12 - i * 14 - c * 8;
        ctx.beginPath();
        ctx.moveTo(flick(i, i * 7) * 0.4, yy + 8);
        ctx.quadraticCurveTo(flick(i, i * 7), yy + 4, flick(i, i * 7 + 3) * 0.6, yy);
        ctx.stroke();
      }
    }

    // alev — tutuşma pop'u (0.3 sn) sonra canlı titreşim
    if (lit) {
      const pop = k.prog(d, 0, 0.3);              // büyüme eğrisi
      const grow = 0.2 + 0.8 * k.E.outBack(pop);
      const fh = (64 + flick(0, 101)) * grow;      // alev boyu
      const fx = bodyTop - 14;

      // ısı halesi
      k.glow(0, fx - fh * 0.45, 46 * grow, 'yellow', 0.35);
      k.glow(0, fx - fh * 0.3, 26 * grow, acc, 0.4);

      // dış dil — sarı
      ctx.fillStyle = k.rgba('yellow', 0.9);
      ctx.beginPath();
      ctx.moveTo(-13 * grow, fx);
      ctx.quadraticCurveTo(-15 * grow, fx - fh * 0.55, flick(0, 103) * 0.8, fx - fh);
      ctx.quadraticCurveTo(15 * grow, fx - fh * 0.55, 13 * grow, fx);
      ctx.closePath(); ctx.fill();
      // iç koni — alev test rengi
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath();
      ctx.moveTo(-8 * grow, fx);
      ctx.quadraticCurveTo(-9 * grow, fx - fh * 0.4, flick(0, 107) * 0.5, fx - fh * 0.55);
      ctx.quadraticCurveTo(9 * grow, fx - fh * 0.4, 8 * grow, fx);
      ctx.closePath(); ctx.fill();
      // çekirdek — beyaz-sarı
      ctx.fillStyle = k.rgba('yellow', 0.55);
      ctx.beginPath();
      ctx.moveTo(-4 * grow, fx);
      ctx.quadraticCurveTo(-5 * grow, fx - fh * 0.22, 0, fx - fh * 0.3);
      ctx.quadraticCurveTo(5 * grow, fx - fh * 0.22, 4 * grow, fx);
      ctx.closePath(); ctx.fill();
      // üst parlama (alev sol üst parlaması)
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.ellipse(-5 * grow, fx - fh * 0.5, 2.6, 5.5, -0.15, 0, k.TAU); ctx.fill();

      // kıvılcımlar — alevin tepesinden uçuşan tanecikler
      for (let i = 0; i < 6; i++) {
        const c = (t * (0.6 + k.hash(i * 3 + 1) * 0.8) + k.hash(i * 5 + 2)) % 1;
        const sx = (k.hash(i * 7 + 3) - 0.5) * 24 + k.noise1(i * 11 + t * 6) * 8;
        const sy = fx - fh * 0.7 - c * 40;
        const al = (1 - c) * pop;
        if (al <= 0.02) continue;
        k.glow(sx, sy, 6, 'yellow', 0.5 * al);
        ctx.fillStyle = k.rgba('yellow', 0.95 * al);
        ctx.beginPath(); ctx.arc(sx, sy, 2.4 * (1 - c * 0.5), 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
