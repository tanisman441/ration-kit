// icons/thumbs-up — başparmak rozeti; pop anında yaylı giriş + hafif eğilme.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) rozet merkezidir.
export default {
  name: 'thumbs-up',
  category: 'icons',
  desc: 'Yuvarlak rozet içinde yukarı bakan başparmak; pop anında yaylanarak belirir',
  tags: ['başparmak', 'beğeni', 'thumbs up', 'like', 'onay', 'approve', 'güzel', 'icon'],
  box: [-100, -100, 100, 100],
  bleed: 40,
  anchor: 'rozet merkezi (0,0)',
  points: { top: [0, -70], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'rozet rengi' },
    pop: { type: 'time', default: null, desc: 'giriş anı: 0.35 sn yaylanma' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    // ANIMASYON — pop: 0.35 sn sönümlü yaylanma + hafif eğilme oturması
    const d = p.pop == null ? -1 : t - p.pop;
    let s = 1, tilt = 0;
    if (d >= 0 && d < 0.5) {
      s = 1 - Math.exp(-12 * d) * Math.cos(22 * d);
      tilt = -0.12 * Math.exp(-8 * d) * Math.cos(16 * d);
    }
    ctx.save(); ctx.rotate(tilt); ctx.scale(s, s);
    // rozet gövdesi (gölge + hat + dolgu)
    ctx.fillStyle = sh(p.color); ctx.beginPath(); ctx.arc(6, 7, 70, 0, k.TAU); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O; ctx.beginPath(); ctx.arc(0, 0, 73, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-24, -30, 22, 13, -0.5, 0, k.TAU); ctx.fill();
    // el işareti (yumruk + yukarı başparmak), gölge + ana form
    const fist = (dx, dy) => {
      ctx.beginPath(); k.rrect(-36 + dx, -12 + dy, 66, 56, 20); ctx.fill();          // avuç
      ctx.beginPath(); k.rrect(-30 + dx, -62 + dy, 30, 58, 14); ctx.fill();         // başparmak
      ctx.beginPath(); ctx.arc(32 + dx, 2 + dy, 15, 0, k.TAU); ctx.fill();           // parmak boğumları
      ctx.beginPath(); ctx.arc(32 + dx, 28 + dy, 14, 0, k.TAU); ctx.fill();
    };
    ctx.fillStyle = sh('bg'); fist(5, 7);
    ctx.fillStyle = k.rgba('bg'); fist(0, 0);
    // parmak ayrım çizgisi
    ctx.strokeStyle = k.rgba(p.color, 0.5); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-24, -8); ctx.quadraticCurveTo(-10, 2, -24, 14); ctx.stroke();
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
