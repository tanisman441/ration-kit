// alert-fx/danger-ping — uyarı üçgeni merkezli tehlike ping'i; sürekli genişleyen halkalar yayar.
// NOT: canvas y-aşağıdır. Idle: her 1.5 sn'de bir yeni halka; ping olayı 0.6 sn sürer.
export default {
  name: 'danger-ping',
  category: 'alert-fx',
  desc: 'Ünlemli uyarı üçgeni merkezli, sürekli genişleyen tehlike ping halkaları',
  tags: ['uyarı', 'tehlike', 'ping', 'alarm', 'ikaz', 'warning', 'danger', 'alert', 'ping', 'exclamation'],
  box: [-130, -130, 130, 130],
  bleed: 50,
  anchor: 'merkez (üçgenin ortası)',
  points: { centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'red' },
    ping: { type: 'time', default: null, desc: 'güçlü ping anı: kalın halka + üçgen parlaması (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.ping == null ? -1 : t - p.ping;
    const firing = d >= 0 && d < 0.6;
    const env = firing ? 1 - d / 0.6 : 0;

    // idle: 1.5 sn periyotlu genişleyen halkalar (iki faz kaymış halka)
    for (let i = 0; i < 2; i++) {
      const ph = ((t / 1.5) + i / 2) % 1;
      const r = 46 + ph * 110;
      ctx.strokeStyle = k.rgba(p.color, 0.55 * (1 - ph));
      ctx.lineWidth = 8 * (1 - ph) + 2;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
    }

    // ping olayı: kalın parlak halka
    if (firing) {
      const r = 46 + k.E.outCubic(k.prog(d, 0, 0.6)) * 130;
      ctx.strokeStyle = k.rgba('yellow', 0.9 * (1 - k.prog(d, 0.1, 0.6)));
      ctx.lineWidth = 14 * (1 - k.prog(d, 0, 0.6)) + 3;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
      k.glow(0, 0, 70, p.color, 0.35 * env);
    }

    // uyarı üçgeni
    const tri = 52;
    const pop = firing ? 1 + 0.18 * Math.sin(env * Math.PI) : 1 + 0.03 * Math.sin(t * k.TAU / 2);
    ctx.save(); ctx.scale(pop, pop);
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(0, -tri - 8); ctx.lineTo(tri + 7, tri * 0.82); ctx.lineTo(-tri - 7, tri * 0.82);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath();
    ctx.moveTo(0, -tri); ctx.lineTo(tri, tri * 0.82); ctx.lineTo(-tri, tri * 0.82);
    ctx.closePath(); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-13, -16, 14, 8, -0.5, 0, k.TAU); ctx.fill();
    // ünlem
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-7, -26, 14, 38, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 26, 8, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
