// alert-fx/shield-up — kalkan `up` anında belirir (patlayarak açılır); sonra canlı nabızla durur.
// NOT: canvas y-aşağıdır. Idle: 2.4 sn'lik yumuşak glow nabzı; up olayı 0.6 sn sürer.
export default {
  name: 'shield-up',
  category: 'alert-fx',
  desc: 'Up anında patlayarak beliren kalkan; sonra yumuşak nabızla durur',
  tags: ['kalkan', 'koruma', 'savunma', 'aktifleşme', 'güvenlik', 'shield', 'protection', 'defense', 'activate', 'security'],
  box: [-95, -105, 95, 105],
  bleed: 50,
  anchor: 'kalkan merkezi',
  points: { top: [0, -90], centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
    up: { type: 'time', default: null, desc: 'kalkanın belirme anı: patlama + halka (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    const d = p.up == null ? -1 : t - p.up;
    const firing = d >= 0 && d < 0.6;
    const env = firing ? 1 - d / 0.6 : 0;
    // up verilmediyse kalkan zaten durur; verildiyse olay anında belirir ve sonra durur
    const shown = p.up == null ? true : d >= 0;
    const appear = p.up == null ? 1 : (firing ? k.E.outBack(k.prog(d, 0, 0.4), 2) : shown ? 1 : 0);

    // up olayı: belirme halkası
    if (firing) {
      const r = 40 + k.E.outCubic(k.prog(d, 0, 0.6)) * 110;
      ctx.strokeStyle = k.rgba(p.color, 0.8 * (1 - k.prog(d, 0.15, 0.6)));
      ctx.lineWidth = 10 * (1 - k.prog(d, 0, 0.6)) + 2;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
      k.glow(0, 0, 90, p.color, 0.4 * env);
      // altıgen kıvılcımlar
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * k.TAU + 0.3;
        const rr = 55 + k.E.outCubic(k.prog(d, 0, 0.5)) * 60;
        ctx.fillStyle = k.rgba('yellow', 0.85 * env);
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 5 * env + 1, 0, k.TAU); ctx.fill();
      }
    }
    if (appear <= 0) return;

    ctx.save();
    ctx.scale(appear, appear);
    // kalkan gövdesi
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(0, -92);
    ctx.quadraticCurveTo(58, -78, 62, -30);
    ctx.quadraticCurveTo(64, 30, 0, 92);
    ctx.quadraticCurveTo(-64, 30, -62, -30);
    ctx.quadraticCurveTo(-58, -78, 0, -92);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(0, -84);
    ctx.quadraticCurveTo(52, -71, 55, -28);
    ctx.quadraticCurveTo(57, 28, 0, 84);
    ctx.quadraticCurveTo(-57, 28, -55, -28);
    ctx.quadraticCurveTo(-52, -71, 0, -84);
    ctx.closePath(); ctx.fill();
    // iç kalkan çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, -66);
    ctx.quadraticCurveTo(40, -56, 42, -22);
    ctx.quadraticCurveTo(44, 24, 0, 68);
    ctx.quadraticCurveTo(-44, 24, -42, -22);
    ctx.quadraticCurveTo(-40, -56, 0, -66);
    ctx.closePath(); ctx.stroke();
    // merkez onay işareti
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-22, 2); ctx.lineTo(-6, 20); ctx.lineTo(26, -18); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-22, -52, 18, 10, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // idle: yumuşak glow nabzı (kalkan dururken canlı)
    const nabiz = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.4);
    k.glow(0, 0, 85, p.color, (0.1 + 0.08 * nabiz) * appear);
  },
};
