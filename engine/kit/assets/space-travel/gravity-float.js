// space-travel/gravity-float — sıfır yerçekiminde süzülen astronot: kask zorunlu,
// karakter ailesi oranları (baş:gövde 1:2.6). Canlı idle: yavaş yukarı-aşağı
// süzülme, kol/bacak savrulması, kask vizöründe gezinen parlama.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'gravity-float', category: 'space-travel',
  desc: 'Sıfır yerçekiminde süzülen kasklı astronot: salınım, savrulan uzuvlar, vizör parlaması',
  tags: ['astronot', 'ağırlıksız', 'yerçekimsiz', 'süzülme', 'uzay', 'uzay yolculuğu', 'kask', 'astronaut', 'zero gravity', 'float', 'spacesuit', 'weightless'],
  box: [-180, -200, 180, 200],
  bleed: 40,
  anchor: 'gövde merkezi (0,0)',
  points: { head: [0, -150], hand: [-98, -132], foot: [62, 178] },
  params: {
    color: { type: 'color', default: 'panel2' },
    mood: { type: 'enum', values: ['happy', 'neutral'], default: 'happy' },
  },
  draw(ctx, t, p, k) {
    const LW = 8;
    const suit = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // canlı idle: yavaş süzülme (4 sn periyot) + hafif dönme salınımı
    const bob = Math.sin(t * k.TAU / 4) * 9;
    const sway = Math.sin(t * k.TAU / 6 + 0.7) * 0.055;

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

    ctx.save();
    ctx.translate(0, bob);
    ctx.rotate(-0.16 + sway);   // hafif yatık süzülme pozu

    // uzuv savrulması (canlı idle): kollar/bacaklar yavaşça dalgalanır
    const armL = Math.sin(t * 1.3) * 10 + k.noise1(t * 0.9) * 6;
    const armR = Math.sin(t * 1.3 + 2.1) * 10 + k.noise1(t * 0.8 + 5) * 6;
    const legL = Math.sin(t * 1.1 + 1.2) * 8;
    const legR = Math.sin(t * 1.1 + 3.4) * 8;

    // sırt çantası (yaşam destek)
    blob(-66, -96, 42, 96, 14, k.rgba('dim'));
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-62, -66); ctx.lineTo(-28, -66); ctx.stroke();
    // oksijen hortumu: çantadan bele kıvrılır (havada: ink, alfa 0.75)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-40, -10);
    ctx.quadraticCurveTo(-70, 30 + legL * 0.4, -44, 74); ctx.stroke();

    // bacaklar (kalın çizgi, uç yuvarlak)
    limb(-18, 88, -34 + legL, 140, 21, suit);
    limb(-34 + legL, 140, -52 + legL * 1.4, 172, 18, suit);
    limb(18, 88, 38 + legR, 142, 21, suit);
    limb(38 + legR, 142, 62 + legR * 1.4, 170, 18, suit);
    // botlar (kısa yatay rrect)
    blob(-52 + legL * 1.4 - 17, 168, 40, 18, 8, suit);
    blob(62 + legR * 1.4 - 17, 166, 40, 18, 8, suit);

    // gövde (rrect): baş yüksekliği 76 → gövde 76*2.6 ≈ 198
    blob(-42, -98, 84, 196, 26, suit);
    // göğüs paneli
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-24, -52, 48, 36, 9); ctx.fill();
    const led = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.6));
    ctx.fillStyle = k.rgba('cyan', led);
    ctx.beginPath(); ctx.ellipse(0, -34, 5.5, 5.5, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, -72, 13, 22, 0.25, 0, k.TAU); ctx.fill();

    // kollar: omuzdan dışa-yukarı, dirsekten bükük, savrulan
    limb(-38, -78, -72, -108 + armL, 20, suit);
    limb(-72, -108 + armL, -98, -132 + armL * 1.3, 17, suit);
    limb(38, -78, 70, -96 + armR, 20, suit);
    limb(70, -96 + armR, 92, -70 + armR * 1.3, 17, suit);
    disc(-98, -132 + armL * 1.3, 13, 13, suit);   // eldiven
    disc(92, -70 + armR * 1.3, 13, 13, suit);

    // kask (zorunlu): baş etrafında büyük kubbe
    const hy = -150;
    disc(0, hy, 54, 58, suit);
    // vizör (bilgi yüzeyi: parlama buraya uygulanmaz, ayrı gezen yansıma var)
    disc(0, hy + 6, 37, 41, k.rgba('panel'));
    // cam tonu
    ctx.fillStyle = k.rgba('cyan', 0.20);
    ctx.beginPath(); ctx.ellipse(-5, hy, 29, 33, 0, 0, k.TAU); ctx.fill();
    // gezen parlama (canlı idle): vizörde yavaşça kayan ışık
    const glx = Math.sin(t * 0.9) * 16;
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    ctx.beginPath(); ctx.ellipse(-14 + glx, hy - 10, 9, 22, 0.35, 0, k.TAU); ctx.fill();
    // cam içi yüz (mood)
    const happy = p.mood === 'happy';
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.arc(s * 11, hy + 4, 3.9, 0, k.TAU); ctx.stroke();
    }
    ctx.beginPath();
    if (happy) ctx.arc(0, hy + 10, 10, 0.25 * Math.PI, 0.75 * Math.PI);
    else { ctx.moveTo(-9, hy + 18); ctx.lineTo(9, hy + 18); }
    ctx.stroke();
    // kask yan lambası (yavaş nabız)
    const lamp = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2.4));
    ctx.fillStyle = k.rgba('cyan', lamp);
    ctx.beginPath(); ctx.ellipse(46, hy - 32, 7, 7, 0, 0, k.TAU); ctx.fill();
    if (lamp > 0.78) k.glow(46, hy - 32, 20, 'cyan', 0.3);

    ctx.restore();
  },
};
