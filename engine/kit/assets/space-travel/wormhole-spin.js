// space-travel/wormhole-spin — dönen solucan deliği portalı: eğik spiral halkalar
// sürekli döner, merkez nabız gibi atan parlak çekirdek (canlı idle).
// NOT: canvas y-aşağıdır; (0,0) portal merkezidir.
export default {
  name: 'wormhole-spin', category: 'space-travel',
  desc: 'Dönen solucan deliği portalı: spiral enerji halkaları ve nabız gibi atan parlak merkez',
  tags: ['solucan deliği', 'portal', 'uzay', 'uzay yolculuğu', 'dönme', 'girdap', 'uzay portalı', 'wormhole', 'portal', 'space travel', 'spin', 'vortex', 'warp'],
  box: [-170, -120, 170, 120],
  bleed: 40,
  anchor: 'portal merkezi (0,0)',
  points: { center: [0, 0], rim: [138, 0] },
  params: {
    speed: { type: 'number', default: 0.6, desc: '0-1: dönüş hızı' },
  },
  draw(ctx, t, p, k) {
    const sp = k.clamp(p.speed, 0, 1);
    const rot = t * (0.5 + 2.4 * sp);      // sürekli dönüş açısı (canlı idle)
    const TILT = 0.62;                      // portal eğimi
    const R = 132;
    const LW = 8;                           // dış hat kalınlığı
    const line = k.rgba('bg', 0.55);
    ctx.save();

    // dış enerji halesi
    k.glow(0, 0, R * 1.6, 'purple', 0.32);

    // spiral kollar: merkezden dışa akan enerji noktaları (3 kol)
    for (let a = 0; a < 3; a++) {
      const base = rot + a * k.TAU / 3;
      for (let s = 0; s < 16; s++) {
        const u = s / 15;                                   // 0 merkez → 1 dış kenar
        const ang = base + u * 3.4;                         // spiral sarımı
        const r = 32 + u * (R - 38);
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r * TILT;
        const tw = 0.5 + 0.5 * k.noise1(t * 6 + a * 11 + s * 1.9);
        const sz = 2.5 + 8 * (1 - u) * (0.6 + 0.4 * tw);
        ctx.fillStyle = k.rgba('purple', (0.3 + 0.6 * tw) * (1 - u * 0.45));
        ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      }
    }

    // eşmerkezli halkalar: her halkada dönen parlak yay (idle)
    const rings = [56, 90, 122];
    for (let i = 0; i < 3; i++) {
      const rr = rings[i];
      // halka gövdesi (dış hat + renk)
      ctx.strokeStyle = line; ctx.lineWidth = LW + 5;
      ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * TILT, 0, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('purple', 0.35);
      ctx.lineWidth = LW - 3;
      ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * TILT, 0, 0, k.TAU); ctx.stroke();
      // dönen parlak yay + ucundaki düğüm
      const a0 = rot * (1 + i * 0.35) + i * 1.1;
      ctx.strokeStyle = k.rgba('purple', 0.9);
      ctx.lineWidth = LW - 2;
      ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * TILT, 0, a0, a0 + 1.3); ctx.stroke();
      const nx = Math.cos(a0 + 1.3) * rr, ny = Math.sin(a0 + 1.3) * rr * TILT;
      k.glow(nx, ny, 24, 'purple', 0.5);
      ctx.fillStyle = k.rgba('purple', 0.95);
      ctx.beginPath(); ctx.arc(nx, ny, 7, 0, k.TAU); ctx.fill();
    }

    // merkez çekirdek: nabızla parlar (canlı idle)
    const pulse = 0.5 + 0.5 * Math.sin(t * 5.2);
    k.glow(0, 0, 84, 'purple', 0.42 + 0.22 * pulse);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 30 * TILT, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('purple', 0.95);
    ctx.beginPath(); ctx.ellipse(0, 0, 30 - LW / 2, 30 * TILT - LW / 2, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst, beyaz alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-9, -8, 12, 6, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
