// city-fx/fountain-jets — döngüsel su fıskiyesi; basınçla yükselen parabolik jetler.
// ANIMASYON: sürekli döngü — 3 yan jet + 1 dikey jet dalgalanır (yükseklik salınımı,
// ~2.6 sn periyot), damlacıklar jet boyunca fırlar ve söner. `pressure` jet gücünü
// (0–1) belirler. Tek vurgu: su (cyan). Contract: engine/kit/ASSETS.md
export default {
  name: 'fountain-jets',
  category: 'city-fx',
  desc: 'Yuvarlak havuzlu fıskiye; basınçla dalgalanan parabolik su jetleri ve damlacıklar',
  tags: ['fıskiye', 'fıskiyeli havuz', 'su', 'çeşme', 'park', 'şehir', 'su jeti', 'fountain', 'water jets', 'park', 'city', 'water'],
  box: [-135, -145, 135, 145],
  bleed: 60,
  anchor: 'havuz tabanı (0,145)',
  points: { top: [0, -8] },
  params: {
    pressure: { type: 'number', default: 0.7, desc: 'su basıncı (0–1): jet yüksekliği ve damlacık sayısı' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const pr = k.clamp(p.pressure ?? 0.7, 0, 1);
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const water = k.rgba(p.color);

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- havuz gövdesi ---
    plate(-118, 74, 236, 62, 26, k.rgba('dim'));
    // su yüzeyi
    ctx.fillStyle = k.rgba(p.color, 0.35);
    ctx.beginPath(); ctx.ellipse(0, 84, 104, 16, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.18);
    ctx.beginPath(); ctx.ellipse(-38, 80, 30, 6, -0.12, 0, k.TAU); ctx.fill();
    // dalga çizgileri (döngülü kayma)
    ctx.strokeStyle = k.rgba(p.color, 0.55); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const wy = 84 + (i - 1) * 6;
      const off = Math.sin(t * 2.2 + i * 2.1) * 10;
      ctx.beginPath();
      for (let x = -90; x <= 90; x += 10) {
        const yy = wy + Math.sin((x + off) * 0.12) * 3;
        x === -90 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    // --- orta sütun / nozul ---
    plate(-16, 8, 32, 76, 12, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.ellipse(0, 8, 14, 7, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-7, 30, 6, 16, 0.1, 0, k.TAU); ctx.fill();

    // --- jetler: parabolik yörüngeler ---
    // jet tanımı: yatay menzil + tepe yüksekliği; yükseklik dalgalanır
    const jets = [
      { range: -88, apex: 96, ph: 0 },
      { range: -44, apex: 66, ph: 1.7 },
      { range: 0, apex: 118, ph: 3.4, vertical: true },
      { range: 44, apex: 66, ph: 5.1 },
      { range: 88, apex: 96, ph: 2.5 },
    ];
    const wave = s => 0.78 + 0.22 * Math.sin(t * 2.4 + s); // dalgalanma
    ctx.lineCap = 'round';
    for (const j of jets) {
      const h = j.apex * (0.35 + 0.65 * pr) * wave(j.ph);
      const steps = 26;
      ctx.strokeStyle = k.rgba(p.color, 0.75); ctx.lineWidth = 6;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const s = i / steps;
        const x = j.range * s;
        // parabol (tepe s=0.5'te) ya da dikey jet
        const yy = j.vertical ? 6 - h * s : 6 - h * 4 * s * (1 - s);
        i === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
      // jet tabanında köpük
      ctx.fillStyle = k.rgba('#ffffff', 0.5 * (0.4 + 0.6 * pr));
      ctx.beginPath(); ctx.arc(0, 6, 7 + 3 * wave(j.ph), 0, k.TAU); ctx.fill();
    }
    // --- damlacıklar (jet boyunca fırlayan) ---
    const nDrop = Math.round(6 + 14 * pr);
    for (let i = 0; i < nDrop; i++) {
      const j = jets[i % jets.length];
      const s = ((t * (0.55 + 0.2 * k.hash(i * 3 + 1)) + k.hash(i * 7 + 2)) % 1 + 1) % 1;
      const h = j.apex * (0.35 + 0.65 * pr) * wave(j.ph);
      const x = j.range * s + k.noise1(t * 5 + i * 9) * 4;
      const y = j.vertical ? 6 - h * s : 6 - h * 4 * s * (1 - s);
      ctx.fillStyle = k.rgba(p.color, 0.7 * (1 - s * 0.6));
      ctx.beginPath(); ctx.arc(x, y, 3.4 - s * 1.2, 0, k.TAU); ctx.fill();
    }
    // tepe serpintisi
    for (let i = 0; i < 6; i++) {
      const a = k.hash(i * 13 + 4) * k.TAU + t * 0.6;
      const r = 10 + 6 * Math.sin(t * 3 + i);
      ctx.fillStyle = k.rgba(p.color, 0.5);
      ctx.beginPath(); ctx.arc(Math.cos(a) * r, -112 * (0.35 + 0.65 * pr) * wave(3.4) - Math.abs(Math.sin(a)) * 8, 3, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
