// health/heart — klasik kalp silueti; göğsünde EKG çizgisi, boştayken lub-dub nabzı atar.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) kalbin merkezidir.
export default {
  name: 'heart', category: 'health',
  desc: 'Kırmızı kalp; EKG çizgili, boştayken çift vuruşlu nabız atar, beat anında halka yayar',
  tags: ['kalp', 'nabız', 'kalp atışı', 'sağlık', 'heart', 'heartbeat', 'pulse', 'ekg', 'love'],
  box: [-100, -100, 100, 100],
  bleed: 45,
  anchor: 'kalbin merkezi (0,0)',
  points: { top: [0, -72], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'red' },
    beat: { type: 'time', default: null, desc: 'atım anı: güçlü nabız + genişleyen halka (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.beat == null ? -1 : t - p.beat;

    const heart = s => {
      ctx.beginPath();
      ctx.moveTo(0, 52 * s);
      ctx.bezierCurveTo(-95 * s, -8 * s, -72 * s, -78 * s, 0, -38 * s);
      ctx.bezierCurveTo(72 * s, -78 * s, 95 * s, -8 * s, 0, 52 * s);
      ctx.closePath();
    };

    // boştaki nabız: lub-dub (1 sn periyot, çift vuruş)
    const ph = t % 1.0;
    const lub = Math.exp(-Math.pow((ph - 0.10) / 0.07, 2));
    const dub = Math.exp(-Math.pow((ph - 0.26) / 0.07, 2)) * 0.65;
    let scale = 1 + 0.032 * (lub + dub);

    // beat olayı: 0.6 sn'de güçlü şişme
    const g = d < 0 ? 0 : k.prog(d, 0, 0.6);
    if (g > 0) scale *= 1 + 0.17 * Math.sin(g * Math.PI);

    ctx.save();
    ctx.scale(scale, scale);

    // gölge (sağ alt %12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(7, 6); heart(1); ctx.fill(); ctx.restore();
    // dış hat
    ctx.fillStyle = line; heart(1.06); ctx.fill();
    // gövde
    ctx.fillStyle = k.rgba(p.color); heart(1); ctx.fill();

    // EKG çizgisi (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-58, 2); ctx.lineTo(-30, 2); ctx.lineTo(-20, -14); ctx.lineTo(-8, 22);
    ctx.lineTo(4, 2); ctx.lineTo(58, 2);
    ctx.stroke();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -34, 22, 14, -0.45, 0, k.TAU); ctx.fill();

    ctx.restore();

    // beat halkası: genişleyen ince halka
    if (g > 0) {
      ctx.strokeStyle = k.rgba(p.color, 0.55 * (1 - g));
      ctx.lineWidth = 7 * (1 - g) + 2;
      ctx.beginPath(); ctx.arc(0, -8, 55 + g * 115, 0, k.TAU); ctx.stroke();
      // uçan mini kalpler
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 0.55;
        const r = 45 + g * 95;
        ctx.save();
        ctx.translate(Math.cos(a) * r, -8 + Math.sin(a) * r);
        ctx.scale(0.16, 0.16); ctx.globalAlpha = 1 - g;
        ctx.fillStyle = k.rgba(p.color); heart(1); ctx.fill();
        ctx.restore();
      }
    }
  },
};
