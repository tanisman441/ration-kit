// classroom-fx/chalk-write — mini tahta üzerinde tebeşirle yazı yazma animasyonu:
// write anında harfler sırayla belirir (0.9 sn), tebeşir parçası yazım ucunu takip eder,
// toz zerrecikleri dökülür; idle'da tebeşir park hâlinde hafif titrer.
// canvas y-aşağı; (0,0) tahta merkezi.
export default {
  name: 'chalk-write', category: 'classroom-fx',
  desc: 'Tebeşirle yazı yazma: mini tahtada harfler sırayla belirir, tebeşir ucu takip eder',
  tags: ['tebeşir', 'yazı', 'tahta', 'yazma', 'chalk', 'writing', 'board', 'ders', 'lesson', 'okul'],
  box: [-115, -75, 115, 75],
  bleed: 14,
  anchor: 'tahta merkezi',
  points: { tip: [0, 12], topleft: [-100, -62], bottomright: [100, 62] },
  params: {
    color: { type: 'color', default: 'ink', desc: 'tebeşir rengi' },
    text: { type: 'text', default: '2+2=4', desc: 'tahtaya yazılacak metin (en fazla 12 harf)' },
    write: { type: 'time', default: null, desc: 'yazma anı — harfler 0.9 snde sırayla belirir' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const txt = String(p.text ?? '2+2=4').slice(0, 12);
    const d = p.write == null ? -1 : t - p.write;
    // yazma ilerlemesi: write yoksa metin baştan görünür
    const g = p.write == null ? 1 : k.prog(d, 0, 0.9);
    const shown = txt.slice(0, Math.ceil(g * txt.length));

    // tahta: gölge + çerçeve + yazı alanı (tema-adaptif: koyu temada kara tahta, açıkta beyaz tahta)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-103, -58, 200, 120, 10); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-109, -69, 218, 138, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-100, -60, 200, 120, 10); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, -44, 34, 12, -0.25, 0, k.TAU); ctx.fill();

    // yazı
    ctx.font = '600 30px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const wx = -88, wy = 4;
    ctx.fillStyle = k.rgba(p.color, 0.92);
    ctx.fillText(shown, wx, wy);
    const cw = ctx.measureText(shown).width;
    const cx = wx + cw;

    // tebeşir parçası: yazarken ucu takip eder, öncesinde tepside durur, bitince uca yaslanır
    ctx.lineCap = 'round';
    let px, py, pa;
    if (d < 0 && p.write != null) { px = -70; py = 42; pa = 0.25; }
    else if (g < 1) {
      px = cx + 8; py = 2 + k.noise1(t * 22) * 2.5; pa = -0.55 + k.noise1(t * 17) * 0.08;
    } else { px = cx + 14; py = 12; pa = -0.95 + 0.04 * Math.sin(t * 3); }
    ctx.translate(px, py); ctx.rotate(pa);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-13, -1, 30, 11, 5); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath(); k.rrect(-16, -5, 30, 11, 5); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-6, -3, 9, 3, 0, 0, k.TAU); ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // tebeşir tozu: yazı sırasında uçtan dökülür
    if (d >= 0 && d < 1.4) {
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 37 + 5), h2 = k.hash(i * 41 + 9);
        const start = h1 * 0.9, dd = d - start;
        if (dd < 0 || dd > 0.6) continue;
        const sx = wx + ctx.measureText(txt.slice(0, Math.ceil(h1 * txt.length))).width;
        const dx = sx - 6 - h2 * 16, dy = 16 + dd * 42;
        ctx.fillStyle = k.rgba(p.color, 0.7 * (1 - dd / 0.6));
        ctx.beginPath(); ctx.arc(dx, dy, 1.4 + h2 * 2.2, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
