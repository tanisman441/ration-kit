// space/astronaut — uzay giysili astronot; kask camında yüz ifadesi, belinden sallanan
// bağlantı ipi. Boşta: nefes/bounce + ip salınımı + kask ışığı.
// NOT: canvas y-aşağıdır; (0,0) ayaklardadır, boy ~315 birim.
export default {
  name: 'astronaut', category: 'space',
  desc: 'Uzay giysili astronot; kask camında yüz ifadesi, sallanan bağlantı ipi',
  tags: ['astronot', 'uzay', 'astronaut', 'space', 'uzay giysisi', 'spacesuit', 'kozmonot', 'nasa'],
  box: [-195, -340, 150, 14],
  bleed: 0,
  anchor: 'ayaklar (0,0); boy ~315 birim',
  points: { head: [0, -262], hand: [56, -164], waist: [0, -178] },
  params: {
    color: { type: 'color', default: 'panel2' },
    mood: { type: 'enum', values: ['happy', 'neutral'], default: 'happy' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const suit = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // nefes / bounce (canlı idle): ~2.4 sn periyot
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const bob = Math.sin(t * k.TAU / 2.4 + 1) * 1.5;

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
    ctx.translate(0, bob); // bütün beden hafif yüzer

    // bağlantı ipi (havada: ink rengi, alfa 0.75) — belden sola, salınımlı
    const sway = Math.sin(t * 1.1) * 16 + Math.sin(t * 2.7) * 4;
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-52, -178 - br * 0.4);
    ctx.quadraticCurveTo(-108, -150 + sway, -156, -128 + sway * 1.2); ctx.stroke();
    // ip ucundaki kanca
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-156, -128 + sway * 1.2); ctx.lineTo(-168, -118 + sway * 1.2); ctx.stroke();
    ctx.strokeStyle = inkC; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-156, -128 + sway * 1.2); ctx.lineTo(-168, -118 + sway * 1.2); ctx.stroke();

    // sırt çantası (yaşam destek ünitesi)
    blob(-62, -238 - br * 0.4, 46, 104, 14, k.rgba('dim'));
    // çanta panel çizgileri (iç ayrım: ink, alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-58, -206 - br * 0.4); ctx.lineTo(-22, -206 - br * 0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-58, -168 - br * 0.4); ctx.lineTo(-22, -168 - br * 0.4); ctx.stroke();

    // bacaklar
    for (const s of [-1, 1]) {
      limb(s * 16, -128, s * 20, -64, 22, suit);
      limb(s * 20, -64, s * 22, -26, 19, suit);
    }
    // botlar
    for (const s of [-1, 1]) blob(s * 22 - 16, -16, 38, 17, 8, suit);

    // gövde
    blob(-38, -236 - br * 0.6, 76, 112, 24, suit);
    // göğüs kontrol paneli
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-22, -196 - br * 0.6, 44, 34, 9); ctx.fill();
    const ledA = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.2));
    const ledB = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.2 + Math.PI));
    ctx.fillStyle = k.rgba('green', ledA);
    ctx.beginPath(); ctx.ellipse(-10, -179 - br * 0.6, 5, 5, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', ledB);
    ctx.beginPath(); ctx.ellipse(10, -179 - br * 0.6, 5, 5, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -216 - br * 0.6, 12, 20, 0.25, 0, k.TAU); ctx.fill();

    // kollar (dirsekten hafif bükük)
    const shoY = -214 - br * 0.6;
    for (const s of [-1, 1]) {
      limb(s * 36, shoY, s * 52, -182, 20, suit);
      limb(s * 52, -182, s * 50, -150, 17, suit);
      disc(s * 50, -144, 12, 12, suit); // eldiven
    }

    // kask (baş)
    const hy = -262 - br * 0.7;
    disc(0, hy, 54, 58, suit);
    // kask camı (iki temada da kontrast için panel tonu)
    disc(0, hy + 4, 38, 42, k.rgba('panel'));
    // cam üzerine mavi cam yansıması
    ctx.fillStyle = k.rgba('cyan', 0.22);
    ctx.beginPath(); ctx.ellipse(-6, hy - 2, 30, 34, 0, 0, k.TAU); ctx.fill();
    // cam yansıması (parlama çizgisi)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-20, hy - 26); ctx.quadraticCurveTo(-30, hy - 6, -18, hy + 22); ctx.stroke();
    // cam içi yüz (mood)
    const happy = p.mood === 'happy';
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.arc(s * 11, hy + 2, 3.4, 0, k.TAU); ctx.stroke();
    }
    ctx.beginPath();
    if (happy) ctx.arc(0, hy + 8, 10, 0.25 * Math.PI, 0.75 * Math.PI);
    else { ctx.moveTo(-9, hy + 16); ctx.lineTo(9, hy + 16); }
    ctx.stroke();

    // kask ışığı (yavaş yanıp söner)
    const lamp = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 3.1));
    ctx.fillStyle = k.rgba('cyan', lamp);
    ctx.beginPath(); ctx.ellipse(44, hy - 34, 7, 7, 0, 0, k.TAU); ctx.fill();
    if (lamp > 0.75) k.glow(44, hy - 34, 20, 'cyan', 0.3);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 62, 10, 0, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
