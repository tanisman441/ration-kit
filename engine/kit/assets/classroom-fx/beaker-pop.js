// classroom-fx/beaker-pop — deney beheri: idle'da sıvı içinde kabarcıklar yükselir ve yüzeyde
// patlar; at anında köpük patlaması (0.9 sn): ağızdan büyük baloncuklar fırlar, köpük şapkası
// kabarır, damlacıklar saçılır; sonrasında ağızda köpük kalıntısı kalır.
// canvas y-aşağı; (0,0) beher merkezi.
export default {
  name: 'beaker-pop', category: 'classroom-fx',
  desc: 'Deney beheri: idle kabarcıklanma + at anında köpük patlaması',
  tags: ['beher', 'deney', 'köpük', 'patlama', 'kimya', 'beaker', 'experiment', 'foam', 'bubble', 'fen'],
  box: [-75, -105, 75, 65],
  bleed: 60,
  anchor: 'beher merkezi',
  points: { mouth: [0, -66], base: [0, 48] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'sıvı rengi' },
    at: { type: 'time', default: null, desc: 'köpük patlaması anı (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round';

    // beher gövdesi (yamuk): gölge + cam
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath();
    ctx.moveTo(-50 + 5, -60 + 5); ctx.lineTo(50 + 5, -60 + 5);
    ctx.lineTo(38 + 5, 48 + 5); ctx.lineTo(-38 + 5, 48 + 5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(-50, -60); ctx.lineTo(50, -60); ctx.lineTo(38, 48); ctx.lineTo(-38, 48);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 0.9);
    ctx.beginPath();
    ctx.moveTo(-45, -55); ctx.lineTo(45, -55); ctx.lineTo(34, 43); ctx.lineTo(-34, 43);
    ctx.closePath(); ctx.fill();

    // sıvı (yüzey hafif dalgalı — idle hareket)
    const surf = -18 + 2 * Math.sin(t * 3);
    ctx.fillStyle = k.rgba(p.color, 0.85);
    ctx.beginPath();
    ctx.moveTo(-43, surf); ctx.lineTo(43, surf); ctx.lineTo(33, 41); ctx.lineTo(-33, 41);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-43, surf); ctx.lineTo(43, surf); ctx.stroke();

    // idle kabarcıklar: yükselir, yüzeyde söner
    for (let i = 0; i < 4; i++) {
      const h = k.hash(i * 29 + 7);
      const cyc = (t * (0.4 + h * 0.25) + h) % 1;
      const by = 36 - cyc * 50, bx = (h - 0.5) * 56 + k.noise1(t * 3 + i * 20) * 4;
      const pop = cyc > 0.9 ? (1 - cyc) / 0.1 : 1;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.45 * pop).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(bx, by, (2.5 + h * 3) * (0.6 + 0.4 * pop), 0, k.TAU); ctx.fill();
    }

    // ölçüm çizgileri (iç ayrım)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    for (const yy of [-2, 14, 30]) {
      ctx.beginPath(); ctx.moveTo(-40, yy); ctx.lineTo(-28, yy); ctx.stroke();
    }

    // ağız halkası
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-58, -72, 116, 14, 7); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-54, -68, 108, 10, 5); ctx.fill();

    // ---- at: köpük patlaması ----
    if (d >= 0 && d < 0.9) {
      const g = k.prog(d, 0, 0.9);
      // büyük baloncuklar ağızdan fırlar
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 71 + 3), h2 = k.hash(i * 73 + 19);
        const dd = d - h1 * 0.25;
        if (dd < 0 || dd > 0.7) continue;
        const gg = k.prog(dd, 0, 0.7);
        const bx = (h1 - 0.5) * 70 + k.noise1(i * 9 + dd * 6) * 10;
        const by = -66 - dd * 110 * (0.7 + h2 * 0.6);
        const br = 6 + 24 * k.E.outCubic(gg);
        ctx.fillStyle = k.rgba(p.color, 0.75 * (1 - gg));
        ctx.beginPath(); ctx.arc(bx, by, br, 0, k.TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * (1 - gg)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(bx - br * 0.3, by - br * 0.35, br * 0.3, 0, k.TAU); ctx.fill();
      }
      // köpük şapkası: kabarır ve iner
      const cap = Math.sin(Math.PI * k.prog(d, 0, 0.55));
      const capY = -66 - 30 * cap;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.ellipse(0, capY, 48, 14 + 6 * cap, 0, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 83 + 31);
        ctx.beginPath(); ctx.arc(-36 + h * 72, capY - 8 - h * 10 * cap, 5 + h * 6, 0, k.TAU); ctx.fill();
      }
      // damlacıklar (parabolik)
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 97 + 5), h2 = k.hash(i * 101 + 13);
        const dd = d - h1 * 0.2;
        if (dd < 0 || dd > 0.6) continue;
        const dx = (h1 - 0.5) * 110, dy = -66 - 95 * dd + 120 * dd * dd;
        ctx.fillStyle = k.rgba(p.color, 0.9 * (1 - dd / 0.6));
        ctx.beginPath(); ctx.arc(dx, dy, 2.5 + h2 * 2.5, 0, k.TAU); ctx.fill();
      }
      // hızlı fizz zerrecikleri
      for (let i = 0; i < 14; i++) {
        const h1 = k.hash(i * 113 + 7), h2 = k.hash(i * 127 + 23);
        const dd = d - h1 * 0.15;
        if (dd < 0 || dd > 0.3) continue;
        const fx = (h1 - 0.5) * 90, fy = -66 - dd * 120 * (0.6 + h2 * 0.8);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.8 * (1 - dd / 0.3)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(fx, fy, 1.5 + h2 * 2, 0, k.TAU); ctx.fill();
      }
      if (d < 0.16) {
        const f = 1 - d / 0.16;
        k.glow(0, -66, 70, p.color, 0.4 * f);
      }
    } else if (d >= 0.9) {
      // köpük kalıntısı: ağızda kalan beyaz kabarcıklar
      for (let i = 0; i < 4; i++) {
        const h = k.hash(i * 131 + 41);
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.beginPath(); ctx.arc(-38 + h * 76, -64 - h * 8, 4 + h * 5, 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama (cam sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, -38, 10, 20, 0.25, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
