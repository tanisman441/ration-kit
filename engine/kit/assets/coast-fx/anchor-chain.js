// coast-fx/anchor-chain — çapa zinciri; `at` anında zincir iner, çapa suya dalar, sıçrama halkaları yayılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) su yüzeyi (çapanın dalacağı nokta).
export default {
  name: 'anchor-chain', category: 'coast-fx',
  desc: 'Gemiden sarkan çapa zinciri; bırakıldığı anda çapa iner, suya dalar ve sıçrama halkaları yayılır',
  tags: ['çapa', 'zincir', 'gemi', 'deniz', 'demir', 'anchor', 'chain', 'ship', 'sea', 'splash', 'drop'],
  box: [-150, -110, 150, 110],
  bleed: 30,
  anchor: 'su yüzeyi (0,0); zincir üstü y ~-105, çapa dalış sonrası y ~75',
  points: { surface: [0, 0], anchor: [0, 40], ship: [0, -100] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'çapa bırakma anı — zincir iner, çapa suya dalar (1.0 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const dropping = d >= 0 && d < 1.0;
    const env = dropping ? Math.sin(Math.min(d / 1.0, 1) * Math.PI) : 0;
    // çapa yüksekliği: bırakılmadan önce su üstünde asılı, sonra hızla iner ve dibe oturur
    let anchorY;
    if (d < 0) {
      anchorY = -58 + Math.sin(t * 1.1) * 2; // hafif salınım
    } else if (dropping) {
      const s = Math.min(d / 0.85, 1);
      anchorY = k.lerp(-58, 58, s * s);
    } else {
      anchorY = 58 + Math.sin(t * 0.8) * 1.5; // dibe oturmuş, hafif sallanır
    }
    const splashed = d >= 0.85 && d < 1.6;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // gökyüzü + gemi bordası (üstte)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-150, -110, 300, 26, 6); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-150, -86, 300, 6, 3); ctx.fill();
    // su (alt yarı)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-150, 0, 300, 110, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const wy = 22 + i * 26;
      ctx.beginPath();
      for (let x = -140; x <= 140; x += 14) {
        const yy = wy + Math.sin(x * 0.05 + t * 1.1 + i * 1.9) * 2.5;
        if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    // su yüzeyi çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(150, 0); ctx.stroke();

    // zincir: üstten çapaya kadar halka halka (çapa inerken uzar)
    const chainTop = -84;
    const chainBottom = anchorY - 26;
    const links = Math.max(2, Math.floor((chainBottom - chainTop) / 11));
    for (let i = 0; i < links; i++) {
      const ly = chainTop + i * 11 + 5;
      const sway = Math.sin(t * 1.1 + i * 0.4) * (d < 0 ? 1.2 : 0.4);
      ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(sway, ly, 5, 7, (i % 2 === 0 ? 0.5 : -0.5), 0, k.TAU); ctx.stroke();
    }

    // sıçrama: çapa suya değdiği an halkalar + damlalar
    if (splashed) {
      const sd = d - 0.85;
      for (let i = 0; i < 3; i++) {
        const prog = k.clamp((sd - i * 0.12) / 0.55, 0, 1);
        if (prog <= 0) continue;
        ctx.strokeStyle = k.rgba('bg', 0.7 * (1 - prog));
        ctx.lineWidth = 4 * (1 - prog * 0.5);
        ctx.beginPath(); ctx.ellipse(0, 2, 12 + prog * 58, 4 + prog * 10, 0, 0, k.TAU); ctx.stroke();
      }
      for (let i = 0; i < 6; i++) {
        const prog = k.clamp(sd / 0.5 - k.hash(i) * 0.3, 0, 1);
        if (prog <= 0 || prog >= 1) continue;
        const dx = (k.hash(i + 10) - 0.5) * 60 * prog;
        const dy = -prog * (18 + k.hash(i + 20) * 22) + prog * prog * 30;
        ctx.fillStyle = k.rgba('bg', 0.8 * (1 - prog));
        ctx.beginPath(); ctx.arc(dx, dy, 3, 0, k.TAU); ctx.fill();
      }
      k.glow(0, 4, 30, 'cyan', 0.3 * (1 - sd / 0.75));
    }
    // dalış sonrası kalıcı köpük (yavaşça söner, check karesinde de görünür)
    if (d >= 0.85 && d < 2.6) {
      const fd = (d - 0.85) / 1.75;
      ctx.fillStyle = k.rgba('bg', 0.55 * (1 - fd));
      ctx.beginPath(); ctx.ellipse(0, 3, 52 * (0.7 + 0.3 * fd), 6, 0, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const bx = (k.hash(i + 60) - 0.5) * 90 * (0.6 + 0.4 * fd);
        ctx.fillStyle = k.rgba('bg', 0.7 * (1 - fd));
        ctx.beginPath(); ctx.arc(bx, 2 + k.hash(i + 70) * 6, 2.5 + k.hash(i + 80) * 2, 0, k.TAU); ctx.fill();
      }
    }

    // çapa: şaft + kollar + paletler
    ctx.save();
    ctx.translate(0, anchorY);
    ctx.rotate(dropping ? Math.sin(d * 9) * 0.06 : Math.sin(t * 0.8) * 0.03);
    // şaft
    ctx.strokeStyle = line; ctx.lineWidth = LW + 4;
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, 22); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, 22); ctx.stroke();
    // üst halka
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -30, 7, 0, k.TAU); ctx.stroke();
    // çapraz kol (stock)
    blob(-22, -14, 44, 9, 4, k.rgba('panel2'));
    // kollar (aşağı açılan yay)
    ctx.strokeStyle = line; ctx.lineWidth = LW + 4;
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(-26, 30, -34, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(26, 30, 34, 12); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(-26, 30, -34, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(26, 30, 34, 12); ctx.stroke();
    // palet uçları (fluke)
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(-40, 6); ctx.lineTo(-28, 6); ctx.lineTo(-34, 20); ctx.closePath(); ctx.fill();
    ctx.moveTo(40, 6); ctx.lineTo(28, 6); ctx.lineTo(34, 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.9); ctx.beginPath();
    ctx.moveTo(-37, 8); ctx.lineTo(-29, 8); ctx.lineTo(-33, 17); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(37, 8); ctx.lineTo(29, 8); ctx.lineTo(33, 17); ctx.closePath(); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-3, -12, 3, 12, 0.1, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(8, 24, 10, 3, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // su altı baloncuklar (çapa dibe oturunca)
    if (d >= 0.85) {
      for (let i = 0; i < 5; i++) {
        const cyc = ((t * 0.5 + k.hash(i + 30)) % 1);
        const bx = (k.hash(i) - 0.5) * 50;
        const by = 58 - cyc * 52;
        ctx.fillStyle = k.rgba('bg', 0.5 * (1 - cyc));
        ctx.beginPath(); ctx.arc(bx, by, 2.5 + cyc * 2, 0, k.TAU); ctx.fill();
      }
    }
  },
};
