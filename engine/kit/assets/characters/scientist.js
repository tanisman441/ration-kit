// characters/scientist — önlüklü bilim insanı; person ailesinden.
// NOT: canvas y-aşağıdır; zemin (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'scientist',
  category: 'characters',
  desc: 'Önlüklü bilim insanı; explain pozunda anlatır, experiment pozunda deney tüpü tutar',
  tags: ['bilim insanı', 'laboratuvar', 'önlük', 'deney', 'araştırmacı', 'scientist', 'lab', 'researcher', 'experiment', 'professor'],
  box: [-95, -292, 95, 12],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~290 birim',
  points: { head: [0, -276], hand: [70, -200] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'surprised'], default: 'neutral' },
    pose: { type: 'enum', values: ['explain', 'experiment'], default: 'explain' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const coat = k.rgba('panel2');
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const pose = p.pose;
    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -22, 20, body);
      blob(s * 13 - 12, -13, 24, 13, 6, body);
    }

    // iç gövde
    blob(-28, -240 - br * 0.4, 56, 112, 26, body);

    // önlük: iki ön panel + yaka
    blob(-34, -236 - br * 0.4, 27, 138, 12, coat);
    blob(7, -236 - br * 0.4, 27, 138, 12, coat);
    // yaka (V)
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-16, -238 - br * 0.4); ctx.lineTo(0, -214 - br * 0.4); ctx.lineTo(16, -238 - br * 0.4); ctx.stroke();
    ctx.strokeStyle = coat; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-16, -238 - br * 0.4); ctx.lineTo(0, -214 - br * 0.4); ctx.lineTo(16, -238 - br * 0.4); ctx.stroke();
    // cep
    blob(-28, -150 - br * 0.4, 20, 16, 5, coat);

    // kollar (önlük kolu: daha geniş)
    if (pose === 'explain') {
      limb(-29, shoY, -37, -136, 20, coat);            // sol kol aşağı
      disc(-37, -132, 10, 10, body);
      limb(29, shoY, 58, -192, 20, coat);             // sağ kol yukarı-açık
      limb(58, -192, 76, -214, 18, coat);
      disc(78, -216, 10, 10, body);                   // açık el
    } else {
      // experiment: iki el önde tüp tutar
      limb(-29, shoY, -30, -168, 20, coat);
      limb(-30, -168, -16, -188, 18, coat);
      disc(-14, -188, 9, 9, body);
      limb(29, shoY, 30, -168, 20, coat);
      limb(30, -168, 16, -188, 18, coat);
      disc(14, -188, 9, 9, body);
    }

    // baş
    const hy = -250 - br * 0.6;
    disc(0, hy, 36, 34, body);

    // yüz (person dili)
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }

    // deney tüpü (experiment pozunda, ellerin arasında)
    if (pose === 'experiment') {
      const tx = 0, ty = -196;
      // cam
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(tx - 11, ty - 26, 22, 52, 10); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 3;
      ctx.beginPath(); k.rrect(tx - 11, ty - 26, 22, 52, 10); ctx.stroke();
      // sıvı (köpüren)
      const lv = ty + 26 - 20 - Math.sin(t * 3) * 2;
      ctx.fillStyle = k.rgba('green', 0.9);
      ctx.beginPath(); k.rrect(tx - 8, lv, 16, ty + 23 - lv, 7); ctx.fill();
      // kabarcıklar (sıvı içinde yükselir)
      ctx.fillStyle = k.rgba('ink', 0.7);
      for (let i = 0; i < 3; i++) {
        const bx = tx + (k.hash(i * 17 + 3) - 0.5) * 10;
        const by = ty + 20 - ((t * 22 + i * 13) % 14);
        ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
  },
};
