// fx/speed-lines — hız çizgileri: döngülü akan ince çizgiler (manga hız efekti).
// NOT: canvas y-aşağıdır; direction h = yatay akış (soldan sağa), v = dikey akış (yukarıdan aşağı).
export default {
  name: 'speed-lines',
  category: 'fx',
  desc: 'Hız çizgileri: döngülü akan ince çizgiler, yön ve hız ayarlanabilir',
  tags: ['hız', 'çizgi', 'hareket', 'manga', 'anime', 'speed', 'lines', 'motion', 'streaks'],
  box: [-210, -150, 210, 150],
  bleed: 0,
  anchor: 'merkez (0,0): efektin merkezi',
  points: {},
  params: {
    direction: { type: 'enum', values: ['h', 'v'], default: 'h', desc: 'akış yönü: yatay|dikey' },
    speed: { type: 'number', default: 0.6, desc: '0–1: çizgi uzunluğu ve yoğunluğu' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const sp = k.clamp(p.speed, 0, 1);
    const horiz = p.direction === 'h';
    const n = Math.round(10 + sp * 18);
    ctx.lineCap = 'round';

    // kutuya kırp (çizgiler kutu sınırında girip çıkar)
    ctx.save();
    ctx.beginPath();
    ctx.rect(-210, -150, 420, 300);
    ctx.clip();

    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 3 + 71), h2 = k.hash(i * 5 + 73), h3 = k.hash(i * 7 + 79);
      const lane = (h1 - 0.5) * 2;                       // akışa dik eksende şerit
      const cyc = (h2 + t * (0.5 + sp * 1.6) * (0.7 + h3 * 0.6)) % 1;  // 0..1 döngü
      const len = (40 + h3 * 90) * (0.4 + sp * 0.8);
      const al = (0.25 + h3 * 0.45) * (0.4 + sp * 0.6);
      ctx.strokeStyle = k.rgba(p.color, al);
      ctx.lineWidth = 2.5 + h2 * 3.5;
      ctx.beginPath();
      if (horiz) {
        const y = lane * 130;
        const x = 210 - cyc * (420 + len);               // sağdan sola akar
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y);
      } else {
        const x = lane * 190;
        const y = -150 - len + cyc * (300 + len);        // yukarıdan aşağı akar
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + len);
      }
      ctx.stroke();
    }
    ctx.restore();
  },
};
