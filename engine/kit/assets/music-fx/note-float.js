// music-fx/note-float — yukarı süzülüp solan müzik notası.
// play anında nota fırlatılır + parıltı (1.2 sn), sonra yeniden belirir; boşta hafif salınım.
export default {
  name: 'note-float', category: 'music-fx',
  desc: 'A music note floating upward and fading, launched with sparkles on play',
  tags: ['nota', 'müzik notası', 'note', 'müzik', 'music', 'yükselmek', 'float', 'melodi', 'süzülme'],
  box: [-100, -160, 100, 100],
  bleed: 40,
  anchor: '(0,40) notanın dinlenme konumu; yukarı süzülür',
  points: { note: [0, 40], top: [0, -140], base: [0, 90] },
  params: {
    play: { type: 'time', default: null, desc: 'nota fırlatma anı: yükselir + parıltı (1.2 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.play == null ? -1 : t - p.play;

    // 1) konum + alfa: boşta salınım; olayda fırlat, sonra yeniden belir
    let nx = 8 * Math.sin(t * 1.6);
    let ny = 40 + 5 * Math.sin(t * 2.2);
    let alpha = 0.88 + 0.12 * Math.sin(t * 1.6);
    let rot = 0.06 * Math.sin(t * 1.3);
    if (d >= 0 && d <= 1.2) {
      const g = k.prog(d, 0, 1.2);
      ny -= 200 * k.E.outCubic(g);
      alpha = 1 - k.prog(d, 0.8, 1.2);
    } else if (d > 1.2) {
      alpha = Math.min(1, k.prog(d, 1.2, 1.45)) * (0.88 + 0.12 * Math.sin(t * 1.6));
    }

    // 2) parıltılar: fırlatma anında etrafa saçılır (0.6 sn)
    if (d >= 0 && d <= 0.6) {
      const g = k.prog(d, 0, 0.6);
      for (let i = 0; i < 3; i++) {
        const a = k.hash(i * 3.7) * k.TAU;
        const r = 30 + 70 * k.E.outExpo(g) + i * 14;
        const sx = 8 * Math.sin(1.6) + Math.cos(a) * r;
        const sy = 0 + Math.sin(a) * r;
        const s = 9 * (1 - g) + 2;
        ctx.strokeStyle = k.rgba(p.color, 0.85 * (1 - g));
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx - s, sy); ctx.lineTo(sx + s, sy);
        ctx.moveTo(sx, sy - s); ctx.lineTo(sx, sy + s);
        ctx.stroke();
      }
    }

    // 3) nota: baş + sap + bayrak
    ctx.save();
    ctx.translate(nx, ny);
    ctx.rotate(rot);
    ctx.globalAlpha = Math.max(0, alpha);
    // gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(6, 6, 30, 22, -0.3, 0, k.TAU); ctx.fill();
    // sap (önce çizilir, baş üstüne biner)
    ctx.strokeStyle = k.rgba('ink', 1); ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(22, -6); ctx.lineTo(22, -108); ctx.stroke();
    // baş
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 22, -0.3, 0, k.TAU); ctx.fill();
    // parlama (başın sol üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(-10, -8, 11, 7, -0.5, 0, k.TAU); ctx.fill();
    // bayrak: sapın üstünden sağa kıvrılan kuyruk
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath();
    ctx.moveTo(22, -108);
    ctx.bezierCurveTo(52, -100, 62, -78, 54, -52);
    ctx.bezierCurveTo(52, -74, 44, -88, 22, -90);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();
  },
};
