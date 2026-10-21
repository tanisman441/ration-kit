// traffic-fx/drift-smoke — drift: yana kayan otomobilin arkasında duman bulutları.
// ANIMASYON: `at` anında 1.2 sn drift — araba kayar, 8 duman bulutu büyüyüp söner;
// idle'da araba hafif seker, arka tekerlerden ince duman sızar. Tek vurgu: yellow (far).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'drift-smoke',
  category: 'traffic-fx',
  desc: 'Drift yapan otomobil; at anında kayar ve ardında duman bulutları bırakır',
  tags: ['drift', 'duman', 'otomobil', 'araba', 'kayma', 'yanlama', 'yarış', 'tekerlek', 'car', 'smoke', 'race', 'slide'],
  box: [-140, -80, 140, 80],
  bleed: 60,
  anchor: 'araba merkezi (0,0)',
  points: { nose: [100, -10], tail: [-100, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'drift anı: 1.2 sn kayma + duman bulutları' },
    color: { type: 'color', default: 'dim', desc: 'gövde rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const drifting = d >= 0 && d < 1.2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- duman: driftte büyük bulutlar, idle'da ince sızı ---
    const puffs = drifting ? 8 : 2;
    for (let i = 0; i < puffs; i++) {
      let life, span;
      if (drifting) { life = d - i * 0.09; span = 0.9; }
      else { life = (t * 0.6 + i * 0.5) % 1.0; span = 1.0; }
      if (life < 0) continue;
      const q = k.prog(life, 0, span);
      const px = -80 - i * (drifting ? 16 : 22) + (k.hash(i * 7 + 3) - 0.5) * 14;
      const py = 26 - (drifting ? 52 : 30) * q + (k.hash(i * 11 + 5) - 0.5) * 12;
      const s = (drifting ? 19 + i * 3.2 : 9) * (0.6 + q * 0.9);
      ctx.fillStyle = k.rgba('dim', (drifting ? 0.62 : 0.3) * (1 - q));
      ctx.beginPath(); ctx.arc(px, py, s, 0, k.TAU); ctx.fill();
    }

    // --- hız çizgileri: driftte arabanın arkasında ---
    if (drifting) {
      const env = 1 - d / 1.2;
      ctx.strokeStyle = k.rgba('ink', 0.4 * env);
      ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const yy = -20 + i * 18 + (k.hash(i * 5 + 9) - 0.5) * 8;
        const len = 60 + k.hash(i * 3) * 30;
        ctx.beginPath();
        ctx.moveTo(-105 - len * env, yy);
        ctx.lineTo(-105, yy);
        ctx.stroke();
      }
    }

    // --- araba: driftte sağa kayar + hafif yatar; idle'da seker ---
    const dq = drifting ? k.prog(d, 0, 0.5) : 0;
    const cx = dq * 34;
    const cy = drifting ? Math.sin(d * 30) * 1.5 : k.noise1(t * 1.5) * 2;
    const tilt = drifting ? -0.05 * (1 - d / 1.2) : 0;
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(tilt);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(0, 52, 100, 9, 0, 0, k.TAU); ctx.fill();

    // --- gövde: sağ alt gölge, gövde, sol üst parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-89, -32, 190, 58, 18); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-95, -38, 190, 58, 18); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-60, -26, 26, 10, -0.3, 0, k.TAU); ctx.fill();

    // --- kabin + camlar ---
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-50, -64, 96, 34, 12); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-40, -58, 38, 22, 8); ctx.fill();
    ctx.beginPath(); k.rrect(4, -58, 34, 22, 8); ctx.fill();

    // --- far (vurgu) + stop ---
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); k.rrect(86, -18, 10, 14, 4); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-96, -18, 10, 14, 4); ctx.fill();

    ctx.strokeStyle = k.rgba('bg', 0.6);
    ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-95, -38, 190, 58, 18); ctx.stroke();
    ctx.beginPath(); k.rrect(-50, -64, 96, 34, 12); ctx.stroke();
    ctx.restore();

    // --- tekerlekler: driftte hızlı döner ---
    const spin = t * (drifting ? 20 : 3);
    for (const wx of [-55, 55]) {
      const bx = wx + cx, byy = 28 + cy;
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); ctx.arc(bx, byy, 22, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.6);
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(bx, byy, 22, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('dim', 0.9);
      ctx.lineWidth = 4;
      for (let s = 0; s < 4; s++) {
        const a = spin + (s / 4) * k.TAU;
        ctx.beginPath();
        ctx.moveTo(bx, byy);
        ctx.lineTo(bx + Math.cos(a) * 13, byy + Math.sin(a) * 13);
        ctx.stroke();
      }
      ctx.fillStyle = k.rgba('#ffffff', 0.08);
      ctx.beginPath(); ctx.ellipse(bx - 7, byy - 8, 6, 9, 0.5, 0, k.TAU); ctx.fill();
    }
  },
};
