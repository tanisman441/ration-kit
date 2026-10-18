// fantasy/sword — yukarı bakan süslü kılıç: parlayan bıçak, balçak, kabza ve topuz taşı.
// Orijinal tasarım; gerçek kılıç markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) kabza merkezidir.
export default {
  name: 'sword',
  category: 'fantasy',
  desc: 'Yukarı bakan süslü kılıç; balçaklı kabza, topuzunda taş; glint anında bıçağın üzerinden ışık süpürür',
  tags: ['kılıç', 'şövalye kılıcı', 'bıçak', 'fantastik', 'sword', 'knight sword', 'blade', 'fantasy'],
  box: [-100, -180, 100, 100],
  bleed: 70,
  anchor: 'kabza merkezi (0,0)',
  points: { tip: [0, -172], grip: [0, 45] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'çelik rengi' },
    glint: { type: 'time', default: null, desc: 'bıçağın üzerinden geçen ışık süpürmesi anı' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);                       // dış hat
    const sh = (name, f = 0.88) => {                    // %12 koyultma gölge rengi
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const blob = (x, y, w, h, r, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); k.rrect(x + 5, y + 7, w, h, r); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - 3, y - 3, w + 6, h + 6, r + 3); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); ctx.arc(x + 4, y + 5, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };
    const metal = sh(p.color, 0.68);

    // bıçak (kın hattı) — ucu yukarıda
    blob(-15, -152, 30, 152, 8, p.color);
    // uç
    ctx.fillStyle = sh(p.color); ctx.beginPath();
    ctx.moveTo(-15 + 4, -152 + 6); ctx.lineTo(15 + 4, -152 + 6); ctx.lineTo(4, -174); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = O; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-15, -152); ctx.lineTo(15, -152); ctx.lineTo(0, -174); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.moveTo(-15, -152); ctx.lineTo(15, -152); ctx.lineTo(0, -174); ctx.closePath(); ctx.fill();
    // namlu oluğu (iç ayrım çizgisi)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -138); ctx.lineTo(0, -14); ctx.stroke();

    // balçak
    blob(-54, -6, 108, 22, 10, p.color, metal);
    dot(-54, 5, 9, p.color, metal);
    dot(54, 5, 9, p.color, metal);
    // kabza
    blob(-11, 16, 22, 46, 9, p.color, metal);
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const y = 26 + i * 12;
      ctx.beginPath(); ctx.moveTo(-9, y); ctx.lineTo(9, y); ctx.stroke();
    }
    // topuz + taş
    dot(0, 76, 13, p.color, metal);
    dot(0, 76, 6, 'cyan');

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, -110, 6, 42, 0.12, 0, k.TAU); ctx.fill();

    // ANIMASYON 1 — idle ışıltı: bıçak boyunca yukarı süzülen bant (~4.5 sn döngü)
    const cyc = t % 4.5;
    if (cyc < 1.0) {
      const g = cyc / 1.0, y = 10 - 170 * g, a = 0.5 * Math.sin(g * Math.PI);
      ctx.save();
      ctx.beginPath(); k.rrect(-15, -152, 30, 152, 8); ctx.clip();
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      ctx.beginPath(); k.rrect(-15, y - 7, 30, 14, 7); ctx.fill();
      ctx.restore();
    }

    // ANIMASYON 2 — glint olayı: hızlı süpürme + parlama + kıvılcımlar (0.6 sn)
    const d = p.glint == null ? -1 : t - p.glint;
    if (d >= 0 && d < 0.6) {
      const g = d / 0.6, y = 10 - 170 * g;
      ctx.save();
      ctx.beginPath(); k.rrect(-15, -152, 30, 152, 8); ctx.clip();
      ctx.fillStyle = `rgba(255,255,255,${(0.85 * Math.sin(g * Math.PI)).toFixed(3)})`;
      ctx.beginPath(); k.rrect(-15, y - 10, 30, 20, 10); ctx.fill();
      ctx.restore();
      k.glow(0, -80, 60 * (1 - g) + 20, 'cyan', 0.4 * (1 - g));
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 5 + 2), h3 = k.hash(i * 7 + 3);
        const appear = h1 * 0.3;
        if (d < appear) continue;
        const dd = (d - appear) / (0.6 - appear);
        const x = (h2 - 0.5) * 90, yy = -20 - h3 * 140 + dd * 26;
        ctx.fillStyle = k.rgba('cyan', Math.max(0, 0.9 * (1 - dd)));
        ctx.beginPath(); ctx.arc(x, yy, 2.5 + h1 * 3.5, 0, k.TAU); ctx.fill();
      }
    }
  },
};
