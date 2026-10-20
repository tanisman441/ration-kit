// pointer-fx/hover-glow — yuvarlak kart/buton; hover anında ışık yükselir, sonra yumuşak söner.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'hover-glow',
  category: 'pointer-fx',
  desc: 'Hover efekti: kart hover anında parlar ve 1.0 sn boyunca yumuşak şekilde söner',
  tags: ['hover', 'parlama', 'üzerine', 'gelince', 'ışık', 'buton', 'kart', 'glow', 'pointer', 'mouse'],
  box: [-140, -100, 140, 100],
  bleed: 55,
  anchor: 'kart merkezi (0,0)',
  points: { center: [0, 0], top: [0, -60] },
  params: {
    hover: { type: 'time', default: null, desc: 'üzerine gelme anı: parlama 0.18 sn yükselir, 0.8 sn söner' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.hover == null ? -1 : t - p.hover;
    const W = 200, H = 110, R = 22;

    // parlama seviyesi
    let glowL = 0;
    if (d >= 0 && d < 0.98) {
      glowL = d < 0.18 ? k.E.outCubic(d / 0.18) : 1 - k.E.inOutCubic((d - 0.18) / 0.8);
    }
    // idle: sol üst köşede hafif yıldız parıltısı (2.4 sn)
    const twinkle = 0.25 + 0.2 * Math.sin((t * k.TAU) / 2.4);

    ctx.save();

    // hover halesi
    if (glowL > 0) {
      k.glow(0, 0, 130, p.color, 0.45 * glowL);
      ctx.strokeStyle = k.rgba(p.color, 0.7 * glowL);
      ctx.lineWidth = 6 * glowL + 1;
      ctx.beginPath(); k.rrect(-W / 2 - 8, -H / 2 - 8, W + 16, H + 16, R + 8); ctx.stroke();
    }

    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-W / 2 + 6, -H / 2 + 6, W, H, R); ctx.fill();
    // gövde
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.stroke();
    // sol üst parlama (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(-W / 2 + 46, -H / 2 + 22, 58, 18, -0.35, 0, k.TAU);
    ctx.fill();
    // iç vurgu çizgisi (hover'da renk alır)
    ctx.fillStyle = k.rgba(p.color, 0.35 + 0.65 * glowL);
    ctx.beginPath(); k.rrect(-W / 2 + 22, -12, W - 44, 24, 12); ctx.fill();

    // idle yıldız parıltısı (sol üst)
    ctx.fillStyle = k.rgba('ink', twinkle);
    const sx = -W / 2 + 26, sy = -H / 2 + 22;
    ctx.beginPath();
    ctx.moveTo(sx - 9, sy); ctx.lineTo(sx - 2, sy - 2); ctx.lineTo(sx, sy - 9);
    ctx.lineTo(sx + 2, sy - 2); ctx.lineTo(sx + 9, sy); ctx.lineTo(sx + 2, sy + 2);
    ctx.lineTo(sx, sy + 9); ctx.lineTo(sx - 2, sy + 2);
    ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};
