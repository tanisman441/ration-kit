// economy/bank — klasik banka cephesi: alınlıklı çatı, sütunlar, kapı, merdiven.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) tabandadır (merdivenin altı).
export default {
  name: 'bank', category: 'economy',
  desc: 'Klasik banka binası cephesi; alınlık, dört sütun, kapı ve merdiven',
  tags: ['banka', 'bank', 'finans', 'finance', 'bina', 'building', 'para', 'money'],
  box: [-168, -258, 168, 26],
  bleed: 10,
  anchor: 'taban (0,0) — merdivenin altı',
  points: { door: [0, -80], top: [0, -246] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const tri = (pts, c) => {
      ctx.fillStyle = line; ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1] + LW / 2); ctx.lineTo(pts[1][0], pts[1][1] + LW / 2); ctx.lineTo(pts[2][0], pts[2][1]); ctx.closePath(); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.closePath(); ctx.fill();
    };

    // merdiven (3 basamak)
    [[-120, -18, 240, 18], [-105, -36, 210, 18], [-90, -54, 180, 18]].forEach(s => blob(s[0], s[1], s[2], s[3], 6, k.rgba('panel')));

    // sütunlar (başlıklı)
    [-112, -38, 38, 112].forEach(x => {
      blob(x - 14, -196, 28, 142, 8, body);          // gövde
      blob(x - 20, -208, 40, 14, 6, body);           // başlık
      blob(x - 18, -62, 36, 10, 5, body);            // kaide
    });

    // kapı (ortada)
    blob(-32, -140, 64, 88, 10, k.rgba('ink'));
    ctx.fillStyle = k.rgba('yellow', 0.85);          // kapı camı parlaması
    ctx.beginPath(); k.rrect(-20, -128, 16, 64, 6); ctx.fill();

    // arşitrav (sütun üstü kiriş)
    blob(-152, -222, 304, 26, 8, body);

    // alınlık (üçgen çatı)
    tri([[-152, -222], [152, -222], [0, -248]], body);
    // alınlık amblemi: madeni para
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -222, 17, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); ctx.arc(0, -222, 14, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.7); ctx.beginPath(); ctx.arc(0, -222, 5, 0, k.TAU); ctx.fill();

    // premium parlama (alınlık sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -232, 34, 8, -0.25, 0, k.TAU); ctx.fill();

    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(8, 12, 150, 9, 0, 0, k.TAU); ctx.fill();
  },
};
