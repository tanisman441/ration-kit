// icons/check — yeşil onay rozeti; pop anında yaylı giriş yapar.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) rozet merkezidir.
export default {
  name: 'check',
  category: 'icons',
  desc: 'Yeşil daire rozet içinde kalın tik işareti; pop anında yaylanarak belirir',
  tags: ['tik', 'onay', 'check', 'checkmark', 'doğru', 'correct', 'ok', 'icon'],
  box: [-100, -100, 100, 100],
  bleed: 40,
  anchor: 'rozet merkezi (0,0)',
  points: { top: [0, -70], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'green', desc: 'rozet rengi' },
    pop: { type: 'time', default: null, desc: 'giriş anı: 0.35 sn yaylanma' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    // ANIMASYON — pop: 0.35 sn sönümlü yaylanma ile giriş (d<0 ise dinlenme)
    const d = p.pop == null ? -1 : t - p.pop;
    let s = 1;
    if (d >= 0 && d < 0.5) s = 1 - Math.exp(-12 * d) * Math.cos(22 * d);
    // rozet gövdesi (gölge + hat + dolgu)
    ctx.save(); ctx.scale(s, s);
    ctx.fillStyle = sh(p.color); ctx.beginPath(); ctx.arc(6, 7, 70, 0, k.TAU); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O; ctx.beginPath(); ctx.arc(0, 0, 73, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-24, -30, 22, 13, -0.5, 0, k.TAU); ctx.fill();
    // tik işareti
    ctx.strokeStyle = k.rgba('bg'); ctx.lineWidth = 22;
    ctx.beginPath(); ctx.moveTo(-30, 2); ctx.lineTo(-8, 26); ctx.lineTo(36, -28); ctx.stroke();
    ctx.restore();
    // pop patlaması: genişleyen halka + glow (0.35 sn)
    if (d >= 0 && d < 0.35) {
      const g = d / 0.35;
      k.glow(0, 0, 110 * (1 - g) + 40, p.color, 0.5 * (1 - g));
      ctx.strokeStyle = k.rgba(p.color, 0.85 * (1 - g)); ctx.lineWidth = 6 * (1 - g) + 2;
      ctx.beginPath(); ctx.arc(0, 0, 78 + g * 70, 0, k.TAU); ctx.stroke();
    }
  },
};
