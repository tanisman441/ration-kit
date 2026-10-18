// fantasy/wand — yıldız uçlu büyü asası; cast anında ucundan kıvılcım yağmuru.
// Orijinal tasarım; gerçek film/oyun asası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) asa sap merkezidir.
export default {
  name: 'wand',
  category: 'fantasy',
  desc: 'Yıldız uçlu büyü asası; ucu boşta nabız gibi parlar; cast anında kıvılcım yağmuru ve halka saçar',
  tags: ['asa', 'büyü asası', 'sihirli değnek', 'sihir', 'wand', 'magic wand', 'wizard', 'spell'],
  box: [-95, -118, 95, 122],
  bleed: 90,
  anchor: 'sap merkezi (0,0)',
  points: { tip: [0, -87] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'asa gövde rengi' },
    cast: { type: 'time', default: null, desc: 'büyü atma anı: kıvılcım yağmuru' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const blob = (x, y, w, h, r, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); k.rrect(x + 5, y + 7, w, h, r); ctx.fill();
      ctx.fillStyle = O; ctx.beginPath(); k.rrect(x - 3, y - 3, w + 6, h + 6, r + 3); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
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
    const SX = 0, SY = -55;   // yıldız merkezi

    // sap
    blob(-9, 2, 18, 108, 9, p.color, sh(p.color, 0.72));
    // sap sargısı
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const y = 66 + i * 11;
      ctx.beginPath(); ctx.moveTo(-8, y); ctx.quadraticCurveTo(0, y + 5, 8, y); ctx.stroke();
    }
    // topuz
    ctx.fillStyle = sh(p.color); ctx.beginPath(); ctx.arc(4, 115, 11, 0, k.TAU); ctx.fill();
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(0, 110, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = sh(p.color, 0.72); ctx.beginPath(); ctx.arc(0, 110, 10, 0, k.TAU); ctx.fill();

    // yıldız uç (gölge + hat + dolgu)
    ctx.save(); ctx.translate(4, 5); ctx.fillStyle = sh('purple'); star(SX, SY, 33, 14); ctx.fill(); ctx.restore();
    ctx.lineWidth = 6; ctx.strokeStyle = O; star(SX, SY, 33, 14); ctx.stroke();
    ctx.fillStyle = k.rgba('purple'); star(SX, SY, 33, 14); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(SX - 10, SY - 12, 10, 6, -0.5, 0, k.TAU); ctx.fill();

    // ANIMASYON 1 — idle: uç nabız gibi parlar + 2 kıvılcım yörüngede döner
    const pulse = 0.5 + 0.5 * Math.sin((t / 2.0) * k.TAU);
    k.glow(SX, SY, 30 + 14 * pulse, 'purple', 0.22 + 0.2 * pulse);
    for (let i = 0; i < 2; i++) {
      const a = t * 2.1 + i * Math.PI + k.hash(i * 11 + 3) * 0.6;
      const x = SX + Math.cos(a) * 48, y = SY + Math.sin(a) * 22;
      ctx.fillStyle = k.rgba('purple', 0.55 + 0.3 * Math.sin(t * 5 + i * 3));
      ctx.beginPath(); ctx.arc(x, y, 3.2, 0, k.TAU); ctx.fill();
    }

    // ANIMASYON 2 — cast olayı: kıvılcım yağmuru + genişleyen halka (0.7 sn)
    const d = p.cast == null ? -1 : t - p.cast;
    if (d >= 0 && d < 0.7) {
      const g = d / 0.7;
      k.glow(SX, SY, 90 * (1 - g) + 30, 'purple', 0.55 * (1 - g));
      // genişleyen halka
      ctx.strokeStyle = k.rgba('purple', 0.8 * (1 - g)); ctx.lineWidth = 5 * (1 - g) + 2;
      ctx.beginPath(); ctx.arc(SX, SY, 24 + g * 95, 0, k.TAU); ctx.stroke();
      // sarmal iz
      ctx.strokeStyle = k.rgba('purple', 0.7 * (1 - g)); ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * 3 * Math.PI + d * 6, r = 12 + (i / 40) * 70 * (1 - g * 0.5);
        const x = SX + Math.cos(a) * r, y = SY + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // kıvılcımlar
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 3 + 31), h2 = k.hash(i * 5 + 32), h3 = k.hash(i * 7 + 33);
        const a = h1 * k.TAU, sp = 90 + h2 * 150;
        const dd = sp * (1 - Math.pow(1 - Math.min(d / 0.6, 1), 2));
        const x = SX + Math.cos(a) * dd, y = SY + Math.sin(a) * dd - d * d * 30;
        ctx.fillStyle = i % 4 === 0 ? k.rgba('yellow', 1 - g) : k.rgba('purple', 1 - g);
        ctx.save(); ctx.translate(x, y); ctx.rotate(a + d * 10);
        const sz = 3 + h3 * 6;
        ctx.fillRect(-sz / 2, -sz / 3, sz, sz * 0.66);
        ctx.restore();
      }
    }
  },
};
