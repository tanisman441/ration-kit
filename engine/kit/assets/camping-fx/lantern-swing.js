// camping-fx/lantern-swing — daldan sarkan kamp feneri: sarkaç gibi salınır, içindeki alev titrer.
// NOT: canvas y-aşağıdır; (0,0) askı halkasıdır (sarkaç dönme noktası).
export default {
  name: 'lantern-swing',
  category: 'camping-fx',
  desc: 'Asılı kamp feneri: sarkaç gibi salınır, cam içindeki alev titrek yanar',
  tags: ['fener', 'kamp feneri', 'kamp lambası', 'asılı', 'salınım', 'ışık', 'lantern', 'lamp', 'swing', 'camping light'],
  box: [-85, -30, 85, 160],
  bleed: 30,
  anchor: 'askı halkası (0,0)',
  points: { hook: [0, -8], flame: [0, 92] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'alev/ışık tonu' },
    sway: { type: 'number', default: 1, desc: '0–1: salınım genliği' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: fener büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.size, 0.5, 1.5);
    const A = k.clamp(p.sway, 0, 1);
    const lc = p.color;
    ctx.save();

    // --- askı halkası (sabit) ---
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5 * S; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -8 * S, 8 * S, 0, k.TAU); ctx.stroke();

    // --- sarkaç salınımı: halka etrafında dönüş ---
    const ang = 0.17 * A * Math.sin(t * 2.2);
    ctx.rotate(ang);

    // ip (serbest çizgi: ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4.5 * S;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30 * S); ctx.stroke();

    // üst kapak
    ctx.fillStyle = k.rgba('dim', 0.12);
    ctx.beginPath(); k.rrect(-18 * S + 5 * S, 30 * S + 6 * S, 40 * S, 18 * S, 8 * S); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-20 * S, 30 * S, 40 * S, 18 * S, 8 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4 * S;
    ctx.beginPath(); k.rrect(-20 * S, 30 * S, 40 * S, 18 * S, 8 * S); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-9 * S, 35 * S, 8 * S, 4.5 * S, -0.5, 0, k.TAU); ctx.fill();

    // cam gövde
    ctx.fillStyle = k.rgba('panel', 0.88);
    ctx.beginPath(); k.rrect(-32 * S, 48 * S, 64 * S, 66 * S, 14 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5 * S;
    ctx.beginPath(); k.rrect(-32 * S, 48 * S, 64 * S, 66 * S, 14 * S); ctx.stroke();
    // sol üst parlama (premium finish)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-17 * S, 60 * S, 11 * S, 16 * S, -0.5, 0, k.TAU); ctx.fill();

    // mum
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-7 * S, 96 * S, 14 * S, 18 * S, 4 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3 * S;
    ctx.beginPath(); k.rrect(-7 * S, 96 * S, 14 * S, 18 * S, 4 * S); ctx.stroke();

    // titrek alev (sarkaç sürüklenmesiyle yana yatar)
    const drag = ang * 60 * S;
    const flick = 1 + 0.22 * k.noise1(t * 11 + 5);
    const fh = 17 * S * flick;
    const lean = (k.noise1(t * 7.3) * 5 + drag) * S;
    k.glow(0, 88 * S, 55 * S, k.col(lc), 0.30 + 0.10 * Math.sin(t * 9.2));
    ctx.fillStyle = k.rgba(lc, 0.95);
    ctx.beginPath();
    ctx.moveTo(-6.5 * S, 94 * S);
    ctx.bezierCurveTo(-7 * S, 94 * S - fh * 0.5, -3 * S + lean * 0.4, 94 * S - fh * 0.75, lean, 94 * S - fh);
    ctx.bezierCurveTo(3 * S + lean * 0.6, 94 * S - fh * 0.7, 7 * S, 94 * S - fh * 0.45, 6.5 * S, 94 * S);
    ctx.closePath(); ctx.fill();

    // alt taban
    ctx.fillStyle = k.rgba('dim', 0.12);
    ctx.beginPath(); k.rrect(-24 * S + 5 * S, 114 * S + 6 * S, 48 * S, 14 * S, 7 * S); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-24 * S, 114 * S, 48 * S, 14 * S, 7 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4 * S;
    ctx.beginPath(); k.rrect(-24 * S, 114 * S, 48 * S, 14 * S, 7 * S); ctx.stroke();

    ctx.restore();
  },
};
