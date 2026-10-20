// time-fx/timer-alarm — çalar saat; `at` anında ziller sallanır, ses halkaları yayılır.
// NOT: canvas y-aşağıdır. Saniye ibresi sürekli döner (idle); alarm 1.2 sn sürer.
export default {
  name: 'timer-alarm',
  category: 'time-fx',
  desc: 'Klasik çalar saat; at anında ziller sallanır ve ses halkaları yayılır',
  tags: ['çalar saat', 'alarm', 'zil', 'uyandırma', 'zaman', 'alarm clock', 'bell', 'time', 'wake'],
  box: [-125, -140, 125, 135],
  bleed: 55,
  anchor: 'gövde merkezi (0,10)',
  points: { face: [0, 10], bellL: [-56, -72], bellR: [56, -72] },
  params: {
    color: { type: 'color', default: 'ink' },
    time: { type: 'number', default: 7, desc: 'saat (ondalıklı, ör. 7 = 07:00)' },
    at: { type: 'time', default: null, desc: 'alarm anı: zil sallanması + halkalar (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const ringing = d >= 0 && d < 1.2;
    const env = ringing ? 1 - d / 1.2 : 0;                 // sönümlenme
    const shake = ringing ? 5 * env * k.noise1(t * 28) : 0;

    ctx.save();
    ctx.translate(shake, 0);

    // ayaklar
    ctx.fillStyle = k.rgba(p.color);
    ctx.save(); ctx.translate(-42, 82); ctx.rotate(0.35);
    ctx.beginPath(); k.rrect(-9, 0, 18, 40, 9); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(42, 82); ctx.rotate(-0.35);
    ctx.beginPath(); k.rrect(-9, 0, 18, 40, 9); ctx.fill(); ctx.restore();

    // zil tutacağı (yay)
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(0, -52, 34, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();

    // ziller: alarmda sallanır
    const bellSwing = ringing ? 0.35 * env * Math.sin(d * k.TAU * 5) : 0;
    for (const s of [-1, 1]) {
      ctx.save(); ctx.translate(s * 56, -72); ctx.rotate(s * bellSwing);
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(0, 0, 27, Math.PI, 0); ctx.fill();       // kubbe
      ctx.beginPath(); k.rrect(-33, -6, 66, 12, 6); ctx.fill();        // zil dudağı
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-9, -17, 10, 6, -0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    // tokmak: alarmda iki zil arasında vurur
    const hamA = ringing ? 0.5 * Math.sin(d * k.TAU * 5) : 0;
    ctx.save(); ctx.translate(0, -52); ctx.rotate(hamA);
    ctx.strokeStyle = inkC; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -26); ctx.stroke();
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(0, -32, 9, 0, k.TAU); ctx.fill();
    ctx.restore();

    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 10, 86, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 10, 80, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -34, 44, 24, -0.5, 0, k.TAU); ctx.fill();

    // kadran
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.arc(0, 10, 62, 0, k.TAU); ctx.fill();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * k.TAU - Math.PI / 2;
      const q = i % 3 === 0;
      ctx.strokeStyle = inkC; ctx.lineWidth = q ? 6 : 3.5;
      ctx.beginPath();
      ctx.moveTo(10 + Math.cos(a) * (q ? 44 : 48), 10 + Math.sin(a) * (q ? 44 : 48));
      ctx.lineTo(10 + Math.cos(a) * 54, 10 + Math.sin(a) * 54);
      ctx.stroke();
    }
    // ibreler (p.time)
    const hr = (((p.time % 12) + 12) % 12) / 12 * k.TAU - Math.PI / 2;
    const mn = (((p.time * 60) % 60) + 60) % 60 / 60 * k.TAU - Math.PI / 2;
    const hand = (a, len, w, c) => {
      ctx.strokeStyle = k.rgba(c); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(0, 10);
      ctx.lineTo(Math.cos(a) * len, 10 + Math.sin(a) * len); ctx.stroke();
    };
    hand(hr, 30, 9, p.color);
    hand(mn, 44, 6, p.color);
    // saniye ibresi: sürekli döner (idle)
    const secA = (t / 60) * k.TAU - Math.PI / 2;
    hand(secA, 48, 3.5, 'red');
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(0, 10, 7, 0, k.TAU); ctx.fill();

    ctx.restore();

    // ses halkaları: gövdeden yayılır (alarm boyunca)
    if (ringing) {
      for (let i = 0; i < 3; i++) {
        const ph = ((d * 1.6 + i / 3) % 1);
        const rr = 95 + ph * 120;
        ctx.strokeStyle = k.rgba('red', 0.65 * (1 - ph) * env);
        ctx.lineWidth = 7 * (1 - ph) + 2;
        ctx.beginPath(); ctx.arc(0, 10, rr, 0, k.TAU); ctx.stroke();
      }
      k.glow(0, -60, 90 * env, 'red', 0.25 * env);
    }
    void line;
  },
};
