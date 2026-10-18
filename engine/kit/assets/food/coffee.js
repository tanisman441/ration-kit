// food/coffee — üstten hafif açılı kahve fincanı; steam anında yoğun buhar yükselir
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) fincanın merkezidir.
export default {
  name: 'coffee', category: 'food',
  desc: 'Üstten hafif açılı kahve fincanı; steam anında yoğun buhar yükselir, yüzeyde dalgalanma olur',
  tags: ['kahve', 'fincan', 'coffee', 'cup', 'buhar', 'steam', 'içecek', 'espresso'],
  box: [-80, -90, 80, 90],
  bleed: 50,
  anchor: 'fincanın merkezi (0,0)',
  points: { top: [0, -58] },
  params: {
    steam: { type: 'time', default: null, desc: 'buhar anı (yoğun buhar yükselir, 1.2 sn)' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const cup = k.rgba('panel2'), coffee = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.steam == null ? -1 : t - p.steam;

    // steam olayı: 0→1.2 sn yoğun buhar
    const burst = d >= 0 && d < 1.2 ? Math.sin(Math.PI * d / 1.2) : 0;
    const steamAmp = 0.55 + 0.45 * burst;

    // yüzey dalgalanması (idle): kahve elipsi hafif nefes alır
    const ripple = Math.sin(t * 2.6) * 2;

    const breathe = Math.sin(t * 1.7) * 1.5; // fincan hafif nefes

    ctx.save();
    ctx.translate(0, breathe);

    // tabak (alt elips)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(7, 52, 62, 15, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.ellipse(0, 46, 62, 15, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.ellipse(0, 46, 62, 15, 0, 0, k.TAU); ctx.stroke();

    // kulp (sağda)
    ctx.strokeStyle = line; ctx.lineWidth = LW + 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(56, 8, 20, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = cup; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.arc(56, 8, 20, -1.2, 1.2); ctx.stroke();

    // fincan gövdesi (trapez)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(-47, -32); ctx.lineTo(47, -32); ctx.lineTo(38, 44); ctx.lineTo(-38, 44);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = cup;
    ctx.beginPath();
    ctx.moveTo(-52, -38); ctx.lineTo(52, -38); ctx.lineTo(40, 40); ctx.lineTo(-40, 40);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();
    // fincan bandı (vurgu)
    ctx.fillStyle = coffee;
    k.rrect(-46, -12, 92, 18, 9); ctx.fill();

    // kahve yüzeyi (üst elips, hafif açılı)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(5, -36 + ripple, 47, 13, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(72,46,30,0.96)'; // kahve: iki temada da koyu
    ctx.beginPath(); ctx.ellipse(0, -38 + ripple, 46, 12, 0, 0, k.TAU); ctx.fill();
    // yüzey parlaması (krema halkası)
    ctx.strokeStyle = k.rgba(p.color, 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(-6, -38 + ripple, 30, 7, -0.15, 0.3, Math.PI - 0.4); ctx.stroke();
    // premium parlama (sol üst gövde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -20, 10, 22, 0.25, 0, k.TAU); ctx.fill();

    ctx.restore();

    // buhar: 4 kıvrım, burst'te yoğun ve hızlı
    ctx.strokeStyle = k.rgba('dim', 0.4); ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const cyc = 2.2 / steamAmp;
      const ph = ((t * (1 + burst * 0.8) + i * cyc / 4) % cyc) / cyc;
      const sy = -52 - ph * 52;
      const sx = -33 + i * 22 + Math.sin(t * 2.5 + i * 2.1) * 7;
      ctx.globalAlpha = Math.min(0.55, 0.55 * (1 - ph) * steamAmp);
      ctx.lineWidth = 4 + burst * 2.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(sx + 10, sy - 10, sx + Math.sin(t * 3.4 + i * 1.7) * 6, sy - 20);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  },
};
