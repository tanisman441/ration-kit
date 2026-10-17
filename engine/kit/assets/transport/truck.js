// transport/truck — yandan görünüm kamyon (sağa bakar): kabin + römork.
// NOT: canvas y-aşağıdır; zemin (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'truck',
  category: 'transport',
  desc: 'Yandan görünüm kamyon; önde kabin, arkada çizgili römork, tekerlekler speed ile döner',
  tags: ['kamyon', 'tır', 'truck', 'lorry', 'nakliye', 'yük', 'cargo', 'taşıt', 'vehicle'],
  box: [-180, -115, 180, 14],
  bleed: 55,
  anchor: 'zemin merkezi (0,0); gövde yukarı uzar',
  points: { front: [48, -48], cargo: [-110, -105], wheelF: [25, -8] },
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
    const bob = k.noise1(t * 1.4) * 1.5 * (0.4 + sp * 0.6);

    ctx.save();
    ctx.translate(0, bob);

    // römork (arka kasa)
    blob(-172, -105, 122, 85, 8, k.rgba(p.color));
    // römork dikey çıta çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3;
    for (let x = -150; x < -55; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, -98); ctx.lineTo(x, -27); ctx.stroke();
    }
    // kasa kapı çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-111, -105); ctx.lineTo(-111, -20); ctx.stroke();

    // kabin (ön)
    blob(-50, -85, 98, 65, 10, k.rgba(p.color));
    // ön cam (eğimli)
    ctx.fillStyle = glass;
    ctx.beginPath();
    ctx.moveTo(18, -77); ctx.lineTo(40, -77); ctx.lineTo(40, -52); ctx.lineTo(18, -52);
    ctx.closePath(); ctx.fill();
    // yan cam
    ctx.beginPath(); k.rrect(-40, -77, 50, 25, 6); ctx.fill();
    // ızgara
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let y = -44; y < -26; y += 8) {
      ctx.beginPath(); ctx.moveTo(34, y); ctx.lineTo(46, y); ctx.stroke();
    }

    // far (ön, sarı vurgu + glow)
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(40, -52, 10, 9, 4); ctx.fill();
    k.glow(45, -48, 20, 'yellow', 0.35);
    // stop (arka)
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); k.rrect(-176, -50, 7, 9, 3); ctx.fill();

    // tekerlekler
    const wAng = t * (2 + sp * 14);
    for (const wx of [-140, -100, 25]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(wx, -8, 18 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.arc(wx, -8, 18, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const a = wAng + i * Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(wx, -8);
        ctx.lineTo(wx + Math.cos(a) * 11, -8 + Math.sin(a) * 11); ctx.stroke();
      }
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.arc(wx, -8, 4.5, 0, k.TAU); ctx.fill();
    }

    // premium parlama (römork sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-164, -101, 60, 10, 5); ctx.fill();

    ctx.restore();

    // hız çizgileri
    if (sp > 0.55) {
      ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const yy = -45 - i * 22 + k.noise1(t * 3 + i * 5) * 4;
        const len = 30 + k.hash(i * 3 + 8) * 30 * sp;
        ctx.beginPath(); ctx.moveTo(-180 - len, yy); ctx.lineTo(-180, yy); ctx.stroke();
      }
    }
  },
};
