// disaster-fx/earthquake-shake — deprem: sarsıntı şiddetine göre sallanan ev,
// büyüyen zemin çatlağı, kalkan toz bulutları ve sismik dalga halkaları.
// Sürekli hafif titreme (idle); shake>0'da nesneler rastlantısal sarsılır.
// NOT: canvas y-aşağıdır; (0,0) zeminin ortasıdır.
export default {
  name: 'earthquake-shake', category: 'disaster-fx',
  desc: 'Deprem: sallanan ev ve ağaç, zemin çatlağı, toz, sismik dalgalar',
  tags: ['deprem', 'sarsıntı', 'yerkabuğu', 'çatlak', 'afet', 'earthquake', 'shake', 'quake', 'disaster', 'tremor'],
  box: [-150, -110, 150, 90],
  bleed: 40,
  anchor: 'zemin ortası (0,0)',
  points: { crack: [0, 34], house: [52, -10], tree: [-78, -18], wave: [0, 34] },
  params: {
    shake: { type: 'number', default: 0.5, desc: 'sarsıntı şiddeti 0–1 (nesne sarsıntısı, çatlak genişliği, toz yoğunluğu)' },
    color: { type: 'color', default: 'dim', desc: 'zemin rengi' },
  },
  draw(ctx, t, p, k) {
    const s = k.clamp(p.shake, 0, 1);
    const g = p.color;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // Sarsıntı alanı — bütün sahne bu merkez etrafında sallanır
    const shx = k.noise1(t * 7.3) * (1.5 + s * 9);
    const shy = k.noise1(t * 8.7 + 40) * (0.8 + s * 4);

    ctx.translate(shx, shy);

    // Zemin bloğu
    ctx.fillStyle = k.rgba(g);
    ctx.beginPath(); k.rrect(-150, 26, 300, 60, 18); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-95, 40, 60, 12, -0.12, 0, k.TAU); ctx.fill();
    // sağ alt iç gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(80, 74, 70, 11, -0.1, 0, k.TAU); ctx.fill();
    // zemin iç ayrım çizgisi (derinlik)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-138, 52); ctx.lineTo(138, 52); ctx.stroke();

    // Zemin çatlağı — shake büyüdükçe genişleyen zigzag
    const cw = 2 + s * 7;
    ctx.strokeStyle = k.rgba('ink', 0.65);
    ctx.lineWidth = cw;
    ctx.beginPath();
    let cx = -140;
    ctx.moveTo(cx, 26);
    let i = 0;
    while (cx < 140) {
      cx += 18 + k.hash(i * 7 + 2) * 16;
      ctx.lineTo(cx, 26 + (k.hash(i * 13 + 5) - 0.5) * (10 + s * 22));
      i++;
    }
    ctx.stroke();
    // çatlağın içi sarsıntı anında kırmızı ışıma (vurgu)
    if (s > 0.55) {
      ctx.strokeStyle = k.rgba('red', 0.55 * k.prog(s, 0.55, 1));
      ctx.lineWidth = Math.max(1.5, cw * 0.35);
      ctx.stroke();
    }

    // Ev — sarsıntıyla yalpalayan küçük ev
    const rock = k.noise1(t * 6.1 + 9) * (0.02 + s * 0.14);
    ctx.save();
    ctx.translate(52 + k.noise1(t * 9.4) * s * 6, -4);
    ctx.rotate(rock);
    // gövde
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-26, -34, 52, 42, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -26, 11, 6, -0.35, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(13, -2, 10, 5, -0.3, 0, k.TAU); ctx.fill();
    // çatı
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath();
    ctx.moveTo(-32, -32); ctx.lineTo(0, -58); ctx.lineTo(32, -32);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    // kapı + pencere
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.beginPath(); k.rrect(-8, -22, 16, 22, 5); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.85);
    ctx.beginPath(); k.rrect(10, -30, 10, 10, 3); ctx.fill();
    ctx.restore();

    // Ağaç — sallanan minik ağaç (serbest çizgiler ink ile)
    const sway = k.noise1(t * 5.2 + 20) * (2 + s * 10);
    ctx.save();
    ctx.translate(-78, 26);
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sway, -26); ctx.stroke();
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath(); ctx.arc(sway, -36, 20, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(sway - 7, -43, 8, 5, -0.35, 0, k.TAU); ctx.fill();
    ctx.restore();

    // Sismik dalga halkaları — shake>0'da merkezden periyodik yayılır
    if (s > 0.02) {
      const period = 1.1 - s * 0.4;
      for (let r2 = 0; r2 < 3; r2++) {
        const ph = ((t + r2 * period / 3) % period) / period;
        const rr = 20 + ph * 150;
        ctx.strokeStyle = k.rgba('red', 0.4 * (1 - ph) * s);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0, 26, rr, rr * 0.24, 0, 0, k.TAU); ctx.stroke();
      }
    }

    // Toz bulutları — çatlak üstünde kalkan toz, shake'e bağlı yoğunluk
    const nDust = Math.floor(2 + s * 9);
    for (let d2 = 0; d2 < nDust; d2++) {
      const seed = d2 * 71 + 4;
      const cyc = (t * (0.5 + k.hash(seed) * 0.7) + k.hash(seed + 1) * 3) % 3;
      const life = cyc / 3;
      const dx = (k.hash(seed + 2) - 0.5) * 260;
      ctx.fillStyle = k.rgba('dim', (0.5 * s + 0.1) * (1 - life));
      ctx.beginPath();
      ctx.arc(dx, 24 - life * (26 + k.hash(seed + 3) * 30), 5 + life * 16, 0, k.TAU);
      ctx.fill();
    }

    ctx.restore();
  },
};
