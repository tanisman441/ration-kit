// city-fx/subway-arrive — tünelden gelen metro treni; `at` anında istasyona girer.
// ANIMASYON: `at` anında tren tünelden çıkıp 1.5 sn'de yumuşak frenle durur;
// duruşta hafif sarsıntı + tekerlek tozu, kapı üstü göstergeler yanar, far nabızla parlar.
// Idle'da far glow'u nefes alır, gövde ±1 titrer. Tek vurgu: far/gösterge (yellow).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'subway-arrive',
  category: 'city-fx',
  desc: 'Tünelden çıkıp istasyona yanaşan metro treni; at anında fren yapıp durur',
  tags: ['metro', 'tren', 'tünel', 'istasyon', 'banliyö', 'raylı', 'şehir', 'subway', 'metro train', 'tunnel', 'station', 'city'],
  box: [-200, -92, 200, 92],
  bleed: 60,
  anchor: 'gövde merkezi (tren durunca 0,0)',
  points: { doors: [40, 6] },
  params: {
    at: { type: 'time', default: null, desc: 'trenin istasyona varış anı (1.5 sn fren)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);

    // --- tünel (önce iç karanlık, duvar en son trenin üstüne gelecek) ---
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(-200, -92, 110, 184, 4); ctx.fill();
    // derinlik halkaları
    ctx.strokeStyle = k.rgba('ink', 0.18); ctx.lineWidth = 5;
    for (let i = 0; i < 3; i++) {
      const rr = 30 + i * 26;
      ctx.beginPath(); ctx.arc(-145, 10, rr, 0, k.TAU); ctx.stroke();
    }

    // --- tren konumu: tünelden çıkış + fren ---
    const startX = -238, restX = 0;
    const moving = d >= 0 && d < 1.5;
    const e = d < 0 ? 0 : k.E.outCubic(k.prog(d, 0, 1.5));
    const tx = k.lerp(startX, restX, e);
    // duruş sarsıntısı (ilk 0.6 sn'de sönümlü)
    const jolt = d >= 1.5 ? Math.sin((d - 1.5) * 14) * 4 * Math.exp(-(d - 1.5) * 5) : 0;
    const bob = k.noise1(t * 2.1) * 1.5; // idle titreme
    const ty = bob + jolt * 0.4;
    const arrived = d >= 1.5;

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // gövde (tünel dışına taşan kısım clip'lenir — görselde zaten duvarın arkasında)
    ctx.save();
    ctx.beginPath(); ctx.rect(-200, -92, 400, 184); ctx.clip();
    plate(tx - 100, ty - 54, 200, 106, 20, k.rgba(p.color));
    // premium parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(tx - 62, ty - 40, 26, 10, -0.15, 0, k.TAU); ctx.fill();
    // renk şeridi (vurgu)
    ctx.fillStyle = k.rgba('accent', 0.9);
    ctx.beginPath(); k.rrect(tx - 100, ty + 8, 200, 12, 6); ctx.fill();
    // camlar
    for (let i = 0; i < 4; i++) {
      const wx = tx - 82 + i * 42;
      ctx.fillStyle = k.rgba('bg', 0.75);
      ctx.beginPath(); k.rrect(wx, ty - 38, 32, 30, 8); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', arrived ? 0.32 : 0.18);
      ctx.beginPath(); ctx.ellipse(wx + 11, ty - 28, 8, 5, -0.3, 0, k.TAU); ctx.fill();
    }
    // kabin ön camı (sağda)
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); k.rrect(tx + 62, ty - 38, 28, 34, 8); ctx.fill();
    // far (nabızlı glow)
    const hp = 0.7 + 0.3 * Math.sin(t * 2.6);
    k.glow(tx + 76, ty + 30, 22, 'yellow', 0.55 * hp);
    ctx.fillStyle = k.rgba('yellow', 0.95);
    ctx.beginPath(); ctx.arc(tx + 76, ty + 30, 9, 0, k.TAU); ctx.fill();
    // kapılar + gösterge
    for (const dx of [8, 52]) {
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(tx + dx, ty - 44); ctx.lineTo(tx + dx, ty + 44); ctx.stroke();
      const gi = arrived ? 0.95 : 0.25 + 0.15 * Math.sin(t * 2.2);
      k.glow(tx + dx, ty - 48, 10, 'green', 0.5 * gi);
      ctx.fillStyle = k.rgba('green', gi);
      ctx.beginPath(); ctx.arc(tx + dx, ty - 48, 4.5, 0, k.TAU); ctx.fill();
    }
    // bojiler
    ctx.fillStyle = k.rgba('bg', 0.8);
    for (const bx of [-62, 62]) {
      ctx.beginPath(); k.rrect(tx + bx - 26, ty + 44, 52, 16, 8); ctx.fill();
    }
    // ray
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-200, ty + 62, 400, 8, 4); ctx.fill();

    // fren tozu (varış anında)
    if (d >= 1.2 && d < 2.4) {
      const fp = k.prog(d, 1.2, 2.4);
      for (let i = 0; i < 8; i++) {
        const px = tx - 70 + k.hash(i * 7 + 1) * 160 - fp * 60;
        const py = ty + 58 - fp * (14 + k.hash(i * 3 + 2) * 26);
        ctx.fillStyle = k.rgba('dim', 0.45 * (1 - fp));
        ctx.beginPath(); ctx.arc(px, py, 5 + fp * 8, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore(); // tren clip'i

    // --- tünel duvarı (trenin üstüne; kemerli ağız evenodd ile) ---
    ctx.beginPath();
    ctx.rect(-200, -92, 108, 184);
    ctx.moveTo(-200, 92); ctx.lineTo(-92, 92); ctx.lineTo(-92, -20);
    ctx.arc(-146, -20, 54, 0, Math.PI, true);
    ctx.lineTo(-200, -20); ctx.closePath();
    ctx.fillStyle = k.rgba('panel2');
    ctx.fill('evenodd');
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath();
    ctx.moveTo(-92, 92); ctx.lineTo(-92, -20);
    ctx.arc(-146, -20, 54, 0, Math.PI, true);
    ctx.lineTo(-200, -20);
    ctx.stroke();
    ctx.restore();
  },
};
