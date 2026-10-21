// mechanics-fx/piston-pump — silindir içinde yukarı-aşağı çalışan piston + biyel kolu.
// cycle (0-1) pompalama hızını belirler; cycle=0 iken bile yavaşça çalışır (canlı idle).
// Üst ölü noktada yan havalandırmadan küçük buhar çıkar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) silindir gövde merkezidir.
export default {
  name: 'piston-pump', category: 'mechanics-fx',
  desc: 'Silindir içinde yukarı-aşağı çalışan piston; cycle hızını ayarlar',
  tags: ['piston', 'silindir', 'pompa', 'motor', 'biyel', 'piston', 'cylinder', 'pump', 'engine', 'mechanism'],
  box: [-110, -115, 110, 115],
  bleed: 22,
  anchor: 'silindir gövde merkezi (0,0)',
  points: { vent: [88, -46], top: [0, -112] },
  params: {
    color: { type: 'color', default: 'ink' },
    cycle: { type: 'number', default: 0.5, desc: 'pompalama hızı (0-1); 0 = en yavaş idle' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const cyc = k.clamp(p.cycle, 0, 1);
    const ph = t * (0.9 + 4.2 * cyc);              // idle pompalama + cycle hızı
    const py = -14 + 44 * Math.sin(ph);            // piston merkezi y (y-aşağı)
    const nearTop = Math.cos(ph) > 0.86;           // üst ölü nokta

    // silindir gövde
    blob(-58, -88, 116, 150, 12, body);
    // gölge (sağ alt, %12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(2, -84, 56, 142, 12); ctx.fill();
    // iç hazne (koyu pencere)
    blob(-44, -62, 88, 98, 8, k.rgba('bg', 0.75));
    // üst kapak + flanş
    blob(-66, -104, 132, 24, 10, k.rgba('panel2'));
    // alt kapak
    blob(-66, 48, 132, 22, 10, k.rgba('panel2'));
    // üst kapaktaki cıvatalar
    [-46, -16, 16, 46].forEach(x => {
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(x, -92, 5, 0, k.TAU); ctx.fill();
    });

    // piston (hazne içinde hareketli)
    const pw = 76, phh = 30;
    blob(-pw / 2, py - phh / 2, pw, phh, 8, k.rgba('dim'));
    // piston segman çizgileri
    ctx.lineWidth = 3; ctx.strokeStyle = k.rgba('ink', 0.4);
    [-6, 6].forEach(dy => {
      ctx.beginPath(); ctx.moveTo(-pw / 2 + 8, py + dy); ctx.lineTo(pw / 2 - 8, py + dy); ctx.stroke();
    });

    // biyel kolu (pistondan yukarı, üst kapaktan çıkar)
    ctx.lineWidth = 16; ctx.strokeStyle = line;
    ctx.beginPath(); ctx.moveTo(0, py - phh / 2); ctx.lineTo(0, -112); ctx.stroke();
    ctx.lineWidth = 10; ctx.strokeStyle = k.rgba('yellow');
    ctx.beginPath(); ctx.moveTo(0, py - phh / 2); ctx.lineTo(0, -112); ctx.stroke();
    // kol başı: yan salınımlı çapraz pim (hareket hissi)
    const swing = 26 * Math.cos(ph);
    blob(-14, -116, 28, 16, 7, k.rgba('panel2'));
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(swing, -108, 9 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red'); ctx.beginPath(); ctx.arc(swing, -108, 9, 0, k.TAU); ctx.fill();

    // havalandırma buharı (üst ölü noktada)
    if (nearTop) {
      const q = (Math.cos(ph) - 0.86) / 0.14;
      for (let i = 0; i < 3; i++) {
        const qq = k.clamp(q - i * 0.3, 0, 1);
        if (qq <= 0) continue;
        const px = 80 + i * 12 + k.noise1(i * 7 + t * 3) * 5;
        const pr = 6 + qq * 11;
        ctx.fillStyle = k.rgba('dim', 0.35 * (1 - qq) + 0.05);
        ctx.beginPath(); ctx.arc(px, -46 - qq * 18, pr, 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama (sol üst, silindir gövde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, -66, 24, 13, -0.5, 0, k.TAU); ctx.fill();
  },
};
