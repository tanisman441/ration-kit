// fantasy/shield — önden görünen uçurtma (kite) kalkan; ortasında yıldız amblem.
// Orijinal tasarım; gerçek arma/haberleşme sembolü kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) kalkan merkezidir.
export default {
  name: 'shield',
  category: 'fantasy',
  desc: 'Önden görünen uçurtma kalkan; yıldız amblemli; hit anında sarsılır ve kıvılcım saçar',
  tags: ['kalkan', 'şövalye kalkanı', 'savunma', 'zırh', 'shield', 'knight shield', 'defense', 'armor'],
  box: [-105, -115, 105, 122],
  bleed: 60,
  anchor: 'kalkan merkezi (0,0)',
  points: { center: [0, 0], top: [0, -100] },
  params: {
    color: { type: 'color', default: 'panel2', desc: 'kalkan gövde rengi' },
    hit: { type: 'time', default: null, desc: 'darbe anı: sarsıntı + kıvılcım' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const star = (x, y, rO, rI, n = 5, rot = -Math.PI / 2) => {
      ctx.beginPath();
      for (let i = 0; i < n * 2; i++) {
        const r = i % 2 === 0 ? rO : rI;
        const a = rot + (i / (n * 2)) * k.TAU;
        const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    const shieldPath = () => {
      ctx.beginPath();
      ctx.moveTo(-85, -100);
      ctx.lineTo(85, -100);
      ctx.quadraticCurveTo(88, -20, 45, 45);
      ctx.quadraticCurveTo(25, 80, 0, 108);
      ctx.quadraticCurveTo(-25, 80, -45, 45);
      ctx.quadraticCurveTo(-88, -20, -85, -100);
      ctx.closePath();
    };

    // darbe sarsıntısı
    const d = p.hit == null ? -1 : t - p.hit;
    const shake = d >= 0 && d < 0.5 ? Math.sin(d * 46) * 9 * (1 - d / 0.5) : 0;
    ctx.save();
    ctx.translate(shake, 0);

    // gölge + dış hat + gövde
    ctx.save(); ctx.translate(5, 7); ctx.fillStyle = sh(p.color); shieldPath(); ctx.fill(); ctx.restore();
    ctx.lineWidth = 12; ctx.strokeStyle = O; shieldPath(); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); shieldPath(); ctx.fill();
    // iç bordür
    ctx.save(); ctx.translate(0, -4); ctx.scale(0.84, 0.84);
    ctx.lineWidth = 5; ctx.strokeStyle = k.rgba('ink', 0.35); shieldPath(); ctx.stroke(); ctx.restore();
    // yıldız amblem
    ctx.save(); ctx.translate(4, -12 + 5); ctx.fillStyle = sh('yellow'); star(0, 0, 36, 15); ctx.fill(); ctx.restore();
    ctx.lineWidth = 6; ctx.strokeStyle = O; star(0, -12, 36, 15); ctx.stroke();
    ctx.fillStyle = k.rgba('yellow'); star(0, -12, 36, 15); ctx.fill();
    ctx.fillStyle = sh(p.color);
    ctx.beginPath(); ctx.arc(4, -7, 11, 0, k.TAU); ctx.fill();
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(0, -12, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, -12, 10, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, -62, 26, 13, -0.4, 0, k.TAU); ctx.fill();

    // ANIMASYON 1 — idle amblem ışıltısı: ~6 sn'de bir süpürme
    const cyc = t % 6;
    if (cyc < 1.1) {
      const g = cyc / 1.1, x = -90 + 180 * g;
      ctx.save(); shieldPath(); ctx.clip();
      ctx.fillStyle = `rgba(255,255,255,${(0.28 * Math.sin(g * Math.PI)).toFixed(3)})`;
      ctx.beginPath(); k.rrect(x - 12, -110, 24, 225, 12); ctx.fill();
      ctx.restore();
    }
    ctx.restore(); // sarsıntı sonu

    // ANIMASYON 2 — hit olayı: flaş + kıvılcım yağmuru (0.55 sn)
    if (d >= 0 && d < 0.55) {
      const g = d / 0.55;
      ctx.save(); shieldPath(); ctx.clip();
      ctx.fillStyle = `rgba(255,255,255,${(0.5 * (1 - g * g)).toFixed(3)})`;
      shieldPath(); ctx.fill();
      ctx.restore();
      k.glow(20 + shake, -30, 55 * (1 - g) + 15, 'yellow', 0.5 * (1 - g));
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 3 + 7), h2 = k.hash(i * 5 + 8), h3 = k.hash(i * 7 + 9);
        const a = -0.6 - h1 * 1.9;                      // yukarı-sola saçılma
        const sp = 90 + h2 * 130, dd = sp * (1 - Math.pow(1 - Math.min(d / 0.45, 1), 2));
        const x = 20 + shake + Math.cos(a) * dd, y = -30 + Math.sin(a) * dd + d * d * 60;
        ctx.fillStyle = i % 3 === 0 ? k.rgba('yellow', 1 - g) : k.rgba('ink', 1 - g);
        ctx.save(); ctx.translate(x, y); ctx.rotate(a + d * 8);
        const sz = 3 + h3 * 5;
        ctx.fillRect(-sz / 2, -sz / 3, sz, sz * 0.66);
        ctx.restore();
      }
    }
  },
};
