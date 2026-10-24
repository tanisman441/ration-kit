// barbershop-fx/cape-flutter — berber önlüğü giyen müşteri; pelerin eteği sürekli dalgalanır, `gust` anında rüzgâr güçlenir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi.
export default {
  name: 'cape-flutter', category: 'barbershop-fx',
  desc: 'Berber pelerini giyen müşteri; pelerin eteği dalgalanır, rüzgâr anında kabarır',
  tags: ['pelerin', 'önlük', 'berber', 'rüzgâr', 'dalgalanma', 'cape', 'barber', 'flutter', 'wind', 'apron'],
  box: [-120, -125, 120, 90],
  bleed: 40,
  anchor: 'gövde merkezi (0,0); baş üstte',
  points: { head: [0, -95], shoulders: [0, -55], hem: [0, 78] },
  params: {
    color: { type: 'color', default: 'dim' },
    gust: { type: 'time', default: null, desc: 'rüzgâr darbesi anı — pelerin kabarır, etek savrulur (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const cape = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const d = p.gust == null ? -1 : t - p.gust;
    const gusting = d >= 0 && d < 0.9;
    const env = gusting ? Math.sin(Math.min(d / 0.9, 1) * Math.PI) : 0;
    const br = Math.sin(t * k.TAU / 2.6) * 1.5; // nefes
    // etek dalgası: sürekli, rüzgârda büyür
    const waveAmp = 4 + env * 9;
    const waveSpeed = k.TAU / 1.6;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // baş (pelerinin üstünde)
    disc(0, -96 + br * 0.4, 34, 32, k.rgba('dim'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -112, 10, 6, -0.4, 0, k.TAU); ctx.fill();
    // saç
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.ellipse(0, -116, 28, 14, 0, Math.PI, Math.PI * 2); ctx.fill();
    // yüz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(-12, -96, 3.5, 3.5, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(12, -96, 3.5, 3.5, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -86, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

    // boyun bağı (pelerin tokası)
    blob(-22, -62, 44, 14, 7, k.rgba('ink'));

    // pelerin: omuzdan dalgalı eteğe; hafif salınım + rüzgârda kabarma
    const sway = Math.sin(t * k.TAU / 2.2) * 0.02 + env * 0.05;
    const lift = env * 10; // rüzgârda etek kalkar
    ctx.save();
    ctx.translate(0, -55);
    ctx.rotate(sway);
    ctx.translate(0, 55);
    ctx.beginPath();
    ctx.moveTo(-58, -55);
    ctx.lineTo(58, -55);
    ctx.lineTo(96, 70 - lift);
    // dalgalı etek kenarı
    for (let x = 96; x >= -96; x -= 8) {
      const ph = t * waveSpeed + x * 0.09;
      const y = 70 - lift + Math.sin(ph) * waveAmp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(-96, 70 - lift);
    ctx.closePath();
    ctx.fillStyle = line;
    ctx.fill();
    // iç dolgu (aynı yol, hafif içte)
    ctx.beginPath();
    ctx.moveTo(-58, -55);
    ctx.lineTo(58, -55);
    ctx.lineTo(92, 68 - lift);
    for (let x = 92; x >= -92; x -= 8) {
      const ph = t * waveSpeed + x * 0.09;
      const y = 68 - lift + Math.sin(ph) * waveAmp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(-92, 68 - lift);
    ctx.closePath();
    ctx.fillStyle = cape;
    ctx.fill();
    // premium parlama (sol üst, pelerin üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-48, -30, 16, 26, 0.15, 0, k.TAU); ctx.fill();
    // pelerin ön dikişi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(0, 62 - lift * 0.5); ctx.stroke();
    ctx.restore();

    // rüzgâr çizgileri (sağda, sürekli akar; rüzgârda belirgin)
    const windA = 0.25 + env * 0.55;
    ctx.strokeStyle = k.rgba('cyan', windA); ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const wy = -20 + i * 34;
      const off = ((t * 90 + i * 47) % 60) - 30;
      ctx.beginPath(); ctx.moveTo(104 + off - 20, wy); ctx.quadraticCurveTo(118 + off, wy - 6, 134 + off - 10, wy); ctx.stroke();
    }
  },
};
