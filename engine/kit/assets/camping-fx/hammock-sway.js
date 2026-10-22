// camping-fx/hammock-sway — iki direk arası hamak: sürekli yana salınır, kumaş esner.
// NOT: canvas y-aşağıdır; (0,0) hamak kumaşının orta üst noktasıdır.
export default {
  name: 'hammock-sway',
  category: 'camping-fx',
  desc: 'İki direk arası hamak: sürekli yana salınır, kumaşı esneyip yastıkla battaniye taşır',
  tags: ['hamak', 'kamp', 'dinlenme', 'salınım', 'doğa', 'hammock', 'camping', 'rest', 'sway', 'relax'],
  box: [-140, -85, 140, 55],
  bleed: 20,
  anchor: 'hamak kumaş ortası (0,0)',
  points: { left: [-115, -58], right: [115, -58], center: [0, 10] },
  params: {
    color: { type: 'color', default: 'green', desc: 'hamak kumaş tonu' },
    sway: { type: 'number', default: 1, desc: '0–1: salınım genliği' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: sahne büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.size, 0.5, 1.5);
    const A = k.clamp(p.sway, 0, 1);
    const fc = p.color;
    ctx.save();

    const ph = t * 1.35;
    const sx = 11 * A * S * Math.sin(ph);
    const sy = 5 * A * S * Math.sin(ph * 2 + 1.2);
    const sag = (54 + 7 * A * Math.sin(ph + 0.8)) * S;
    const e1x = -88 * S + sx, e2x = 88 * S + sx, ey = -34 * S + sy;
    const cx = sx * 1.2, cy = ey + sag * 1.6;
    // ikinci dereceden bezier noktası
    const B = q => {
      const u = 1 - q;
      return [u * u * e1x + 2 * u * q * cx + q * q * e2x, u * u * ey + 2 * u * q * cy + q * q * ey];
    };
    const Bd = (q, dy) => {
      const u = 1 - q;
      return [u * u * e1x + 2 * u * q * cx + q * q * e2x, u * u * (ey + dy) + 2 * u * q * (cy + dy) + q * q * (ey + dy)];
    };

    // --- direkler ---
    for (let i = 0; i < 2; i++) {
      const px = i === 0 ? -115 * S : 115 * S;
      ctx.fillStyle = k.rgba('dim', 0.12);
      ctx.beginPath(); k.rrect(px - 7 * S + 5 * S, -64 * S + 6 * S, 14 * S, 108 * S, 7 * S); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(px - 7 * S, -64 * S, 14 * S, 108 * S, 7 * S); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4 * S;
      ctx.beginPath(); k.rrect(px - 7 * S, -64 * S, 14 * S, 108 * S, 7 * S); ctx.stroke();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(px - 3 * S, -52 * S, 4 * S, 30 * S, 0, 0, k.TAU); ctx.fill();
      // başlık
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.beginPath(); k.rrect(px - 11 * S, -76 * S, 22 * S, 13 * S, 6 * S); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5 * S;
      ctx.beginPath(); k.rrect(px - 11 * S, -76 * S, 22 * S, 13 * S, 6 * S); ctx.stroke();
    }

    // --- halatlar (serbest çizgi: ink) ---
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4 * S; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-115 * S, -58 * S); ctx.lineTo(e1x, ey); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(115 * S, -58 * S); ctx.lineTo(e2x, ey); ctx.stroke();

    // --- kumaş: üst eğri + alt eğri arası dolgu ---
    ctx.fillStyle = k.rgba(fc, 1);
    ctx.beginPath();
    let pt = B(0); ctx.moveTo(pt[0], pt[1]);
    for (let i = 1; i <= 12; i++) { pt = B(i / 12); ctx.lineTo(pt[0], pt[1]); }
    for (let i = 12; i >= 0; i--) { pt = Bd(i / 12, 20 * S); ctx.lineTo(pt[0], pt[1]); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5 * S; ctx.stroke();
    // üst parlama şeridi
    ctx.strokeStyle = k.rgba('bg', 0.12); ctx.lineWidth = 9 * S;
    ctx.beginPath();
    pt = B(0); ctx.moveTo(pt[0], pt[1] - 5 * S);
    for (let i = 1; i <= 12; i++) { pt = B(i / 12); ctx.lineTo(pt[0], pt[1] - 5 * S); }
    ctx.stroke();
    // alt gölge şeridi
    ctx.strokeStyle = k.rgba(fc, 0.20); ctx.lineWidth = 8 * S;
    ctx.beginPath();
    pt = Bd(0, 18 * S); ctx.moveTo(pt[0], pt[1]);
    for (let i = 1; i <= 12; i++) { pt = Bd(i / 12, 18 * S); ctx.lineTo(pt[0], pt[1]); }
    ctx.stroke();
    // iç dikiş çizgileri (ink, ince)
    ctx.strokeStyle = k.rgba('ink', 0.30); ctx.lineWidth = 3 * S;
    for (const off of [6 * S, 12 * S]) {
      ctx.beginPath();
      pt = Bd(0, off); ctx.moveTo(pt[0], pt[1]);
      for (let i = 1; i <= 12; i++) { pt = Bd(i / 12, off); ctx.lineTo(pt[0], pt[1]); }
      ctx.stroke();
    }

    // --- yastık + battaniye topağı ---
    const pq = B(0.30), lq = B(0.64);
    ctx.fillStyle = k.rgba('panel', 1);
    ctx.beginPath(); k.rrect(pq[0] - 14 * S, pq[1] - 11 * S, 28 * S, 15 * S, 7 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5 * S;
    ctx.beginPath(); k.rrect(pq[0] - 14 * S, pq[1] - 11 * S, 28 * S, 15 * S, 7 * S); ctx.stroke();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(lq[0] - 17 * S, lq[1] - 13 * S, 34 * S, 17 * S, 8 * S); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5 * S;
    ctx.beginPath(); k.rrect(lq[0] - 17 * S, lq[1] - 13 * S, 34 * S, 17 * S, 8 * S); ctx.stroke();

    ctx.restore();
  },
};
