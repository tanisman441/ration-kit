// professions/chef — şapkalı aşçı; serve anında tepsiyi kaldırır, buhar çıkar.
// Orijinal tasarım; gerçek şef üniforması kopyası değildir.
// NOT: canvas y-aşağıdır; ayaklar (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'chef',
  category: 'professions',
  desc: 'Şapkalı aşçı (önlük + fular); serve anında tepsiyi yukarı kaldırır, üstünden buhar yükselir',
  tags: ['aşçı', 'şef', 'mutfak', 'tepsi', 'yemek', 'chef', 'cook', 'kitchen', 'tray', 'serve'],
  box: [-115, -395, 115, 12],
  bleed: 60,
  anchor: 'ayaklar (0,0); şapka üstü ~-380',
  points: { head: [0, -276], chest: [0, -184], left_hand: [-37, -134], right_hand: [37, -134], tray: [-56, -118] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'ceket rengi' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    serve: { type: 'time', default: null, desc: 'servis anı: tepsi yukarı kalkar, buhar çıkar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const body = k.rgba(p.color);
    const dark = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, name, fill) => {
      ctx.fillStyle = dark(name); ctx.beginPath(); k.rrect(x + 5, y + 7, w, h, r); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = fill || k.rgba(name); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, name, fill) => {
      ctx.fillStyle = dark(name); ctx.beginPath(); ctx.ellipse(x + 5, y + 7, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = fill || k.rgba(name); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const shine = (x, y, rx, ry, rot = -0.4) => {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, k.TAU); ctx.fill();
    };
    const face = (hx, hy) => {
      const blink = ((t + 1.9) % 4.2) < 0.12 ? 0.2 : 1;
      ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
      for (const s of [-1, 1]) {
        if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(s * 10, hy + 2, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
        else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(s * 10, hy - 2, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
      }
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
      else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(0, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }
    };

    const br = Math.sin(t * k.TAU / 2.4) * 2;                 // nefes
    const shoY = -206 - br * 0.5, hipY = -130;
    const hy = -250 - br * 0.6;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 58, 10, 0, 0, k.TAU); ctx.fill();

    // bacaklar + ayakkabı
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -22, 20, body);
      blob(s * 13 - 12, -13, 24, 13, 6, p.color, dark(p.color, 0.62));
    }
    // ceket + önlük (panel)
    blob(-31, -240 - br * 0.4, 62, 112, 28, p.color);
    blob(-22, -218 - br * 0.4, 44, 76, 14, 'panel');
    // fular (vurgu: accent)
    disc(0, -230 - br * 0.4, 13, 9, 'accent');

    // ANIMASYON — serve: tepsi konumu
    const d = p.serve == null ? -1 : t - p.serve;
    const firing = d >= 0 && d < 0.9;
    const REST = [-56, -118], UP = [-64, -300];
    const ss = x => x * x * (3 - 2 * x);
    let up = 0;
    if (firing) up = d < 0.35 ? ss(d / 0.35) : d > 0.65 ? 1 - ss((d - 0.65) / 0.25) : 1;
    const tx = REST[0] + (UP[0] - REST[0]) * up;
    const ty = REST[1] + (UP[1] - REST[1]) * up;

    // sol kol tepsiyi tutar
    limb(-29, shoY, tx, ty + 8, 18, body);
    disc(tx, ty + 8, 10, 10, p.color);
    // sağ kol yanda
    limb(29, shoY, 37, -134, 18, body);
    disc(37, -134, 10, 10, p.color);

    // tepsi + kapaklı tabak (cloche)
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(tx + 3, ty + 5, 36, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel'); ctx.beginPath(); ctx.ellipse(tx, ty, 34, 9, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = dark('panel'); ctx.beginPath(); ctx.ellipse(tx, ty - 12, 22, 14, 0, Math.PI, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel'); ctx.beginPath(); ctx.ellipse(tx, ty - 14, 20, 13, 0, Math.PI, k.TAU); ctx.fill();
    disc(tx, ty - 29, 4, 4, 'accent');

    // serve anında buhar
    if (firing && d > 0.25) {
      const g = (d - 0.25) / 0.65;
      for (let i = 0; i < 3; i++) {
        const bx = tx - 14 + i * 14, wob = Math.sin(t * 6 + i * 2.1) * 7;
        ctx.strokeStyle = k.rgba('panel', 0.55 * (1 - g));
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(bx, ty - 32);
        ctx.quadraticCurveTo(bx + wob, ty - 58, bx + wob * 0.4, ty - 80 - i * 6);
        ctx.stroke();
      }
    }

    // baş
    disc(0, hy, 36, 34, p.color);
    face(hy);
    // şef şapkası: bant + gövde + kabarık üst
    blob(-30, hy - 52, 60, 16, 8, 'panel');
    blob(-23, hy - 104, 46, 62, 14, 'panel');
    disc(0, hy - 104, 35, 25, 'panel');
    shine(-14, hy - 110, 12, 7);

    // premium parlama
    shine(-13, hy - 12, 13, 9);
    shine(-15, -214, 9, 24, 0.12);
  },
};
