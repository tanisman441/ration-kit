// city-fx/crane-swing-2 — kule vinç; kol ve yük sarkaç gibi salınır.
// ANIMASYON: sürekli döngü — bom hafif döner/sallanır (~4.8 sn periyot), troley
// kablosu sarkaç gibi gecikmeli salınır, yük hafif döner; tepede ikaz lambası
// yanıp söner. `swing` (0–1) salınım genliğini belirler. Tek vurgu: red (lamba).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'crane-swing-2',
  category: 'city-fx',
  desc: 'Kule vinç; bom ve asılı yük sarkaç gibi salınır, ikaz lambası yanıp söner',
  tags: ['vinç', 'kule vinç', 'inşaat', 'şantiye', 'bom', 'yük', 'kaldırma', 'şehir', 'crane', 'tower crane', 'construction', 'jib', 'hook', 'city'],
  box: [-170, -228, 170, 170],
  bleed: 40,
  anchor: 'kule tabanı (0,170)',
  points: { hook: [54, 12] },
  params: {
    swing: { type: 'number', default: 0.5, desc: 'salınım genliği (0–1)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const sw = k.clamp(p.swing ?? 0.5, 0, 1);
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const steel = k.rgba('dim');
    const mastX = -96; // kule x konumu

    // salınım fazları (sarkaç: yük gecikmeli)
    const jibA = Math.sin(t * 1.31) * (2 + 7 * sw);            // bom açısı (derece)
    const pendA = Math.sin(t * 1.31 - 0.9) * (3 + 11 * sw);    // yük sarkaç açısı
    const rad = d => d * Math.PI / 180;

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const beam = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // --- taban + kule ---
    plate(-52, 148, 104, 22, 8, k.rgba('panel2'));
    plate(mastX - 13, -96, 26, 244, 8, steel);
    // kafes çizgileri (kule üzerinde)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let y = -80; y < 140; y += 28) {
      ctx.beginPath(); ctx.moveTo(mastX - 13, y); ctx.lineTo(mastX + 13, y + 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mastX + 13, y); ctx.lineTo(mastX - 13, y + 14); ctx.stroke();
    }
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(mastX - 6, -60, 5, 40, 0.08, 0, k.TAU); ctx.fill();

    // --- döner üst grup (bom açısıyla) ---
    ctx.save();
    ctx.translate(mastX, -96);
    ctx.rotate(rad(jibA) * 0.4);
    // kabin
    plate(-16, -44, 40, 44, 10, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('bg', 0.75);
    ctx.beginPath(); k.rrect(-10, -36, 28, 20, 6); ctx.fill();
    // bom (sağa) — kafes kiriş
    beam(10, -30, 210, -30, 12, steel);
    beam(10, -8, 210, -8, 12, steel);
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3;
    for (let x = 10; x < 210; x += 22) {
      ctx.beginPath(); ctx.moveTo(x, -30); ctx.lineTo(x + 11, -8); ctx.stroke();
    }
    // karşı bom + ağırlık (sola)
    beam(-10, -26, -72, -26, 12, steel);
    plate(-104, -52, 34, 40, 8, k.rgba('ink'));
    // tepe kulesi + gergi halatları (serbest çizgi: ink)
    beam(-4, -44, -4, -104, 10, steel);
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-4, -104); ctx.lineTo(206, -30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-4, -104); ctx.lineTo(-68, -26); ctx.stroke();
    // ikaz lambası (yanıp sönme)
    const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 3.4));
    k.glow(-4, -112, 14, 'red', 0.5 * blink);
    ctx.fillStyle = k.rgba('red', blink);
    ctx.beginPath(); ctx.arc(-4, -112, 6, 0, k.TAU); ctx.fill();

    // --- troley + kablo + yük (sarkaç) ---
    const trolX = 150;
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(trolX - 12, -34, 24, 14, 5); ctx.fill();
    const cableLen = 120;
    const hx = trolX + Math.sin(rad(pendA)) * cableLen;
    const hy = -20 + Math.cos(rad(pendA)) * cableLen;
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3.5; // serbest halat: ink
    ctx.beginPath(); ctx.moveTo(trolX, -20); ctx.lineTo(hx, hy); ctx.stroke();
    // kanca bloğu
    plate(hx - 10, hy - 6, 20, 16, 5, k.rgba('panel2'));
    // yük (sallanırken hafif döner)
    ctx.save();
    ctx.translate(hx, hy + 10);
    ctx.rotate(rad(pendA) * 0.5);
    plate(-26, 0, 52, 34, 8, k.rgba('yellow'));
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-12, 8, 10, 6, -0.15, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-26, 17); ctx.lineTo(26, 17); ctx.stroke();
    ctx.restore();
    ctx.restore(); // üst grup
    ctx.restore();
  },
};
