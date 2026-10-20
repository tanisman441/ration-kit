// kitchen-fx/crack-egg — yumurta kırma: kabuk yarıları ayrılır, sarı damlayarak düşer (0.8 sn).
// NOT: canvas y-aşağıdır; yumurta merkezi (0,0), kırılınca sarı aşağı düşer.
export default {
  name: 'crack-egg', category: 'kitchen-fx',
  desc: 'Yumurta: crack anında kabuk ikiye ayrılır, sarısı damlayarak aşağı düşüp birikir',
  tags: ['yumurta', 'kırma', 'sarı', 'damla', 'kabuk', 'crack', 'egg', 'yolk', 'cracking egg', 'drip'],
  box: [-120, -120, 120, 130],
  bleed: 36,
  anchor: 'yumurta merkezi (0,0)',
  points: { shell_top: [-40, -50], shell_bottom: [30, 40], yolk: [0, 78], crack_line: [0, 0] },
  params: {
    crack: { type: 'time', default: null, desc: 'kırılma anı (0.8 sn): kabuklar ayrılır, sarı düşer' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.crack == null ? -1 : t - p.crack;

    // kabuk yarısı çizen yardımcı: üst yarım (üst=Y) veya alt yarım; jagged kırık kenarlı
    const halfShell = (flip) => {
      ctx.beginPath();
      const steps = 9;
      for (let i = 0; i <= steps; i++) {
        const a = Math.PI + (i / steps) * Math.PI; // üst yarım açı aralığı
        const jag = flip ? 1 : -1;
        let px = Math.cos(a) * 52;
        let py = Math.sin(a) * 64;
        if (!flip) { px = -px; } // alt yarım: aynala
        if (i > 0 && i < steps) py += jag * (k.hash(i * 3 + (flip ? 1 : 50)) * 10 - 5);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    if (d < 0) {
      // --- idle: bütün yumurta, hafif sallantı
      const rock = Math.sin(t * 2.1) * 0.07;
      ctx.save(); ctx.translate(0, 0); ctx.rotate(rock);
      ctx.fillStyle = k.rgba('bg', 0.15);
      ctx.beginPath(); ctx.ellipse(6, 8, 52, 64, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 1);
      ctx.beginPath(); ctx.ellipse(0, 0, 52, 64, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(-18, -26, 16, 26, -0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
      // minik çatlak çizgisi nabzı (kırılmayı haber verir)
      const pulse = 0.3 + 0.2 * Math.sin(t * 3.4);
      ctx.strokeStyle = k.rgba('ink', 0.25 + pulse * 0.3);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-18, -6); ctx.lineTo(-6, 2); ctx.lineTo(-14, 10); ctx.lineTo(2, 16);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // --- kırılma animasyonu (0.8 sn)
    const g = k.prog(Math.min(d, 0.8), 0, 0.8);
    const e = k.E.outCubic(g);

    // alt yarım: yerinde kalır, hafifçe açılır
    ctx.save(); ctx.translate(18 * e, 10 * e); ctx.rotate(0.18 * e);
    ctx.fillStyle = k.rgba('bg', 0.15);
    halfShell(false); ctx.save(); ctx.translate(6, 6); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    halfShell(false); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    ctx.restore();

    // üst yarım: yukarı-sola fırlar, döner
    ctx.save(); ctx.translate(-44 * e, -46 * e); ctx.rotate(-0.55 * e);
    ctx.fillStyle = k.rgba('bg', 0.15);
    halfShell(true); ctx.save(); ctx.translate(6, 6); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    halfShell(true); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-30 * 1, -40, 10, 16, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // sarı: kabuktan çıkar, düşer, altta birikir
    const yolkY = 8 + 74 * g * g;
    const yolkX = 8 * e;
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(yolkX + 6, yolkY + 6, 22, 19, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath(); ctx.ellipse(yolkX, yolkY, 22, 19, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(yolkX - 8, yolkY - 7, 8, 5.5, -0.5, 0, k.TAU); ctx.fill();

    // düşerken uzayan damla izi
    if (g < 0.75) {
      ctx.fillStyle = k.rgba('yellow', 0.5 * (1 - g));
      ctx.beginPath(); ctx.ellipse(yolkX - 4, yolkY - 26, 7, 12 * (1 - g), 0, 0, k.TAU); ctx.fill();
    }
    // birikinti (yumurta akı yayılır + sarı üstünde)
    if (g > 0.55) {
      const pg = k.prog(g, 0.55, 1);
      ctx.fillStyle = k.rgba(p.color, 0.55 * pg);
      ctx.beginPath(); ctx.ellipse(yolkX, 96, 30 + 34 * pg, 8 + 6 * pg, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.55 * pg);
      ctx.beginPath(); ctx.ellipse(yolkX, 96, 16 + 24 * pg, 6 + 4 * pg, 0, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
