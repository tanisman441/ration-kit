// tech/satellite — yörüngedeki uydu: gövde + iki güneş paneli kanadı + çanak anten.
// active anında çanaktan sinyal dalgaları yayılır. Hafif süzülme animasyonu.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'satellite', category: 'tech',
  desc: 'Yörüngedeki uydu; active anında çanak antenden sinyal dalgaları yayılır',
  tags: ['uydu', 'satellite', 'uzay', 'sinyal', 'yörünge', 'space', 'signal', 'orbit', 'anten'],
  box: [-190, -110, 190, 110],
  bleed: 95,
  anchor: 'gövde merkezi (0,0)',
  points: { dish: [55, -88], body: [0, 0] },
  params: {
    color: { type: 'color', default: 'panel2' },
    active: { type: 'time', default: null, desc: 'sinyal gönderme anı: 0.9 sn dalga yayılımı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    // süzülme: hafif yukarı-aşağı + minik salınım
    ctx.translate(0, Math.sin(t * 2.1) * 4);
    ctx.rotate(Math.sin(t * 1.3) * 0.02);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    // güneş paneli kanatları (gövdeye bağlı)
    const wing = (x, dir) => {
      blob(x, -32, 120 * dir, 64, 8, k.rgba('ink'));
      // panel ızgarası
      ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3;
      for (let i = 1; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(x + i * 24 * dir, -32); ctx.lineTo(x + i * 24 * dir, 32); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(x + 8 * dir, 0); ctx.lineTo(x + 112 * dir, 0); ctx.stroke();
      // panel parlaması (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.ellipse(x + 30 * dir, -18, 22, 8, -0.4, 0, k.TAU); ctx.fill();
    };
    // bağlantı kolları
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-52, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(52, 0); ctx.stroke();
    wing(-172, 1);
    wing(52, 1);

    // gövde
    blob(-30, -52, 60, 104, 10, body);
    // gövde bandı (iç ayrım)
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-30, -14); ctx.lineTo(30, -14); ctx.stroke();
    // premium parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -36, 10, 16, 0.2, 0, k.TAU); ctx.fill();

    // ikaz lambası (yavaş yanıp söner)
    const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.4));
    dot(0, 36, 5, k.rgba('red', blink));
    if (blink > 0.7) k.glow(0, 36, 16, 'red', 0.3);

    // çanak anten kolu + çanak
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(14, -52); ctx.lineTo(40, -78); ctx.stroke();
    dot(55, -88, 20, line);
    dot(55, -88, 17, k.rgba('panel'));
    dot(55, -88, 7, k.rgba('cyan', 0.9));
    k.glow(55, -88, 26, 'cyan', 0.2);

    // active: çanaktan yayılan sinyal dalgaları (0.9 sn)
    const d = p.active == null ? -1 : t - p.active;
    if (d >= 0 && d < 0.9) {
      for (let i = 0; i < 3; i++) {
        const ph = d * 1.4 - i * 0.18;
        if (ph < 0) continue;
        const r = 24 + ph * 130;
        const a = k.clamp(1 - ph / 0.75, 0, 1) * 0.7;
        ctx.strokeStyle = k.rgba('cyan', a); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(55, -88, r, -Math.PI * 0.75, Math.PI * 0.05); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
