// courtroom-fx/witness-sweat — gergin tanık: characters ailesi baş+omuz,
// döngüsel idle olarak alından ter damlası süzülür (2.6 sn periyot) + sinir titremesi.
// NOT: canvas y-aşağıdır; boyun tabanı (0,-120).
export default {
  name: 'witness-sweat', category: 'courtroom-fx',
  desc: 'Gergin tanık başı; alından döngüsel olarak ter damlası süzülür',
  tags: ['tanık', 'ter', 'sinir', 'stres', 'gergin', 'mahkeme', 'ifade', 'witness', 'sweat', 'nervous', 'stress', 'court', 'anxiety'],
  box: [-125, -335, 125, -110],
  bleed: 35,
  anchor: 'boyun tabanı (0,-120)',
  points: { head: [0, -268], sweat: [30, -292] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'figür rengi' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'surprised', desc: 'yüz ifadesi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5, line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink');
    const darkOf = c => { const v = k.col(c); return 'rgb(' + Math.round(v[0] * 0.88) + ',' + Math.round(v[1] * 0.88) + ',' + Math.round(v[2] * 0.88) + ')'; };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = darkOf(c); ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = k.rgba(c); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = darkOf(c); ctx.beginPath(); ctx.ellipse(x + 6, y + 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(c); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const gloss = (x, y, rx, ry, a) => {
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.4, 0, k.TAU); ctx.fill();
    };
    const drop = (x, y, s, a) => {
      ctx.fillStyle = k.rgba('cyan', a);
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.bezierCurveTo(x + s * 0.72, y - s * 0.08, x + s * 0.58, y + s * 0.62, x, y + s * 0.62);
      ctx.bezierCurveTo(x - s * 0.58, y + s * 0.62, x - s * 0.72, y - s * 0.08, x, y - s);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath(); ctx.ellipse(x - s * 0.18, y + s * 0.12, s * 0.14, s * 0.24, -0.3, 0, k.TAU); ctx.fill();
    };

    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // sinir titremesi (idle)
    const tx = k.noise1(t * 9 + 3) * 2.2;
    const tr = k.noise1(t * 7 + 11) * 0.03;
    const blink = (t % 3.4) < 0.12 ? 0.15 : 1;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(tx * 0.5, -114, 62, 10, 0, 0, k.TAU); ctx.fill();

    ctx.save(); ctx.translate(tx, 0); ctx.rotate(tr);

    // omuz + boyun
    blob(-78, -200, 156, 78, 26, p.color);
    gloss(-52, -184, 20, 8, 0.10);
    blob(-16, -244, 32, 52, 10, p.color);

    // baş (basık daire, STYLE.md oranları)
    disc(0, -270, 38, 35, p.color);
    gloss(-14, -284, 13, 8, 0.11);

    // yüz
    const ey = -272, ex = 8.4, er = 2.6 * (p.mood === 'surprised' ? 1.35 : 1);
    ctx.fillStyle = inkC;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.ellipse(s * ex, ey, er, er * blink, 0, 0, k.TAU); ctx.fill();
    }
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    for (const s of [-1, 1]) { // kalkık kaşlar (endişe)
      ctx.beginPath(); ctx.moveTo(s * (ex - 7), ey - 11); ctx.lineTo(s * (ex + 7), ey - 8.5); ctx.stroke();
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, -254, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(0, -248, 9, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.arc(0, -250, 7, 0, k.TAU); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-8, -252); ctx.lineTo(8, -252); ctx.stroke(); }
    ctx.restore();

    // döngüsel ter damlası: alın → yanak → düşme (2.6 sn)
    const P = 2.6, ph = (t / P) % 1;
    const hx = tx; // baş yatay konumu
    if (ph < 0.12) {
      const g = ph / 0.12;
      drop(hx + 24, -294, 13 * g, 0.95);
    } else if (ph < 0.45) {
      const g = (ph - 0.12) / 0.33;
      drop(hx + 24 + g * 7, -294 + g * 52, 13, 0.95);
    } else if (ph < 0.8) {
      const g = (ph - 0.45) / 0.35;
      const a = 1 - k.clamp((g - 0.7) / 0.3, 0, 1);
      drop(hx + 31, -242 + g * g * 90, 12, 0.95 * a);
    }
    // kardeş damla: yarı faz kaymalı, sol şakakta
    const ph2 = (ph + 0.5) % 1;
    if (ph2 > 0.1 && ph2 < 0.5) {
      const g = (ph2 - 0.1) / 0.4;
      drop(hx - 26, -290 + g * 40, 8, 0.85 * (1 - g * 0.4));
    }
    // alında duran boncuk (nabızla büyür)
    const bead = 5 + Math.sin(t * k.TAU / 1.3) * 1.2;
    drop(hx - 6, -300, bead, 0.8);

    ctx.restore();
  },
};
