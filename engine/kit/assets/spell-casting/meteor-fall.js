// spell-casting/meteor-fall — düşen meteor: kayalık çekirdek + yukarı sağa
// uzanan alev kuyruğu + kıvılcımlar. Idle: alevler dalgalanır, çekirdek hafif
// titrer. `at` anında: 0.15 sn beyaz flaş + çekirdek geri tepme (0.25 sn) +
// 0.8 sn büyüyen duman bulutu ve şok dalgası.
// NOT: canvas y-aşağıdır; (0,0) meteor çekirdeğidir, düşüş yönü sol-şağıdır
// (kuyruk sağ-üste uzanır).
export default {
  name: 'meteor-fall', category: 'spell-casting',
  desc: 'Düşen meteor; at anında çarpma flaşı + duman bulutu + şok dalgası, idle\'da alev kuyruğu dalgalanır',
  tags: ['meteor', 'göktaşı', 'düşme', 'çarpma', 'ateş', 'uzay', 'meteor', 'fall', 'impact', 'comet'],
  box: [-160, -160, 160, 160],
  bleed: 70,
  anchor: 'meteor çekirdeği (0,0); düşüş yönü sol-şağa',
  points: { head: [0, 0], impact: [-60, 80], tail: [120, -110] },
  params: {
    at: { type: 'time', default: null, desc: 'çarpma anı (flaş 0.15 sn + duman 0.8 sn + şok dalgası)' },
    color: { type: 'color', default: 'red', desc: 'alev rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const hit = d >= 0 && d < 0.15;
    const boost = hit ? 1 - d / 0.15 : 0;
    const dust = d >= 0 && d < 0.8;
    const recoil = d >= 0 && d < 0.25 ? (1 - d / 0.25) * 18 : 0; // düşüş yönüne (sol-şağa) tepme
    const ox = -recoil * 0.7, oy = recoil * 0.7;

    // Kuyruk yönü: sağ-üst (düşüş yönünün tersi)
    const tx = 0.72, ty = -0.69;                              // normalize sağ-üst

    // Dış hale
    k.glow(ox, oy, 110, acc, 0.3 + boost * 0.35);
    if (hit) k.glow(ox, oy, 170, 'yellow', 0.6 * boost);

    // Alev kuyruğu: sağ-üste 8 dil, noise ile dalgalanır
    for (let i = 0; i < 8; i++) {
      const frac = i / 7;
      const len = frac * 165;
      const wob = k.noise1(i * 41.3 + t * 8) * 18 * (0.3 + frac);
      const px = ox + tx * len - ty * wob * 0.5;
      const py = oy + ty * len + tx * wob * 0.5;
      const w = (1 - frac) * 24 + 4;
      ctx.fillStyle = i % 2 ? k.rgba('yellow', 0.8 - frac * 0.5) : k.rgba(acc, 0.75 - frac * 0.45);
      ctx.beginPath(); ctx.ellipse(px, py, w, w * 0.5, Math.atan2(ty, tx), 0, k.TAU); ctx.fill();
    }

    // Sürüklenen kıvılcımlar (idle): kuyruk boyu akar
    for (let i = 0; i < 7; i++) {
      const cyc = ((t * 0.6 + k.hash(i * 29.1)) % 1);
      const len = cyc * 150;
      const wob = k.noise1(i * 13.7 + t * 7) * 14;
      const px = ox + tx * len - ty * wob * 0.5;
      const py = oy + ty * len + tx * wob * 0.5;
      ctx.fillStyle = k.rgba('yellow', (1 - cyc) * 0.8);
      ctx.beginPath(); ctx.arc(px, py, 4 * (1 - cyc) + 1, 0, k.TAU); ctx.fill();
    }

    // Gölge: sağ alta %12 koyultma (çekirdek formu)
    const R = 30 + k.noise1(t * 6) * 1.5;                     // hafif titreme
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(ox + 6, oy + 6, R, R * 0.92, 0.4, 0, k.TAU); ctx.fill();

    // Kayalık çekirdek: koyu gövde + krater detayları
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); ctx.ellipse(ox, oy, R, R * 0.92, 0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    // kraterler (ink iç çizgi, alfa 0.35)
    for (let i = 0; i < 4; i++) {
      const a = k.hash(i * 61.7) * k.TAU;
      const cx = ox + Math.cos(a) * R * 0.45, cy = oy + Math.sin(a) * R * 0.4;
      ctx.fillStyle = k.rgba('ink', 0.28);
      ctx.beginPath(); ctx.arc(cx, cy, 5 + k.hash(i * 17.3) * 4, 0, k.TAU); ctx.fill();
    }
    // yanan ön yüz: düşüş yönünde (sol-şak) ateş kaplaması
    ctx.fillStyle = k.rgba(acc, 0.85);
    ctx.beginPath(); ctx.ellipse(ox - R * 0.42, oy + R * 0.32, R * 0.55, R * 0.5, 0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.ellipse(ox - R * 0.5, oy + R * 0.38, R * 0.3, R * 0.26, 0.4, 0, k.TAU); ctx.fill();
    if (hit) { // çarpma flaşı: beyaz çekirdek
      ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * boost).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(ox, oy, R * (1.1 + boost * 0.5), 0, k.TAU); ctx.fill();
    }
    // Premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(ox + R * 0.28, oy - R * 0.42, R * 0.36, R * 0.2, 0.4, 0, k.TAU); ctx.fill();

    // Çarpma dumanı: 5 dim duman topu, 0.8 sn'de büyüyüp söner (düşüş yönünde)
    if (dust) {
      const pr = d / 0.8;
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 83.1 + 2);
        const ang = 2.2 + (h - 0.5) * 1.4;                    // sol-şak koni
        const dist = pr * (30 + h * 80);
        const sx = ox + Math.cos(ang) * dist, sy = oy + Math.sin(ang) * dist;
        const sr = 12 + pr * (18 + h * 22);
        ctx.fillStyle = k.rgba('dim', (1 - pr) * 0.75);
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, k.TAU); ctx.fill();
      }
      // şok dalgası
      const wr = 20 + (1 - Math.pow(1 - pr, 3)) * 130;
      ctx.strokeStyle = k.rgba(acc, (1 - pr) * 0.7); ctx.lineWidth = 5 * (1 - pr) + 2;
      ctx.beginPath(); ctx.ellipse(ox, oy, wr, wr * 0.75, 0.4, 0, k.TAU); ctx.stroke();
      k.glow(ox, oy, 60 + pr * 90, acc, (1 - pr) * 0.4);
    }

    ctx.restore();
  },
};
