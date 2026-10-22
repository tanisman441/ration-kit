// aquarium-fx/plant-sway — akvaryum su yosunu: yapraklar idle salınır
// (~2.4 sn periyot, faz kaymalı), uçlar titrer; wave anında (0.8 sn)
// akıntı dalgası bütün yaprakları yana yatırır.
// NOT: canvas y-aşağıdır; (0,0) bitkinin tabanıdır.
export default {
  name: 'plant-sway', category: 'aquarium-fx',
  desc: 'Akıntıda salınan su yosunu demeti, wave anında akıntı dalgası yaprakları yatırır',
  tags: ['yosun', 'su bitkisi', 'salınım', 'akvaryum bitkisi', 'akıntı', 'seaweed', 'plant', 'sway', 'aquarium', 'aquatic'],
  box: [-80, -210, 80, 30],
  bleed: 35,
  anchor: 'bitkinin tabanı (0,0)',
  points: { base: [0, 0], tip: [0, -195] },
  params: {
    wave: { type: 'time', default: null, desc: 'akıntı dalgası anı (0.8 sn, yapraklar yana yatar)' },
    color: { type: 'color', default: 'green', desc: 'yosun rengi' },
    blades: { type: 'number', default: 5, desc: 'yaprak sayısı (3–7)' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const n = Math.max(3, Math.min(7, Math.round(p.blades == null ? 5 : p.blades)));
    ctx.save();
    ctx.lineCap = 'round';

    // wave olayı (0.8 sn): akıntı bütün yaprakları +x yönüne yatırır
    const wd = p.wave == null ? -1 : t - p.wave;
    let gust = 0;
    if (wd >= 0 && wd < 0.8) gust = Math.sin((wd / 0.8) * Math.PI);

    // taban kayası
    ctx.fillStyle = k.rgba('panel2', 0.95);
    k.rrect(-42, -4, 84, 24, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(-42, -4, 84, 24, 12); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, 3, 15, 6, -0.3, 0, k.TAU); ctx.fill();

    // yapraklar: tabandan uca salınan eğri saplar
    for (let i = 0; i < n; i++) {
      const h = k.hash(i * 17.3 + 2);
      const bx = (i / (n - 1) - 0.5) * 64;
      const len = 120 + h * 70;
      const sway = Math.sin(t * k.TAU / 2.4 + i * 0.9 + h * 2) * 16;
      const bend = sway + gust * 52; // wave'de hepsi yana yatar
      const tipX = bx + bend;
      const tipY = -len + gust * 26; // yatınca biraz alçalır
      const cx = bx + bend * 0.45;
      const cy = -len * 0.55;

      // yaprak gövdesi (kalın yuvarlak çizgi)
      ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 13;
      ctx.beginPath(); ctx.moveTo(bx, -2);
      ctx.quadraticCurveTo(cx, cy, tipX, tipY); ctx.stroke();
      // iç damar: daha ince, açık ton
      ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(bx, -2);
      ctx.quadraticCurveTo(cx, cy, tipX, tipY); ctx.stroke();
      // uç tomurcuğu
      const tipWob = Math.sin(t * 5 + i * 2.2) * 3;
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath(); ctx.arc(tipX + tipWob, tipY, 7, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(tipX + tipWob, tipY, 7, 0, k.TAU); ctx.stroke();
    }

    // suda süzülen mini kabarcıklar (idle canlılık)
    for (let i = 0; i < 4; i++) {
      const h = k.hash(i * 41.7 + 9);
      const ph = ((t * 0.5 + h) % 1);
      const x = (h - 0.5) * 90;
      const y = -30 - ph * 150;
      ctx.strokeStyle = k.rgba('cyan', 0.4 * (1 - ph)); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 2.5 + h * 2, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
