// wind-fx/flag-flap — rüzgarda dalgalanan bayrak: sürekli dalga + gust anında büyüyen genlik.
// NOT: canvas y-aşağıdır; direk x=0'dadır; (0,0) direk tabanıdır.
export default {
  name: 'flag-flap', category: 'wind-fx',
  desc: 'Rüzgarda dalgalanan bayrak: sürekli kumaş dalgası, gust anında genliği büyüyüp sertçe çırpınır',
  tags: ['bayrak', 'dalga', 'rüzgar', 'direk', 'çırpınma', 'flag', 'wave', 'wind', 'pole', 'flap'],
  box: [-45, -155, 235, 135],
  bleed: 30,
  anchor: 'direk tabanı (0,0)',
  points: { poletop: [0, -128], flagtip: [215, -80] },
  params: {
    gust: { type: 'time', default: null, desc: 'kuvvetli esinti anı (1.0 sn: dalga genliği büyür, bayrak gerilip çırpınır)' },
    color: { type: 'color', default: 'red' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: bayrak büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.gust == null ? -1 : t - p.gust;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();
    ctx.lineCap = 'round';

    // --- gust zarfı (0.2 sn atak, 0.8 sn sönüm) ---
    let env = 0;
    if (d >= 0) env = Math.min(k.prog(d, 0, 0.2), 1 - k.prog(d, 0.2, 1.0));

    const L = 205 * S;                 // kumaş boyu
    const topY = -122 * S, halfH = 38 * S;
    const amp = (12 + 26 * env) * S;   // dalga genliği (ucu doğru büyür)
    const spd = 6 + 9 * env;           // dalga hızı
    const waveY = (x) => amp * (x / L) * Math.sin(x * 0.045 - t * spd)
      + (d >= 0 && d < 1.0 ? 8 * S * (x / L) * Math.sin(x * 0.13 - t * 22) * (1 - k.prog(d, 0, 1.0)) : 0);

    // --- direk ---
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-7 * S, -135 * S, 14 * S, 255 * S, 7 * S);
    ctx.fill();
    // direk parlaması (sol üst)
    ctx.fillStyle = k.rgba('bg', 0.10);
    k.rrect(-5 * S, -130 * S, 4 * S, 245 * S, 2 * S);
    ctx.fill();
    // --- tepe topu ---
    ctx.fillStyle = k.rgba('ink', 0.95);
    ctx.beginPath(); ctx.arc(0, -140 * S, 9 * S, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(-3 * S, -143 * S, 3.5 * S, 0, k.TAU); ctx.fill();
    // --- taban ---
    ctx.fillStyle = k.rgba('dim', 0.9);
    k.rrect(-22 * S, 112 * S, 44 * S, 12 * S, 6 * S);
    ctx.fill();

    // --- bayrak kumaşı (dalgalı şerit) ---
    const N = 24;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const x = 6 * S + (i / N) * L;
      const y = topY + waveY(x - 6 * S);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = N; i >= 0; i--) {
      const x = 6 * S + (i / N) * L;
      const y = topY + halfH * 2 + waveY(x - 6 * S);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    // dış hat
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5 * S;
    ctx.stroke();
    // kumaş
    ctx.fillStyle = k.rgba(p.color, 0.92);
    ctx.fill();
    // sağ alt gölge (alt kenar boyunca)
    ctx.save();
    ctx.clip();
    ctx.fillStyle = k.rgba(p.color, 0.14);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const x = 6 * S + (i / N) * L;
      const y = topY + halfH * 2 + waveY(x - 6 * S) - 10 * S;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = N; i >= 0; i--) {
      const x = 6 * S + (i / N) * L;
      const y = topY + halfH * 2 + waveY(x - 6 * S);
      ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    // sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const x = 6 * S + (i / N) * L;
      const y = topY + waveY(x - 6 * S) + 16 * S;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = N; i >= 0; i--) {
      const x = 6 * S + (i / N) * L;
      const y = topY + waveY(x - 6 * S);
      ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // --- kumaş kıvrım çizgileri (ink, alfa 0.35) ---
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 2.5 * S;
    for (let i = 1; i <= 3; i++) {
      const x = 6 * S + (i / 4) * L;
      ctx.beginPath();
      ctx.moveTo(x, topY + waveY(x - 6 * S) + 4 * S);
      ctx.quadraticCurveTo(x + 10 * S, topY + halfH + waveY(x - 6 * S), x, topY + halfH * 2 + waveY(x - 6 * S) - 4 * S);
      ctx.stroke();
    }

    ctx.restore();
  },
};
