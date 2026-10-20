// alert-fx/sonar-ping — tabandaki yayıcıdan yukarı ve yanlara açılan sonar halkaları.
// NOT: canvas y-aşağıdır. Idle: her 1.2 sn'de bir yeni halka; ping olayı 0.5 sn sürer.
export default {
  name: 'sonar-ping',
  category: 'alert-fx',
  desc: 'Tabandaki yayıcıdan açılan, sürekli genişleyen sonar halkaları',
  tags: ['sonar', 'radar', 'ping', 'dalga', 'taramak', 'deniz', 'sonar', 'ping', 'wave', 'scan', 'detection'],
  box: [-140, -120, 140, 90],
  bleed: 60,
  anchor: 'yayıcı merkezi (0,55)',
  points: { emitter: [0, 55] },
  params: {
    color: { type: 'color', default: 'cyan' },
    ping: { type: 'time', default: null, desc: 'güçlü ping anı: çift halka + geri dönüş sinyali (0.5 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.ping == null ? -1 : t - p.ping;
    const firing = d >= 0 && d < 0.5;
    const env = firing ? 1 - d / 0.5 : 0;

    // idle: yayıcıdan genişleyen halkalar (yarım daire, yukarı açık)
    for (let i = 0; i < 3; i++) {
      const ph = ((t / 1.2) + i / 3) % 1;
      const r = 22 + ph * 150;
      ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - ph));
      ctx.lineWidth = 7 * (1 - ph) + 2;
      ctx.beginPath(); ctx.arc(0, 55, r, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    }

    // ping olayı: kalın çift halka + hedef sinyali
    if (firing) {
      for (const [off, a0] of [[0, 0.9], [0.18, 0.6]]) {
        const dd = k.clamp(d - off, 0, 0.5);
        const r = 22 + k.E.outCubic(dd / 0.5) * 165;
        ctx.strokeStyle = k.rgba(p.color, a0 * (1 - dd / 0.5));
        ctx.lineWidth = 12 * (1 - dd / 0.5) + 2;
        ctx.beginPath(); ctx.arc(0, 55, r, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      }
      // geri dönen hedef sinyali
      const bx = -60 + k.prog(d, 0.1, 0.45) * 120;
      ctx.fillStyle = k.rgba(p.color, 0.9 * env);
      ctx.beginPath(); ctx.arc(bx, -45, 7 * env + 2, 0, k.TAU); ctx.fill();
      k.glow(0, 55, 80, p.color, 0.35 * env);
    }

    // yayıcı: taban + kubbe
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-52, 55, 104, 22, 9); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-46, 57, 92, 16, 7); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 55, 24, Math.PI, 0); ctx.fill();
    // kubbe parlaması (yayıcının atımı nabızla)
    const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.2);
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-8, 40, 9, 5, -0.5, 0, k.TAU); ctx.fill();
    k.glow(0, 50, 34, p.color, 0.15 + 0.25 * pulse + 0.3 * env);
  },
};
