// stage-fx/spotlight-sweep — truss'a asılı dönen sahne spotu.
// Sürekli salınım (6 sn periyot, ±0.5 rad); at anında ışın merkeze kilitlenir
// ve 0.4 sn parlar (yerdeki ışık havuzu da büyür). Boşta lens hafifçe titrer.
// NOT: canvas y-aşağıdır; (0,0) spot gövdesinin asılma noktasıdır.
export default {
  name: 'spotlight-sweep', category: 'stage-fx',
  desc: 'Sağa sola salınan sahne spotu; at anında merkeze kilitlenip parlar',
  tags: ['spot', 'ışık', 'sahne', 'konser', 'ışın', 'spotlight', 'stage', 'beam', 'light', 'show'],
  box: [-210, -190, 210, 150],
  bleed: 30,
  anchor: 'spot gövdesinin truss bağlantı noktası (0,0)',
  points: { mount: [0, -12], lens: [0, 96], pool: [0, 128] },
  params: {
    at: { type: 'time', default: null, desc: 'ışının merkeze kilitlenip parladığı an (0.4 sn flaş)' },
    color: { type: 'color', default: 'yellow', desc: 'ışın + lens rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const lockE = d >= 0 ? k.clamp(1 - d / 0.4, 0, 1) : 0;   // kilitlenme parlaması
    const locking = d >= 0 && d < 0.55;

    // salınım açısı: at anında merkeze yumuşak kilit
    let a = Math.sin(t * k.TAU / 6) * 0.5;
    if (locking) a *= 1 - k.prog(d, 0, 0.15);

    const px = 0, py = -10;                 // pivot (spot gövdesi / lens)
    const L = 165;                          // ışın uzunluğu
    const dx = Math.sin(a), dy = Math.cos(a);
    const ex = px + dx * L, ey = py + dy * L;   // ışının yere değdiği merkez

    // zemin: ışık havuzu (kilitlenince büyür + parlar)
    const poolA = 0.18 + lockE * 0.35 + Math.sin(t * k.TAU / 3) * 0.02;
    ctx.fillStyle = k.rgba('ink', 0.10);
    ctx.beginPath(); ctx.ellipse(0, 138, 150, 14, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(acc, Math.max(0, poolA));
    ctx.beginPath(); ctx.ellipse(ex, 136, 62 + lockE * 34, 13 + lockE * 6, 0, 0, k.TAU); ctx.fill();

    // ışın konisi
    const nx = -dy, ny = dx;                // ışına dik birim vektör
    const w0 = 14, w1 = 64 + lockE * 26;
    const beamA = 0.13 + lockE * 0.30 + Math.sin(t * k.TAU / 2.2) * 0.015;
    ctx.fillStyle = k.rgba(acc, Math.max(0.05, beamA));
    ctx.beginPath();
    ctx.moveTo(px + nx * w0, py + ny * w0);
    ctx.lineTo(ex + nx * w1, ey + ny * w1);
    ctx.lineTo(ex - nx * w1, ey - ny * w1);
    ctx.lineTo(px - nx * w0, py - ny * w0);
    ctx.closePath(); ctx.fill();
    // koni içi ikinci katman (daha parlak çekirdek)
    ctx.fillStyle = k.rgba(acc, Math.max(0, beamA * 0.7));
    ctx.beginPath();
    ctx.moveTo(px + nx * w0 * 0.5, py + ny * w0 * 0.5);
    ctx.lineTo(ex + nx * w1 * 0.55, ey + ny * w1 * 0.55);
    ctx.lineTo(ex - nx * w1 * 0.55, ey - ny * w1 * 0.55);
    ctx.lineTo(px - nx * w0 * 0.5, py - ny * w0 * 0.5);
    ctx.closePath(); ctx.fill();

    // truss çubuğu (üstte sabit)
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-205, -186, 410, 26, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-205, -186, 410, 26, 8); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = -4; i <= 4; i++) {         // truss kafes çizgileri
      ctx.beginPath(); ctx.moveTo(i * 44 - 18, -184); ctx.lineTo(i * 44 + 18, -162); ctx.stroke();
    }

    // asma kelepçe
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, -160); ctx.lineTo(0, -66); ctx.stroke();

    // spot gövdesi (ışınla birlikte döner)
    ctx.save();
    ctx.translate(px, py - 46); ctx.rotate(a * 0.85);
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-30, -34, 60, 88, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-30, -34, 60, 88, 16); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';                       // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-12, -14, 10, 22, -0.3, 0, k.TAU); ctx.fill();
    // lens çerçevesi (vurgu rengi halka)
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.ellipse(0, 56, 26, 13, 0, 0, k.TAU); ctx.fill();
    // lens camı: boşta titrer, kilitte parlar
    const flick = 0.55 + k.noise1(t * 9) * 0.12 + lockE * 0.45;
    ctx.fillStyle = k.rgba(acc, Math.min(1, flick));
    ctx.beginPath(); ctx.ellipse(0, 56, 17, 8, 0, 0, k.TAU); ctx.fill();
    if (lockE > 0.05) k.glow(0, 56, 60, acc, lockE * 0.5);
    // gövde havalandırma çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(-16, -12 + i * 12); ctx.lineTo(16, -12 + i * 12); ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  },
};
