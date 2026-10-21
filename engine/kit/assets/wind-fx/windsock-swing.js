// wind-fx/windsock-swing — rüzgar çorabı: döngülü salınım + gust anında yatay gerilme.
// NOT: canvas y-aşağıdır; direk x=0'dadır, çorap (0,-80) pivotundan sarkar; rüzgar +x yönünden eser.
export default {
  name: 'windsock-swing', category: 'wind-fx',
  desc: 'Rüzgar çorabı: sürekli salınım döngüsü, gust anında yatay gerilip sertçe sallanır',
  tags: ['rüzgar çorabı', 'rüzgar gülü', 'salınım', 'rüzgar', 'havaalanı', 'windsock', 'wind', 'swing', 'airport'],
  box: [-50, -110, 200, 135],
  bleed: 30,
  anchor: 'direk tabanı (0,0)',
  points: { pivot: [0, -80], mouth: [0, -80] },
  params: {
    gust: { type: 'time', default: null, desc: 'şiddetli rüzgar anı (1.0 sn: çorap yatay gerilir, salınım sertleşir)' },
    color: { type: 'color', default: 'red' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: çorap büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.gust == null ? -1 : t - p.gust;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();
    ctx.lineCap = 'round';

    // --- gust zarfı (0.2 sn atak, 0.8 sn sönüm) ---
    let env = 0;
    if (d >= 0) env = Math.min(k.prog(d, 0, 0.2), 1 - k.prog(d, 0.2, 1.0));

    // --- direk ---
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-6 * S, -84 * S, 12 * S, 204 * S, 6 * S);
    ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.10);
    k.rrect(-4.5 * S, -80 * S, 3.5 * S, 196 * S, 1.5 * S);
    ctx.fill();
    // taban
    ctx.fillStyle = k.rgba('dim', 0.9);
    k.rrect(-20 * S, 112 * S, 40 * S, 11 * S, 5 * S);
    ctx.fill();

    // --- pivot mafsalı ---
    const px = 0, py = -80 * S;
    ctx.fillStyle = k.rgba('ink', 0.95);
    ctx.beginPath(); ctx.arc(px, py, 8 * S, 0, k.TAU); ctx.fill();

    // --- salınım açısı: sarkık (idle) → yatay (gust), üstüne döngülü salınım ---
    // açı: aşağıdan ölçülür; 0 = dikey sarkma, 1.45 ≈ yatay
    const rest = 0.45 + 0.22 * Math.sin(t * 2.1) + 0.06 * k.noise1(t * 3.7);
    const target = 1.38 + 0.18 * Math.sin(t * 7.5) * env + 0.1 * Math.sin(t * 13) * env;
    const ang = rest + (target - rest) * env;

    const SEG = 4, segLen = 38 * S;
    const r0 = 26 * S, r1 = 10 * S;
    let sx = px, sy = py;

    for (let i = 0; i < SEG; i++) {
      const f0 = i / SEG, f1 = (i + 1) / SEG;
      // her segment hafifçe bükülür (dalga)
      const a0 = ang + 0.14 * Math.sin(t * 3.2 + i * 1.3) * (1 - env * 0.5);
      const a1 = ang + 0.14 * Math.sin(t * 3.2 + (i + 1) * 1.3) * (1 - env * 0.5);
      const rr0 = r0 + (r1 - r0) * f0, rr1 = r0 + (r1 - r0) * f1;
      const ex0 = sx + Math.sin(a0) * segLen, ey0 = sy + Math.cos(a0) * segLen;
      const ex1 = sx + Math.sin(a1) * segLen, ey1 = sy + Math.cos(a1) * segLen;
      // segment yamuk (ağız geniş, uç dar)
      const nx0 = Math.cos(a0), ny0 = -Math.sin(a0);
      ctx.beginPath();
      ctx.moveTo(sx + nx0 * rr0, sy + ny0 * rr0);
      ctx.lineTo(ex1 + Math.cos(a1) * rr1, ey1 - Math.sin(a1) * rr1);
      ctx.lineTo(ex1 - Math.cos(a1) * rr1, ey1 + Math.sin(a1) * rr1);
      ctx.lineTo(sx - nx0 * rr0, sy - ny0 * rr0);
      ctx.closePath();
      ctx.strokeStyle = k.rgba('bg', 0.55);
      ctx.lineWidth = 4 * S;
      ctx.stroke();
      ctx.fillStyle = k.rgba(i % 2 === 0 ? p.color : 'panel2', 0.92);
      ctx.fill();
      sx = (ex0 + ex1) / 2; sy = (ey0 + ey1) / 2;
    }

    // --- ağız kasnağı (ink halka) ---
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 4 * S;
    ctx.beginPath(); ctx.arc(px, py, r0, 0, k.TAU); ctx.stroke();
    // kasnak üstü parlama
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(px - r0 * 0.4, py - r0 * 0.45, r0 * 0.35, r0 * 0.18, -0.5, 0, k.TAU); ctx.fill();

    // --- uç kuyruk şeridi (rüzgarda titrer) ---
    const tipX = sx, tipY = sy;
    const tailA = ang + 0.3 * Math.sin(t * 5.5);
    const tl = 26 * S;
    ctx.strokeStyle = k.rgba(p.color, 0.8);
    ctx.lineWidth = 4 * S;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.quadraticCurveTo(
      tipX + Math.sin(tailA) * tl * 0.6, tipY + Math.cos(tailA) * tl * 0.6 + 6 * S * Math.sin(t * 9),
      tipX + Math.sin(tailA) * tl, tipY + Math.cos(tailA) * tl
    );
    ctx.stroke();

    ctx.restore();
  },
};
