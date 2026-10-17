// weapons/knife — yandan görünüm savaş bıçağı, uç sağa bakar.
// Orijinal tasarım; gerçek silah markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) bıçak merkezidir.
export default {
  name: 'knife',
  category: 'weapons',
  desc: 'Yandan görünüm bıçak; keskin uçlu namlu, balçak ve perçinli kabza',
  tags: ['bıçak', 'knife', 'kama', 'blade', 'silah', 'weapon', 'savaş bıçağı', 'kesici'],
  box: [-105, -32, 125, 32],
  bleed: 12,
  anchor: 'bıçak merkezi (0,0)',
  points: { tip: [112, 0], handle: [-78, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    const metal = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.45))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const bob = k.noise1(t * 0.8) * 1.2;
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    ctx.save();
    ctx.translate(0, bob);

    // namlu (blade): keskin uç
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-20, -13 - LW / 2); ctx.lineTo(104, -10 - LW / 2);
    ctx.lineTo(118, 0); ctx.lineTo(104, 10 + LW / 2); ctx.lineTo(-20, 13 + LW / 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath();
    ctx.moveTo(-20, -13); ctx.lineTo(104, -10); ctx.lineTo(118, 0);
    ctx.lineTo(104, 10); ctx.lineTo(-20, 13);
    ctx.closePath(); ctx.fill();
    // namlu parlama çizgisi (keskin kenar)
    ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(96, -4); ctx.stroke();
    // namlu oluk çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-12, 4); ctx.lineTo(70, 5); ctx.stroke();

    // balçak (guard)
    blob(-30, -20, 12, 40, 5, dark);
    // kabza
    blob(-96, -12, 68, 24, 10, body);
    // kabza perçinleri
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(-78, 0, 4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(-56, 0, 4, 0, k.TAU); ctx.fill();
    // kabza tırtık çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) {
      const gx = -70 + i * 14;
      ctx.beginPath(); ctx.moveTo(gx, -8); ctx.lineTo(gx, 8); ctx.stroke();
    }
    // kabza ucu
    blob(-102, -8, 10, 16, 4, metal);

    // premium parlama (sol üst, namlu üzerinde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(30, -6, 26, 5, -0.1, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
