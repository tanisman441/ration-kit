// weather-alert-fx/uv-pulse — UV nabız/uyarı: güneş + nabız halkaları
// at anında 1.5 sn'de 3 nabız halkası dışa yayılır, güneş çekirdeği parlar.
// Boşta güneş hafif nabız atar, ışınlar yavaşça döner. NOT: canvas y-aşağıdır;
// ışınlar merkezden her yöne uzar.
export default {
  name: 'uv-pulse', category: 'weather-alert-fx',
  desc: 'Mor UV güneşi; at anında 1.5 sn yayılan 3 nabız halkası ve parlayan çekirdek',
  tags: ['uv', 'güneş', 'ultraviyole', 'nabız', 'uyarı', 'ışın', 'sun', 'ultraviolet', 'pulse', 'radiation', 'warning'],
  box: [-150, -150, 150, 150],
  bleed: 30,
  anchor: 'güneş merkezi (0,0)',
  points: { centre: [0, 0], ray: [0, -104], edge: [130, 0] },
  params: {
    color: { type: 'color', default: 'purple' },
    core: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'UV nabız anı: 1.5 sn 3 halka yayılımı + çekirdek parlaması' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d < 1.5;
    // idle nabız: ~1.6 sn periyot, yarıçap ±4
    const idlePulse = Math.sin(t * 3.9) * 4;
    const coreR = 46 + idlePulse + (active ? Math.sin((d / 1.5) * Math.PI) * 14 : 0);

    // nabız halkaları: at anında 3 halka sırayla yayılır
    if (active) {
      for (let i = 0; i < 3; i++) {
        const start = i * 0.3;
        const dd = d - start;
        if (dd < 0) continue;
        const rr = 55 + (dd / (1.5 - start)) * 95;
        const a = Math.max(0, 1 - dd / (1.5 - start));
        ctx.strokeStyle = k.rgba(p.color, 0.85 * a);
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
      }
      k.glow(0, 0, 90, p.color, 0.45 * Math.sin((d / 1.5) * Math.PI));
    }

    // ışınlar: yavaş dönen 12 ışın (boşta dönüş)
    ctx.save();
    ctx.rotate(t * 0.25);
    ctx.lineWidth = 8;
    for (let i = 0; i < 12; i++) {
      const a = (i * k.TAU) / 12;
      const dx = Math.cos(a), dy = Math.sin(a);
      const r0 = 62 + idlePulse * 0.4, r1 = 92 + idlePulse * 0.5;
      ctx.strokeStyle = k.rgba(p.color, 0.85);
      ctx.beginPath(); ctx.moveTo(dx * r0, dy * r0); ctx.lineTo(dx * r1, dy * r1); ctx.stroke();
      // kısa yan ışın (her ikinci ışında)
      if (i % 2 === 0) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = k.rgba(p.color, 0.5);
        ctx.beginPath(); ctx.moveTo(dx * r1 - dy * 8, dy * r1 + dx * 8); ctx.lineTo(dx * (r1 + 12), dy * (r1 + 12)); ctx.stroke();
        ctx.lineWidth = 8;
      }
    }
    ctx.restore();

    // çekirdek: gölge (sağ alt) + gövde + sol üst parlama
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(5, 6, coreR + 4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.core); ctx.beginPath(); ctx.arc(0, 0, coreR, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-coreR * 0.32, -coreR * 0.4, coreR * 0.4, coreR * 0.24, -0.5, 0, k.TAU); ctx.fill();
    // iç halka: UV işareti gibi iç daire
    ctx.strokeStyle = k.rgba(p.color, 0.9); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, coreR * 0.55, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); ctx.arc(0, 0, coreR * 0.2, 0, k.TAU); ctx.fill();
  },
};
