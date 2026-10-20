// progress-fx/level-up — seviye atlama: at anında ışık sütunu yükselir, yıldızlar patlar, rozet pop ile belirir.
// Boşta rozet hafifçe nefes alır, yıldız nabız gibi parlar. (0,0) = zeminde sütun tabanı.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır.
export default {
  name: 'level-up', category: 'progress-fx',
  desc: 'Seviye atlama anı: ışık sütunu yükselir, yıldızlar saçılır, seviye rozeti belirir',
  tags: ['seviye', 'level', 'seviye atlama', 'level up', 'başarı', 'achievement', 'başarım', 'ilerleme', 'progress', 'rozet'],
  box: [-150, -200, 150, 40],
  bleed: 90,
  anchor: 'sütun tabanı (zemin), (0,0)',
  points: { badge: [0, -70], top: [0, -185] },
  params: {
    at: { type: 'time', default: null, desc: 'seviye atlama anı: ışık sütunu + yıldız patlaması + rozet pop (1.2 sn)' },
    level: { type: 'number', default: 2, desc: 'rozet üstünde yazan seviye numarası' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const line = k.rgba('bg', 0.55);
    const lvl = Math.max(1, Math.round(p.level ?? 2));

    const star = (cx, cy, r, fill) => {
      ctx.fillStyle = fill; ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };

    const ev = d >= 0 && d <= 1.2;
    const g = ev ? k.prog(d, 0, 1.2) : 1;

    // 1) ışık sütunu: yerden yükselir, genişler, solar
    if (ev) {
      const rise = k.E.outExpo(k.prog(d, 0, 0.6));
      const h = 200 * rise;
      const w = 46 + 40 * g;
      const grad = ctx.createLinearGradient(0, 10, 0, -h);
      grad.addColorStop(0, k.rgba(col, 0.5 * (1 - g * 0.6)));
      grad.addColorStop(1, k.rgba(col, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-w / 2, 10); ctx.lineTo(w / 2, 10);
      ctx.lineTo(w * 0.32, -h); ctx.lineTo(-w * 0.32, -h);
      ctx.closePath(); ctx.fill();
    }

    // 2) yıldız patlaması (6 yıldız, dışa savrulur)
    if (ev) {
      const burst = k.prog(d, 0, 0.9);
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i / 6) * k.TAU + k.hash(i) * 0.5;
        const dist = 45 + (70 + k.hash(i + 20) * 50) * k.E.outExpo(burst);
        const sx = Math.cos(a) * dist, sy = -70 + Math.sin(a) * dist;
        const sr = (13 + k.hash(i + 60) * 7) * (1 - burst * 0.5);
        star(sx, sy, sr, k.rgba(col, (1 - burst * 0.75)));
      }
    }

    // 3) seviye rozeti: idle nefes + at anında pop
    let bs = 1 + 0.03 * Math.sin(t * 2.4);          // idle nefes
    let by = -70;
    if (ev) {
      const pop = Math.min(1, d / 0.28);
      bs *= 1 + 0.55 * Math.sin(Math.PI * pop);
      by -= 14 * Math.sin(Math.PI * pop);           // pop zıplaması
    }
    ctx.translate(0, by); ctx.scale(bs, bs);
    const R = 52;
    // sağ alt gölge (%12)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(6, 7, R, 0, k.TAU); ctx.fill();
    // dış halka + disk
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + 4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(col);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-R * 0.35, -R * 0.42, R * 0.42, R * 0.22, -0.5, 0, k.TAU); ctx.fill();
    // iç yıldız (idle nabız)
    const pulse = 0.9 + 0.1 * Math.sin(t * 3.1);
    star(0, 2, 30 * pulse, k.rgba('bg', 0.9));
    // seviye numarası (yıldızın üstünde, rozet renginde)
    ctx.fillStyle = k.rgba(col, 0.95);
    ctx.font = `700 30px system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(lvl), 0, -1);
    ctx.restore();
  },
};
