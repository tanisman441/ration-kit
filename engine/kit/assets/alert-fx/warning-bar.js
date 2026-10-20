// alert-fx/warning-bar — akan çizgili ikaz şeridi; çizgiler sürekli kayar, `flash` anında bant parlar.
// NOT: canvas y-aşağıdır. Idle: çizgi kayması (2 sn döngü); flash olayı 0.8 sn sürer.
export default {
  name: 'warning-bar',
  category: 'alert-fx',
  desc: 'Kayan çizgili sarı-kırmızı ikaz şeridi; flash anında parlayarak dikkat çeker',
  tags: ['ikaz', 'uyarı şeridi', 'dikkat bandı', 'tehlike', 'şerit', 'warning bar', 'caution tape', 'alert', 'hazard', 'danger'],
  box: [-160, -34, 160, 34],
  bleed: 30,
  anchor: 'şerit merkezi',
  points: { left: [-160, 0], right: [160, 0] },
  params: {
    color: { type: 'color', default: 'red' },
    flash: { type: 'time', default: null, desc: 'flash anı: bant parlama + glow (0.8 sn)' },
    speed: { type: 'number', default: 1, desc: 'çizgi kayma hızı (0-2)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.flash == null ? -1 : t - p.flash;
    const firing = d >= 0 && d < 0.8;
    const env = firing ? 1 - d / 0.8 : 0;

    // bant gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-160, -34, 320, 68, 12); ctx.fill();
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(-154, -28, 308, 56, 9); ctx.fill();

    // kayan diyagonal çizgiler (kırpma bölgesi içinde)
    ctx.save();
    ctx.beginPath(); k.rrect(-154, -28, 308, 56, 9); ctx.clip();
    const shift = (((t * p.speed) % 2) + 2) % 2 / 2 * 64;
    ctx.fillStyle = k.rgba(p.color);
    for (let x = -200; x < 200; x += 64) {
      ctx.save(); ctx.translate(x + shift, 0); ctx.rotate(0.6);
      ctx.fillRect(-16, -60, 32, 120);
      ctx.restore();
    }
    // sol üst parlama (çizgilerin üstünde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -19, 90, 9, -0.08, 0, k.TAU); ctx.fill();
    ctx.restore();

    // kenar direkleri
    for (const s of [-1, 1]) {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(s * 168 - 8, -44, 16, 88, 8); ctx.fill();
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); k.rrect(s * 168 - 6, -42, 12, 84, 6); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(s * 168 - 2, -26, 3, 16, 0, 0, k.TAU); ctx.fill();
    }

    // flash olayı: bant parlar
    if (firing) {
      ctx.fillStyle = k.rgba('yellow', 0.55 * env);
      ctx.beginPath(); k.rrect(-154, -28, 308, 56, 9); ctx.fill();
      k.glow(0, 0, 60, p.color, 0.35 * env);
    }
    // idle: hafif nabız parlaması
    const idleGlow = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.4);
    k.glow(0, 0, 55, 'yellow', 0.1 + 0.06 * idleGlow);
  },
};
