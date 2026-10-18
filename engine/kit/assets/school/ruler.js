// school/ruler — ölçüm cetveli; snap anında bükülüp titreyerek düzelir
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) cetvel merkezidir.
export default {
  name: 'ruler', category: 'school',
  desc: 'Santim çizgili ahşap cetvel; snap anında bükülüp titreyerek eski haline döner',
  tags: ['cetvel', 'ölçü', 'ruler', 'measure', 'okul', 'school', 'matematik'],
  box: [-145, -55, 145, 55],
  bleed: 45,
  anchor: 'cetvel merkezi (0,0)',
  points: { left: [-130, 0], right: [130, 0] },
  params: {
    snap: { type: 'time', default: null, desc: 'bükülme anı (cetvel esneyip titrer, ~0.7 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const L = 130, H = 22; // yarı uzunluk / yarı yükseklik
    const d = p.snap == null ? -1 : t - p.snap;

    // bükülme eğrisi: önce aşağı basılır, sonra sönümlü titreşim
    const bendAt = (q) => {
      if (q < 0) return 0;
      if (q < 0.22) return 26 * (q / 0.22);
      const dq = q - 0.22;
      return Math.sin(dq * 46) * 12 * Math.exp(-dq * 7);
    };
    const bend = bendAt(d < 0 ? -1 : d / 0.7);
    // cetvel boyunca y ofseti (ortada maksimum)
    const off = (x) => bend * Math.sin(Math.PI * (x + L) / (2 * L));

    const sway = d < 0 ? Math.sin(t * 1.6) * 0.03 : 0; // idle salınım

    ctx.save();
    ctx.rotate(-0.10 + sway);

    // gövde: eğriye uyan yol (üst kenar → alt kenar)
    const edge = (top) => {
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const x = -L + (2 * L * i) / 24;
        pts.push([x, (top ? -H : H) + off(x)]);
      }
      return pts;
    };
    const drawShape = (grow, style) => {
      ctx.fillStyle = style;
      ctx.beginPath();
      const top = edge(true), bot = edge(false);
      ctx.moveTo(top[0][0] - grow, top[0][1] - grow);
      for (const q of top) ctx.lineTo(q[0], q[1] - grow);
      for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1] + grow);
      ctx.closePath(); ctx.fill();
    };
    drawShape(LW / 2, line);
    drawShape(0, k.rgba(p.color));
    // alt gölge + üst parlama
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    const bot = edge(false);
    ctx.moveTo(bot[0][0], bot[0][1] - 12);
    for (const q of bot) ctx.lineTo(q[0], q[1] - 12);
    for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    const top = edge(true);
    ctx.moveTo(top[0][0], top[0][1]);
    for (const q of top) ctx.lineTo(q[0], q[1]);
    for (let i = top.length - 1; i >= 0; i--) ctx.lineTo(top[i][0], top[i][1] + 8);
    ctx.closePath(); ctx.fill();

    // santim çizgileri (eğriyi takip eder)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineCap = 'round';
    for (let i = 0; i <= 20; i++) {
      const x = -L + 8 + ((2 * L - 16) * i) / 20;
      const len = i % 5 === 0 ? 20 : (i % 2 === 0 ? 13 : 8);
      ctx.lineWidth = i % 5 === 0 ? 4 : 3;
      ctx.beginPath();
      ctx.moveTo(x, -H + off(x) + 3);
      ctx.lineTo(x, -H + off(x) + 3 + len);
      ctx.stroke();
    }

    // asma deliği (sol uç)
    const hx = -L + 14, hy = off(hx);
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); ctx.arc(hx, hy, 7, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hx, hy, 7, 0, k.TAU); ctx.stroke();

    ctx.restore();
  },
};
