// space-action/alien-signal — sinyal çanağı: `at` anında çanak titreyerek sinyal
// dalgası patlaması yayar (1.2 sn genişleyen halkalar), sonra taramaya devam eder.
// NOT: canvas y-aşağıdır; (0,0) çanak merkezidir. Yukarı = negatif y.
export default {
  name: 'alien-signal',
  category: 'space-action',
  desc: 'Sinyal çanağı anı gelince titreyip dalga patlaması yayar, sonra taramaya döner',
  tags: ['sinyal', 'çanak', 'anten', 'dalga', 'uzaylı', 'radyo', 'signal', 'dish', 'antenna', 'wave', 'alien', 'radio'],
  box: [-150, -120, 150, 120],
  bleed: 90,
  anchor: 'çanak merkezi (0,0)',
  points: { dish: [0, 0], base: [0, 80], wave: [0, -60] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'çanak gövde rengi' },
    at: { type: 'time', default: null, desc: 'sinyal patlaması anı: 1.2 sn genişleyen dalgalar + çanak titremesi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const OUT = 6;
    ctx.save();

    // --- sinyal dalgaları ---
    if (d >= 0 && d < 1.2) {
      const tremor = 4 * (1 - k.prog(d, 0, 1.2));
      // titreme ofseti çanağa aşağıda uygulanır
      for (let i = 0; i < 4; i++) {
        const rp = k.prog(d, i * 0.14, i * 0.14 + 0.9);
        if (rp <= 0 || rp >= 1) continue;
        const e = k.E.outCubic(rp);
        k.glow(0, -40, 30 + 120 * e, k.col('cyan'), 0.3 * (1 - e));
        ctx.strokeStyle = k.rgba('cyan', 0.75 * (1 - e));
        ctx.lineWidth = 7 * (1 - e) + 2;
        // çanaktan yukarı açılan yaylar (y-aşağı: yukarı = -y)
        ctx.beginPath(); ctx.arc(0, -30, 24 + 150 * e, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke();
        ctx.strokeStyle = k.rgba('bg', 0.3 * (1 - e));
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, -30, 30 + 150 * e, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke();
      }
      // çanak titremesi
      ctx.translate(k.noise1(t * 40) * tremor, k.noise1(t * 37 + 9) * tremor);
    }

    // --- tripod taban ---
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 40); ctx.lineTo(-38, 92);
    ctx.moveTo(0, 40); ctx.lineTo(38, 92);
    ctx.moveTo(0, 40); ctx.lineTo(0, 94);
    ctx.stroke();
    // taban plaka
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    k.rrect(-48, 90, 96, 14, 7); ctx.fill(); ctx.stroke();
    // kontrol kutusu
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    k.rrect(-26, 52, 52, 30, 8); ctx.fill(); ctx.stroke();
    // durum LED'i (idle blink)
    const ledOn = k.hash(Math.floor(t * 1.5)) > 0.45;
    ctx.fillStyle = k.rgba('cyan', ledOn ? 0.95 : 0.25);
    ctx.beginPath(); ctx.arc(0, 67, 5, 0, k.TAU); ctx.fill();
    if (ledOn) k.glow(0, 67, 16, k.col('cyan'), 0.35);

    // --- çanak direği ---
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 52); ctx.lineTo(0, 6); ctx.stroke();

    // --- çanak (idle: yavaş tarama salınımı) ---
    const scan = 0.35 * Math.sin(t * 0.9);
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(-0.9 + scan);
    // çanak tası
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    ctx.beginPath(); ctx.arc(0, 0, 44, -1.15, 1.15); ctx.closePath(); ctx.fill(); ctx.stroke();
    // iç halka
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 32, -1.1, 1.1); ctx.stroke();
    // besleme kolu + uç
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(38, 0); ctx.stroke();
    ctx.fillStyle = k.rgba('cyan', 0.95);
    ctx.beginPath(); ctx.arc(40, 0, 8, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    k.glow(40, 0, 22, k.col('cyan'), 0.3);
    // çanak parlama (premium finish)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-14, -22, 16, 9, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- idle sinyal vızıltısı (küçük titreşim halkaları, at yokken) ---
    if (d < 0) {
      const ip = (t * 0.5) % 1;
      ctx.strokeStyle = k.rgba('cyan', 0.25 * (1 - ip));
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -30, 50 + 40 * ip, -Math.PI * 0.7, -Math.PI * 0.3); ctx.stroke();
    }

    // gölge (sağ alt %12) — çanak direğinin dibi
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(14, 96, 34, 8, 0, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
