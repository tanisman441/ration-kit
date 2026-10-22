// classroom-fx/paper-plane — süzülen kağıt uçak: idle'da hafif yunuslama ve burun salınımı
// + kanat çırpınma titremesi; fly anında ileri fırlama (0.7 sn) + cyan hız izi ve rüzgâr çizgileri.
// canvas y-aşağı; (0,0) uçak merkezi.
export default {
  name: 'paper-plane', category: 'classroom-fx',
  desc: 'Süzülen kağıt uçak: idle salınım + fly anında hız iziyle ileri fırlama',
  tags: ['kağıt uçak', 'uçak', 'süzülme', 'uçma', 'paper plane', 'plane', 'fly', 'glide', 'oyun', 'play'],
  box: [-100, -60, 100, 60],
  bleed: 70,
  anchor: 'uçak merkezi',
  points: { nose: [64, 0], tail: [-50, 4] },
  params: {
    color: { type: 'color', default: 'panel2', desc: 'kağıt rengi' },
    fly: { type: 'time', default: null, desc: 'fırlama anı — 0.7 sn ileri süzülme + iz' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.fly == null ? -1 : t - p.fly;
    const bob = 6 * Math.sin(t * 1.8), sway = 0.07 * Math.sin(t * 1.3);
    let px = 0, py = bob, rot = sway, boost = 0;
    if (d >= 0 && d < 0.9) {
      const g = k.prog(d, 0, 0.7), e = k.E.outCubic(g);
      px = 62 * e;
      py += -15 * Math.sin(g * Math.PI);
      rot = sway + 0.16 * Math.sin(g * Math.PI);
      boost = 1 - g;
    }

    // hız izi: geride kalan noktalar boyunca solan cyan iz + rüzgâr çizgileri
    if (d >= 0 && d < 0.9) {
      for (let i = 0; i < 14; i++) {
        const lag = i * 0.05, dd = d - lag;
        if (dd < 0) continue;
        const gg = k.prog(dd, 0, 0.7), ee = k.E.outCubic(gg);
        const tx = 62 * ee - 8, ty = 6 * Math.sin((t - lag) * 1.8) - 15 * Math.sin(gg * Math.PI);
        const a = 0.55 * (1 - i / 14) * (1 - gg);
        if (a <= 0.01) continue;
        ctx.fillStyle = k.rgba('cyan', a);
        ctx.beginPath(); ctx.arc(tx, ty, 4.5 * (1 - i / 16) + 1, 0, k.TAU); ctx.fill();
      }
      for (let i = 0; i < 4; i++) {
        const h = k.hash(i * 53 + 11);
        const ly = -38 + h * 76, lx = px - 40 - h * 60 - d * 260;
        if (lx < -160) continue;
        ctx.strokeStyle = k.rgba('cyan', 0.5 * boost);
        ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 34, ly); ctx.stroke();
      }
    }

    ctx.translate(px, py); ctx.rotate(rot);
    // kanat çırpınma titremesi (idle hareket)
    const flap = 4 * Math.sin(t * 6.2);

    // gölge (sağ alt)
    const shadow = (fn) => { ctx.fillStyle = k.rgba('bg', 0.12); ctx.beginPath(); fn(5, 5); ctx.closePath(); ctx.fill(); };
    shadow((ox, oy) => {
      ctx.moveTo(64 + ox, oy); ctx.lineTo(-50 + ox, -8 + flap + oy); ctx.lineTo(-50 + ox, 16 + oy);
    });

    // gövde (dart üçgeni)
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(64, 0); ctx.lineTo(-50, -8 + flap); ctx.lineTo(-50, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath();
    ctx.moveTo(60, 0); ctx.lineTo(-46, -6 + flap); ctx.lineTo(-46, 13); ctx.closePath(); ctx.fill();
    // üst kanat (geriye süpürülmüş)
    ctx.beginPath();
    ctx.moveTo(60, 0); ctx.lineTo(-26, -34 + flap * 0.7); ctx.lineTo(-46, -6 + flap); ctx.closePath();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke();
    // kat çizgisi (iç ayrım, ink ince)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(52, 2); ctx.lineTo(-42, 6); ctx.stroke();
    // burun vurgusu
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(60, 0); ctx.lineTo(48, 2); ctx.stroke();
    // premium parlama (kanat sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-6, -18 + flap * 0.4, 18, 6, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
