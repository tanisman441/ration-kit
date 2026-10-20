// nature-cycle/day-night — gündüz/gece döngüsü: güneş batar, ay doğar, yıldızlar belirir.
// NOT: canvas y-aşağıdır; güneş aşağı (y artışı yönüne) batar, ay yukarı doğar.
export default {
  name: 'day-night', category: 'nature-cycle',
  desc: 'Gündüz-gece döngüsü: cycle anında güneş batıp ay doğar, yıldızlar belirir',
  tags: ['gündüz', 'gece', 'gün', 'döngü', 'güneş', 'ay', 'yıldız', 'day', 'night', 'cycle', 'sun', 'moon', 'stars'],
  box: [-170, -140, 170, 140],
  bleed: 40,
  anchor: 'ufuk çizgisi (0,90); sahne merkezi',
  points: { sun: [-25, -55], moon: [85, -60], ground: [0, 95], tree: [-120, 55], sky: [0, -100] },
  params: {
    cycle: { type: 'time', default: null, desc: 'gün→gece geçiş anı: 1.5 sn\'de güneş batar, ay doğar, yıldızlar belirir' },
    sun: { type: 'color', default: 'yellow' },
    ground: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 7;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // geçiş: 0 = gündüz, 1 = gece
    const d = p.cycle == null ? -1 : t - p.cycle;
    const g = d < 0 ? 0 : k.prog(d, 0, 1.5);
    const e = k.E.inOutCubic(g);
    const sunX = -25, moonX = 85;
    const sunY = -55 + e * 195;    // batar (zemin örter)
    const moonY = 140 - e * 200;   // doğar
    const sunA = 1 - e, moonA = e;

    // 1) yıldızlar — gece belirir, boşta titrer
    for (let i = 0; i < 12; i++) {
      let sx = -160 + k.hash(i * 3.17) * 320;
      let sy = -134 + k.hash(i * 7.71) * 150;
      // güneş/ay diskine binerse öbür yana aynala (kutuda kalır)
      if (Math.hypot(sx - sunX, sy - (-55)) < 78) sx = -sx;
      if (Math.hypot(sx - moonX, sy - (-60)) < 62) sx = -sx;
      sx = k.clamp(sx, -162, 162); sy = k.clamp(sy, -134, 120);
      const tw = 0.45 + 0.35 * k.noise1(t * 2 + i * 9.3);
      const r = 2 + k.hash(i * 5.13) * 2.4;
      ctx.fillStyle = k.rgba('ink', g * tw * 0.9);
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, k.TAU); ctx.fill();
    }

    // 2) güneş — ışınlar + disk; boşta nabız gibi ışıma
    if (sunA > 0.02) {
      const pulse = 0.75 + 0.25 * Math.sin(t * (k.TAU / 2.4));
      k.glow(sunX, sunY, 95 * (0.5 + 0.5 * sunA), p.sun, 0.35 * sunA * pulse);
      ctx.strokeStyle = line; ctx.lineWidth = 12;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.15;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(a) * 40, sunY + Math.sin(a) * 40);
        ctx.lineTo(sunX + Math.cos(a) * 62, sunY + Math.sin(a) * 62);
        ctx.stroke();
      }
      ctx.strokeStyle = k.rgba(p.sun, 0.85 * sunA); ctx.lineWidth = 6;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.15;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(a) * 42, sunY + Math.sin(a) * 42);
        ctx.lineTo(sunX + Math.cos(a) * 60, sunY + Math.sin(a) * 60);
        ctx.stroke();
      }
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(sunX, sunY, 33.5, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.sun, sunA);
      ctx.beginPath(); ctx.arc(sunX, sunY, 30, 0, k.TAU); ctx.fill();
      // premium parlama (sol üst)
      ctx.fillStyle = `rgba(255,255,255,${0.11 * sunA})`;
      ctx.beginPath(); ctx.ellipse(sunX - 11, sunY - 12, 14, 8.5, -0.5, 0, k.TAU); ctx.fill();
    }

    // 3) ay — hilal; gece yükselir
    if (moonA > 0.02) {
      const mr = 26;
      k.glow(moonX, moonY, 70, 'dim', 0.3 * moonA);
      ctx.strokeStyle = line; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(moonX, moonY, mr, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = k.rgba('dim', moonA);
      ctx.beginPath();
      ctx.arc(moonX, moonY, mr, 0, k.TAU);
      ctx.arc(moonX + mr * 0.48, moonY - mr * 0.18, mr * 0.88, 0, k.TAU);
      ctx.fill('evenodd');
      ctx.fillStyle = `rgba(255,255,255,${0.10 * moonA})`;
      ctx.beginPath(); ctx.ellipse(moonX - 9, moonY - 11, 10, 6, -0.5, 0, k.TAU); ctx.fill();
    }

    // 4) zemin — batan güneşi örter
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-170, 140); ctx.lineTo(-170, 92);
    ctx.quadraticCurveTo(-100, 72, -30, 90);
    ctx.quadraticCurveTo(40, 104, 110, 84);
    ctx.quadraticCurveTo(150, 74, 170, 90);
    ctx.lineTo(170, 140); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darker(p.ground);
    ctx.beginPath();
    ctx.moveTo(-164, 140); ctx.lineTo(-164, 94);
    ctx.quadraticCurveTo(-100, 75, -30, 92);
    ctx.quadraticCurveTo(40, 106, 110, 86);
    ctx.quadraticCurveTo(150, 77, 164, 92);
    ctx.lineTo(164, 140); ctx.closePath(); ctx.fill();
    // ufuk çizgisi vurgusu
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-164, 94);
    ctx.quadraticCurveTo(-100, 75, -30, 92);
    ctx.quadraticCurveTo(40, 106, 110, 86);
    ctx.quadraticCurveTo(150, 77, 164, 92);
    ctx.stroke();

    // 5) ağaç silueti (solda)
    const tx = -120, ty = 80;
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(tx - 10, ty - 52, 20, 54, 9); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(tx - 7, ty - 50, 14, 52, 7); ctx.fill();
    const blobs = [[tx, ty - 72, 30], [tx - 22, ty - 56, 21], [tx + 22, ty - 56, 21]];
    for (const [bx, by, br] of blobs) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(bx, by, br + 3.5, 0, k.TAU); ctx.fill();
    }
    for (const [bx, by, br] of blobs) {
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); ctx.arc(bx, by, br, 0, k.TAU); ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(tx - 12, ty - 84, 15, 9, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
