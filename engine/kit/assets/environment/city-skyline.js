// environment/city-skyline — şehir silüeti; lights 0–1: yanan pencere oranı.
// NOT: canvas y-aşağıdır; zemin (0,0).
export default {
  name: 'city-skyline',
  category: 'environment',
  desc: 'Şehir silüeti; iki katmanlı bina sırası, yanan pencereler ayarlanabilir',
  tags: ['şehir', 'silüet', 'bina', 'gökdelen', 'gece', 'city', 'skyline', 'buildings', 'skyscraper', 'downtown'],
  box: [-265, -255, 265, 20],
  bleed: 0,
  anchor: 'zemin (0,0)',
  points: { top: [-50, -205], center: [0, -100] },
  params: {
    color: { type: 'color', default: 'dim' },
    lights: { type: 'number', default: 0.4, desc: 'yanan pencere oranı 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.58))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const o = k.clamp(p.lights, 0, 1);
    let seed = 1;
    const win = (x, y) => {
      const lit = k.hash(seed * 13 + 7) < o; seed++;
      ctx.fillStyle = lit ? k.rgba('yellow') : k.rgba('bg', 0.5);
      ctx.fillRect(x, y, 9, 13);
      if (lit) k.glow(x + 4.5, y + 6.5, 14, 'yellow', 0.25);
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 258, 10, 0, 0, k.TAU); ctx.fill();

    // arka sıra (silüet, koyu) — 6 bina, ortadaki en yüksek (x=-50, h=205)
    const back = [
      [-258, 70, 150], [-176, 72, 180], [-92, 84, 205],
      [4, 84, 195], [100, 72, 170], [184, 70, 145],
    ];
    for (const [bx, w, h] of back) blob(bx, -h, w, h, 4, dark);
    // en yüksek binada anten + kırmızı ikaz lambası
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.moveTo(-50, -205); ctx.lineTo(-50, -227); ctx.stroke();
    const bl = Math.sin(t * 2.2) > 0 ? 0.9 : 0.25;
    ctx.fillStyle = k.rgba('red', bl);
    ctx.beginPath(); ctx.arc(-50, -229, 5, 0, k.TAU); ctx.fill();
    if (bl > 0.5) k.glow(-50, -229, 16, 'red', 0.35);

    // ön sıra (pencereli) — 5 bina
    const front = [[-250, 78], [-152, 84], [-48, 76], [48, 82], [150, 74]];
    for (let i = 0; i < front.length; i++) {
      const [fx, w] = front[i];
      const h = 88 + k.hash(i * 11 + 13) * 78;
      blob(fx, -h, w, h, 4, body);
      const cols = Math.floor((w - 16) / 17);
      const rows = Math.floor((h - 26) / 25);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          win(fx + 10 + c * 17, -h + 14 + r * 25);
    }

    // premium parlama (ön sıradaki en yüksek binanın sol üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-238, -176, 30, 70, 8); ctx.fill();
  },
};
