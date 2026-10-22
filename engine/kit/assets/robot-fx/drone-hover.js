// robot-fx/drone-hover — havada asılı duran quadcopter drone. Contract: engine/kit/ASSETS.md
export default {
  name: 'drone-hover', category: 'robot-fx',
  desc: 'Havada asılı duran dört pervaneli drone; pervane dönüşü, süzülme ve LED animasyonlu',
  tags: ['drone', 'insansız hava aracı', 'uçan robot', 'pervane', 'hover', 'quadcopter', 'uçuş', 'ihа', 'havada', 'gözlem'],
  box: [-170, -95, 170, 95],
  bleed: 26,
  anchor: 'gövde merkezi (0,0)',
  points: { top: [0, -46], bottom: [0, 62] },
  params: {
    color: { type: 'color', default: 'dim' },
    rotor: { type: 'number', default: 0.7, desc: 'pervane dönüş hızı (0-1)' },
    tilt: { type: 'number', default: 0, desc: 'gövde eğimi (derece)' },
  },
  draw(ctx, t, p, k) {
    const bw = 340, LW = Math.round(bw * 0.03);
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink', 0.75), bodyC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    // süzülme: ~1.5 sn periyotlu bobbing + hafif yanal salınım
    const bob = Math.sin(t * k.TAU / 1.5) * 7;
    const sway = k.noise1(t * 0.7) * 4;
    ctx.translate(sway, bob);
    ctx.rotate((p.tilt ?? 0) * Math.PI / 180);

    const mounts = [[-98, -30], [98, -30]];
    // kollar
    ctx.strokeStyle = inkC; ctx.lineWidth = 10;
    ctx.beginPath();
    for (const [mx, my] of mounts) { ctx.moveTo(mx * 0.55, 6); ctx.lineTo(mx, my + 14); }
    ctx.stroke();
    // kol uçlarında motor kaidesi
    for (const [mx, my] of mounts) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(mx, my, 13 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = bodyC;
      ctx.beginPath(); ctx.arc(mx, my, 13, 0, k.TAU); ctx.fill();
    }
    // pervaneler: dönen kanatlar + hareket bulanıklığı
    const spd = (p.rotor ?? 0.7) * 16;
    for (const [mx, my] of mounts) {
      ctx.fillStyle = k.rgba('cyan', 0.14);
      ctx.beginPath(); ctx.ellipse(mx, my - 8, 58, 13, 0, 0, k.TAU); ctx.fill();
      const a0 = t * spd;
      for (let i = 0; i < 3; i++) {
        const a = a0 + i * k.TAU / 3;
        ctx.strokeStyle = k.rgba('ink', 0.42); ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(mx - Math.cos(a) * 52, my - 8 - Math.sin(a) * 9);
        ctx.lineTo(mx + Math.cos(a) * 52, my - 8 + Math.sin(a) * 9);
        ctx.stroke();
      }
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(mx, my - 8, 7 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = bodyC;
      ctx.beginPath(); ctx.arc(mx, my - 8, 7, 0, k.TAU); ctx.fill();
    }

    // gövde: dış hat + dolgu + gölge + parlama (premium)
    const bx = -75, by = -26, bw2 = 150, bh = 64, br = 22;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(bx + 6, by + 6, bw2, bh, br); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(bx - LW / 2, by - LW / 2, bw2 + LW, bh + LW, br + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(bx, by, bw2, bh, br); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(bx + bw2 * 0.32, by + 13, bw2 * 0.28, 10, -0.25, 0, k.TAU); ctx.fill();

    // ön LED: yanıp sönme
    const ledOn = Math.sin(t * k.TAU * 1.6) > -0.2;
    if (ledOn) k.glow(52, 8, 16, 'cyan', 0.45);
    ctx.fillStyle = k.rgba('cyan', ledOn ? 1 : 0.25);
    ctx.beginPath(); ctx.arc(52, 8, 7, 0, k.TAU); ctx.fill();

    // kamera: alt gimbal + lens
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(-8, 44, 17 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(-8, 44, 17, 0, k.TAU); ctx.fill();
    k.glow(-8, 44, 14, 'cyan', 0.35);
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(-8, 44, 7, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(-11, 41, 2.6, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
