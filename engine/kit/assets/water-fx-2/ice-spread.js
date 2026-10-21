// water-fx-2/ice-spread — yayılan buz: spread anında merkezden dışa doğru
// buz kristalleri belirir (1.3 sn), yarı saydam buz tabakası genişler. Boştayken
// kristaller hafifçe parıldar (idle shimmer).
// NOT: canvas y-aşağıdır; (0,0) yayılma merkezidir.
export default {
  name: 'ice-spread', category: 'water-fx-2',
  desc: 'Yayılan buz: merkezden dışa büyüyen kristaller ve buz tabakası',
  tags: ['buz', 'ice', 'donma', 'kristal', 'kar tanesi', 'yayılma', 'frost', 'freeze', 'crystal', 'snowflake', 'spread'],
  box: [-150, -115, 150, 115],
  bleed: 35,
  anchor: 'yayılma merkezi (0,0)',
  points: { center: [0, 0], edge: [120, 45] },
  params: {
    spread: { type: 'time', default: null, desc: 'buzun yayılmaya başladığı an (1.3 sn sürer)' },
    color: { type: 'color', default: 'cyan', desc: 'buz rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.spread == null ? -1 : t - p.spread;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // Yayılma yarıçapı: spread yoksa tam donmuş, varsa 0→1.3 sn genişler
    const R = d < 0 ? 1 : k.prog(d, 0, 1.3);
    const maxR = 132;

    // Buz tabakası: yarı saydam daire, kenarı kristalimsi dalgalı
    ctx.fillStyle = k.rgba(acc, 0.2);
    ctx.beginPath();
    const RR = maxR * R;
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * k.TAU;
      const rr = RR * (0.9 + 0.1 * Math.sin(a * 13 + 1) + 0.04 * Math.sin(a * 29));
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    if (RR > 6) {
      ctx.strokeStyle = k.rgba(acc, 0.55); ctx.lineWidth = 3;
      ctx.stroke();
      // radyal donma damarları: merkezden dışa ince çizgiler
      ctx.strokeStyle = k.rgba(acc, 0.3); ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * k.TAU + 0.2;
        const lr = RR * (0.82 + 0.12 * k.hash(i * 17 + 3));
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12);
        ctx.lineTo(Math.cos(a) * lr, Math.sin(a) * lr); ctx.stroke();
      }
    }
    // premium finish: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52 * R, -50 * R, 48 * R, 24 * R, -0.5, 0, k.TAU); ctx.fill();

    // Kristal kar tanesi çizici: 6 kol + dallar
    const flake = (x, y, s, alpha, tw) => {
      ctx.strokeStyle = k.rgba(acc, alpha);
      ctx.lineWidth = 3;
      for (let a = 0; a < 6; a++) {
        const th = (a / 6) * k.TAU + 0.3;
        const ex = x + Math.cos(th) * s, ey = y + Math.sin(th) * s;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
        // yan dallar
        for (const f of [0.45, 0.72]) {
          const bx = x + Math.cos(th) * s * f, by = y + Math.sin(th) * s * f;
          const bl = s * 0.22;
          for (const sgn of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(th + sgn * 0.6) * bl, by + Math.sin(th + sgn * 0.6) * bl);
            ctx.stroke();
          }
        }
      }
      // parlak merkez — idle shimmer
      ctx.fillStyle = 'rgba(255,255,255,' + (alpha * (0.6 + 0.4 * tw)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(x, y, 3, 0, k.TAU); ctx.fill();
    };

    // Kristal noktaları: hash ile dağılım, yayılma çemberinin içindeyse çiz
    const NC = 18;
    for (let i = 0; i < NC; i++) {
      const seed = i * 71 + 13;
      const a = k.hash(seed) * k.TAU;
      const dist = 20 + k.hash(seed + 1) * (maxR - 30);
      const x = Math.cos(a) * dist, y = Math.sin(a) * dist * 0.82;
      if (dist > RR) continue;
      const appear = 1 - k.clamp((dist - RR + 30) / 30, 0, 1); // kenarda yumuşak belirme
      const sz = 8 + k.hash(seed + 2) * 14;
      const tw = 0.5 + 0.5 * Math.sin(t * 3 + seed * 2);
      flake(x, y, sz * (0.4 + 0.6 * appear), 0.75 * appear, tw);
    }
    // merkezde büyük kar tanesi
    if (R > 0.05) {
      const tw = 0.5 + 0.5 * Math.sin(t * 2.4);
      flake(0, 0, 26 * k.clamp(R * 3, 0, 1), 0.9, tw);
    }

    // Işıltı benekleri: yayılma ön cephesinde parlar
    if (d >= 0 && d < 1.5) {
      const front = k.prog(d, 0, 1.3) * maxR;
      for (let i = 0; i < 10; i++) {
        const seed = i * 97 + 31;
        const a = k.hash(seed) * k.TAU;
        const r = front * (0.85 + k.hash(seed + 1) * 0.15);
        const tw = Math.abs(Math.sin(t * 8 + seed));
        ctx.fillStyle = 'rgba(255,255,255,' + (tw * 0.8).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.5, 0, k.TAU); ctx.fill();
      }
    }

    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.1);
    ctx.beginPath(); ctx.ellipse(70 * R, 58 * R, 46 * R, 20 * R, 0.4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
