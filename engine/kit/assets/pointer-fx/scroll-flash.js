// pointer-fx/scroll-flash — kaydırma çubuğu; scroll anında parmak zıplar, hız çizgileri çakar.
// NOT: canvas y-aşağıdır; (0,0) çubuğun ortasıdır.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'scroll-flash',
  category: 'pointer-fx',
  desc: 'Kaydırma çubuğu; scroll anında parmak sıçrar ve yukarı-aşağı hız çizgileri çakar',
  tags: ['kaydırma', 'kaydır', 'scroll', 'çubuk', 'hız', 'parmak', 'flaş', 'bar', 'flash', 'pointer'],
  box: [-90, -150, 90, 150],
  bleed: 45,
  anchor: 'çubuk merkezi (0,0)',
  points: { thumb: [0, 0], top: [0, -120], bottom: [0, 120] },
  params: {
    scroll: { type: 'time', default: null, desc: 'kaydırma anı: parmak 0.5 sn zıplar + hız çizgileri' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const d = p.scroll == null ? -1 : t - p.scroll;
    const W = 26, H = 240, TR = 10;

    // parmak dikey konumu: scroll'da 0.5 sn zıplayıp geri döner (aşağı)
    let ty = 0, lines = 0;
    if (d >= 0 && d < 0.5) {
      const e = k.E.outCubic(d / 0.5);
      ty = Math.sin(e * Math.PI) * 54;
      lines = 1 - e;
    }
    // idle: parmak hafif solur
    const breathe = 1 + 0.04 * Math.sin((t * k.TAU) / 2.4);

    ctx.save();

    // ray (arkaplan çizgisi) — dim rengiyle iki temada da görünür
    ctx.fillStyle = k.rgba('dim', 0.55);
    ctx.beginPath(); k.rrect(-W / 2 + 4, -H / 2, W - 8, H, TR); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); k.rrect(-W / 2 + 7, -H / 2 + 6, (W - 8) / 3, H - 12, 6); ctx.fill();

    // hız çizgileri (scroll yönüne ters, yukarı)
    if (lines > 0) {
      ctx.strokeStyle = k.rgba('yellow', 0.8 * lines);
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const a = k.hash(i * 11 + 5);
        const lx = (a - 0.5) * 90, ly = -H / 2 + 20 + a * 90;
        const len = 18 + a * 26 * lines;
        ctx.beginPath();
        ctx.moveTo(lx, ly + len);
        ctx.lineTo(lx, ly + len * 0.3);
        ctx.stroke();
      }
      k.glow(0, ty, 60, p.color, 0.4 * lines);
    }

    // parmak — sağ alt gölge + gövde + dış hat
    const TW = 44, TH = 84;
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-TW / 2 + 6, ty - TH / 2 + 6, TW, TH, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-TW / 2, ty - TH / 2, TW, TH * breathe, 14); ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-TW / 2, ty - TH / 2, TW, TH * breathe, 14); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-TW / 2 + 11, ty - TH / 2 + 16, 9, 20, -0.3, 0, k.TAU); ctx.fill();
    // parmak içi çizgiler (ink, ince)
    ctx.strokeStyle = k.rgba('ink', 0.75);
    ctx.lineWidth = 3.5;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-12, ty + i * 18);
      ctx.lineTo(12, ty + i * 18);
      ctx.stroke();
    }

    ctx.restore();
  },
};
