// weapons/grenade — el bombası, yandan/ön görünüm.
// Orijinal tasarım; gerçek silah markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'grenade',
  category: 'weapons',
  desc: 'El bombası; pin anında kaşık açılır ve pim halkası fırlar, explode anında flaş + parça + duman',
  tags: ['el bombası', 'bomba', 'grenade', 'bomb', 'patlayıcı', 'explosive', 'pim', 'pin', 'FPS'],
  box: [-75, -95, 75, 75],
  bleed: 110,
  anchor: 'gövde merkezi (0,0)',
  points: { top: [0, -62], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'green' },
    pin: { type: 'time', default: null, desc: 'pim çekme anı: kaşık açılır, halka fırlar' },
    explode: { type: 'time', default: null, desc: 'patlama anı: flaş + parçalar + duman' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.6))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const dp = p.pin == null ? -1 : t - p.pin;
    const de = p.explode == null ? -1 : t - p.explode;
    // patlama başlayınca gövde görünmez (patlamış)
    const goneK = de >= 0 ? Math.min(1, de / 0.08) : 0;
    // pin çekilince kaşık açılır (0.3 sn'de)
    const leverK = dp >= 0 ? Math.min(1, dp / 0.3) : 0;
    const bob = k.noise1(t * 0.9) * 1.5;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    if (goneK < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - goneK;
      ctx.translate(0, bob);

      // gövde (yumurta/oval)
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, 6, 46 + LW / 2, 52 + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(0, 6, 46, 52, 0, 0, k.TAU); ctx.fill();
      // gövde kabartma çizgileri (ananas deseni)
      ctx.strokeStyle = k.rgba('ink', 0.28); ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.moveTo(-40, 6 + i * 24); ctx.quadraticCurveTo(0, 6 + i * 24 + 8, 40, 6 + i * 24); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(0, -44); ctx.quadraticCurveTo(-6, 6, 0, 56); ctx.stroke();
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-16, -14, 14, 20, -0.3, 0, k.TAU); ctx.fill();

      // ateşleme grubu (üstte)
      blob(-16, -66, 32, 14, 5, dark);          // fuze gövdesi
      // kaşık (lever): pin çekilince yukarı açılır
      ctx.save();
      ctx.translate(14, -62);
      ctx.rotate(-leverK * 1.9);
      blob(0, -8, 52, 13, 6, k.rgba('panel2'));
      ctx.restore();
      // pim halkası: pin öncesi yerinde, sonrası fırlar
      if (dp < 0) {
        ctx.strokeStyle = k.rgba('yellow', 0.95); ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(-24, -58, 13, 0, k.TAU); ctx.stroke();
        blob(-38, -62, 16, 9, 4, k.rgba('yellow', 0.95));
      } else if (dp < 0.5) {
        const fk = dp / 0.5;
        const rx2 = -24 - fk * 90, ry = -58 - Math.sin(fk * Math.PI) * 46;
        ctx.save();
        ctx.globalAlpha = 1 - fk * 0.6;
        ctx.translate(rx2, ry); ctx.rotate(fk * 4);
        ctx.strokeStyle = k.rgba('yellow', 0.95); ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(0, 0, 13, 0, k.TAU); ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    // patlama: flaş + parçalar + duman
    if (de >= 0 && de < 1.1) {
      const fk = de < 0.14 ? 1 - de / 0.14 : Math.max(0, 1 - (de - 0.14) / 0.3);
      if (fk > 0) {
        k.glow(0, 0, 90 * fk + 25, 'yellow', 0.6 * fk);
        ctx.fillStyle = k.rgba('yellow', 0.9 * fk);
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * k.TAU + 0.4;
          const L = ((i % 2 === 0 ? 66 : 38) * fk) + 12;
          const bx = Math.cos(a) * L, by = Math.sin(a) * L;
          const px = Math.cos(a + 0.3) * 11, py = Math.sin(a + 0.3) * 11;
          const qx = Math.cos(a - 0.3) * 11, qy = Math.sin(a - 0.3) * 11;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.lineTo(qx, qy); ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = `rgba(255,255,255,${(0.92 * fk).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(0, 0, 17 * fk + 6, 0, k.TAU); ctx.fill();
      }
      // parçalar
      for (let i = 0; i < 10; i++) {
        const h = k.hash(i * 13 + 2), h2 = k.hash(i * 29 + 8);
        const ang = h * k.TAU;
        const rr = de * (130 + h2 * 90);
        const px = Math.cos(ang) * rr, py = Math.sin(ang) * rr * 0.85 - de * 30;
        const sa = Math.max(0, 1 - de / 0.9);
        if (sa > 0) {
          ctx.fillStyle = k.rgba('ink', 0.8 * sa);
          ctx.save();
          ctx.translate(px, py); ctx.rotate(ang + de * 6);
          ctx.fillRect(-5, -2.5, 10, 5);
          ctx.restore();
        }
      }
      // duman
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 17 + 4);
        const sx = (h - 0.5) * 90, sy = -20 - de * 60 - h * 24;
        const sa = Math.max(0, 0.5 - de * 0.42);
        ctx.fillStyle = k.rgba('dim', sa);
        ctx.beginPath(); ctx.arc(sx, sy, 10 + de * 22 + h * 8, 0, k.TAU); ctx.fill();
      }
    }
  },
};
