// archaeology-fx/torch-illuminate — meşale; alev sürekli dalgalanır, ışık nabzı atar, korlar yükselir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) meşale sapının merkezi.
export default {
  name: 'torch-illuminate', category: 'archaeology-fx',
  desc: 'Yanan meşale; alevi sürekli dalgalanır, ışığı nabız gibi atar, kor parçacıkları yükselir',
  tags: ['meşale', 'alev', 'ateş', 'ışık', 'mağara', 'torch', 'flame', 'fire', 'light', 'cave', 'archaeology'],
  box: [-130, -110, 130, 110],
  bleed: 60,
  anchor: 'meşale sapının merkezi (0,0); alev yukarı bakar',
  points: { flame: [0, -72], grip: [0, 20], base: [0, 96] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'alev parlaması anı — alev büyür, ışık güçlenir (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const flare = d >= 0 && d < 0.8;
    const env = flare ? Math.sin(Math.min(d / 0.8, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // ışık halesi (alev arkasında, nabız atar)
    const pulse = 0.75 + 0.25 * Math.sin(t * k.TAU / 1.8);
    k.glow(0, -66, 78 * pulse + env * 26, 'yellow', 0.28 + env * 0.22);
    // ışık ışınları (dönen hafif)
    ctx.strokeStyle = k.rgba('yellow', 0.22 * pulse);
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * k.TAU + Math.sin(t * 0.7) * 0.08;
      const r1 = 66, r2 = 82 + k.noise1(t * 2 + i * 7) * 8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, -66 + Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, -66 + Math.sin(a) * r2);
      ctx.stroke();
    }

    // sap (ahşap, hafif eğik)
    ctx.save();
    ctx.translate(0, 20);
    ctx.rotate(Math.sin(t * k.TAU / 3.2) * 0.02);
    blob(-11, -30, 22, 128, 10, k.rgba(p.color));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-4, -8, 4, 22, 0.05, 0, k.TAU); ctx.fill();
    // sarma bantları
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    for (const by of [8, 34, 60]) {
      ctx.beginPath(); ctx.moveTo(-11, by); ctx.lineTo(11, by); ctx.stroke();
    }
    // sap ucu
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 98, 13, 7, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(0, 98, 10, 5, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // alev kasesi
    blob(-26, -46, 52, 20, 9, k.rgba('panel2'));

    // alev: üç katman, noise ile dalgalanır
    const flick = k.noise1(t * 9);
    const flick2 = k.noise1(t * 13 + 40);
    const fScale = 1 + env * 0.45;
    const flame = (w, h, c, xOff) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(-w * 0.5 + xOff, -44);
      ctx.quadraticCurveTo(-w * 0.62 + flick * 6, -44 - h * 0.55, flick2 * 7 + xOff, -44 - h * fScale);
      ctx.quadraticCurveTo(w * 0.62 - flick * 5, -44 - h * 0.55, w * 0.5 + xOff, -44);
      ctx.quadraticCurveTo(0, -44 + h * 0.16, -w * 0.5 + xOff, -44);
      ctx.fill();
    };
    flame(52, 52, k.rgba('red', 0.9), 0);
    flame(38, 40, k.rgba('yellow', 0.95), flick * 3);
    flame(20, 26, 'rgba(255,255,255,0.85)', flick2 * 2);
    // alev parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -72, 5, 12, 0.2, 0, k.TAU); ctx.fill();

    // yükselen korlar (döngüsel)
    for (let i = 0; i < 7; i++) {
      const cyc = ((t * 0.55 + k.hash(i) * 1.7) % 1);
      const ex = (k.hash(i + 20) - 0.5) * 44 * (1 - cyc * 0.4);
      const ey = -50 - cyc * 52;
      const ea = (1 - cyc) * 0.9;
      ctx.fillStyle = k.rgba(i % 2 ? 'yellow' : 'red', ea);
      ctx.beginPath(); ctx.ellipse(ex, ey, 2.5 + k.hash(i + 30) * 2, 2.5 + k.hash(i + 30) * 2, 0, 0, k.TAU); ctx.fill();
    }
  },
};
