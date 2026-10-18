// health/syringe — dikey şırınga (iğne aşağıda); piston, sıvı seviyesi ve ölçü çizgileriyle.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'syringe', category: 'health',
  desc: 'Dikey şırınga; inject anında piston iner, iğne ucunda damla oluşup düşer',
  tags: ['şırınga', 'iğne', 'enjeksiyon', 'aşı', 'syringe', 'needle', 'injection', 'vaccine', 'sağlık'],
  box: [-50, -130, 50, 75],
  bleed: 55,
  anchor: 'gövde merkezi (0,0)',
  points: { tip: [0, 58], top: [0, -122] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'sıvı rengi' },
    level: { type: 'number', default: 0.55, desc: 'sıvı seviyesi 0–1' },
    inject: { type: 'time', default: null, desc: 'enjeksiyon anı: piston iner, damla oluşur ve düşer (1.1 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.inject == null ? -1 : t - p.inject;
    const push = d < 0 ? 0 : k.prog(d, 0, 0.5) * 38;   // pistonun inişi

    ctx.save();
    // idle titreme
    ctx.translate(k.noise1(t * 1.5) * 1.5, k.noise1(t * 1.5 + 9) * 1.2);

    const barrel = () => { ctx.beginPath(); k.rrect(-18, -72, 36, 80, 10); };

    // gölge (sağ alt)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(6, 6); barrel(); ctx.fill(); ctx.restore();
    // cam gövde: dış hat + panel
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-18 - LW / 2, -72 - LW / 2, 36 + LW, 80 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 0.92); barrel(); ctx.fill();

    // sıvı (pistonla birlikte aşağı itilir)
    const lv = k.clamp(p.level, 0, 1);
    const topY = k.lerp(-4, -62, lv) + push * 0.8;
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); k.rrect(-13, topY, 26, Math.max(2, -6 - topY), 7); ctx.fill();
    // sıvı parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath(); k.rrect(-10, topY + 4, 4, Math.max(2, -10 - topY), 2); ctx.fill();

    // ölçü çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const ty of [-52, -34, -16]) {
      ctx.beginPath(); ctx.moveTo(-13, ty); ctx.lineTo(-5, ty); ctx.stroke();
    }

    // cam parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-14, -66, 5, 62, 2.5); ctx.fill();

    // piston kolu + başparmak tablası (inject ile iner)
    ctx.save(); ctx.translate(0, push);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-4 - LW / 2, -110 - LW / 2, 8 + LW, 42 + LW, 6); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(-4, -110, 8, 42, 5); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-22 - LW / 2, -124 - LW / 2, 44 + LW, 15 + LW, 9); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-22, -124, 44, 15, 7); ctx.fill();
    ctx.restore();

    // iğne bağlantısı (hub) + iğne (serbest çizgi: ink rengi)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-8 - LW / 2, 8 - LW / 2, 16 + LW, 16 + LW, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-8, 8, 16, 16, 5); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 24); ctx.lineTo(0, 58); ctx.stroke();

    ctx.restore();

    // damla: 0.5 sn'de oluşur, 1.1 sn'de düşüp solar
    if (d >= 0.5 && d <= 1.1) {
      const dg = k.prog(d, 0.5, 1.1);
      const r = Math.min(dg / 0.4, 1) * 7;
      const dy = dg > 0.4 ? ((dg - 0.4) / 0.6) * 48 : 0;
      ctx.save();
      ctx.globalAlpha = 1 - dg * dg * 0.75;
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(0, 58 + dy, r, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
  },
};
