// broadcast-fx/lower-third-pop — alt bant yazı kartı belirir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kartın merkezidir.
export default {
  name: 'lower-third-pop', category: 'broadcast-fx',
  desc: 'Alt bant kartı: at anında alttan fırlayıp esneyerek oturur, vurgu çizgisi süpürür, sonra hafif nefes alır',
  tags: ['alt bant', 'lower third', 'isimlik', 'yazı kartı', 'konuk', 'altyazı', 'lower-third', 'name card', 'caption', 'broadcast', 'guest'],
  box: [-230, -75, 230, 75],
  bleed: 30,
  anchor: 'kartın merkezi (0,0)',
  points: { center: [0, 0], accent: [-215, 30] },
  params: {
    at: { type: 'time', default: null, desc: 'kartın belirme anı (0.5 sn pop + çizgi süpürme)' },
    name: { type: 'text', default: 'STÜDYO KONUĞU', desc: 'karttaki isim satırı' },
    color: { type: 'color', default: 'panel' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? 1e9 : t - p.at;
    if (d < 0) return;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    // pop: 0.5 sn, outBack esneme + alttan kayma
    const pop = k.E.outBack(k.clamp(d / 0.5, 0, 1));
    const rise = k.E.outCubic(k.clamp(d / 0.5, 0, 1));
    const idle = Math.sin(t * k.TAU / 2.4) * 1.5; // nefes
    ctx.save();
    ctx.translate(0, (1 - rise) * 46 + idle);
    ctx.scale(Math.max(0.01, pop), Math.max(0.01, pop));
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    blob(-215, -52, 430, 104, 14, k.rgba(p.color));
    // sol vurgu çubuğu
    blob(-215, -52, 18, 104, 9, k.rgba('accent'));
    // isim yazısı
    ctx.save();
    ctx.font = "700 30px system-ui, sans-serif"; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba('ink');
    ctx.fillText(String(p.name ?? 'STÜDYO KONUĞU'), -182, -18);
    ctx.restore();
    // alt sahte metin çizgisi
    ctx.fillStyle = k.rgba('ink', 0.45);
    ctx.beginPath(); k.rrect(-182, 16, 240, 10, 5); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.3);
    ctx.beginPath(); k.rrect(-182, 34, 150, 10, 5); ctx.fill();
    // vurgu çizgisi süpürmesi: 0.5–1.1 sn arasında soldan sağa
    if (d >= 0.5 && d <= 1.1) {
      const sw = k.E.outCubic(k.clamp((d - 0.5) / 0.6, 0, 1));
      ctx.fillStyle = k.rgba('accent');
      ctx.beginPath(); k.rrect(-182, 48, 8 + sw * 380, 6, 3); ctx.fill();
    } else if (d > 1.1) {
      ctx.fillStyle = k.rgba('accent', 0.9);
      ctx.beginPath(); k.rrect(-182, 48, 388, 6, 3); ctx.fill();
    }
    ctx.restore();
  },
};
