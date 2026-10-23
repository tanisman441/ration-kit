// space-action/planet-orbit — halkalı gezegen: ay gezegen etrafında döngüsel olarak döner,
// gezegen yüzeyindeki bantlar yavaşça kayar, halka hafifçe salınır. Tamamen döngülü canlı sahne.
// NOT: canvas y-aşağıdır; (0,0) gezegen merkezidir. Yukarı = negatif y.
export default {
  name: 'planet-orbit',
  category: 'space-action',
  desc: 'Halkalı gezegen; ayı etrafında döngüsel yörüngede döner, yüzey bantları kayar',
  tags: ['gezegen', 'halka', 'yörünge', 'ay', 'uzay', 'dönme', 'planet', 'orbit', 'ring', 'moon', 'saturn', 'space'],
  box: [-150, -110, 150, 110],
  bleed: 40,
  anchor: 'gezegen merkezi (0,0)',
  points: { planet: [0, 0], ring: [95, 18], moon: [0, -78] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'gezegen ana rengi' },
    speed: { type: 'number', default: 1, desc: '0.2–2: yörünge ve bant kayma hızı' },
  },
  draw(ctx, t, p, k) {
    const OUT = 6;
    const S = k.clamp(p.speed, 0.2, 2);
    const R = 52;
    ctx.save();

    // --- yörünge çizgisi (ince, ink) ---
    ctx.strokeStyle = k.rgba('ink', 0.3);
    ctx.lineWidth = 2.5;
    ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.ellipse(0, 0, 105, 72, -0.25, 0, k.TAU); ctx.stroke();
    ctx.setLineDash([]);

    // --- gezegen gövdesi ---
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill(); ctx.stroke();
    // yüzey bantları (döngülü kayma)
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, R - 3, 0, k.TAU); ctx.clip();
    for (let i = 0; i < 4; i++) {
      const by = -36 + i * 22;
      const drift = 14 * Math.sin(t * 0.5 * S + i * 1.7);          // bant salınımı
      ctx.fillStyle = k.rgba('panel2', 0.55);
      ctx.beginPath();
      ctx.ellipse(drift, by, R * 0.95, 8, 0, 0, k.TAU);
      ctx.fill();
    }
    // kutup başlığı
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -R + 9, R * 0.6, 14, 0, 0, k.TAU); ctx.fill();
    // gece tarafı gölgesi (sağ alt)
    ctx.fillStyle = k.rgba('ink', 0.18);
    ctx.beginPath(); ctx.ellipse(R * 0.3, R * 0.32, R * 0.7, R * 0.6, -0.6, 0, k.TAU); ctx.fill();
    // sol üst parlama (premium finish)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(-R * 0.36, -R * 0.42, R * 0.4, R * 0.26, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- halka (ön/arka iki katman) ---
    const wob = 0.02 * k.noise1(t * 1.2);                          // halka salınımı
    const rx = 100, ry = 30, tilt = -0.25 + wob;
    ctx.save();
    ctx.rotate(tilt);
    // arka yarım
    ctx.strokeStyle = k.rgba('dim', 0.9);
    ctx.lineWidth = 13;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, Math.PI, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 15;
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, Math.PI, k.TAU); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    // --- ay: döngülü yörünge (periyot ~4.5 sn) ---
    const ma = t * k.TAU / (4.5 / S);
    const ex = 105, ey = 72, etilt = -0.25;
    const mx = ex * Math.cos(ma) * Math.cos(etilt) - ey * Math.sin(ma) * Math.sin(etilt);
    const my = ex * Math.cos(ma) * Math.sin(etilt) + ey * Math.sin(ma) * Math.cos(etilt);
    const behind = Math.sin(ma) < 0;                               // ay gezegenin arkasında mı
    const drawMoon = () => {
      const mr = 13;
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, k.TAU); ctx.fill(); ctx.stroke();
      // kraterler
      ctx.fillStyle = k.rgba('ink', 0.35);
      ctx.beginPath(); ctx.arc(mx - 4, my - 3, 3.4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(mx + 4, my + 4, 2.6, 0, k.TAU); ctx.fill();
      // parlama
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(mx - 5, my - 5, 5, 3.4, -0.5, 0, k.TAU); ctx.fill();
      // ay ışığı
      k.glow(mx, my, mr * 2.2, k.col('panel2'), 0.25);
    };
    if (behind) drawMoon();
    else {
      // gezegen üstünde kalan kısım için ay sonra çizilir
    }

    // gezegen ön yüzü zaten çizildi; halkanın ön yarımı:
    ctx.save();
    ctx.rotate(tilt);
    ctx.strokeStyle = k.rgba('dim', 0.95);
    ctx.lineWidth = 13;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.25);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI); ctx.stroke();
    // halka parlama
    ctx.strokeStyle = k.rgba('bg', 0.12);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 1.15, Math.PI * 1.5); ctx.stroke();
    ctx.restore();
    if (!behind) drawMoon();

    // --- ışık bükülmesi: halka gölgesi gezegende (sağ alt %12) ---
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(R * 0.2, R * 0.55, R * 0.5, 10, -0.25, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
