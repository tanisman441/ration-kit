// police-fx/megaphone-blast — megafon: at anında ses dalgası halkaları patlar (0.9 sn), koni sarsılır; boşta hafif salınır.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi. Orijinal tasarım.
export default {
  name: 'megaphone-blast',
  category: 'police-fx',
  desc: 'Megafon: at anında genişleyen ses dalgaları patlar, koni sarsılır',
  tags: ['megafon', 'polis', 'anons', 'ses', 'dalga', 'duyuru', 'megaphone', 'loudspeaker', 'sound', 'wave', 'announce'],
  box: [-120, -95, 190, 75],
  bleed: 90,
  anchor: 'gövde merkezi (0,0); ağız sağda',
  points: { mouth: [95, 0], handle: [-20, 45] },
  params: {
    at: { type: 'time', default: null, desc: 'anons anı: ses dalgaları patlar (0.9 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color, 1);
    const ink = k.rgba('ink', 1);

    const d = p.at == null ? -1 : t - p.at;
    // sarsıntı: at sonrası 0.4 sn sönümlü titreme + idle salınım
    const shake = d >= 0 && d < 0.4 ? k.noise1(t * 40) * 4 * (1 - d / 0.4) : 0;
    ctx.translate(shake * 0.4, shake + Math.sin(t * 1.8) * 1.6);

    // ses dalgaları: at sonrası 0.9 sn'de 3 halka genişler (bleed içinde)
    if (d >= 0 && d < 1.0) {
      for (let i = 0; i < 3; i++) {
        const dd = (d - i * 0.18) / 0.9;
        if (dd < 0 || dd > 1) continue;
        const r = 70 + dd * 150;
        ctx.strokeStyle = k.rgba('yellow', 0.7 * (1 - dd));
        ctx.lineWidth = 8 * (1 - dd) + 2;
        ctx.beginPath(); ctx.arc(95, 0, r, -0.6, 0.6); ctx.stroke();
      }
    }

    // gövde konisi (sağa açılan trapez)
    const cone = (fill, off) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-50, -18 + off);
      ctx.lineTo(88, -52 + off);
      ctx.lineTo(88, 52 + off);
      ctx.lineTo(-50, 18 + off);
      ctx.closePath();
      ctx.fill();
    };
    ctx.save();
    ctx.lineWidth = LW; ctx.strokeStyle = O;
    ctx.beginPath();
    ctx.moveTo(-50 - 3, -18 - 3); ctx.lineTo(88 + 3, -52 - 3);
    ctx.lineTo(88 + 3, 52 + 3); ctx.lineTo(-50 - 3, 18 + 3);
    ctx.closePath(); ctx.stroke();
    ctx.restore();
    cone(col, 0);
    // ağız kenarı (iç halka)
    ctx.strokeStyle = ink; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(88, 0, 9, 52, 0, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.ellipse(88, 0, 5, 46, 0, 0, k.TAU); ctx.fill();

    // tetik/sap
    ctx.fillStyle = O; k.rrect(-58, -8, 20, 58, 8); ctx.fill();
    ctx.fillStyle = col; k.rrect(-54, -8, 16, 58, 7); ctx.fill();
    // tetik düğmesi (vurgu)
    ctx.fillStyle = k.rgba('red', 1);
    ctx.beginPath(); ctx.arc(-46, 8, 7, 0, k.TAU); ctx.fill();

    // bant çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-20, -28); ctx.lineTo(-20, 28); ctx.stroke();

    // at anında ağız flaşı
    if (d >= 0 && d < 0.12) {
      const f = 1 - d / 0.12;
      k.glow(95, 0, 30 + 26 * f, 'yellow', 0.5 * f);
    }

    // premium parlama: koni sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(0, -26, 42, 10, -0.2, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.strokeStyle = k.rgba('bg', 0.12); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(30, 30); ctx.lineTo(86, 44); ctx.stroke();

    ctx.restore();
  },
};
