// economy/price-tag — asılı fiyat etiketi: delik + ip, üzerinde fiyat yazısı.
// Hafifçe sallanır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) etiket merkezidir.
export default {
  name: 'price-tag', category: 'economy',
  desc: 'İpten sarkan fiyat etiketi; text ile fiyat yazısı değişir',
  tags: ['fiyat', 'etiket', 'price', 'tag', 'indirim', 'sale', 'alışveriş', 'label'],
  box: [-128, -72, 128, 72],
  bleed: 12,
  anchor: 'etiket merkezi (0,0)',
  points: { hole: [-58, 0], corner: [82, -45] },
  params: {
    color: { type: 'color', default: 'yellow' },
    text: { type: 'text', default: '₺99', desc: 'etiket üzerindeki yazı' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // ip (delikten yukarı sola)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-58, -4); ctx.quadraticCurveTo(-88, -34, -112, -62); ctx.stroke();

    // hafif sallantı (delik etrafında)
    ctx.save();
    ctx.translate(-58, 0);
    ctx.rotate(k.noise1(t * 0.6) * 0.05);
    ctx.translate(58, 0);

    const TW = 168, TH = 92, R = 12;
    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-TW / 2 - LW / 2, -TH / 2 - LW / 2, TW + LW, TH + LW, R + 4); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-TW / 2, -TH / 2, TW, TH, R); ctx.fill();
    // delik
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.arc(-58, 0, 10, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-58, 0, 10, 0, k.TAU); ctx.stroke();

    // premium parlama (sol üst — yazıdan uzakta)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, -30, 30, 9, -0.3, 0, k.TAU); ctx.fill();

    // fiyat yazısı (sığmazsa küçülür)
    const label = String(p.text == null ? '₺99' : p.text);
    ctx.fillStyle = k.rgba('ink');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let fs = 38;
    ctx.font = `700 ${fs}px system-ui, sans-serif`;
    const maxW = TW - 70;
    const w0 = ctx.measureText(label).width;
    if (w0 > maxW) fs = Math.max(14, Math.floor(fs * maxW / w0));
    ctx.font = `700 ${fs}px system-ui, sans-serif`;
    ctx.fillText(label, 18, 3);

    ctx.restore();

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(10, TH / 2 + 12, 70, 8, 0, 0, k.TAU); ctx.fill();
  },
};
