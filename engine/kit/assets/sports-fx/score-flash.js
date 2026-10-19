// sports-fx/score-flash — skor flaşı: "GOAL" yazısı etrafında patlayan yıldız ışınları ve genişleyen halka.
// NOT: canvas y-aşağıdır; flaş merkezi (0,0)'dır. `word` metni iki temada da okunur.
export default {
  name: 'score-flash',
  category: 'sports-fx',
  desc: 'Skor flaşı: yazı etrafında patlayan yıldız ışınları, genişleyen halka ve saçılan parçacıklar',
  tags: ['gol', 'skor', 'flaş', 'goal', 'score', 'flash', 'burst', 'skorboard', 'kutlama', 'celebration'],
  box: [-220, -160, 220, 160],
  bleed: 80,
  anchor: 'flaş merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'flaş anı: ışınlar + halka + yazı patlaması' },
    word: { type: 'text', default: 'GOAL' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const flash = d >= 0 && d < 1.0 ? 1 - d / 1.0 : 0;   // 1 sn'lik flaş zarfı
    const C = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const word = String(p.word ?? 'GOAL');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    // bekleme hali: sönük rozet hafif nefes alır (idle)
    if (d < 0) {
      const br = 1 + 0.05 * Math.sin(t * 3);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, 0, 48 * br + 4, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 0.3);
      ctx.beginPath(); ctx.arc(0, 0, 48 * br, 0, k.TAU); ctx.fill();
      ctx.font = "900 44px 'JetBrains Mono', monospace";
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.fillText(word, 0, 2);
      return;
    }
    if (flash <= 0) return;

    const pop = k.E.outBack(k.clamp(d / 0.22, 0, 1));    // yazı girişi
    const env = k.clamp(1 - d / 0.65, 0, 1);             // ışın zarfı (0.65 sn)

    // merkez parlaması
    k.glow(0, 0, 170 * flash, p.color, 0.5 * flash);

    // yıldız ışınları — 12 üçgen, flaşla uzayıp söner
    for (let i = 0; i < 12; i++) {
      const h = k.hash(i * 7 + 3);
      const a = (i / 12) * k.TAU + 0.26;
      const r0 = 62, r1 = 62 + (70 + h * 90) * env;
      const w = 0.10 + h * 0.10;
      ctx.fillStyle = k.rgba(p.color, 0.85 * env);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a - w) * r0, Math.sin(a - w) * r0);
      ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a + w) * r0, Math.sin(a + w) * r0);
      ctx.closePath(); ctx.fill();
    }

    // genişleyen halka
    if (d < 0.7) {
      const rr = 55 + 175 * k.E.outExpo(k.clamp(d / 0.7, 0, 1));
      ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - d / 0.7));
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
    }

    // saçılan parçacıklar
    const g = k.prog(d, 0.05, 0.55);
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 13 + 31), h2 = k.hash(i * 17 + 37);
      const a = (i / 10) * k.TAU + h1 * 0.6;
      const rr = 60 + g * (90 + h2 * 110);
      ctx.fillStyle = k.rgba('ink', 0.8 * (1 - g) * flash);
      ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 3 + h2 * 5 * (1 - g), 0, k.TAU); ctx.fill();
    }

    // rozet: dış hat + dolgu + sol üst parlama (metne parlama YOK — bilgi yüzeyi)
    ctx.save();
    ctx.scale(pop, pop);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 62, 0, k.TAU); ctx.fill();
    ctx.fillStyle = C;
    ctx.beginPath(); ctx.arc(0, 0, 58, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -34, 26, 14, -0.5, 0, k.TAU); ctx.fill();
    // yazı
    ctx.font = "900 64px 'JetBrains Mono', monospace";
    ctx.fillStyle = inkC;
    ctx.fillText(word, 0, 4);
    ctx.restore();
  },
};
