// magic-2/summon-circle — çağırma çemberi: summon anında 1.2 sn'de çizilen
// iç içe halkalar + runik glifler + merkezi parlama; sonra yavaş dönüşle süzülme.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) çemberin merkezidir.
export default {
  name: 'summon-circle', category: 'magic-2',
  desc: 'Büyülü çağırma çemberi: summon anında çizilen iç içe halkalar, dönen runik glifler ve merkezi parlama',
  tags: ['büyü', 'çağırma', 'çember', 'summon', 'summoning', 'magic circle', 'rune', 'sihir', 'glif'],
  box: [-130, -130, 130, 130],
  bleed: 50,
  anchor: 'merkez (0,0) — çemberin tam ortası',
  points: { center: [0, 0], edge: [105, 0], above: [0, -105] },
  params: {
    color: { type: 'color', default: 'purple', desc: 'büyü enerjisinin rengi' },
    summon: { type: 'time', default: null, desc: 'çağırma anı (1.2 sn halka çizimi + glifler + parlama)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.summon == null ? -1 : t - p.summon;
    const col = p.color;
    const active = p.summon != null && d >= 0 && d < 1.2;
    const g = active ? k.prog(d, 0, 1.2) : 1;   // çizim ilerlemesi
    const rot = t * 0.15;                        // idle yavaş dönüş

    // ---- olay öncesi: merkeze süzülen sihirli tozlar ----
    if (d < 0) {
      for (let i = 0; i < 18; i++) {
        const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 7 + 2);
        const a = h1 * k.TAU + t * 0.8;
        const rr = 105 - ((t * 40 + h2 * 105) % 105);
        ctx.fillStyle = k.rgba(col, Math.max(0.5 * (1 - rr / 130), 0));
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 2 + h2 * 3.5, 0, k.TAU); ctx.fill();
      }
    }

    // ---- dış halka: çizimle belirir (0–0.5 sn) ----
    const og = active ? k.prog(d, 0, 0.5) : 1;
    if (og > 0) {
      ctx.strokeStyle = k.rgba('bg', 0.55);
      ctx.lineWidth = 11;
      ctx.beginPath(); ctx.arc(0, 0, 105, -Math.PI / 2, -Math.PI / 2 + og * k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(col, 0.85);
      ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, 0, 105, -Math.PI / 2, -Math.PI / 2 + og * k.TAU); ctx.stroke();
    }

    // ---- iç halka: 0.25–0.8 sn ----
    const ig = active ? k.prog(d, 0.25, 0.8) : 1;
    if (ig > 0) {
      ctx.strokeStyle = k.rgba(col, 0.7);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 78, Math.PI / 2, Math.PI / 2 + ig * k.TAU); ctx.stroke();
    }

    // ---- merkez üçgen: 0.5–1.0 sn ----
    const tg = active ? k.prog(d, 0.5, 1.0) : 1;
    if (tg > 0) {
      ctx.strokeStyle = k.rgba(col, 0.75);
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + rot * 0.4 + (i / 3) * tg * k.TAU;
        const x = Math.cos(a) * 52, y = Math.sin(a) * 52;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke();
    }

    // ---- runik glifler: 0.62–1.2 sn tek tek belirir, sonra yavaş döner ----
    for (let i = 0; i < 12; i++) {
      const appear = active ? k.prog(g, 0.62 + i * 0.022, 0.66 + i * 0.022) : 1;
      if (appear <= 0) continue;
      const a = rot + (i / 12) * k.TAU;
      const gx = Math.cos(a) * 91, gy = Math.sin(a) * 91;
      ctx.save();
      ctx.translate(gx, gy); ctx.rotate(a + Math.PI / 2);
      const kind = k.hash(i * 13 + 5);
      ctx.strokeStyle = k.rgba(col, 0.8 * appear);
      ctx.fillStyle = k.rgba(col, 0.8 * appear);
      ctx.lineWidth = 3;
      if (kind < 0.35) {
        ctx.beginPath(); ctx.moveTo(-5, 5); ctx.lineTo(0, -6); ctx.lineTo(5, 5); ctx.stroke();
      } else if (kind < 0.7) {
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -6, 2.4, 0, k.TAU); ctx.fill();
      } else {
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(5, 4); ctx.lineTo(-5, 4); ctx.closePath(); ctx.stroke();
      }
      ctx.restore();
    }

    // ---- merkez parlama: nabız + summon sonunda flaş ----
    const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
    let coreA = 0.22 + 0.14 * pulse;
    if (p.summon != null && d >= 1.2 && d < 1.5) {
      const fg = 1 - (d - 1.2) / 0.3;   // bitiş flaşı
      k.glow(0, 0, 130, col, 0.5 * fg);
      ctx.strokeStyle = k.rgba(col, 0.7 * fg);
      ctx.lineWidth = 6 * fg + 2;
      ctx.beginPath(); ctx.arc(0, 0, 105 + (1 - fg) * 55, 0, k.TAU); ctx.stroke();
      coreA = 0.5 * fg + 0.2;
    }
    k.glow(0, 0, 52, col, Math.min(coreA, 0.5));
    ctx.fillStyle = k.rgba(col, 0.5 * (0.6 + 0.4 * pulse) * (active ? g : 1));
    ctx.beginPath(); ctx.arc(0, 0, 10 + 4 * pulse, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
