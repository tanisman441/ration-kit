// space/ufo — uçan daire: cam kubbe, dönen alt ışıklar, ışın demeti.
// active (beam) anında gövdeden aşağı ışın açılır (1.2 sn); boşta hover titremesi.
// NOT: canvas y-aşağıdır; (0,0) diskin merkezidir.
export default {
  name: 'ufo', category: 'space',
  desc: 'Uçan daire; active anında ışın demeti açar, alt ışıklar döner',
  tags: ['ufo', 'uçan daire', 'uzay', 'ışın', 'tractor beam', 'flying saucer', 'space', 'beam', 'uzaylı'],
  box: [-160, -90, 160, 120],
  bleed: 150,
  anchor: 'disk merkezi (0,0); ışın aşağı doğru açılır',
  points: { dome: [0, -62], belly: [0, 34], beam: [0, 118] },
  params: {
    color: { type: 'color', default: 'dim' },
    beam: { type: 'time', default: null, desc: 'ışın demeti aç/kapa anı: 1.2 sn (açılma 0.3 + sönme 0.9)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const hull = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // ışın zamanlaması: 0–0.3 açılma, 0.3–1.2 sönme
    const d = p.beam == null ? -1 : t - p.beam;
    let beamA = 0;
    if (d >= 0 && d < 0.3) beamA = k.E.outCubic(d / 0.3);
    else if (d >= 0.3 && d < 1.2) beamA = 1 - k.E.inOutCubic((d - 0.3) / 0.9);
    const beamW = beamA * 56;

    ctx.save();
    // hover titremesi: noise1 tabanlı minik dalgalanma + nefes
    ctx.translate(k.noise1(t * 2.6) * 3, Math.sin(t * k.TAU / 2.4) * 5 + k.noise1(t * 3.7) * 1.5);
    ctx.rotate(k.noise1(t * 1.9) * 0.02);

    // gövde diski (yassı elips)
    disc(0, 8, 120, 38, hull);
    // disk üst kenarı (kabartma şerit)
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 2, 104, 30, 0, Math.PI, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -8, 34, 12, -0.3, 0, k.TAU); ctx.fill();

    // cam kubbe
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, -30, 44, 40, 0, Math.PI, k.TAU); ctx.fillStyle = line; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -30, 41, 37, 0, Math.PI, k.TAU); ctx.fillStyle = k.rgba('cyan', 0.55); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-22, -58); ctx.quadraticCurveTo(-30, -40, -20, -28); ctx.stroke();
    ctx.restore();
    // kubbe içi siluet (pilot başı)
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.ellipse(6, -38, 12, 14, 0, 0, k.TAU); ctx.fill();

    // alt ışıklar: dönerek yanıp sönen sıra
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + t * 2.2;
      const x = Math.cos(a) * 78, y = 8 + Math.sin(a) * 30;
      const b = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 6 + i * 2.4));
      ctx.fillStyle = k.rgba('yellow', b);
      ctx.beginPath(); ctx.ellipse(x, y, 7, 6, 0, 0, k.TAU); ctx.fill();
      if (b > 0.7) k.glow(x, y, 18, 'yellow', 0.35);
    }

    // göbek lensi
    disc(0, 36, 22, 10, k.rgba('panel'));
    const lensGlow = 0.5 + 0.5 * Math.sin(t * 3.3);
    ctx.fillStyle = k.rgba('cyan', 0.4 + 0.5 * lensGlow);
    ctx.beginPath(); ctx.ellipse(0, 36, 12, 6, 0, 0, k.TAU); ctx.fill();

    // ışın demeti (gövdeden aşağı genişleyen yamuk)
    if (beamA > 0.01) {
      ctx.save();
      ctx.globalAlpha = beamA * 0.55;
      const grd = ctx.createLinearGradient(0, 40, 0, 240);
      grd.addColorStop(0, k.rgba('cyan', 0.85));
      grd.addColorStop(1, k.rgba('cyan', 0.05));
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(-20, 42); ctx.lineTo(20, 42);
      ctx.lineTo(beamW, 240); ctx.lineTo(-beamW, 240);
      ctx.closePath(); ctx.fill();
      // demet içi parçacıklar (hash tabanlı, yukarı süzülür)
      for (let i = 0; i < 8; i++) {
        const h = k.hash(i * 7 + 3);
        const yy = 60 + ((t * 90 + h * 170) % 160);
        const wob = Math.sin(yy * 0.08 + h * k.TAU) * 14;
        const xx = wob * (0.3 + yy / 240);
        ctx.fillStyle = k.rgba('yellow', beamA * (0.4 + 0.6 * h));
        ctx.beginPath(); ctx.ellipse(xx, yy, 4, 6, 0, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
      // yere düşen ışık havuzu
      ctx.fillStyle = k.rgba('cyan', beamA * 0.18);
      ctx.beginPath(); ctx.ellipse(0, 240, beamW * 1.1, 16, 0, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
