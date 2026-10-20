// progress-fx/trophy-shine — kupa: at anında diyagonal ışık süpürmesi + parıltı yıldızları (0.9 sn).
// Boşta minik bir glint nabız gibi yanıp söner. (0,0) = kaide tabanı.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır.
export default {
  name: 'trophy-shine', category: 'progress-fx',
  desc: 'Altın kupa: parıltı anında ışık bandı kupayı süpürür, parıltı yıldızları saçılır',
  tags: ['kupa', 'trophy', 'ödül', 'award', 'şampiyon', 'champion', 'kazanma', 'win', 'parıltı', 'shine'],
  box: [-120, -130, 120, 120],
  bleed: 60,
  anchor: 'kaide tabanı (0,0)',
  points: { cup: [0, -80], base: [0, 100], handleL: [-62, -75], handleR: [62, -75] },
  params: {
    at: { type: 'time', default: null, desc: 'parıltı anı: ışık süpürmesi + parıltı yıldızları (0.9 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba('dim');

    const star4 = (cx, cy, r, fill) => {
      ctx.fillStyle = fill; ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 4, rr = i % 2 ? r * 0.32 : r;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };

    const ev = d >= 0 && d <= 0.9;
    const g = ev ? k.prog(d, 0, 0.9) : 1;

    // kulplar (arkada)
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.arc(-58, -72, 20, Math.PI * 0.5, Math.PI * 1.55); ctx.stroke();
    ctx.beginPath(); ctx.arc(58, -72, 20, -Math.PI * 0.55, Math.PI * 0.5); ctx.stroke();

    // kupa gövdesi: yukarı genişleyen kadeh formu
    ctx.fillStyle = 'rgba(0,0,0,0.12)';   // sağ alt gölge
    ctx.beginPath();
    ctx.moveTo(-46 + 6, -106); ctx.quadraticCurveTo(-40 + 6, -52, -16 + 6, -38);
    ctx.lineTo(16 + 6, -38); ctx.quadraticCurveTo(40 + 6, -52, 46 + 6, -106);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-48, -110); ctx.quadraticCurveTo(-42, -50, -17, -34);
    ctx.lineTo(17, -34); ctx.quadraticCurveTo(42, -50, 48, -110);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-41, -103); ctx.quadraticCurveTo(-35, -52, -15, -40);
    ctx.lineTo(15, -40); ctx.quadraticCurveTo(35, -52, 41, -103);
    ctx.closePath(); ctx.fill();
    // sol üst parlama (gövde üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-18, -88, 13, 7, -0.6, 0, k.TAU); ctx.fill();
    // kupa ağzı (elips)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -110, 50, 13, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); ctx.ellipse(0, -110, 43, 9, 0, 0, k.TAU); ctx.fill();

    // sap + kaide
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-8 + 5, -40, 22, 106, 8); ctx.fill();
    k.rrect(-44 + 5, 60, 98, 40, 10); ctx.fill();
    ctx.fillStyle = line;
    k.rrect(-11, -43, 22, 106, 8); ctx.fill();
    k.rrect(-47, 57, 94, 40, 10); ctx.fill();
    ctx.fillStyle = body;
    k.rrect(-8, -40, 16, 100, 6); ctx.fill();
    ctx.fillStyle = k.rgba(col);                            // kaideye altın bant
    k.rrect(-44, 60, 88, 34, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-20, 66, 16, 5, 0, 0, k.TAU); ctx.fill();

    // ışık süpürmesi: diyagonal bant kupayı süpürür
    if (ev) {
      const sw = k.prog(d, 0, 0.55);
      const bx = -110 + sw * 220;
      ctx.save();
      ctx.beginPath(); ctx.rect(-70, -130, 140, 140); ctx.clip();
      const sh = ctx.createLinearGradient(bx - 34, -120, bx + 34, 20);
      sh.addColorStop(0, 'rgba(255,255,255,0)');
      sh.addColorStop(0.5, `rgba(255,255,255,${0.55 * (1 - g * 0.5)})`);
      sh.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.moveTo(bx - 34, -130); ctx.lineTo(bx + 34, -130);
      ctx.lineTo(bx - 6, 100); ctx.lineTo(bx - 74, 100);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      // parıltı yıldızları
      for (let i = 0; i < 7; i++) {
        const sg = k.prog(d, i * 0.05, 0.6 + i * 0.05);
        const px = -60 + k.hash(i) * 120, py = -110 + k.hash(i + 40) * 130;
        const pr = (7 + k.hash(i + 80) * 9) * Math.sin(Math.PI * sg);
        if (pr > 0.5) star4(px, py, pr, k.rgba(col, 1 - g * 0.6));
      }
    }

    // idle: kupanın sol üstünde minik glint yanıp sönmesi
    if (!ev) {
      const blink = Math.pow(Math.max(0, Math.sin(t * 1.7)), 8);
      if (blink > 0.02) star4(-28, -96, 8 * blink + 3, k.rgba(col, blink * 0.9));
    }
    ctx.restore();
  },
};
