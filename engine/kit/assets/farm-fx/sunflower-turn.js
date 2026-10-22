// farm-fx/sunflower-turn — güneşe dönen ayçiçeği, önden görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) sap tabanıdır.
export default {
  name: 'sunflower-turn', category: 'farm-fx',
  desc: 'Güneşe dönen ayçiçeği; başı yavaşça güneşi takip eder, turn anında hızlıca döner',
  tags: ['ayçiçeği', 'çiçek', 'güneş', 'bitki', 'tarla', 'sunflower', 'flower', 'sun', 'plant'],
  box: [-125, -215, 125, 20],
  bleed: 45,
  anchor: 'sap tabanı (0,0)',
  points: { head: [0, -168], stem: [0, -80] },
  params: {
    color: { type: 'color', default: 'green' },
    turn: { type: 'time', default: null, desc: 'güneşe hızlı dönüş — baş 0.8 snde hedefine döner' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const stem = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const petalC = k.rgba('yellow'), coreC = k.rgba('dim');
    const df = p.turn == null ? -1 : t - p.turn;
    const turning = df >= 0 && df < 0.8;
    const te = turning ? 1 - Math.pow(1 - df / 0.8, 3) : 0;    // ease-out dönüş
    const baseAng = 0.55 * Math.sin(t * k.TAU / 7);            // yavaş güneş takibi (idle)
    const ang = baseAng + te * 1.8;                           // olayda hızlı dönüş
    const topX = Math.sin(ang) * 26;                          // sap başa doğru eğilir
    const topY = -158;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const rbox = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin otları
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;
    for (const [gx, ga] of [[-34, -0.4], [-20, 0.15], [24, -0.1], [38, 0.35]]) {
      ctx.beginPath(); ctx.moveTo(gx, 2);
      ctx.quadraticCurveTo(gx + ga * 30, -18, gx + ga * 44, -30); ctx.stroke();
    }

    // sap (tabandan başa hafif eğri)
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(topX * 0.25, -80, topX, topY + 14); ctx.stroke();
    ctx.strokeStyle = stem; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(topX * 0.25, -80, topX, topY + 14); ctx.stroke();

    // yapraklar (hafif çırpınır)
    for (const [ly, side, ls] of [[-92, -1, 1], [-58, 1, 0.85]]) {
      const flut = k.noise1(t * 2.2 + ls * 9) * 0.12;
      const lx = topX * 0.25 * (1 + ly / topY);
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(side * (0.55 + flut));
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(side * 30, 0, 33, 15, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = stem; ctx.beginPath(); ctx.ellipse(side * 30, 0, 29, 12, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // baş (taç yapraklar + tohum tablası)
    ctx.save(); ctx.translate(topX, topY); ctx.rotate(ang * 0.35);
    for (let i = 0; i < 12; i++) {                             // taç yapraklar (vurgu: sarı)
      const a = i * k.TAU / 12 + (turning ? Math.sin(df * k.TAU * 2) * 0.08 : 0);
      ctx.save(); ctx.rotate(a); ctx.translate(0, -46);
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 0, 15, 26, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = petalC; ctx.beginPath(); ctx.ellipse(0, 0, 12, 23, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    disc(0, 0, 30, 30, coreC);                                 // tohum tablası
    ctx.fillStyle = inkC;                                      // tohum dokusu
    for (let i = 0; i < 10; i++) {
      const a = k.hash(i * 31 + 5) * k.TAU, rr = 6 + k.hash(i * 31 + 8) * 18;
      ctx.beginPath(); ctx.ellipse(Math.cos(a) * rr, Math.sin(a) * rr, 2.6, 2.6, 0, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -16, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
