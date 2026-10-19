// combat-fx/dash-trail — hızlı geçiş izi: dash anında şevron hayaletleri + hız çizgileri.
// NOT: canvas y-aşağıdır; direction r = soldan sağa, l = sağdan sola.
export default {
  name: 'dash-trail',
  category: 'combat-fx',
  desc: 'Hızlı geçiş izi: dash anında ardında hayalet iz bırakan şevron ok ve hız çizgileri',
  tags: ['hız', 'geçiş', 'iz', 'sürat', 'hayalet', 'dash', 'trail', 'speed', 'rush', 'afterimage'],
  box: [-210, -100, 210, 100],
  bleed: 80, // hız çizgileri box'ın ~70 birim dışına taşar
  anchor: 'geçiş yolunun merkezi (0,0)',
  points: { head: [160, 0], tail: [-160, 0] },
  params: {
    dash: { type: 'time', default: null, desc: 'geçiş anı (hayalet iz + hız çizgileri)' },
    direction: { type: 'enum', values: ['r', 'l'], default: 'r', desc: 'geçiş yönü: sağ|sol' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.dash == null ? -1 : t - p.dash;
    if (d < 0 || d > 0.7) return;
    const dir = p.direction === 'l' ? -1 : 1;
    const g = k.prog(d, 0, 0.5);
    ctx.save();

    function chevron(x, y, s, col, alpha) {
      ctx.fillStyle = k.rgba(col, alpha);
      ctx.beginPath();
      ctx.moveTo(x + dir * 34 * s, y);
      ctx.lineTo(x - dir * 20 * s, y - 24 * s);
      ctx.lineTo(x - dir * 6 * s, y);
      ctx.lineTo(x - dir * 20 * s, y + 24 * s);
      ctx.closePath();
      ctx.fill();
    }

    // 1) hız çizgileri — ince, ink rengi, geriden akar
    ctx.lineCap = 'round';
    const streakA = d < 0.45 ? 1 - d / 0.45 : 0;
    for (let i = 0; i < 12; i++) {
      const h1 = k.hash(i * 3 + 51), h2 = k.hash(i * 5 + 53), h3 = k.hash(i * 7 + 59);
      const lane = (h1 - 0.5) * 160;
      const len = 60 + h2 * 120;
      // kuyruk: baş okun gerisinde kalan alanda, ok ilerledikçe silinir
      const xs = -dir * 210 + dir * h3 * 130 + dir * (1 - g) * 180;
      const xe = xs + dir * len;
      ctx.strokeStyle = k.rgba('ink', 0.5 * streakA * (0.4 + h2 * 0.6));
      ctx.lineWidth = 2.5 + h2 * 3;
      ctx.beginPath();
      ctx.moveTo(xs, lane);
      ctx.lineTo(xe, lane);
      ctx.stroke();
    }

    // 2) baş okun ilerleyişi (box+bleed içinde: ±160)
    const headX = dir * (-160 + 320 * k.E.outExpo(g));

    // 3) hayalet izler — geride kalan 3 silik şevron (kenara yaklaşınca söner, taşma yok)
    const offs = [60, 110, 160];
    for (let i = 0; i < 3; i++) {
      const gx = headX - dir * offs[i];
      const edgeFade = dir > 0 ? k.clamp((gx + 250) / 60, 0, 1) : k.clamp((250 - gx) / 60, 0, 1);
      const ga = (0.34 - i * 0.1) * (1 - g * 0.5) * k.clamp(1 - d / 0.6, 0, 1) * edgeFade;
      if (ga > 0.01) chevron(gx, 0, 1 - i * 0.16, p.color, ga);
    }

    // 4) baş ok — parlak, vurgulu
    const headA = k.clamp(1 - d / 0.6, 0, 1);
    k.glow(headX, 0, 46 * headA, p.color, 0.28 * headA);
    chevron(headX, 0, 1.12, p.color, 0.95 * headA);
    // sol üst parlama + sağ alt gölge (premium finish)
    ctx.fillStyle = k.rgba('bg', 0.10 * headA);
    ctx.beginPath();
    ctx.ellipse(headX + dir * 6 - 6, -10, 16, 9, -0.4, 0, k.TAU);
    ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12 * headA);
    ctx.beginPath();
    ctx.moveTo(headX + dir * 34 + 6, 6);
    ctx.lineTo(headX - dir * 20 + 6, 24 + 6);
    ctx.lineTo(headX - dir * 6 + 6, 6);
    ctx.lineTo(headX - dir * 20 + 6, -24 + 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
