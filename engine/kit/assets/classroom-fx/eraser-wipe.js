// classroom-fx/eraser-wipe — tahta silgisiyle silme: at anında silgi 1 snde iki geçiş yapar
// (sağa + sola), geride temiz şerit bırakır, tebeşir tozu zerrecikleri saçılır;
// idle'da silgi park hâlinde hafif eğim sallanır.
// canvas y-aşağı; (0,0) tahta merkezi.
export default {
  name: 'eraser-wipe', category: 'classroom-fx',
  desc: 'Tahta silgisiyle silme: iki geçiş, temizlenen şerit ve toz zerrecikleri',
  tags: ['silgi', 'tahta silgisi', 'silme', 'temizleme', 'eraser', 'wipe', 'board', 'toz', 'dust', 'sınıf'],
  box: [-115, -65, 115, 65],
  bleed: 20,
  anchor: 'tahta merkezi',
  points: { eraser: [0, 6], board: [-95, -45] },
  params: {
    color: { type: 'color', default: 'red', desc: 'silgi gövde rengi' },
    at: { type: 'time', default: null, desc: 'silme anı — 1 snde iki geçiş + toz' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round';

    // tahta: çerçeve + yazı alanı
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-99, -49, 206, 106, 12); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-105, -55, 210, 110, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-96, -46, 192, 92, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -32, 32, 10, -0.25, 0, k.TAU); ctx.fill();

    // tebeşir karalamaları (dalgalı 3 satır)
    const scrib = a => {
      ctx.strokeStyle = k.rgba('ink', a); ctx.lineWidth = 3;
      for (let r = 0; r < 3; r++) {
        const yy = -24 + r * 24;
        ctx.beginPath();
        for (let x = -84; x <= 84; x += 6) {
          const y = yy + k.noise1(x * 0.09 + r * 40) * 8;
          x === -84 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };
    scrib(0.7);

    // silgi konumu: park (-65) → iki geçiş
    let ex = -65, rot = 0.03 * Math.sin(t * 2);
    if (d >= 0 && d < 1.0) {
      if (d < 0.5) ex = k.lerp(-65, 65, k.E.inOutCubic(d / 0.5));
      else ex = k.lerp(65, -65, k.E.inOutCubic((d - 0.5) / 0.5));
      rot = 0.08 * Math.sin(d * 20);
    } else if (d >= 1.0) { ex = -65; }

    // temizlenen alan: silginin geçtiği şeridi tahta rengiyle kapat
    if (d >= 0) {
      ctx.fillStyle = k.rgba('panel2', 1);
      if (d < 0.5) { ctx.fillRect(-96, -46, ex + 24 + 96, 92); }
      else { ctx.fillRect(-96, -46, 192, 92); }
      // temiz şeridin ıslak parıltısı
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.fillRect(-96, -46, 192, 20);
    }

    // toz zerrecikleri: süpürme sırasında silgiden dökülür
    if (d >= 0 && d < 1.5) {
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 61 + 3), h2 = k.hash(i * 67 + 17);
        const start = h1 * 1.0, dd = d - start;
        if (dd < 0 || dd > 0.55) continue;
        const se = d < 0.5
          ? k.lerp(-65, 65, k.E.inOutCubic(Math.max(0, Math.min(start, 0.5)) / 0.5))
          : k.lerp(65, -65, k.E.inOutCubic(Math.max(0, Math.min(start - 0.5, 0.5)) / 0.5));
        const dx = se + (h1 - 0.5) * 40 - dd * 30, dy = 18 + dd * 46;
        ctx.fillStyle = k.rgba('ink', 0.75 * (1 - dd / 0.55));
        ctx.beginPath(); ctx.arc(dx, dy, 1.5 + h2 * 2.5, 0, k.TAU); ctx.fill();
      }
    }

    // silgi: gövde + keçe taban
    const ey = 6;
    ctx.save();
    ctx.translate(ex, ey); ctx.rotate(rot);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-19, -9, 44, 28, 7); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-24, -16, 48, 32, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-22, -14, 44, 24, 7); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-22, 4, 44, 8, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, -8, 12, 5, -0.2, 0, k.TAU); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
