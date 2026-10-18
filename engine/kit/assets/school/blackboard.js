// school/blackboard — tebeşirle yazı yazılan kara tahta; write anında metin belirir
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) tahta merkezidir.
export default {
  name: 'blackboard', category: 'school',
  desc: 'Ahşap çerçeveli kara tahta; write anında tebeşir yazısı soldan sağa belirir',
  tags: ['tahta', 'kara tahta', 'blackboard', 'sınıf', 'classroom', 'tebeşir', 'chalk', 'ders'],
  box: [-155, -145, 155, 125],
  bleed: 20,
  anchor: 'tahta merkezi (0,0)',
  points: { top: [0, -95], tray: [0, 100] },
  params: {
    text: { type: 'text', default: 'okul', desc: 'tahtaya yazılan metin' },
    write: { type: 'time', default: null, desc: 'yazma anı (metin soldan sağa belirir, ~1.2 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const board = 'rgba(38,70,58,0.97)';   // tahta yeşili: iki temada da koyu
    const chalk = 'rgba(250,250,245,0.92)'; // tebeşir beyazı: iki temada da okunur
    const d = p.write == null ? -1 : t - p.write;
    const txt = String(p.text == null ? 'okul' : p.text);

    // asma ipi (serbest çizgi → ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-130, -100); ctx.lineTo(0, -140); ctx.lineTo(130, -100);
    ctx.stroke();

    // ahşap çerçeve
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-150 - LW / 2, -100 - LW / 2, 300 + LW, 195 + LW, 16); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-150, -100, 300, 195, 16); ctx.fill();

    // tahta yüzeyi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-134 - LW / 2, -84 - LW / 2, 268 + LW, 163 + LW, 10); ctx.fill();
    ctx.fillStyle = board;
    ctx.beginPath(); k.rrect(-134, -84, 268, 163, 10); ctx.fill();
    // sağ alt gölge (hafif hacim)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(60, -10, 74, 89, 10); ctx.fill();

    // tebeşir yazısı (ilerlemeye göre soldan sağa belirir)
    const prog = d < 0 ? 1 : k.clamp(d / 1.2, 0, 1);
    ctx.save();
    ctx.font = '700 46px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const tw = ctx.measureText(txt).width;
    const cx = 0, cy = -4;
    if (prog < 1) {
      ctx.beginPath();
      ctx.rect(cx - tw / 2 - 8, cy - 40, (tw + 16) * prog, 80);
      ctx.clip();
    }
    ctx.fillStyle = chalk;
    ctx.fillText(txt, cx, cy);
    ctx.restore();

    // yazan tebeşir parçası (olay sırasında sınırda)
    if (d >= 0 && d < 1.2) {
      const fx = cx - tw / 2 + tw * prog;
      ctx.save();
      ctx.translate(fx + 6, cy - 34);
      ctx.rotate(0.5);
      ctx.fillStyle = chalk;
      ctx.beginPath(); k.rrect(-5, -16, 10, 32, 4); ctx.fill();
      ctx.restore();
      // tebeşir tozu
      for (let i = 0; i < 3; i++) {
        const h = k.hash(i + 7);
        const px = fx - 20 - h * 30, py = cy + 10 + (h - 0.5) * 50;
        ctx.fillStyle = 'rgba(250,250,245,' + (0.35 * (1 - prog)).toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(px, py, 2.5 + h * 2, 0, k.TAU); ctx.fill();
      }
    }

    // tebeşir tablası + tebeşirler
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-70 - LW / 2, 95 - LW / 2, 140 + LW, 18 + LW, 9); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-70, 95, 140, 18, 9); ctx.fill();
    ctx.fillStyle = chalk;
    ctx.beginPath(); k.rrect(-48, 97, 26, 10, 5); ctx.fill();
    ctx.beginPath(); k.rrect(-12, 98, 20, 9, 4); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); k.rrect(18, 97, 30, 11, 5); ctx.fill(); // silgi

    // süzülen toz (idle)
    for (let i = 0; i < 3; i++) {
      const h = k.hash(i + 21);
      const px = -100 + h * 200 + k.noise1(t * 0.6 + h * 10) * 14;
      const py = -60 + ((t * 8 + h * 120) % 130);
      ctx.fillStyle = 'rgba(250,250,245,0.14)';
      ctx.beginPath(); ctx.arc(px, py, 2, 0, k.TAU); ctx.fill();
    }
  },
};
