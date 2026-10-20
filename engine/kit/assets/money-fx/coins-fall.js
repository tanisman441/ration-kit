// money-fx/coins-fall — yukarıdan yağan madeni paralar: at anında başlar,
// döngülü yağmur (her coin yalpa yaparak düşer), yere çarpınca ezilip mini sıçrar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) yağmur alanı merkezidir.
export default {
  name: 'coins-fall', category: 'money-fx',
  desc: 'Yukarıdan yağan madeni paralar: at anında başlayan döngülü yağmur, yere çarpınca mini sıçrama',
  tags: ['para', 'madeni para', 'yağmur', 'yağış', 'coin', 'money', 'rain', 'fall', 'altın', 'gold'],
  box: [-130, -170, 130, 150],
  bleed: 12,
  anchor: 'yağmur alanı merkezi (0,0) — yer çizgisi y=+140',
  points: { rain: [0, -160], ground: [0, 140] },
  params: {
    color: { type: 'color', default: 'yellow' },
    count: { type: 'number', default: 12, min: 4, max: 20, desc: 'aynı anda düşen coin sayısı' },
    at: { type: 'time', default: null, desc: 'yağmurun başlama anı (öncesi yerde coin yığını)' },
  },
  draw(ctx, t, p, k) {
    const n = Math.round(p.count), CYCLE = 2.2, GY = 140;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // yere ince çizgi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-112, GY); ctx.lineTo(112, GY); ctx.stroke();

    const coin = (x, y, r, squash, al, glint) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(1, squash);
      // dış hat
      ctx.fillStyle = k.rgba('bg', 0.55 * al);
      ctx.beginPath(); ctx.arc(0, 0, r + 2.5, 0, k.TAU); ctx.fill();
      // gövde
      ctx.fillStyle = k.rgba(p.color, al);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.fill();
      // iç halka
      ctx.strokeStyle = k.rgba('ink', 0.4 * al); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, r - 5, 0, k.TAU); ctx.stroke();
      // yıldız
      ctx.fillStyle = k.rgba('ink', 0.6 * al); ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.2 : r * 0.42;
        const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.fill();
      // premium parlama (sol üst)
      if (glint) {
        ctx.fillStyle = 'rgba(255,255,255,' + (0.10 * al).toFixed(3) + ')';
        ctx.beginPath(); ctx.ellipse(-r * 0.32, -r * 0.38, r * 0.3, r * 0.18, -0.4, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    };

    const d = p.at == null ? 0 : t - p.at;
    if (d < 0) {
      // yağmur başlamadan: yerde küçük bir coin yığını
      coin(-34, GY - 14, 15, 1, 1, true);
      coin(0, GY - 30, 15, 1, 1, true);
      coin(34, GY - 14, 15, 1, 1, true);
      coin(2, GY - 13, 15, 1, 1, true);
      return;
    }
    // yağmur: her coin döngüsel düşer
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 3 + 701), h2 = k.hash(i * 5 + 707), h3 = k.hash(i * 7 + 713);
      const c = ((d / CYCLE) + h1) % 1;
      const r = 11 + h3 * 8;
      const y = -165 + c * (GY - r + 165);
      const x = (h2 - 0.5) * 200 + k.noise1(i * 2.7 + d * 1.6) * 18; // yalpa
      const fade = (1 - k.prog(c, 0.97, 1)) * k.prog(c, 0, 0.04);
      if (fade <= 0) continue;
      // yere çarpınca mini sıçrama: ezilme + hafif zıplama
      const bz = k.prog(c, 0.9, 0.97);
      const squash = 1 - 0.35 * Math.sin(bz * Math.PI);
      const hop = Math.sin(bz * Math.PI) * 12;
      coin(x, y - hop, r, squash, fade, true);
      // çarpma halkası
      if (bz > 0 && bz < 1) {
        ctx.strokeStyle = k.rgba('dim', 0.5 * (1 - bz) * fade); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(x, GY + 2, r * (1 + bz * 1.6), 5, 0, 0, k.TAU); ctx.stroke();
      }
    }
  },
};
