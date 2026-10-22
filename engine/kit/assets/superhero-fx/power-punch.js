// superhero-fx/power-punch — süper güçlü yumruk: vuruş anında güç halkası + darbe çizgileri.
// NOT: canvas y-aşağıdır; (0,0) yumruğun merkezi. points.impact çarpma noktasıdır.
export default {
  name: 'power-punch', category: 'superhero-fx',
  desc: 'Süper güçlü yumruk: at anında güç halkası ve radyal darbe çizgileri saçan vuruş',
  tags: ['yumruk', 'vuruş', 'güç', 'darbe', 'patlama', 'punch', 'power', 'hit', 'impact'],
  box: [-150, -130, 190, 130],
  bleed: 50,
  anchor: 'yumruğun merkezi (0,0)',
  points: { impact: [85, 0], wrist: [-85, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'yumruğun çarpma anı (güç halkası + darbe çizgileri, 0.4 sn)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: yumruk + efekt büyüklüğü' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.size, 0.5, 1.5);
    const br = Math.sin(t * 2.6) * 2.2;   // idle nefes
    ctx.save();

    // bilek
    ctx.fillStyle = k.rgba(p.color, 0.75);
    ctx.beginPath(); k.rrect(-150, -18 + br * 0.4, 100, 36 + br * 0.4, 14); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-150, -18 + br * 0.4, 100, 36 + br * 0.4, 14); ctx.stroke();

    // yumruk gövdesi (rrect blok)
    const fy = -40 + br * 0.5;
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-48, fy, 92, 80, 26); ctx.fill();

    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, fy + 12, 22, 10, -0.35, 0, k.TAU); ctx.fill();
    // premium: sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(4, fy + 44, 40, 36, 18); ctx.fill();

    // parmak boğumları (4 çıkıntı)
    for (let i = 0; i < 4; i++) {
      const ky = fy + 12 + i * 20;
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(48, ky, 11, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(48, ky, 11, 0, k.TAU); ctx.stroke();
    }
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-48, fy, 92, 80, 26); ctx.stroke();

    // başparmak çizgisi (ink iç ayrım)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-30, fy + 62); ctx.quadraticCurveTo(10, fy + 70, 38, fy + 56); ctx.stroke();

    // ---- vuruş olayı: at anı (0.4 sn) ----
    if (d >= 0 && d <= 0.6) {
      const ix = 85 * S, iy = br * 0.5;

      // 1) ilk çakma — parlak çekirdek (0.12 sn)
      if (d < 0.12) {
        const f = 1 - d / 0.12;
        k.glow(ix, iy, 80 * S * f, 'yellow', 0.5 * f);
        ctx.fillStyle = k.rgba('yellow', 0.95 * f);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4 + d * 10;
          const rr = Math.max(i % 2 === 0 ? (52 - d * 200) * S : (22 - d * 90) * S, 2);
          const x = ix + Math.cos(a) * rr, y = iy + Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      }

      // 2) güç halkası — genişleyen çift halka
      for (let r = 0; r < 2; r++) {
        const rr = d - r * 0.09;
        if (rr < 0) continue;
        const g = k.prog(rr, 0, 0.42);
        const rad = (20 + 130 * k.E.outExpo(g)) * S;
        ctx.strokeStyle = r === 0 ? k.rgba('yellow', 0.8 * (1 - g)) : k.rgba(p.color, 0.5 * (1 - g));
        ctx.lineWidth = (10 * (1 - g * 0.6) + 2) * S;
        ctx.beginPath(); ctx.arc(ix, iy, rad, 0, k.TAU); ctx.stroke();
      }

      // 3) darbe çizgileri — radyal, öne doğru yoğun
      const g3 = k.prog(d, 0.02, 0.38);
      for (let i = 0; i < 14; i++) {
        const h1 = k.hash(i * 7 + 61), h2 = k.hash(i * 13 + 67);
        const a = -0.9 + h1 * 1.8;                    // öne (sağa) koni
        const l0 = 70 * S, l1 = (100 + h2 * 90) * S;
        const len = l0 + (l1 - l0) * k.E.outCubic(g3);
        const x0 = ix + Math.cos(a) * l0, y0 = iy + Math.sin(a) * l0 * 1.4;
        const x1 = ix + Math.cos(a) * len, y1 = iy + Math.sin(a) * len * 1.4;
        ctx.strokeStyle = k.rgba('ink', 0.7 * (1 - g3));
        ctx.lineWidth = (4.5 - h2 * 2) * S;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }

      // 4) kıvılcım zerreleri
      const g4 = k.prog(d, 0.05, 0.5);
      for (let i = 0; i < 9; i++) {
        const h1 = k.hash(i * 5 + 71), h2 = k.hash(i * 11 + 73);
        const a = h1 * k.TAU;
        const dist = (50 + h2 * 110) * S * k.E.outCubic(g4);
        ctx.fillStyle = k.rgba('yellow', 0.8 * (1 - g4));
        ctx.beginPath();
        ctx.arc(ix + Math.cos(a) * dist, iy + Math.sin(a) * dist, (3 + h2 * 5) * S, 0, k.TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  },
};
