// weapons/bullet — yandan görünüm mermi (çekirdek + kovan), uç sağa bakar.
// flying anında hızla sağa uçar ve arkasında iz bırakır.
// Orijinal tasarım; gerçek mühimmat markası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) mermi merkezidir.
export default {
  name: 'bullet',
  category: 'weapons',
  desc: 'Yandan görünüm mermi; flying anında hızla uçar ve parlak iz bırakır',
  tags: ['mermi', 'bullet', 'fişek', 'ammo', 'ammunition', 'çekirdek', 'kovan', 'ateş', 'FPS'],
  box: [-85, -28, 85, 28],
  bleed: 200,
  anchor: 'mermi merkezi (0,0)',
  points: { tip: [72, 0], base: [-70, 0] },
  params: {
    color: { type: 'color', default: 'yellow' },
    flying: { type: 'time', default: null, desc: 'uçuş başlangıç anı: mermi sağa fırlar, iz bırakır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.62))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.flying == null ? -1 : t - p.flying;
    // uçuş: 0.7 sn'de 170 birim sağa, hafif yukarı eğim (kutu+bleed içinde kalır)
    // uçuşun ikinci yarısında gövde sönümlenir (iz bırakarak kaybolur)
    const fx = d >= 0 ? Math.min(1, d / 0.7) : 0;
    const ease = fx < 1 ? 1 - Math.pow(1 - fx, 2) : 1;
    const ox = ease * 170;
    const oy = -ease * 26;
    const bob = d < 0 ? k.noise1(t * 0.8) * 1.2 : 0;
    const bodyA = d < 0 ? 1 : Math.max(0, 1 - Math.max(0, fx - 0.45) / 0.55);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // uçuş izi (uçuş başladıktan sonra)
    if (d >= 0 && d < 0.75) {
      const trailK = d < 0.1 ? d / 0.1 : Math.max(0, 1 - (d - 0.1) / 0.65);
      const tx = ox, ty = oy;
      // konik iz: mermiden geriye doğru genişleyen parlak şerit
      const grad = ctx.createLinearGradient(tx, ty, tx - 190, ty + 24);
      grad.addColorStop(0, k.rgba('yellow', 0.75 * trailK));
      grad.addColorStop(1, k.rgba('yellow', 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(tx - 10, ty - 8);
      ctx.lineTo(tx - 190, ty + 2);
      ctx.lineTo(tx - 10, ty + 10);
      ctx.closePath(); ctx.fill();
      // hız çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.35 * trailK); ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const h = k.hash(i * 11 + 7);
        const sx = tx - 40 - h * 130, sy = ty - 16 + h * 34;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - 46, sy + 6); ctx.stroke();
      }
      if (d < 0.15) k.glow(tx, ty, 40, 'yellow', 0.4 * (1 - d / 0.15));
    }

    ctx.save();
    ctx.translate(ox, oy + bob);
    ctx.globalAlpha = bodyA;

    // kovan (casing)
    blob(-70, -14, 78, 28, 7, k.rgba(p.color));
    blob(-70, -14, 14, 28, 6, dark);            // kovan tabanı
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); ctx.arc(-63, 0, 5, 0, k.TAU); ctx.fill();   // kapsül
    // çekirdek (ogive uç)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(8, -12 - LW / 2); ctx.quadraticCurveTo(52, -12 - LW / 2, 74, 0);
    ctx.quadraticCurveTo(52, 12 + LW / 2, 8, 12 + LW / 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = inkC;
    ctx.beginPath();
    ctx.moveTo(8, -12); ctx.quadraticCurveTo(52, -12, 74, 0);
    ctx.quadraticCurveTo(52, 12, 8, 12);
    ctx.closePath(); ctx.fill();
    // çekirdek parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.ellipse(38, -5, 16, 4, -0.15, 0, k.TAU); ctx.fill();
    // kovan premium parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-40, -8, 18, 5, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
