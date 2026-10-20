// door-fx/bell-ding — kapı zili: at anında zil butonu basılır, 0.3-0.6 sn yayılan
// ses halkaları çıkar; boşta butonda hafif parlama nabzı.
// NOT: canvas y-aşağıdır; taban (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'bell-ding',
  category: 'door-fx',
  desc: 'Kapı zili: buton basılır, ses halkaları yayılır, butonda parlama nabzı',
  tags: ['zil', 'kapı', 'buton', 'ding', 'ses', 'halka', 'ziyaretçi', 'doorbell', 'bell', 'ding', 'chime', 'ring'],
  box: [-160, -170, 160, 20],
  bleed: 70,
  anchor: 'taban (0,0): duvar panelinin alt merkezi',
  points: { button: [0, -100] },
  params: {
    at: { type: 'time', default: null, desc: 'zile basılma anı (buton çöker, 3 ses halkası yayılır)' },
    color: { type: 'color', default: 'panel2', desc: 'zil paneli rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const dark = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const shine = (x, y, rx, ry, a = 0.10, rot = -0.4) => {
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, k.TAU); ctx.fill();
    };
    const d = p.at == null ? -1 : t - p.at;

    // ---- 1) duvar levhası + zil paneli ----
    ctx.fillStyle = dark('dim'); ctx.beginPath(); k.rrect(-145, -153, 300, 170, 18); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-150, -160, 300, 170, 18); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(-150, -160, 300, 170, 18); ctx.fill();
    ctx.fillStyle = dark(p.color); ctx.beginPath(); k.rrect(-65, -143, 140, 100, 14); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-70, -150, 140, 100, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); k.rrect(-70, -150, 140, 100, 14); ctx.fill();
    shine(-38, -132, 24, 10);
    // vida noktaları
    ctx.fillStyle = inkC;
    for (const [sx, sy] of [[-56, -136], [56, -136], [-56, -64], [56, -64]]) {
      ctx.beginPath(); ctx.arc(sx, sy, 4, 0, k.TAU); ctx.fill();
    }

    // ---- 2) buton: basılınca çöker ----
    const bx = 0, by = -100;
    let press = 0;
    if (d >= 0 && d < 0.3) press = Math.sin(Math.min(d / 0.3, 1) * Math.PI);
    const py = by + press * 7, pr = 26 * (1 - press * 0.12);
    ctx.fillStyle = dark('dim'); ctx.beginPath(); ctx.arc(bx + 3, by + 5, 32, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(bx, by, 32, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); ctx.arc(bx, by, 32, 0, k.TAU); ctx.fill();
    ctx.fillStyle = dark('accent'); ctx.beginPath(); ctx.arc(bx + 2, py + 3, pr, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('accent'); ctx.beginPath(); ctx.arc(bx, py, pr, 0, k.TAU); ctx.fill();
    // idle: butonda hafif parlama nabzı
    shine(bx - 8, py - 10, 10, 6, 0.10 + 0.05 * Math.sin(t * 2));
    if (d >= 0 && d < 0.15) k.glow(bx, py, 40 * (1 - d / 0.15), 'yellow', 0.45 * (1 - d / 0.15));

    // ---- 3) ses halkaları: iki yana yayılan yaylar ----
    if (d >= 0) {
      for (let i = 0; i < 3; i++) {
        const di = d - i * 0.15;
        if (di < 0 || di > 0.6) continue;
        const g = di / 0.6;
        const r = 46 + di * 230;
        ctx.strokeStyle = k.rgba('accent', 0.55 * (1 - g));
        ctx.lineWidth = 5 * (1 - g) + 2;
        ctx.beginPath(); ctx.arc(bx, by, r, -1.15, 1.15); ctx.stroke();   // sağ yay
        ctx.beginPath(); ctx.arc(bx, by, r, Math.PI - 1.15, Math.PI + 1.15); ctx.stroke(); // sol yay
      }
    }
  },
};
