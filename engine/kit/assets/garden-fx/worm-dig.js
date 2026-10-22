// garden-fx/worm-dig — solucan toprağı kazar: çıkar, sallanır, dalar, toprak püskürür (döngülü).
// NOT: canvas y-aşağıdır; toprak yüzeyi y=40, solucan yüzeye gömülüp çıkar.
export default {
  name: 'worm-dig', category: 'garden-fx',
  desc: 'Toprak kazan solucan: yüzeye çıkar, sallanır, toprağa dalar; her dalışta toprak püskürür',
  tags: ['solucan', 'toprak', 'kazma', 'bahçe', 'worm', 'digging', 'soil', 'earthworm', 'garden', 'toprak kazma'],
  box: [-120, -70, 120, 100],
  bleed: 22,
  anchor: 'toprak yüzeyi merkezi (0,40)',
  points: { mound: [10, 40] },
  params: {
    color: { type: 'color', default: 'red', desc: 'solucan rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    const C = 3.2, ct = t % C, ph = ct / C;

    // toprak gövdesi
    ctx.fillStyle = line; k.rrect(-123, 37, 246, 66, 14); ctx.fill();
    ctx.fillStyle = darker('dim'); k.rrect(-123 + 5, 37 + 6, 246, 66, 14); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); k.rrect(-120, 40, 240, 60, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.ellipse(-50, 48, 70, 5, -0.05, 0, k.TAU); ctx.fill();
    // toprak benekleri (sabit)
    ctx.fillStyle = k.rgba('ink', 0.28);
    for (let i = 0; i < 26; i++) {
      const x = -112 + k.hash(i * 3.7) * 224, y = 52 + k.hash(i * 9.1) * 40;
      ctx.beginPath(); ctx.arc(x, y, 1.6 + k.hash(i * 5.3) * 2, 0, k.TAU); ctx.fill();
    }

    // kazı höyüğü
    ctx.fillStyle = darker('dim');
    ctx.beginPath(); ctx.ellipse(12, 40, 50, 13, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(10, 37, 50, 13, 0, 0, k.TAU); ctx.fill();

    // kafa konumu (döngü: çık → sallan → dal → dinlen)
    const ease = x => 1 - Math.pow(1 - x, 3);
    let hx, hy;
    if (ph < 0.3) { const g = ease(ph / 0.3); hx = 28; hy = 44 - 56 * g; }
    else if (ph < 0.55) { const g = (ph - 0.3) / 0.25; hx = 28 + 24 * Math.sin(g * Math.PI * 2); hy = -12 + 6 * Math.sin(g * Math.PI * 3); }
    else if (ph < 0.85) { const g = ease((ph - 0.55) / 0.3); hx = 28 - 22 * g; hy = -12 + 70 * g * g; }
    else { hx = 6; hy = 58; }
    const diving = ph >= 0.5 && ph < 0.9, emerging = ph < 0.35;

    // delik (kafa topraktayken)
    if (hy > 30) {
      ctx.fillStyle = k.rgba('bg', 0.65);
      ctx.beginPath(); ctx.ellipse(hx, 40, 13, 6, 0, 0, k.TAU); ctx.fill();
    }

    // solucan gövdesi: kuyruk sabit, kafa animasyonlu (bezier omurga)
    const tx = -58, ty = 36, mx = (tx + hx) / 2 + 10, my = (ty + hy) / 2 - 14;
    const seg = (u, r) => {
      const x = (1 - u) * (1 - u) * tx + 2 * (1 - u) * u * mx + u * u * hx;
      const y = (1 - u) * (1 - u) * ty + 2 * (1 - u) * u * my + u * u * hy;
      return [x, y, r];
    };
    const N = 10;
    for (let i = N - 1; i >= 0; i--) {
      const u = i / (N - 1);
      let r = (5.5 + 4 * Math.sin(Math.PI * u)) * (1 + 0.13 * Math.sin(t * 11 - i * 0.85));
      const [x, y] = seg(u, r);
      if (y > 42) continue; // toprağın altında: görünmez
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + 2.6, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darker(p.color); ctx.beginPath(); ctx.arc(x + 3, y + 4, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 0.96); ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (i === 0) { // kafa: parlama + minik ağız çizgisi
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.3, y - r * 0.38, r * 0.4, r * 0.24, -0.45, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y + r * 0.3, r * 0.4, 0.3, Math.PI - 0.3); ctx.stroke();
      }
    }

    // toprak püskürmesi (çıkış + dalış anlarında)
    const puff = (x, y, r, alpha) => {
      ctx.fillStyle = k.rgba('dim', alpha);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };
    for (let j = 0; j < 9; j++) {
      const h1 = k.hash(j * 7.9 + 11), h2 = k.hash(j * 3.4 + 12), h3 = k.hash(j * 5.6 + 13);
      const windows = [h1 * 0.3, 1.7 + h2 * 0.3]; // çıkış ve dalış pencereleri (sn)
      for (const w0 of windows) {
        const age = ct - w0;
        if (age < 0 || age > 0.55) continue;
        const f = age / 0.55;
        const px = hx + (h3 - 0.5) * 130 * f, py = 38 - (30 + h1 * 55) * f + 60 * f * f;
        puff(px, py, (2.5 + h1 * 3) * (1 - f * 0.5), 0.85 * (1 - f));
      }
    }
    void diving; void emerging;
  },
};
