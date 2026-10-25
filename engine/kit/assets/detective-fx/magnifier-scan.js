// detective-fx/magnifier-scan — büyüteç yüzeyde döngüsel tarama yapar; mercek altındaki izler büyür, parıltı gezer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) taranan yüzeyin (kâğıt kartın) merkezidir.
export default {
  name: 'magnifier-scan', category: 'detective-fx',
  desc: 'Dedektif büyüteci kâğıt üzerinde sağa sola tarar; mercek altındaki izler büyüyerek belirir, camda parıltı gezer',
  tags: ['dedektif', 'büyüteç', 'tarama', 'inceleme', 'ipucu', 'iz', 'detective', 'magnifier', 'scan', 'clue', 'inspect', 'lens'],
  box: [-140, -110, 140, 110],
  bleed: 30,
  anchor: 'taranan kâğıt kartın merkezi (0,0); büyüteç kart üzerinde gezer',
  points: { lens: [0, -10], handle: [70, 55], clue: [-45, 25] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'tarama hızı çarpanı (1 = ~3.4 sn bir gidiş-geliş)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // kâğıt kart (taranan yüzey)
    blob(-120, -85, 240, 170, 14, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -68, 30, 9, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(58, 62, 56, 12, 6); ctx.fill();

    // yüzeydeki izler: küçük noktalar + bir ayak izi yayı + parmak izi halkası
    const marks = [];
    for (let i = 0; i < 9; i++) marks.push([-95 + k.hash(i * 3 + 1) * 190, -60 + k.hash(i * 3 + 2) * 120]);
    ctx.fillStyle = k.rgba('ink', 0.5);
    for (const [mx, my] of marks) { ctx.beginPath(); ctx.arc(mx, my, 2.5, 0, k.TAU); ctx.fill(); }
    // ipucu: ayak izi (iki oval)
    ctx.fillStyle = k.rgba('ink', 0.55);
    ctx.beginPath(); ctx.ellipse(-45, 25, 9, 13, 0.25, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-38, 42, 6, 9, 0.25, 0, k.TAU); ctx.fill();
    // ipucu: parmak izi halkaları
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
    for (let r = 6; r <= 18; r += 6) { ctx.beginPath(); ctx.arc(55, -35, r, 0.4, k.TAU - 0.8); ctx.stroke(); }

    // büyüteç konumu: döngüsel tarama
    const cx = 62 * Math.sin(t * k.TAU / 3.4 * sp);
    const cy = -10 + 10 * Math.sin(t * k.TAU / 5.1 * sp + 1.2);
    const R = 46;

    // mercek altı: izler 1.6x büyümüş görünür (clip içinde)
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R - 4, 0, k.TAU); ctx.clip();
    ctx.fillStyle = k.rgba('cyan', 0.10);
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.fillStyle = k.rgba('ink', 0.85);
    for (const [mx, my] of marks) {
      const dx = cx + (mx - cx) * 1.6, dy = cy + (my - cy) * 1.6;
      if (Math.hypot(dx - cx, dy - cy) > R - 6) continue;
      ctx.beginPath(); ctx.arc(dx, dy, 4, 0, k.TAU); ctx.fill();
    }
    // büyümüş ayak izi
    ctx.fillStyle = k.rgba('ink', 0.85);
    const fx = cx + (-45 - cx) * 1.6, fy = cy + (25 - cy) * 1.6;
    if (Math.hypot(fx - cx, fy - cy) < R - 8) {
      ctx.beginPath(); ctx.ellipse(fx, fy, 13, 19, 0.25, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + (-38 - cx) * 1.6, cy + (42 - cy) * 1.6, 9, 13, 0.25, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // mercek halkası
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, k.TAU); ctx.stroke();
    // cam parıltısı: mercek sol üstünde gezen yay
    const glint = 0.5 + 0.3 * Math.sin(t * k.TAU / 1.8 * sp);
    ctx.strokeStyle = `rgba(255,255,255,${0.35 * glint + 0.15})`; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(cx, cy, R - 12, -2.6 + 0.3 * Math.sin(t * k.TAU / 2.2), -1.4); ctx.stroke();
    // mercek kenarında küçük parlama noktası
    ctx.fillStyle = `rgba(255,255,255,${0.5 * glint})`;
    ctx.beginPath(); ctx.arc(cx - R * 0.55, cy - R * 0.6, 4, 0, k.TAU); ctx.fill();

    // sap: mercekten sağ alta
    const hx = cx + R * 0.72, hy = cy + R * 0.72;
    ctx.strokeStyle = line; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 42, hy + 42); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 42, hy + 42); ctx.stroke();
    // sap ucu vurgusu
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(hx + 42, hy + 42, 5, 0, k.TAU); ctx.fill();
  },
};
