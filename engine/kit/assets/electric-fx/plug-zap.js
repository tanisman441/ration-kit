// electric-fx/plug-zap — elektrik fişi; zap anında uçlardan kıvılcım patlar.
// ANIMASYON: `zap` zamanında 0.18 sn flaş + uçlardan saçılan yıldız kıvılcımlar.
// Tek vurgu: yellow. Contract: engine/kit/ASSETS.md
export default {
  name: 'plug-zap',
  category: 'electric-fx',
  desc: 'İki uçlu elektrik fişi; zap anında uçlardan kıvılcım patlaması olur',
  tags: ['fiş', 'priz', 'kıvılcım', 'elektrik', 'kablo', 'çarpma', 'plug', 'zap', 'spark', 'socket', 'electric', 'cable'],
  box: [-110, -60, 60, 60],
  bleed: 60,
  anchor: 'fiş gövde merkezi (-50,0)',
  points: { tip_a: [24, -16], tip_b: [24, 16], cable: [-108, 0] },
  params: {
    zap: { type: 'time', default: null, desc: 'kıvılcım anı: 0.18 sn flaş + uçlardan saçılma' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.zap == null ? -1 : t - p.zap;
    const zapping = d >= 0 && d < 0.22;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- kablo (serbest çizgi: ink, alfa 0.55-0.8) ---
    ctx.strokeStyle = k.rgba('ink', 0.65);
    ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-106, 0); ctx.lineTo(-78, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.3);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-104, -2); ctx.lineTo(-80, -2); ctx.stroke();

    // --- fiş gövdesi: gölge, gövde, parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-78 + 6, -32 + 6, 56, 64, 15); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-78, -32, 56, 64, 15); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-64, -20, 9, 12, 0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-78, -32, 56, 64, 15); ctx.stroke();
    // gövde olukları
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(-64 + i * 12, -20); ctx.lineTo(-64 + i * 12, 20); ctx.stroke();
    }

    // --- metal uçlar ---
    for (const ty of [-16, 16]) {
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); k.rrect(-22, ty - 6, 44, 12, 5); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);
      ctx.beginPath(); ctx.ellipse(-12, ty - 2, 6, 2.5, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); k.rrect(-22, ty - 6, 44, 12, 5); ctx.stroke();
    }

    // --- idle: uçlarda hafif şarj parıltısı ---
    if (!zapping) {
      const sh = 0.10 + 0.07 * (0.5 + 0.5 * k.noise1(t * 2.6 + 1.2));
      k.glow(22, -16, 16, p.color, sh);
      k.glow(22, 16, 16, p.color, sh);
    }

    // --- zap: flaş + yıldız kıvılcımlar ---
    if (zapping) {
      const env = 1 - k.prog(d, 0, 0.2);
      const fr = Math.floor(d / 0.05);
      for (const ty of [-16, 16]) {
        k.glow(22, ty, 30, p.color, 0.5 * env);
        for (let i = 0; i < 5; i++) {
          const a = k.hash(i * 17 + fr * 7 + (ty > 0 ? 50 : 0)) * k.TAU;
          const rr = (10 + k.hash(i * 11 + fr * 3) * 34) * env;
          const x2 = 22 + Math.cos(a) * rr, y2 = ty + Math.sin(a) * rr;
          const mid = 0.5 + 0.5 * k.hash(i * 5 + fr);
          ctx.strokeStyle = k.rgba(p.color, 0.9 * env);
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(22, ty);
          ctx.lineTo(22 + (x2 - 22) * mid, ty + (y2 - ty) * mid);
          ctx.stroke();
          ctx.fillStyle = k.rgba('#ffffff', 0.85 * env);
          ctx.beginPath(); ctx.arc(x2, y2, 2.4, 0, k.TAU); ctx.fill();
        }
      }
      // uçlar arası mini ark
      ctx.strokeStyle = k.rgba('#ffffff', 0.9 * env);
      ctx.lineWidth = 3;
      const wob = (k.hash(fr * 29) - 0.5) * 12;
      ctx.beginPath(); ctx.moveTo(22, -16); ctx.quadraticCurveTo(28 + wob, 0, 22, 16); ctx.stroke();
    }
  },
};
