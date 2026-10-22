// spell-duel/summon-rune — tepeden görülen büyülü rün dairesi: dış halka +
// iç halka + 8 radyal rün çizgisi + merkez yıldızı. `at` anında: çizgiler
// ~0.6 sn'de saat yönünde belirir (çizilme efekti). Sonra idle: iç halka
// yavaşça döner (~10°/sn) ve parıltı nabzı atar (~2.4 sn periyot).
// NOT: canvas y-aşağıdır; (0,0) dairenin merkezidir.
export default {
  name: 'summon-rune', category: 'spell-duel',
  desc: 'Tepeden görülen büyülü rün dairesi; at anında çizilir, sonra döner ve parıldar',
  tags: ['rün', 'büyü', 'sihir', 'çağırma', 'daire', 'mühür', 'rune', 'summon', 'circle', 'seal', 'magic'],
  box: [-140, -140, 140, 140],
  bleed: 30,
  anchor: 'dairenin merkezi (0,0)',
  points: { centre: [0, 0], edge: [115, 0], top: [0, -115] },
  params: {
    at: { type: 'time', default: null, desc: 'rünün çizilme anı (0.6 sn: çizgiler saat yönünde belirir)' },
    color: { type: 'color', default: 'purple', desc: 'rün rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round';

    // Çizilme ilerlemesi: at öncesi %35 hayalet, at anında 0.6 sn'de tam
    let reveal;
    if (d < 0) reveal = 0.35;
    else if (d < 0.6) reveal = 0.35 + 0.65 * k.E.outCubic(Math.min(1, d / 0.6));
    else reveal = 1;

    const R = 115;
    const rot = t * (k.TAU / 36); // iç halka ~10°/sn döner
    const pulseA = 0.55 + 0.3 * Math.sin(t * (k.TAU / 2.4)); // parıltı nabzı
    k.glow(0, 0, R * 1.1, acc, 0.15 * reveal);

    const arcTo = (r, a0, a1) => { ctx.beginPath(); ctx.arc(0, 0, r, a0, a1); ctx.stroke(); };

    // Dış halka: saat yönünde çizilme
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    arcTo(R, -Math.PI / 2, -Math.PI / 2 + reveal * k.TAU);
    ctx.strokeStyle = k.rgba(acc, pulseA); ctx.lineWidth = 3;
    arcTo(R, -Math.PI / 2, -Math.PI / 2 + reveal * k.TAU);

    // İç halka: dönen, 4 kesik segment
    ctx.strokeStyle = k.rgba(acc, pulseA * 0.85); ctx.lineWidth = 3.5;
    for (let s = 0; s < 4; s++) {
      const a0 = rot + s * (k.TAU / 4);
      const segLen = (k.TAU / 4) * 0.55 * reveal;
      if (segLen > 0.01) arcTo(R * 0.72, a0, a0 + segLen);
    }

    // 8 radyal rün çizgisi: dıştan içe, her biri farklı uzunlukta
    ctx.strokeStyle = k.rgba(acc, 0.65 * reveal); ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = i * (k.TAU / 8) + rot * 0.5;
      const len = R * (0.55 + k.hash(i * 31.7) * 0.25);
      const prog = k.clamp(reveal * 1.15 - i * 0.015, 0, 1); // sırayla belirme
      if (prog <= 0) continue;
      const r0 = R * 0.30, r1 = r0 + len * prog;
      const x0 = Math.cos(a) * r0, y0 = Math.sin(a) * r0;
      const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      // rün ucu: küçük elmas
      if (prog >= 0.98) {
        const dx = 5;
        ctx.fillStyle = k.rgba(acc, 0.8);
        ctx.beginPath();
        ctx.moveTo(x1 - dx, y1); ctx.lineTo(x1, y1 - dx);
        ctx.lineTo(x1 + dx, y1); ctx.lineTo(x1, y1 + dx);
        ctx.closePath(); ctx.fill();
      }
    }

    // Merkez yıldızı (6 uçlu): nabızla büyür
    const cr = 16 * (0.9 + 0.25 * Math.sin(t * (k.TAU / 2.4))) * reveal;
    if (cr > 1) {
      ctx.strokeStyle = k.rgba(acc, 0.75 * reveal); ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const a = i * (Math.PI / 3) + rot;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * -cr, Math.sin(a) * -cr);
        ctx.lineTo(Math.cos(a) * cr, Math.sin(a) * cr);
        ctx.stroke();
      }
      ctx.fillStyle = k.rgba('bg', 0.75 * reveal);
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, k.TAU); ctx.fill();
    }

    // Sol üst parlama (premium finish, alfa 0.10) — dış halkanın üstünde
    ctx.fillStyle = 'rgba(255,255,255,' + (0.10 * reveal).toFixed(3) + ')';
    ctx.beginPath(); ctx.ellipse(-R * 0.45, -R * 0.5, R * 0.3, R * 0.14, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
