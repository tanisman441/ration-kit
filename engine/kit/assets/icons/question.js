// icons/question — mor soru dairesi; "?" boşta hafifçe zıplar (kafa karışıklığı).
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) daire merkezidir.
export default {
  name: 'question',
  category: 'icons',
  desc: 'Mor daire içinde soru işareti; işaret boşta hafifçe zıplayarak "kafa karışıklığı" yapar',
  tags: ['soru', 'question', 'soru işareti', 'question mark', 'yardım', 'help', 'icon'],
  box: [-100, -100, 100, 100],
  bleed: 40,
  anchor: 'daire merkezi (0,0)',
  points: { top: [0, -70], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'purple', desc: 'daire rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    // ANIMASYON — idle: soru işareti 1.6 sn'de bir yukarı zıplar + hafif sallanma
    const hop = -14 * Math.pow(Math.abs(Math.sin((t / 1.6) * k.TAU / 2)), 1.5);
    const wob = 0.07 * Math.sin((t / 1.6) * k.TAU);
    // daire gövdesi (gölge + hat + dolgu)
    ctx.fillStyle = sh(p.color); ctx.beginPath(); ctx.arc(6, 7, 70, 0, k.TAU); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O; ctx.beginPath(); ctx.arc(0, 0, 73, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-24, -30, 22, 13, -0.5, 0, k.TAU); ctx.fill();
    // "?" işareti (zıplayan + sallanan)
    ctx.save(); ctx.translate(0, hop); ctx.rotate(wob);
    ctx.strokeStyle = k.rgba('bg'); ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(-14, -30);
    ctx.bezierCurveTo(-14, -52, 26, -52, 26, -28);
    ctx.bezierCurveTo(26, -10, 10, -6, 6, 6);
    ctx.lineTo(6, 16);
    ctx.stroke();
    ctx.fillStyle = k.rgba('bg');
    ctx.beginPath(); ctx.arc(6, 36, 9, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
