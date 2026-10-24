// broadcast-fx/ticker-scroll — kayan haber bandı. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bandın merkezidir.
export default {
  name: 'ticker-scroll', category: 'broadcast-fx',
  desc: 'Haber bandı: solda nabız atan CANLI rozeti, sağda speed ile hızlanan kayan haber yazısı',
  tags: ['haber bandı', 'kayan yazı', 'son dakika', 'canlı', 'ticker', 'haber', 'news ticker', 'scrolling', 'breaking news', 'live', 'banner'],
  box: [-270, -42, 270, 42],
  bleed: 8,
  anchor: 'bandın merkezi (0,0)',
  points: { left: [-262, 0], right: [262, 0], badge: [-215, 0] },
  params: {
    speed: { type: 'number', default: 0.5, desc: '0–1: kayma hızı' },
    text: { type: 'text', default: 'SON DAKİKA  •  STÜDYODA CANLI YAYIN BAŞLADI  •  GÜNDEM SICAK  •  ', desc: 'akan haber yazısı' },
    color: { type: 'color', default: 'panel' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    // ana bant
    blob(-262, -36, 524, 72, 14, k.rgba(p.color));
    // CANLI rozeti (nabız: 1.2 sn döngüde büyür)
    const pulse = 1 + 0.08 * Math.sin(t * k.TAU / 1.2);
    ctx.save(); ctx.translate(-212, 0); ctx.scale(pulse, pulse);
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, 26, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red'); ctx.beginPath(); ctx.arc(0, 0, 22, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, k.TAU); ctx.fill();
    ctx.restore();
    k.glow(-212, 0, 30, 'red', 0.22 + 0.1 * Math.sin(t * k.TAU / 1.2));
    // kayan yazı (kırpma bölgesi rozetin sağı)
    const label = String(p.text == null || p.text === '' ? 'SON DAKİKA' : p.text);
    ctx.save();
    ctx.font = "700 26px system-ui, sans-serif"; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const unit = Math.max(1, ctx.measureText(label).width);
    const x0 = -178, x1 = 254;
    const px = 25 + k.clamp(p.speed ?? 0.5, 0, 1) * 130; // px/sn
    const off = (t * px) % unit;
    ctx.beginPath(); ctx.rect(x0, -32, x1 - x0, 64); ctx.clip();
    ctx.fillStyle = k.rgba('ink');
    for (let i = 0; i < 3; i++) ctx.fillText(label, x0 - off + i * unit, 1);
    ctx.restore();
    // parlama: sol üst, alfa 0.10 (bant üst kenarı)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-40, -28, 90, 6, -0.1, 0, k.TAU); ctx.fill();
  },
};
