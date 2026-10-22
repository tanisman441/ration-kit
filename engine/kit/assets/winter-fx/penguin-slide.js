// winter-fx/penguin-slide — karnı üstünde kayan penguen; speed ile kayma hızı değişir.
// Sürekli: zıplama (belly-flop), yüzgeç çırpışı, arkada kar spreyi + hız çizgileri.
// NOT: canvas y-aşağıdır; kayış soldan sağa; (0,0) kar zemini merkezidir.
export default {
  name: 'penguin-slide', category: 'winter-fx',
  desc: 'Karnı üstünde kayan penguen: zıplayan süzülme, çırpınan yüzgeçler, arkada kar spreyi ve hız çizgileri',
  tags: ['penguen', 'kayma', 'kış', 'kar', 'kızak', 'penguin', 'slide', 'sliding', 'winter', 'snow'],
  box: [-185, -105, 185, 60],
  bleed: 40,
  anchor: 'kar zemini (0, 30); penguen gövde merkezi ~(-10,-20)',
  points: { head: [72, -52], belly: [-10, -12], tail: [-95, -20] },
  params: {
    speed: { type: 'number', default: 0.6, desc: '0–1: kayma hızı (zıplama, sprey ve çizgi yoğunluğu)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 10;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const beakC = k.rgba('yellow');
    const S = k.clamp(p.speed, 0, 1);
    const bounce = Math.sin(t * k.TAU * (1.2 + 2.2 * S)) * (2.5 + 4.5 * S);  // belly-flop zıplaması
    const rock = Math.sin(t * k.TAU * (1.2 + 2.2 * S) + 1.2) * 0.05 * (0.3 + 0.7 * S);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // --- kar zemini ---
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 46, 172, 16, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(0, 44, 168, 13, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-40, 36, 90, 6, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.translate(0, bounce); ctx.rotate(rock);

    // --- gövde (yatık elips) ---
    disc(-10, -22, 86, 30, body);
    // karın yaması (zemin rengi → iki temada da kontrast)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.ellipse(-6, -10, 66, 17, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -38, 26, 9, -0.3, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(34, -6, 30, 10, -0.3, 0, k.TAU); ctx.fill();

    // --- kafa (önde, yukarıda) ---
    disc(72, -52, 27, 25, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(63, -62, 9, 6, -0.5, 0, k.TAU); ctx.fill();
    // gözler (nokta)
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.arc(76, -58, 3.6, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(64, -58, 3.6, 0, k.TAU); ctx.fill();
    // gaga
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(92, -54); ctx.lineTo(92, -42); ctx.lineTo(108, -48); ctx.closePath();
    ctx.lineWidth = LW * 0.7; ctx.stroke(); ctx.fill();
    ctx.fillStyle = beakC;
    ctx.beginPath(); ctx.moveTo(93, -52); ctx.lineTo(93, -44); ctx.lineTo(105, -48); ctx.closePath(); ctx.fill();

    // --- yüzgeç (gövde yanında çırpınır) ---
    const flap = Math.sin(t * k.TAU * (2.5 + 4 * S)) * (0.30 + 0.20 * S);
    ctx.save(); ctx.translate(-8, -32); ctx.rotate(-0.15 + flap * 0.6);
    ctx.strokeStyle = line; ctx.lineWidth = 13 + LW;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, 2); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, 2); ctx.stroke();
    ctx.restore();

    // --- ayaklar (arkada havada) ---
    const kick = Math.sin(t * k.TAU * (1.2 + 2.2 * S) + 2.4) * 6 * (0.3 + 0.7 * S);
    for (const fy of [-30, -14]) {
      ctx.save(); ctx.translate(-92, fy + kick * 0.5); ctx.rotate(-0.5 + kick * 0.02);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-22, -6, 30, 12, 6); ctx.fill();
      ctx.fillStyle = beakC; ctx.beginPath(); k.rrect(-19, -3.5, 24, 7, 4); ctx.fill();
      ctx.restore();
    }

    ctx.restore();   // penguen dönüşü sonu

    // --- arkada kar spreyi (sürekli sürüklenir) ---
    for (let i = 0; i < 16; i++) {
      const h1 = k.hash(i * 37 + 3), h2 = k.hash(i * 53 + 11);
      const span = 110;
      const frac = ((t * (90 + 200 * S) + h1 * span) % span) / span;
      const xx = -90 - frac * span;                 // [-200, -90]: penguenden geriye
      const a = (1 - frac) * (0.25 + 0.5 * S);      // geride sönümlenir
      const yy = 20 + (h2 - 0.5) * 60 - (1 - frac) * 26 + Math.sin(t * 5 + i * 2.4) * 6;
      ctx.fillStyle = k.rgba('ink', a);
      ctx.beginPath(); ctx.arc(xx, yy, (2 + 4 * h2) * (0.5 + 0.5 * S), 0, k.TAU); ctx.fill();
    }

    // --- hız çizgileri ---
    ctx.strokeStyle = inkC; ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const yy = -52 + i * 26;
      ctx.globalAlpha = 0.10 + 0.28 * S;
      const x1 = -185 + 20, x2 = -95 - 30 * S;
      ctx.beginPath(); ctx.moveTo(x1, yy + bounce * 0.4); ctx.lineTo(x2, yy + bounce * 0.4); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // --- kayma izi (zeminde) ---
    ctx.strokeStyle = k.rgba('ink', 0.25 + 0.25 * S); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-170, 34); ctx.quadraticCurveTo(-90, 40, -30, 36); ctx.stroke();

    ctx.restore();
  },
};
