// zoo-fx/elephant-spray — yandan fil, hortumunu kaldırıp su püskürtür. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'elephant-spray', category: 'zoo-fx',
  desc: 'Yandan duran fil; püskürtme anında hortumunu kaldırır ve su damlaları saçar',
  tags: ['fil', 'hortum', 'su püskürtme', 'hayvanat bahçesi', 'elephant', 'trunk', 'spray', 'water', 'zoo', 'safari'],
  box: [-185, -205, 205, 10],
  bleed: 120,
  anchor: 'ayaklar (0,0); boy ~195 birim',
  points: { head: [118, -150], trunk: [168, -60], tail: [-158, -110] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'su püskürtme anı — hortum kalkar, damlalar saçar (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const waterC = k.rgba('cyan');
    const d = p.at == null ? -1 : t - p.at;
    const spraying = d >= 0 && d < 1.2;
    const env = spraying ? Math.sin(Math.min(d / 1.2, 1) * Math.PI) : 0;
    const br = Math.sin(t * k.TAU / 2.6) * 2; // nefes
    const earFlap = Math.sin(t * k.TAU / 1.8) * 0.14; // kulak çırpma (canlı idle)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const rope = (x1, y1, cx, cy, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 105, 12, 0, 0, k.TAU); ctx.fill();

    // kuyruk: sallanma
    const sway = k.noise1(t * 0.8) * 12;
    rope(-152, -112, -172, -80 + sway, -166 + sway, -44, 11, body);
    disc(-166 + sway, -40, 9, 11, body);

    // bacaklar
    limb(-110, -90, -112, -14, 24, body);
    limb(-58, -90, -56, -14, 24, body);
    limb(62, -90, 64, -14, 24, body);
    limb(110, -90, 108, -14, 24, body);
    for (const px of [-112, -56, 64, 108]) blob(px - 14, -16, 30, 16, 8, body);

    // gövde + sağ alt gölge (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-152 + 6, -182 + 6 + br * 0.4, 260, 96, 44); ctx.fill();
    blob(-152, -182 + br * 0.4, 260, 96, 44, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-110, -160, 30, 14, -0.3, 0, k.TAU); ctx.fill();

    // baş
    const hx = 118, hy = -150 - br * 0.5;
    disc(hx, hy, 46, 44, body);
    // kulak: çırpar (idle)
    ctx.save();
    ctx.translate(hx - 26, hy - 6);
    ctx.rotate(-0.25 + earFlap);
    disc(0, 0, 34, 30, body);
    ctx.restore();
    // göz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(hx + 16, hy - 10, 5, 5, 0, 0, k.TAU); ctx.fill();
    // diş (fildişi, iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(hx + 30, hy + 28); ctx.quadraticCurveTo(hx + 36, hy + 48, hx + 30, hy + 58); ctx.stroke();

    // hortum: normalde aşağı sarkar, püskürtürken yukarı kıvrılır
    const lift = env;
    const tipX = 168 + lift * 34, tipY = -60 - lift * 120;
    rope(hx + 34, hy + 22, hx + 52 + lift * 30, hy + 60 - lift * 40, tipX, tipY, 20, body);

    // su damlaları (püskürtme anı, 1.2 sn)
    if (spraying) {
      for (let i = 0; i < 14; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.15) / 0.6, 0, 1);
        if (prog <= 0) continue;
        const spread = (k.hash(i + 40) - 0.5) * 70;
        const dx = tipX + 14 + prog * 90;
        const dy = tipY - 6 - prog * 46 + prog * prog * 60 + spread * 0.3;
        const r = 4 + k.hash(i + 80) * 5;
        ctx.fillStyle = k.rgba('cyan', 0.9 * (1 - prog * 0.5));
        ctx.beginPath(); ctx.ellipse(dx, dy, r, r * 1.2, 0, 0, k.TAU); ctx.fill();
      }
      // püskürtme kaynağında su bulutu
      ctx.fillStyle = k.rgba('cyan', 0.35 * env);
      ctx.beginPath(); ctx.ellipse(tipX + 12, tipY - 8, 16 * env + 4, 10 * env + 3, 0, 0, k.TAU); ctx.fill();
    }
    void waterC;
  },
};
