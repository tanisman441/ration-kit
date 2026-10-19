// icons/warning — sarı üçgen uyarı işareti; pulse anında sarsıntı + yanıp sönen glow.
// Orijinal tasarım.
// NOT: canvas y-aşağıdır; (0,0) üçgenin ağırlık merkezine yakındır.
export default {
  name: 'warning',
  category: 'icons',
  desc: 'Sarı uyarı üçgeni içinde ünlem; pulse anında sarsılır ve yanıp söner',
  tags: ['uyarı', 'üçgen', 'warning', 'alert', 'ünlem', 'exclamation', 'dikkat', 'caution', 'icon'],
  box: [-95, -95, 95, 95],
  bleed: 60,
  anchor: 'üçgen merkezi (0,0)',
  points: { top: [0, -64], center: [0, 8] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'üçgen rengi' },
    pulse: { type: 'time', default: null, desc: 'uyarı anı: 0.6 sn sarsıntı + flaş' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const tri = (x0, y0, x1, y1, x2, y2) => {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.closePath();
    };
    // ANIMASYON — pulse: 0.6 sn yatay sarsıntı + yanıp sönen glow
    const d = p.pulse == null ? -1 : t - p.pulse;
    let shake = 0, flash = 0;
    if (d >= 0 && d < 0.6) {
      const g = d / 0.6;
      shake = 10 * Math.exp(-6 * d) * Math.sin(30 * d);
      flash = Math.abs(Math.sin(d * 22)) * (1 - g);
    }
    // idle: hafif salınım
    const sway = 2 * Math.sin((t / 2.4) * k.TAU);
    ctx.save(); ctx.translate(shake, sway);
    // üçgen gövdesi (gölge + hat + dolgu)
    ctx.fillStyle = sh(p.color); tri(6, -57, -64, 61, 70, 61); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O; tri(0, -62, -60, 56, 60, 56); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color); tri(0, -62, -60, 56, 60, 56); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-8, -12, 12, 6.5, -0.5, 0, k.TAU); ctx.fill();
    // ünlem (çubuk + nokta)
    ctx.fillStyle = k.rgba('bg');
    ctx.beginPath(); k.rrect(-8, -28, 16, 44, 8); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 34, 9, 0, k.TAU); ctx.fill();
    ctx.restore();
    // pulse flaşı: sarsıntıyla senkron yanıp sönen glow
    if (flash > 0.01) k.glow(shake, 0, 120, p.color, 0.45 * flash);
  },
};
