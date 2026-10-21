// traffic-fx/airbag-pop — hava yastığı: direksiyon simidi; at anında kapak açılır, yastık şişip yerleşir.
// ANIMASYON: `at` anında 0.12 sn flaş + 0.35 sn şişme, 1.2 sn'de yumuşak yerleşme;
// idle'da direksiyonda hafif salınım. Vurgu rengi yok (gövde dim/panel2).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'airbag-pop',
  category: 'traffic-fx',
  desc: 'Direksiyon simidi; at anında hava yastığı açılır, şişer ve yerleşir',
  tags: ['hava yastığı', 'airbag', 'direksiyon', 'kaza', 'güvenlik', 'çarpışma', 'kurtarma', 'steering', 'wheel', 'crash', 'safety'],
  box: [-110, -90, 110, 90],
  bleed: 70,
  anchor: 'direksiyon merkezi (0,0)',
  points: { bag: [0, -30], hub: [0, 14] },
  params: {
    at: { type: 'time', default: null, desc: 'açılma anı: 0.12 sn flaş, 0.35 sn şişme, 1.2 sn yerleşme' },
    color: { type: 'color', default: 'panel2', desc: 'yastık rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const popping = d >= 0 && d < 1.2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const R = 72;

    // --- direksiyon kolonu ---
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-12, 60, 24, 34, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-12, 60, 24, 34, 8); ctx.stroke();

    // --- simit: hafif salınım + sağ alt gölge ---
    const sway = k.noise1(t * 0.7) * 0.03;
    ctx.save();
    ctx.translate(0, 0); ctx.rotate(sway);
    ctx.strokeStyle = k.rgba('bg', 0.12);
    ctx.lineWidth = 18;
    ctx.beginPath(); ctx.arc(6, 6, R, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-30, -52, 16, 10, -0.6, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();

    // kollar: merkezden simite
    ctx.strokeStyle = k.rgba('dim');
    ctx.lineWidth = 14;
    for (const sa of [0.5, Math.PI - 0.5, Math.PI / 2]) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(sa) * 18, Math.sin(sa) * 18);
      ctx.lineTo(Math.cos(sa) * (R - 6), Math.sin(sa) * (R - 6));
      ctx.stroke();
    }
    ctx.restore();

    // --- göbek kapağı: at anında iki kanat açılır ---
    const openQ = popping ? k.prog(d, 0, 0.15) : (d >= 1.2 ? 1 : 0);
    ctx.save();
    // sol kanat
    ctx.translate(-26, 14); ctx.rotate(-openQ * 1.2); ctx.translate(26, -14);
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-26, 2, 26, 24, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-26, 2, 26, 24, 8); ctx.stroke();
    ctx.restore();
    ctx.save();
    // sağ kanat
    ctx.translate(26, 14); ctx.rotate(openQ * 1.2); ctx.translate(-26, -14);
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(0, 2, 26, 24, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(0, 2, 26, 24, 8); ctx.stroke();
    ctx.restore();

    // --- açılma flaşı ---
    if (d >= 0 && d < 0.15) k.glow(0, -10, 70, '#ffffff', 0.5 * (1 - d / 0.15));

    // --- yastık: şişer, sonra hafifçe çöküp yerleşir ---
    if (popping || d >= 1.2) {
      const grow = k.prog(d, 0.05, 0.35);
      const settle = d > 0.35 ? k.prog(d, 0.35, 1.2) : 0;
      const s = (0.2 + 0.8 * grow) * (1 - 0.07 * settle);
      const bagY = -14 - 10 * settle;
      ctx.save();
      ctx.translate(0, bagY); ctx.scale(s, s);
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.arc(5, 5, 46, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(0, 0, 46, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);
      ctx.beginPath(); ctx.ellipse(-14, -16, 13, 18, 0.5, 0, k.TAU); ctx.fill();
      // dikişler
      ctx.strokeStyle = k.rgba('ink', 0.35);
      ctx.lineWidth = 3;
      for (const off of [-18, 18]) {
        ctx.beginPath(); ctx.arc(0, off * 0.4, 30, -1.1 + off * 0.01, 1.1 + off * 0.01); ctx.stroke();
      }
      ctx.strokeStyle = k.rgba('bg', 0.6);
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 46, 0, k.TAU); ctx.stroke();
      ctx.restore();

      // toz bulutu: söner
      if (d < 0.8) {
        for (let i = 0; i < 4; i++) {
          const life = d - i * 0.05;
          if (life < 0) continue;
          const q = k.prog(life, 0, 0.7);
          const px = (k.hash(i * 3 + 2) - 0.5) * 90;
          const py = -20 - 30 * q + (k.hash(i * 11) - 0.5) * 20;
          ctx.fillStyle = k.rgba('dim', 0.4 * (1 - q));
          ctx.beginPath(); ctx.arc(px, py, 12 + 14 * q, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};
