// alert-fx/radar-alert — dönen taramalı radar ekranı; `at` anında kırmızı uyarı halkası + ünlem belirir.
// NOT: canvas y-aşağıdır. Idle: 3 sn'lik dönen tarama hüzmesi; at olayı 1.2 sn sürer.
export default {
  name: 'radar-alert',
  category: 'alert-fx',
  desc: 'Dönen taramalı radar ekranı; at anında kırmızı uyarı halkası ve ünlem belirir',
  tags: ['radar', 'tarama', 'uyarı', 'alarm', 'tehlike', 'sweep', 'radar', 'scan', 'alert', 'warning', 'sweep'],
  box: [-115, -115, 115, 115],
  bleed: 45,
  anchor: 'ekran merkezi',
  points: { centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'green' },
    at: { type: 'time', default: null, desc: 'uyarı anı: kırmızı halka + ünlem + flaş (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d < 1.2;
    const env = firing ? 1 - d / 1.2 : 0;

    // ekran gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 100, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(0, 0, 93, 0, k.TAU); ctx.fill();

    // ızgara halkaları (ekran içi)
    ctx.strokeStyle = k.rgba(p.color, 0.35);
    for (const r of [28, 56, 82]) {
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-88, 0); ctx.lineTo(88, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -88); ctx.lineTo(0, 88); ctx.stroke();

    // hedef noktaları (hash tabanlı sabit konumlar, tarama geçince parlar)
    const sweepA = (t / 3) * k.TAU - Math.PI / 2;
    for (let i = 0; i < 5; i++) {
      const a = k.hash(i * 7 + 1) * k.TAU;
      const r = 20 + k.hash(i * 13 + 2) * 62;
      const bx = Math.cos(a) * r, by = Math.sin(a) * r;
      // tarama hüzmesi blip'e yakınsa parlat
      let da = Math.abs(((a - sweepA) % k.TAU + k.TAU) % k.TAU);
      const near = 1 - Math.min(da / 1.2, 1);
      ctx.fillStyle = k.rgba(p.color, 0.45 + 0.5 * near);
      ctx.beginPath(); ctx.arc(bx, by, 4 + 3 * near, 0, k.TAU); ctx.fill();
    }

    // dönen tarama hüzmesi
    ctx.save();
    ctx.rotate(sweepA);
    const grad = ctx.createLinearGradient(0, 0, 88, 0);
    grad.addColorStop(0, k.rgba(p.color, 0));
    grad.addColorStop(1, k.rgba(p.color, 0.5));
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.arc(0, 0, 88, -0.22, 0);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // at olayı: kırmızı uyarı halkası + ünlem
    if (firing) {
      const r = 93 + k.E.outCubic(k.prog(d, 0, 0.5)) * 34;
      ctx.strokeStyle = k.rgba('red', 0.95 * (1 - k.prog(d, 0.3, 1.2)));
      ctx.lineWidth = 12 * (1 - k.prog(d, 0, 1.2)) + 3;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
      k.glow(0, 0, 100, 'red', 0.4 * env);
    }
    const popA = firing ? Math.min(env * 3, 1) : 0;
    if (popA > 0) {
      ctx.save(); ctx.scale(popA, popA);
      ctx.fillStyle = k.rgba('red', popA);
      ctx.beginPath(); k.rrect(-9, -30, 18, 44, 8); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 30, 10, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    // sol üst parlama (çerçevede)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.ellipse(-40, -55, 30, 16, -0.5, 0, k.TAU); ctx.fill();
  },
};
