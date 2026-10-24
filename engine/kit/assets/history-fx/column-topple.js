// history-fx/column-topple — antik yivli sütun; at anında kaidesinden sağa devrilir, toz bulutu kalkar.
// NOT: canvas y-aşağıdır; (0,0) = kaide merkezi. Devirme pivotu sağ kaide köşesidir (30,-6).
const LW = 5;
function R(ctx, k, x, y, w, h, r, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
}
export default {
  name: 'column-topple', category: 'history-fx',
  desc: 'Antik yivli sütun; at anında sağa devrilir, tabanda toz bulutu ve moloz bırakır',
  tags: ['sütun', 'antik', 'yıkım', 'tarih', 'yunan', 'roma', 'deprem', 'harabe', 'column', 'ancient', 'ruin', 'topple', 'collapse'],
  box: [-135, -205, 245, 32],
  bleed: 65,
  anchor: 'kaide merkezi (0,0)',
  points: { base: [0, 0], top: [0, -194] },
  params: {
    at: { type: 'time', default: null, desc: 'devrilme anı (0.9 sn hızlanan düşüş + toz bulutu + moloz)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const falling = d >= 0 && d < 0.9;
    const fallen = d >= 0.9;
    // devirme açısı: hızlanan düşüş, 1.5 rad'da durur (karesel: hareket baştan görünür)
    let ang = 0;
    const fp = k.prog(d, 0, 0.9);
    if (falling) ang = 1.5 * fp * fp;
    else if (fallen) ang = 1.5;
    const PX = 30, PY = -6; // pivot: sağ kaide köşesi
    const col = k.rgba(p.color, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(30, 0, 130, 9, 0, 0, k.TAU); ctx.fill();

    // sütun (pivot etrafında döner)
    ctx.save();
    ctx.translate(PX, PY); ctx.rotate(ang); ctx.translate(-PX, -PY);
    R(ctx, k, -36, -30, 72, 24, 6, col);          // kaide
    R(ctx, k, -22, -160, 44, 136, 8, col);        // yivli gövde
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const fx of [-11, 0, 11]) {
      ctx.beginPath(); ctx.moveTo(fx, -152); ctx.lineTo(fx, -34); ctx.stroke();
    }
    R(ctx, k, -34, -184, 68, 26, 6, col);         // başlık
    R(ctx, k, -40, -196, 80, 14, 5, col);         // abaküs
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-11, -110, 9, 52, 0.12, 0, k.TAU); ctx.fill();
    // sağ yüz gölgesi
    ctx.fillStyle = k.rgba('bg', 0.14);
    ctx.beginPath(); k.rrect(0, -160, 22, 136, 8); ctx.fill();
    ctx.restore();

    // devrilme öncesi çatlaklar (at'tan önceki son 0.5 sn)
    if (d < 0 && d > -0.5) {
      const ca = k.clamp((d + 0.5) / 0.5, 0, 1);
      ctx.strokeStyle = k.rgba('ink', 0.65 * ca); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(8, -30); ctx.lineTo(16, -52); ctx.lineTo(10, -72); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-14, -30); ctx.lineTo(-8, -56); ctx.lineTo(-16, -80); ctx.stroke();
    }

    // çarpma tozu (0.8–1.7 sn)
    if (d >= 0.8 && d < 1.7) {
      const g = k.prog(d, 0.8, 1.7);
      for (let i = 0; i < 7; i++) {
        const px = 70 + (k.hash(i * 7 + 31) - 0.5) * (30 + g * 170);
        const py = -8 - g * (14 + k.hash(i * 3 + 32) * 30);
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 7 + g * 13, 0, k.TAU); ctx.fill();
      }
    }
    // moloz (düştükten sonra belirir)
    if (fallen) {
      const g = Math.min(1, (d - 0.9) / 0.3);
      for (const [rx, ry, rr, sd] of [[168, -12, 10, 33], [192, -7, 7, 41], [150, -5, 8, 49]]) {
        ctx.save(); ctx.translate(rx, ry); ctx.rotate(k.hash(sd) * 3); ctx.scale(g, g);
        ctx.fillStyle = k.rgba('bg', 0.55);
        ctx.beginPath();
        ctx.moveTo(-rr - 2, 2); ctx.lineTo(-rr * 0.3, -rr - 2); ctx.lineTo(rr + 2, -rr * 0.4);
        ctx.lineTo(rr * 0.6 + 2, rr * 0.7 + 2); ctx.lineTo(-rr * 0.7 - 2, rr * 0.6 + 2);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(-rr, 0); ctx.lineTo(-rr * 0.3, -rr); ctx.lineTo(rr, -rr * 0.4);
        ctx.lineTo(rr * 0.6, rr * 0.7); ctx.lineTo(-rr * 0.7, rr * 0.6);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }
    // boşta: sürüklenen toz zerrecikleri (çok hafif idle)
    if (d < 0) {
      for (let i = 0; i < 4; i++) {
        const cyc = 5 + i;
        const ph = ((t * 0.5 + i * 1.7) % cyc) / cyc;
        ctx.fillStyle = k.rgba('dim', 0.3 * (1 - ph));
        ctx.beginPath(); ctx.arc(-110 + ph * 200, -40 - i * 30 + k.noise1(t + i * 5) * 8, 2.5, 0, k.TAU); ctx.fill();
      }
    }
  },
};
