// sports-arena/crowd-confetti — tribünden konfeti yağmuru: patlama anı + süzülüş.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; üst = negatif y.
export default {
  name: 'crowd-confetti', category: 'sports-arena',
  desc: 'Tribün bandı üstünde iki konfeti topu: at anında patlar, renkli parçalar sallanarak süzülüp söner',
  tags: ['konfeti', 'tribün', 'kutlama', 'yağmur', 'parti', 'confetti', 'crowd', 'celebration', 'fans', 'party', 'stadium'],
  box: [-270, -300, 270, 30],
  bleed: 60,
  anchor: 'tribün bandı, zemin (0,0); patlama ağızları y≈-160',
  points: { burstL: [-205, -165], burstR: [205, -165], stand: [0, -60] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'patlama anı: konfetiler fırlar, 1.6 sn süzülüp söner' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // tribün bandı
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-244 - LW / 2, -124 - LW / 2, 488 + LW, 124 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-244, -124, 488, 124, 10); ctx.fill();
    // premium parlama: bandın sol üstü
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-200, -114, 60, 8, 0, 0, k.TAU); ctx.fill();

    // seyirci sıraları: basit kafa noktaları
    let seed = 1;
    for (let r = 0; r < 3; r++) {
      const yy = -104 + r * 34;
      for (let i = 0; i < 13; i++) {
        const xx = -216 + i * 36 + (r % 2) * 14 + (k.hash(seed * 3 + 1) - 0.5) * 8;
        const bob = Math.sin(t * 2.2 + seed) * 1.5;         // idle: nefes
        const tone = k.hash(seed * 7 + 2) < 0.3 ? k.rgba('accent') : k.rgba('dim');
        ctx.fillStyle = tone;
        ctx.beginPath(); ctx.arc(xx, yy + bob, 9, 0, k.TAU); ctx.fill();
        seed++;
      }
    }

    // konfeti topları: iki yanda, yukarı-dışa eğik
    const cannon = (sx) => {
      const bx = sx * 205, by = -124;
      ctx.save();
      ctx.translate(bx, by); ctx.rotate(sx * -0.5); ctx.translate(-bx, -by);
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(bx - 13 - LW / 2, by - 44 - LW / 2, 26 + LW, 44 + LW, 8); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); k.rrect(bx - 13, by - 44, 26, 44, 6); ctx.fill();
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); k.rrect(bx - 13, by - 44, 26, 10, 5); ctx.fill();
      ctx.restore();
      return [bx + sx * 22, by - 52];
    };
    const mL = cannon(-1), mR = cannon(1);

    // namlu parlaması: patlama anında
    if (d >= 0 && d < 0.15) {
      const a = 1 - d / 0.15;
      k.glow(mL[0], mL[1], 50, 'yellow', 0.5 * a);
      k.glow(mR[0], mR[1], 50, 'yellow', 0.5 * a);
    }

    const piece = (x, y, rot, c, a) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = k.rgba(c, a);
      ctx.fillRect(-7, -3.5, 14, 7);
      ctx.restore();
    };

    // idle: havada süzülen birkaç parça (patlamadan önce de canlı)
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 3 + 21), h2 = k.hash(i * 7 + 33), h3 = k.hash(i * 11 + 45);
      const x = -220 + h1 * 440 + Math.sin(t * 1.1 + i * 2.2) * 14;
      const y = -140 - h2 * 120 + Math.sin(t * 0.9 + i * 1.7) * 12;
      piece(x, y, h3 * k.TAU + t * (1 + h1 * 2), h2 < 0.5 ? 'accent' : 'yellow', 0.65);
    }

    // patlama: parçalar fırlar, sallanarak süzülür, 1.6 sn'de söner
    if (d >= 0 && d < 1.6) {
      const fade = 1 - d / 1.6;
      for (let i = 0; i < 60; i++) {
        const h1 = k.hash(i * 3 + 5), h2 = k.hash(i * 7 + 11), h3 = k.hash(i * 11 + 2), h4 = k.hash(i * 13 + 7);
        const side = i % 2 === 0 ? -1 : 1;
        const m = side < 0 ? mL : mR;
        const up = (105 + h2 * 80) * Math.sin(Math.min(d / 0.45, 1) * Math.PI / 2);  // hızlı yükselme
        const fall = d > 0.35 ? (d - 0.35) * 100 : 0;                                  // sonra süzülüş
        const px = m[0] + side * (20 + h1 * 60) * Math.min(d / 0.4, 1) * 0.7
          + Math.sin(d * (3 + h3 * 3) + i) * 18 * Math.min(d, 1);                      // yanal salınım
        const py = m[1] - up + fall;
        const rot = h4 * k.TAU + d * (2 + h1 * 4);
        piece(px, py, rot, h3 < 0.45 ? 'accent' : (h3 < 0.75 ? 'yellow' : 'dim'), 0.95 * fade);
      }
    }
  },
};
