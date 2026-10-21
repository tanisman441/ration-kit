// lab-fx/crystallize — petri kabında kristal büyümesi: grow ile fasetli
// kristaller belirir ve büyür; yüzeyde sürekli gezinen kıvılcımlı parlamalar
// (canlı idle). NOT: canvas y-aşağıdır; (0,0) petri merkezidir.
export default {
  name: 'crystallize', category: 'lab-fx',
  desc: 'Kristal büyümesi: petri kabında büyüyen fasetli kristaller ve kıvılcımlar',
  tags: ['kristal', 'büyüme', 'petri', 'kristalleşme', 'deney', 'crystal', 'growth', 'crystallize', 'petri', 'sparkle'],
  box: [-95, -70, 95, 22],
  bleed: 35,
  anchor: 'petri merkezi (0,0)',
  points: { center: [0, -34], rim: [82, -52], dish: [0, 0] },
  params: {
    grow: { type: 'number', default: 0.7, min: 0, max: 1, desc: 'kristal büyümesi 0-1 (boyut)' },
    color: { type: 'color', default: 'cyan', desc: 'kristal rengi' },
  },
  draw(ctx, t, p, k) {
    const G = k.clamp(p.grow, 0, 1);
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // ölçü — petri: sığ çanak
    const rw = 82, rimY = -52, botY = -10;

    // çanak gövdesi — duvarlar + yuvarlak taban
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(-rw, rimY);
    ctx.lineTo(-rw + 12, botY - 2);
    ctx.quadraticCurveTo(0, botY + 10, rw - 12, botY - 2);
    ctx.lineTo(rw, rimY);
    ctx.closePath(); ctx.fill();

    // ağız arka yarısı (içerik bunun üstüne çizilir)
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, rimY, rw, 16, 0, Math.PI, k.TAU); ctx.stroke();

    // çözelti yüzeyi
    ctx.fillStyle = k.rgba(acc, 0.22);
    ctx.beginPath(); ctx.ellipse(0, rimY + 6, rw - 10, 13, 0, 0, k.TAU); ctx.fill();

    // kristaller — yüzeye dizilmiş fasetli çokgenler, grow ile büyür
    const n = 6;
    for (let i = 0; i < n; i++) {
      const seed = i * 23 + 5;
      const cx = -58 + i * 23 + (k.hash(seed) - 0.5) * 10;
      const cy = rimY + 13 + (k.hash(seed + 1) - 0.5) * 8;
      const maxR = (9 + k.hash(seed + 2) * 7) * (0.3 + 0.7 * G);
      if (maxR < 2) continue;
      const sides = 5 + Math.floor(k.hash(seed + 3) * 3); // 5-7 köşe
      const rot = k.hash(seed + 4) * k.TAU;

      // gövde — çokgen
      ctx.fillStyle = k.rgba(acc, 0.85);
      ctx.beginPath();
      for (let s = 0; s < sides; s++) {
        const a = rot + (s / sides) * k.TAU;
        const r = maxR * (0.75 + 0.25 * k.hash(seed + s * 3));
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.88;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      // dış hat
      ctx.strokeStyle = k.rgba('bg', 0.55);
      ctx.lineWidth = 3;
      ctx.stroke();
      // faset çizgileri — merkeze inen ince çizgiler
      ctx.strokeStyle = k.rgba('ink', 0.35);
      ctx.lineWidth = 1.8;
      for (let s = 0; s < sides; s += 2) {
        const a = rot + (s / sides) * k.TAU;
        ctx.beginPath(); ctx.moveTo(cx, cy - maxR * 0.2);
        ctx.lineTo(cx + Math.cos(a) * maxR * 0.85, cy + Math.sin(a) * maxR * 0.72);
        ctx.stroke();
      }
      // sol üst faset parlaması (premium finish)
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.ellipse(cx - maxR * 0.3, cy - maxR * 0.38, maxR * 0.3, maxR * 0.17, -0.4, 0, k.TAU);
      ctx.fill();
      // sağ alt faset gölgesi
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath();
      ctx.ellipse(cx + maxR * 0.3, cy + maxR * 0.34, maxR * 0.28, maxR * 0.15, -0.4, 0, k.TAU);
      ctx.fill();
    }

    // kıvılcımlı parlamalar — kristal yüzeylerinde gezinen ışık (canlı idle)
    const sp = 4 + Math.round(G * 6);
    for (let i = 0; i < sp; i++) {
      const seed = i * 37 + 501;
      const c = (t * (0.5 + k.hash(seed) * 0.9) + k.hash(seed + 1)) % 1;
      const tw = Math.sin(c * k.TAU);
      const al = 0.15 + 0.85 * Math.max(tw, 0) * (0.35 + G * 0.65);
      if (al < 0.25) continue;
      const x = -60 + k.hash(seed + 2) * 120;
      const y = rimY + 2 + k.hash(seed + 3) * 22;
      const r = 2 + k.hash(seed + 4) * 3.5;
      // 4 uçlu yıldız
      ctx.strokeStyle = 'rgba(255,255,255,' + al.toFixed(3) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - r * 1.6, y); ctx.lineTo(x + r * 1.6, y);
      ctx.moveTo(x, y - r * 1.6); ctx.lineTo(x, y + r * 1.6);
      ctx.stroke();
      k.glow(x, y, r * 2, acc, 0.35 * al);
    }

    // ağız ön yarısı — kristallerin önünde kalır
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, rimY, rw, 16, 0, 0, Math.PI); ctx.stroke();
    // iç ayrım çizgisi (ince)
    ctx.strokeStyle = k.rgba('ink', 0.3);
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(0, rimY, rw - 9, 13, 0, 0.3, Math.PI - 0.3); ctx.stroke();
    // sağ alt gölge — çanak duvarında
    ctx.strokeStyle = k.rgba('ink', 0.12);
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(rw - 8, rimY + 12); ctx.lineTo(rw - 14, botY - 6); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-rw * 0.6, rimY - 3, 13, 4.5, -0.25, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
