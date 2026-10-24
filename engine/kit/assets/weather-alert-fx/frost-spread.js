// weather-alert-fx/frost-spread — yayılan don/buz kristali
// at anında 1.2 sn'de 6 ana dal merkezden dışa doğru uzar, yan dallar belirir.
// Boşta kristal hafif döner, kıvılcımlar yanıp söner. NOT: canvas y-aşağıdır;
// dallar merkezden her yöne (+y dahil) uzar.
export default {
  name: 'frost-spread', category: 'weather-alert-fx',
  desc: 'Merkezden dışa yayılan 6 kollu buz kristali; at anında 1.2 sn uzayan don dalları',
  tags: ['don', 'buz', 'soğuk', 'kristal', 'kar', 'frost', 'freeze', 'ice', 'crystal', 'cold', 'snowflake'],
  box: [-150, -150, 150, 150],
  bleed: 25,
  anchor: 'kristal merkezi (0,0)',
  points: { centre: [0, 0], tip: [0, -140], edge: [130, 0] },
  params: {
    color: { type: 'color', default: 'cyan' },
    core: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'don yayılma anı: 1.2 sn dalların uzaması + kıvılcım patlaması' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d < 1.2;
    // yayılma: önce hızlı, sonra yavaşlayan uzama
    const prog = active ? 1 - Math.pow(1 - d / 1.2, 2) : 0.35;
    const baseLen = 45 + prog * 95;
    const rot = Math.sin(t * 0.8) * 0.06; // hafif salınım

    ctx.save();
    ctx.rotate(rot);
    // 6 ana dal + yan dallar
    for (let i = 0; i < 6; i++) {
      const a = (i * k.TAU) / 6;
      const dx = Math.cos(a), dy = Math.sin(a);
      const L = baseLen;
      // gölge dal (sağ alt offset) — ana dalın kalın alt kopyası
      ctx.strokeStyle = line; ctx.lineWidth = 11;
      ctx.beginPath(); ctx.moveTo(5, 6); ctx.lineTo(dx * L + 5, dy * L + 6); ctx.stroke();
      // ana dal
      ctx.strokeStyle = k.rgba(p.color, 0.95); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dx * L, dy * L); ctx.stroke();
      // yan dallar: dalın %55 ve %80'inde, 45° açıyla (yayılmayla belirir)
      for (const f of [0.55, 0.8]) {
        const bx = dx * L * f, by = dy * L * f;
        const side = 26 * prog + 8;
        for (const s of [-1, 1]) {
          const px = -dy * s, py = dx * s; // dala dik yön
          ctx.strokeStyle = k.rgba(p.color, 0.8); ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(bx, by);
          ctx.lineTo(bx + dx * side * 0.6 + px * side * 0.7, by + dy * side * 0.6 + py * side * 0.7);
          ctx.stroke();
        }
      }
      // uç elması
      ctx.fillStyle = k.rgba(p.color, 0.9);
      ctx.save(); ctx.translate(dx * L, dy * L); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(0, -7); ctx.lineTo(-12, 0); ctx.lineTo(0, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // merkez çekirdek: gölge + gövde + sol üst parlama
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(4, 5, 26, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.core); ctx.beginPath(); ctx.arc(0, 0, 26, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, -10, 11, 7, -0.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, k.TAU); ctx.fill();
    if (active) k.glow(0, 0, 80, p.color, 0.4 * (1 - d / 1.2));
    ctx.restore();

    // kıvılcımlar: boşta seyrek yanıp sönme, yayılmada patlama
    const n = active ? 18 : 8;
    for (let i = 0; i < n; i++) {
      const tw = Math.sin(t * 3 + i * 2.4) > 0.2 ? 1 : 0.15;
      const rr = active ? 40 + k.hash(i * 3.3 + 7) * 100 : 60 + k.hash(i * 3.3 + 7) * 80;
      const aa = (i * k.TAU) / n + t * 0.2;
      const a = active ? 0.95 : 0.7 * tw;
      ctx.fillStyle = k.rgba(p.color, a);
      ctx.beginPath(); ctx.arc(Math.cos(aa) * rr, Math.sin(aa) * rr, 3.5, 0, k.TAU); ctx.fill();
    }
  },
};
