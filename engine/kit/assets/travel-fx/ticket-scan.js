// travel-fx/ticket-scan — tarayıcı direğinde bilet kartı: scan anında ışık kartı süpürür, onay tik'i çıkar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) tarayıcı ile bilet kartının ortasıdır.
export default {
  name: 'ticket-scan', category: 'travel-fx',
  desc: 'Bilet kartı tarayıcıdan geçerken tarama ışığı süpürür, sonunda onay tik’i belirir',
  tags: ['bilet', 'tarama', 'turnike', 'bilet kontrol', 'tarayıcı', 'ticket', 'scan', 'barcode', 'turnstile', 'gate', 'check-in'],
  box: [-150, -85, 150, 85],
  bleed: 14,
  anchor: 'tarayıcı direği ile bilet kartının ortası (0,0)',
  points: { ticket: [35, 0], scanner: [-108, -10], check: [112, 0] },
  params: {
    color: { type: 'color', default: 'ink' },
    scan: { type: 'time', default: null, desc: 'tarama anı (ışık kartı süpürür, onay tik’i çıkar)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkLine = k.rgba('ink', 0.75);
    const shade = (c, f) => { const [r, g, b] = k.col(c); return `rgba(${r * f | 0},${g * f | 0},${b * f | 0},1)`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.scan == null ? -1 : t - p.scan;
    const scanned = d >= 0.9;

    // --- tarayıcı direği (sabit) ---
    const PX = -108;
    ctx.fillStyle = line;                                   // dış hat altı
    ctx.beginPath(); k.rrect(PX - 24, -58, 48, 122, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(PX - 24 + LW / 2, -58 + LW / 2, 48 - LW, 122 - LW, 9); ctx.fill();
    // okuma penceresi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); k.rrect(PX - 14, -40, 28, 44, 8); ctx.fill();
    // LED: taramadan önce yanıp söner, taramadan sonra yeşil sabit
    const ledA = scanned ? 1 : (0.4 + 0.6 * (k.hash(Math.floor(t * 3)) > 0.5 ? 1 : 0.25));
    const ledC = scanned ? 'green' : 'yellow';
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(PX, 22, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(ledC, ledA);
    ctx.beginPath(); ctx.arc(PX, 22, 5.5, 0, k.TAU); ctx.fill();
    if (scanned) k.glow(PX, 22, 14, ledC, 0.35);

    // --- bilet kartı ---
    const sway = d < 0 ? k.noise1(t * 0.9) * 2.2 : 0;          // taramadan önce hafif sallanma
    const rot = d < 0 ? k.noise1(t * 0.7 + 5) * 0.035 : 0;
    ctx.save(); ctx.translate(35, sway); ctx.rotate(rot);
    // gölge (sağ alt, %12 koyu)
    ctx.fillStyle = shade('dim', 0.88);
    ctx.beginPath(); k.rrect(-95 + 6, -50 + 6, 190, 100, 14); ctx.fill();
    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-95, -50, 190, 100, 14); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-95 + LW / 2, -50 + LW / 2, 190 - LW, 100 - LW, 11); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-62, -30, 34, 13, -0.45, 0, k.TAU); ctx.fill();
    // barkod çizgileri (kart zeminine zıt renk: bg)
    const barC = k.rgba('bg', 0.85);
    for (let i = 0; i < 14; i++) {
      const bw = 2 + k.hash(i * 3 + 1) * 5, bx = -78 + i * 8.5;
      ctx.fillStyle = barC;
      ctx.fillRect(bx, -32, bw, 64);
    }
    // yırtılma çizgisi + bilgi satırları
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 3; ctx.strokeStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); ctx.moveTo(48, -44); ctx.lineTo(48, 44); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.fillRect(58, -30, 26, 6); ctx.fillRect(58, -18, 20, 6); ctx.fillRect(58, -6, 24, 6);
    // tarama ışığı: scan anından itibaren kartı yukarıdan aşağı süpürür (0.9 sn)
    if (d >= 0 && d < 0.9) {
      const by = -50 + (d / 0.9) * 100;
      k.glow(0, by, 26, 'green', 0.5);
      ctx.fillStyle = k.rgba('green', 0.85);
      ctx.fillRect(-95, by - 2.5, 190, 5);
    }
    ctx.restore();

    // --- onay tik’i: tarama bitince pop ---
    const pop = d >= 0.9 ? k.E.outBack(k.prog(t, p.scan + 0.9, p.scan + 1.3)) : 0;
    if (pop > 0) {
      ctx.save(); ctx.translate(112, 0); ctx.scale(pop, pop);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('green');
      ctx.beginPath(); ctx.arc(0, 0, 26 - LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-8, -11, 11, 6, -0.5, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.9); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(-11, 1); ctx.lineTo(-3, 9); ctx.lineTo(12, -8); ctx.stroke();
      ctx.restore();
      if (d < 1.9) k.glow(112, 0, 34, 'green', 0.4 * (1 - (d - 0.9) / 1));
    }
  },
};
