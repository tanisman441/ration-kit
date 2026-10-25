// orchestra-fx/conductor-bow — şef `at` anında selam için öne eğilir; öncesinde nefes alır, baton elinde sallanır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) şefin kalça (eğilme) merkezidir.
export default {
  name: 'conductor-bow', category: 'orchestra-fx',
  desc: 'Frak giymiş şef selam için belinden öne eğilir; eğilmeden önce hafifçe nefes alır, batonlu kolu selamla birlikte alçalır',
  tags: ['şef', 'selam', 'eğilme', 'orkestra', 'frak', 'baton', 'sahne', 'conductor', 'bow', 'greeting', 'orchestra', 'stage', 'baton'],
  box: [-110, -120, 110, 120],
  bleed: 30,
  anchor: 'şefin kalça merkezi (0,0); ayaklar altta podyumda',
  points: { head: [0, -72], baton: [58, -58], feet: [0, 100] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: 0.8, desc: 'selam (eğilme) anı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // eğilme açısı: `at` anında başlar, ~1.2 sn sürer (eğil + doğrul)
    let bowA = 0;
    if (d >= 0 && d < 1.2) bowA = 0.62 * Math.sin(Math.PI * d / 1.2);
    // nefes: gövde ±2 units, ~2.4 sn periyot
    const breath = 2 * Math.sin(t * k.TAU / 2.4);

    // podyum
    blob(-52, 100, 104, 12, 6, k.rgba('panel2'));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, 104, 16, 3, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(24, 114, 34, 4, 0, 0, k.TAU); ctx.fill();

    // bacaklar (podyum üstü, eğilmeden etkilenmez)
    ctx.strokeStyle = line; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-12, 52); ctx.lineTo(-12, 100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, 52); ctx.lineTo(12, 100); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-12, 52); ctx.lineTo(-12, 100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, 52); ctx.lineTo(12, 100); ctx.stroke();
    // ayakkabılar
    blob(-22, 94, 20, 8, 4, k.rgba('ink'));
    blob(2, 94, 20, 8, 4, k.rgba('ink'));

    // üst gövde: kalça etrafında döner (eğilme) — baş + gövde + kollar birlikte
    ctx.save();
    ctx.translate(0, 52);
    ctx.rotate(bowA);
    ctx.translate(0, -52);

    // frak gövde: rrect + kuyruk (arkada sarkan iki uç)
    blob(-30, -48 + breath * 0.4, 60, 104, 14, body);
    // frak kuyruğu: gövdenin altından sarkan iki parça
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-32, 40, 26, 30, 8); ctx.fill();
    ctx.beginPath(); k.rrect(6, 40, 26, 30, 8); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-29.5, 42.5, 21, 25, 6); ctx.fill();
    ctx.beginPath(); k.rrect(8.5, 42.5, 21, 25, 6); ctx.fill();
    // gömlek önü (beyaz üçgen) + papyon
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.moveTo(-10, -46); ctx.lineTo(10, -46); ctx.lineTo(0, -18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('accent', 0.9);
    ctx.beginPath(); ctx.moveTo(-8, -42); ctx.lineTo(8, -42); ctx.lineTo(0, -38); ctx.lineTo(-8, -34); ctx.lineTo(8, -34); ctx.lineTo(0, -38); ctx.closePath(); ctx.fill();
    // premium parlama (sol üst, gövde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -34, 8, 12, 0.3, 0, k.TAU); ctx.fill();

    // baş: hafif basık daire (karakter ailesi oranı)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -72, 27, 25, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(0, -72, 24, 22, 0, 0, k.TAU); ctx.fill();
    // saç: üstte koyu yarım daire
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.ellipse(0, -80, 24, 12, 0, Math.PI, k.TAU); ctx.fill();
    // yüz: iki nokta göz + gülümseme yayı (mutlu selam)
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(-9, -72, 2.6, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(9, -72, 2.6, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, -64, 7, 0.25, Math.PI - 0.25); ctx.stroke();

    // sol kol: göğüs önünde, hafif bükük
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-26, -34); ctx.lineTo(-38, -6); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-26, -34); ctx.lineTo(-38, -6); ctx.stroke();
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-38, -6); ctx.lineTo(-18, 6); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-38, -6); ctx.lineTo(-18, 6); ctx.stroke();

    // sağ kol: batonlu, yukarı kalkık (selamda alçalır — eğilmeyle birlikte döner)
    const armLift = -0.35 + 0.15 * Math.sin(t * k.TAU / 2.4);
    ctx.save();
    ctx.translate(26, -34);
    ctx.rotate(armLift);
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, -14); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, -14); ctx.stroke();
    // el
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(28, -15, 8, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(28, -15, 6, 0, k.TAU); ctx.fill();
    // baton: elden yukarı dışa
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(28, -15); ctx.lineTo(58, -52); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(28, -15); ctx.lineTo(58, -52); ctx.stroke();
    // baton ucu parıltısı
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(58, -52, 4, 0, k.TAU); ctx.fill();
    ctx.restore();

    ctx.restore(); // üst gövde dönüşü

    ctx.restore();
  },
};
