// time-fx/clock-tick — tik tak atan analog saat; `tick` anında parlama + ses dalgası.
// NOT: canvas y-aşağıdır. Saniye ibresi her saniye mekanik "tik" ile atlar (idle).
export default {
  name: 'clock-tick',
  category: 'time-fx',
  desc: 'Mekanik tik sesiyle atlayan saniye ibresli analog saat; tick anında parlama',
  tags: ['saat', 'analog', 'tik', 'zaman', 'saniye', 'clock', 'tick', 'watch', 'time'],
  box: [-120, -120, 120, 120],
  bleed: 30,
  anchor: 'kadran merkezi (0,0)',
  points: { face: [0, 0], top: [0, -100] },
  params: {
    color: { type: 'color', default: 'ink' },
    time: { type: 'number', default: 12.5, desc: 'saat (ondalıklı, ör. 12.5 = 12:30)' },
    tick: { type: 'time', default: null, desc: 'tik anı: ibre ucunda parlama + ses dalgası' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    ctx.lineCap = 'round';

    // kadran
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 106, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.arc(0, 0, 100, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, -52, 52, 26, -0.5, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(36, 54, 50, 24, -0.5, 0, k.TAU); ctx.fill();

    // 12 işaret: uzun/kalın çeyrekler
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * k.TAU - Math.PI / 2;
      const q = i % 3 === 0;
      const r1 = q ? 74 : 80, r0 = q ? 92 : 90;
      ctx.strokeStyle = inkC; ctx.lineWidth = q ? 9 : 5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.stroke();
    }

    // akrep + yelkovan (p.time saat)
    const hr = (((p.time % 12) + 12) % 12) / 12 * k.TAU - Math.PI / 2;
    const mn = (((p.time * 60) % 60) + 60) % 60 / 60 * k.TAU - Math.PI / 2;
    const hand = (a, len, w) => {
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.stroke();
    };
    hand(hr, 46, 13);
    hand(mn, 68, 9);

    // saniye ibresi: her saniye hızlı "tik" ile atlar (idle animasyon)
    const secStep = Math.floor(t);
    const secFrac = t - secStep;
    const snap = 1 - Math.pow(1 - Math.min(1, secFrac / 0.22), 3); // 0.22 sn'de yumuşak atlama
    const secA = ((secStep + snap) / 60) * k.TAU - Math.PI / 2;
    const tipX = Math.cos(secA) * 76, tipY = Math.sin(secA) * 76;
    ctx.strokeStyle = k.rgba('red'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-Math.cos(secA) * 18, -Math.sin(secA) * 18);
    ctx.lineTo(tipX, tipY); ctx.stroke();
    // merkez pimi
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.arc(-2, -3, 4, 0, k.TAU); ctx.fill();

    // tick olayı: uçta parlama + ses dalgaları (0.45 sn)
    const d = p.tick == null ? -1 : t - p.tick;
    if (d >= 0 && d < 0.45) {
      const q = d / 0.45;
      k.glow(tipX, tipY, 44 * (1 - q) + 10, 'red', 0.5 * (1 - q));
      for (let i = 0; i < 2; i++) {
        const rr = 14 + q * 60 + i * 16;
        ctx.strokeStyle = k.rgba('red', 0.7 * (1 - q) * (1 - i * 0.35));
        ctx.lineWidth = 5 - i;
        const spread = 0.7;
        ctx.beginPath(); ctx.arc(tipX, tipY, rr, secA - spread, secA + spread); ctx.stroke();
      }
    }
    void line;
  },
};
