// celebration-fx/balloon-rise — yükselen balon: 8 sn'lik yavaş yükselme döngüsü,
// hafif yatay salınım ve ip salınımı. Balon + düğüm + ink rengi ip.
// NOT: canvas y-aşağıdır; (0,0) balonun merkezidir.
export default {
  name: 'balloon-rise', category: 'celebration-fx',
  desc: 'Yükselen balon: salınarak yavaşça yukarı süzülen, ipli kutlama balonu',
  tags: ['balon', 'uçan balon', 'yükselme', 'parti', 'kutlama', 'balloon', 'rise', 'party', 'celebration', 'float'],
  box: [-75, -165, 75, 165],
  bleed: 20,
  anchor: 'balon merkezi (0,0)',
  points: { top: [0, -72], string_end: [0, 152] },
  params: {
    color: { type: 'color', default: 'red', desc: 'balon rengi (tek vurgu rengi)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4.5;
    // idle animasyon: 8 sn'lik yükselme döngüsü + hafif salınım
    const rise = -((t * 16) % 128);
    const sway = k.noise1(t * 0.55) * 4;
    const tilt = k.noise1(t * 0.42 + 5) * 0.05;
    const bob = Math.sin(t * 2 * Math.PI / 3.2) * 3;
    ctx.save();
    ctx.translate(sway, rise + bob);
    ctx.rotate(tilt);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const line = k.rgba('bg', 0.55);

    // ip: balon düğümünden aşağı sarkan ink rengi serbest çizgi
    const sx0 = 0, sy0 = 72;
    const sx1 = k.noise1(t * 0.7 + 9) * 14, sy1 = 152;
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(sx0, sy0);
    ctx.quadraticCurveTo(sx1 * 0.4 + 8, (sy0 + sy1) / 2, sx1, sy1);
    ctx.stroke();

    // gölge: sağ alta %12 koyultma
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(6, 8, 54, 66, 0, 0, k.TAU); ctx.fill();
    // balon gövdesi
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.ellipse(0, 0, 54, 66, 0, 0, k.TAU); ctx.fill();
    // dış hat
    ctx.strokeStyle = line;
    ctx.lineWidth = LW;
    ctx.beginPath(); ctx.ellipse(0, 0, 54, 66, 0, 0, k.TAU); ctx.stroke();
    // premium parlama: sol üst, beyaz alfa 0.10, kontursuz
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-19, -30, 17, 30, -0.35, 0, k.TAU); ctx.fill();
    // düğüm
    ctx.fillStyle = k.rgba(p.color);
    ctx.strokeStyle = line;
    ctx.lineWidth = LW - 1;
    ctx.beginPath();
    ctx.moveTo(-9, 62); ctx.lineTo(9, 62); ctx.lineTo(0, 78); ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.restore();
  },
};
