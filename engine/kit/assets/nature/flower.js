// nature/flower — sap + yapraklar; bloom anında tomurcuk çiçeğe açılır, sap rüzgârda salınır.
// NOT: canvas y-aşağıdır; zemin (0,0), çiçek negatif y yönünde yukarı uzar.
export default {
  name: 'flower',
  category: 'nature',
  desc: 'Saplı çiçek; bloom anında tomurcuk çiçeğe açılır, sap rüzgârda salınır',
  tags: ['çiçek', 'gül', 'bitki', 'doğa', 'tomurcuk', 'çiçek açma', 'flower', 'bloom', 'plant', 'nature', 'blossom'],
  box: [-120, -300, 120, 16],
  bleed: 24,
  anchor: 'zemin (0,0); çiçek başı ~y=-235',
  points: { head: [0, -235] },
  params: {
    color: { type: 'color', default: 'dim' },
    petal: { type: 'color', default: 'red' },
    bloom: { type: 'time', default: null, desc: 'tomurcuğun açılma anı (~1.4 sn sürer)' },
    sway: { type: 'number', default: 0.4, desc: 'rüzgâr şiddeti 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // açılma: olay yoksa tam açık; olay anında 1.4 sn'de tomurcuktan açılır
    const d = p.bloom == null ? -1 : t - p.bloom;
    // bloom verilmediyse hep açık; verildiyse olaydan önce tomurcuk, sonra açılış
    const open = p.bloom == null ? 1 : (d < 0 ? 0 : k.E.outBack(k.clamp(d / 1.4, 0, 1)));

    // idle: sap salınımı (taban etrafında dönme)
    const swayA = Math.sin(t * 1.3) * 0.028 * p.sway + k.noise1(t * 0.8) * 0.02 * p.sway;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 60, 8, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.rotate(swayA);

    // sap: önce dış hat, sonra gövde
    ctx.strokeStyle = line; ctx.lineWidth = 10 + LW;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -218); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -218); ctx.stroke();

    // yapraklar (iki yanda elips)
    const leaf = (x, y, ang, sx, sy) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 0, sx + LW / 2, sy + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darker(p.color); ctx.beginPath(); ctx.ellipse(0, 0, sx, sy, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.ellipse(-sx * 0.12, -sy * 0.28, sx * 0.8, sy * 0.72, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    leaf(30, -92, 0.45, 34, 13);
    leaf(-28, -148, -0.5, 30, 12);

    // çiçek başı
    const hx = 0, hy = -235;
    const N = 7;
    const spread = 0.22 + 0.78 * open;              // tomurcuk: dar, açık: tam daire
    const len = 14 + 44 * open, wid = 10 + 12 * open;

    const petalAt = (cx, cy, a, w, l, sheen) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
      // sağ alt gölge (%12 koyultma, 5 birim ofset)
      ctx.fillStyle = darker(p.petal);
      ctx.beginPath(); ctx.ellipse(5, 5 - l / 2, w / 2, l / 2, 0, 0, k.TAU); ctx.fill();
      // dış hat + gövde
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, -l / 2, w / 2 + LW / 2, l / 2 + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.petal);
      ctx.beginPath(); ctx.ellipse(0, -l / 2, w / 2, l / 2, 0, 0, k.TAU); ctx.fill();
      // premium parlama (sol üst, alfa 0.10)
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(-w * 0.2, -l * 0.68, w * 0.26, l * 0.2, -0.4, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    };

    for (let i = 0; i < N; i++) {
      const a = (i / N) * k.TAU * spread;
      petalAt(hx, hy, a, wid, len, i === 1);
    }

    // çanak yapraklar (kapalıyken belirgin)
    const cup = 1 - open;
    if (cup > 0.02) {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(hx - 26, hy + 2, 52, 20 * cup + 6, 8); ctx.fill();
      ctx.fillStyle = darker(p.color);
      ctx.beginPath(); k.rrect(hx - 26 + LW / 2, hy + 2 + LW / 2, 52 - LW, 20 * cup + 6 - LW, 6); ctx.fill();
    }

    // orta tabla (sarı) + tohum noktaları
    const cr = 8 + 9 * open;
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(hx, hy, cr + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); ctx.arc(hx, hy, cr, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.3);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * k.TAU + 0.4;
      ctx.beginPath(); ctx.arc(hx + Math.cos(a) * cr * 0.5, hy + Math.sin(a) * cr * 0.5, 2.4, 0, k.TAU); ctx.fill();
    }
    // tablada parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - cr * 0.3, hy - cr * 0.4, cr * 0.4, cr * 0.25, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
