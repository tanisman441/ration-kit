// nature-fx/waves — üst üste iki dalga bandı; faz döngüsüyle sürekli dalgalanma, köpük çizgisi.
// NOT: canvas y-aşağıdır; dalga tepeleri yatay eksende kayar.
export default {
  name: 'waves',
  category: 'nature-fx',
  desc: 'Üst üste iki dalga bandı; faz döngüsüyle sürekli dalgalanan köpüklü su yüzeyi',
  tags: ['dalga', 'deniz', 'okyanus', 'köpük', 'su', 'wave', 'sea', 'ocean', 'surf', 'water'],
  box: [-160, -90, 160, 120],
  bleed: 20,
  anchor: 'dalga merkezi (0,15)',
  points: { crest: [0, -60], trough: [0, 90] },
  params: {
    color: { type: 'color', default: 'dim' },
    water: { type: 'color', default: 'cyan' },
    swell: { type: 'number', default: 0.6, desc: 'dalga yüksekliği 0–1: genlik ve hız' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const swell = k.clamp(p.swell, 0, 1);
    const A1 = 14 + 26 * swell, A2 = 9 + 16 * swell;
    const sp1 = 1.6 + swell * 1.4, sp2 = 2.3 + swell * 1.6;

    // arka dalga bandı (daha koyu, yüksekte)
    const wavePath = (baseY, amp, sp, phase, widen) => {
      ctx.beginPath();
      ctx.moveTo(-170, 130);
      ctx.lineTo(-170, baseY + Math.sin(-170 * 0.028 + t * sp + phase) * amp);
      for (let x = -170; x <= 170; x += 10) {
        ctx.lineTo(x, baseY + Math.sin(x * 0.028 + t * sp + phase) * amp);
      }
      ctx.lineTo(170, 130); ctx.closePath();
    };
    wavePath(-30, A1, sp1, 0, 1);
    ctx.fillStyle = line; ctx.fill();
    wavePath(-30, A1, sp1, 0, 1);
    ctx.fillStyle = darker(p.water); ctx.fill();
    // arka band parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-100, -34, 60, 9, -0.1, 0, k.TAU); ctx.fill();

    // ön dalga bandı (ana gövde)
    wavePath(28, A2, sp2, 1.7, 1);
    ctx.fillStyle = line; ctx.fill();
    wavePath(28, A2, sp2, 1.7, 1);
    ctx.fillStyle = k.rgba(p.water, 0.92); ctx.fill();
    // ön band parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-80, 22, 56, 8, -0.12, 0, k.TAU); ctx.fill();

    // köpük çizgisi: ön dalganın üst kenarında döngüsel kırılan köpük
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath();
    for (let x = -165; x <= 165; x += 9) {
      const y = 28 + Math.sin(x * 0.028 + t * sp2 + 1.7) * A2 - 4;
      const fx = 28 + Math.sin(x * 0.028 + t * sp2 + 1.7) * A2 - 4 + k.noise1(t * 4 + x * 0.08) * 6;
      if (x === -165) ctx.moveTo(x, fx); else ctx.lineTo(x, fx);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color, 0.9); ctx.lineWidth = 6.5;
    ctx.beginPath();
    for (let x = -165; x <= 165; x += 9) {
      const fx = 28 + Math.sin(x * 0.028 + t * sp2 + 1.7) * A2 - 4 + k.noise1(t * 4 + x * 0.08) * 6;
      if (x === -165) ctx.moveTo(x, fx); else ctx.lineTo(x, fx);
    }
    ctx.stroke();

    // köpük damlacıkları: tepeden sıçrayan, döngüsel
    for (let i = 0; i < 10; i++) {
      const cyc = 1.1;
      const ph = ((t * (0.9 + k.hash(i * 3.3 + 5) * 0.6) + k.hash(i * 6.1 + 5) * cyc) % cyc) / cyc;
      const x = -140 + k.hash(i * 8.7 + 5) * 280;
      const base = 28 + Math.sin(x * 0.028 + t * sp2 + 1.7) * A2;
      const y = base - 4 - ph * 34;
      ctx.fillStyle = k.rgba(p.color, 0.8 * (1 - ph));
      ctx.beginPath(); ctx.arc(x + k.noise1(t * 3 + i * 2) * 6, y, 2 + (1 - ph) * 3.2, 0, k.TAU); ctx.fill();
    }
  },
};
