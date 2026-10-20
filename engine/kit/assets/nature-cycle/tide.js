// nature-cycle/tide — gel-git: tide anında su 1.0 sn'de yükselir; yüzey boşta sürekli dalgalanır.
// NOT: canvas y-aşağıdır; su seviyesi y artışı yönünde alçalır, tersine yükselir.
export default {
  name: 'tide', category: 'nature-cycle',
  desc: 'Gel-git sahnesi: tide anında su seviyesi yükselir, yüzey boşta sürekli dalgalanır',
  tags: ['gelgit', 'dalga', 'deniz', 'su', 'kıyı', 'yükselme', 'tide', 'wave', 'sea', 'water', 'shore'],
  box: [-170, -130, 170, 140],
  bleed: 20,
  anchor: 'kıyı kayası solda; su seviyesi alçak (60) ↔ yüksek (-10)',
  points: { water: [70, 40], shore: [-140, 100], surface: [70, -10], lowmark: [-66, 60] },
  params: {
    tide: { type: 'time', default: null, desc: 'gel-git anı: 1.0 sn\'de su seviyesi alçaktan yükseğe çıkar' },
    water: { type: 'color', default: 'cyan' },
    rock: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 7;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // su seviyesi: alçak 60 → yüksek -10
    const d = p.tide == null ? -1 : t - p.tide;
    const g = d < 0 ? 0 : k.prog(d, 0, 1.0);
    const level = k.lerp(60, -10, k.E.inOutCubic(g));
    // yüzey dalgası: boşta sürekli hareket
    const waveY = x => level + Math.sin(x * 0.045 + t * 2.6) * 4 + k.noise1(x * 0.02 + t * 1.8) * 3;

    // 1) kıyı kayası (solda)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-170, 140); ctx.lineTo(-170, 0); ctx.lineTo(-120, -20);
    ctx.lineTo(-80, 10); ctx.lineTo(-50, 30); ctx.lineTo(-50, 140);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = darker(p.rock);
    ctx.beginPath();
    ctx.moveTo(-164, 140); ctx.lineTo(-164, 4); ctx.lineTo(-120, -14);
    ctx.lineTo(-82, 12); ctx.lineTo(-56, 32); ctx.lineTo(-56, 140);
    ctx.closePath(); ctx.fill();
    // premium parlama (sol üst kaya)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-128, -8, 26, 10, -0.35, 0, k.TAU); ctx.fill();
    // gel-git işaretleri (yüksek/alçak çizgisi)
    ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 4;
    for (const my of [-10, 60]) {
      ctx.beginPath(); ctx.moveTo(-118, my); ctx.lineTo(-64, my); ctx.stroke();
    }

    // 2) su kütlesi
    ctx.fillStyle = k.rgba(p.water, 0.75);
    ctx.beginPath();
    ctx.moveTo(-52, 140); ctx.lineTo(-52, waveY(-52));
    for (let x = -52; x <= 170; x += 11) ctx.lineTo(x, waveY(x));
    ctx.lineTo(170, 140); ctx.closePath(); ctx.fill();
    // yüzey çizgisi
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath();
    for (let x = -52; x <= 170; x += 11) { const y = waveY(x); x === -52 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    ctx.strokeStyle = k.rgba(p.water, 1); ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = -52; x <= 170; x += 11) { const y = waveY(x); x === -52 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    // su üstü parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(30, level + 28, 55, 9, -0.1, 0, k.TAU); ctx.fill();

    // 3) köpükler — yüzeyde salınır
    for (let i = 0; i < 5; i++) {
      const fx = -30 + k.hash(i * 4.7) * 70;
      const fy = waveY(fx) + 1 + Math.sin(t * 2.2 + i * 2.1) * 2.5;
      const fr = 6 + k.hash(i * 8.3) * 5;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.ellipse(fx, fy, fr, fr * 0.55, 0, 0, k.TAU); ctx.fill();
    }

    // 4) yosunlar — kayada boşta salınır
    for (let i = 0; i < 2; i++) {
      const sx = -62 - i * 16;
      ctx.strokeStyle = line; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(sx, 138);
      for (let sgm = 1; sgm <= 4; sgm++) {
        const yy = 138 - sgm * 12;
        const xx = sx + Math.sin(t * 1.6 + i * 2 + sgm * 0.9) * 5 * (sgm / 4);
        ctx.lineTo(xx, yy);
      }
      ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(sx, 138);
      for (let sgm = 1; sgm <= 4; sgm++) {
        const yy = 138 - sgm * 12;
        const xx = sx + Math.sin(t * 1.6 + i * 2 + sgm * 0.9) * 5 * (sgm / 4);
        ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }

    ctx.restore();
  },
};
