// travel-fx/boarding-pass-pop — biniş kartı: at anında aşağıdan pop ile girer, QR + yırtılma çizgili.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kartın ortasıdır.
export default {
  name: 'boarding-pass-pop', category: 'travel-fx',
  desc: 'QR kodlu biniş kartı at anında pop animasyonuyla belirir, konfeti saçar, sonra hafifçe salınır',
  tags: ['biniş kartı', 'uçuş', 'QR', 'bilet', 'check-in', 'havayolu', 'boarding pass', 'flight', 'QR code', 'ticket', 'airline', 'departure'],
  box: [-130, -100, 130, 100],
  bleed: 20,
  anchor: 'kartın ortası (0,0)',
  points: { top: [0, -80], qr: [34, 53], stub: [-70, 20] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: 0, desc: 'kartın giriş anı (pop animasyonu + konfeti)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkLine = k.rgba('ink', 0.75);
    const shade = (c, f) => { const [r, g, b] = k.col(c); return `rgba(${r * f | 0},${g * f | 0},${b * f | 0},1)`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const e = k.E.outBack(k.prog(t, p.at, p.at + 0.55));       // pop ölçeği
    if (e <= 0) return;
    const rise = (1 - k.E.outCubic(k.prog(t, p.at, p.at + 0.55))) * 40;  // aşağıdan yukarı giriş
    const bob = t > p.at + 0.55 ? Math.sin((t - p.at) * 2.1) * 2.4 : 0;  // giri sonrası canlı salınım

    ctx.save(); ctx.translate(0, rise + bob); ctx.scale(e, e); ctx.rotate(Math.sin(t * 1.2) * 0.008);

    // gölge (sağ alt)
    ctx.fillStyle = shade('dim', 0.88);
    ctx.beginPath(); k.rrect(-72 + 6, -78 + 6, 144, 156, 16); ctx.fill();
    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-72, -78, 144, 156, 16); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-72 + LW / 2, -78 + LW / 2, 144 - LW, 156 - LW, 12); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -56, 28, 12, -0.45, 0, k.TAU); ctx.fill();

    // üst şerit (vurgu)
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); k.rrect(-72 + LW / 2, -78 + LW / 2, 144 - LW, 26, 10); ctx.fill();
    // mini uçak silueti (şeritte)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.save(); ctx.translate(-48, -65); ctx.scale(1.1, 1.1);
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(5, 2); ctx.lineTo(16, 6); ctx.lineTo(16, 9);
    ctx.lineTo(4, 6); ctx.lineTo(0, 10); ctx.lineTo(-2, 6); ctx.lineTo(-12, 8);
    ctx.lineTo(-12, 5); ctx.lineTo(-2, 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.fillRect(-28, -69, 62, 7); ctx.fillRect(-28, -59, 44, 5);

    // bilgi satırları
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.fillRect(-58, -38, 44, 7); ctx.fillRect(-58, -27, 58, 6);
    ctx.fillRect(-58, -16, 38, 6);
    // koltuk/kapı kutucukları
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-58, -2, 30, 20, 6); ctx.fill();
    ctx.beginPath(); k.rrect(-22, -2, 30, 20, 6); ctx.fill();
    ctx.fillStyle = inkLine;
    ctx.fillRect(-52, 4, 18, 8); ctx.fillRect(-16, 4, 18, 8);

    // yırtılma çizgisi
    ctx.setLineDash([7, 6]);
    ctx.lineWidth = 3; ctx.strokeStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); ctx.moveTo(-66, 22); ctx.lineTo(66, 22); ctx.stroke();
    ctx.setLineDash([]);

    // QR kodu (kartın alt sağında; 48x48, kart içine sığar; zeminle zıt renk)
    ctx.save(); ctx.translate(10, 29);
    const N = 8, S = 6;
    const inFinder = (i, j) => (i < 3 && j < 3) || (i < 3 && j > N - 4) || (i > N - 4 && j < 3);
    const finderCenter = (i, j) =>
      (i === 1 && j === 1) || (i === 1 && j === N - 2) || (i === N - 2 && j === 1);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const on = inFinder(i, j) ? !finderCenter(i, j) : k.hash(i * 31 + j * 17 + 4) > 0.52;
      if (on) { ctx.fillStyle = k.rgba('bg', 0.9); ctx.fillRect(i * S, j * S, S - 1, S - 1); }
    }
    ctx.restore();
    // stub tarafı bilgi (sol alt)
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.fillRect(-58, 36, 52, 6); ctx.fillRect(-58, 47, 38, 6);

    ctx.restore();

    // --- konfeti patlaması (pop anı, kart belirdikten hemen sonra) ---
    const d = t - p.at;
    if (d >= 0.05 && d < 0.75) {
      const q = (d - 0.05) / 0.7;
      for (let i = 0; i < 14; i++) {
        const a = k.hash(i * 19 + 7) * k.TAU, dist = 50 + 55 * k.E.outCubic(q);
        const cols = ['accent', 'yellow', 'green'];
        ctx.fillStyle = k.rgba(cols[i % 3], 0.9 * (1 - q));
        ctx.beginPath(); ctx.arc(dist * Math.cos(a), dist * Math.sin(a) - 10, 3 + k.hash(i * 3) * 3, 0, k.TAU); ctx.fill();
      }
    }
  },
};
