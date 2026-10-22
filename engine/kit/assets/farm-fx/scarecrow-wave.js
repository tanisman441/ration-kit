// farm-fx/scarecrow-wave — el sallayan korkuluk, önden görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) direk tabanıdır.
export default {
  name: 'scarecrow-wave', category: 'farm-fx',
  desc: 'El sallayan korkuluk; wave anında sağ kol kalkar ve sallar, rüzgarda sürekli salınır',
  tags: ['korkuluk', 'çiftlik', 'tarla', 'saman', 'el sallama', 'scarecrow', 'farm', 'wave', 'straw'],
  box: [-115, -210, 115, 45],
  bleed: 40,
  anchor: 'direk tabanı (0,0)',
  points: { hand: [82, -152], head: [0, -176] },
  params: {
    color: { type: 'color', default: 'dim' },
    wave: { type: 'time', default: null, desc: 'el sallama — sağ kol kalkar, 1 sn boyunca sallar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const coat = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const sack = k.rgba('panel2'), strawC = k.rgba('yellow');
    const df = p.wave == null ? -1 : t - p.wave;
    const waving = df >= 0 && df < 1.0;
    const wenv = waving ? Math.sin(df / 1.0 * Math.PI) : 0;    // sallama zarfı
    const sway = Math.sin(t * k.TAU * 0.3) * 0.035;            // rüzgar salınımı (idle)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const rbox = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + 2); ctx.fill();
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
    const straw = (x, y, n, len, seed) => {                    // saman püskülleri
      ctx.strokeStyle = strawC; ctx.lineWidth = 3.5;
      for (let i = 0; i < n; i++) {
        const a = (i / (n - 1) - 0.5) * 1.6 + k.noise1(t * 3 + seed + i * 7) * 0.15;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
      }
    };

    // direk (yere gömülü, salınmaz)
    rbox(-5, -165, 10, 200, 4, k.rgba('ink', 0.45));

    ctx.save();
    ctx.rotate(sway + (waving ? wenv * 0.03 : 0));             // rüzgar salınımı

    // sol kol (sabit, hafif aşağı)
    limb(-30, -118, -78, -92, 12, coat);
    disc(-82, -90, 10, 9, strawC);                             // saman el
    straw(-82, -90, 5, 14, 11);

    // sağ kol (sallanan)
    const restA = 1.05, upA = -1.35;
    const armA = restA + (upA - restA) * wenv + (waving ? Math.sin(df * k.TAU * 5) * 0.32 * wenv : Math.sin(t * k.TAU * 0.3) * 0.05);
    const hx = 30 + Math.cos(armA) * 58, hy = -118 + Math.sin(armA) * 58;
    limb(30, -118, hx, hy, 12, coat);
    disc(hx, hy, 11, 10, strawC);
    straw(hx, hy, 5, 15, 23);

    // ceket
    rbox(-38, -158, 76, 96, 14, coat);
    rbox(-24, -120, 18, 16, 4, strawC);                        // yama (vurgu: sarı)
    rbox(8, -100, 16, 14, 4, strawC);
    ctx.fillStyle = k.rgba('ink', 0.75);                       // düğmeler
    for (const by of [-140, -126, -112]) {
      ctx.beginPath(); ctx.ellipse(0, by, 3.5, 3.5, 0, 0, k.TAU); ctx.fill();
    }
    straw(0, -62, 7, 13, 31);                                  // etek samanı

    // kafa (çuval)
    const headTilt = sway * 2 + (waving ? wenv * 0.12 : 0);
    ctx.save(); ctx.translate(0, -178); ctx.rotate(headTilt);
    disc(0, 0, 26, 24, sack);
    ctx.fillStyle = inkC;                                      // yüz (aile dili: nokta göz, yay ağız)
    ctx.beginPath(); ctx.ellipse(-8, -4, 3.4, 3.4, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8, -4, 3.4, 3.4, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 6, 10, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5; // çuval dikişi
    ctx.beginPath(); ctx.moveTo(-18, 14); ctx.quadraticCurveTo(0, 20, 18, 14); ctx.stroke();
    ctx.restore();

    // şapka
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, -198, 42, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = strawC; ctx.beginPath(); ctx.ellipse(0, -198, 38, 9, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, -210, 24, 18, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = strawC; ctx.beginPath(); ctx.ellipse(0, -209, 20, 14, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.3); ctx.fillRect(-20, -206, 40, 5);

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, -145, 13, 18, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
