// combat-hits-2/stun-stars — sersemleme yıldızları: merkez çevresinde sürekli dönen yörünge,
// her yıldız bağımsız nabız atar; intensity yıldız boyu/parlaklık/yörünge genişliğini yönetir.
// NOT: canvas y-aşağıdır; (0,0) yıldız yörüngesinin merkezi (sersemlemiş karakterin başı).
export default {
  name: 'stun-stars', category: 'combat-hits-2',
  desc: 'Sersemleme yıldızları: sürekli dönen yörüngede nabız atan yıldızlar, yoğunluk ayarlı',
  tags: ['sersem', 'yıldız', 'dönme', 'nabız', 'baygın', 'sersemlik', 'stun', 'stars', 'dizzy', 'spin', 'pulse', 'orbit'],
  box: [-130, -110, 130, 110],
  bleed: 40,
  anchor: 'yıldız yörüngesinin merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    intensity: { type: 'number', default: 0.6, desc: 'sersemlik yoğunluğu 0-1 (yıldız boyu, parlaklık, yörünge genişliği)' },
    count: { type: 'number', default: 5, desc: 'yıldız sayısı (3-7)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const inten = k.clamp(p.intensity, 0, 1);
    const n = Math.round(k.clamp(p.count, 3, 7));
    const sizeScale = 0.45 + 0.75 * inten;
    const rx = 62 + 26 * inten, ry = 26 + 12 * inten;

    function star(cx, cy, r, rot, alpha) {
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = rot + i * Math.PI / 5;
        const rr = i % 2 === 0 ? r : r * 0.45;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.save();
    // yörünge — nefes gibi genişleyip daralır (periyot 4.8 sn)
    const breathe = 1 + 0.07 * Math.sin(t * k.TAU / 4.8);
    const spin = t * k.TAU / 3.0;                        // dönüş: 3 sn'de bir tur
    for (let i = 0; i < n; i++) {
      const h1 = k.hash(i * 5 + 201), h2 = k.hash(i * 11 + 77);
      const ang = spin + i * k.TAU / n + h1 * 0.5;
      // dikey sallanma — yıldızlar yukarı-aşağı hafif dalgalanır
      const bob = Math.sin(t * 2.2 + h2 * k.TAU) * 5;
      const x = Math.cos(ang) * rx * breathe;
      const y = Math.sin(ang) * ry * breathe - 6 + bob;
      // nabız — her yıldız ~1.2 sn periyotla bağımsız atar
      const pulse = 0.78 + 0.34 * Math.sin(t * k.TAU / 1.2 + h2 * k.TAU) + 0.12 * inten;
      const r = (11 + h1 * 4) * sizeScale * pulse;
      // parlaklık — nabızla birlikte yanıp söner + hafif titreme
      const twinkle = 0.62 + 0.28 * pulse + 0.1 * k.noise1(t * 2.5 + i * 7);
      const alpha = k.clamp(0.55 + 0.3 * inten, 0, 1) * k.clamp(twinkle, 0.2, 1);
      if (alpha > 0.01) {
        // yumuşak parlama halesi
        k.glow(x, y, r * 2.6, p.color, 0.12 + 0.1 * inten);
        star(x, y, r, ang * 1.7 + t * 0.9, alpha);
      }
      // yıldız kuyruğu — dönme yönünde kısa iz çizgisi
      const trailA = ang - 0.38;
      const tx2 = Math.cos(trailA) * rx * breathe, ty2 = Math.sin(trailA) * ry * breathe - 6 + bob;
      ctx.strokeStyle = k.rgba(p.color, 0.3 * alpha);
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(tx2, ty2); ctx.lineTo(x, y); ctx.stroke();
    }
    ctx.restore();
  },
};
