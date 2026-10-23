// police-fx/roadblock-rise — polis bariyeri: at anında kol 0.6 sn'de kalkar (tıkırtı flaşı + sarsıntı); kapalı dururken hafif titrer.
// NOT: canvas y-aşağıdır; (0,0) sol direk kaidesi. Orijinal tasarım.
export default {
  name: 'roadblock-rise',
  category: 'police-fx',
  desc: 'Polis bariyeri: at anında kol kalkar (tıkırtı flaşı), kapalıysa hafif titrer',
  tags: ['bariyer', 'polis', 'yol', 'kontrol', 'kapan', 'roadblock', 'barrier', 'police', 'checkpoint', 'gate'],
  box: [-165, -300, 205, 40],
  bleed: 50,
  anchor: 'sol direk kaidesi (0,0)',
  points: { hinge: [0, -104], armTip: [140, -104] },
  params: {
    at: { type: 'time', default: null, desc: 'bariyer kalkış anı (0.6 sn, tıkırtı flaşı)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color, 1);
    const ink = k.rgba('ink', 1);

    const d = p.at == null ? -1 : t - p.at;
    // kol açısı: 0 = kapalı (yatay), -1.25 rad = açık (~72° yukarı)
    let ang;
    if (d < 0) ang = 0;
    else if (d < 0.6) ang = k.lerp(0, -1.25, k.E.outCubic(Math.min(d / 0.6, 1)));
    else ang = -1.25;
    // kapalıysa idle titreme; kalkışta mekanik sarsıntı
    const tremble = d < 0 ? k.noise1(t * 7) * 1.2 : (d < 0.5 ? Math.sin(d * 50) * 2.5 * (1 - d / 0.5) : 0);

    const blob = (x, y, wd, h, r, c = col) => {
      ctx.fillStyle = O; k.rrect(x - LW / 2, y - LW / 2, wd + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; k.rrect(x, y, wd, h, r); ctx.fill();
    };

    // kaide + direk (sol)
    blob(-16, -14, 32, 14, 6, ink);
    blob(-11, -118, 22, 108, 8);
    // küçük çakar tepede
    const bl = 0.5 + 0.5 * Math.sin(t * 5);
    ctx.fillStyle = k.rgba('red', 0.4 + 0.6 * bl);
    ctx.beginPath(); ctx.arc(0, -128, 9, 0, k.TAU); ctx.fill();
    k.glow(0, -128, 16 + 10 * bl, 'red', 0.35 * bl);

    // menteşe kutusu
    blob(-16, -118, 34, 30, 8, ink);

    // kol: menteşeden döner (170 birim sağa uzanır)
    ctx.save();
    ctx.translate(0, -103);
    ctx.rotate(ang + tremble * 0.004);
    // kol gövdesi
    ctx.fillStyle = O; k.rrect(-8 - LW / 2, -13 - LW / 2, 186 + LW, 26 + LW, 10); ctx.fill();
    ctx.fillStyle = col; k.rrect(-8, -13, 186, 26, 10); ctx.fill();
    // kırmızı-beyaz şeritler
    ctx.save();
    ctx.beginPath(); k.rrect(-8, -13, 186, 26, 10); ctx.clip();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? k.rgba('red', 1) : k.rgba('panel', 1);
      ctx.fillRect(-8 + i * 37, -13, 37, 26);
    }
    ctx.restore();
    // kol ucu reflektör
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(168, 0, 8, 0, k.TAU); ctx.fill();
    // premium parlama: kol sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(40, -7, 46, 6, -0.1, 0, k.TAU); ctx.fill();
    ctx.restore();

    // menteşe vidası
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(2, -103, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(2, -103, 7, 0, k.TAU); ctx.fill();

    // tıkırtı flaşı (kalkış anında, 0.15 sn)
    if (d >= 0 && d < 0.15) {
      const f = 1 - d / 0.15;
      k.glow(2, -103, 30 + 30 * f, 'yellow', 0.5 * f);
    }

    // sağ destek direği (kol ucunun altında) — sadece referans
    blob(158, -34, 22, 34, 8);

    // sağ alt gölge (kol altında)
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(0, -96, 170, 10, 5); ctx.fill();

    ctx.restore();
  },
};
