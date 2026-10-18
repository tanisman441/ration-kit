// nature/star — parlayan yıldız; twinkle anında parıltı patlaması, normalde titrer/yanıp söner.
export default {
  name: 'star',
  category: 'nature',
  desc: 'Parlayan beş köşeli yıldız; twinkle anında parıltı patlaması olur, normalde titreyerek yanıp söner',
  tags: ['yıldız', 'parıltı', 'gece', 'gökyüzü', 'ışıltı', 'star', 'twinkle', 'night', 'sky', 'sparkle', 'shining'],
  box: [-90, -90, 90, 90],
  bleed: 60,
  anchor: 'yıldız merkezi (0,0)',
  points: { tip: [0, -62] },
  params: {
    color: { type: 'color', default: 'yellow' },
    twinkle: { type: 'time', default: null, desc: 'parıltı patlaması anı (~0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineJoin = 'round';

    // twinkle olayı: 0.8 sn'lik parıltı patlaması
    const d = p.twinkle == null ? -1 : t - p.twinkle;
    const tenv = d < 0 || d > 0.8 ? 0 : Math.sin(k.clamp(d / 0.8, 0, 1) * Math.PI);

    // idle: titreme (ölçek nabzı + hafif dönme)
    const tw = Math.sin(t * 3.1) * 0.5 + 0.5;
    const scale = 1 + 0.045 * Math.sin(t * 3.1) + 0.02 * k.noise1(t * 5) + tenv * 0.3;
    const rot = Math.sin(t * 0.7) * 0.05;

    const R = 62, r = 26;
    const starPath = s => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? R * s : r * s;
        const a = -Math.PI / 2 + (i / 10) * k.TAU;
        const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    };

    // hale (olayda güçlü, normalde hafif nabız)
    k.glow(0, 0, R * scale + 26 + tenv * 50, p.color, Math.min(0.5, 0.12 + 0.08 * tw + tenv * 0.4));

    ctx.save();
    ctx.rotate(rot);

    // sağ alt gölge
    ctx.save(); ctx.translate(5, 6); ctx.fillStyle = darker(p.color); starPath(scale); ctx.fill(); ctx.restore();
    // dış hat: dolgudan sonra stroke
    ctx.fillStyle = k.rgba(p.color); starPath(scale); ctx.fill();
    ctx.lineWidth = LW; ctx.strokeStyle = line; starPath(scale); ctx.stroke();

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-R * 0.3 * scale, -R * 0.42 * scale, R * 0.22 * scale, R * 0.13 * scale, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();

    // idle ışıltılar: iki küçük artı parıltı, hash konumunda yanıp söner
    for (let i = 0; i < 2; i++) {
      const sx = (k.hash(i * 7.3 + 1) - 0.5) * 150;
      const sy = (k.hash(i * 3.9 + 5) - 0.5) * 150;
      const sa = Math.max(0, Math.sin(t * 2.2 + i * 2.4)) ** 2 * 0.55 + tenv * 0.4;
      if (sa < 0.03) continue;
      const L = 10 + tenv * 22;
      ctx.strokeStyle = k.rgba(p.color, sa);
      ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx - L, sy); ctx.lineTo(sx + L, sy);
      ctx.moveTo(sx, sy - L); ctx.lineTo(sx, sy + L);
      ctx.stroke();
    }

    // twinkle anında çekirdek flaşı
    if (tenv > 0.02) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath(); ctx.arc(0, 0, 14 * tenv, 0, k.TAU); ctx.fill();
    }
  },
};
