// water-fx-2/tidal-surge — gelgit dalgası: geniş su bandı hafifçe dalgalanır (idle);
// surge anında köpüklü bir kabartı soldan sağa süpürür (1.4 sn), su seviyesi yükselir.
// NOT: canvas y-aşağıdır; (0,0) deniz bandının ortasıdır.
export default {
  name: 'tidal-surge', category: 'water-fx-2',
  desc: 'Gelgit: dalgalanan deniz bandı, surge anında köpüklü dalga duvarı süpürür',
  tags: ['gelgit', 'tidal', 'dalga', 'deniz', 'surge', 'kıyı', 'wave', 'tide', 'sea', 'su seviyesi'],
  box: [-175, -105, 175, 75],
  bleed: 50,
  anchor: 'deniz bandının ortası (0,0)',
  points: { crest: [0, -85], level: [0, 40], shore: [-150, 40] },
  params: {
    surge: { type: 'time', default: null, desc: 'dalganın süpürdüğü an (1.4 sn; köpüklü duvar soldan sağa)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.surge == null ? -1 : t - p.surge;
    const acc = p.color;
    ctx.save();

    // Süpürme ilerlemesi: surge yoksa sakin
    const g = d < 0 ? -1 : k.prog(d, 0, 1.4);
    const wallW = 85;
    const cx = -90 + g * 180; // duvar merkezi x (duvar hep box içinde kalır)
    const crestH = g < 0 ? 0 : Math.sin(Math.PI * k.clamp(g, 0, 1)) * 85;
    const rise = g < 0 ? 0 : k.prog(d, 0, 0.5) * (1 - k.prog(d, 0.9, 1.4)) * 22;

    // Deniz bandı: iki katmanlı dalgalı yüzey
    const surfY = 18 - rise;
    ctx.fillStyle = k.rgba(acc, 0.55);
    ctx.beginPath();
    ctx.moveTo(-175, surfY);
    for (let x = -175; x <= 175; x += 10) {
      ctx.lineTo(x, surfY + Math.sin(x * 0.07 + t * 2.6) * 4 + Math.sin(x * 0.19 - t * 1.4) * 2);
    }
    ctx.lineTo(175, 75); ctx.lineTo(-175, 75);
    ctx.closePath(); ctx.fill();
    // üst ışık katmanı
    ctx.fillStyle = k.rgba(acc, 0.4);
    ctx.beginPath();
    ctx.moveTo(-175, surfY + 2);
    for (let x = -175; x <= 175; x += 10) {
      ctx.lineTo(x, surfY + 2 + Math.sin(x * 0.09 + t * 3.1 + 1.3) * 3.5);
    }
    ctx.lineTo(175, surfY + 14); ctx.lineTo(-175, surfY + 14);
    ctx.closePath(); ctx.fill();
    // premium finish: sol üst parlama (su yüzeyi; dalga duvarı yakınken solar)
    const hide = g < 0 ? 0 : 1 - k.clamp(Math.abs(cx + 95) / 120, 0, 1);
    ctx.fillStyle = 'rgba(255,255,255,' + (0.1 * (1 - hide)).toFixed(3) + ')';
    ctx.beginPath(); ctx.ellipse(-95, surfY + 6, 58, 9, -0.15, 0, k.TAU); ctx.fill();

    // Süpüren dalga duvarı
    if (crestH > 3) {
      // duvar gövdesi
      ctx.fillStyle = k.rgba(acc, 0.85);
      ctx.beginPath();
      ctx.moveTo(cx - wallW, surfY + 6);
      ctx.quadraticCurveTo(cx - wallW * 0.55, surfY - crestH * 0.9, cx - wallW * 0.1, surfY - crestH);
      ctx.quadraticCurveTo(cx + wallW * 0.35, surfY - crestH * 1.02, cx + wallW * 0.5, surfY - crestH * 0.55);
      ctx.quadraticCurveTo(cx + wallW * 0.7, surfY - crestH * 0.2, cx + wallW, surfY + 6);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
      // köpük tacı — kıpırdayan benekler
      for (let i = 0; i < 12; i++) {
        const seed = i * 53 + 11;
        const fx = cx - wallW * 0.35 + k.hash(seed) * wallW * 0.8;
        const fy = surfY - crestH * (0.75 + k.hash(seed + 1) * 0.3) + Math.sin(t * 6 + seed) * 3;
        ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + k.hash(seed + 2) * 0.4).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(fx, fy, 4 + k.hash(seed + 3) * 7, 0, k.TAU); ctx.fill();
      }
      // geride kalan sprey (sola, box içinde)
      const sprayN = 10;
      for (let i = 0; i < sprayN; i++) {
        const seed = i * 31 + 41;
        const behind = k.prog(d, 0, 1.4);
        const sx = cx - 40 - k.hash(seed) * behind * 60;
        const sy = surfY - k.hash(seed + 1) * crestH * 0.8 - behind * 30;
        ctx.fillStyle = k.rgba(acc, 0.6 * (1 - behind));
        ctx.beginPath(); ctx.arc(sx, sy, 2 + k.hash(seed + 2) * 3, 0, k.TAU); ctx.fill();
      }
      // sağ alt gölge duvar altında
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath(); ctx.ellipse(cx + 60, surfY + 10, 44, 10, 0.15, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
