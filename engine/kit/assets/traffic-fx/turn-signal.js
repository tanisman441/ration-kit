// traffic-fx/turn-signal — sinyal lambası: amber lens periyodik yanıp söner, at anında seri flaş + halka dalgası.
// ANIMASYON: canlı idle yanıp sönme (1 sn döngü); `at` anında 0.6 sn seri flaş ve sağa yayılan halka.
// Tek vurgu: color paramı (varsayılan yellow).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'turn-signal',
  category: 'traffic-fx',
  desc: 'Amber sinyal lambası; idle yanıp söner, at anında seri flaş çakar',
  tags: ['sinyal', 'lamba', 'blink', 'flaşör', 'dönüş', 'far', 'sinyal lambası', 'turn', 'signal', 'blinker', 'indicator', 'lamp'],
  box: [-90, -90, 90, 90],
  bleed: 40,
  anchor: 'gövde merkezi (0,0)',
  points: { lens: [58, 0], mount: [-66, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'sinyal patlaması: 0.6 sn seri flaş + halka dalgası' },
    color: { type: 'color', default: 'yellow', desc: 'lens rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const bursting = d >= 0 && d < 0.7;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const HW = 65, HH = 42;

    // idle yanıp sönme: 1 sn döngü, 0.55 sn açık
    let on = (t % 1.0) < 0.55;
    // patlama: 0.2 sn aralıklarla 3 flaş
    if (bursting) on = (d % 0.2) < 0.12;

    // --- montaj ayağı ---
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-HW - 16, -12, 18, 24, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-HW - 16, -12, 18, 24, 6); ctx.stroke();

    // --- gövde: sağ alt gölge, gövde, sol üst parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-HW + 6, -HH + 6, HW * 2, HH * 2, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-HW, -HH, HW * 2, HH * 2, 16); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-HW + 20, -HH + 14, 16, 10, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6);
    ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-HW, -HH, HW * 2, HH * 2, 16); ctx.stroke();

    // --- lens: sağa bakan şevron ---
    if (on) k.glow(38, 0, 46, p.color, bursting ? 0.5 : 0.35);
    ctx.fillStyle = k.rgba(p.color, on ? 0.95 : 0.3);
    ctx.beginPath();
    ctx.moveTo(8, -22); ctx.lineTo(48, 0); ctx.lineTo(8, 22);
    ctx.lineTo(8, 12); ctx.lineTo(32, 0); ctx.lineTo(8, -12);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(8, -22); ctx.lineTo(48, 0); ctx.lineTo(8, 22);
    ctx.closePath(); ctx.stroke();

    // --- patlama halkası: lensden sağa yayılır ---
    if (bursting) {
      const q = k.prog(d, 0, 0.7);
      const r = 30 + 70 * q;
      ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - q));
      ctx.lineWidth = 6 * (1 - q) + 2;
      ctx.beginPath(); ctx.arc(48, 0, r, -0.9, 0.9); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.35 * (1 - q));
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(48, 0, r * 0.72, -0.9, 0.9); ctx.stroke();
    }
  },
};
