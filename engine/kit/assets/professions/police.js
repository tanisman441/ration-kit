// professions/police — üniformalı polis memuru; kep + rozet + omuz ışıkları.
// Orijinal tasarım; gerçek polis üniforması kopyası değildir.
// NOT: canvas y-aşağıdır; ayaklar (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'police',
  category: 'professions',
  desc: 'Üniformalı polis memuru (kep, rozet, omuz ışıkları); siren anında şapka ve omuz ışıkları kırmızı-mavi çakar',
  tags: ['polis', 'polis memuru', 'üniforma', 'siren', 'emniyet', 'police', 'officer', 'cop', 'siren lights'],
  box: [-110, -330, 110, 12],
  bleed: 70,
  anchor: 'ayaklar (0,0); kep üstü ~-320',
  points: { head: [0, -276], chest: [0, -184], left_hand: [-37, -134], right_hand: [37, -134], light_left: [-29, -206], light_right: [29, -206] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'üniforma rengi' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    siren: { type: 'time', default: null, desc: 'siren anı: şapka ve omuz ışıkları yanıp söner (0.9 sn)' },
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
      const blink = ((t + 0.7) % 4.2) < 0.12 ? 0.2 : 1;
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
    // gövde (üniforma) + kemer
    blob(-31, -240 - br * 0.4, 62, 112, 28, p.color);
    blob(-31, -142 - br * 0.4, 62, 13, 6, p.color, dark(p.color, 0.62));
    // rozet (vurgu: accent) — göğüs
    ctx.fillStyle = dark('accent'); ctx.beginPath(); ctx.arc(-15 + 3, -192 + 3, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('accent'); ctx.beginPath(); ctx.arc(-15, -192, 8, 0, k.TAU); ctx.fill();
    ctx.fillStyle = inkC; ctx.beginPath(); ctx.arc(-15, -192, 3, 0, k.TAU); ctx.fill();

    // kollar + eller
    for (const s of [-1, 1]) {
      limb(s * 29, shoY, s * 37, -134, 18, body);
      disc(s * 37, -134, 10, 10, p.color);
    }

    // baş
    disc(0, hy, 36, 34, p.color);
    face(hy);

    // kep: kubbe + bant + siperlik
    disc(0, hy - 20, 39, 27, 'ink');
    blob(-37, hy - 34, 74, 13, 6, 'ink', dark('ink', 0.7));
    blob(-42, hy - 22, 84, 11, 5, 'ink', dark('ink', 0.7));
    disc(0, hy - 46, 7, 7, 'accent');                            // kep tepesi
    shine(-14, hy - 30, 12, 7);

    // kep üstü siren lambası
    const d = p.siren == null ? -1 : t - p.siren;
    const firing = d >= 0 && d < 0.9;
    const phase = firing ? Math.floor(d / 0.15) % 2 : -1;        // 0: sol, 1: sağ
    const capA = firing && phase === 0 ? 1 : 0.15;
    disc(0, hy - 54, 9, 8, 'red', k.rgba('red', capA));

    // omuz ışıkları (idle: yumuşak nöbetçi yanıp sönme)
    for (const s of [-1, 1]) {
      const lx = s * 29, ly = shoY - 6;
      const idleA = ((t * 0.9 + (s < 0 ? 0 : 1)) % 2) < 1 ? 0.85 : 0.3;
      const on = firing && ((s < 0 && phase === 0) || (s > 0 && phase === 1));
      const col = s < 0 ? 'red' : 'cyan';
      disc(lx, ly, 8, 8, col, k.rgba(col, on ? 1 : idleA));
      if (on) k.glow(lx, ly, 34, col, 0.5);
    }
    if (firing && phase === 0) k.glow(0, hy - 54, 30, 'red', 0.45);

    // premium parlama
    shine(-13, hy - 12, 13, 9);
    shine(-15, -214, 9, 24, 0.12);
  },
};
