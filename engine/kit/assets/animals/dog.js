// animals/dog — ayakta duran köpek, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'dog', category: 'animals',
  desc: 'Ayakta duran köpek, yandan görünüm; kuyruk sallar, diliyle hızlı solur',
  tags: ['köpek', 'evcil hayvan', 'havlama', 'yavru', 'dog', 'puppy', 'pet', 'bark'],
  box: [-115, -225, 165, 10],
  bleed: 50,
  anchor: 'ayaklar (0,0); boy ~215 birim',
  points: { head: [92, -158], nose: [150, -164], tail: [-68, -118] },
  params: {
    color: { type: 'color', default: 'dim' },
    bark: { type: 'time', default: null, desc: 'havlama — ağız açılır + ses halkaları (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const tongueC = k.rgba('red');
    const br = Math.sin(t * k.TAU / 2.4) * 2;                       // nefes
    const pant = (Math.sin(t * k.TAU * 3.5) * 0.5 + 0.5) * 8;      // hızlı soluma
    const db = p.bark == null ? -1 : t - p.bark;
    const barking = db >= 0 && db < 0.7;
    const benv = barking ? Math.sin(db / 0.7 * Math.PI) : 0;        // havlama zarfı
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(10, -4, 70, 11, 0, 0, k.TAU); ctx.fill();

    // kuyruk: hızlı sallanma (canlı idle)
    const wag = 1.1 + Math.sin(t * 7) * 0.45;
    limb(-68, -118, -68 - Math.cos(wag) * 58, -118 - Math.sin(wag) * 58, 13, body);

    // arka bacaklar + patiler
    limb(-52, -70, -56, -10, 16, body);
    limb(-28, -70, -30, -10, 16, body);
    blob(-66, -14, 24, 14, 7, body);
    blob(-40, -14, 24, 14, 7, body);

    // gövde
    blob(-78, -140 - br * 0.5, 150, 66, 30, body);

    // ön bacaklar + patiler
    limb(34, -80, 36, -10, 16, body);
    limb(58, -80, 60, -10, 16, body);
    blob(24, -14, 24, 14, 7, body);
    blob(48, -14, 24, 14, 7, body);

    // baş (havlarken hafif yukarı kalkar)
    const hx = 92, hy = -158 - br * 0.5 - benv * 10;
    // sarkık kulak
    ctx.save(); ctx.translate(78, -182); ctx.rotate(0.35);
    blob(-11, -30, 22, 34, 11, body); ctx.restore();
    disc(hx, hy, 33, 31, body);
    // burun
    blob(108, -172, 44, 30, 14, body);
    disc(150, -164, 7, 6, inkC);
    // göz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(96, hy - 8, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();

    // ağız: havlarken açılır
    const jaw = benv * 14;
    ctx.fillStyle = k.rgba('bg', 0.75);
    ctx.beginPath(); ctx.ellipse(128, -142, 10, 4 + jaw * 0.7, 0, 0, k.TAU); ctx.fill();
    // dil: hızlı soluma ile uzayıp kısalır
    const tl = 14 + pant + benv * 10;
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(114, -144, 20, tl + LW, 8 + LW / 2); ctx.fill();
    ctx.fillStyle = tongueC; ctx.beginPath(); k.rrect(116, -142, 16, tl, 8); ctx.fill();

    // havlama ses halkaları
    if (barking) {
      ctx.strokeStyle = k.rgba('ink', 0.6 * (1 - db / 0.7)); ctx.lineWidth = 4;
      for (const r of [18 + db * 50, 30 + db * 50]) {
        ctx.beginPath(); ctx.arc(158, -148, r, -0.9, 0.9); ctx.stroke();
      }
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 14, hy - 14, 11, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-50, -112, 22, 10, 0, 0, k.TAU); ctx.fill();
  },
};
