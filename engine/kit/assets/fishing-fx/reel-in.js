// fishing-fx/reel-in — olta makarası: kol döner, misina sarılır, balık yaklaşır.
// at anında (1.0 sn) kol hızlı döner, balık sağdan makaraya doğru çekilir;
// idle: kol yavaş döner, misina gergin hafif salınır.
// NOT: canvas y-aşağıdır; (0,0) makara merkezidir, balık sağa bakar.
export default {
  name: 'reel-in', category: 'fishing-fx',
  desc: 'Olta makarası kolu döner, misina sarılır ve balık makaraya çekilir',
  tags: ['makara', 'olta', 'sarma', 'balık', 'misina', 'reel', 'fishing', 'crank', 'wind', 'catch'],
  box: [-140, -90, 140, 90],
  bleed: 20,
  anchor: 'makara merkezi (0,0); balık sağda',
  points: { spool: [0, 0], line_end: [130, 8] },
  params: {
    at: { type: 'time', default: null, desc: 'sarma anı (1.0 sn, kol hızlı döner balık yaklaşır)' },
    color: { type: 'color', default: 'cyan', desc: 'makara göbeği rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // balık konumu: atıştan önce sağda, sarma ile yaklaşır
    let reelProg = 0;
    if (d >= 0 && d < 1.0) { const u = d / 1.0; reelProg = 1 - (1 - u) * (1 - u); }
    else if (d >= 1.0) reelProg = 1;
    const fishX = k.lerp(130, 48, reelProg);
    const fishY = 8 + Math.sin(t * 6) * 2 * (d >= 0 && d < 1.0 ? 1 : 0.4);

    // misina: makaradan balığa (serbest çizgi = ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(34, -2);
    ctx.quadraticCurveTo((34 + fishX) / 2, Math.min(-2, fishY) - 4, fishX - 26, fishY);
    ctx.stroke();

    // balık (küçük, kuyruk çırpar)
    ctx.save();
    ctx.translate(fishX, fishY);
    const wag = Math.sin(t * 9) * 0.12;
    ctx.rotate(wag * 0.4);
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.ellipse(0, 0, 24, 11, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, 24, 11, 0, 0, k.TAU); ctx.stroke();
    // parlama sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(7, -5, 8, 3.5, 0.3, 0, k.TAU); ctx.fill();
    // kuyruk (sağda, makaradan uzak tarafta)
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(34, -9 + Math.sin(t * 9) * 4);
    ctx.lineTo(34, 9 + Math.sin(t * 9) * 4);
    ctx.closePath(); ctx.fill();
    // göz (solda, makaraya dönük)
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); ctx.arc(-12, -3, 2.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // makara ayağı / stand
    ctx.strokeStyle = k.rgba('dim', 0.95); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(0, 78); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 0.95); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-26, 78); ctx.lineTo(26, 78); ctx.stroke();

    // makara gövdesi
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); ctx.arc(0, 0, 36, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 36, 0, k.TAU); ctx.stroke();
    // sağ alt gölge (%12 koyultma hissi)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(10, 16, 20, 12, 0.4, 0, k.TAU); ctx.fill();
    // parlama sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -14, 13, 7, -0.4, 0, k.TAU); ctx.fill();
    // makara göbeği (renkli)
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, k.TAU); ctx.stroke();

    // kol: idle yavaş, sarma anında hızlı döner
    let ang = t * 1.2;
    if (d >= 0 && d < 1.0) ang = t * 1.2 + (d / 1.0) * k.TAU * 3;
    else if (d >= 1.0) ang = t * 1.2 + k.TAU * 3;
    const hx = Math.cos(ang) * 30, hy = Math.sin(ang) * 30;
    ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(hx, hy); ctx.stroke();
    // kol topuzu
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); ctx.arc(hx, hy, 8, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hx, hy, 8, 0, k.TAU); ctx.stroke();
    // merkez pim
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); ctx.arc(0, 0, 5, 0, k.TAU); ctx.fill();

    // sarma parıltısı: misina makaraya dolanırken küçük parıltılar
    if (d >= 0 && d < 1.0) {
      for (let i = 0; i < 3; i++) {
        const h = k.hash(i * 17.3 + Math.floor(t * 12));
        const a = h * k.TAU;
        ctx.fillStyle = k.rgba('yellow', 0.7);
        ctx.beginPath(); ctx.arc(Math.cos(a) * 24, Math.sin(a) * 24, 2, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
