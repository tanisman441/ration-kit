// fail-fx/crash-shatter — kırılan cam/ekran: at anında darbe noktasından çatlaklar yayılır,
// parçalar uçar; çatlaklar kalır. Çatlak çizgileri ink rengi incedir (havada serbest çizgi).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'crash-shatter',
  category: 'fail-fx',
  desc: 'Darbe noktasından yayılan çatlaklı kırık cam ekran',
  tags: ['kırık', 'çatlak', 'cam', 'ekran', 'kırılma', 'başarısız', 'crash', 'shatter', 'glass', 'crack', 'broken', 'fail'],
  box: [-110, -95, 110, 95],
  bleed: 40,
  anchor: 'ekran merkezi (darbe noktası biraz üstte)',
  points: { impact: [0, -8], center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'kırılma anı: 0.3-0.7 sn çatlak yayılması + parça uçuşması' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const broken = d >= 0;
    const line = k.rgba('bg', 0.55);

    // --- ekran gövdesi (çatlamadan önce sağlam görünür) ---
    const W = 190, H = 140, R = 18;
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-W / 2 + 6, -H / 2 + 6, W, H, R); ctx.fill();
    // gövde
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    // iç yüzey
    ctx.fillStyle = k.rgba('dim', 0.35);
    ctx.beginPath(); k.rrect(-W / 2 + 10, -H / 2 + 10, W - 20, H - 20, R - 6); ctx.fill();
    // dış hat
    ctx.lineWidth = 5;
    ctx.strokeStyle = line;
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.stroke();
    // sol üst parlama (premium, alfa 0.11)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(-W / 2 + 52, -H / 2 + 22, 58, 18, -0.35, 0, k.TAU);
    ctx.fill();
    // kırılmadan önce: ekran parlaklığında hafif dalgalanma (idle)
    if (!broken) {
      ctx.fillStyle = `rgba(255,255,255,${0.03 + 0.02 * Math.sin(t * 2.1)})`;
      ctx.beginPath(); k.rrect(-W / 2 + 10, -H / 2 + 10, W - 20, H - 20, R - 6); ctx.fill();
    }

    const ix = 0, iy = -8; // darbe noktası

    if (broken) {
      // --- çatlaklar: 8 ışın, kademeli başlangıç, 0.25 sn'de tam uzar ---
      ctx.strokeStyle = k.rgba('ink', 0.85);
      ctx.lineCap = 'round';
      for (let i = 0; i < 8; i++) {
        const start = k.hash(100 + i) * 0.22;                 // 0-0.22 sn kademeli
        const reach = k.E.outCubic(k.prog(d, start, start + 0.25));
        if (reach <= 0) continue;
        const len = 62 + k.hash(200 + i) * 52;
        let px = ix, py = iy;
        let ang = (i / 8) * k.TAU + (k.hash(300 + i) - 0.5) * 0.6;
        ctx.lineWidth = i % 3 === 0 ? 5 : 3.5;
        ctx.beginPath(); ctx.moveTo(px, py);
        for (let s = 0; s < 3; s++) {
          ang += (k.hash(400 + i * 3 + s) - 0.5) * 0.9;       // kırıklı yön
          const seg = (len / 3) * k.clamp(reach * 3 - s, 0, 1);
          const nx = px + Math.cos(ang) * seg, ny = py + Math.sin(ang) * seg;
          ctx.lineTo(nx, ny);
          px = nx; py = ny;
          if (seg <= 0) break;
        }
        ctx.stroke();
      }

      // --- parça uçuşması: 0.15-0.7 sn, dışarı savrulup söner ---
      if (d < 0.75) {
        for (let i = 0; i < 6; i++) {
          const ang = k.hash(500 + i) * k.TAU;
          const dist = k.E.outCubic(k.prog(d, 0.12, 0.7)) * (46 + k.hash(510 + i) * 42);
          const alpha = 1 - k.prog(d, 0.4, 0.7);
          const sx = ix + Math.cos(ang) * dist, sy = iy + Math.sin(ang) * dist;
          const sz = 7 + k.hash(520 + i) * 7;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(k.hash(530 + i) * k.TAU + d * 9);
          ctx.fillStyle = k.rgba(p.color, 0.85 * alpha);
          ctx.strokeStyle = k.rgba('bg', 0.55 * alpha);
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -sz); ctx.lineTo(sz, sz * 0.8); ctx.lineTo(-sz, sz * 0.8);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        // darbe flaşı
        const fl = 1 - k.prog(d, 0, 0.25);
        if (fl > 0) k.glow(ix, iy, 46, p.color, 0.5 * fl);
      }
    }

    // darbe noktası işareti (kırık değilse bile ipucu)
    if (!broken) {
      ctx.strokeStyle = k.rgba('ink', 0.5);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ix, iy, 9, 0, k.TAU); ctx.stroke();
    }
  },
};
