// icons/cross — kırmızı çarpı rozeti; pop anında yaylı giriş + hafif dönüş oturması.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) rozet merkezidir.
export default {
  name: 'cross',
  category: 'icons',
  desc: 'Kırmızı daire rozet içinde kalın çarpı işareti; pop anında yaylanarak belirir',
  tags: ['çarpı', 'hata', 'cross', 'x mark', 'yanlış', 'wrong', 'iptal', 'cancel', 'icon'],
  box: [-100, -100, 100, 100],
  bleed: 40,
  anchor: 'rozet merkezi (0,0)',
  points: { top: [0, -70], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'red', desc: 'rozet rengi' },
    pop: { type: 'time', default: null, desc: 'giriş anı: 0.35 sn yaylanma' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    // ANIMASYON — pop: 0.35 sn sönümlü yaylanma + küçük dönüş oturması
    const d = p.pop == null ? -1 : t - p.pop;
    let s = 1, rot = 0;
    if (d >= 0 && d < 0.5) {
      s = 1 - Math.exp(-12 * d) * Math.cos(22 * d);
      rot = 0.35 * Math.exp(-8 * d) * Math.cos(18 * d);
    }
    ctx.save(); ctx.rotate(rot); ctx.scale(s, s);
    // rozet gövdesi (gölge + hat + dolgu)
    ctx.fillStyle = sh(p.color); ctx.beginPath(); ctx.arc(6, 7, 70, 0, k.TAU); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O; ctx.beginPath(); ctx.arc(0, 0, 73, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-24, -30, 22, 13, -0.5, 0, k.TAU); ctx.fill();
    // çarpı işareti
    ctx.strokeStyle = k.rgba('bg'); ctx.lineWidth = 22;
    ctx.beginPath(); ctx.moveTo(-26, -26); ctx.lineTo(26, 26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26, -26); ctx.lineTo(-26, 26); ctx.stroke();
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
