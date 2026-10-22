// camping-fx/owl-hoot — dalda baykuş: at anında öter (gaga açılır, ses dalgaları yayılır), boşta göz kırpar.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'owl-hoot',
  category: 'camping-fx',
  desc: 'Dalda baykuş: at anında öter (gaga açılır, ses dalgaları), boşta göz kırpıp nefes alır',
  tags: ['baykuş', 'kuş', 'gece', 'ötme', 'dal', 'kamp', 'owl', 'bird', 'hoot', 'night', 'perch'],
  box: [-110, -120, 110, 70],
  bleed: 60,
  anchor: 'gövde merkezi (0,0)',
  points: { head: [0, -56], beak: [0, -19], perch: [0, 36] },
  params: {
    at: { type: 'time', default: null, desc: 'ötme anı (0.85 sn: gaga açılır, 3 ses dalgası yayılır)' },
    color: { type: 'color', default: 'panel2', desc: 'tüy tonu' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: baykuş büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.size, 0.5, 1.5);
    const d = p.at == null ? -1 : t - p.at;
    const hoot = d < 0 ? 0 : Math.sin(Math.PI * k.prog(d, 0, 0.85));
    const fc = p.color;
    ctx.save();

    // --- dal (sabit) ---
    ctx.fillStyle = k.rgba('dim', 0.12);
    ctx.beginPath(); k.rrect(-72 * S + 5 * S, 28 * S + 6 * S, 144 * S, 16 * S, 8 * S); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-72 * S, 28 * S, 144 * S, 16 * S, 8 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4 * S;
    ctx.beginPath(); k.rrect(-72 * S, 28 * S, 144 * S, 16 * S, 8 * S); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-40 * S, 32 * S, 26 * S, 4 * S, 0, 0, k.TAU); ctx.fill();

    // --- baykuş gövdesi (ötmede hafifçe öne eğilir, boşta nefes alır) ---
    const breathe = 1.5 * S * Math.sin(t * 2.3);
    ctx.save();
    ctx.translate(0, -5 * S * hoot + breathe);

    // kulak püskülleri
    for (let i = 0; i < 2; i++) {
      const sgn = i === 0 ? -1 : 1;
      const twitch = 0.06 * Math.sin(t * 3.1 + i * 2.4);
      ctx.save();
      ctx.translate(sgn * 32 * S, -50 * S); ctx.rotate(sgn * 0.15 + twitch * sgn);
      ctx.fillStyle = k.rgba(fc, 1);
      ctx.beginPath();
      ctx.moveTo(-8 * S, 0); ctx.lineTo(8 * S, 0); ctx.lineTo(0, -20 * S);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5 * S; ctx.stroke();
      ctx.restore();
    }

    // gövde
    ctx.fillStyle = k.rgba('dim', 0.12);
    ctx.beginPath(); ctx.ellipse(5 * S, -8 * S + 6 * S, 44 * S, 52 * S, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(fc, 1);
    ctx.beginPath(); ctx.ellipse(0, -12 * S, 44 * S, 52 * S, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5 * S;
    ctx.beginPath(); ctx.ellipse(0, -12 * S, 44 * S, 52 * S, 0, 0, k.TAU); ctx.stroke();
    // sağ alt gölge + sol üst parlama
    ctx.fillStyle = k.rgba(fc, 0.18);
    ctx.beginPath(); ctx.ellipse(18 * S, 6 * S, 20 * S, 34 * S, 0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-16 * S, -36 * S, 18 * S, 12 * S, -0.5, 0, k.TAU); ctx.fill();
    // karın
    ctx.fillStyle = k.rgba('panel', 0.55);
    ctx.beginPath(); ctx.ellipse(0, 6 * S, 25 * S, 33 * S, 0, 0, k.TAU); ctx.fill();

    // kanatlar (ötmede hafif açılır)
    for (let i = 0; i < 2; i++) {
      const sgn = i === 0 ? -1 : 1;
      ctx.save();
      ctx.translate(sgn * 40 * S, -4 * S); ctx.rotate(sgn * (0.22 + hoot * 0.38));
      ctx.fillStyle = k.rgba('dim', 0.9);
      ctx.beginPath(); ctx.ellipse(0, 0, 10 * S, 30 * S, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5 * S;
      ctx.beginPath(); ctx.ellipse(0, 0, 10 * S, 30 * S, 0, 0, k.TAU); ctx.stroke();
      ctx.restore();
    }

    // gözler: boşta ~3.7 sn'de bir kırpılır
    const bt = t % 3.7;
    const eyeSY = bt < 0.12 ? 0.12 : 1;
    const look = 3 * S * Math.sin(t * 0.7);
    for (let i = 0; i < 2; i++) {
      const ex = i === 0 ? -18 * S : 18 * S;
      if (eyeSY < 0.5) {
        ctx.strokeStyle = k.rgba('bg', 0.8); ctx.lineWidth = 3.5 * S; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ex - 9 * S, -34 * S); ctx.lineTo(ex + 9 * S, -34 * S); ctx.stroke();
      } else {
        ctx.fillStyle = k.rgba('panel', 1);
        ctx.beginPath(); ctx.arc(ex, -34 * S, 15.5 * S, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5 * S;
        ctx.beginPath(); ctx.arc(ex, -34 * S, 15.5 * S, 0, k.TAU); ctx.stroke();
        ctx.fillStyle = k.rgba('bg', 0.9);
        ctx.beginPath(); ctx.arc(ex + look, -34 * S, 6.5 * S, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('bg', 0.35);
        ctx.beginPath(); ctx.arc(ex + look - 2 * S, -36 * S, 2.2 * S, 0, k.TAU); ctx.fill();
      }
    }

    // gaga: üst sabit, alt ötmede açılır
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath();
    ctx.moveTo(-7 * S, -27 * S); ctx.lineTo(7 * S, -27 * S); ctx.lineTo(0, -19 * S);
    ctx.closePath(); ctx.fill();
    ctx.save();
    ctx.translate(0, -19 * S); ctx.rotate(hoot * 0.7);
    ctx.fillStyle = k.rgba('yellow', 0.85);
    ctx.beginPath();
    ctx.moveTo(-6 * S, 0); ctx.lineTo(6 * S, 0); ctx.lineTo(0, 7 * S);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // ayaklar
    ctx.fillStyle = k.rgba(fc, 1);
    for (let i = 0; i < 2; i++) {
      const fx = i === 0 ? -15 * S : 15 * S;
      ctx.beginPath(); k.rrect(fx - 6 * S, 26 * S, 12 * S, 14 * S, 5 * S); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3 * S;
      ctx.beginPath(); k.rrect(fx - 6 * S, 26 * S, 12 * S, 14 * S, 5 * S); ctx.stroke();
    }
    ctx.restore();

    // --- ses dalgaları: gagadan aşağıya doğru genişleyen 3 yay ---
    if (d >= 0.05 && d < 1.15) {
      for (let i = 0; i < 3; i++) {
        const start = 0.05 + i * 0.17;
        const q = k.prog(d, start, 1.0);
        if (q <= 0 || q >= 1) continue;
        const r = (48 + 82 * q) * S;
        ctx.strokeStyle = k.rgba('ink', 0.65 * (1 - q));
        ctx.lineWidth = 4.5 * S; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, -18 * S, r, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
