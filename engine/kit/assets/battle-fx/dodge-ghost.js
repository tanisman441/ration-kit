// battle-fx/dodge-ghost — kaçınma hayalet izi: sağa fırlayan figür, arkasında solan hayalet izler.
// NOT: canvas y-aşağıdır; (0,0) figürün başlangıç noktasıdır (gövde merkezi).
export default {
  name: 'dodge-ghost',
  category: 'battle-fx',
  desc: 'Kaçınma hayalet izi: sağa fırlayan figürün arkasında kalan solan hayalet silüetler',
  tags: ['kaçınma', 'kaçış', 'hayalet', 'iz', 'hız', 'dodge', 'ghost', 'dash', 'evade', 'afterimage'],
  box: [-190, -130, 190, 130],
  bleed: 60,
  anchor: 'figürün başlangıç noktası (0,0)',
  points: { start: [0, 0], end: [150, 0] },
  params: {
    dodge: { type: 'time', default: null, desc: 'kaçınma anı (0.9 sn: sağa fırlama + 3 hayalet iz)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: figür büyüklüğü' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.dodge == null ? -1 : t - p.dodge;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // koşan figür: baş + öne eğik gövde + savrulan kollar/bacaklar (kit karakter ailesine uygun oranlar)
    function runner(alpha, ghost) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const lean = 0.35; // öne eğilme
      ctx.rotate(lean);
      const main = ghost ? p.color : 'ink';
      ctx.lineCap = 'round';
      // bacaklar (çift fazda)
      const ph = ghost ? 0.5 : t * 6;
      const l1 = Math.sin(ph) * 22 * S, l2 = Math.sin(ph + Math.PI) * 22 * S;
      ctx.strokeStyle = k.rgba(main, ghost ? 0.7 : 1);
      ctx.lineWidth = 13 * S;
      ctx.beginPath(); ctx.moveTo(0, 18 * S); ctx.lineTo(-8 * S + l1, 66 * S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 18 * S); ctx.lineTo(10 * S + l2, 64 * S); ctx.stroke();
      // gövde
      ctx.fillStyle = k.rgba(main, ghost ? 0.55 : 1);
      ctx.strokeStyle = k.rgba('bg', ghost ? 0.4 : 0.55);
      ctx.lineWidth = 4 * S;
      ctx.beginPath(); k.rrect(-15 * S, -26 * S, 30 * S, 48 * S, 13 * S); ctx.fill(); ctx.stroke();
      // kollar
      ctx.strokeStyle = k.rgba(main, ghost ? 0.7 : 1);
      ctx.lineWidth = 11 * S;
      ctx.beginPath(); ctx.moveTo(-6 * S, -14 * S); ctx.lineTo(-26 * S + l2 * 0.5, 12 * S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6 * S, -14 * S); ctx.lineTo(28 * S + l1 * 0.5, 6 * S); ctx.stroke();
      // baş (basık daire, rx = ry x 0.92)
      ctx.fillStyle = k.rgba(main, ghost ? 0.55 : 1);
      ctx.strokeStyle = k.rgba('bg', ghost ? 0.4 : 0.55);
      ctx.lineWidth = 4 * S;
      ctx.beginPath();
      ctx.ellipse(0, -48 * S, 17 * S, 18.5 * S, 0, 0, k.TAU);
      ctx.fill(); ctx.stroke();
      // sol üst parlama (sadece gerçek figürde)
      if (!ghost) {
        ctx.fillStyle = k.rgba('bg', 0.11);
        ctx.beginPath();
        ctx.ellipse(-5 * S, -54 * S, 8 * S, 5 * S, -0.5, 0, k.TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    // --- idle: hazır duruş, hafif nefes ---
    if (d < 0) {
      const breath = Math.sin(t * 2.6) * 2 * S;
      ctx.translate(0, breath * 0.4);
      runner(1, false);
      // hazır çizgisi: zeminde nabız
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.4);
      ctx.strokeStyle = k.rgba(p.color, 0.3 + 0.25 * pulse);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-34 * S, 74 * S); ctx.lineTo(34 * S, 74 * S);
      ctx.stroke();
      ctx.restore();
      return;
    }
    // kaçınma bitince figür iniş noktasında durur (film kaldırmayana dek)
    if (d > 1.3) {
      ctx.save();
      ctx.translate(150 * S, 0);
      runner(1, false);
      ctx.restore();
      ctx.restore();
      return;
    }

    // --- fırlama: 0.15 sn'de ivmelenip sağa, 0.9 sn'de hedefe ---
    const g = k.prog(d, 0, 0.9);
    const e = k.E.outExpo(g);
    const fx = e * 150 * S;
    const fy = -Math.sin(g * Math.PI) * 26 * S; // hafif yay çizerek fırlar

    // kalkış tozu (0.3 sn)
    if (d < 0.3) {
      const f = 1 - d / 0.3;
      for (let i = 0; i < 7; i++) {
        const h1 = k.hash(i * 7 + 71), h2 = k.hash(i * 11 + 73);
        const a = Math.PI + (h1 - 0.5) * 1.6;
        const dist = (10 + h2 * 46) * S * (1 - f * 0.3);
        ctx.fillStyle = k.rgba('dim', 0.5 * f);
        ctx.beginPath();
        ctx.arc(Math.cos(a) * dist - 14 * S, 62 * S + Math.sin(a) * dist * 0.5, (3 + h2 * 5) * S, 0, k.TAU);
        ctx.fill();
      }
    }

    // hayalet izler — önceki konumlarda solan 3 silüet
    for (let i = 1; i <= 3; i++) {
      const gg = k.prog(d - i * 0.1, 0, 0.9);
      if (gg <= 0) continue;
      const ee = k.E.outExpo(gg);
      ctx.save();
      ctx.translate(ee * 150 * S, -Math.sin(gg * Math.PI) * 26 * S);
      runner(0.4 / i * (1 - gg * 0.4), true);
      ctx.restore();
    }

    // hız çizgileri
    const speed = 1 - g;
    for (let i = 0; i < 4; i++) {
      const yy = (-34 + i * 24) * S;
      const len = (60 + speed * 120) * S;
      ctx.strokeStyle = k.rgba(p.color, 0.4 * speed + 0.1);
      ctx.lineWidth = (3.5 - i * 0.4) * S;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(fx - 40 * S, yy + fy * 0.3);
      ctx.lineTo(fx - 40 * S - len, yy + fy * 0.3);
      ctx.stroke();
    }

    // gerçek figür
    ctx.save();
    ctx.translate(fx, fy);
    runner(1, false);
    ctx.restore();
    ctx.restore();
  },
};
