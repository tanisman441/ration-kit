// karaoke-fx/crowd-sing — birlikte şarkı söyleyen kalabalık; ağızlar ritimle açılıp
// kapanır, gövdeler sallanır. Döngüsel, canlı idle. Karakter oranları STYLE.md'den.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; (0,0) zemindir.
export default {
  name: 'crowd-sing', category: 'karaoke-fx',
  desc: 'Birlikte şarkı söyleyen kalabalık; ağızlar ritimle açılıp kapanır, gövdeler sallanır',
  tags: ['kalabalık', 'şarkı', 'sing', 'karaoke', 'koro', 'ağız', 'sallanma', 'crowd', 'choir', 'singing', 'fans'],
  box: [-260, -210, 260, 12],
  bleed: 24,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -185] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'gövde rengi' },
    count: { type: 'number', default: 5, desc: 'kişi sayısı 4–6' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.8))).join(',')})`;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const n = Math.max(4, Math.min(6, Math.round(p.count)));

    const fig = (cx, s, seed) => {
      // ritim: ağız açılıp kapanır (~1.1 sn periyot, kişi başı faz farkı)
      const ph = t * k.TAU / 1.1 + seed * 1.9;
      const mouth = 0.25 + 0.75 * Math.max(0, Math.sin(ph));
      const sw = Math.sin(ph * 0.5) * 7;                 // yanal salınım
      const bounce = Math.abs(Math.sin(ph * 0.5)) * 4;    // hafif zıplama
      const xx = cx + sw;
      const yy = -bounce;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      // zemin gölgesi
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, 4, 30 * s, 7 * s, 0, 0, k.TAU); ctx.fill();
      // bacaklar
      ctx.strokeStyle = line; ctx.lineWidth = 15 * s + LW;
      ctx.beginPath(); ctx.moveTo(xx - 8 * s, yy - 72 * s); ctx.lineTo(xx - 8 * s, yy - 4 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xx + 8 * s, yy - 72 * s); ctx.lineTo(xx + 8 * s, yy - 4 * s); ctx.stroke();
      ctx.strokeStyle = tone; ctx.lineWidth = 15 * s;
      ctx.beginPath(); ctx.moveTo(xx - 8 * s, yy - 72 * s); ctx.lineTo(xx - 8 * s, yy - 4 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xx + 8 * s, yy - 72 * s); ctx.lineTo(xx + 8 * s, yy - 4 * s); ctx.stroke();
      // gövde (rrect)
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(xx - 21 * s - LW / 2, yy - 138 * s - LW / 2, 42 * s + LW, 70 * s + LW, 14 * s); ctx.fill();
      ctx.fillStyle = tone;
      ctx.beginPath(); k.rrect(xx - 21 * s, yy - 138 * s, 42 * s, 70 * s, 14 * s); ctx.fill();
      // sağ alt gölge + sol üst parlama
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); k.rrect(xx + 8 * s, yy - 100 * s, 11 * s, 30 * s, 5 * s); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); k.rrect(xx - 17 * s, yy - 132 * s, 8 * s, 40 * s, 4 * s); ctx.fill();
      // kollar: yukarı kalkık, şarkıya eşlik eder
      const armSwing = Math.sin(ph * 0.5) * 6 * s;
      const handY = yy - 196 * s + armSwing;
      ctx.strokeStyle = line; ctx.lineWidth = 13 * s + LW;
      ctx.beginPath(); ctx.moveTo(xx - 20 * s, yy - 128 * s); ctx.lineTo(xx - 34 * s, handY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xx + 20 * s, yy - 128 * s); ctx.lineTo(xx + 34 * s, handY); ctx.stroke();
      ctx.strokeStyle = tone; ctx.lineWidth = 13 * s;
      ctx.beginPath(); ctx.moveTo(xx - 20 * s, yy - 128 * s); ctx.lineTo(xx - 34 * s, handY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xx + 20 * s, yy - 128 * s); ctx.lineTo(xx + 34 * s, handY); ctx.stroke();
      // baş (STYLE.md: baş genişliğinin 0.92'si yükseklik)
      const hy = yy - 158 * s;
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(xx, hy, 21 * s + LW / 2, 19 * s + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = tone;
      ctx.beginPath(); ctx.ellipse(xx, hy, 21 * s, 19 * s, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(xx - 7 * s, hy - 7 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
      // gözler: kapalı yay (şarkı söylerken gözler kısık)
      ctx.strokeStyle = inkC; ctx.lineWidth = 3.2 * s;
      for (const sd of [-1, 1]) {
        ctx.beginPath(); ctx.arc(xx + sd * 9 * s, hy - 2 * s, 4.5 * s, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      }
      // ağız: ritimle açılıp kapanan oval
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.ellipse(xx, hy + 9 * s, 5 * s, (2 + 7 * mouth) * s, 0, 0, k.TAU); ctx.fill();
      // ağızdan çıkan nota (ağız açıkken belirir, yükselir)
      if (mouth > 0.6) {
        const np = (mouth - 0.6) / 0.4;
        const nx = xx + 26 * s, ny = hy - 14 * s - np * 26 * s;
        ctx.fillStyle = k.rgba('accent', 0.9 * (1 - np * 0.5));
        ctx.beginPath(); ctx.ellipse(nx, ny, 5 * s, 4 * s, -0.3, 0, k.TAU); ctx.fill();
        ctx.fillRect(nx + 4 * s, ny - 12 * s, 2.5 * s, 12 * s);
      }
    };

    const w = Math.min(460, n * 92);
    for (let i = 0; i < n; i++) {
      const cx = n === 1 ? 0 : -w / 2 + (w * i) / (n - 1) + (k.hash((i + 1) * 13) - 0.5) * 14;
      const s = 0.9 + k.hash((i + 1) * 29) * 0.2;
      fig(cx, s, i + 1);
    }
    ctx.restore();
  },
};
