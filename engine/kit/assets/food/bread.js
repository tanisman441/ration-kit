// food/bread — yandan ekmek somunu; slice anında bir dilim kayıp ayrılır
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) somunun merkezidir.
export default {
  name: 'bread', category: 'food',
  desc: 'Yandan ekmek somunu; slice anında uçtaki dilim kayıp ayrılır ve geri döner',
  tags: ['ekmek', 'bread', 'somun', 'loaf', 'dilim', 'slice', 'fırın', 'bakery', 'yemek'],
  box: [-95, -70, 95, 70],
  bleed: 45,
  anchor: 'somunun merkezi (0,0)',
  points: { top: [0, -42] },
  params: {
    slice: { type: 'time', default: null, desc: 'dilimlenme anı (uç dilim kayıp ayrılır, 1.2 sn)' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const crust = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.slice == null ? -1 : t - p.slice;

    // dilim: 0→0.5 sn'de kayar ve eğilir, 0.5→1.2'de geri döner
    let sep = 0;
    if (d >= 0 && d < 1.2) sep = d < 0.5 ? d / 0.5 : 1 - (d - 0.5) / 0.7;
    const sepE = sep * sep * (3 - 2 * sep); // smoothstep

    const sway = Math.sin(t * 1.5) * 0.03; // hafif salınım (idle)

    ctx.save();
    ctx.rotate(sway);

    const loaf = () => {
      ctx.beginPath();
      ctx.moveTo(-80, 34);
      ctx.lineTo(52, 34);
      ctx.quadraticCurveTo(86, 34, 86, 2);
      ctx.quadraticCurveTo(86, -32, 50, -34);
      ctx.lineTo(-64, -34);
      ctx.quadraticCurveTo(-88, -32, -88, 0);
      ctx.quadraticCurveTo(-88, 34, -80, 34);
      ctx.closePath();
    };

    // sağ alt gölge
    ctx.save(); ctx.translate(7, 7); loaf(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill(); ctx.restore();

    // somun gövdesi
    loaf(); ctx.fillStyle = crust; ctx.fill();
    // üst kabuk (açık şerit)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath();
    ctx.moveTo(-64, -34);
    ctx.lineTo(50, -34);
    ctx.quadraticCurveTo(74, -32, 80, -14);
    ctx.lineTo(-70, -14);
    ctx.quadraticCurveTo(-78, -32, -64, -34);
    ctx.closePath(); ctx.fill();
    // çizikler (3 adet)
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const sx = -40 + i * 34;
      ctx.beginPath(); ctx.moveTo(sx - 12, -26); ctx.quadraticCurveTo(sx, -20, sx + 12, -26); ctx.stroke();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-48, -22, 22, 8, -0.25, 0, k.TAU); ctx.fill();
    loaf(); ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();

    // dilim çizgisi (somunun sağ ucunda)
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.beginPath(); ctx.moveTo(58, -32); ctx.lineTo(58, 32); ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();

    // ayrılan dilim (somunun sağ ucundan)
    if (sepE > 0.01) {
      ctx.save();
      ctx.translate(58 + sepE * 46, 0);
      ctx.rotate(sway + sepE * 0.35);
      ctx.globalAlpha = 1 - sepE * sepE * 0.25;
      // dilim gövdesi
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      k.rrect(-14 + 4, -32 + 4, 28, 64, 10); ctx.fill();
      ctx.fillStyle = crust;
      k.rrect(-14, -32, 28, 64, 10); ctx.fill();
      // dilim iç yüzü (açık)
      ctx.fillStyle = k.rgba('panel');
      k.rrect(-8, -26, 16, 52, 7); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4;
      k.rrect(-14, -32, 28, 64, 10); ctx.stroke();
      ctx.restore();
    }
  },
};
