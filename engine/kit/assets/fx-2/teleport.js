// fx-2/teleport — ışınlanma: at anında dikey ışık sütunu + yükselen parçacıklar + zemin halkası; sonra sönümlenme.
// Öncesinde (idle) hafif önsezi: sütun silueti ve tabanda toplanan parıltılar.
// NOT: canvas y-aşağıdır; (0,0) ışınlanmanın gerçekleştiği taban noktası.
export default {
  name: 'teleport', category: 'fx-2',
  desc: 'Işınlanma: at anında dikey ışık sütunu, yükselen parçacıklar ve genişleyen zemin halkası',
  tags: ['ışınlanma', 'teleport', 'ışın', 'teleportation', 'beam', 'ışık sütunu', 'yok olma', 'belirme', 'warp'],
  box: [-110, -175, 110, 25],
  bleed: 45,
  anchor: 'taban (0,0) — ışınlanmanın gerçekleştiği zemin noktası',
  points: { top: [0, -168], base: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'ışın enerjisinin rengi' },
    at: { type: 'time', default: null, desc: 'ışınlanma anı (sütun + parçacıklar + halka)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // ---- olay: 0 → 0.75 sn arası parlak sütun, sonra fade ----
    if (d >= 0 && d < 0.75) {
      const g = k.prog(d, 0, 0.75);
      const al = 1 - g;
      const w = 48 * (1 - g * 0.45);

      // dış parlama
      k.glow(0, -80, 95, p.color, 0.5 * al);

      // ana sütun (hafif konik elips)
      ctx.fillStyle = k.rgba(p.color, 0.55 * al);
      ctx.beginPath(); ctx.ellipse(0, -78, w, 84, 0, 0, k.TAU); ctx.fill();

      // beyaz çekirdek
      ctx.fillStyle = 'rgba(255,255,255,' + (0.55 * al).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(0, -78, w * 0.42, 79, 0, 0, k.TAU); ctx.fill();

      // kaybolan siluet (tabanda sönümlenen gölge)
      if (d < 0.4) {
        const sg = 1 - d / 0.4;
        ctx.fillStyle = k.rgba('dim', 0.65 * sg);
        ctx.beginPath(); ctx.ellipse(0, -42, 15 * (1 + d * 1.5), 44, 0, 0, k.TAU); ctx.fill();
      }

      // yükselen parçacıklar
      for (let i = 0; i < 26; i++) {
        const h1 = k.hash(i * 7 + 11), h2 = k.hash(i * 13 + 37), h3 = k.hash(i * 29 + 71);
        const py = -(14 + h1 * 120) - d * 300 * (0.6 + h2 * 0.8);
        if (py > 12 || py < -192) continue;
        const px = (h1 - 0.5) * 96 + k.noise1(i * 3.1 + d * 7) * 11;
        const pr = 2.5 + h2 * 5.5;
        const pa = 0.9 * al * (1 - k.prog(-py, 130, 190));
        ctx.fillStyle = h3 > 0.6
          ? 'rgba(255,255,255,' + (0.85 * al).toFixed(3) + ')'
          : k.rgba(p.color, Math.max(pa, 0));
        ctx.beginPath(); ctx.arc(px, py, pr, 0, k.TAU); ctx.fill();
      }

      // zemin halkası
      if (d < 0.5) {
        const gg = d / 0.5;
        const rx = 42 + 92 * gg;
        ctx.strokeStyle = k.rgba(p.color, 0.75 * (1 - gg));
        ctx.lineWidth = 6 * (1 - gg) + 2;
        ctx.beginPath(); ctx.ellipse(0, 0, rx, rx * 0.32, 0, 0, k.TAU); ctx.stroke();
      }
    }

    // ---- idle / önsezi: tabanda toplanan parıltılar + silik sütun ----
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
      // silik sütun silueti
      ctx.fillStyle = k.rgba(p.color, 0.10 + 0.08 * pulse);
      ctx.beginPath(); ctx.ellipse(0, -78, 40, 80, 0, 0, k.TAU); ctx.fill();
      // tabanda dönen parıltılar
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 5 + 3), h2 = k.hash(i * 11 + 53);
        const a = t * (0.6 + h2 * 0.5) + h1 * k.TAU;
        const rr = 18 + ((h1 * 26 + t * 12) % 26);
        const px = Math.cos(a) * rr;
        const py = -6 - h2 * 30 + Math.sin(a * 2) * 6;
        ctx.fillStyle = k.rgba(p.color, 0.35 + 0.3 * pulse * h2);
        ctx.beginPath(); ctx.arc(px, py, 2 + h2 * 3, 0, k.TAU); ctx.fill();
      }
      // taban parlaması
      k.glow(0, -4, 44, p.color, 0.22 + 0.12 * pulse);
    }
    ctx.restore();
  },
};
