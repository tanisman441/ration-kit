// pet-fx/tail-chase — kendi kuyruğunu kovalayan köpek; catch anında yakalar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) zemindir, dönüş merkezi (0,-120)'dedir.
export default {
  name: 'tail-chase', category: 'pet-fx',
  desc: 'Daire çizerek kendi kuyruğunu kovalayan köpek; catch anında durup kuyruğu ısırır',
  tags: ['köpek', 'evcil hayvan', 'kuyruk', 'kovalama', 'dönme', 'oyun', 'dog', 'tail chase', 'pet', 'spin', 'play'],
  box: [-130, -265, 130, 10],
  bleed: 60,
  anchor: 'zemin (0,0); dönüş merkezi (0,-120)',
  points: { centre: [0, -120], tail: [0, -186], head: [0, -186] },
  params: {
    color: { type: 'color', default: 'dim' },
    catch: { type: 'time', default: null, desc: 'kuyruğu yakalama — dönüş durur, kafa uzanır, ısırır (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const R = 62, cx = 0, cyy = -120;
    const dc = p.catch == null ? -1 : t - p.catch;
    const catching = dc >= 0 && dc < 0.9;
    const spin = p.catch == null ? t * 2.8 : (dc < 0 ? t * 2.8 : p.catch * 2.8); // yakalayınca donar
    const ph = 2.2;                                   // kafa açısı (çerçevede sabit)
    const pt = ph + 0.7;                              // kuyruk açısı (kafanın önünde)
    const lunge = catching ? Math.sin(Math.min(dc / 0.9, 1) * Math.PI) : 0; // uzanma zarfı
    const snap = catching && dc > 0.4 ? 1 : 0;        // ısırma
    const jawOpen = catching ? (dc < 0.4 ? dc / 0.4 : Math.max(1 - (dc - 0.4) / 0.25, 0)) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

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
    ctx.beginPath(); ctx.ellipse(0, -4, 92, 11, 0, 0, k.TAU); ctx.fill();

    // dönüş hız çizgileri (halka etrafında)
    if (!catching) {
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const a0 = spin * 1.0 + i * 2.1 + 0.6;
        ctx.beginPath(); ctx.arc(cx, cyy, R + 34, a0, a0 + 0.7); ctx.stroke();
      }
    }

    ctx.save();
    ctx.translate(cx, cyy);
    ctx.rotate(spin);

    // gövde: yay boyunca kalın bant
    ctx.strokeStyle = line; ctx.lineWidth = 46 + LW;
    ctx.beginPath(); ctx.arc(0, 0, R, ph - 2.3, ph + 0.18); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 46;
    ctx.beginPath(); ctx.arc(0, 0, R, ph - 2.3, ph + 0.18); ctx.stroke();

    // bacaklar: koşma döngüsü
    const run = Math.sin(spin * 3);
    const legA = [ph - 0.7, ph - 1.2, ph - 1.7, ph - 2.1];
    for (let i = 0; i < 4; i++) {
      const la = legA[i], out = i % 2 === 0 ? 1 : -1;
      const bx = Math.cos(la) * R, by = Math.sin(la) * R;
      const ex = Math.cos(la) * (R + out * (26 + run * (i % 2 ? 8 : -8)));
      const ey = Math.sin(la) * (R + out * (26 + run * (i % 2 ? 8 : -8)));
      limb(bx, by, ex, ey, 12, body);
      disc(ex, ey, 9, 7, body);
    }

    // kuyruk: hızlı sallanma (hedef) — kısa, kıvrık iki parça
    const tbA = pt + 0.12;
    const tbx = Math.cos(tbA) * R, tby = Math.sin(tbA) * R;
    const wag = Math.sin(t * (catching ? 26 : 18)) * (catching && snap ? 0.15 : 0.5);
    const midA = tbA + 0.75 + wag * 0.35, endA = tbA + 1.15 + wag * 0.6;
    const midx = Math.cos(midA) * (R + 18), midy = Math.sin(midA) * (R + 18);
    const wiggle = catching && snap ? Math.sin(dc * 30) * 4 : 0;
    const tipx = Math.cos(endA) * (R + 30) + wiggle, tipy = Math.sin(endA) * (R + 30) + wiggle;
    limb(tbx, tby, midx, midy, 12, body);
    limb(midx, midy, tipx, tipy, 10, body);
    disc(tipx, tipy, 8, 8, body);

    // kafa: kuyruğa doğru bakar; yakalarken uzanır
    const ha = ph + lunge * 0.42;
    const hxp = Math.cos(ha) * (R + lunge * 14), hyp = Math.sin(ha) * (R + lunge * 14);
    ctx.save();
    ctx.translate(hxp, hyp);
    ctx.rotate(ha + Math.PI / 2 - lunge * 0.5);
    // kulak
    ctx.save(); ctx.translate(-8, -18); ctx.rotate(-0.4);
    disc(0, -10, 9, 13, body); ctx.restore();
    // kafa
    disc(0, 0, 27, 25, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -11, 9, 6, -0.4, 0, k.TAU); ctx.fill();
    // burun (kuyruğa dönük)
    disc(22, -4, 13, 11, body);
    disc(33, -4, 5.5, 5, inkC);
    // göz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(2, -9, 4.2, 4.2, 0, 0, k.TAU); ctx.fill();
    // ağız: yakalarken açılır sonra kapanır
    if (catching) {
      ctx.fillStyle = k.rgba('bg', 0.8);
      ctx.beginPath(); ctx.ellipse(20, 8, 9, 3 + jawOpen * 9, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('red');
      ctx.beginPath(); ctx.ellipse(20, 8 + jawOpen * 5, 5, 2 + jawOpen * 5, 0, 0, k.TAU); ctx.fill();
    } else {
      ctx.strokeStyle = inkC; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(18, 6, 6, 0.3, Math.PI - 0.3); ctx.stroke();
    }
    ctx.restore();

    // yakalama yıldızları (kuyruk ucunda)
    if (catching && dc > 0.35) {
      const sA = Math.min((dc - 0.35) / 0.55, 1);
      for (let i = 0; i < 5; i++) {
        const a = k.hash(i * 13 + 2) * k.TAU;
        const rr = 30 + sA * 44;
        const sx = tipx + Math.cos(a) * rr;
        const sy = tipy + Math.sin(a) * rr;
        ctx.fillStyle = k.rgba('yellow', 0.85 * (1 - sA));
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(a + dc * 8);
        ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(3, -3); ctx.lineTo(8, 0);
        ctx.lineTo(3, 3); ctx.lineTo(0, 8); ctx.lineTo(-3, 3);
        ctx.lineTo(-8, 0); ctx.lineTo(-3, -3); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  },
};
