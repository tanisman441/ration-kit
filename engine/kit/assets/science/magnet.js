// science/magnet — klasik at nalı mıknatıs; active anında alan çizgileri + metal parçalar kutuplara çekilir.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'magnet',
  category: 'science',
  desc: 'Klasik at nalı mıknatıs; active anında manyetik alan çizgileri belirir ve metal parçalar kutuplara çekilir',
  tags: ['mıknatıs', 'magnet', 'manyetik', 'magnetic', 'fizik', 'physics', 'kutup', 'pole', 'çekim', 'attraction', 'alan', 'field'],
  box: [-90, -95, 90, 75],
  bleed: 25,
  anchor: 'gövde merkezi (0,0)',
  points: { north: [-52, -12], south: [52, -12] },
  params: {
    color: { type: 'color', default: 'red', desc: 'mıknatıs gövde rengi' },
    active: { type: 'time', default: null, desc: 'çekim anı: alan çizgileri + metal parçalar' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);

    const CX = 0, CY = -12, R = 55, W = 36;
    const a0 = (Math.PI * 200) / 180, a1 = (Math.PI * 340) / 180;

    // gölge (sağ alt, tek ton)
    ctx.save(); ctx.translate(6, 6);
    ctx.strokeStyle = k.rgba('bg', 0.28); ctx.lineWidth = W;
    ctx.beginPath(); ctx.arc(CX, CY, R, a0, a1); ctx.stroke();
    ctx.restore();

    // U gövde: dış hat + gövde
    ctx.strokeStyle = line; ctx.lineWidth = W + LW;
    ctx.beginPath(); ctx.arc(CX, CY, R, a0, a1); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = W;
    ctx.beginPath(); ctx.arc(CX, CY, R, a0, a1); ctx.stroke();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -60, 22, 10, -0.5, 0, k.TAU); ctx.fill();

    // kutup uçları (metal)
    const tip = (x) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - 17, -46, 34, 32, 8); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(x - 14.5, -43.5, 29, 27, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - 6, -36, 7, 5, -0.4, 0, k.TAU); ctx.fill();
    };
    tip(-52); tip(52);

    // çekim efekti
    const d = p.active == null ? -1 : t - p.active;
    if (d >= 0 && d < 1.1) {
      // alan çizgileri: kutuplar arası kesikli yaylar
      ctx.save();
      ctx.setLineDash([9, 8]);
      ctx.lineWidth = 3;
      [40, 58, 76].forEach((r, i) => {
        const a = 0.55 * (1 - d) * (0.7 + 0.3 * Math.sin(t * 10 + i * 2));
        if (a <= 0.02) return;
        ctx.strokeStyle = k.rgba('ink', a);
        ctx.beginPath(); ctx.arc(0, -12, r, (Math.PI * 25) / 180, (Math.PI * 155) / 180); ctx.stroke();
      });
      ctx.restore();

      // metal parçalar: aşağıdan kutuplara uçar
      const bits = [
        { sx: -70, sy: 58, ex: -52, ey: -2 },
        { sx: 70, sy: 58, ex: 52, ey: -2 },
        { sx: 0, sy: 66, ex: 20, ey: 4 },
      ];
      const fly = k.prog(0, 0.55, d);
      const e = 1 - Math.pow(1 - fly, 3);
      const fade = d < 0.9 ? 1 : 1 - (d - 0.9) / 0.2;
      bits.forEach((b, i) => {
        const x = b.sx + (b.ex - b.sx) * e;
        const y = b.sy + (b.ey - b.sy) * e - Math.sin(e * Math.PI) * 10;
        ctx.save(); ctx.translate(x, y); ctx.rotate((1 - e) * (k.hash(i * 7 + 1) - 0.5) * 4);
        ctx.globalAlpha = Math.max(0, fade);
        ctx.fillStyle = line; ctx.beginPath(); k.rrect(-8, -5, 16, 10, 3); ctx.fill();
        ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-6, -3.5, 12, 7, 2); ctx.fill();
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  },
};
