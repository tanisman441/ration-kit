// science/atom — atom modeli: çekirdek + 3 eliptik yörüngede dönen elektronlar.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'atom',
  category: 'science',
  desc: 'Atom modeli: parlak çekirdek ve üç eliptik yörüngede dönen elektronlar',
  tags: ['atom', 'çekirdek', 'elektron', 'yörünge', 'fizik', 'atom model', 'nucleus', 'electron', 'physics'],
  box: [-130, -130, 130, 130],
  bleed: 25,
  anchor: 'merkez (0,0)',
  points: { nucleus: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'elektron ve yörünge vurgu rengi' },
    spin: { type: 'number', default: 0.5, desc: 'elektron dönüş hızı 0–1' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // yörünge hızı — spin 0'da da hafif döner
    const w = 0.6 + p.spin * 3.2;

    // 3 eliptik yörünge (ince, serbest çizgi: ink rengi)
    const rx = 100, ry = 40;
    for (let o = 0; o < 3; o++) {
      const rot = (o / 3) * Math.PI;
      ctx.save(); ctx.rotate(rot);
      ctx.strokeStyle = k.rgba('ink', 0.45);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, k.TAU); ctx.stroke();
      ctx.restore();
    }

    // elektronlar — her yörüngede 2, faz kaydırmalı
    for (let o = 0; o < 3; o++) {
      const rot = (o / 3) * Math.PI;
      for (let e = 0; e < 2; e++) {
        const a = t * w * (o % 2 === 0 ? 1 : -1) + e * Math.PI + k.hash(o * 7 + e) * k.TAU;
        const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
        const x = ex * Math.cos(rot) - ey * Math.sin(rot);
        const y = ex * Math.sin(rot) + ey * Math.cos(rot);
        k.glow(x, y, 16, acc, 0.4);
        ctx.fillStyle = k.rgba(acc, 1);
        ctx.beginPath(); ctx.arc(x, y, 7, 0, k.TAU); ctx.fill();
        // premium parlama
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath(); ctx.arc(x - 2.5, y - 2.5, 2.2, 0, k.TAU); ctx.fill();
      }
    }

    // çekirdek — dış hat + gövde + parlama
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.arc(0, 0, 25, 0, k.TAU); ctx.fill();
    // iç noktalar (protonlar)
    for (let i = 0; i < 6; i++) {
      const a = k.hash(i * 3 + 1) * k.TAU, r = 5 + k.hash(i * 5 + 2) * 11;
      ctx.fillStyle = k.rgba('bg', 0.5);
      ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 4.5, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-8, -9, 10, 7, -0.4, 0, k.TAU); ctx.fill();
    k.glow(0, 0, 55, acc, 0.25);

    ctx.restore();
  },
};
