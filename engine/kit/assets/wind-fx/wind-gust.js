// wind-fx/wind-gust — şiddetli rüzgar esintisi: sürekli akan eğri çizgiler + gust anında hızlanan akış ve savrulan zerreler.
// NOT: canvas y-aşağıdır; rüzgar soldan sağa eser; (0,0) akış merkezidir.
export default {
  name: 'wind-gust', category: 'wind-fx',
  desc: 'Şiddetli rüzgar esintisi: akan eğri çizgiler, gust anında kalınlaşan ana bant ve savrulan toz zerreleri',
  tags: ['rüzgar', 'esinti', 'fırtına', 'hava akımı', 'wind', 'gust', 'breeze', 'storm', 'airflow', 'swoosh'],
  box: [-170, -95, 170, 95],
  bleed: 30,
  anchor: 'rüzgar akış merkezi (0,0)',
  points: { tail: [-160, 0], head: [160, 0] },
  params: {
    gust: { type: 'time', default: null, desc: 'şiddetli esinti anı (1.0 sn: çizgiler hızlanır, bant kalınlaşır, zerreler savrulur)' },
    color: { type: 'color', default: 'cyan' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.gust == null ? -1 : t - p.gust;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();
    ctx.lineCap = 'round';

    // --- gust zarfı (0.15 sn atak, 0.85 sn sönüm) ---
    let env = 0;
    if (d >= 0) env = Math.min(k.prog(d, 0, 0.15), 1 - k.prog(d, 0.15, 1.0));

    const wave = (x, i) => 9 * S * Math.sin(x * 0.035 + t * (2.5 + 5 * env) + i * 1.7);

    // --- arka plandaki 3 ince rüzgar çizgisi (sürekli akar) ---
    for (let i = 0; i < 3; i++) {
      const y0 = (-52 + i * 52) * S;
      // akış hissi faz kaymasıyla verilir (x ötelenmez → box dışına taşmaz)
      const ph = t * (2.2 + 4.5 * env) + i * 1.7;
      ctx.strokeStyle = k.rgba(p.color, 0.38 + 0.3 * env);
      ctx.lineWidth = (3.5 + 2.5 * env) * S;
      ctx.beginPath();
      for (let x = -170 * S; x <= 170 * S; x += 12) {
        const y = y0 + 9 * S * Math.sin(x * 0.035 + ph);
        if (x <= -170 * S + 12) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // --- ana esinti bandı (kalın, kıvrımlı) ---
    const bandW = (10 + 26 * env) * S;
    ctx.strokeStyle = k.rgba(p.color, 0.30 + 0.45 * env);
    ctx.lineWidth = bandW;
    ctx.beginPath();
    for (let x = -160 * S; x <= 160 * S; x += 10) {
      const y = -8 * S * Math.sin(x * 0.02 + t * (3 + 6 * env)) + wave(x, 4) * 0.8;
      if (x <= -160 * S + 10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // --- savrulan zerreler (sürekli sürüklenir, gust'ta hızlanır) ---
    for (let i = 0; i < 14; i++) {
      const h = k.hash(i * 17 + 3);
      const yy = (k.hash(i * 31 + 7) - 0.5) * 160 * S;
      const xx = -170 * S + ((t * (70 + 160 * env) * S + h * 340 * S) % (340 * S));
      const wob = 12 * S * Math.sin(t * 4 + i * 2.1);
      const a = 0.25 + 0.55 * env + 0.2 * k.noise1(t * 3 + i);
      ctx.fillStyle = k.rgba(p.color, k.clamp(a, 0, 0.9));
      ctx.beginPath(); ctx.arc(xx, yy + wob, (2.2 + 2.6 * h) * S, 0, k.TAU); ctx.fill();
    }

    // --- gust anında hız çizgisi patlaması (0.5 sn) ---
    if (d >= 0 && d < 0.5) {
      const gp = k.prog(d, 0, 0.5);
      ctx.save();
      ctx.beginPath(); ctx.rect(-170 * S - 30, -95 * S - 30, 400 * S, 250 * S); ctx.clip();
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 43 + 9);
        const yy = (h - 0.5) * 130 * S;
        const x0 = -160 * S + gp * 340 * S * (0.7 + 0.6 * h);
        ctx.strokeStyle = k.rgba(p.color, 0.75 * (1 - gp));
        ctx.lineWidth = 3 * S;
        ctx.beginPath();
        ctx.moveTo(x0 - 60 * S * (1 - gp), yy);
        ctx.lineTo(x0, yy + 6 * S * Math.sin(t * 9 + i));
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  },
};
