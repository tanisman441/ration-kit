// weather-alert-fx/storm-cell — şiddetli hava uyarısı: dönen fırtına hücresi radarı
// at anında 0.2 sn şimşek flaşı + 1.2 sn'de yayılan uyarı halkası ve yağmur patlaması.
// NOT: canvas y-aşağıdır; yağmur yukarıdan (−y) aşağıya (+y) yağar.
export default {
  name: 'storm-cell', category: 'weather-alert-fx',
  desc: 'Dönen spiral kollu fırtına hücresi; at anında çakan şimşek ve yayılan kırmızı uyarı halkası',
  tags: ['fırtına', 'şiddetli hava', 'uyarı', 'hücre', 'radar', 'yağmur', 'storm', 'storm cell', 'severe weather', 'warning', 'radar'],
  box: [-150, -150, 150, 150],
  bleed: 30,
  anchor: 'hücre merkezi (0,0)',
  points: { centre: [0, 0], edge: [130, 0], top: [0, -150] },
  params: {
    color: { type: 'color', default: 'dim' },
    alert: { type: 'color', default: 'red' },
    bolt: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'uyarı anı: 0.2 sn flaş + 1.2 sn yayılan halka ve yağmur patlaması' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d < 1.2;
    // flaş: ilk 0.2 sn tam parlak, sonra sön
    const flashA = active ? (d < 0.2 ? 1 : Math.max(0, 1 - (d - 0.2) / 1.0)) : 0;
    const ringR = active ? 30 + (d / 1.2) * 130 : 0;
    const ringA = active ? Math.max(0, 1 - d / 1.2) : 0;

    // idle: hücre yavaşça döner (tam tur ~12 sn)
    const rot = t * 0.52;

    // dış radar halkaları
    ctx.lineWidth = 4;
    for (const r of [145, 110, 75]) {
      ctx.strokeStyle = k.rgba(p.color, 0.35);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
    }

    // spiral kollar: dönen 3 yay
    ctx.save();
    ctx.rotate(rot);
    ctx.lineWidth = 16;
    for (let i = 0; i < 3; i++) {
      const a0 = (i * k.TAU) / 3;
      ctx.strokeStyle = k.rgba(p.color, 0.85);
      ctx.beginPath(); ctx.arc(0, 0, 78, a0, a0 + 1.5); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.alert, 0.55);
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(0, 0, 52, a0 + 0.4, a0 + 1.2); ctx.stroke();
      ctx.lineWidth = 16;
    }
    ctx.restore();

    // merkez çekirdek: gölge (sağ alt) + gövde + sol üst parlama
    const core = (x, y, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };
    core(5, 6, 48, darker(p.color));
    core(0, 0, 48, k.rgba(p.color));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -20, 20, 12, -0.5, 0, k.TAU); ctx.fill();
    // çekirdek gözü
    ctx.fillStyle = k.rgba(p.alert, active ? 0.95 : 0.6);
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, k.TAU); ctx.fill();
    if (active) k.glow(0, 0, 70, p.alert, 0.4 * flashA);

    // yağmur: boşta hafif, uyarıda şiddetli
    const boost = active ? 1 : 0.4;
    ctx.lineWidth = 5;
    for (let i = 0; i < 20; i++) {
      const x0 = -130 + k.hash(i * 3.1 + 5) * 260;
      const speed = 180 + k.hash(i * 7.7 + 5) * 140;
      const yy = -145 + ((t * speed + k.hash(i * 9.3 + 5) * 260) % 260);
      ctx.strokeStyle = k.rgba('cyan', 0.45 * boost);
      ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 - 8, yy + 22); ctx.stroke();
    }

    // uyarı anı: şimşek (ilk 0.2 sn) + yayılan halka
    if (active && d < 0.2) {
      ctx.strokeStyle = k.rgba(p.bolt, 0.95);
      ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(10, -30); ctx.lineTo(-6, 8); ctx.lineTo(8, 10); ctx.lineTo(-12, 52); ctx.stroke();
      k.glow(0, 10, 60, p.bolt, 0.5);
    }
    if (active) {
      ctx.strokeStyle = k.rgba(p.alert, 0.9 * ringA);
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(0, 0, ringR, 0, k.TAU); ctx.stroke();
    }
  },
};
