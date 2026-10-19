// space/space-station — yörünge istasyonu: merkezi modül + iki güneş paneli kanadı +
// anten. LED'ler hash tabanlı yanıp söner; boşta hafif süzülme.
// Vurgu rengi: cyan.
// NOT: canvas y-aşağıdır; (0,0) merkezi modülün merkezidir.
export default {
  name: 'space-station', category: 'space',
  desc: 'Yörünge uzay istasyonu; LED sinyalleri ve güneş panelleriyle',
  tags: ['uzay istasyonu', 'istasyon', 'yörünge', 'space station', 'space', 'uzay', 'güneş paneli', 'iss', 'orbit'],
  box: [-280, -120, 280, 120],
  bleed: 60,
  anchor: 'merkezi modülün merkezi (0,0)',
  points: { node: [0, 0], antenna: [30, -88], panel: [-196, 0] },
  params: {
    color: { type: 'color', default: 'panel2' },
    signal: { type: 'time', default: null, desc: 'anten sinyal gönderme anı: 0.9 sn dalga yayılımı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const hull = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    ctx.save();
    // süzülme: hafif yukarı-aşağı + minik dönme (canlı idle)
    ctx.translate(0, Math.sin(t * 1.8) * 5);
    ctx.rotate(Math.sin(t * 1.1) * 0.015);

    // güneş paneli kanatları (truss kirişi + paneller)
    const wing = (x0, dir) => {
      // kiriş
      ctx.strokeStyle = line; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + 190 * dir, 0); ctx.stroke();
      ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + 190 * dir, 0); ctx.stroke();
      // panel plakaları
      for (let i = 0; i < 3; i++) {
        const px = x0 + (26 + i * 58) * dir;
        blob(Math.min(px, px + 52 * dir), -38, 52, 76, 8, k.rgba('ink'));
        // hücre ızgarası (iç ayrım çizgileri)
        ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(px + 26 * dir, -38); ctx.lineTo(px + 26 * dir, 38); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px + (dir > 0 ? 0 : 52 * dir), 0); ctx.lineTo(px + (dir > 0 ? 52 * dir : 0), 0); ctx.stroke();
        // panel parlaması (sol üst)
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.ellipse(px + 14 * dir, -20, 14, 8, -0.4, 0, k.TAU); ctx.fill();
      }
    };
    wing(52, 1);
    wing(-52, -1);

    // merkezi modül (yatay silindir)
    blob(-52, -34, 104, 68, 22, hull);
    // modül bantları (iç ayrım)
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    for (const bx of [-26, 0, 26]) {
      ctx.beginPath(); ctx.moveTo(bx, -34); ctx.lineTo(bx, 34); ctx.stroke();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, -16, 14, 18, 0.25, 0, k.TAU); ctx.fill();

    // kenetleme modülü (üstte küçük silindir)
    blob(-22, -72, 44, 42, 12, k.rgba('dim'));
    // kubbe penceresi
    ctx.fillStyle = k.rgba('cyan', 0.6);
    ctx.beginPath(); ctx.ellipse(0, -58, 12, 9, 0, 0, k.TAU); ctx.fill();

    // anten direği + çanak
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(30, -72); ctx.lineTo(30, -88); ctx.stroke();
    dot(30, -88, 11, line);
    dot(30, -88, 8.5, k.rgba('panel'));
    dot(30, -88, 4, k.rgba('cyan', 0.9));

    // LED şeridi: hash tabanlı yanıp sönme (her LED farklı faz)
    for (let i = 0; i < 5; i++) {
      const h = k.hash(i * 17 + 2);
      const b = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * (2 + h * 3) + h * k.TAU));
      const col = h > 0.5 ? 'green' : 'yellow';
      dot(-36 + i * 18, 22, 4.5, k.rgba(col, b));
      if (b > 0.75) k.glow(-36 + i * 18, 22, 12, col, 0.3);
    }

    // signal: antenden dalga yayılımı (0.9 sn)
    const d = p.signal == null ? -1 : t - p.signal;
    if (d >= 0 && d < 0.9) {
      for (let i = 0; i < 3; i++) {
        const ph = d * 1.5 - i * 0.2;
        if (ph < 0) continue;
        const r = 16 + ph * 130;
        const a = k.clamp(1 - ph / 0.8, 0, 1) * 0.7;
        ctx.strokeStyle = k.rgba('cyan', a); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(30, -88, r, -Math.PI * 0.75, Math.PI * 0.05); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
