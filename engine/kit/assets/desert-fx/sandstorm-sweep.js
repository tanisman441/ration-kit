// desert-fx/sandstorm-sweep — soldan sağa süpüren kum fırtınası cephesi.
// at anında (1.2 sn) fırtına cephesi kutuyu süpürür (yoğun kum bantları,
// çizgiler, girdaplar); boşta hafif kum sürüklenmesi sürer.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) rüzgâr merkezidir.
export default {
  name: 'sandstorm-sweep', category: 'desert-fx',
  desc: 'Soldan sağa süpüren kum fırtınası cephesi, at anında kutuyu kaplar',
  tags: ['kum fırtınası', 'sandstorm', 'fırtına', 'rüzgar', 'çöl', 'toz', 'storm', 'dust', 'wind', 'desert'],
  box: [-170, -140, 170, 60],
  bleed: 70,
  anchor: 'rüzgâr merkezi (0,0)',
  points: { start: [-150, 0], end: [150, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'fırtına geçişi (1.2 sn, cephe soldan sağa süpürür)' },
    color: { type: 'color', default: 'yellow', desc: 'kum vurgu rengi' },
  },
  draw(ctx, t, p, k) {
    const ad = p.at == null ? -1 : t - p.at;
    const storming = ad >= 0 && ad < 1.2;
    const prog = storming ? ad / 1.2 : 0;
    const env = storming ? Math.sin(prog * Math.PI) : 0; // 0→1→0
    const frontX = -190 + 400 * prog; // fırtına cephesi

    ctx.lineCap = 'round';

    // Güvenlik: her şey box+bleed içine kırpılır (denetim garantisi)
    ctx.save();
    ctx.beginPath(); ctx.rect(-240, -210, 480, 340); ctx.clip();

    // Gökyüzü kararması: fırtınada dim perde
    if (storming) {
      ctx.fillStyle = k.rgba('dim', 0.18 * env);
      ctx.fillRect(-170, -140, 340, 200);
    }

    // Zemin kum sürüklenmesi: her zaman, fırtınada hızlanır
    const drift = storming ? 26 : 5;
    ctx.strokeStyle = k.rgba('dim', 0.7); ctx.lineWidth = 4;
    for (let r = 0; r < 3; r++) {
      const baseY = 28 + r * 10;
      ctx.beginPath();
      for (let x = -170; x <= 170; x += 20) {
        const y = baseY + Math.sin(x * 0.06 + t * drift * 0.4 + r * 2) * 5;
        if (x === -170) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Havada sürüklenen ince çizgiler (serbest çizgi dili: ink)
    const streakN = storming ? 14 : 5;
    for (let i = 0; i < streakN; i++) {
      let x, y;
      if (storming) {
        // fırtınada çizgiler cephenin gerisinde hızla sağa akar
        const span = 420;
        x = -200 + ((k.hash(i * 3 + 1) * span + prog * 460) % span);
        y = -125 + k.hash(i * 7 + 2) * 235;
        if (x > frontX + 50) continue; // cephenin önü sakin
      } else {
        x = -150 + k.hash(i * 3 + 1) * 300 + Math.sin(t * 0.8 + i) * 12;
        y = -100 + k.hash(i * 7 + 2) * 180;
      }
      const len = (storming ? 34 : 18) + k.hash(i * 11) * (storming ? 60 : 24);
      const a = storming ? 0.55 : 0.22;
      ctx.strokeStyle = k.rgba('ink', a); ctx.lineWidth = storming ? 3.5 : 2.5;
      ctx.beginPath(); ctx.moveTo(x - len, y + len * 0.18); ctx.lineTo(x, y); ctx.stroke();
    }

    // Fırtına gövdesi: cephenin gerisinde yoğun kum
    if (storming) {
      // katmanlı kum perdesi (vurgu: sarı)
      ctx.fillStyle = k.rgba(p.color, 0.22 * env);
      ctx.fillRect(-190, -140, frontX + 190, 200);
      ctx.fillStyle = k.rgba('dim', 0.20 * env);
      ctx.fillRect(-190, -140, frontX + 190 - 40, 200);
      // yumuşak toz bulutları
      for (let i = 0; i < 8; i++) {
        const span = 400;
        const px = -190 + ((k.hash(i * 13 + 4) * span + prog * 440) % span);
        if (px > frontX + 30) continue;
        const py = -110 + k.hash(i * 17 + 6) * 200;
        ctx.fillStyle = k.rgba(p.color, 0.14 * env);
        ctx.beginPath(); ctx.arc(px, py, 26 + k.hash(i * 19) * 34, 0, k.TAU); ctx.fill();
      }
      // girdaplar: dönen yaylar
      for (let i = 0; i < 3; i++) {
        const gx = -140 + i * 90 + Math.sin(t * 2 + i * 2.4) * 16;
        const gy = -70 + i * 55 - prog * 20;
        if (gx > frontX) continue;
        ctx.strokeStyle = k.rgba('ink', 0.5 * env); ctx.lineWidth = 3.5;
        const a0 = t * 6 + i * 2.1;
        ctx.beginPath(); ctx.arc(gx, gy, 20, a0, a0 + 4.2); ctx.stroke();
        ctx.strokeStyle = k.rgba('ink', 0.3 * env); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(gx, gy, 30, a0 + 2, a0 + 5.4); ctx.stroke();
      }
      // cephe çizgisi: parlak ön kenar
      ctx.strokeStyle = k.rgba(p.color, 0.6 * env); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(frontX, -140); ctx.lineTo(frontX, 60); ctx.stroke();
    } else {
      // boşta: birkaç süzülen kum tanesi
      for (let i = 0; i < 6; i++) {
        const px = -140 + k.hash(i * 23) * 280 + Math.sin(t * 1.1 + i * 1.7) * 10;
        const py = -90 + k.hash(i * 29) * 140;
        ctx.fillStyle = k.rgba('dim', 0.5);
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore(); // clip
  },
};
