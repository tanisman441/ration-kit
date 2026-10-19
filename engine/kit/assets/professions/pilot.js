// professions/pilot — pilot üniformalı; wave anında sağ eliyle sallar.
// Orijinal tasarım; gerçek havayolu üniforması kopyası değildir.
// NOT: canvas y-aşağıdır; ayaklar (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'pilot',
  category: 'professions',
  desc: 'Pilot üniformalı figür (şapka, apolet, kravat); wave anında sağ elini kaldırıp sallar',
  tags: ['pilot', 'kaptan', 'uçak', 'havayolu', 'üniforma', 'pilot', 'captain', 'airline', 'wave'],
  box: [-115, -325, 115, 12],
  bleed: 60,
  anchor: 'ayaklar (0,0); şapka üstü ~-305',
  points: { head: [0, -276], chest: [0, -184], left_hand: [-37, -134], right_hand: [37, -134] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'üniforma rengi' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    wave: { type: 'time', default: null, desc: 'el sallama anı: sağ el kalkar, yana sallanır (0.9 sn)' },
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
      const blink = ((t + 2.5) % 4.2) < 0.12 ? 0.2 : 1;
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
    // ceket + kravat + düğmeler
    blob(-31, -240 - br * 0.4, 62, 112, 28, p.color);
    blob(-6, -228 - br * 0.4, 12, 30, 4, 'ink', dark('ink', 0.7));
    for (let i = 0; i < 3; i++) disc(0, -196 - i * 16 - br * 0.4, 3.5, 3.5, 'panel');
    // apoletler (vurgu: yellow)
    for (const s of [-1, 1]) blob(s * 38 - 9, shoY - 10, 18, 11, 4, 'yellow');

    // ANIMASYON — wave: sağ el kalkar ve yana sallanır (0.9 sn)
    const d = p.wave == null ? -1 : t - p.wave;
    const firing = d >= 0 && d < 0.9;
    const ss = x => x * x * (3 - 2 * x);
    let RHx = 37, RHy = -134;
    if (firing) {
      const lift = d < 0.25 ? ss(d / 0.25) : d > 0.7 ? 1 - ss((d - 0.7) / 0.2) : 1;
      RHx = 37 + (62 - 37) * lift + Math.sin(d * 3 * k.TAU) * 13 * lift;
      RHy = -134 + (-242 + 134) * lift;
    }
    // sol kol yanda
    limb(-29, shoY, -37, -134, 18, body);
    disc(-37, -134, 10, 10, p.color);
    // sağ kol (sallanan)
    limb(29, shoY, RHx, RHy, 18, body);
    disc(RHx, RHy, 10, 10, p.color);

    // baş
    disc(0, hy, 36, 34, p.color);
    face(hy);
    // pilot şapkası: kubbe + siperlik + kanat rozeti
    disc(0, hy - 18, 39, 28, 'ink');
    blob(-40, hy - 20, 80, 11, 5, 'ink', dark('ink', 0.7));
    blob(-14, hy - 32, 28, 10, 5, 'yellow');                 // kanat rozeti
    shine(-14, hy - 28, 12, 7);

    // premium parlama
    shine(-13, hy - 12, 13, 9);
    shine(-15, -214, 9, 24, 0.12);
  },
};
