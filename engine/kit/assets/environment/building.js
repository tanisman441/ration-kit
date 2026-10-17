// environment/building — bina cephesi; variant: house|office|factory.
// lights 0–1: yanan pencere oranı. NOT: canvas y-aşağıdır; zemin (0,0).
export default {
  name: 'building',
  category: 'environment',
  desc: 'Bina cephesi; house/office/factory varyantı, yanan pencereler ayarlanabilir',
  tags: ['bina', 'ev', 'ofis', 'fabrika', 'cephe', 'building', 'house', 'office', 'factory', 'facade'],
  box: [-158, -285, 158, 12],
  bleed: 0,
  anchor: 'zemin (0,0); cephe ortası',
  points: { door: [0, -36] },
  params: {
    color: { type: 'color', default: 'dim' },
    variant: { type: 'enum', values: ['house', 'office', 'factory'], default: 'house' },
    lights: { type: 'number', default: 0.4, desc: 'yanan pencere oranı 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.78))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const poly = (pts, c) => {
      ctx.fillStyle = c; ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();
    };

    const o = k.clamp(p.lights, 0, 1);
    let seed = 1;
    const win = (x, y, w, h, muntin = false) => {
      const lit = k.hash(seed * 7 + 3) < o; seed++;
      blob(x, y, w, h, 5, lit ? k.rgba('yellow') : k.rgba('bg', 0.72));
      if (lit) k.glow(x + w / 2, y + h / 2, Math.max(w, h), 'yellow', 0.28);
      if (muntin) {
        ctx.strokeStyle = k.rgba('bg', 0.45); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(x + w / 2, y + 3); ctx.lineTo(x + w / 2, y + h - 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 3, y + h / 2); ctx.lineTo(x + w - 3, y + h / 2); ctx.stroke();
      }
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -5, 150, 10, 0, 0, k.TAU); ctx.fill();

    const v = p.variant;

    if (v === 'house') {
      blob(-100, -140, 200, 140, 8, body);                       // gövde
      poly([[-118, -136], [118, -136], [0, -208]], dark);         // çatı
      blob(56, -200, 26, 60, 4, dark);                           // baca
      blob(-22, -72, 44, 72, 8, k.rgba('panel'));                // kapı
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.arc(10, -38, 5, 0, k.TAU); ctx.fill(); // tokmak
      win(-72, -122, 38, 38, true); win(34, -122, 38, 38, true); // üst kat
      win(-72, -56, 38, 38, true); win(34, -56, 38, 38, true);   // alt kat
      // parlama (çatı sol)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.moveTo(-100, -142); ctx.lineTo(-52, -142); ctx.lineTo(-84, -178); ctx.lineTo(-112, -150); ctx.closePath(); ctx.fill();
    } else if (v === 'office') {
      blob(-90, -262, 180, 262, 6, body);                        // kule
      blob(-98, -272, 196, 14, 6, dark);                         // parapet
      blob(-28, -282, 56, 12, 4, dark);                          // çatı kutusu
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 3; c++)
          win(-70 + c * 52, -238 + r * 50, 40, 32);              // 12 pencere
      blob(-28, -58, 56, 58, 8, k.rgba('panel'));                // giriş
      blob(-42, -70, 84, 12, 6, dark);                           // sundurma
      k.glow(0, -40, 40, 'yellow', 0.25 * o + 0.1);               // giriş ışığı
      // parlama (sol üst köşe)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); k.rrect(-84, -256, 34, 90, 8); ctx.fill();
    } else {
      // factory: testere dişli çatı
      const teeth = [[-140, -150]];
      for (let i = 0; i < 4; i++) {
        const x0 = -140 + i * 70;
        teeth.push([x0 + 35, -192], [x0 + 70, -150]);
      }
      poly([...teeth, [140, -2], [-140, -2]], body);              // gövde + dişli çatı
      // bacalar
      for (const bx of [-104, 56]) {
        blob(bx, -238, 26, 92, 4, dark);
        blob(bx - 4, -246, 34, 12, 4, dark);                     // baca başlığı
        const bl = Math.sin(t * 2.4 + bx) > 0 ? 0.9 : 0.25;      // ikaz lambası
        ctx.fillStyle = k.rgba('red', bl);
        ctx.beginPath(); ctx.arc(bx + 13, -250, 5, 0, k.TAU); ctx.fill();
        if (bl > 0.5) k.glow(bx + 13, -250, 18, 'red', 0.4);
      }
      // büyük kapı (yatay çıtalı)
      blob(-55, -95, 110, 95, 6, k.rgba('panel'));
      ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
      for (const ly of [-71, -47, -23]) {
        ctx.beginPath(); ctx.moveTo(-49, ly); ctx.lineTo(49, ly); ctx.stroke();
      }
      // üst sıra küçük pencereler
      for (let i = 0; i < 6; i++) win(-120 + i * 44, -128, 26, 26);
      // parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); k.rrect(-134, -144, 40, 60, 8); ctx.fill();
    }
  },
};
