// sports-fx/replay-arrow — tekrar oku: yavaşça dönen dairesel ok (canlı idle).
// NOT: canvas y-aşağıdır; ok saat yönünün tersine (geri sarma hissi) döner.
export default {
  name: 'replay-arrow',
  category: 'sports-fx',
  desc: 'Tekrar oku: saat yönünün tersine yavaşça dönen dairesel ok',
  tags: ['tekrar', 'replay', 'ok', 'döngü', 'arrow', 'loop', 'yeniden', 'geri sarma', 'rewind'],
  box: [-140, -140, 140, 140],
  bleed: 30,
  anchor: 'halka merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const C = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const R = 88, W = 30;
    const rot = -t * 0.9;                          // idle: yavaş ters yönde dönüş
    const pulse = 1 + 0.03 * Math.sin(t * 2.6);     // idle: hafif nabız
    const a0 = rot, a1 = rot + 4.6;                 // ~264°'lik yay
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();
    ctx.scale(pulse, pulse);

    // iz gölgesi: ok başının gerisinde kalan silik iz (hareket hissi)
    ctx.strokeStyle = k.rgba(p.color, 0.22);
    ctx.lineWidth = W;
    ctx.beginPath(); ctx.arc(0, 0, R, a0 + 0.12, a0 + 0.95); ctx.stroke();

    // ana yay: dış hat + dolgu
    ctx.strokeStyle = line; ctx.lineWidth = W + 8;
    ctx.beginPath(); ctx.arc(0, 0, R, a0, a1); ctx.stroke();
    ctx.strokeStyle = C; ctx.lineWidth = W;
    ctx.beginPath(); ctx.arc(0, 0, R, a0, a1); ctx.stroke();

    // ok başı: yayın BAŞINDA (a0), dönüş yönünde (azalan açı teğeti = görselde saat tersi)
    const ex = Math.cos(a0) * R, ey = Math.sin(a0) * R;
    const dx = Math.sin(a0), dy = -Math.cos(a0);        // dönüş yönü birim vektörü
    const tipX = ex + dx * 46, tipY = ey + dy * 46;
    const nx = Math.cos(a0), ny = Math.sin(a0);         // normal (dışa)
    const bx = ex - dx * 8, by = ey - dy * 8;
    const hw = 32;
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(tipX + nx * 5, tipY + ny * 5);
    ctx.lineTo(bx + nx * hw, by + ny * hw);
    ctx.lineTo(bx - nx * hw, by - ny * hw);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = C;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(bx + nx * (hw - 6), by + ny * (hw - 6));
    ctx.lineTo(bx - nx * (hw - 6), by - ny * (hw - 6));
    ctx.closePath(); ctx.fill();

    // premium parlama: yayın sol üst kısmında
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.arc(-62, -62, 13, 0, k.TAU); ctx.fill();

    // merkez nokta
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = C;
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
