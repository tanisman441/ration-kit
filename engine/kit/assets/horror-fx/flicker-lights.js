// horror-fx/flicker-lights — tavandan sarkan korku lambası: sürekli loş titreme + sert strobe olayı.
// NOT: canvas y-aşağıdır; (0,0) armatür merkezidir, kablo yukarı gider.
export default {
  name: 'flicker-lights', category: 'horror-fx',
  desc: 'Tavandan sarkan lamba: sürekli loş titreyen ışık; at anında 1.2 sn sert strobe patlaması',
  tags: ['titreyen ışık', 'lamba', 'korku', 'strobe', 'elektrik arızası', 'sarkıt lamba', 'flicker', 'horror light', 'lamp', 'strobe light', 'flickering'],
  box: [-100, -110, 100, 110],
  bleed: 30,
  anchor: 'lamba armatürünün merkezi (0,0)',
  points: { bulb: [0, 10], cable_top: [0, -110], cone_bottom: [0, 100] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'sert titreme olayı: 1.2 sn strobe, sonra loş idle\'a dönüş' },
    intensity: { type: 'number', default: 0.65, desc: '0.2–1: loşluk seviyesi (idle parlaklığı)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.intensity, 0.2, 1);
    ctx.save();

    // --- ışık seviyesi: idle loş titreme / olay anında sert strobe ---
    let I;
    if (d < 0 || d > 1.2) {
      I = S * (0.85 + 0.15 * k.noise1(t * 3.7));            // sürekli loş titreme
      const cyc = t % 9, h = k.hash(Math.floor(t / 9));     // nadir kısa kesinti
      if (h < 0.45 && cyc < 0.18) I *= 0.12;
    } else {
      const strobe = k.noise1(d * 42);                      // 1.2 sn sert strobe
      I = strobe > 0.25 ? (0.55 + 0.45 * k.noise1(d * 9)) : 0.04;
      I *= 1 - 0.45 * k.prog(d, 0.7, 1.2);
    }
    I = k.clamp(I, 0, 1);

    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    // --- ışık konisi (ampulün altı) ---
    ctx.fillStyle = k.rgba(p.color, 0.10 * I);
    ctx.beginPath();
    ctx.moveTo(-8, 18); ctx.lineTo(8, 18); ctx.lineTo(55, 102); ctx.lineTo(-55, 102);
    ctx.closePath(); ctx.fill();

    // --- tavan rozeti + kablo (serbest çizgi: ink) ---
    ctx.fillStyle = darker('dim');
    k.rrect(-16 + 6, -110 + 6, 32, 14, 6); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-16, -110, 32, 14, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -100); ctx.lineTo(0, -52); ctx.stroke();

    // --- abajur: yamuk gövde + gölge + parlama ---
    const shade = () => {
      ctx.beginPath();
      ctx.moveTo(-58, -8); ctx.lineTo(58, -8); ctx.lineTo(36, -52); ctx.lineTo(-36, -52);
      ctx.closePath();
    };
    ctx.save(); ctx.translate(6, 6); ctx.fillStyle = darker('dim'); shade(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('dim'); shade(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.lineJoin = 'round'; shade(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';               // sol üst parlama (premium finish)
    ctx.beginPath(); ctx.ellipse(-30, -38, 14, 6, -0.3, 0, k.TAU); ctx.fill();

    // --- ampul: renk yoğunluğu titremeyle ---
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 10, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.25 + 0.75 * I);
    ctx.beginPath(); ctx.arc(0, 10, 10, 0, k.TAU); ctx.fill();
    k.glow(0, 10, 36, k.col(p.color), 0.45 * I);

    ctx.restore();
  },
};
