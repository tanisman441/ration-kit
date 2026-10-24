// wedding-fx/sparkler-exit — çift maytaplı koridordan çıkar: maytaplar döngüsel kıvılcım saçar, çift yürür.
// NOT: canvas y-aşağıdır; (0,0) çiftin ayakları, kıvılcımlar maytap uçlarından dışa fırlar.
export default {
  name: 'sparkler-exit', category: 'wedding-fx',
  desc: 'Çift maytaplı koridordan çıkar: maytaplar döngüsel kıvılcım saçar, çift yürüyerek ilerler',
  tags: ['maytap', 'düğün', 'çıkış', 'kıvılcım', 'koridor', 'sparkler', 'wedding', 'exit', 'spark', 'aisle'],
  box: [-210, -360, 210, 40],
  bleed: 60,
  anchor: 'çiftin ayakları (0,0); maytaplar iki yanda ellerde tutulur',
  points: { couple: [0, -80], sparklerL: [-150, -180], sparklerR: [150, -180] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba(p.color);
    const inkC = k.rgba('ink');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // maytaplar: iki yanda, üçer adet, ellerde tutulur (uçları yukarı bakar)
    const sparklers = [];
    for (const s of [-1, 1]) {
      for (let j = 0; j < 3; j++) {
        const bx = s * (140 + j * 22);
        const by = -120 - j * 46;
        const tipX = bx + s * 14, tipY = by - 52;
        sparklers.push({ bx, by, tipX, tipY, s, j });
      }
    }

    // maytap çubukları + tutan eller
    for (const sp of sparklers) {
      limb(sp.bx + sp.s * 60, sp.by + 46, sp.bx, sp.by, 18, k.rgba('dim')); // kol (kenardan)
      disc(sp.bx, sp.by + 6, 12, 10, k.rgba('dim')); // el
      ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(sp.bx, sp.by); ctx.lineTo(sp.tipX, sp.tipY); ctx.stroke();
    }

    // kıvılcımlar: her maytap ucundan döngüsel fışkırır (hash tabanlı, yaş 0..1)
    for (const sp of sparklers) {
      const flick = 0.75 + 0.25 * k.noise1(t * 5 + sp.j * 3 + sp.s);
      k.glow(sp.tipX, sp.tipY, 26 * flick, 'yellow', 0.4 * flick);
      for (let i = 0; i < 9; i++) {
        const h1 = k.hash(i * 3 + sp.j * 17 + (sp.s > 0 ? 7 : 3));
        const h2 = k.hash(i * 5 + sp.j * 19 + (sp.s > 0 ? 11 : 5));
        const age = ((t * (1.2 + h2) + h1) % 1 + 1) % 1;
        const a = h1 * k.TAU + age * (1 + h2 * 2) * (sp.j % 2 === 0 ? 1 : -1);
        const r = 6 + age * (20 + h2 * 18);
        const px = sp.tipX + Math.cos(a) * r;
        const py = sp.tipY + Math.sin(a) * r - age * 10;
        const al = 0.95 * (1 - age);
        ctx.fillStyle = k.rgba('yellow', al);
        ctx.beginPath(); ctx.ellipse(px, py, 3.5, 2.5, a, 0, k.TAU); ctx.fill();
      }
      // ucundaki yanan nokta
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath(); ctx.ellipse(sp.tipX, sp.tipY, 5, 5, 0, 0, k.TAU); ctx.fill();
    }

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 96, 10, 0, 0, k.TAU); ctx.fill();

    // çift yürür: 2.4 sn döngü, bacaklar dönüşümlü, hafif ileri eğilim
    const ph = 2 * Math.PI * t / 2.4;
    const bob = 6 * (0.5 - 0.5 * Math.cos(2 * ph));

    // damat (sol)
    for (const s of [-1, 1]) {
      const step = s < 0 ? Math.max(0, Math.sin(ph)) : Math.max(0, Math.sin(ph + Math.PI));
      const fx = -46 + s * 13 + step * 16 * s, fy = -14 - step * 26;
      const kx = -46 + s * 13 + step * 8 * s, ky = -72 - step * 14;
      limb(-46, -128 - bob, kx, ky, 18, body);
      limb(kx, ky, fx, fy - 6, 15, body);
      blob(fx - 12, fy - 13, 24, 13, 6, body);
    }
    blob(-76, -232 - bob, 60, 108, 24, body);
    disc(-46, -270 - bob, 32, 30, body);
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(-55, -274 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(-37, -274 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(-46, -260 - bob, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // damat kolu gelinin belinde
    limb(-24, -208 - bob, 18, -194 - bob, 15, body);

    // gelin (sağ)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(8, -6); ctx.lineTo(88, -6);
    ctx.lineTo(60, -166 - bob); ctx.lineTo(26, -166 - bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(14, -6); ctx.lineTo(82, -6);
    ctx.lineTo(56, -166 - bob); ctx.lineTo(30, -166 - bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12); // sağ alt gölge
    ctx.beginPath();
    ctx.moveTo(52, -6); ctx.lineTo(82, -6);
    ctx.lineTo(56, -166 - bob); ctx.lineTo(44, -166 - bob);
    ctx.closePath(); ctx.fill();
    blob(24, -250 - bob, 54, 86, 24, body);
    disc(50, -272 - bob, 32, 30, body);
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(41, -276 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(59, -276 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(50, -262 - bob, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // gelin kolu damadın omzunda
    limb(28, -226 - bob, -14, -238 - bob, 14, body);
    // gelin duvağı
    ctx.fillStyle = k.rgba('panel2', 0.85);
    ctx.beginPath();
    ctx.moveTo(24, -302 - bob);
    ctx.quadraticCurveTo(82, -280 - bob, 74, -224 - bob);
    ctx.lineTo(54, -244 - bob);
    ctx.closePath(); ctx.fill();

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -280 - bob, 11, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(38, -282 - bob, 11, 8, -0.4, 0, k.TAU); ctx.fill();
  },
};
