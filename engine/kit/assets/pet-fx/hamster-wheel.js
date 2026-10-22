// pet-fx/hamster-wheel — çarkta koşan hamster; speed çark hızını, trip tökezlemeyi yönetir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) zemindir, çark merkezi (0,-92)'dedir.
export default {
  name: 'hamster-wheel', category: 'pet-fx',
  desc: 'Dönen çarkın içinde koşan hamster; speed hızı belirler, trip anında tökezleyip takla atar',
  tags: ['hamster', 'evcil hayvan', 'çark', 'koşma', 'kemirgen', 'kafes', 'hamster', 'wheel', 'pet', 'run', 'rodent'],
  box: [-125, -200, 125, 15],
  bleed: 55,
  anchor: 'zemin (0,0); çark merkezi (0,-92)',
  points: { hub: [0, -92], top: [0, -176], ground: [0, 0] },
  params: {
    color: { type: 'color', default: 'panel2' },
    speed: { type: 'number', default: 0.5, desc: 'çark hızı 0–1 — dönüş hızı ve bacak temposu' },
    trip: { type: 'time', default: null, desc: 'tökezleme anı — hamster takla atar, çark sallar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const fur = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const spd = Math.min(Math.max(p.speed == null ? 0.5 : p.speed, 0), 1);
    const dtr = p.trip == null ? -1 : t - p.trip;
    const tripping = dtr >= 0 && dtr < 0.9;
    const trE = tripping ? Math.min(dtr / 0.9, 1) : 0;
    const trEnv = tripping ? Math.sin(trE * Math.PI) : 0;
    const wheelA = t * spd * 7 + (tripping ? Math.sin(dtr * 18) * 0.12 : 0); // çark dönüşü
    const legF = 4 + spd * 14;                          // bacak temposu
    const R = 78, cx = 0, cyy = -92;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

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

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -3, 100, 10, 0, 0, k.TAU); ctx.fill();

    // ayak (A sehpa)
    limb(-52, -10, 0, -52, 11, fur);
    limb(52, -10, 0, -52, 11, fur);
    limb(-30, -10, -14, -52, 9, fur);
    limb(30, -10, 14, -52, 9, fur);
    disc(0, -52, 9, 9, fur);   // mil yatağı

    // çark: dış halka
    ctx.strokeStyle = line; ctx.lineWidth = 9 + LW;
    ctx.beginPath(); ctx.arc(cx, cyy, R, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = fur; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(cx, cyy, R, 0, k.TAU); ctx.stroke();
    // dönen parmaklıklar (speed'e göre)
    ctx.save(); ctx.translate(cx, cyy); ctx.rotate(wheelA);
    for (let i = 0; i < 8; i++) {
      const a = i * k.TAU / 8;
      ctx.strokeStyle = line; ctx.lineWidth = 5 + LW;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (R - 6), Math.sin(a) * (R - 6)); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (R - 6), Math.sin(a) * (R - 6)); ctx.stroke();
    }
    ctx.restore();
    // cam parlaması (sol üst)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(cx, cyy, R - 8, Math.PI * 1.05, Math.PI * 1.4); ctx.stroke();
    // mil
    disc(cx, cyy, 10, 10, fur);

    // hamster: çarkın içinde alt kısımda koşar
    const hx = 6, hy = cyy + R - 34 + Math.sin(t * legF) * (tripping ? 2 : 4);
    ctx.save(); ctx.translate(hx, hy);
    if (tripping) ctx.rotate(trE * k.TAU * 0.75);   // takla
    // bacaklar: hızlı koşma (speed'e göre)
    const lp = Math.sin(t * legF);
    limb(-12, 8, -12 + lp * 12, 26, 9, fur);
    limb(12, 8, 12 - lp * 12, 26, 9, fur);
    // gövde
    disc(0, -6, 30, 26, fur);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -18, 10, 8, -0.4, 0, k.TAU); ctx.fill();
    // yanak keseleri
    disc(-16, 2, 9, 8, fur); disc(16, 2, 9, 8, fur);
    // kulaklar
    disc(-16, -30, 9, 9, fur); disc(16, -30, 9, 9, fur);
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath(); ctx.ellipse(-16, -30, 4, 4, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(16, -30, 4, 4, 0, 0, k.TAU); ctx.fill();
    // gözler: tökezlerken şaşkın (O ağız)
    ctx.fillStyle = inkC;
    const er = tripping ? 4.6 : 3.6;
    ctx.beginPath(); ctx.ellipse(-10, -12, er, er, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10, -12, er, er, 0, 0, k.TAU); ctx.fill();
    if (tripping) {
      ctx.strokeStyle = inkC; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 2, 4, 0, k.TAU); ctx.stroke();
    } else {
      ctx.strokeStyle = inkC; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 6, 0.4, Math.PI - 0.4); ctx.stroke();
    }
    // burun
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); ctx.ellipse(0, -4, 3.5, 3, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // tökezleme yıldızları
    if (tripping) {
      for (let i = 0; i < 4; i++) {
        const a = k.hash(i * 17 + 5) * k.TAU;
        const rr = 46 + dtr * 60;
        const sx = hx + Math.cos(a) * rr, sy = hy - 10 + Math.sin(a) * rr;
        ctx.fillStyle = k.rgba('yellow', 0.85 * (1 - trE));
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(a + dtr * 6);
        ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(2.5, -2.5); ctx.lineTo(7, 0);
        ctx.lineTo(2.5, 2.5); ctx.lineTo(0, 7); ctx.lineTo(-2.5, 2.5);
        ctx.lineTo(-7, 0); ctx.lineTo(-2.5, -2.5); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }
  },
};
