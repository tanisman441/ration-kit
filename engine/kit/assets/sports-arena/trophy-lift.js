// sports-arena/trophy-lift — şampiyonun kupayı başının üstüne kaldırdığı an.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; üst = negatif y.
// Karakter STYLE.md ailesindendir (basık daire kafa, kalın yuvarlak uzuvlar).
export default {
  name: 'trophy-lift', category: 'sports-arena',
  desc: 'Kupa tutan şampiyon: at anında kupayı göğüsten başının üstüne kaldırır, kupa parlar ve kıvılcım saçar',
  tags: ['kupa', 'şampiyon', 'zafer', 'kaldırma', 'ödül', 'trophy', 'champion', 'victory', 'lift', 'celebration', 'winner'],
  box: [-120, -300, 120, 16],
  bleed: 60,
  anchor: 'ayaklar (0,0); kafa merkezi y=-180',
  points: { trophy: [0, -240], head: [0, -180] },
  params: {
    color: { type: 'color', default: 'accent' },
    at: { type: 'time', default: null, desc: 'kaldırış anı: kupa 0.45 sn\'de yukarı çıkar, kıvılcımlar ~0.9 sn sürer' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const shirt = k.rgba(p.color);
    const gold = k.rgba('yellow');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };
    const lift = d < 0 ? 0 : sstep(0, 0.45, d);                 // 0 = göğüste, 1 = tepede
    const ease = 1 - Math.pow(1 - lift, 3);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    const bob = Math.sin(t * 2.4) * 2;                          // idle: nefes

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, 4, 44, 9, 0, 0, k.TAU); ctx.fill();

    // bacaklar + ayaklar
    limb(-11, -52, -15, -4, 17, shirt);
    limb(11, -52, 15, -4, 17, shirt);
    blob(-26, -10, 24, 10, 5, shirt);
    blob(2, -10, 24, 10, 5, shirt);

    // gövde
    blob(-26, -152 + bob, 52, 104, 16, shirt);
    // premium gölge: sağ alt %12 koyultma
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(16, -70 + bob, 8, 34, 0.15, 0, k.TAU); ctx.fill();

    // kafa
    const hy = -184 + bob;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, hy, 28, 30, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(0, hy, 24, 26, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-9, hy - 9, 8, 5.5, -0.4, 0, k.TAU); ctx.fill();
    // yüz: kaldırınca sevinçli
    const mood = d >= 0.3 ? 'happy' : 'neutral';
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
    if (mood === 'happy') {
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 10, hy + 1, 5.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, hy + 10, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    } else {
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 10, hy - 1, 3.4, 0, k.TAU); ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(-8, hy + 10); ctx.lineTo(8, hy + 10); ctx.stroke();
    }

    // kupa konumu: göğüsten tepeye
    const ty = -118 - 128 * ease + bob * ease;
    const sway = Math.sin(t * 1.8) * 0.05;                      // idle: hafif salınım

    // kollar: omuzdan kupanın sapına
    const shY = -140 + bob;
    for (const s of [-1, 1]) {
      const hx = s * 14, hyy = ty + 44;
      const ex = s * 26, ey = (shY + hyy) / 2 - (1 - ease) * 14;
      limb(s * 22, shY, ex, ey, 15, shirt);
      limb(ex, ey, hx, hyy, 12, shirt);
    }

    // kupa (hafif salınımlı)
    ctx.save();
    ctx.translate(0, ty + 44); ctx.rotate(sway); ctx.translate(0, -(ty + 44));
    const cup = (cx, cy) => {
      // kadeh
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy - 30); ctx.lineTo(cx + 38, cy - 30);
      ctx.lineTo(cx + 24, cy + 10); ctx.lineTo(cx - 24, cy + 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.moveTo(cx - 34, cy - 26); ctx.lineTo(cx + 34, cy - 26);
      ctx.lineTo(cx + 21, cy + 6); ctx.lineTo(cx - 21, cy + 6); ctx.closePath(); ctx.fill();
      // kulplar
      ctx.strokeStyle = line; ctx.lineWidth = 10 + LW;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * 38, cy - 12, 15, s > 0 ? -1.2 : Math.PI - 1.9, s > 0 ? 1.9 : Math.PI + 1.2); ctx.stroke(); }
      ctx.strokeStyle = gold; ctx.lineWidth = 10;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * 38, cy - 12, 15, s > 0 ? -1.2 : Math.PI - 1.9, s > 0 ? 1.9 : Math.PI + 1.2); ctx.stroke(); }
      // sap + taban
      blob(cx - 7, cy + 10, 14, 28, 5, gold);
      blob(cx - 26, cy + 38, 52, 14, 6, gold);
      // premium parlama: kadehin sol üstü
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - 14, cy - 18, 9, 13, 0.2, 0, k.TAU); ctx.fill();
    };
    cup(0, ty);
    ctx.restore();

    // zirve efekti: kupa parlar + kıvılcım saçar (0.9 sn)
    if (d >= 0.25 && d < 0.9) {
      const g = (d - 0.25) / 0.65;
      const env = 1 - g;
      k.glow(0, ty - 10, 80, 'yellow', 0.45 * env);
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 3 + 5), h2 = k.hash(i * 7 + 11), h3 = k.hash(i * 11 + 2);
        const a = (h1 - 0.5) * Math.PI * 2;
        const r = 30 + g * (60 + h2 * 70);
        const sx = Math.cos(a) * r, sy = ty - 10 + Math.sin(a) * r * 0.8 - g * 30;
        ctx.fillStyle = k.rgba(h3 < 0.5 ? 'yellow' : 'ink', 0.9 * env);
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(h1 * k.TAU + g * 5);
        ctx.fillRect(-5, -2.5, 10, 5);
        ctx.restore();
      }
    }
  },
};
