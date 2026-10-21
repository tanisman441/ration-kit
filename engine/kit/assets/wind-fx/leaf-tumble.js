// wind-fx/leaf-tumble — rüzgarda takla atan yaprak: döngülü savrulma + tumble anında 360° spin ve iz.
// NOT: canvas y-aşağıdır; (0,0) yaprağın merkezidir.
export default {
  name: 'leaf-tumble', category: 'wind-fx',
  desc: 'Rüzgarda takla atan yaprak: sürekli döngülü savrulma, tumble anında hızlı 360° spin ve hayalet iz',
  tags: ['yaprak', 'takla', 'rüzgar', 'sonbahar', 'savrulma', 'leaf', 'tumble', 'wind', 'autumn', 'flutter'],
  box: [-120, -110, 120, 110],
  bleed: 40,
  anchor: 'yaprak merkezi (0,0)',
  points: { leaf: [0, 0] },
  params: {
    tumble: { type: 'time', default: null, desc: 'takla savurma anı (0.9 sn: 360° spin + hayalet iz)' },
    color: { type: 'color', default: 'green' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: yaprak büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.tumble == null ? -1 : t - p.tumble;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- tumble anı: ekstra 360° spin (0.9 sn, outCubic ile hızlı atak) ---
    let spin = 0, trail = 0;
    if (d >= 0 && d < 0.9) {
      const tp = k.prog(d, 0, 0.9);
      spin = k.TAU * k.E.outCubic(tp);
      trail = 1 - tp;
    }

    // --- konum: sürekli döngülü savrulma (takla döngüsü) ---
    const px = 52 * S * Math.sin(t * 0.85) + (d >= 0 && d < 0.9 ? 46 * S * k.E.outCubic(k.prog(d, 0, 0.9)) : 0);
    const py = 34 * S * Math.sin(t * 1.25 + 0.7);
    const rot = t * 1.5 + 0.6 * Math.sin(t * 2.3) + spin;
    const squash = 1 + 0.08 * Math.sin(t * 5.1);

    const leafPath = (sc) => {
      ctx.beginPath();
      ctx.moveTo(-42 * S * sc, 0);
      ctx.quadraticCurveTo(-20 * S * sc, -30 * S * sc, 42 * S * sc, -6 * S * sc);
      ctx.quadraticCurveTo(20 * S * sc, 30 * S * sc, -42 * S * sc, 0);
      ctx.closePath();
    };

    // --- hayalet iz (tumble anında geride kalan 4 kare) ---
    if (trail > 0) {
      for (let i = 1; i <= 4; i++) {
        const f = i / 4;
        const gx = px - f * 70 * S * trail, gy = py - f * 22 * S * trail;
        const gr = rot - f * 1.4;
        ctx.save();
        ctx.translate(gx, gy); ctx.rotate(gr); ctx.scale(squash, squash);
        ctx.fillStyle = k.rgba(p.color, 0.22 * (1 - f) * trail);
        leafPath(1 - f * 0.12);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.translate(px, py); ctx.rotate(rot); ctx.scale(squash, squash);

    // --- dış hat (bg, alfa 0.55) ---
    ctx.fillStyle = k.rgba('bg', 0.55);
    leafPath(1.14);
    ctx.fill();
    // --- yaprak gövdesi ---
    ctx.fillStyle = k.rgba(p.color, 0.92);
    leafPath(1);
    ctx.fill();
    // --- sağ alt gölge ---
    ctx.fillStyle = k.rgba(p.color, 0.14);
    ctx.beginPath();
    ctx.ellipse(16 * S, 11 * S, 22 * S, 9 * S, 0.5, 0, k.TAU);
    ctx.fill();
    // --- sol üst parlama (premium finish, alfa 0.10) ---
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath();
    ctx.ellipse(-16 * S, -11 * S, 18 * S, 7 * S, -0.5, 0, k.TAU);
    ctx.fill();
    // --- orta damar (ink, alfa 0.5) ---
    ctx.strokeStyle = k.rgba('ink', 0.5);
    ctx.lineWidth = 2.5 * S;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-36 * S, 0);
    ctx.quadraticCurveTo(0, -4 * S, 36 * S, -5 * S);
    ctx.stroke();
    // --- sap ---
    ctx.strokeStyle = k.rgba('ink', 0.6);
    ctx.lineWidth = 3 * S;
    ctx.beginPath();
    ctx.moveTo(-42 * S, 0);
    ctx.lineTo(-54 * S, 8 * S);
    ctx.stroke();

    ctx.restore();
  },
};
