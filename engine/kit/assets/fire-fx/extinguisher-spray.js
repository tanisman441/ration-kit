// fire-fx/extinguisher-spray — söndürücü püskürtme: nozuldan yayılan sis konisi, alevler sönümlenir.
// NOT: canvas y-aşağıdır; (0,0) nozulun ucudur; püskürtü sağa doğrudur.
export default {
  name: 'extinguisher-spray',
  category: 'fire-fx',
  desc: 'Söndürücü püskürtme: nozuldan yayılan sis konisi, hedefteki alevler sönümlenir',
  tags: ['söndürücü', 'püskürtme', 'sis', 'söndürme', 'yangın', 'extinguisher', 'spray', 'mist', 'fire', 'foam'],
  box: [-90, -110, 230, 90],
  bleed: 45,
  anchor: 'nozul ucu (0,0)',
  points: { nozzle: [0, 0], flame: [170, -30] },
  params: {
    spray: { type: 'number', default: 0.8, desc: '0–1: püskürtme şiddeti (sis yoğunluğu + söndürme)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: sahne büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const P = k.clamp(p.spray, 0, 1);
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- nozul: küçük gövde + ağız ---
    ctx.fillStyle = k.rgba('dim', 0.12);
    ctx.beginPath(); k.rrect(-56, -20, 60, 40, 10); ctx.fill(); // sağ alt gölge
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-58, -22, 60, 40, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5 * S;
    ctx.beginPath(); k.rrect(-58, -22, 60, 40, 10); ctx.stroke();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-40, -13, 15, 6, -0.4, 0, k.TAU); ctx.fill();
    // tetik
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); k.rrect(-52, 16, 26, 12, 5); ctx.fill();

    // --- tetik öncesi nabız: ağızda hafif basınç parıltısı ---
    const tremble = k.noise1(t * 14) * 1.6 * S * P;
    if (P > 0.02) {
      k.glow(4, 0 + tremble, 18 * S, k.col('cyan'), 0.25 * P);
    }

    // --- sis konisi: nozuldan sağa genişleyen 170 damla ---
    if (P > 0.02) {
      const N = 170;
      for (let i = 0; i < N; i++) {
        const h1 = k.hash(i * 7 + 101), h2 = k.hash(i * 13 + 103), h3 = k.hash(i * 29 + 107);
        const cyc = 0.9 + h3 * 0.7;
        const ph = ((t / cyc) + h1) % 1;                       // 0 = ağız, 1 = uzak uç
        const dx = ph * 200 * S;
        const spread = 10 + ph * 56 * S;                        // koni genişlemesi
        const dy = (h2 - 0.5) * 2 * spread + tremble * ph;
        const fade = (1 - ph) * P;
        const sz = (2.2 + 4.6 * h3) * S * (0.5 + ph * 1.0);
        const col = h1 > 0.6 ? 'cyan' : 'bg';
        ctx.fillStyle = k.rgba(col, 0.75 * fade);
        ctx.beginPath(); ctx.arc(6 + dx, dy - 14 * S, sz, 0, k.TAU); ctx.fill();
      }
      // koni tabanı: ağızda yoğun çekirdek (iki katman)
      ctx.fillStyle = k.rgba('cyan', 0.3 * P);
      ctx.beginPath();
      ctx.moveTo(4, -14 * S + tremble);
      ctx.lineTo(96 * S, -14 * S - 34 * S + tremble);
      ctx.lineTo(96 * S, -14 * S + 34 * S + tremble);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.35 * P);
      ctx.beginPath();
      ctx.moveTo(4, -14 * S + tremble);
      ctx.lineTo(60 * S, -14 * S - 18 * S + tremble);
      ctx.lineTo(60 * S, -14 * S + 18 * S + tremble);
      ctx.closePath(); ctx.fill();
    }

    // --- hedef alev: spray arttıkça küçülür, sönümlenir, duman çıkarır ---
    const douse = k.prog(P, 0, 1);          // 0 = harıl yanar, 1 = söndü
    const fl = 1 - douse;
    const fx = 170 * S;
    if (fl > 0.02) {
      const flick = 1 + 0.18 * k.noise1(t * 11);
      const fh = (72 * fl + 8) * S * flick;
      const fw = (34 * fl + 6) * S;
      ctx.fillStyle = k.rgba('red', 0.9 * fl + 0.1);
      ctx.beginPath();
      ctx.moveTo(fx - fw / 2, 30 * S);
      ctx.bezierCurveTo(fx - fw / 2 - 8 * S, 30 * S - fh * 0.4, fx - fw * 0.18 + k.noise1(t * 8 + 5) * 10 * S, 30 * S - fh * 0.7, fx + k.noise1(t * 9) * 12 * S, 30 * S - fh);
      ctx.bezierCurveTo(fx + fw * 0.2, 30 * S - fh * 0.6, fx + fw / 2 + 8 * S, 30 * S - fh * 0.3, fx + fw / 2, 30 * S);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.95 * fl);
      ctx.beginPath();
      ctx.moveTo(fx - fw * 0.25, 30 * S);
      ctx.quadraticCurveTo(fx - fw * 0.3, 30 * S - fh * 0.45, fx, 30 * S - fh * 0.6);
      ctx.quadraticCurveTo(fx + fw * 0.3, 30 * S - fh * 0.4, fx + fw * 0.25, 30 * S);
      ctx.closePath(); ctx.fill();
      k.glow(fx, 30 * S - fh * 0.4, 55 * S * fl, k.col('yellow'), 0.3 * fl);
    }
    // söndürme dumanı: spray yükseldikçe yoğunlaşan gri puflar
    for (let i = 0; i < 8; i++) {
      const h = k.hash(i * 37 + 201);
      const cyc = 3.2;
      const ph = ((t / cyc) + h) % 1;
      const px = fx + k.noise1(t * 1.2 + i * 7) * 40 * S;
      const py = 10 * S - ph * 90 * S;
      ctx.fillStyle = k.rgba('dim', 0.4 * douse * (1 - ph));
      ctx.beginPath(); ctx.arc(px, py, (12 + 26 * ph) * S, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
