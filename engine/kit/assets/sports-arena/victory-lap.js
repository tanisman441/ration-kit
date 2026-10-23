// sports-arena/victory-lap — şeritli kutlama turu atan koşucu; döngülü koşu animasyonu.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; üst = negatif y.
// Karakter STYLE.md ailesindendir (basık daire kafa, kalın yuvarlak uzuvlar).
export default {
  name: 'victory-lap', category: 'sports-arena',
  desc: 'Kutlama turu atan koşucu: döngülü adım döngüsü, arkasında dalgalanan zafer şeridi ve toz bulutları',
  tags: ['koşu', 'kutlama', 'tur', 'zafer', 'şerit', 'maraton', 'run', 'victory lap', 'celebration', 'runner', 'ribbon', 'race'],
  box: [-220, -180, 220, 20],
  bleed: 40,
  anchor: 'zemin (0,0); koşucu merkezi',
  points: { hand: [52, -108], ribbon: [-170, -120], head: [8, -152] },
  params: {
    color: { type: 'color', default: 'accent' },
    pace: { type: 'number', default: 1, desc: 'koşu temposu çarpanı (adım döngüsü hızı)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const shirt = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const pace = Math.max(0.3, Math.min(2.5, p.pace));
    const ph = t * k.TAU * 1.25 * pace;              // adım döngüsü: 0.8 sn tur
    const bob = Math.abs(Math.sin(ph)) * -7;        // zıplama

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

    ctx.save();
    ctx.translate(0, bob);

    // hız çizgileri (arka plan detayı)
    ctx.strokeStyle = k.rgba('ink', 0.28); ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const yy = -60 - i * 34 + Math.sin(t * 9 + i * 2) * 4;
      const xx = -120 - ((t * 260 * pace + i * 90) % 160);
      ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 46, yy); ctx.stroke();
    }

    // zafer şeridi: elden geriye dalgalanır
    const handX = 52, handY = -108;
    ctx.strokeStyle = line; ctx.lineWidth = 14 + LW;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const s = i / 20;
      const rx = handX - s * 190;
      const ry = handY + Math.sin(s * 7 - t * 10 * pace) * (6 + s * 26) - s * 24;
      if (i === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba('yellow'); ctx.lineWidth = 14;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const s = i / 20;
      const rx = handX - s * 190;
      const ry = handY + Math.sin(s * 7 - t * 10 * pace) * (6 + s * 26) - s * 24;
      if (i === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
    }
    ctx.stroke();
    // şerit ucu: küçük bayrak
    const ex = handX - 190, ey = handY + Math.sin(7 - t * 10 * pace) * 32 - 24;
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath();
    ctx.moveTo(ex, ey); ctx.lineTo(ex - 34, ey - 12); ctx.lineTo(ex - 34, ey + 12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ex, ey); ctx.lineTo(ex - 34, ey - 12); ctx.lineTo(ex - 34, ey + 12); ctx.closePath(); ctx.stroke();

    // bacaklar: adım döngüsü (kalça merkezli salınım)
    const hipX = 0, hipY = -78;
    for (const s of [0, 1]) {
      const a = Math.sin(ph + s * Math.PI);
      const kx = hipX + (s === 0 ? -6 : 6) + a * 34;       // diz
      const ky = hipY + 34;
      const fx = hipX + (s === 0 ? -6 : 6) + a * 52;       // ayak
      const fy = -6 - Math.max(0, Math.sin(ph + s * Math.PI + 0.7)) * 22;
      limb(hipX + (s === 0 ? -6 : 6), hipY, kx, ky, 16, shirt);
      limb(kx, ky, fx, fy, 13, shirt);
      blob(fx - 12, fy - 8, 26, 10, 5, shirt);
    }

    // gövde (öne eğik)
    ctx.save();
    ctx.translate(0, -108); ctx.rotate(0.14); ctx.translate(0, 108);
    blob(-24, -142, 48, 70, 15, shirt);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -126, 7, 20, 0.1, 0, k.TAU); ctx.fill();
    // kollar: bacakların tersi
    for (const s of [0, 1]) {
      const a = Math.sin(ph + (1 - s) * Math.PI);
      const exx = (s === 0 ? -20 : 20) + a * 26;
      const eyy = -108 + 22;
      const hxx = (s === 0 ? -20 : 20) + a * 40;
      const hyy = -108 + 44 - Math.abs(a) * 10;
      limb((s === 0 ? -18 : 18), -128, exx, eyy, 14, shirt);
      limb(exx, eyy, hxx, hyy, 11, shirt);
    }
    ctx.restore();

    // kafa
    const hx = 10, hy = -168;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(hx, hy, 26, 28, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(hx, hy, 22.5, 24.5, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 8, hy - 8, 7, 5, -0.4, 0, k.TAU); ctx.fill();
    // yüz: sevinçli
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + s * 9, hy + 1, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(hx + 3, hy + 10, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();

    ctx.restore();

    // toz bulutları: ayakların arkasında döngüsel
    for (let i = 0; i < 3; i++) {
      const cyc = ((t * 1.25 * pace + i / 3) % 1);
      const px = -40 - cyc * 90, py = -8 - cyc * 26;
      const pr = 6 + cyc * 14;
      ctx.fillStyle = k.rgba('dim', 0.35 * (1 - cyc));
      ctx.beginPath(); ctx.arc(px, py, pr, 0, k.TAU); ctx.fill();
    }
  },
};
