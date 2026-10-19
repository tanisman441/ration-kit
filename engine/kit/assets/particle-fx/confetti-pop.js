// particle-fx/confetti-pop — konfeti patlaması: at anında merkezden fışkıran renkli
// dikdörtgen + daire parçalar; takla atarak süzülür, sonra sönümlenir.
// NOT: canvas y-aşağıdır; (0,0) patlamanın merkezi.
export default {
  name: 'confetti-pop', category: 'particle-fx',
  desc: 'Konfeti patlaması: at anında merkezden fışkıran, takla atan renkli parçalar',
  tags: ['konfeti', 'patlama', 'kutlama', 'parti', 'parça', 'confetti', 'pop', 'celebration', 'party', 'explosion'],
  box: [-130, -130, 130, 130],
  bleed: 70,
  anchor: 'merkez (0,0) — patlamanın gerçekleştiği nokta',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'ana vurgu rengi (diğer parçalar tema renklerinden)' },
    at: { type: 'time', default: null, desc: 'patlama anı' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 1.6) return;
    const cols = [p.color, 'red', 'cyan', 'yellow', 'green', 'purple'];
    const al = 1 - k.prog(d, 0.9, 1.6);
    ctx.save();
    ctx.lineCap = 'round';

    // başlangıç flaşı (ilk 0.12 sn)
    if (d < 0.12) {
      const f = 1 - d / 0.12;
      k.glow(0, 0, 80 * f, p.color, 0.5 * f);
    }

    // parçalar: merkezden fışkırır, yavaşlayıp süzülür, takla atar
    for (let i = 0; i < 40; i++) {
      const h1 = k.hash(i * 3 + 301), h2 = k.hash(i * 5 + 307), h3 = k.hash(i * 7 + 313);
      const dd = Math.max(d - h3 * 0.12, 0);                    // kademeli fırlama
      const ang = h1 * k.TAU;
      const e = 1 - Math.pow(1 - Math.min(dd * 1.9, 1), 2.5);  // hızlı çıkış, yumuşak durma
      const dist = (30 + h2 * 130) * e;
      const x = Math.cos(ang) * dist + k.noise1(i * 2.3 + d * 3.2) * 12;
      const y = Math.sin(ang) * dist + 60 * dd * dd * h2;      // hafifçe aşağı sarkma
      if (x < -190 || x > 190 || y < -190 || y > 190) continue;
      const col = cols[i % cols.length];
      const spin = dd * (4 + h2 * 6) + h1 * k.TAU;
      const isDisc = h3 > 0.62;
      const sq = 0.35 + 0.65 * Math.abs(Math.cos(spin));       // takla: daralıp açılır

      ctx.fillStyle = k.rgba(col, al * (0.75 + h2 * 0.25));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang + spin * 0.35);
      if (isDisc) {
        ctx.beginPath(); ctx.arc(0, 0, 4 + h2 * 4, 0, k.TAU); ctx.fill();
      } else {
        const w = (7 + h2 * 8) * sq;
        // premium parlama: sol üstte küçük beyaz vurgu
        ctx.fillRect(-w / 2, -4.5, w, 9);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.28 * al).toFixed(3) + ')';
        ctx.fillRect(-w / 2, -4.5, w, 2.6);
      }
      ctx.restore();
    }
    ctx.restore();
  },
};
