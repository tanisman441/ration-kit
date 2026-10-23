// sports-arena/jumbotron-flash — direk üstünde dev stadyum skorboardu; flaş anında ekran çakar.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; üst = negatif y.
export default {
  name: 'jumbotron-flash', category: 'sports-arena',
  desc: 'Direk üstünde dev skorboard: skor yazar, LED kenarlık titrer, flaş anında ekran beyaza çakıp ışık saçar',
  tags: ['skorboard', 'ekran', 'skor', 'stadyum', 'flaş', 'ışık', 'jumbotron', 'scoreboard', 'screen', 'flash', 'stadium', 'led'],
  box: [-190, -330, 190, 45],
  bleed: 70,
  anchor: 'direk tabanı (0,0); ekran merkezi',
  points: { screen: [0, -200], top: [0, -305] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'flaş anı: ekran beyaza çakar, ışık hüzmeleri saçar (~0.6 sn olay)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const frame = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // flaşta ekran hafif sarsılır
    const shake = (d >= 0 && d < 0.3) ? k.noise1(d * 40) * 5 : 0;

    // direk + taban
    frame(-20, -110, 40, 110, 8, k.rgba('panel2'));
    frame(-80, -12, 160, 14, 7, k.rgba('panel2'));

    ctx.save();
    ctx.translate(shake, 0);

    // ekran çerçevesi
    frame(-172, -308, 344, 176, 18, k.rgba(p.color));
    // ekran yüzeyi
    ctx.fillStyle = k.rgba('panel', 0.95);
    ctx.beginPath(); k.rrect(-154, -290, 308, 140, 10); ctx.fill();

    // LED kenarlık: döngüsel yanıp sönme
    for (let i = 0; i < 16; i++) {
      const lx = -154 + (i / 15) * 308;
      const on = k.hash(i * 7 + 3) < 0.5 + 0.4 * Math.sin(t * 5 + i * 1.3);
      ctx.fillStyle = k.rgba('yellow', on ? 0.85 : 0.18);
      ctx.beginPath(); ctx.arc(lx, -282, 3.4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(lx, -158, 3.4, 0, k.TAU); ctx.fill();
    }

    // skor içeriği: iki takım şeridi + büyük skor + dakika
    const flick = 0.9 + 0.1 * k.noise1(t * 6);          // idle LED titremesi
    ctx.save();
    ctx.globalAlpha = flick;
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); k.rrect(-140, -268, 90, 18, 9); ctx.fill();
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(50, -268, 90, 18, 9); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.font = '700 64px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('2 – 1', 0, -212);
    ctx.font = '600 26px sans-serif';
    ctx.fillStyle = k.rgba('dim');
    ctx.fillText("78'", 0, -166);
    ctx.restore();

    // flaş: ekran beyaza çakar
    if (d >= 0 && d < 0.16) {
      ctx.fillStyle = `rgba(255,255,255,${(0.92 * (1 - d / 0.16)).toFixed(3)})`;
      ctx.beginPath(); k.rrect(-154, -290, 308, 140, 10); ctx.fill();
    }
    ctx.restore();

    // ışık hüzmeleri: 0.5 sn'de sönen dönen ışınlar
    if (d >= 0 && d < 0.5) {
      const env = 1 - d / 0.5;
      k.glow(0, -215, 170, 'yellow', 0.4 * env);
      ctx.strokeStyle = k.rgba('yellow', 0.55 * env);
      ctx.lineWidth = 7;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * k.TAU + t * 2.2;
        const r0 = 150, r1 = 150 + 30 * env;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r0, -215 + Math.sin(a) * r0);
        ctx.lineTo(Math.cos(a) * r1, -215 + Math.sin(a) * r1);
        ctx.stroke();
      }
    }

    // premium parlama: çerçevenin sol üstü (bilgi yüzeyi ekrana değil çerçeveye)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-140, -300, 40, 7, -0.1, 0, k.TAU); ctx.fill();
  },
};
