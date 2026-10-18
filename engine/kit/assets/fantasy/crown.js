// fantasy/crown — beş dişli altın taç; bandında üç taş, diş uçlarında toplar.
// Orijinal tasarım; gerçek kraliyet tacı kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) taban merkezidir.
export default {
  name: 'crown',
  category: 'fantasy',
  desc: 'Beş dişli altın taç; bandında parlayan üç taş; shine anında üzerinden ışık süpürür',
  tags: ['taç', 'kral tacı', 'krallık', 'altın', 'crown', 'king crown', 'royalty', 'gold'],
  box: [-115, -82, 115, 82],
  bleed: 55,
  anchor: 'taban merkezi (0,0)',
  points: { top: [0, -62] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'taç metal rengi' },
    gem: { type: 'color', default: 'red', desc: 'taş rengi' },
    shine: { type: 'time', default: null, desc: 'tacın üzerinden geçen ışık süpürmesi anı' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const dot = (x, y, r, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); ctx.arc(x + 4, y + 5, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };

    // dişler (5 üçgen)
    const tips = [-80, -40, 0, 40, 80];
    const tipY = [-48, -56, -64, -56, -48];
    tips.forEach((bx, i) => {
      const ty = tipY[i];
      ctx.fillStyle = sh(p.color);
      ctx.beginPath();
      ctx.moveTo(bx - 15 + 4, 26 + 5); ctx.lineTo(bx + 15 + 4, 26 + 5); ctx.lineTo(bx + 4, ty + 5);
      ctx.closePath(); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = O; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(bx - 15, 26); ctx.lineTo(bx + 15, 26); ctx.lineTo(bx, ty);
      ctx.closePath(); ctx.stroke();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath();
      ctx.moveTo(bx - 15, 26); ctx.lineTo(bx + 15, 26); ctx.lineTo(bx, ty);
      ctx.closePath(); ctx.fill();
    });

    // bant
    const band = (x, y, w, h, r, name) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); k.rrect(x + 5, y + 7, w, h, r); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - 3, y - 3, w + 6, h + 6, r + 3); ctx.fill();
      ctx.fillStyle = k.rgba(name); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    band(-95, 22, 190, 40, 10, p.color);
    // bant süs çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-88, 32); ctx.lineTo(88, 32); ctx.stroke();

    // diş ucu topları
    tips.forEach((bx, i) => dot(bx, tipY[i], 8, p.color));

    // ANIMASYON 1 — idle taş parlaması: taşlar sırayla yanıp söner (~2.6 sn döngü)
    const gemX = [-55, 0, 55];
    gemX.forEach((gx, i) => {
      const tw = 0.35 + 0.65 * Math.max(0, Math.sin((t / 2.6) * k.TAU + i * 2.1));
      if (tw > 0.55) k.glow(gx, 44, 15 * tw, p.gem, 0.45 * tw);
      dot(gx, 44, 9, p.gem, k.rgba(p.gem, 0.55 + 0.45 * tw));
      if (tw > 0.85) {
        // 4 uçlu mini yıldız
        ctx.strokeStyle = `rgba(255,255,255,${(0.9 * tw).toFixed(3)})`; ctx.lineWidth = 2.5;
        const r = 16 * tw;
        ctx.beginPath();
        ctx.moveTo(gx - r, 44); ctx.lineTo(gx + r, 44);
        ctx.moveTo(gx, 44 - r); ctx.lineTo(gx, 44 + r);
        ctx.stroke();
      }
    });

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, 32, 30, 8, -0.1, 0, k.TAU); ctx.fill();

    // ANIMASYON 2 — shine olayı: soldan sağa ışık süpürmesi (0.6 sn)
    const d = p.shine == null ? -1 : t - p.shine;
    if (d >= 0 && d < 0.6) {
      const g = d / 0.6, x = -115 + 230 * g;
      ctx.save();
      ctx.beginPath(); k.rrect(-102, -78, 204, 142, 18); ctx.clip();
      ctx.fillStyle = `rgba(255,255,255,${(0.65 * Math.sin(g * Math.PI)).toFixed(3)})`;
      ctx.beginPath(); k.rrect(x - 13, -78, 26, 142, 13); ctx.fill();
      ctx.restore();
      k.glow(0, -10, 90 * (1 - g) + 30, p.color, 0.35 * (1 - g));
    }
  },
};
