// maps/city-grid — üstten görünüm şehir ızgarası; cadde ağı, bina blokları, park, ana arter.
// NOT: canvas y-aşağıdır; (0,0) harita merkezidir.
export default {
  name: 'city-grid',
  category: 'maps',
  desc: 'Üstten görünüm şehir ızgarası; cadde ağı, bina blokları, park ve ana arter',
  tags: ['şehir', 'ızgara', 'şehir haritası', 'city', 'grid', 'street map', 'topdown', 'kuşbakışı', 'urban', 'metropol', 'cadde'],
  box: [-260, -200, 260, 200],
  bleed: 0,
  anchor: 'harita merkezi',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'bina bloğu rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const blockC = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.7))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const rblock = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin plakası
    rblock(-250, -190, 500, 380, 26, k.rgba('panel2'));

    // caddeler (koyu bantlar)
    const streetC = k.rgba('bg', 0.45);
    const vxs = [-200, -100, 0, 100, 200];
    const hys = [-130, -43, 43, 130];
    const SW = 26;
    ctx.fillStyle = streetC;
    vxs.forEach(x => ctx.fillRect(x - SW / 2, -190, SW, 380));
    hys.forEach(y => ctx.fillRect(-250, y - SW / 2, 500, SW));

    // ana arter (y=-43): cyan kenar çizgileri + nabız
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    ctx.strokeStyle = k.rgba('cyan', 0.45 + 0.3 * pulse); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-244, -43 - SW / 2 + 4); ctx.lineTo(244, -43 - SW / 2 + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-244, -43 + SW / 2 - 4); ctx.lineTo(244, -43 + SW / 2 - 4); ctx.stroke();
    // arter orta kesik çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.setLineDash([14, 18]);
    ctx.beginPath(); ctx.moveTo(-244, -43); ctx.lineTo(244, -43); ctx.stroke();
    ctx.setLineDash([]);

    // bina blokları (cadde aralarındaki hücreler)
    const cols = [[-244, -219], [-181, -119], [-81, -19], [19, 81], [119, 181], [219, 244]];
    const rows = [[-184, -149], [-111, -62], [-24, 24], [62, 111], [149, 184]];
    cols.forEach((cxr, ci) => {
      rows.forEach((cyr, ri) => {
        const x = cxr[0], y = cyr[0], w = cxr[1] - cxr[0], h = cyr[1] - cyr[0];
        if (w < 10 || h < 10) return;
        const hv = k.hash(ci * 31 + ri * 7 + 3);
        if (ci === 2 && ri === 2) {
          // park: yeşil zemin + 3 ağaç
          rblock(x, y, w, h, 8, k.rgba('green', 0.55));
          const tx = [x + w * 0.28, x + w * 0.62, x + w * 0.45];
          const ty = [y + h * 0.35, y + h * 0.3, y + h * 0.68];
          tx.forEach((px, i) => {
            ctx.fillStyle = k.rgba('green', 0.9);
            ctx.beginPath(); ctx.arc(px, ty[i], 7, 0, k.TAU); ctx.fill();
          });
        } else {
          rblock(x, y, w, h, 8, hv < 0.3 ? dark : blockC);
          // çatı detayı (geniş bloklarda)
          if (w > 40 && h > 40) {
            ctx.fillStyle = k.rgba('bg', 0.25);
            ctx.beginPath(); k.rrect(x + 8, y + 8, w - 16, h - 16, 5); ctx.fill();
          }
        }
      });
    });

    // araçlar: arterde ve bir dikey caddede yavaşça ilerler
    const car = (x, y, w, h, c) => {
      ctx.fillStyle = k.rgba(c, 0.95);
      ctx.beginPath(); k.rrect(x - w / 2, y - h / 2, w, h, 5); ctx.fill();
    };
    car(-244 + ((t * 42) % 488), -43, 22, 12, 'cyan');
    car(100, 184 - ((t * 30 + 90) % 368), 12, 22, 'cyan');

    // premium parlama (zemin sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-170, -120, 95, 55, -0.3, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
