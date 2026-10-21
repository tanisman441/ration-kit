// travel-fx/landing-gear — gövde altı: down anında kapaklar açılır, tekerlekler iner ve kilitlenir, sinyal yanar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde karnının ortasıdır.
export default {
  name: 'landing-gear', category: 'travel-fx',
  desc: 'Uçak gövdesinin altında down anında iniş takımı kapakları açılır, tekerlekler iner, kilit sinyali yanar',
  tags: ['iniş takımı', 'tekerlek', 'uçak', 'iniş', 'sinyal', 'kilit', 'landing gear', 'wheels', 'airplane', 'landing', 'signal', 'locked'],
  box: [-160, -75, 160, 95],
  bleed: 16,
  anchor: 'gövde karnının ortası (0,0)',
  points: { left_gear: [-70, 62], right_gear: [70, 62], beacon: [0, -48] },
  params: {
    color: { type: 'color', default: 'ink' },
    down: { type: 'time', default: null, desc: 'iniş takımı açılış anı (tekerlekler iner, kilitlenir)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkLine = k.rgba('ink', 0.75);
    const shade = (c, f) => { const [r, g, b] = k.col(c); return `rgba(${r * f | 0},${g * f | 0},${b * f | 0},1)`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.down == null ? -1 : t - p.down;
    const deploy = d >= 0 ? k.E.outBack(k.prog(t, p.down, p.down + 0.8)) : 0;  // 0 = kapalı, 1 = açık+kilitli
    const locked = d >= 0.8;
    const sway = k.noise1(t * 0.9) * 1.6;                        // gövde canlı: hafif salınım

    ctx.save(); ctx.translate(sway * 0.5, 0);

    // --- gövde karnı ---
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-160, -75, 320, 62, 18); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-160 + LW / 2, -75 + LW / 2, 320 - LW, 62 - LW, 14); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-110, -58, 44, 10, -0.25, 0, k.TAU); ctx.fill();
    // perçim detayları
    ctx.fillStyle = inkLine;
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-140 + i * 35, -64, 2.4, 0, k.TAU); ctx.fill(); }

    // --- uyarı feneri (her zaman yanıp söner) ---
    const blink = k.hash(Math.floor(t * 2.2)) > 0.45;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -46, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red', blink ? 1 : 0.25);
    ctx.beginPath(); ctx.arc(0, -46, 6, 0, k.TAU); ctx.fill();
    if (blink) k.glow(0, -46, 18, 'red', 0.4);

    // --- iniş takımları ---
    const gear = (gx) => {
      ctx.save(); ctx.translate(gx, -13);
      // kapak: kapalıyken düz panel, açılırken yana döner
      const doorA = deploy * 1.05;
      ctx.save(); ctx.translate(-26, 0); ctx.rotate(-doorA);
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(0, -4, 30, 12, 5); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(0 + LW / 2, -4 + LW / 2, 30 - LW, 12 - LW, 3); ctx.fill();
      ctx.restore();

      if (deploy > 0.03) {
        const wy = k.lerp(-6, 62, deploy);                        // tekerlek iniş mesafesi
        // dikme
        ctx.strokeStyle = line; ctx.lineWidth = 12;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, wy - 10); ctx.stroke();
        ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, wy - 10); ctx.stroke();
        // tekerlek
        ctx.save(); ctx.translate(0, wy); ctx.scale(deploy, deploy);
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.arc(0, 0, 17, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('dim');
        ctx.beginPath(); ctx.arc(0, 0, 17 - LW / 2, 0, k.TAU); ctx.fill();
        // dönen jant işareti (iniş sonrası yavaş dönüş hissi)
        ctx.save(); ctx.rotate(-t * (locked ? 0.6 : 3));
        ctx.fillStyle = k.rgba('yellow');
        ctx.beginPath(); ctx.arc(0, -7, 3.6, 0, k.TAU); ctx.fill();
        ctx.restore();
        ctx.fillStyle = k.rgba('ink', 0.85);
        ctx.beginPath(); ctx.arc(0, 0, 3.2, 0, k.TAU); ctx.fill();
        ctx.restore();
        // kilit sinyali: kilitlenince yeşil nokta + nabız
        if (locked) {
          const pulse = 0.5 + 0.5 * Math.sin((t - p.down) * 5);
          k.glow(0, wy - 24, 12, 'green', 0.25 + 0.25 * pulse);
          ctx.fillStyle = k.rgba('green', 0.7 + 0.3 * pulse);
          ctx.beginPath(); ctx.arc(0, wy - 24, 5, 0, k.TAU); ctx.fill();
        }
      }
      ctx.restore();
    };
    gear(-70); gear(70);
    ctx.restore();
  },
};
