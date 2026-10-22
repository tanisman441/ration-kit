// pet-fx/cat-pounce — pusuya yatmış kedi; at anında üzerine fırlar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) patilerdir, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'cat-pounce', category: 'pet-fx',
  desc: 'Pusuya yatmış kedi, poposu kıpırdar; at anında gerinip avının üzerine fırlar',
  tags: ['kedi', 'evcil hayvan', 'pusu', 'zıplama', 'av', 'patiler', 'cat', 'pounce', 'pet', 'jump', 'hunt'],
  box: [-150, -200, 150, 10],
  bleed: 90,
  anchor: 'patiler (0,0)',
  points: { head: [72, -58], tail: [-108, -88], paws: [96, -10] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'üzerine atlama — kedi fırlar, gövde gerilir, pençeler ileri (1.1 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const fur = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const df = p.at == null ? -1 : t - p.at;
    const near = df < 0 && df > -0.5;                        // atlama öncesi gerginlik
    const leaping = df >= 0 && df < 0.55;                    // fırlama
    const landing = df >= 0.55 && df < 1.1;                  // iniş + toparlanma
    const le = leaping ? Math.min(df / 0.55, 1) : (landing ? 1 - (df - 0.55) / 0.55 : 0);
    const leE = le < 0.5 ? 2 * le * le : 1 - Math.pow(-2 * le + 2, 2) / 2; // easeInOut
    const wiggle = near ? Math.sin(t * 26) * 5 : Math.sin(t * 2.2) * 1.5;  // popo kıpırdaması
    const br = Math.sin(t * k.TAU / 2.8) * 1.5;                          // nefes
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 88, 11, 0, 0, k.TAU); ctx.fill();

    // fırlama hareket çizgileri
    if (leaping) {
      ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - df / 0.55)); ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        const mx = -120 + i * 26;
        ctx.beginPath(); ctx.moveTo(mx, -18); ctx.lineTo(mx + 30, -44); ctx.stroke();
      }
    }

    // fırlama yörüngesi: yukarı-sağa parabol
    const jx = leE * 92, jy = -Math.sin(leE * Math.PI) * 118;

    ctx.save();
    ctx.translate(jx, jy);
    ctx.rotate(leaping ? -leE * 0.35 : landing ? -(1 - (df - 0.55) / 0.55) * 0.35 : 0);

    // gövde sağ alt gölgesi
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-106 + 6, -78 + 6 + br * 0.4, 176 + leE * 60, 48, 24); ctx.fill();

    // kuyruk: pusuda kıvrık ve ucu seğirir; atlamada geriye uzar
    if (leaping || landing) {
      const tx2 = -110 - leE * 44;
      limb(-96, -52, tx2, -88 + leE * 20, 12, fur);
    } else {
      const tip = Math.sin(t * 9) * (near ? 14 : 6);
      limb(-96, -52, -128, -70, 12, fur);
      limb(-128, -70, -140 + tip, -96, 10, fur);
    }

    // arka bacaklar (çömelmiş)
    blob(-92, -40 + wiggle * 0.3, 44, 34, 16, fur);
    blob(-58, -40 - wiggle * 0.3, 44, 34, 16, fur);
    // gövde: pusuda alçak ve uzun; atlamada gerinir
    blob(-110, -84 + br * 0.4, 180 + leE * 60, 52, 25, fur);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-78, -66, 30, 12, 0, 0, k.TAU); ctx.fill();

    // ön patiler: pusuda yerde; atlamada ileri uzar
    const px = 96 + leE * 52, py = -12 - leE * 30;
    limb(60, -52, px - 26, py, 13, fur);
    limb(78, -50, px - 8, py - 4, 13, fur);
    disc(px - 24, py, 13, 9, fur);
    disc(px - 6, py - 4, 13, 9, fur);

    // baş (atlamada ileri-alçak)
    const hx = 72 + leE * 46, hy = -62 - leE * 26 + br * 0.3;
    // sivri kulaklar
    for (const s of [-1, 1]) {
      ctx.save(); ctx.translate(hx - 14 + s * 15, hy - 24);
      ctx.rotate(s * 0.25 - leE * 0.3);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.moveTo(-10, 6); ctx.lineTo(0, -22); ctx.lineTo(10, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = fur;
      ctx.beginPath(); ctx.moveTo(-7, 4); ctx.lineTo(0, -16); ctx.lineTo(7, 4); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    disc(hx, hy, 31, 29, fur);
    // gözler: odaklanmış (atlamada kısık)
    ctx.fillStyle = inkC;
    const eyeW = (leaping || landing) ? 2.6 : 4.4;
    ctx.beginPath(); ctx.ellipse(hx + 8, hy - 6, eyeW, 5.2, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 26, hy - 6, eyeW, 5.2, 0, 0, k.TAU); ctx.fill();
    // burun + ağız
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); ctx.moveTo(hx + 14, hy + 4); ctx.lineTo(hx + 22, hy + 4); ctx.lineTo(hx + 18, hy + 10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hx + 18, hy + 10, 7, 0.4, Math.PI - 0.4); ctx.stroke();
    // bıyıklar (havada duran ince çizgiler — ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 2.5;
    for (const s of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(hx + 34, hy + 2 + i * 5);
        ctx.quadraticCurveTo(hx + 56, hy - 2 + i * 6 + s * 3, hx + 74, hy + i * 6); ctx.stroke();
      }
    }
    // premium parlama (baş sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 14, hy - 14, 11, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // göz kırpma (sakin durumda)
    const tb = t % 3.6;
    if (tb < 0.12 && df < -0.5) {
      ctx.fillStyle = fur;
      ctx.beginPath(); ctx.ellipse(80, -68 + br * 0.3, 9, 3, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(98, -68 + br * 0.3, 9, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};
