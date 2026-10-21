// horror-fx/blood-drip — yaradan sızan kan: sürekli damla döngüsü + fışkırma olayı.
// NOT: canvas y-aşağıdır; kan +y yönüne düşer, tabanda birikir.
export default {
  name: 'blood-drip', category: 'horror-fx',
  desc: 'Yaradan sızan kan: yavaş sürekli damla döngüsü; at anında 0.8 sn kan fışkırıp tabanda sıçrar',
  tags: ['kan', 'damla', 'yara', 'kanama', 'korku', 'kan birikintisi', 'blood', 'drip', 'bleed', 'wound', 'horror', 'blood pool'],
  box: [-60, -110, 60, 110],
  bleed: 25,
  anchor: 'yaranın merkezi (0,-70)',
  points: { wound: [0, -70], pool: [0, 95] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'fışkırma anı: 0.8 sn yoğun kan akışı, tabanda sıçrama' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    const poolY = 95;

    const drop = (x, y, r, stretch, alpha) => {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.2, r * 1.34 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath(); ctx.ellipse(x, y - r * 0.06, r * 0.9, r * 1.06 * stretch, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - r * 0.36, y - r * 0.42, r * 0.3, r * 0.46, -0.4, 0, k.TAU); ctx.fill();
    };

    // --- yara: tırtıklı koyu kesik + kırmızı kenar ---
    const woundPath = () => {
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const a = (i / 10) * k.TAU;
        const rr = (i % 2 === 0 ? 26 : 16) * (0.85 + 0.3 * k.hash(i * 7 + 3));
        const x = Math.cos(a) * rr, y = -70 + Math.sin(a) * rr * 0.55;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };
    k.glow(0, -70, 30, k.col(p.color), 0.25 + 0.1 * Math.sin(t * 2.2));  // yara nabzı
    ctx.fillStyle = k.rgba(p.color, 0.55); woundPath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.95);                  // iç kesik
    ctx.beginPath(); ctx.ellipse(0, -70, 15, 8, 0, 0, k.TAU); ctx.fill();

    // --- fışkırma olayı: 0.8 sn, 6 kademeli damla + tabanda sıçrama ---
    let poolGrow = 0;
    if (d >= 0 && d < 0.85) {
      poolGrow = k.prog(d, 0, 0.8);
      for (let i = 0; i < 6; i++) {
        const start = i * 0.09;
        const dd = d - start;
        if (dd < 0) continue;
        const fall = k.prog(dd, 0, 0.45);
        const y = -58 + (poolY - 8 + 58) * fall * fall;
        if (fall < 1) drop((k.hash(i * 31) - 0.5) * 14, y, 7.5, 1 + fall, 0.95);
      }
      // sıçrayan küçük damlalar (tabandan yukarı koni)
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 7 + 51), h2 = k.hash(i * 13 + 67);
        const tt = d * (0.7 + 0.6 * h2);
        if (tt > 0.6) continue;
        const ang = -Math.PI / 2 + (h1 - 0.5) * 1.8;
        const r = (60 + 90 * h2) * tt;
        const x = Math.cos(ang) * r, y = poolY - 6 + Math.sin(ang) * r + 130 * tt * tt;
        const life = 1 - tt / 0.6;
        if (life <= 0) continue;
        ctx.fillStyle = k.rgba(p.color, 0.85 * life);
        ctx.beginPath(); ctx.arc(x, y, (2 + 3 * h1) * life + 1, 0, k.TAU); ctx.fill();
      }
    } else if (d >= 0.85) {
      poolGrow = 1 - 0.6 * k.prog(d, 0.85, 2.6);   // birikinti yavaşça çekilir
    }

    // --- kan birikintisi (taban) ---
    const prx = 34 + 26 * Math.max(0, poolGrow);
    const pulse = 1 + 0.04 * Math.sin(t * 2.4);
    ctx.fillStyle = darker(p.color);
    ctx.beginPath(); ctx.ellipse(6, poolY + 6, prx * pulse, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); ctx.ellipse(0, poolY, prx * pulse, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-prx * 0.3, poolY - 3, prx * 0.32, 3.4, -0.2, 0, k.TAU); ctx.fill();

    // --- sürekli idle damla döngüsü (3.2 sn): büyü → uzama → düşüş → sıçrama ---
    const C = 3.2, ph = (t % C) / C;
    const srcY = -56;
    if (ph < 0.38) {
      const g = k.prog(ph, 0, 0.38);
      drop(0, srcY + 4, 3 + 7 * g, 1 + g * 0.25, 0.95);
    } else if (ph < 0.54) {
      const g = k.prog(ph, 0.38, 0.54);
      const y1 = srcY + 4 + 14 * g;
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath();
      ctx.moveTo(-3.4, srcY); ctx.lineTo(3.4, srcY);
      ctx.lineTo(1.6, y1 + 7); ctx.lineTo(-1.6, y1 + 7);
      ctx.closePath(); ctx.fill();
      drop(0, y1, 10 - 1.2 * g, 1.25 + g * 1.1, 0.95);
    } else {
      const g = k.prog(ph, 0.54, 1);
      const y = srcY + 14 + (poolY - srcY - 14) * g * g;
      if (y < poolY - 2) drop(k.noise1(t * 3) * 2, y, 8.8, 1 + g * 0.9, 0.95);
      else {
        const s = k.prog(g, 0.94, 1);
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - s));
        ctx.lineWidth = 4 * (1 - s) + 1;
        ctx.beginPath(); ctx.ellipse(0, poolY, 7 + 24 * s, 3.5 + 7 * s, 0, 0, k.TAU); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
