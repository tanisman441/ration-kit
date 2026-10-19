// professions/nurse — hemşire; heal anında başının üstünde yeşil artı işareti parlar.
// Orijinal tasarım; gerçek hemşire üniforması kopyası değildir.
// NOT: canvas y-aşağıdır; ayaklar (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'nurse',
  category: 'professions',
  desc: 'Hemşire (kep + önlük, göğüste yeşil artı); heal anında başının üstünde yeşil artı parlar',
  tags: ['hemşire', 'sağlık', 'hastane', 'şifa', 'doktor', 'nurse', 'healthcare', 'hospital', 'heal'],
  box: [-115, -390, 115, 12],
  bleed: 70,
  anchor: 'ayaklar (0,0); artı işareti ~-365',
  points: { head: [0, -276], chest: [0, -184], left_hand: [-37, -134], right_hand: [37, -134], cross: [0, -352] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'forma rengi' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    heal: { type: 'time', default: null, desc: 'şifa anı: baş üstünde yeşil artı parlar (0.8 sn)' },
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
      const blink = ((t + 3.1) % 4.2) < 0.12 ? 0.2 : 1;
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
    const plus = (x, y, s, name, fill) => {
      blob(x - s / 6, y - s / 2, s / 3, s, s / 8, name, fill);
      blob(x - s / 2, y - s / 6, s, s / 3, s / 8, name, fill);
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
    // forma + cep (yeşil artı)
    blob(-31, -240 - br * 0.4, 62, 112, 28, p.color);
    blob(6, -196 - br * 0.4, 20, 16, 5, p.color, dark(p.color, 0.7));
    plus(16, -188 - br * 0.4, 12, 'green');

    // kollar + eller
    for (const s of [-1, 1]) {
      limb(s * 29, shoY, s * 37, -134, 18, body);
      disc(s * 37, -134, 10, 10, p.color);
    }

    // baş
    disc(0, hy, 36, 34, p.color);
    face(hy);
    // hemşire kepi + yeşil artı
    blob(-23, hy - 58, 46, 24, 11, 'panel');
    const idlePulse = 0.75 + 0.25 * Math.sin(t * k.TAU / 2.4);
    plus(0, hy - 46, 16, 'green', k.rgba('green', idlePulse));
    shine(-12, hy - 52, 8, 5);

    // ANIMASYON — heal: baş üstünde yeşil artı parlar (0.8 sn)
    const d = p.heal == null ? -1 : t - p.heal;
    if (d >= 0 && d < 0.8) {
      const g = d / 0.8;
      const s = 34 * (1 + 0.25 * Math.sin(g * Math.PI));
      k.glow(0, -352, 46 * (1 - g) + 20, 'green', 0.5 * (1 - g));
      plus(0, -352, s, 'green', k.rgba('green', 1 - g * 0.4));
      // yükselen kıvılcımlar
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 3 + 71), h2 = k.hash(i * 7 + 72);
        const yy = -352 - (d / 0.8) * (60 + h1 * 40);
        const xx = Math.sin(t * 4 + i * 1.7) * 16 * h2;
        ctx.fillStyle = k.rgba('green', 0.8 * (1 - g));
        ctx.beginPath(); ctx.arc(xx, yy, 2.5 + h1 * 3, 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama
    shine(-13, hy - 12, 13, 9);
    shine(-15, -214, 9, 24, 0.12);
  },
};
