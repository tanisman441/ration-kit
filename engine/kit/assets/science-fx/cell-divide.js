// science-fx/cell-divide — hücre bölünmesi; `at` anında iki yavru hücreye ayrılır.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'cell-divide',
  category: 'science-fx',
  desc: 'Hücre: at anında ortadan boğumlanıp iki yavru hücreye ayrılır, çekirdekler bölünür',
  tags: ['hücre', 'bölünme', 'mitoz', 'biyoloji', 'çekirdek', 'yavru hücre', 'cell divide', 'mitosis', 'biology'],
  box: [-235, -135, 235, 135],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: { left: [-95, 0], right: [95, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'bölünmenin başlama anı (~1.1 sn sürer)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const acc = 'cyan';
    ctx.save();
    ctx.lineCap = 'round';

    const g = d < 0 ? 0 : k.prog(d, 0, 1.1);
    const breath = Math.sin(t * k.TAU / 2.4) * 2;

    // organik zar (noise ile hafif titrer)
    const blob = (cx, cy, r, seed) => {
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const a = (i / 28) * k.TAU;
        const q = r * (1 + k.noise1(seed + i * 0.55 + t * 1.2) * 0.06);
        const x = cx + Math.cos(a) * q, y = cy + Math.sin(a) * q * 0.86;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    // bölünme öncesi çekirdek — at'e 0.5 sn kala gerilir (uzar)
    const preStretch = d < 0 ? 0 : k.clamp(-d / 0.5, 0, 1) * (1 - g);

    const drawInner = (cx, cy, s) => {
      // çekirdek (bölünmede uzar, sonra ikiye ayrılır)
      const nr = 30 * s;
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.ellipse(cx, cy, nr * (1 + preStretch * 0.5), nr * (1 - preStretch * 0.25), 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(acc, 0.9);
      ctx.beginPath(); ctx.ellipse(cx, cy, (nr - 5) * (1 + preStretch * 0.5), (nr - 5) * (1 - preStretch * 0.25), 0, 0, k.TAU); ctx.fill();
      // kromozom çizgileri (bölünme yaklaşınca belirir)
      if (preStretch > 0.05 || g > 0) {
        ctx.strokeStyle = k.rgba('ink', 0.7 * Math.max(preStretch, g < 0.6 ? g : 1 - g));
        ctx.lineWidth = 3;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + i * 12 - 6, cy - 14); ctx.lineTo(cx + i * 12 + 6, cy + 14);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(cx - 10 * s, cy - 11 * s, 10 * s, 7 * s, -0.4, 0, k.TAU); ctx.fill();
      k.glow(cx, cy, 48 * s, acc, 0.22);
      // organeller — sitoplazmada yüzer
      for (let i = 0; i < 8; i++) {
        const a = k.hash(i * 13 + 2) * k.TAU, r = (46 + k.hash(i * 7 + 3) * 26) * s;
        const ox = cx + Math.cos(a) * r + k.noise1(i * 3 + t * 0.8) * 6;
        const oy = cy + Math.sin(a) * r * 0.8 + k.noise1(i * 5 + t * 0.8) * 6;
        ctx.fillStyle = k.rgba(acc, 0.45);
        ctx.beginPath(); ctx.arc(ox, oy, (3.5 + k.hash(i * 11) * 3.5) * s, 0, k.TAU); ctx.fill();
      }
    };

    const drawBody = (cx, cy, r, seed) => {
      ctx.fillStyle = k.rgba('bg', 0.55);
      blob(cx, cy, r + 7, seed); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 0.85);
      blob(cx, cy, r, seed); ctx.fill();
    };

    if (g === 0) {
      drawBody(0, breath * 0.5, 106, 3.1);
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-46, -58, 30, 18, -0.5, 0, k.TAU); ctx.fill();
      drawInner(0, breath * 0.5, 1);
    } else {
      // iki yavru hücre ayrılır
      const sep = 30 + g * 78;
      for (const sgn of [-1, 1]) {
        const cx = sgn * sep, cy = breath * 0.5 * (1 - g);
        drawBody(cx, cy, 68, 3.1 + sgn);
        drawInner(cx, cy, 0.68);
      }
      // aradaki ince sitoplazma köprüsü (erken safhada)
      if (g < 0.45) {
        const bf = 1 - g / 0.45;
        ctx.strokeStyle = k.rgba('dim', 0.75 * bf);
        ctx.lineWidth = 18 * bf + 2;
        ctx.beginPath(); ctx.moveTo(-sep + 40, 0); ctx.lineTo(sep - 40, 0); ctx.stroke();
      }
      // bölünme flaşı
      if (d < 0.35) {
        k.glow(0, 0, 60 * (1 - d / 0.35), acc, 0.3 * (1 - d / 0.35));
      }
    }

    ctx.restore();
  },
};
