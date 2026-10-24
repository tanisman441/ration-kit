// history-fx/quill-write — tüy kalem + kağıt; write 0→1: mürekkep satır kağıtta ilerler, kalem ucu sallanır.
// NOT: canvas y-aşağıdır; (0,0) = kağıt merkezi.
const LW = 5;
function R(ctx, k, x, y, w, h, r, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
}
export default {
  name: 'quill-write', category: 'history-fx',
  desc: 'Tüy kalemle yazı yazma; write 0→1 mürekkep satırını ilerletir, kalem ucu boşta sallanır',
  tags: ['tüy kalem', 'yazı', 'kağıt', 'tarih', 'mürekkep', 'imza', 'fırça', 'quill', 'writing', 'paper', 'ink', 'history', 'feather'],
  box: [-152, -118, 152, 118],
  bleed: 30,
  anchor: 'kağıt merkezi (0,0)',
  points: { lineend: [75, 25], inkwell: [109, 40] },
  params: {
    write: { type: 'number', default: 0.6, desc: 'yazının ilerlemesi 0–1 (mürekkep satırı soldan sağa)' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const w = k.clamp(p.write, 0, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // arka kağıt (derinlik)
    ctx.save(); ctx.translate(10, -12); ctx.rotate(0.09);
    R(ctx, k, -110, -70, 220, 140, 8, k.rgba('dim', 1));
    ctx.restore();
    // üst kağıt: sağ alt gölge + gövde
    ctx.fillStyle = k.rgba('bg', 0.28);
    ctx.beginPath(); k.rrect(-104, -63, 220, 140, 10); ctx.fill();
    R(ctx, k, -110, -70, 220, 140, 8, k.rgba(p.color, 1));
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -48, 46, 12, -0.15, 0, k.TAU); ctx.fill();

    // mürekkep satırı: (-85,25) → (75,25), dalgalı, write ile ilerler
    const x0 = -85, x1 = 75, yy = 25;
    const wave = x => yy + k.noise1(x * 0.06 + 3.7) * 6;
    const xe = x0 + w * (x1 - x0);
    if (w > 0.001) {
      ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let x = x0; x <= xe; x += 4) {
        const y = wave(x);
        if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // ıslak mürekkep noktası
      ctx.fillStyle = k.rgba('ink', 0.9);
      ctx.beginPath(); ctx.arc(xe, wave(xe), 3.2, 0, k.TAU); ctx.fill();
    }

    // hokka
    R(ctx, k, 92, 30, 34, 36, 8, k.rgba('dim', 1));
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.ellipse(109, 36, 11, 5, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(105, 34.5, 4, 1.8, -0.3, 0, k.TAU); ctx.fill();

    // tüy kalem: ucu yazı ucunda, gövde sağ yukarı; boşta hafif sallanır
    const tipX = xe, tipY = wave(Math.min(xe, x1));
    const wob = k.noise1(t * 1.8) * 0.05;
    const flut = 1 + k.noise1(t * 2.3 + 9) * 0.06;
    ctx.save(); ctx.translate(tipX, tipY); ctx.rotate(-0.15 + wob);
    // kanat (şaftın iki yanında kavisli tüy)
    const P = u => [48 * u, -70 * u];
    const NN = [0.827, 0.567];
    const vw = u => 24 * Math.pow(Math.sin(Math.PI * k.clamp((u - 0.22) / 1.1, 0, 1)), 0.7) * flut;
    ctx.beginPath();
    for (let u = 0.22; u <= 1.001; u += 0.06) {
      const [px, py] = P(u), ww = vw(u);
      const X = px + NN[0] * ww, Y = py + NN[1] * ww;
      if (u === 0.22) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    for (let u = 1; u >= 0.22; u -= 0.06) {
      const [px, py] = P(u), ww = vw(u);
      ctx.lineTo(px - NN[0] * ww, py - NN[1] * ww);
    }
    ctx.closePath();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = k.rgba('dim', 1); ctx.fill();
    // tüy yarıkları (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2;
    for (const u of [0.5, 0.72]) {
      const [px, py] = P(u), ww = vw(u) * 0.7;
      ctx.beginPath();
      ctx.moveTo(px - NN[0] * ww, py - NN[1] * ww);
      ctx.lineTo(px + NN[0] * ww, py + NN[1] * ww);
      ctx.stroke();
    }
    // şaft (serbest çizgi: ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(48, -70); ctx.stroke();
    ctx.restore();
  },
};
