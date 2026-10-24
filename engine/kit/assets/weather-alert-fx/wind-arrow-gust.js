// weather-alert-fx/wind-arrow-gust — rüzgar oku esintisi (döngüsel)
// 2.4 sn'lik döngü: ok ileri fırlar, esinti çizgileri arkadan akar, döngü başa döner.
// NOT: canvas y-aşağıdır; ok sağa (+x) bakar, esinti soldan sağa akar.
export default {
  name: 'wind-arrow-gust', category: 'weather-alert-fx',
  desc: 'Sağa bakan kalın rüzgar oku; 2.4 sn döngüde ileri fırlayan ok ve arkadan akan esinti çizgileri',
  tags: ['rüzgar', 'esinti', 'ok', 'fırtına', 'hava', 'wind', 'gust', 'arrow', 'breeze', 'storm'],
  box: [-170, -90, 170, 90],
  bleed: 30,
  anchor: 'ok gövdesi merkezi (0,0); ok ucu sağda',
  points: { tip: [160, 0], tail: [-160, 0], centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    gust: { type: 'color', default: 'cyan' },
    speed: { type: 'number', default: 1, desc: 'döngü hızı çarpanı 0.5–2' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // döngü fazı: 0→1, her 2.4/sn hızında; fırlama ilk %40'ta
    const cyc = 2.4 / Math.max(0.5, p.speed);
    const ph = ((t % cyc) / cyc);
    const surge = ph < 0.4 ? (ph / 0.4) : 1 - (ph - 0.4) / 0.6 * 0.55;
    const ox = surge * 26; // ok ileri-geri kayması
    const squash = 1 - surge * 0.12;

    // esinti çizgileri: soldan sağa akan 5 çizgi, döngü fazıyla kayar
    ctx.lineWidth = 6;
    for (let i = 0; i < 5; i++) {
      const y = -64 + i * 32;
      const len = 60 + k.hash(i * 7.7 + 3) * 70;
      const flow = ((ph + i * 0.17) % 1);
      const x0 = -170 + flow * 120;
      const alpha = flow < 0.2 ? flow / 0.2 : (flow > 0.85 ? (1 - flow) / 0.15 : 1);
      ctx.strokeStyle = k.rgba(p.gust, 0.75 * Math.max(0, Math.min(1, alpha)));
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + len, y); ctx.stroke();
      // küçük kıvrım ucu
      ctx.beginPath(); ctx.moveTo(x0 + len, y);
      ctx.quadraticCurveTo(x0 + len + 12, y - 8, x0 + len + 18, y - 16); ctx.stroke();
    }

    // ok: gölge (sağ alt) + gövde + sol üst parlama
    ctx.save();
    ctx.translate(ox, 0); ctx.scale(1, squash);
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-60, -28); ctx.lineTo(80, -28); ctx.lineTo(80, -58); ctx.lineTo(150, 0);
    ctx.lineTo(80, 58); ctx.lineTo(80, 28); ctx.lineTo(-60, 28); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(-5, -6);
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-60, -28); ctx.lineTo(80, -28); ctx.lineTo(80, -58); ctx.lineTo(150, 0);
    ctx.lineTo(80, 58); ctx.lineTo(80, 28); ctx.lineTo(-60, 28); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(10, -20, 44, 10, 0, 0, k.TAU); ctx.fill();
    // ok ucu vurgusu: fırlamada parlar
    ctx.fillStyle = k.rgba(p.gust, 0.35 + 0.55 * surge);
    ctx.beginPath(); ctx.moveTo(80, -58); ctx.lineTo(150, 0); ctx.lineTo(80, 58); ctx.closePath(); ctx.fill();
    ctx.restore();
  },
};
