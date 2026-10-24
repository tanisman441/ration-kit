// spy-fx/briefcase-handoff — ajan evrak çantası: `at` anında kapak açılıyor,
// içinden belge parıltısı yükseliyor; boştayken çanta hafif sallanıyor.
// NOT: canvas y-aşağıdır; (0,0) çanta gövdesinin merkezidir.
export default {
  name: 'briefcase-handoff',
  category: 'spy-fx',
  desc: 'Koyu evrak çantası: kapağı açılıyor, içinden parlayan belgeler yükseliyor',
  tags: ['çanta', 'evrak', 'belge', 'ajan', 'takas', 'gizli', 'briefcase', 'documents', 'spy', 'handoff', 'secret'],
  box: [-140, -225, 140, 120],
  bleed: 40,
  anchor: 'çanta gövdesi merkezi (0,0)',
  points: { handle: [0, -78], latch: [0, -18], document: [58, -95], corner_bl: [-100, 58] },
  params: {
    at: { type: 'time', default: null, desc: 'kapak açılma anı (0.9 sn: kapak döner, belgeler yükselir)' },
    color: { type: 'color', default: 'ink', desc: 'çanta ana rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();

    // idle: çanta hafif sallanıyor (y-aşağı ekseninde dönüş + alçalma/yükselme)
    const sway = k.noise1(t * 0.9) * 1.6;
    const bob = Math.sin(t * 2.1) * 2;
    ctx.translate(0, bob);
    ctx.rotate(sway * Math.PI / 180 * 1.2);

    const BW = 200, BH = 116; // gövde: -100..100 x, -16..100 y
    // kapak açılma açısı (0 = kapalı, 1 = açık)
    const open = d < 0 ? 0 : k.clamp(k.prog(d, 0.05, 0.6), 0, 1);
    const lidA = -k.E.outCubic(open) * 1.05; // menteşe solda, kapak yukarı-sola döner (y-aşağı: negatif = yukarı)

    // gölge (sağ alta)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(12, 88, 104, 16, 0, 0, k.TAU); ctx.fill();

    // belgeler (kapak altından, açılınca yükselir) — kapaktan önce çizilir
    const rise = d < 0 ? 0 : k.clamp(k.prog(d, 0.25, 1.0), 0, 1);
    if (rise > 0) {
      const ry = k.E.outCubic(rise);
      for (let i = 0; i < 3; i++) {
        const dx = (i - 1) * 34;
        const dy = -ry * (44 + i * 16) + i * 4;
        ctx.save(); ctx.translate(dx, 14 + dy); ctx.rotate((i - 1) * 0.07);
        ctx.fillStyle = k.rgba('panel');
        ctx.beginPath(); k.rrect(-24, -34, 48, 68, 6); ctx.fill();
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
        // belge çizgileri (ink, ince)
        ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
        for (let l = 0; l < 4; l++) {
          ctx.beginPath(); ctx.moveTo(-15, -18 + l * 11); ctx.lineTo(15 - (l % 2) * 8, -18 + l * 11); ctx.stroke();
        }
        ctx.restore();
      }
      // belge parıltısı — yükselişle birlikte
      const ga = Math.sin(k.clamp(rise, 0, 1) * Math.PI);
      k.glow(0, -50 - ry * 40, 90, 'yellow', 0.4 * ga);
      const prog = k.prog(d, 0.3, 1.1);
      for (let i = 0; i < 6; i++) {
        const h = k.hash(i * 23 + 5);
        const px = (h - 0.5) * 150, py = -20 - prog * (70 + h * 50);
        ctx.fillStyle = k.rgba('yellow', 0.75 * (1 - prog));
        ctx.beginPath(); ctx.arc(px, py, 2.5 + h * 2, 0, k.TAU); ctx.fill();
      }
    }

    // gövde
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-100, -16, BW, BH, 18); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    // premium finish: sol üst parlama
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-64, -2, 26, 42, 0.3, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(64, 62, 28, 30, 0.3, 0, k.TAU); ctx.fill();
    // gövde üst kenar çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-100, -16); ctx.lineTo(100, -16); ctx.stroke();
    // kilitler (2 adet)
    for (const lx of [-52, 52]) {
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(lx - 13, -30, 26, 32, 6); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.arc(lx, -14, 4.5, 0, k.TAU); ctx.fill();
      k.glow(lx, -14, 16, 'yellow', 0.35 + 0.15 * k.noise1(t * 2 + lx));
    }

    // kapak — sol menteşe (-100, -16) etrafında döner
    ctx.save();
    ctx.translate(-100, -16);
    ctx.rotate(lidA);
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(0, -46, 200, 46, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(36, -28, 18, 12, 0.2, 0, k.TAU); ctx.fill();
    // sap (kapak üstünde)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(74, -74, 52, 30, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5; ctx.stroke();
    ctx.restore();

    // menteşe pimi
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(-100, -16, 7, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();

    ctx.restore();
  },
};
