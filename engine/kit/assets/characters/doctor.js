// characters/doctor — doktor; person ailesinden, beyaz önlük + stetoskop.
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'doctor',
  category: 'characters',
  desc: 'Doktor; beyaz önlük ve boyunda stetoskop, 3 ruh hali',
  tags: ['doktor', 'hekim', 'sağlık', 'stetoskop', 'doctor', 'physician', 'medic', 'healthcare'],
  box: [-95, -292, 95, 12],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~290 birim',
  points: { head: [0, -276], chest: [0, -184] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'surprised'], default: 'neutral' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const coat = k.rgba('panel2'), tube = k.rgba('cyan', 0.9);
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 13, -22, 20, body);
      blob(s * 13 - 12, -13, 24, 13, 6, body);
    }

    // gövde + önlük
    blob(-31, -240 - br * 0.4, 62, 112, 28, body);
    const cy = -240 - br * 0.4;
    // önlük: iki panel (panel2)
    ctx.fillStyle = coat;
    ctx.beginPath(); k.rrect(-27, cy + 6, 23, 100, 10); ctx.fill();
    ctx.beginPath(); k.rrect(4, cy + 6, 23, 100, 10); ctx.fill();
    // V yaka
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-14, cy + 8); ctx.lineTo(0, cy + 34); ctx.lineTo(14, cy + 8);
    ctx.lineTo(7, cy + 8); ctx.lineTo(0, cy + 24); ctx.lineTo(-7, cy + 8); ctx.closePath(); ctx.fill();
    // önlük cebi
    ctx.fillStyle = k.rgba('bg', 0.4);
    ctx.beginPath(); k.rrect(8, cy + 58, 15, 14, 3); ctx.fill();

    // kollar (önlük rengi kollar)
    for (const s of [-1, 1]) {
      limb(s * 29, shoY, s * 37, -134, 18, coat);
      disc(s * 37, -130, 10, 10, body);
    }

    // stetoskop: boyunda halka + göğüste diyafram
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.ellipse(0, cy + 22, 20, 14, 0, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = tube; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, cy + 22, 20, 14, 0, 0, k.TAU); ctx.stroke();
    // sarkan uç + diyafram
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(14, cy + 30); ctx.lineTo(24, cy + 62); ctx.stroke();
    ctx.strokeStyle = tube; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(14, cy + 30); ctx.lineTo(24, cy + 62); ctx.stroke();
    disc(24, cy + 68, 8, 8, k.rgba('ink'));

    // baş
    const hy = -250 - br * 0.6;
    disc(0, hy, 36, 34, body);

    // yüz (person dili)
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
  },
};
