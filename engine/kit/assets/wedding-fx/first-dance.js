// wedding-fx/first-dance — yeni evli çift ilk dansı yapar: döngüsel salınım, dönen çift, süzülen notalar.
// NOT: canvas y-aşağıdır; (0,0) çiftin ayakları, gövde yukarı (negatif y) uzar.
export default {
  name: 'first-dance', category: 'wedding-fx',
  desc: 'Yeni evli çift ilk dansı yapar: döngüsel salınım ve süzülen notalarla yavaş vals',
  tags: ['dans', 'düğün', 'ilk dans', 'vals', 'çift', 'romantik', 'dance', 'wedding', 'waltz', 'couple', 'romantic'],
  box: [-190, -380, 190, 40],
  bleed: 60,
  anchor: 'çiftin ayakları (0,0); 2.4 sn döngüyle salınır',
  points: { heads: [0, -285], hands: [-60, -230], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral'], default: 'happy' },
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

    // vals döngüsü: 2.4 sn periyot — yana salınım + hafif çökme + dönüş hissi
    const ph = 2 * Math.PI * t / 2.4;
    const sway = 18 * Math.sin(ph);
    const bounce = 8 * (0.5 - 0.5 * Math.cos(2 * ph));
    const tilt = 0.05 * Math.sin(ph + 0.6);

    ctx.save();
    ctx.translate(sway * 0.4, 0);
    ctx.rotate(tilt);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 100, 10, 0, 0, k.TAU); ctx.fill();

    // damat (sol): bacaklar vals adımında dönüşümlü
    for (const s of [-1, 1]) {
      const step = s < 0 ? Math.max(0, Math.sin(ph)) : Math.max(0, Math.sin(ph + Math.PI));
      const fx = -52 + s * 14 + step * 12 * s, fy = -14 - step * 22;
      const kx = -52 + s * 14 + step * 6 * s, ky = -70 - step * 12;
      limb(-52, -130 - bounce, kx, ky, 19, body);
      limb(kx, ky, fx, fy - 6, 16, body);
      blob(fx - 12, fy - 13, 24, 13, 6, body);
    }
    blob(-84, -240 - bounce, 62, 116, 26, body); // damat gövde
    // damat kolu: gelinin belinde
    limb(-34, -214 - bounce, 14, -198 - bounce, 16, body);
    disc(-53, -280 - bounce, 33, 31, body); // damat başı
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(-53 + s * 10, -280 - bounce + 4, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.ellipse(-53 + s * 10, -282 - bounce, 4, 4 * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    ctx.beginPath(); ctx.arc(-53, -266 - bounce, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();

    // gelin (sağ): elbise salınır, baş damada yaslanır
    const dressSway = 10 * Math.sin(ph + 1.2);
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(4, -6); ctx.lineTo(96 + dressSway, -6);
    ctx.lineTo(64 + dressSway, -168 - bounce); ctx.lineTo(24, -168 - bounce);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(10, -6); ctx.lineTo(90 + dressSway, -6);
    ctx.lineTo(60 + dressSway, -168 - bounce); ctx.lineTo(28, -168 - bounce);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12); // sağ alt gölge
    ctx.beginPath();
    ctx.moveTo(54, -6); ctx.lineTo(90 + dressSway, -6);
    ctx.lineTo(60 + dressSway, -168 - bounce); ctx.lineTo(46, -168 - bounce);
    ctx.closePath(); ctx.fill();
    blob(22, -252 - bounce, 56, 88, 24, body); // gelin üst gövde
    // gelin kolu: damadın omzunda, el havada
    limb(26, -228 - bounce, -18, -252 - bounce, 15, body);
    limb(-18, -252 - bounce, -58, -268 - bounce, 13, body);
    disc(-58, -268 - bounce, 9, 9, body);
    // damadın diğer eli gelinin elini tutar (havada, yanda)
    limb(-78, -214 - bounce, -96, -238 - bounce, 15, body);
    disc(-96, -238 - bounce, 9, 9, body);
    disc(50, -276 - bounce, 33, 31, body); // gelin başı
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(50 + s * 10, -276 - bounce + 4, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.ellipse(50 + s * 10, -278 - bounce, 4, 4 * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    ctx.beginPath(); ctx.arc(50, -262 - bounce, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // gelin duvağı (salınır)
    ctx.fillStyle = k.rgba('panel2', 0.85);
    ctx.beginPath();
    ctx.moveTo(24, -306 - bounce);
    ctx.quadraticCurveTo(84 + dressSway, -282 - bounce, 76 + dressSway, -224 - bounce);
    ctx.lineTo(54, -246 - bounce);
    ctx.closePath(); ctx.fill();

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-66, -290 - bounce, 12, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(38, -286 - bounce, 12, 8, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();

    // süzülen notalar (tek vurgu rengi: yellow) — vals ritminde yükselir
    for (let i = 0; i < 3; i++) {
      const age = ((t / 1.8 + i / 3) % 1 + 1) % 1;
      const nx = 84 + 24 * Math.sin(age * 6 + i * 2.1);
      const ny = -300 - age * 80;
      const na = 0.85 * (1 - age);
      ctx.fillStyle = k.rgba('yellow', na);
      ctx.strokeStyle = k.rgba('yellow', na); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(nx, ny, 7, 5.5, -0.3, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(nx + 6, ny - 2); ctx.lineTo(nx + 6, ny - 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(nx + 6, ny - 26); ctx.lineTo(nx + 14, ny - 21); ctx.stroke();
    }
  },
};
