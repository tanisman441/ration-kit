// money-fx/cash-rain — sallanarak düşen banknotlar: at anında başlar,
// her banknot takla atar, dibe varınca solar (döngülü yağmur).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) yağmur alanı merkezidir.
export default {
  name: 'cash-rain', category: 'money-fx',
  desc: 'Sallanarak düşen banknotlar: at anında başlayan, takla atan döngülü para yağmuru',
  tags: ['para', 'banknot', 'yağmur', 'düşüş', 'cash', 'banknote', 'money', 'rain', 'fall', 'zengin'],
  box: [-130, -170, 130, 150],
  bleed: 12,
  anchor: 'yağmur alanı merkezi (0,0) — yer çizgisi y=+140',
  points: { rain: [0, -160], ground: [0, 140] },
  params: {
    color: { type: 'color', default: 'yellow' },
    count: { type: 'number', default: 10, min: 3, max: 16, desc: 'aynı anda düşen banknot sayısı' },
    at: { type: 'time', default: null, desc: 'yağmurun başlama anı' },
  },
  draw(ctx, t, p, k) {
    const n = Math.round(p.count), CYCLE = 2.8, GY = 140;
    const d = p.at == null ? 0 : t - p.at;
    if (d < 0) return;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // yere ince çizgi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-112, GY); ctx.lineTo(112, GY); ctx.stroke();

    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 3 + 721), h2 = k.hash(i * 5 + 727), h3 = k.hash(i * 7 + 733);
      const c = ((d / CYCLE) + h1) % 1;
      const W = 62, H = 34;
      const y = -140 + c * (GY - H / 2 + 140);
      const x = (h2 - 0.5) * 130 + Math.sin(c * Math.PI * 2 + h1 * k.TAU) * 30; // sallanma
      const rot = Math.sin(c * k.TAU + h3 * k.TAU) * 0.9;                       // takla
      const fade = (1 - k.prog(c, 0.92, 1)) * k.prog(c, 0, 0.05);
      if (fade <= 0) continue;
      const al = 0.9 * fade;
      const sway = 1 - 0.25 * Math.abs(Math.cos(c * k.TAU * 1.5));               // perspektif daralma

      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sway, 1);
      // dış hat
      ctx.fillStyle = k.rgba('bg', 0.55 * al);
      ctx.beginPath(); k.rrect(-W / 2 - 3, -H / 2 - 3, W + 6, H + 6, 12); ctx.fill();
      // gövde
      ctx.fillStyle = k.rgba(p.color, al);
      ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, 9); ctx.fill();
      // orta bant
      ctx.fillStyle = k.rgba('ink', 0.28 * al);
      ctx.beginPath(); k.rrect(-W / 2 + 8, -H / 2 + 7, W - 16, H - 14, 6); ctx.fill();
      // köşe daireleri
      ctx.fillStyle = k.rgba('ink', 0.45 * al);
      ctx.beginPath(); ctx.arc(-W / 2 + 13, 0, 6, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(W / 2 - 13, 0, 6, 0, k.TAU); ctx.fill();
      // premium parlama (sol üst şerit)
      ctx.fillStyle = 'rgba(255,255,255,' + (0.12 * al).toFixed(3) + ')';
      ctx.beginPath(); k.rrect(-W / 2 + 5, -H / 2 + 4, W - 10, 6, 3); ctx.fill();
      ctx.restore();
    }
  },
};
