// transport/car — yandan görünüm araba (sağa bakar); tekerlekler speed ile döner.
// NOT: canvas y-aşağıdır; zemin (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'car',
  category: 'transport',
  desc: 'Yandan görünüm sade araba; sağa bakar, tekerlekler speed parametresiyle döner',
  tags: ['araba', 'otomobil', 'car', 'vehicle', 'taşıt', 'sürüş', 'driving', 'yol'],
  box: [-125, -95, 125, 14],
  bleed: 55,
  anchor: 'zemin merkezi (0,0); gövde yukarı uzar',
  points: { front: [105, -40], roof: [-10, -90], wheelF: [65, -8], wheelR: [-65, -8] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 0.4, desc: 'tekerlek dönüş hızı (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.55))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    const glass = k.rgba('bg', 0.9);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const sp = k.clamp(p.speed, 0, 1);
    const bob = k.noise1(t * 1.6) * 1.5 * (0.4 + sp * 0.6);

    ctx.save();
    ctx.translate(0, bob);

    // gövde
    blob(-105, -62, 210, 44, 14, k.rgba(p.color));
    // kabin
    blob(-58, -92, 96, 38, 13, k.rgba(p.color));
    // camlar
    ctx.fillStyle = glass;
    ctx.beginPath(); k.rrect(-50, -84, 40, 22, 7); ctx.fill();   // yan cam
    ctx.beginPath(); k.rrect(-4, -84, 34, 22, 7); ctx.fill();    // ön cam
    // kapı çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-8, -22); ctx.stroke();

    // far (ön, sarı vurgu + glow)
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(94, -48, 14, 10, 5); ctx.fill();
    k.glow(101, -43, 22, 'yellow', 0.35);
    // stop lambası (arka, kırmızı)
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); k.rrect(-108, -48, 8, 10, 4); ctx.fill();

    // tekerlekler
    const wAng = t * (2 + sp * 14);
    for (const wx of [-65, 65]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(wx, -8, 20 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.arc(wx, -8, 20, 0, k.TAU); ctx.fill();
      // jant telleri (speed ile döner)
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const a = wAng + i * Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(wx, -8);
        ctx.lineTo(wx + Math.cos(a) * 13, -8 + Math.sin(a) * 13); ctx.stroke();
      }
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.arc(wx, -8, 5, 0, k.TAU); ctx.fill();
    }

    // premium parlama (kabin sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, -84, 20, 9, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();

    // hız çizgileri (speed yüksekken, arkada)
    if (sp > 0.55) {
      ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const yy = -30 - i * 18 + k.noise1(t * 3 + i * 9) * 4;
        const len = 30 + k.hash(i * 7 + 2) * 30 * sp;
        ctx.beginPath(); ctx.moveTo(-125 - len, yy); ctx.lineTo(-125, yy); ctx.stroke();
      }
    }
  },
};
