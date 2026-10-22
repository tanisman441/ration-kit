// camping-fx/marshmallow-toast — çubuk ucunda marshmallow: at anında kızarır (0.9 sn), çubuk hafif sallanır.
// NOT: canvas y-aşağıdır; (0,0) marshmallow merkezidir (çubuk ucu).
export default {
  name: 'marshmallow-toast',
  category: 'camping-fx',
  desc: 'Çubukta marshmallow: at anında alevde kızarıp altın-kahveye döner',
  tags: ['marshmallow', 'kızarmış', 'kamp', 'çubuk', 'ateş', 'kızartma', 'marshmallow', 'toasted', 'campfire', 'stick'],
  box: [-140, -90, 60, 65],
  bleed: 30,
  anchor: 'marshmallow merkezi (çubuk ucu, 0,0)',
  points: { tip: [0, 0], grip: [-118, 42] },
  params: {
    at: { type: 'time', default: null, desc: 'kızarma anı (0.9 sn: beyaz → altın → kahve, alev parlaması)' },
    toast: { type: 'number', default: 1, desc: '0–1: kızarma hedef derinliği' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: sahne büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.size, 0.5, 1.5);
    const d = p.at == null ? -1 : t - p.at;
    const target = k.clamp(p.toast, 0, 1);
    const tp = d < 0 ? 0 : target * k.prog(d, 0, 0.9);
    const mix3 = (a, b, x) => [k.lerp(a[0], b[0], x), k.lerp(a[1], b[1], x), k.lerp(a[2], b[2], x)];
    ctx.save();

    // --- çubuk hafif sallanır (tutma noktası etrafında) ---
    const bob = 0.035 * Math.sin(t * 1.7);
    ctx.translate(-118 * S, 42 * S); ctx.rotate(bob); ctx.translate(118 * S, -42 * S);

    // çubuk
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 7 * S; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-118 * S, 42 * S); ctx.lineTo(0, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 8.5 * S;
    ctx.beginPath(); ctx.moveTo(-118 * S, 42 * S); ctx.lineTo(-112 * S, 37 * S); ctx.stroke();

    // --- alev parlaması: kızarma sırasında büyür ---
    const flare = d < 0 ? 0 : Math.sin(Math.PI * k.prog(d, 0.25, 0.55));
    k.glow(0, -4 * S, (34 + flare * 32) * S, k.col('red'), 0.22 + flare * 0.28 + 0.05 * Math.sin(t * 8));
    const fh = (20 + flare * 30 + 5 * k.noise1(t * 9 + 3)) * S;
    const lean = k.noise1(t * 6.5) * 8 * S;
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath();
    ctx.moveTo(-11 * S, -2 * S);
    ctx.bezierCurveTo(-12 * S, -2 * S - fh * 0.5, -5 * S + lean * 0.4, -2 * S - fh * 0.75, lean, -2 * S - fh);
    ctx.bezierCurveTo(5 * S + lean * 0.6, -2 * S - fh * 0.7, 12 * S, -2 * S - fh * 0.45, 11 * S, -2 * S);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath();
    ctx.moveTo(-6 * S, -2 * S);
    ctx.bezierCurveTo(-6.5 * S, -2 * S - fh * 0.3, -2.5 * S + lean * 0.4, -2 * S - fh * 0.5, lean * 0.7, -2 * S - fh * 0.62);
    ctx.bezierCurveTo(2.5 * S + lean * 0.5, -2 * S - fh * 0.45, 6.5 * S, -2 * S - fh * 0.28, 6 * S, -2 * S);
    ctx.closePath(); ctx.fill();

    // --- marshmallow: kızarma rengi ---
    const raw = k.col('panel'), golden = k.col('yellow');
    const deep = mix3(k.col('yellow'), k.col('red'), 0.6);
    const mc = mix3(mix3(raw, golden, k.prog(tp * 2, 0, 1)), deep, k.prog(tp * 2, 1, 2));
    const melt = 1 + 0.05 * tp * Math.sin(t * 3);
    ctx.save();
    ctx.translate(0, 0); ctx.rotate(-0.341); ctx.scale(melt, 1 / melt);
    ctx.fillStyle = k.rgba('dim', 0.12);
    ctx.beginPath(); k.rrect(-26 * S + 5 * S, -17 * S + 6 * S, 52 * S, 34 * S, 12 * S); ctx.fill();
    ctx.fillStyle = k.rgba(mc, 1);
    ctx.beginPath(); k.rrect(-26 * S, -17 * S, 52 * S, 34 * S, 12 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5 * S;
    ctx.beginPath(); k.rrect(-26 * S, -17 * S, 52 * S, 34 * S, 12 * S); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-13 * S, -8 * S, 11 * S, 6 * S, -0.4, 0, k.TAU); ctx.fill();
    // yanık benekler
    const charA = 0.85 * k.prog(tp, 0.55, 1);
    if (charA > 0.01) {
      ctx.fillStyle = k.rgba('dim', charA);
      for (let i = 0; i < 3; i++) {
        const cxp = (k.hash(i * 29 + 4) - 0.5) * 36 * S;
        const cyp = (k.hash(i * 47 + 11) - 0.5) * 20 * S;
        ctx.beginPath(); ctx.arc(cxp, cyp, (2.5 + 2 * k.hash(i * 61)) * S, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();

    // --- kızardıktan sonra ince buhar ---
    if (d > 0.9 && tp > 0.3) {
      for (let i = 0; i < 2; i++) {
        const ph = ((t / 2.6) + 0.3 + i * 0.5) % 1;
        ctx.fillStyle = k.rgba('dim', 0.22 * (1 - ph) * tp);
        ctx.beginPath();
        ctx.arc(k.noise1(t * 2 + i * 13) * 14 * S, -(28 + ph * 55) * S, (5 + ph * 9) * S, 0, k.TAU);
        ctx.fill();
      }
    }

    ctx.restore();
  },
};
