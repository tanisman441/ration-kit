// weather-fx/fog — üç katmanlı sürüklenen sis tabakası; her katman, kenarları
// çift-harmonik dalgayla faz kaymalı akan bir banttır. Katmanlar farklı hızlarda
// akar (paralaks), yoğunluk density ile ayarlanır. Saf canlı idle animasyonu.
// NOT: canvas y-aşağıdır; sis yatay bantlar halinde uzanır.
export default {
  name: 'fog', category: 'weather-fx',
  desc: 'Üç katmanlı sürüklenen sis; dalgalı bantlar farklı hızlarda kesintisiz akar',
  tags: ['sis', 'pus', 'buğu', 'duman', 'hava', 'fog', 'mist', 'haze', 'weather', 'drift'],
  box: [-170, -100, 170, 100],
  bleed: 20,
  anchor: 'merkez (0,0); sis yatay bantlar halinde',
  points: {},
  params: {
    color: { type: 'color', default: 'dim' },
    density: { type: 'number', default: 0.65, desc: 'sis yoğunluğu 0–1: alfa ve katman sayısı' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const dens = k.clamp(p.density, 0, 1);
    const X0 = -170, X1 = 170;

    // katmanlar: taban y, akış hızı (faz), alfa, bant yüksekliği
    const layers = [
      { y: -48, sp: 0.9, alpha: 0.42, h: 30 },
      { y: -4, sp: -1.4, alpha: 0.34, h: 44 },
      { y: 44, sp: 0.6, alpha: 0.50, h: 34 },
    ];

    layers.forEach((L, li) => {
      if (li === 1 && dens < 0.25) return; // düşük yoğunlukta orta katmanı atla
      const bob = k.noise1(t * 0.5 + li * 5.3) * 6;
      const cy = L.y + bob;
      const a = L.alpha * (0.3 + 0.7 * dens);

      // dalgalı bant: üst kenar boyunca git, alt kenardan geri dön
      const topY = x => cy - L.h / 2 + 14 * Math.sin(x * 0.021 + t * L.sp + li * 2.4) + 7 * Math.sin(x * 0.047 - t * L.sp * 0.6 + li);
      const botY = x => cy + L.h / 2 + 12 * Math.sin(x * 0.019 - t * L.sp * 0.8 + li * 3.1) + 6 * Math.sin(x * 0.043 + t * L.sp * 0.5);
      // yumuşak kenar: önce genişletilmiş alt katman
      ctx.fillStyle = k.rgba(p.color, a * 0.35);
      ctx.beginPath();
      ctx.moveTo(X0, topY(X0) - 7);
      for (let x = X0 + 10; x <= X1; x += 10) ctx.lineTo(x, topY(x) - 7);
      for (let x = X1; x >= X0; x -= 10) ctx.lineTo(x, botY(x) + 7);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, a);
      ctx.beginPath();
      ctx.moveTo(X0, topY(X0));
      for (let x = X0 + 10; x <= X1; x += 10) ctx.lineTo(x, topY(x));
      for (let x = X1; x >= X0; x -= 10) ctx.lineTo(x, botY(x));
      ctx.closePath(); ctx.fill();

      // iç doku: daha açık, daha ince ikinci bant (farklı faz)
      const a2 = a * 0.55;
      const top2 = x => cy - L.h / 4 + 10 * Math.sin(x * 0.03 - t * L.sp * 1.3 + li * 1.7) + 5 * Math.sin(x * 0.061 + t * L.sp);
      const bot2 = x => cy + L.h / 4 + 9 * Math.sin(x * 0.027 + t * L.sp * 1.1 + li * 4.2);
      ctx.fillStyle = k.rgba(p.color, a2);
      ctx.beginPath();
      ctx.moveTo(X0, top2(X0));
      for (let x = X0 + 10; x <= X1; x += 10) ctx.lineTo(x, top2(x));
      for (let x = X1; x >= X0; x -= 10) ctx.lineTo(x, bot2(x));
      ctx.closePath(); ctx.fill();

      // sol üst parlama (premium finish, çok hafif): üst kenar boyunca ince şerit
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.moveTo(X0, topY(X0));
      for (let x = X0 + 10; x <= X1; x += 10) ctx.lineTo(x, topY(x));
      for (let x = X1; x >= X0; x -= 10) ctx.lineTo(x, topY(x) + 8);
      ctx.closePath(); ctx.fill();
    });
  },
};
