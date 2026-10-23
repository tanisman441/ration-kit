// science-fx/atom-orbit — atom: yörüngede dönen elektronlar ve nabız atan çekirdek.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'atom-orbit',
  category: 'science-fx',
  desc: 'Atom modeli: üç yörüngede dönen elektronlar ve nabız gibi atan parlak çekirdek',
  tags: ['atom', 'elektron', 'yörünge', 'çekirdek', 'fizik', 'nabız', 'atom orbit', 'electron', 'nucleus', 'physics'],
  box: [-135, -135, 135, 135],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: { nucleus: [0, 0] },
  params: {
    electrons: { type: 'number', default: 3, desc: 'elektron sayısı 1–9' },
    spin: { type: 'number', default: 0.5, desc: 'yörünge dönüş hızı 0–1' },
  },
  draw(ctx, t, p, k) {
    const acc = 'yellow';
    ctx.save();
    ctx.lineCap = 'round';

    const n = Math.max(1, Math.min(9, Math.round(p.electrons)));
    const w = 0.8 + p.spin * 4;

    // 3 eliptik yörünge (ince, serbest çizgi: ink rengi)
    const rx = 104, ry = 42;
    for (let o = 0; o < 3; o++) {
      const rot = (o / 3) * Math.PI + t * 0.06;
      ctx.save(); ctx.rotate(rot);
      ctx.strokeStyle = k.rgba('ink', 0.45);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, k.TAU); ctx.stroke();
      ctx.restore();
    }

    // elektronlar — yörüngelere dağıtılır, faz kaydırmalı
    for (let i = 0; i < n; i++) {
      const o = i % 3;
      const per = Math.ceil(n / 3);
      const rot = (o / 3) * Math.PI + t * 0.06;
      const a = t * w * (o % 2 === 0 ? 1 : -1) + (Math.floor(i / 3) / per) * k.TAU + k.hash(i * 7 + 1) * 0.6;
      const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
      const x = ex * Math.cos(rot) - ey * Math.sin(rot);
      const y = ex * Math.sin(rot) + ey * Math.cos(rot);
      k.glow(x, y, 16, acc, 0.4);
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.arc(x, y, 9, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(acc, 1);
      ctx.beginPath(); ctx.arc(x, y, 7, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(x - 2.5, y - 2.5, 2.2, 0, k.TAU); ctx.fill();
    }

    // çekirdek nabzı — 1.6 sn periyot
    const beat = (t % 1.6) / 1.6;
    const pr = 26 + Math.sin(t * k.TAU / 1.6) * 2.5;
    // nabız halkası
    const ringR = 30 + beat * 48;
    ctx.strokeStyle = k.rgba(acc, 0.35 * (1 - beat));
    ctx.lineWidth = 4 * (1 - beat) + 1;
    ctx.beginPath(); ctx.arc(0, 0, ringR, 0, k.TAU); ctx.stroke();
    // çekirdek gövde
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, pr + 4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(acc, 0.92);
    ctx.beginPath(); ctx.arc(0, 0, pr, 0, k.TAU); ctx.fill();
    // iç benekler
    for (let i = 0; i < 5; i++) {
      const a = k.hash(i * 3 + 2) * k.TAU, r = 4 + k.hash(i * 5 + 4) * (pr - 12);
      ctx.fillStyle = k.rgba('bg', 0.5);
      ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 4.5, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-9, -10, 11, 8, -0.4, 0, k.TAU); ctx.fill();
    k.glow(0, 0, 58, acc, 0.22 + 0.12 * Math.sin(t * k.TAU / 1.6));

    ctx.restore();
  },
};
