// disaster-fx/wildfire-spread — orman yangını: spread ilerledikçe genişleyen
// alevler; her alev dili gürültüyle kıpırdar (idle flicker), kıvılcımlar yükselir,
// gri duman sütunu sürüklenir. Sağda: dumana bürünmüş iki ağaç silueti.
// NOT: canvas y-aşağıdır; (0,0) ateş tabanıdır.
export default {
  name: 'wildfire-spread', category: 'disaster-fx',
  desc: 'Orman yangını: yayılan alevler, kıvılcım yağmuru ve duman sütunu',
  tags: ['yangın', 'ateş', 'alev', 'orman yangını', 'duman', 'kıvılcım', 'afet', 'wildfire', 'fire', 'flame', 'smoke', 'embers'],
  box: [-150, -150, 150, 60],
  bleed: 55,
  anchor: 'ateş tabanı (0,0)',
  points: { fire: [0, -10], smoke: [-20, -110], tree: [95, -50] },
  params: {
    spread: { type: 'number', default: 0.5, desc: 'yangının yayılma derecesi 0–1 (alev alanı genişliği ve yüksekliği)' },
    color: { type: 'color', default: 'red', desc: 'alev vurgu rengi' },
  },
  draw(ctx, t, p, k) {
    const s = k.clamp(p.spread, 0, 1);
    const acc = p.color;
    ctx.save();

    // Yanan ağaç siluetleri (sabit, dumanda)
    for (let ti = 0; ti < 2; ti++) {
      const tx = 95 + ti * 38, th = 70 - ti * 18;
      ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(tx, 40); ctx.lineTo(tx, 40 - th); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.4);
      ctx.beginPath(); ctx.arc(tx, 40 - th - 8, 16, 0, k.TAU); ctx.fill();
    }

    // Zemin şeridi (kavrulmuş toprak)
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-150, 24, 300, 30, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();

    // Alevler — spread genişliğine göre 3 dil; her biri gürültüyle oynar
    const nF = 5;
    for (let i = 0; i < nF; i++) {
      const seed = i * 83 + 6;
      const fx = -110 + i * 55 + (k.hash(seed) - 0.5) * 20;
      const act = k.prog(s, 0.06 + i * 0.16, 0.2 + i * 0.16);
      if (act <= 0) continue;
      const fh = (60 + k.hash(seed + 1) * 50) * act;
      const fw = 26 + k.hash(seed + 2) * 10;
      const fl = 1 + 0.22 * k.noise1(t * 9 + seed); // alev kıpırtısı (idle)
      const lean = k.noise1(t * 3 + seed * 2) * 8;
      // dış dil (vurgu rengi)
      ctx.fillStyle = k.rgba(acc, 0.9);
      ctx.beginPath();
      ctx.moveTo(fx - fw / 2, 26);
      ctx.quadraticCurveTo(fx - fw * 0.55, 26 - fh * 0.5 * fl, fx + lean, 26 - fh * fl);
      ctx.quadraticCurveTo(fx + fw * 0.5, 26 - fh * 0.45 * fl, fx + fw / 2, 26);
      ctx.closePath(); ctx.fill();
      // iç sarı çekirdek
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath();
      ctx.moveTo(fx - fw * 0.28, 26);
      ctx.quadraticCurveTo(fx - fw * 0.3, 26 - fh * 0.3 * fl, fx + lean * 0.7, 26 - fh * 0.62 * fl);
      ctx.quadraticCurveTo(fx + fw * 0.26, 26 - fh * 0.28 * fl, fx + fw * 0.28, 26);
      ctx.closePath(); ctx.fill();
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(fx - fw * 0.22, 26 - fh * 0.35 * fl, fw * 0.14, fh * 0.2, -0.3, 0, k.TAU); ctx.fill();
    }

    // Kıvılcımlar — yukarı fırlayan turuncu parçacıklar
    for (let i = 0; i < 14; i++) {
      const seed = i * 67 + 14;
      const cyc = (t * (0.7 + k.hash(seed) * 0.8) + k.hash(seed + 1) * 4) % 4;
      const life = cyc / 4;
      const sx = -120 + k.hash(seed + 2) * 220 * Math.max(s, 0.15);
      ctx.fillStyle = k.rgba('yellow', (0.9 * s + 0.1) * (1 - life));
      ctx.beginPath();
      ctx.arc(sx + k.noise1(t * 4 + seed) * 8, 20 - life * (110 + k.hash(seed + 3) * 50), 2.6 * (1 - life) + 0.6, 0, k.TAU);
      ctx.fill();
    }

    // Duman sütunu — yükselip sola sürüklenen gri puflar
    for (let i = 0; i < 8; i++) {
      const seed = i * 43 + 29;
      const cyc = (t * (0.35 + k.hash(seed) * 0.3) + k.hash(seed + 1) * 5) % 5;
      const life = cyc / 5;
      const px = -20 - life * 90 + k.noise1(t * 2 + seed) * 12;
      const py = -30 - life * 100;
      ctx.fillStyle = k.rgba('dim', 0.5 * (0.3 + 0.7 * s) * (1 - life * 0.7));
      ctx.beginPath(); ctx.arc(px, py, 12 + life * 34, 0, k.TAU); ctx.fill();
    }
    // duman üstüne hafif beyaz parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.ellipse(-70, -105, 30, 14, -0.3, 0, k.TAU); ctx.fill();

    // Ateş halesi — zeminde sıcaklık parlaması
    if (s > 0.05) {
      k.glow(-20, 10, 90 * s, acc, 0.3 * s);
    }

    ctx.restore();
  },
};
