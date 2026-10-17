// tech/keyboard-mouse — klavye + fare seti: geniş klavye, sağda yuvarlak fare.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'keyboard-mouse', category: 'tech',
  desc: 'Klavye ve fare seti; klavyede tuş ızgarası, farede tekerlek çizgisi',
  tags: ['klavye', 'keyboard', 'fare', 'mouse', 'tuş', 'set', 'girdi', 'input', 'bilgisayar'],
  box: [-175, -75, 175, 12],
  bleed: 8,
  anchor: 'taban (0,0)',
  points: { keyboard: [-40, -32], mouse: [127, -29] },
  params: {
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(-30, -4, 150, 9, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(127, -4, 42, 8, 0, 0, k.TAU); ctx.fill();

    // klavye gövdesi
    blob(-160, -60, 242, 54, 10, body);
    // tuşlar: 3 sıra + spacebar sırası
    ctx.fillStyle = k.rgba('bg', 0.35);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 12; c++) {
        const kw = c === 11 ? 22 : 14;
        ctx.beginPath(); k.rrect(-150 + c * 18, -52 + r * 12, kw, 9, 3); ctx.fill();
      }
    }
    // spacebar sırası
    for (const [kx, kw] of [[-150, 22], [-124, 22], [-98, 60], [-34, 22], [-8, 22], [18, 22]]) {
      ctx.beginPath(); k.rrect(kx, -16, kw, 9, 3); ctx.fill();
    }
    // premium parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-110, -50, 40, 6, -0.1, 0, k.TAU); ctx.fill();

    // fare
    blob(95, -54, 64, 48, 22, body);
    // sol/sağ tık ayrımı
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(127, -54); ctx.lineTo(127, -30); ctx.stroke();
    // tekerlek
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(122, -50, 10, 16, 5); ctx.fill();
    // fare parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(112, -44, 10, 6, -0.5, 0, k.TAU); ctx.fill();
  },
};
