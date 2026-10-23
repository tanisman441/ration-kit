// space-action/zero-g-tumble — sıfır yerçekiminde süzülen astronot: gövde ~6 sn'de bir
// tam tur döner, kollar ve bacaklar boşlukta savrulur, kask vizörü parlar. Döngülü canlı sahne.
// NOT: canvas y-aşağıdır; (0,0) astronotun gövde merkezidir. Yukarı = negatif y.
export default {
  name: 'zero-g-tumble',
  category: 'space-action',
  desc: 'Astronot sıfır yerçekiminde dönerek süzülür; kollar bacaklar savrulur, vizör parlar',
  tags: ['astronot', 'süzülme', 'dönme', 'yerçekimsiz', 'kask', 'uzay yürüyüşü', 'astronaut', 'tumble', 'zero gravity', 'float', 'spacewalk', 'helmet'],
  box: [-110, -110, 110, 110],
  bleed: 50,
  anchor: 'gövde merkezi (0,0)',
  points: { helmet: [0, -58], hand: [46, 6], foot: [-20, 78] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'kıyafet ana rengi' },
    speed: { type: 'number', default: 1, desc: '0.2–2: dönme ve savrulma hızı' },
  },
  draw(ctx, t, p, k) {
    const OUT = 6;
    const S = k.clamp(p.speed, 0.2, 2);
    ctx.save();

    // --- yörünge süzülüşü: küçük elips üzerinde kayma + tam tur dönme ---
    const cx = 14 * Math.sin(t * 0.45 * S);
    const cy = 10 * Math.sin(t * 0.62 * S + 1.2);
    const rot = t * k.TAU / (6 / S);
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    const suit = p.color;
    const lw = 13;                                            // uzuv kalınlığı

    // --- sırt çantası ---
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    k.rrect(-46, -26, 26, 52, 10); ctx.fill(); ctx.stroke();
    // çanta detay
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-46, -8); ctx.lineTo(-20, -8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-46, 10); ctx.lineTo(-20, 10); ctx.stroke();

    // --- bacaklar (dizden bükülü, savrulur) ---
    ctx.strokeStyle = k.rgba(suit, 1);
    ctx.lineWidth = lw; ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      const sw = 0.5 * k.noise1(t * 1.7 * S + s * 4);
      const hipX = s * 12, hipY = 34;
      const kneeX = hipX + s * 8 + sw * 10, kneeY = hipY + 26;
      const footX = kneeX - s * 14 + sw * 14, footY = kneeY + 24;
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(kneeX, kneeY); ctx.lineTo(footX, footY); ctx.stroke();
      // bot
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      k.rrect(footX - 10, footY - 6, 24, 13, 6); ctx.fill(); ctx.stroke();
    }

    // --- gövde ---
    ctx.fillStyle = k.rgba(suit, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    k.rrect(-22, -30, 44, 66, 16); ctx.fill(); ctx.stroke();
    // göğüs paneli
    ctx.fillStyle = k.rgba('ink', 0.25);
    k.rrect(-14, -20, 28, 18, 6); ctx.fill();
    for (let i = 0; i < 3; i++) {
      const on = k.hash(Math.floor(t * 2) + i * 31) > 0.5;
      ctx.fillStyle = k.rgba(on ? 'cyan' : 'ink', on ? 0.95 : 0.4);
      ctx.beginPath(); ctx.arc(-8 + i * 8, -11, 2.6, 0, k.TAU); ctx.fill();
    }
    // parlama + gölge (gövde)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-11, -18, 12, 14, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(11, 20, 12, 14, -0.4, 0, k.TAU); ctx.fill();

    // --- kollar (dirsekten bükülü, savrulur) ---
    ctx.strokeStyle = k.rgba(suit, 1);
    ctx.lineWidth = lw; ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      const sw = 0.5 * k.noise1(t * 2.1 * S + s * 9);
      const shX = s * 24, shY = -18;
      const elX = shX + s * 20 + sw * 12, elY = shY + 14;
      const haX = elX + s * 6 + sw * 16, haY = elY + 16;
      ctx.beginPath(); ctx.moveTo(shX, shY); ctx.lineTo(elX, elY); ctx.lineTo(haX, haY); ctx.stroke();
      // eldiven
      ctx.fillStyle = k.rgba('red', 1);
      ctx.beginPath(); ctx.arc(haX, haY, 8, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();
    }

    // --- kask ---
    ctx.fillStyle = k.rgba(suit, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    ctx.beginPath(); ctx.arc(0, -52, 27, 0, k.TAU); ctx.fill(); ctx.stroke();
    // vizör
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.arc(4, -52, 17, 0, k.TAU); ctx.fill();
    const vg = ctx.createLinearGradient(-8, -64, 14, -42);
    vg.addColorStop(0, k.rgba('cyan', 0.95));
    vg.addColorStop(1, k.rgba('cyan', 0.45));
    ctx.fillStyle = vg;
    ctx.beginPath(); ctx.arc(4, -52, 14, 0, k.TAU); ctx.fill();
    // vizör parlama çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.6); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6, -62); ctx.lineTo(2, -54); ctx.stroke();
    // kask parlama (premium finish)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(-11, -66, 10, 7, -0.5, 0, k.TAU); ctx.fill();
    // kask lambası (idle blink)
    const hl = k.hash(Math.floor(t * 1.2)) > 0.6;
    ctx.fillStyle = k.rgba('yellow', hl ? 1 : 0.3);
    ctx.beginPath(); ctx.arc(-22, -70, 4, 0, k.TAU); ctx.fill();
    if (hl) k.glow(-22, -70, 14, k.col('yellow'), 0.4);

    // --- boyun halkası ---
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, -32, 14, 0.3, Math.PI - 0.3); ctx.stroke();

    ctx.restore();
  },
};
