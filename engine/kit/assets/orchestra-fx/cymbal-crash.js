// orchestra-fx/cymbal-crash — `at` anında iki zil çarpışır; kapanış sonrası titreşim + yıldız kıvılcımları saçar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) iki zilin çarpışma noktasıdır.
export default {
  name: 'cymbal-crash', category: 'orchestra-fx',
  desc: 'Karşılıklı duran iki el zili üfleme anında çarpışır; çarpışma sonrası kenarlar titreşir ve yıldız kıvılcımları saçılır',
  tags: ['zil', 'çarpma', 'crash', 'orkestra', 'perküsyon', 'titreşim', 'kıvılcım', 'cymbal', 'crash', 'orchestra', 'percussion', 'vibration', 'spark'],
  box: [-120, -110, 120, 110],
  bleed: 50,
  anchor: 'iki zilin çarpışma noktası (0,0); üst zil yukarıda, alt zil aşağıda',
  points: { center: [0, 0], rim: [96, 0], topHandle: [-96, -52], bottomHandle: [-96, 52] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: 0.8, desc: 'zil çarpışma anı (kapanış + titreşim + kıvılcım)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    // açıklık: `at` öncesinde 34, çarpışmada 4'e kapanır, sonra titreşimle sönümlenir
    let gap = 34;
    let wob = 0;
    if (d >= 0) {
      gap = 4;
      wob = 5 * Math.exp(-d * 2.2) * Math.sin(d * k.TAU * 3.2);
    } else {
      // çarpışmaya yaklaşırken ziller hafifçe birbirine yaklaşır
      gap = 34 + 6 * Math.sin(t * k.TAU / 1.4);
    }
    const topY = -gap / 2 + wob;
    const botY = gap / 2 - wob;

    const cymbal = (cy, flip) => {
      // kubbe: geniş elips + ortada küçük tümsek
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, cy, 98, 15, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(0, cy, 94, 12, 0, 0, k.TAU); ctx.fill();
      // iç halka (oluk çizgisi)
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, cy, 62, 8, 0, 0, k.TAU); ctx.stroke();
      // orta tümsek (bell)
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, cy + (flip ? 5 : -5), 26, 9, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.ellipse(0, cy + (flip ? 5 : -5), 22, 7, 0, 0, k.TAU); ctx.fill();
      // premium parlama (sol üst kenar)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-58, cy - 6, 26, 4, -0.12, 0, k.TAU); ctx.fill();
      // kayış: dış kenarda tutma kayışı
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-96, cy); ctx.lineTo(-108, cy + (flip ? -16 : 16)); ctx.stroke();
    };

    cymbal(topY, true);
    cymbal(botY, false);

    // sağ alt gölge (alt zilin altında)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(20, botY + 18, 40, 5, 0, 0, k.TAU); ctx.fill();

    // ÇARPIŞMA EFEKTİ: `at` sonrası ~0.9 sn
    if (d >= 0 && d < 0.9) {
      const q = d / 0.9;
      // çarpışma flaşı (merkezde)
      k.glow(0, 0, 30 + 40 * (1 - q), 'yellow', 0.55 * (1 - q));
      // yıldız kıvılcımları: kenarlardan dışa saçılan çizgiler
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + k.hash(i + 1) * 0.5;
        const r0 = 70 + d * 60;
        const r1 = r0 + 26 * (1 - q);
        ctx.strokeStyle = k.rgba('yellow', (1 - q) * 0.9);
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0 * 0.55);
        ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1 * 0.55);
        ctx.stroke();
        // kıvılcım ucu noktası
        ctx.fillStyle = k.rgba('yellow', (1 - q) * 0.9);
        ctx.beginPath(); ctx.arc(Math.cos(a) * r1, Math.sin(a) * r1 * 0.55, 3, 0, k.TAU); ctx.fill();
      }
      // ses halkaları: yatay genişleyen elipsler
      for (let i = 0; i < 2; i++) {
        const r = 60 + d * 70 - i * 18;
        if (r < 60) continue;
        ctx.strokeStyle = k.rgba('accent', (1 - q) * 0.6);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.32, 0, 0, k.TAU); ctx.stroke();
      }
    } else if (d < 0) {
      // çarpışma öncesi: ziller yaklaşırken aralarında beklenti parıltısı
      const pre = 0.5 + 0.5 * Math.sin(t * k.TAU / 0.8);
      ctx.fillStyle = `rgba(255,255,255,${0.08 + 0.10 * pre})`;
      ctx.beginPath(); ctx.ellipse(0, 0, 12, 5, 0, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
