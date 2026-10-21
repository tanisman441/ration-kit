// factory-fx/stamp-press — presin vurma anı.
// ANIMASYON: `at` anında pres kafası hızla iner (0.28 sn), vuruş flaşı + şok
// halkaları + toz bulutu, parça ezilir, kafa 1.25 sn'de geri kalkar.
// Idle'da üstteki ikaz lambası yavaşça yanıp söner. Tek vurgu: red.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'stamp-press',
  category: 'factory-fx',
  desc: 'Hidrolik pres; at anında kafa vurur, flaş + şok halkası + ezilen parça',
  tags: ['pres', 'hidrolik', 'damga', 'fabrika', 'ezme', 'vuruş', 'press', 'stamp', 'hydraulic', 'factory', 'crush', 'impact'],
  box: [-85, -125, 85, 130],
  bleed: 45,
  anchor: 'taban (0,120)',
  points: { die: [0, 54], bed: [0, 80], beacon: [0, -116] },
  params: {
    at: { type: 'time', default: null, desc: 'presin vurma anı (iniş 0.28 sn, geri kalkış 1.25 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const striking = d >= 0;

    // --- pres konumu: iniş + geri kalkış ---
    const down = striking ? k.E.inCubic(k.prog(d, 0, 0.28)) : 0;
    const up = striking ? k.E.outCubic(k.prog(d, 0.55, 1.25)) : 0;
    const headY = k.lerp(-52, 20, Math.max(down - up, 0));

    // --- vuruş efektleri ---
    const imp = striking && d >= 0.28 ? 1 - k.prog(d, 0.28, 0.75) : 0;
    const pieced = striking && d >= 0.28 ? k.E.outCubic(k.prog(d, 0.28, 0.55)) : 0;

    // --- taban yatak ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-70 + 6, 80 + 6, 140, 40, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-70, 80, 140, 40, 10); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-40, 88, 20, 6, -0.1, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-70, 80, 140, 40, 10); ctx.stroke();

    // --- ezilen parça (yatak üstünde) ---
    const ph = 26 - 16 * pieced;
    const py = 80 - ph;
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-24 + 5, py + 5, 48, ph, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-24, py, 48, ph, 6); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-12, py + 5, 8, 4, 0.3, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-24, py, 48, ph, 6); ctx.stroke();

    // --- kolonlar + üst kiriş ---
    for (const cx of [-58, 36]) {
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(cx, -100, 22, 180, 8); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); k.rrect(cx, -100, 22, 180, 8); ctx.stroke();
    }
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-70 + 6, -112 + 6, 140, 30, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-70, -112, 140, 30, 10); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-40, -105, 18, 5, -0.1, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-70, -112, 140, 30, 10); ctx.stroke();

    // --- hidrolik silindir ---
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-18, -112, 36, 34, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-18, -112, 36, 34, 8); ctx.stroke();
    // piston kolu (kafa ile birlikte iner)
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-10, -78, 20, headY + 78, 6); ctx.fill();

    // --- pres kafası ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-34 + 6, headY + 6, 68, 34, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-34, headY, 68, 34, 10); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-18, headY + 8, 10, 5, 0.3, 0, k.TAU); ctx.fill();
    // ikaz çizgileri (vurgu: red)
    ctx.strokeStyle = k.rgba('red', 0.85); ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const zx = -26 + i * 17;
      ctx.beginPath();
      ctx.moveTo(zx, headY + 26); ctx.lineTo(zx + 9, headY + 12);
      ctx.stroke();
    }
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-34, headY, 68, 34, 10); ctx.stroke();
    // kalıp tabanı
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-28, headY + 30, 56, 10, 4); ctx.fill();

    // --- ikaz lambası (idle yanıp sönme) ---
    const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.8));
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-12, -134, 24, 22, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); k.rrect(-12, -134, 24, 22, 6); ctx.stroke();
    k.glow(0, -124, 14, 'red', 0.4 * blink);
    ctx.fillStyle = k.rgba('red', blink);
    ctx.beginPath(); ctx.arc(0, -124, 6.5, 0, k.TAU); ctx.fill();

    // --- vuruş: flaş + şok halkaları + toz ---
    if (imp > 0) {
      k.glow(0, 60, 46, p.color, 0.55 * imp);
      ctx.fillStyle = k.rgba('#ffffff', 0.85 * imp);
      ctx.beginPath(); ctx.ellipse(0, 62, 26, 10, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba(p.color, 0.7 * imp); ctx.lineWidth = 4;
      for (let i = 0; i < 2; i++) {
        const rp = k.prog(d, 0.28 + i * 0.1, 0.85);
        if (rp <= 0 || rp >= 1) continue;
        ctx.beginPath();
        ctx.ellipse(0, 62, 24 + rp * 64, 8 + rp * 22, 0, 0, k.TAU);
        ctx.stroke();
      }
      for (let i = 0; i < 6; i++) {
        const dp = k.prog(d, 0.3 + k.hash(i * 3 + 1) * 0.15, 0.9);
        if (dp <= 0 || dp >= 1) continue;
        const dx = (k.hash(i * 11 + 2) - 0.5) * 130;
        const dy = 66 + k.hash(i * 5 + 3) * 22 - dp * 26;
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - dp));
        ctx.beginPath(); ctx.arc(dx, dy, 7 + dp * 9, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
