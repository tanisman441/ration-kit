// sports-arena/goal-net-ripple — gol anında topun vurduğu ağın dalgalandığı cepheden kale.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; üst = negatif y.
export default {
  name: 'goal-net-ripple', category: 'sports-arena',
  desc: 'Cepheden futbol kalesi: golde top ağa vurur, file vuruş noktasından yayılan dalgayla kabarır',
  tags: ['kale', 'gol', 'ağ', 'file', 'futbol', 'goal', 'net', 'soccer', 'ripple', 'stadium', 'gol anı'],
  box: [-180, -260, 180, 70],
  bleed: 45,
  anchor: 'kale çizgisi, zemin (0,0); kale ortası',
  points: { impact: [-45, -120], bar: [0, -226], leftPost: [-140, -110], rightPost: [140, -110] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'gol anı: top ağa vurur, dalga yayılır ve söner (~1.2 sn olay)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const frame = k.rgba(p.color);
    const netC = k.rgba('ink', 0.32);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const IX = -45, IY = -120;                     // vuruş noktası
    const d = p.at == null ? -1 : t - p.at;

    // dalga: merkezden yayılan sönümlü radyal itme
    const push = (x, y) => {
      if (d < 0 || d > 1.2) return [0, 0];
      const dx = x - IX, dy = y - IY;
      const r = Math.hypot(dx, dy);
      const env = Math.exp(-d * 3.2) * Math.exp(-r / 95);
      const w = 0.6 + 0.4 * Math.sin(r * 0.10 - d * 24);
      const m = 30 * env * w;
      if (r < 0.001) return [0, m];
      return [(dx / r) * m, (dy / r) * m];
    };

    const bar = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-176, 2); ctx.lineTo(176, 2); ctx.stroke();

    // ağ: idle'da hafif salınır, golde dalgalanır
    const sway = k.noise1(t * 0.8) * 3;
    ctx.save();
    ctx.translate(sway, 0);
    ctx.strokeStyle = netC; ctx.lineWidth = 2.5;
    const X0 = -140, X1 = 140, Y0 = -218, Y1 = 0;
    for (let gx = X0; gx <= X1; gx += 28) {
      ctx.beginPath();
      for (let gy = Y0; gy <= Y1; gy += 14) {
        const q = push(gx, gy);
        if (gy === Y0) ctx.moveTo(gx + q[0], gy + q[1]); else ctx.lineTo(gx + q[0], gy + q[1]);
      }
      ctx.stroke();
    }
    for (let gy = Y0; gy <= Y1; gy += 28) {
      ctx.beginPath();
      for (let gx = X0; gx <= X1; gx += 14) {
        const q = push(gx, gy);
        if (gx === X0) ctx.moveTo(gx + q[0], gy + q[1]); else ctx.lineTo(gx + q[0], gy + q[1]);
      }
      ctx.stroke();
    }
    // derinlik gölgesi: vuruş noktasında çukur hissi
    if (d >= 0 && d < 1.2) {
      const a = Math.exp(-d * 3.2) * 0.35;
      ctx.fillStyle = k.rgba('bg', a);
      ctx.beginPath(); ctx.ellipse(IX, IY, 72 * (1 - d * 0.25), 52 * (1 - d * 0.25), 0, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // top: golde ağa gömülür, ağın üstüne değil içine oturur hissi için file üstünden çizilir
    if (d >= 0) {
      const q = push(IX, IY);
      const bx = IX + sway + q[0], by = IY + q[1];
      const grow = d < 0.15 ? d / 0.15 : 1;
      const br = 22 * (0.4 + 0.6 * grow);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(bx, by, br + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(bx, by, br, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(bx - 7, by - 8, 7, 5, -0.4, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.75);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * k.TAU + 0.5;
        ctx.beginPath(); ctx.arc(bx + Math.cos(a) * br * 0.45, by + Math.sin(a) * br * 0.45, 3.2, 0, k.TAU); ctx.fill();
      }
    }

    // dalga halkaları: vuruş anında yayılır, 0.55 sn'de söner
    if (d > 0 && d < 0.55) {
      for (const off of [0, 0.12]) {
        const dd = d - off;
        if (dd <= 0) continue;
        ctx.strokeStyle = k.rgba('yellow', 0.55 * (1 - d / 0.55));
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(IX + sway, IY, dd * 230, 0, k.TAU); ctx.stroke();
      }
    }

    // direkler + üst direk (ağın üstüne çizilir)
    bar(-148, -234, 16, 242, 8, frame);
    bar(132, -234, 16, 242, 8, frame);
    bar(-156, -234, 312, 16, 8, frame);
    // premium parlama: üst direğin sol üstü
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-120, -228, 34, 5, 0, 0, k.TAU); ctx.fill();
  },
};
