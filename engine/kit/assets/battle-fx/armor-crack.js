// battle-fx/armor-crack — zırh çatlağı: kalkan plaka darbe noktasından çatlar, parçalar fırlatır.
// NOT: canvas y-aşağıdır; (0,0) plakanın merkezi ve çatlağın çıktığı darbe noktasıdır.
export default {
  name: 'armor-crack',
  category: 'battle-fx',
  desc: 'Zırh çatlağı: darbe anında kalkan plakadan yayılan çatlaklar ve fırlayan zırh parçaları',
  tags: ['zırh', 'kalkan', 'çatlak', 'kırılma', 'darbe', 'armor', 'shield', 'crack', 'break'],
  box: [-160, -140, 160, 140],
  bleed: 60,
  anchor: 'plakanın merkezi (0,0)',
  points: { impact: [0, 0], top: [0, -95], rim: [105, 0] },
  params: {
    hit: { type: 'time', default: null, desc: 'çarpma anı (0.9 sn: çatlaklar yayılır + parçalar fırlar)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: zırh büyüklüğü' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const d = p.hit == null ? -1 : t - p.hit;
    const S = k.clamp(p.size, 0.5, 1.5);
    const W = 210 * S, H = 190 * S;
    ctx.save();

    // --- zırh plaka gövdesi (her zaman çizilir) ---
    // sağ alt %12 gölge
    ctx.fillStyle = k.rgba(p.color, 0.12);
    ctx.beginPath(); k.rrect(-W / 2 + 7, -H / 2 + 8, W, H, 34 * S); ctx.fill();
    // ana gövde
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, 34 * S); ctx.fill();
    // dış hat: bg 0.55 alfa
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 7 * S;
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, 34 * S); ctx.stroke();
    // sol üst parlama (premium finish, alfa 0.11)
    ctx.fillStyle = k.rgba('bg', 0.11);
    ctx.beginPath();
    ctx.ellipse(-W * 0.22, -H * 0.28, W * 0.24, H * 0.13, -0.5, 0, k.TAU);
    ctx.fill();
    // iç kenar: perçinler
    for (let i = 0; i < 6; i++) {
      const hx = k.hash(i * 3 + 7), hy = k.hash(i * 5 + 9);
      const px = (hx - 0.5) * (W - 52 * S), py = (hy - 0.5) * (H - 52 * S);
      ctx.fillStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); ctx.arc(px, py, 5 * S, 0, k.TAU); ctx.fill();
    }

    // --- idle: darbe noktası öncesi hafif parlama nabzı ---
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
      ctx.fillStyle = k.rgba('bg', 0.08 + 0.05 * pulse);
      ctx.beginPath();
      ctx.ellipse(0, 0, 44 * S, 30 * S, 0, 0, k.TAU);
      ctx.fill();
      ctx.restore();
      return;
    }
    // efekt bittikten sonra çatlaklar kalıcı kalır
    if (d > 1.4) { cracksAt(10); ctx.restore(); return; }

    // --- darbe çakması (0.15 sn) ---
    if (d < 0.15) {
      const f = 1 - d / 0.15;
      k.glow(0, 0, 60 * S * f, 'yellow', 0.5 * f);
    }

    // --- çatlaklar: 7 jagged çizgi, 0.05–0.6 sn arasında uzar ---
    function cracksAt(dd) {
      ctx.strokeStyle = k.rgba('bg', 0.85);
      ctx.lineCap = 'round';
      for (let i = 0; i < 7; i++) {
        const start = 0.05 + k.hash(i * 11 + 21) * 0.25;
        const g = k.prog(dd, start, start + 0.4);
        if (g <= 0) continue;
        const a = k.hash(i * 17 + 23) * k.TAU;
        const len = (95 + k.hash(i * 19 + 29) * 70) * S * k.E.outCubic(g);
        ctx.lineWidth = (6.5 * (1 - g * 0.5) + 1.5) * S;
        ctx.beginPath();
        let px = Math.cos(a) * 10 * S, py = Math.sin(a) * 10 * S;
        ctx.moveTo(px, py);
        const segs = 5;
        for (let sIdx = 1; sIdx <= segs; sIdx++) {
          const ja = a + (k.hash(i * 31 + sIdx * 7 + 37) - 0.5) * 0.9;
          const jx = px + Math.cos(ja) * (len / segs) * 0.9;
          const jy = py + Math.sin(ja) * (len / segs) * 0.9;
          ctx.lineTo(jx, jy);
          px = jx; py = jy;
        }
        ctx.stroke();
      }
    }
    // efekt bittikten sonra çatlaklar kalıcı kalır
    if (d > 1.4) { cracksAt(10); ctx.restore(); return; }
    cracksAt(d);

    // --- fırlayan parçalar: 8 zırh parçası, 0.2–1.1 sn ---
    const fg = k.prog(d, 0.2, 1.1);
    for (let i = 0; i < 8; i++) {
      const h1 = k.hash(i * 13 + 41), h2 = k.hash(i * 17 + 43);
      const a = h1 * k.TAU;
      const e = k.E.outCubic(fg);
      const dist = (30 + h2 * 105) * S * e;
      const x = Math.cos(a) * dist + k.noise1(i * 3 + d * 5) * 5;
      const y = Math.sin(a) * dist + k.noise1(i * 7 + d * 5) * 5 + e * e * 60 * S; // hafif yerçekimi
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + d * (3 + h1 * 5));
      const sz = (8 + h2 * 10) * S;
      ctx.fillStyle = k.rgba(p.color, 0.95 * (1 - fg));
      ctx.strokeStyle = k.rgba('bg', 0.55 * (1 - fg));
      ctx.lineWidth = 3 * S;
      ctx.beginPath(); k.rrect(-sz / 2, -sz / 2, sz, sz * 0.75, 4 * S); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // --- toz bulutu ---
    for (let i = 0; i < 9; i++) {
      const h1 = k.hash(i * 23 + 51), h2 = k.hash(i * 29 + 53);
      const a = h2 * k.TAU;
      const dist = (24 + h1 * 80) * S * k.E.outCubic(Math.min(fg * 1.1, 1));
      ctx.fillStyle = k.rgba('ink', 0.3 * (1 - fg));
      ctx.beginPath();
      ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, (3 + h2 * 5) * S, 0, k.TAU);
      ctx.fill();
    }
    ctx.restore();
  },
};
