// professions/farmer — çiftçi; hasır şapka + tulum, elinde kürek.
// dig anında küreği kaldırıp toprağa saplar, toprak parçacıkları uçuşur.
// Orijinal tasarım; gerçek çiftçi kıyafeti kopyası değildir.
// NOT: canvas y-aşağıdır; ayaklar (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'farmer',
  category: 'professions',
  desc: 'Çiftçi (hasır şapka, tulum, elinde kürek); dig anında küreği kaldırıp toprağa saplar',
  tags: ['çiftçi', 'tarla', 'tulum', 'kürek', 'hasır şapka', 'farmer', 'farm', 'shovel', 'dig', 'overalls'],
  box: [-125, -325, 165, 12],
  bleed: 70,
  anchor: 'ayaklar (0,0); şapka üstü ~-305',
  points: { head: [0, -276], chest: [0, -184], left_hand: [-37, -134], right_hand: [37, -134], blade: [74, -4] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'tulum rengi' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    dig: { type: 'time', default: null, desc: 'kazma anı: kürek kalkar, toprağa saplanır (1.0 sn)' },
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
      const blink = ((t + 0.3) % 4.2) < 0.12 ? 0.2 : 1;
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

    // bacaklar + çizme
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -22, 20, body);
      blob(s * 13 - 13, -14, 28, 14, 6, p.color, dark(p.color, 0.55));
    }
    // tulum + askılar + ön cep
    blob(-31, -240 - br * 0.4, 62, 112, 28, p.color);
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 4;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * 18, -240 - br * 0.4); ctx.lineTo(s * 14, -168 - br * 0.4); ctx.stroke();
      disc(s * 14, -164 - br * 0.4, 3.5, 3.5, 'ink');
    }
    blob(-16, -196 - br * 0.4, 32, 24, 6, p.color, dark(p.color, 0.78));

    // ANIMASYON — dig: kürek konumu
    const d = p.dig == null ? -1 : t - p.dig;
    const firing = d >= 0 && d < 1.0;
    const ss = x => x * x * (3 - 2 * x);
    let bx = 64, by = -36, dirtK = 0;
    if (firing) {
      if (d < 0.3) { const e = d / 0.3; bx = 64 - e * 10; by = -36 - e * e * 90; }      // kaldır
      else if (d < 0.5) { const e = (d - 0.3) / 0.2; bx = 54 + e * 20; by = -126 + e * e * 122; } // sapla
      else { bx = 74; by = -4; dirtK = Math.min((d - 0.5) / 0.5, 1); }                  // toprak uçuşur
    }

    // sağ el kürek sapını tutar; kürek: sap + uç
    const HX = 37, HY = -134;
    limb(29, shoY, HX, HY, 18, body);
    disc(HX, HY, 10, 10, p.color);
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(HX, HY); ctx.lineTo(bx, by); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(HX, HY); ctx.lineTo(bx, by); ctx.stroke();
    // kürek ucu
    ctx.save(); ctx.translate(bx, by);
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(3, 4, 15, 20, 0.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = dark(p.color, 0.6); ctx.beginPath(); ctx.ellipse(0, 0, 13, 18, 0.5, 0, k.TAU); ctx.fill();
    ctx.restore();
    // sol kol yanda
    limb(-29, shoY, -37, -134, 18, body);
    disc(-37, -134, 10, 10, p.color);

    // dig anında toprak parçacıkları + toz bulutu
    if (firing && dirtK > 0) {
      for (let i = 0; i < 9; i++) {
        const h1 = k.hash(i * 3 + 81), h2 = k.hash(i * 5 + 82), h3 = k.hash(i * 7 + 83);
        const vx = (0.3 + h1) * 90 * (h2 > 0.4 ? 1 : -0.5);
        const vy = -(100 + h2 * 100);
        const x = 74 + vx * dirtK, y = -8 + vy * dirtK + 260 * dirtK * dirtK;
        ctx.fillStyle = k.rgba('dim', 0.95 * (1 - dirtK));
        ctx.beginPath(); ctx.arc(x, y, 3 + h3 * 5, 0, k.TAU); ctx.fill();
      }
      ctx.fillStyle = k.rgba('dim', 0.35 * (1 - dirtK));
      ctx.beginPath(); ctx.ellipse(74, -10, 20 + dirtK * 40, 8 + dirtK * 12, 0, 0, k.TAU); ctx.fill();
    }

    // baş
    disc(0, hy, 36, 34, p.color);
    face(hy);
    // hasır şapka: geniş siper + kubbe + bant
    disc(0, hy - 16, 56, 15, 'yellow');
    disc(0, hy - 30, 30, 23, 'yellow');
    blob(-30, hy - 42, 60, 11, 5, 'yellow', dark('yellow', 0.75));
    shine(-14, hy - 38, 11, 6);

    // premium parlama
    shine(-13, hy - 12, 13, 9);
    shine(-15, -214, 9, 24, 0.12);
  },
};
