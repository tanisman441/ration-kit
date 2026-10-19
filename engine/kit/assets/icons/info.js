// icons/info — mavi bilgi dairesi; "i" boşta hafif nabızla parlar.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) daire merkezidir.
export default {
  name: 'info',
  category: 'icons',
  desc: 'Mavi daire içinde bilgi "i"si; boşta hafifçe nabız gibi büyüyüp küçülür',
  tags: ['bilgi', 'info', 'information', 'bilgilendirme', 'ipucu', 'hint', 'icon'],
  box: [-100, -100, 100, 100],
  bleed: 40,
  anchor: 'daire merkezi (0,0)',
  points: { top: [0, -70], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'daire rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    // ANIMASYON — idle: 2.4 sn periyotla hafif nabız (±1.5 birim) + soluyan glow
    const pulse = 0.5 + 0.5 * Math.sin((t / 2.4) * k.TAU);
    const s = 1 + 0.02 * Math.sin((t / 2.4) * k.TAU);
    ctx.save(); ctx.scale(s, s);
    // daire gövdesi (gölge + hat + dolgu)
    ctx.fillStyle = sh(p.color); ctx.beginPath(); ctx.arc(6, 7, 70, 0, k.TAU); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O; ctx.beginPath(); ctx.arc(0, 0, 73, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-24, -30, 22, 13, -0.5, 0, k.TAU); ctx.fill();
    // "i" işareti (gövde + nokta)
    ctx.fillStyle = k.rgba('bg');
    ctx.beginPath(); k.rrect(-9, -6, 18, 40, 9); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -28, 10, 0, k.TAU); ctx.fill();
    ctx.restore();
    k.glow(0, 0, 70, p.color, 0.10 + 0.12 * pulse);
  },
};
