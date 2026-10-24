// karaoke-fx/spotlight-bounce — sahne spot ışığı; ışın sarkaç gibi sallanır,
// yerdeki ışık havuzu onunla birlikte zıplar. Döngüsel, canlı idle.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; (0,0) zemin ortasıdır.
export default {
  name: 'spotlight-bounce', category: 'karaoke-fx',
  desc: 'Sahne spot ışığı sarkaç gibi sallanır; ışın ve yerdeki ışık havuzu birlikte zıplar',
  tags: ['spot', 'ışık', 'spotlight', 'sahne', 'stage', 'ışın', 'beam', 'konser', 'karaoke', 'sallanma', 'light'],
  box: [-230, -175, 230, 60],
  bleed: 30,
  anchor: 'zemin (0,0); armatür tepede',
  points: { fixture: [0, -160], floor: [0, 40] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'ışın ve havuz rengi (tek vurgu rengi)' },
    swing: { type: 'number', default: 0.7, desc: 'salınım genişliği 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const sw = Math.max(0, Math.min(1, p.swing));
    const floorY = 40;
    const fixY = -160;
    // sarkaç açısı: ~2.4 sn periyot
    const ang = Math.sin(t * k.TAU / 2.4) * 0.38 * sw;
    // ışının zeminle kesiştiği x
    const hitX = Math.tan(ang) * (floorY - fixY);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.55);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-225, floorY); ctx.lineTo(225, floorY); ctx.stroke();

    // ışın: armatürden zemin havuzuna genişleyen koni
    const spread = 58;
    ctx.fillStyle = k.rgba(p.color, 0.22);
    ctx.beginPath();
    ctx.moveTo(-14, fixY + 6);
    ctx.lineTo(hitX - spread, floorY);
    ctx.lineTo(hitX + spread, floorY);
    ctx.lineTo(14, fixY + 6);
    ctx.closePath(); ctx.fill();
    // ışın kenarları (ince, ink)
    ctx.strokeStyle = k.rgba(p.color, 0.45);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-14, fixY + 6); ctx.lineTo(hitX - spread, floorY);
    ctx.moveTo(14, fixY + 6); ctx.lineTo(hitX + spread, floorY);
    ctx.stroke();

    // yerdeki ışık havuzu: elips, açıyla birlikte kayar + nabız
    const pulse = 1 + 0.08 * Math.sin(t * 3.1);
    ctx.fillStyle = k.rgba(p.color, 0.5);
    ctx.beginPath(); ctx.ellipse(hitX, floorY + 4, spread * pulse, 13 * pulse, 0, 0, k.TAU); ctx.fill();
    k.glow(hitX, floorY, 46, p.color, 0.35);

    // ışın içindeki toz zerreleri (hash dağılımlı, ışınla sürüklenir)
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 17 + 11), h2 = k.hash(i * 31 + 23);
      const yy = fixY + 20 + h1 * (floorY - fixY - 40);
      const frac = (yy - fixY) / (floorY - fixY);
      const xx = hitX * frac + (h2 - 0.5) * 2 * spread * frac * 0.8;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i * 1.7));
      ctx.fillStyle = k.rgba(p.color, 0.7 * tw);
      ctx.beginPath(); ctx.arc(xx, yy, 2.5 + h2 * 2, 0, k.TAU); ctx.fill();
    }

    // armatür: tavana asılı spot gövdesi (ışın yönüne döner)
    ctx.save();
    ctx.translate(0, fixY);
    ctx.rotate(ang);
    // askı
    ctx.strokeStyle = k.rgba('ink', 0.8);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, -4); ctx.stroke();
    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-26 - LW / 2, -6 - LW / 2, 52 + LW, 46 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-26, -6, 52, 46, 12); ctx.fill();
    // premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-20, 0, 10, 26, 5); ctx.fill();
    // lens: parlayan daire
    const lensPulse = 0.5 + 0.2 * Math.sin(t * 2.6);
    k.glow(0, 40, 34, p.color, lensPulse);
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); ctx.ellipse(0, 40, 16, 8, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
