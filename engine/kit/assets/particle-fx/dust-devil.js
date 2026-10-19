// particle-fx/dust-devil — küçük dönen toz girdabı: tabanda dar, üstte genişleyen
// koni; dönen yay halkaları + yukarı spiral çizen toz zerreleri (döngülü idle).
// NOT: canvas y-aşağıdır; (0,0) girdabın taban noktası, yukarı = negatif y.
export default {
  name: 'dust-devil', category: 'particle-fx',
  desc: 'Dönen toz girdabı: dönen yay halkaları ve yukarı spiral çizen toz zerreleri',
  tags: ['toz', 'girdap', 'kasırga', 'fırtına', 'dönme', 'spiral', 'dust', 'vortex', 'tornado', 'devil', 'swirl'],
  box: [-95, -185, 95, 25],
  bleed: 45,
  anchor: 'taban (0,0) — girdabın temas ettiği zemin noktası',
  points: { base: [0, 0], top: [0, -180] },
  params: {
    intensity: { type: 'number', default: 0.8, min: 0.3, max: 1, desc: 'girdap şiddeti (dönüş hızı + toz yoğunluğu)' },
    color: { type: 'color', default: 'dim', desc: 'toz rengi' },
  },
  draw(ctx, t, p, k) {
    const spin = t * 5.2 * p.intensity; // taban dönüş hızı (rad/sn)
    ctx.save();
    ctx.lineCap = 'round';

    // 1) dönen yay halkaları: üstte geniş, altta dar; üst yavaş döner
    const levels = 6;
    for (let j = 0; j < levels; j++) {
      const fj = j / (levels - 1);
      const y = -14 - fj * 148;
      const rx = 20 + fj * 62;
      const ry = rx * 0.30;
      const rot = spin * (1 - fj * 0.55) + fj * 1.8; // yukarı doğru yavaşlayan dönüş
      const al = (0.42 - fj * 0.18) * p.intensity;
      // halkayı 2 hareketli yay parçası olarak çiz — dönüş hissi verir
      for (let s = 0; s < 2; s++) {
        const a0 = rot + s * Math.PI;
        const len = Math.PI * (0.55 + fj * 0.3);
        ctx.strokeStyle = k.rgba(p.color, Math.max(al, 0.05));
        ctx.lineWidth = 7 - fj * 3.5;
        ctx.beginPath();
        ctx.ellipse(0, y, rx, ry, 0, a0, a0 + len);
        ctx.stroke();
      }
    }

    // 2) yukarı spiral çizen toz zerreleri
    const n = Math.round(16 * p.intensity) + 6;
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 3 + 501), h2 = k.hash(i * 5 + 503), h3 = k.hash(i * 7 + 509);
      const c = ((t * 0.42 * p.intensity) + h1) % 1;   // 0 taban → 1 tepe
      const y = -10 - c * 152;
      const rx = 16 + c * 64;
      const a = h2 * k.TAU + t * (4.2 * p.intensity) * (1 - c * 0.5) + c * 2.2;
      const x = Math.cos(a) * rx * (0.55 + h3 * 0.45);
      const fade = Math.sin(c * Math.PI);
      const r = 2.2 + h3 * 3.4;
      ctx.fillStyle = k.rgba(p.color, fade * (0.55 + h2 * 0.4));
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    }

    // 3) taban toz bulutu (girdabın ayağı)
    const bp = 0.5 + 0.5 * Math.sin(t * 3.1);
    for (let i = 0; i < 8; i++) {
      const h1 = k.hash(i * 11 + 521), h2 = k.hash(i * 13 + 523);
      const a = h1 * k.TAU + t * 2.6 * p.intensity;
      const rr = 14 + h2 * 34 + bp * 8;
      const x = Math.cos(a) * rr;
      const y = -4 - h1 * 10 + Math.sin(t * 4 + i) * 3;
      ctx.fillStyle = k.rgba(p.color, 0.30 + 0.18 * bp);
      ctx.beginPath(); ctx.arc(x, y, 3 + h2 * 5, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
