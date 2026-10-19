// magic-2/morph — dönüşüm: morph anında 1.0 sn'de küre, içe sarmal parçacıklarla
// dört uçlu yıldıza erir; öncesinde ve sonrasında hafif nefes hareketi.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) dönüşümün merkezidir.
export default {
  name: 'morph', category: 'magic-2',
  desc: 'Dönüşüm: morph anında küreden dört uçlu yıldıza eriyen, nefes alan büyü formu',
  tags: ['dönüşüm', 'morph', 'transformation', 'şekil değiştirme', 'yıldız', 'büyü', 'metamorphosis', 'erime'],
  box: [-110, -110, 110, 110],
  bleed: 60,
  anchor: 'merkez (0,0) — dönüşümün tam ortası',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'green', desc: 'formun rengi' },
    morph: { type: 'time', default: null, desc: 'dönüşüm anı (1.0 sn küre → yıldız)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.morph == null ? -1 : t - p.morph;
    const col = p.color;
    const b = p.morph == null ? 0 : k.prog(d, 0, 1);   // 0 = küre, 1 = yıldız
    const br = 1 + 0.03 * Math.sin(t * 2.6);            // nefes (idle)

    // şekil: R(θ) = 66·br·(1 − b·0.52·cos(4θ)) → 4 uçlu yıldız
    function shapePath(scale) {
      ctx.beginPath();
      const N = 72;
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * k.TAU;
        const r = 66 * br * scale * (1 - b * 0.52 * Math.cos(4 * a));
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    // ---- sağ alt gölge: %12 koyu kopya, 6 units offset ----
    const c = k.col(col);
    ctx.save();
    ctx.translate(6, 6);
    shapePath(1);
    ctx.fillStyle = 'rgba(' + Math.round(c[0] * 0.88) + ',' + Math.round(c[1] * 0.88) + ',' +
      Math.round(c[2] * 0.88) + ',0.55)';
    ctx.fill();
    ctx.restore();

    // ---- ana form ----
    shapePath(1);
    ctx.fillStyle = k.rgba(col, 0.9);
    ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 6;
    ctx.stroke();

    // ---- sol üst parlama (beyaz alfa 0.10, forma kırpılmış) ----
    ctx.save();
    shapePath(1);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, -28, 30, 22, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // ---- merkez çekirdek: dönüşüm ilerledikçe güçlenen nabız ----
    const coreA = 0.2 + 0.12 * Math.sin(t * 2.6) + b * 0.2;
    k.glow(0, 0, 42, col, Math.min(coreA, 0.5));
    ctx.fillStyle = k.rgba(col, 0.5);
    ctx.beginPath(); ctx.arc(0, 0, 9 + 3 * Math.sin(t * 2.6), 0, k.TAU); ctx.fill();

    // ---- dönüşüm parçacıkları (0–1 sn): içe sarmal, ortada en yoğun ----
    if (d >= 0 && d < 1) {
      const al = Math.sin(Math.PI * b);
      for (let i = 0; i < 22; i++) {
        const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 7 + 2);
        const dir = h2 > 0.5 ? 1 : -1;
        const a = h1 * k.TAU + d * 6 * dir;
        const rr = 66 + Math.sin(Math.PI * d) * 62 * (0.4 + h2);
        ctx.fillStyle = k.rgba(col, Math.max(0.85 * al * (1 - h1 * 0.4), 0));
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 2.5 + h1 * 4, 0, k.TAU); ctx.fill();
      }
      // dönüşüm halkası: büzülüp genişler
      ctx.strokeStyle = k.rgba(col, 0.6 * al);
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 66 + Math.sin(Math.PI * d) * 46, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
