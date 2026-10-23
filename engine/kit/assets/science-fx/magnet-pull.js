// science-fx/magnet-pull — U mıknatıs; `at` anında metal parçalar kutuplara yapışır.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'magnet-pull',
  category: 'science-fx',
  desc: 'U mıknatıs: at anında dağınık metal parçalar kutuplara uçar ve yapışır',
  tags: ['mıknatıs', 'magnet', 'çekim', 'metal', 'kutup', 'fizik', 'manyetik', 'magnet pull', 'attraction', 'physics'],
  box: [-155, -140, 155, 150],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: { poles: [0, 26] },
  params: {
    at: { type: 'time', default: null, desc: 'metal parçaların mıknatısa yapışma anı (~0.7 sn)' },
    color: { type: 'color', default: 'red', desc: 'mıknatıs gövde rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const g = d < 0 ? 0 : k.prog(d, 0, 0.7);
    const poleL = [-58, 22], poleR = [58, 22];

    // manyetik alan çizgileri — kutuplar arasında altta kalan yaylar, nabız gibi
    for (let i = 0; i < 3; i++) {
      const pulse = 0.22 + 0.14 * Math.sin(t * 3 + i * 1.3);
      ctx.strokeStyle = k.rgba(acc, pulse);
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 22, 62 + i * 34, 38 + i * 24, 0, 0.12 * Math.PI, 0.88 * Math.PI);
      ctx.stroke();
    }

    // mıknatıs gövdesi — U formu (aşağı açık)
    const bar = (x0) => {
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(x0 - 5, -105, 54, 105, 14); ctx.fill();
      ctx.fillStyle = k.rgba(acc, 0.92);
      ctx.beginPath(); k.rrect(x0, -100, 44, 100, 12); ctx.fill();
      // metal uç (kutup)
      ctx.fillStyle = k.rgba('dim', 0.95);
      ctx.beginPath(); k.rrect(x0, -14, 44, 34, 8); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.beginPath(); k.rrect(x0 + 6, -8, 32, 4, 2); ctx.fill();
    };
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-85, -135, 170, 44, 16); ctx.fill();
    ctx.fillStyle = k.rgba(acc, 0.92);
    ctx.beginPath(); k.rrect(-80, -130, 160, 34, 14); ctx.fill();
    bar(-80); bar(36);
    // premium parlama (sol üst, köprüde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -122, 26, 9, -0.2, 0, k.TAU); ctx.fill();

    // metal parçalar
    const bits = [
      { rx: -110, ry: 118, kind: 0 }, // cıvata
      { rx: -52, ry: 128, kind: 1 },  // çivi
      { rx: 8, ry: 116, kind: 2 },    // pul (halka)
      { rx: 66, ry: 126, kind: 3 },   // vida
      { rx: 118, ry: 114, kind: 4 },  // somun
    ];
    const drawBit = (kind, x, y, rot) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3;
      if (kind === 0) { // cıvata
        ctx.beginPath(); k.rrect(-16, -6, 26, 12, 4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); k.rrect(8, -10, 10, 20, 3); ctx.fill(); ctx.stroke();
      } else if (kind === 1) { // çivi
        ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(12, 0); ctx.stroke();
        ctx.fillStyle = k.rgba('dim', 0.95);
        ctx.beginPath(); ctx.arc(14, 0, 5, 0, k.TAU); ctx.fill();
      } else if (kind === 2) { // pul
        ctx.fillStyle = k.rgba('dim', 0.95);
        ctx.beginPath(); ctx.arc(0, 0, 11, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('bg', 0.9);
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, k.TAU); ctx.fill();
      } else if (kind === 3) { // vida
        ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(10, 0); ctx.stroke();
        for (let j = -8; j <= 8; j += 5) {
          ctx.beginPath(); ctx.moveTo(j, -4); ctx.lineTo(j, 4); ctx.stroke();
        }
      } else { // somun (altıgen)
        ctx.fillStyle = k.rgba('dim', 0.95);
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const a = (j / 6) * k.TAU;
          const px = Math.cos(a) * 11, py = Math.sin(a) * 11;
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    };

    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];
      const pole = i % 2 === 0 ? poleL : poleR;
      // yapışma sonrası kutup çevresinde istiflenme ofseti
      const stack = [(i * 13) % 26 - 13, 14 + (i * 7) % 12];
      if (g === 0) {
        drawBit(b.kind, b.rx, b.ry, k.hash(i * 3) * 0.8 - 0.4);
      } else {
        const e = k.E.inCubic(k.clamp(g * 1.15, 0, 1));
        const x = k.lerp(b.rx, pole[0] + stack[0], e);
        const y = k.lerp(b.ry, pole[1] + stack[1], e) - Math.sin(e * Math.PI) * 46;
        const rot = e * (k.hash(i * 9) * 4 - 2);
        const wob = g >= 1 ? Math.sin(t * 18 + i * 2) * 2 * Math.max(0, 1 - d + 0.7) : 0;
        drawBit(b.kind, x, y + wob, rot);
        // uçuş izi
        if (g < 1) {
          ctx.strokeStyle = k.rgba(acc, 0.35 * (1 - g));
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(b.rx, b.ry); ctx.lineTo(x, y); ctx.stroke();
        }
      }
    }

    // yapışma flaşı
    if (d >= 0.55 && d < 1.1) {
      const f = 1 - (d - 0.55) / 0.55;
      k.glow(poleL[0], poleL[1], 30, acc, 0.45 * f);
      k.glow(poleR[0], poleR[1], 30, acc, 0.45 * f);
    }
    // kutup parıltısı (sürekli, hafif)
    k.glow(poleL[0], poleL[1], 18, acc, 0.18 + 0.08 * Math.sin(t * 3));
    k.glow(poleR[0], poleR[1], 18, acc, 0.18 + 0.08 * Math.sin(t * 3 + 1));

    ctx.restore();
  },
};
