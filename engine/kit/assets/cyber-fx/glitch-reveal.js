// cyber-fx/glitch-reveal — kilit, glitch içinden belirir.
// ANIMASYON: `at` anında 0.3 sn RGB kayma (red/cyan hayalet ofset) + dilim kayması + blok glitch,
// ardından kilit netleşir; idle'da hafif dilim titremesi + tarama çizgisi. Tek vurgu: cyan
// (0.3 sn'lik glitch anında RGB kanal etkisi için kırmızı hayalet kullanılır).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'glitch-reveal', category: 'cyber-fx',
  desc: 'Glitch içinden beliren kilit; at anında 0.3 sn RGB kayma + dilim bozulması yaşar',
  tags: ['glitch', 'kilit', 'belirme', 'rgb', 'bozulma', 'siber', 'güvenlik', 'dijital', 'glitch', 'lock', 'reveal', 'rgb', 'cyber', 'digital', 'security'],
  box: [-110, -110, 110, 110],
  bleed: 30,
  anchor: 'kilit merkezi (0,0)',
  points: { center: [0, 0], lock: [0, -8] },
  params: {
    at: { type: 'time', default: null, desc: 'belirme anı: 0.3 sn glitch (RGB kayma + dilim) sonra kilit netleşir' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const glitching = d >= 0 && d < 0.3;
    const hidden = p.at != null && d < 0;
    const env = glitching ? Math.sin((d / 0.3) * Math.PI) : 0; // 0→1→0
    ctx.save();
    ctx.lineCap = 'round';

    // --- kilit formu (gövde + kelepçe + anahtar deliği) ---
    // ghost: RGB kayma için gövde/kelepçe rengini ez (red/cyan kanal)
    const lockBody = (alpha, ghost) => {
      const bodyCol = ghost || 'panel2';
      const lineCol = ghost || 'ink';
      // kelepçe
      ctx.strokeStyle = k.rgba(lineCol, alpha);
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(0, -34, 26, Math.PI, 0); ctx.stroke();
      // gövde gölgesi
      ctx.fillStyle = k.rgba('bg', 0.12 * alpha);
      ctx.beginPath(); k.rrect(-38 + 6, -32 + 6, 76, 64, 14); ctx.fill();
      // gövde
      ctx.fillStyle = k.rgba(bodyCol, alpha);
      ctx.beginPath(); k.rrect(-38, -32, 76, 64, 14); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.10 * alpha})`;
      ctx.beginPath(); ctx.ellipse(-20, -20, 22, 9, -0.3, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55 * alpha); ctx.lineWidth = 5;
      ctx.beginPath(); k.rrect(-38, -32, 76, 64, 14); ctx.stroke();
      // anahtar deliği (vurgu)
      ctx.fillStyle = k.rgba(p.color, 0.95 * alpha);
      ctx.beginPath(); ctx.arc(0, -8, 9, 0, k.TAU); ctx.fill();
      ctx.fillRect(-3.5, -8, 7, 20);
    };

    if (hidden) {
      // at öncesi: kilit parça parça, dilimler kaymış, silik
      const bands = 5;
      const flick = 0.5 + 0.5 * k.noise1(t * 9);
      for (let i = 0; i < bands; i++) {
        const y0 = -64 + (i * 128) / bands;
        const ox = (k.hash(200 + i * 31) - 0.5) * 44 * (0.4 + 0.6 * flick);
        ctx.save();
        ctx.beginPath(); ctx.rect(-110, y0, 220, 128 / bands + 1); ctx.clip();
        ctx.translate(ox, 0);
        lockBody(0.42);
        ctx.restore();
      }
    } else if (glitching) {
      // --- RGB kayma: red/cyan hayalet ofsetler ---
      ctx.save(); ctx.translate(-11 * env, 0); lockBody(0.45 * env, 'red'); ctx.restore();
      ctx.save(); ctx.translate(11 * env, 0); lockBody(0.45 * env, 'cyan'); ctx.restore();
      // ana gövde dilim dilim kayar
      const bands = 6;
      for (let i = 0; i < bands; i++) {
        const y0 = -64 + (i * 128) / bands;
        const ox = (k.hash(300 + i * 17) - 0.5) * 2 * env * 30;
        if (Math.abs(ox) < 1) continue;
        ctx.save();
        ctx.beginPath(); ctx.rect(-110, y0, 220, 128 / bands + 1); ctx.clip();
        ctx.translate(ox, 0);
        lockBody(0.9);
        ctx.restore();
      }
      // blok glitch: 5 küçük kopuk blok
      for (let i = 0; i < 5; i++) {
        const bx = (k.hash(400 + i * 23) - 0.5) * 130;
        const by = (k.hash(500 + i * 29) - 0.5) * 110;
        const bw = 14 + k.hash(600 + i * 7) * 30;
        ctx.fillStyle = k.rgba(i % 2 ? 'red' : p.color, 0.55 * env);
        ctx.fillRect(bx, by, bw, 8);
      }
    } else {
      // --- net kilit: tam parlak, hafif idle titremesi ---
      const idleJit = (k.hash(Math.floor(t * 3.5)) > 0.86) ? (k.hash(700 + Math.floor(t * 3.5)) - 0.5) * 8 : 0;
      ctx.save(); ctx.translate(idleJit, 0);
      lockBody(1);
      ctx.restore();
      // at sonrası kısa netleşme parıltısı
      if (d >= 0.3 && d < 0.7) {
        const settle = 1 - k.prog(d, 0.3, 0.7);
        k.glow(0, -8, 55, p.color, 0.3 * settle);
      }
    }

    // idle tarama çizgisi (çok hafif)
    const scanPh = (t / 3.2) % 1;
    ctx.fillStyle = k.rgba(p.color, 0.08 * Math.sin(scanPh * Math.PI));
    ctx.fillRect(-76, k.lerp(-64, 64, scanPh), 152, 6);
    ctx.restore();
  },
};
