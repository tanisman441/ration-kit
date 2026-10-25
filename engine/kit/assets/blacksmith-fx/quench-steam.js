// blacksmith-fx/quench-steam — kızgın demir su fıçısına daldırılır; `at` anında buhar bulutu yükselir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) su yüzeyi merkezi.
export default {
  name: 'quench-steam', category: 'blacksmith-fx',
  desc: 'Kızgın demir çubuk su fıçısına daldırılır; daldırma anında yoğun buhar bulutu yükselir, demir soğur',
  tags: ['demirci', 'su verme', 'buhar', 'soğutma', 'fıçı', 'quench', 'steam', 'blacksmith', 'water', 'forge'],
  box: [-120, -110, 120, 110],
  bleed: 55,
  anchor: 'su yüzeyi merkezi (0,0); fıçı tabanı y ~95',
  points: { water: [0, 0], bar: [0, -40], barrel: [0, 55] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'daldırma anı — buhar patlaması (1.4 sn), demir soğur' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const dunk = d >= 0;
    const steamT = dunk ? d : -1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // su fıçısı
    blob(-78, 0, 156, 92, 14, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-48, 16, 18, 8, 0, 0, k.TAU); ctx.fill();
    // metal çemberler
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-78, 30); ctx.lineTo(78, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-78, 70); ctx.lineTo(78, 70); ctx.stroke();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-30, 86, 108, 8, 4); ctx.fill();

    // su yüzeyi (dalgalanır; daldırma sonrası çalkalanır)
    const ripple = dunk && d < 1.2 ? Math.sin(d * 22) * 4 * (1 - d / 1.2) : Math.sin(t * 2.2) * 1.5;
    ctx.fillStyle = k.rgba('cyan', 0.85);
    ctx.beginPath();
    ctx.moveTo(-72, 2);
    for (let x = -72; x <= 72; x += 12) ctx.lineTo(x, 2 + Math.sin(x * 0.09 + t * 2.2) * 2 + ripple * Math.sin(x * 0.2));
    ctx.lineTo(72, 14); ctx.lineTo(-72, 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(-30, 6, 16, 2.5, 0, 0, k.TAU); ctx.fill();

    // demir çubuk: daldırmadan önce yukarıda kızgın, sonra suda soğur
    const barY = dunk ? k.lerp(-58, -6, 1 - Math.pow(1 - Math.min(d / 0.35, 1), 3)) : -58 + Math.sin(t * k.TAU / 2.2) * 3;
    const cool = dunk ? Math.max(0, 1 - d / 1.4) : 1;
    const hot = cool * (0.7 + 0.3 * Math.sin(t * k.TAU / 1.5));
    if (!dunk || d < 1.4) k.glow(0, barY + 8, 34, 'red', 0.35 * hot);
    ctx.save();
    ctx.translate(0, barY);
    ctx.rotate(-0.06);
    ctx.fillStyle = k.rgba('yellow', 0.25 + 0.55 * hot);
    ctx.beginPath(); k.rrect(-10, -38, 20, 76, 8); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.85 * hot + 0.1);
    ctx.beginPath(); k.rrect(-10, -38, 20, 22, 8); ctx.fill();
    // maşa ucu
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); k.rrect(-14, -52, 28, 16, 6); ctx.fill();
    ctx.restore();

    // buhar bulutu (daldırma anı, 1.4 sn yükselir)
    if (dunk && steamT < 1.5) {
      for (let i = 0; i < 9; i++) {
        const prog = k.clamp((steamT - k.hash(i) * 0.25) / 1.1, 0, 1);
        if (prog <= 0) continue;
        const px = (k.hash(i + 20) - 0.5) * (26 + prog * 62);
        const py = -8 - prog * (58 + k.hash(i + 40) * 34);
        const r = 10 + prog * 22;
        ctx.fillStyle = k.rgba('ink', 0.38 * (1 - prog * 0.6));
        ctx.beginPath(); ctx.ellipse(px, py, r, r * 0.85, 0, 0, k.TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.beginPath(); ctx.ellipse(px - r * 0.3, py - r * 0.35, r * 0.45, r * 0.35, 0, 0, k.TAU); ctx.fill();
      }
      // kabarcıklar
      for (let i = 0; i < 5; i++) {
        const prog = (steamT * 1.6 + k.hash(i + 70)) % 1;
        ctx.fillStyle = k.rgba('cyan', 0.8 * (1 - prog));
        ctx.beginPath(); ctx.ellipse(-30 + k.hash(i + 80) * 60, 8 - prog * 10, 3, 3, 0, 0, k.TAU); ctx.fill();
      }
    } else if (!dunk) {
      // daldırmadan önce hafif duman (kızgın demir)
      const cyc = (t * 0.6) % 1;
      ctx.fillStyle = k.rgba('panel2', 0.35 * (1 - cyc));
      ctx.beginPath(); ctx.ellipse((k.hash(3) - 0.5) * 14, -46 - cyc * 22, 6 + cyc * 8, 5 + cyc * 7, 0, 0, k.TAU); ctx.fill();
    }
  },
};
