// chat-fx/voice-wave — sesli mesaj: active anında dalga çubukları dans eder, öncesinde sakin dalgalanır. Contract: engine/kit/ASSETS.md
export default {
  name: 'voice-wave', category: 'chat-fx',
  desc: 'Sesli mesaj balonu: oynat üçgeni + 11 ses çubuğu; active anında çubuklar yükselip ritmik dans eder',
  tags: ['ses', 'sesli', 'mesaj', 'dalga', 'voice', 'audio', 'waveform', 'chat', 'oynat', 'message'],
  box: [-180, -70, 180, 70],
  bleed: 16,
  anchor: 'balon merkezi (0,0)',
  points: { play: [-128, 0], center: [0, 0], right: [170, 0] },
  params: {
    active: { type: 'time', default: null, desc: 'sesin aktifleşme (çalma) anı' },
    color: { type: 'color', default: 'panel2' },
    bars: { type: 'number', default: 11, desc: 'dalga çubuğu sayısı' },
  },
  draw(ctx, t, p, k) {
    const d = p.active == null ? -1 : t - p.active;
    const on = d >= 0;                                            // aktif mi?
    const n = Math.min(15, Math.max(5, Math.round(p.bars ?? 11)));
    const W = 320, H = 96, R = 28;
    const breathe = 1 + 0.015 * Math.sin(t * 2.1);               // idle nefes

    ctx.save();
    ctx.scale(breathe, breathe);
    // balon
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    ctx.lineWidth = Math.max(4, W * 0.03);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    k.rrect(-W / 2, -H / 2, W, H, R); ctx.stroke();
    // parlama sol üst, alfa 0.11
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-W / 2 + 60, -H / 2 + 22, 52, 15, -0.4, 0, k.TAU); ctx.fill();

    // oynat düğmesi (daire + üçgen)
    const px = -W / 2 + 44;
    const pulse = on ? 1 + 0.08 * Math.sin(t * 6) : 1;           // aktifken nabız
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.arc(px, 0, 24 * pulse, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath();
    ctx.moveTo(px - 6, -11); ctx.lineTo(px + 12, 0); ctx.lineTo(px - 6, 11); ctx.closePath(); ctx.fill();

    // süre etiketi (sahte çizgi)
    ctx.fillStyle = k.rgba('ink', 0.4);
    k.rrect(W / 2 - 62, -6, 40, 12, 6); ctx.fill();

    // ses dalgası çubukları
    const x0 = -W / 2 + 88, x1 = W / 2 - 78;
    const gap = (x1 - x0) / (n - 1);
    for (let i = 0; i < n; i++) {
      const seed = k.noise1(i * 0.9 + 4.2);                      // 0..1 taban yüksekliği
      const sway = on
        ? 0.45 + 0.55 * Math.abs(Math.sin(t * 3.2 + i * 0.85))   // aktif: ritmik dans
        : 0.25 + 0.12 * Math.sin(t * 1.1 + i * 0.5);             // boştayken sakin dalgalanma
      const h = 8 + seed * 44 * sway;
      const x = x0 + i * gap;
      ctx.fillStyle = on ? k.rgba('ink') : k.rgba('ink', 0.55);
      k.rrect(x - 3.5, -h / 2, 7, h, 4); ctx.fill();
    }
    ctx.restore();
  },
};
