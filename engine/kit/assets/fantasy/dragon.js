// fantasy/dragon — yandan görünen yeşil ejderha: kanat, boynuz, sırt dikeni ve kuyruk.
// Ağzı sağa bakar; breath anında ateş püskürtür.
// Orijinal tasarım; gerçek oyun/film ejderhası kopyalanmamıştır.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'dragon',
  category: 'fantasy',
  desc: 'Yandan görünen yeşil ejderha; kanat çırpar, nefes alır; breath anında ağzından ateş püskürtür',
  tags: ['ejderha', 'ateş ejderhası', 'canavar', 'fantastik yaratık', 'dragon', 'fire dragon', 'monster', 'fantasy beast'],
  box: [-195, -125, 315, 125],
  bleed: 60,
  anchor: 'gövde merkezi (0,0)',
  points: { mouth: [170, -49], back: [-30, -25] },
  params: {
    color: { type: 'color', default: 'green', desc: 'pul rengi' },
    breath: { type: 'time', default: null, desc: 'ateş püskürtme anı' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const sh = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    const ell = (x, y, rx, ry, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name); ctx.beginPath(); ctx.ellipse(x + 5, y + 7, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = O;
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const thick = (pts, w, name, fill = k.rgba(name)) => {
      // pts: [x1,y1,cx,cy,x2,y2] eğri; katmanlı kalın çizgi
      ctx.strokeStyle = sh(name); ctx.lineWidth = w + 12;
      ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]); ctx.stroke();
      ctx.strokeStyle = O; ctx.lineWidth = w + 6;
      ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]); ctx.stroke();
      ctx.strokeStyle = fill; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]); ctx.stroke();
    };
    const tri = (x1, y1, x2, y2, x3, y3, name, fill = k.rgba(name)) => {
      ctx.fillStyle = sh(name);
      ctx.beginPath(); ctx.moveTo(x1 + 4, y1 + 5); ctx.lineTo(x2 + 4, y2 + 5); ctx.lineTo(x3 + 4, y3 + 5); ctx.closePath(); ctx.fill();
      ctx.lineWidth = 5; ctx.strokeStyle = O;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();
    };

    // ANIMASYON (idle) — nefes: gövde ±%2 (~2.4 sn)
    const br = 1 + 0.02 * Math.sin((t / 2.4) * k.TAU);

    // kuyruk (gövdenin arkasında)
    thick([-105, 45, -160, 60, -188, 30], 22, p.color, sh(p.color, 0.72));
    tri(-188, 14, -172, 30, -188, 46, p.color, sh(p.color, 0.72));   // kuyruk ucu

    // bacaklar
    thick([30, 45, 34, 80, 30, 100], 20, p.color, sh(p.color, 0.78));
    thick([-75, 45, -71, 80, -75, 100], 20, p.color, sh(p.color, 0.78));

    // ANIMASYON (idle) — kanat çırpma (~2.2 sn döngü)
    const flap = -0.12 + Math.sin((t / 2.2) * k.TAU) * 0.38;
    ctx.save();
    ctx.translate(-25, -20); ctx.rotate(flap);
    ctx.fillStyle = sh(p.color, 0.7);
    ctx.beginPath();
    ctx.moveTo(4, 5); ctx.quadraticCurveTo(-70, -60, -125, -100);
    ctx.quadraticCurveTo(-80, -45, -50, -2); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = O;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.quadraticCurveTo(-70, -60, -125, -100);
    ctx.quadraticCurveTo(-80, -45, -50, -2); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = sh(p.color, 0.8);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.quadraticCurveTo(-70, -60, -125, -100);
    ctx.quadraticCurveTo(-80, -45, -50, -2); ctx.closePath(); ctx.fill();
    // kanat ön kenarı
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-70, -60, -125, -100); ctx.stroke();
    ctx.restore();

    // gövde
    ctx.save(); ctx.translate(-30, 25); ctx.scale(br, 1 + (br - 1) * 0.6);
    ell(0, 0, 88, 50, p.color); ctx.restore();
    // karın (açık ton)
    ctx.fillStyle = 'rgba(255,255,255,0.20)';
    ctx.beginPath(); ctx.ellipse(-18, 50, 56, 24, 0, 0, k.TAU); ctx.fill();
    // sırt dikenleri
    for (let i = 0; i < 4; i++) {
      const x = -95 + i * 40;
      tri(x - 10, -18, x + 10, -18, x, -44, p.color, sh(p.color, 0.65));
    }

    // boyun + kafa (ağız sağa)
    thick([35, 5, 85, -15, 100, -42], 34, p.color);
    ell(108, -52, 36, 30, p.color);                                     // kafa
    // burun
    ctx.fillStyle = sh(p.color); ctx.beginPath(); k.rrect(118 + 5, -66 + 7, 54, 32, 14); ctx.fill();
    ctx.fillStyle = O; ctx.beginPath(); k.rrect(118 - 3, -66 - 3, 54 + 6, 32 + 6, 17); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); k.rrect(118, -66, 54, 32, 14); ctx.fill();
    // burun delikleri
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); ctx.arc(162, -56, 3, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(162, -46, 3, 0, k.TAU); ctx.fill();
    // göz
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(112, -60, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); ctx.arc(114, -60, 4.5, 0, k.TAU); ctx.fill();
    // boynuzlar
    tri(88, -76, 104, -80, 92, -104, p.color, sh(p.color, 0.6));
    tri(108, -80, 124, -80, 118, -106, p.color, sh(p.color, 0.6));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, 0, 34, 16, -0.3, 0, k.TAU); ctx.fill();

    // ANIMASYON — breath olayı: ateş konisi + kıvılcım (0.95 sn)
    const d = p.breath == null ? -1 : t - p.breath;
    if (d >= 0 && d < 0.95) {
      const g = d / 0.95;
      const len = 25 + 120 * k.E.outExpo(Math.min(1, d / 0.22));
      const fade = 1 - g * g;
      const wob = k.noise1(t * 9) * 7;
      k.glow(178, -50, 62 * fade + 22, 'yellow', 0.5 * fade);
      const cone = (L, w, col, a) => {
        ctx.fillStyle = k.rgba(col, a * fade);
        ctx.beginPath();
        ctx.moveTo(168, -60);
        ctx.quadraticCurveTo(168 + L * 0.5, -62 - w, 168 + L, -52 + wob);
        ctx.quadraticCurveTo(168 + L * 0.5, -44 + w, 168, -40);
        ctx.closePath(); ctx.fill();
      };
      cone(len, 26, 'red', 0.8);
      cone(len * 0.68, 16, 'yellow', 0.85);
      ctx.fillStyle = `rgba(255,255,255,${(0.85 * fade).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(168, -56);
      ctx.quadraticCurveTo(168 + len * 0.3, -56 - 7, 168 + len * 0.4, -52 + wob * 0.5);
      ctx.quadraticCurveTo(168 + len * 0.3, -48 + 7, 168, -44);
      ctx.closePath(); ctx.fill();
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 3 + 21), h2 = k.hash(i * 5 + 22), h3 = k.hash(i * 7 + 23);
        const a = (h1 - 0.5) * 0.8;
        const sp = 130 + h2 * 110, dd = d * sp;
        const x = 170 + Math.cos(a) * dd, y = -50 + Math.sin(a) * dd * 1.5 - d * d * 24;
        ctx.fillStyle = k.rgba('yellow', Math.max(0, 1 - d / 0.8));
        ctx.beginPath(); ctx.arc(x, y, 3 + h3 * 4, 0, k.TAU); ctx.fill();
      }
    }
  },
};
