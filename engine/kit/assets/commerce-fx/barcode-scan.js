// commerce-fx/barcode-scan — barkod paneli; `at` anında lazer çizgisi tarar, sonunda bip halkaları yayılır.
// NOT: canvas y-aşağıdır. Idle: lazerin hafif nabzı; at olayı ~1.1 sn sürer.
export default {
  name: 'barcode-scan', category: 'commerce-fx',
  desc: 'Barkod paneli üzerinde soldan sağa süpüren lazer çizgisi ve bip halkalarıyla tarama',
  tags: ['barkod', 'tarama', 'lazer', 'bip', 'kasa', 'market', 'barcode', 'scan', 'laser', 'scanner', 'beep', 'checkout'],
  box: [-120, -95, 120, 95],
  bleed: 60,
  anchor: 'panelin merkezi (barkodun ortası)',
  points: { code: [0, 0], beep: [95, -70] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'tarama anı: lazer süpürür (0.5 sn) + bip halkaları (1.1 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const scanning = d >= 0 && d < 0.5;

    // panel
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-106, -66, 212, 132, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-98, -58, 196, 116, 12); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -44, 40, 8, -0.25, 0, k.TAU); ctx.fill();

    // barkod çubukları (deterministik genişlikler)
    let x = -84;
    let i = 0;
    ctx.fillStyle = k.rgba('ink');
    while (x < 80) {
      const w = 3 + k.hash(i * 3.7) * 9;
      const h = 60 + k.hash(i * 9.1) * 24;
      const y0 = -h / 2;
      if (k.hash(i * 5.3) > 0.18) ctx.fillRect(x, y0, w, h);
      x += w + 2 + k.hash(i * 7.7) * 6;
      i++;
    }

    // köşe braketleri (tarayıcı vizörü)
    ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 7;
    const b = 116, bl = 26;
    const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    for (const [sx, sy] of corners) {
      ctx.beginPath();
      ctx.moveTo(sx * b - sx * bl, sy * (b - 14));
      ctx.lineTo(sx * b, sy * (b - 14));
      ctx.lineTo(sx * b, sy * (b - 14) + sy * bl);
      ctx.stroke();
    }

    // lazer çizgisi: idle'da üstte hafif nabız, taramada soldan sağa süpürür
    const lx = scanning ? -84 + k.E.outCubic(k.prog(d, 0, 0.5)) * 168 : -84;
    const pulse = scanning ? 1 : 0.55 + 0.25 * Math.sin(t * k.TAU / 1.6);
    k.glow(lx, 0, 34, p.color, 0.30 * pulse);
    ctx.strokeStyle = k.rgba(p.color, 0.85 * pulse + 0.1);
    ctx.lineWidth = 7 * pulse + 1;
    ctx.beginPath(); ctx.moveTo(lx, -52); ctx.lineTo(lx, 52); ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lx, -52); ctx.lineTo(lx, 52); ctx.stroke();
    // süpürme izi
    if (scanning) {
      const grad = ctx.createLinearGradient(lx, 0, lx - 46, 0);
      grad.addColorStop(0, k.rgba(p.color, 0.28));
      grad.addColorStop(1, k.rgba(p.color, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(lx - 46, -52, 46, 104);
    }

    // bip halkaları (tarama bitince; kontrol karelerinde görünür)
    if (d >= 0.5 && d < 2.0) {
      for (let j = 0; j < 2; j++) {
        const ph = k.prog(d, 0.5 + j * 0.12, 2.0);
        if (ph <= 0 || ph >= 1) continue;
        const r = 12 + k.E.outCubic(ph) * 64;
        ctx.strokeStyle = k.rgba(p.color, 0.75 * (1 - ph));
        ctx.lineWidth = 8 * (1 - ph) + 2;
        ctx.beginPath(); ctx.arc(95, -70, r, 0, k.TAU); ctx.stroke();
      }
      // bip noktası parlaması
      k.glow(95, -70, 26, p.color, 0.5 * (1 - k.prog(d, 0.5, 1.0)));
      ctx.fillStyle = k.rgba(p.color, 1 - 0.4 * k.prog(d, 1.0, 2.0));
      ctx.beginPath(); ctx.arc(95, -70, 9, 0, k.TAU); ctx.fill();
    }
  },
};
