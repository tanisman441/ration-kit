// home/sofa — önden üçlü kanepe; sit anında minderler çöker, sonra yaylanır
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) kanepenin merkezidir.
export default {
  name: 'sofa', category: 'home',
  desc: 'Önden üçlü kanepe; sit anında minderler çöker ve yaylanarak toparlanır',
  tags: ['kanepe', 'koltuk', 'sofa', 'couch', 'oturma', 'salon', 'mobilya', 'furniture', 'ev', 'home'],
  box: [-145, -85, 145, 95],
  bleed: 30,
  anchor: 'kanepenin merkezi (0,0); zemin y=88',
  points: { seat: [0, 18], back: [0, -52], arm: [118, 6] },
  params: {
    sit: { type: 'time', default: null, desc: 'oturma anı (minder çökmesi + yaylanma, 0.8 sn)' },
    color: { type: 'color', default: 'dim', desc: 'döşeme rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), shadow = 'rgba(0,0,0,0.12)', gloss = 'rgba(255,255,255,0.10)';
    const d = p.sit == null ? -1 : t - p.sit;
    // sit olayı: 0→0.18 sn hızlı çökme, 0.18→0.8 sn yaylanarak toparlanma
    let press = 0;
    if (d >= 0 && d < 0.8) {
      if (d < 0.18) press = 14 * k.E.outCubic(d / 0.18);
      else press = 14 * (1 - k.E.outBack((d - 0.18) / 0.62)); // hafif overshoot ile toparlanır
    }
    // idle: döşeme çok hafif nefes alır
    const breathe = Math.sin(t * 1.5) * 1.2;

    ctx.save();

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-138, 82); ctx.lineTo(138, 82); ctx.stroke();

    // ayaklar
    for (const lx of [-118, 118]) {
      ctx.fillStyle = k.rgba('ink');
      k.rrect(lx - 8, 66, 16, 18, 6); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = LW;
      k.rrect(lx - 8, 66, 16, 18, 6); ctx.stroke();
    }

    // kolçaklar
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.translate(sx * 112, 0);
      ctx.fillStyle = shadow; k.rrect(sx < 0 ? -28 : -2, -34, 30, 104, 14); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      k.rrect(sx < 0 ? -34 : -2, -40, 32, 104, 14); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = LW;
      k.rrect(sx < 0 ? -34 : -2, -40, 32, 104, 14); ctx.stroke();
      // kolçak parlama (sol üstteki kolçakta)
      if (sx < 0) {
        ctx.fillStyle = gloss;
        ctx.beginPath(); ctx.ellipse(-28, -28, 6, 12, -0.2, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    }

    // sırtlık (arka)
    ctx.fillStyle = shadow; k.rrect(-84, -72, 180, 60, 18); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-90, -78, 180, 60, 18); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-90, -78, 180, 60, 18); ctx.stroke();
    // sırtlık parlama (sol üst)
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(-76, -64, 8, 12, -0.2, 0, k.TAU); ctx.fill();
    // sırt yastık ayrım çizgileri (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const lx of [-30, 30]) {
      ctx.beginPath(); ctx.moveTo(lx, -72); ctx.lineTo(lx, -24); ctx.stroke();
    }

    // gövde (oturma altı)
    ctx.fillStyle = shadow; k.rrect(-84, 24, 180, 44, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-90, 18, 180, 44, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-90, 18, 180, 44, 14); ctx.stroke();

    // minderler (3 adet; sit'te çöker + yaylanır)
    for (let i = -1; i <= 1; i++) {
      const cx = i * 60, dy = press + breathe * (1 + i * 0.1);
      ctx.save(); ctx.translate(cx, dy);
      ctx.fillStyle = shadow; k.rrect(-30, -22, 64, 40, 14); ctx.fill();
      ctx.fillStyle = k.rgba('accent', 0.55);
      k.rrect(-34, -28, 64, 40, 14); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = LW;
      k.rrect(-34, -28, 64, 40, 14); ctx.stroke();
      ctx.fillStyle = gloss;
      ctx.beginPath(); ctx.ellipse(-26, -20, 6, 8, -0.2, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // sit anında hareket çizgileri (kısa, yukarı doğru)
    if (d >= 0 && d < 0.45) {
      ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - d / 0.45)); ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const mx = [-60, 0, 60][i] + (k.hash(i * 7 + 2) - 0.5) * 20;
        const my = -44 - d * 60;
        ctx.beginPath(); ctx.moveTo(mx, my + 14); ctx.lineTo(mx, my); ctx.stroke();
      }
    }

    ctx.restore();
  },
};
