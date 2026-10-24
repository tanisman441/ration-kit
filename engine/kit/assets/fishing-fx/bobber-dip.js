// fishing-fx/bobber-dip — suda duran şamandıra balık ısırınca batıp çıkar.
// at anında (0.6 sn) şamandıra suyun altına dalar, sıçrama ve halka oluşur,
// sonra geri yükselir; idle: şamandıra hafifçe batar çıkar, su dalgalanır.
// NOT: canvas y-aşağıdır; (0,0) su yüzeyidir.
export default {
  name: 'bobber-dip', category: 'fishing-fx',
  desc: 'Suda duran şamandıra balık ısırınca suyun altına dalıp geri çıkar',
  tags: ['şamandıra', 'balık', 'ısırma', 'olta', 'su', 'bobber', 'bite', 'fishing', 'dip', 'water'],
  box: [-110, -80, 110, 80],
  bleed: 20,
  anchor: 'su yüzeyi (0,0); şamandıra yüzeyde durur',
  points: { bobber: [0, -8], water: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'ısırma anı (0.6 sn, şamandıra batar ve geri çıkar)' },
    color: { type: 'color', default: 'red', desc: 'şamandıra üst rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // su yüzeyi
    ctx.strokeStyle = k.rgba('cyan', 0.55); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -110; x <= 110; x += 8) {
      const wy = Math.sin(x * 0.08 + t * 1.5) * 2;
      if (x === -110) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba('cyan', 0.3); ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -100; x <= 100; x += 8) {
      const wy = 12 + Math.sin(x * 0.06 + t * 1.1 + 1) * 2;
      if (x === -100) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // halka dalgalar (şamandıra çevresinde sürekli)
    for (let i = 0; i < 2; i++) {
      const frac = ((t * 0.6 + i * 0.5) % 1);
      ctx.strokeStyle = k.rgba('cyan', (1 - frac) * 0.45); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 2, 10 + frac * 42, 3 + frac * 10, 0, 0, k.TAU); ctx.stroke();
    }

    // batma miktarı: 0.6 sn'lik sinüs dalgası
    let dip = 0;
    if (d >= 0 && d < 0.6) dip = Math.sin((d / 0.6) * Math.PI) * 26;
    const bobY = Math.sin(t * k.TAU / 2.4) * 3 + dip;
    const tilt = k.noise1(t * 0.5) * 0.06 + (d >= 0 && d < 0.6 ? Math.sin((d / 0.6) * Math.PI) * 0.18 : 0);

    // şamandıra: dikey kapsül, üst renkli alt beyaz
    ctx.save();
    ctx.translate(0, bobY - 8);
    ctx.rotate(tilt);
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.arc(0, 0, 14, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI); ctx.fill();
    // alt uzantı (suda kalan kısım)
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    k.rrect(-6, 10, 12, 14, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, k.TAU); ctx.stroke();
    // parlama sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-5, -6, 5, 3, -0.4, 0, k.TAU); ctx.fill();
    // üst çubuk
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, -32); ctx.stroke();
    ctx.restore();

    // batma sıçraması: damlacıklar yukarı fırlar
    if (d >= 0 && d < 0.35) {
      const u = d / 0.35;
      for (let i = 0; i < 7; i++) {
        const h = k.hash(i * 33.3);
        const ang = -Math.PI * (0.1 + h * 0.8);
        const dist = u * (12 + h * 18);
        ctx.fillStyle = k.rgba('cyan', (1 - u) * 0.85);
        ctx.beginPath(); ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, 2 + h * 2.5, 0, k.TAU); ctx.fill();
      }
      // batma halkası
      ctx.strokeStyle = k.rgba('cyan', (1 - u) * 0.7); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, 2, 6 + u * 30, 2 + u * 8, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
