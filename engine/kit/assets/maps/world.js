// maps/world — basitleştirilmiş dünya haritası; okyanus elipsi üzerinde tanınabilir kıtalar.
// NOT: canvas y-aşağıdır; kuzey yukarı (negatif y), (0,0) harita merkezidir.
export default {
  name: 'world',
  category: 'maps',
  desc: 'Basitleştirilmiş dünya haritası; okyanus üzerinde tanınabilir kıta siluetleri, bölge vurgusu',
  tags: ['dünya', 'harita', 'world', 'map', 'küre', 'gezegen', 'kıtalar', 'continents', 'earth', 'globe'],
  box: [-185, -165, 185, 165],
  bleed: 0,
  anchor: 'harita merkezi',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'kıta rengi' },
    highlight: {
      type: 'enum',
      values: ['none', 'n-america', 's-america', 'europe', 'africa', 'asia', 'oceania'],
      default: 'none', desc: 'vurgulanan bölge',
    },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const land = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.74))).join(',')})`;
    ctx.lineJoin = 'round';

    const NA = [[-150, -72], [-132, -102], [-104, -112], [-72, -102], [-56, -86], [-68, -70], [-90, -62], [-108, -50], [-126, -46], [-142, -54]];
    const GREENLAND = [[-56, -120], [-36, -124], [-30, -110], [-50, -106]];
    const CENTRALAM = [[-94, -48], [-80, -44], [-78, -34], [-92, -38]];
    const SA = [[-86, -26], [-66, -30], [-60, -10], [-64, 14], [-72, 44], [-80, 74], [-86, 94], [-92, 74], [-94, 40], [-92, 6]];
    const EU = [[-16, -94], [6, -98], [28, -90], [34, -74], [20, -64], [0, -62], [-14, -72]];
    const UK = [[-20, -80], [-12, -82], [-10, -72], [-18, -70]];
    const AF = [[-6, -46], [26, -50], [46, -30], [50, -4], [42, 30], [28, 64], [16, 76], [4, 62], [-4, 30], [-12, -6]];
    const MAD = [[50, 30], [56, 28], [58, 46], [52, 50]];
    const AS = [[38, -86], [78, -102], [122, -98], [156, -82], [160, -58], [138, -46], [104, -42], [92, -30], [78, -34], [68, -48], [46, -60]];
    const IND = [[76, -46], [90, -42], [84, -22], [72, -26]];
    const JP = [[164, -74], [170, -72], [172, -58], [166, -60]];
    const SEA = [[108, -30], [122, -26], [120, -14], [108, -18]];
    const AUS = [[120, 50], [150, 46], [160, 62], [148, 80], [126, 78], [116, 62]];
    const NZ = [[168, 88], [174, 86], [176, 100], [170, 102]];
    const LANDS = [NA, GREENLAND, CENTRALAM, SA, EU, UK, AF, MAD, AS, IND, JP, SEA, AUS, NZ];
    const REGIONS = {
      'n-america': { polys: [NA, GREENLAND, CENTRALAM], c: [-100, -75] },
      's-america': { polys: [SA], c: [-80, 28] },
      europe: { polys: [EU, UK], c: [8, -80] },
      africa: { polys: [AF, MAD], c: [22, 14] },
      asia: { polys: [AS, IND, JP, SEA], c: [102, -62] },
      oceania: { polys: [AUS, NZ], c: [142, 66] },
    };

    const poly = (pts, c, dx = 0, dy = 0) => {
      ctx.fillStyle = c; ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x + dx, y + dy) : ctx.moveTo(x + dx, y + dy));
      ctx.closePath(); ctx.fill();
    };
    const polyLine = (pts) => {
      ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath(); ctx.stroke();
    };

    // okyanus
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 0, 168 + LW / 2, 148 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(0, 0, 168, 148, 0, 0, k.TAU); ctx.fill();

    // enlem/boylam çizgileri (okyanusa kırpılır)
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, 0, 168, 148, 0, 0, k.TAU); ctx.clip();
    ctx.strokeStyle = k.rgba('ink', 0.14); ctx.lineWidth = 2;
    for (const gx of [-126, -84, -42, 0, 42, 84, 126]) {
      ctx.beginPath(); ctx.moveTo(gx, -148); ctx.lineTo(gx, 148); ctx.stroke();
    }
    for (const gy of [-111, -74, -37, 0, 37, 74, 111]) {
      ctx.beginPath(); ctx.moveTo(-168, gy); ctx.lineTo(168, gy); ctx.stroke();
    }
    ctx.restore();

    // kıta gölgeleri (sağ alt, tek ton)
    for (const pts of LANDS) poly(pts, dark, 5, 6);

    // kıtalar
    for (const pts of LANDS) { poly(pts, land); polyLine(pts); }

    // küçük adalar
    for (const [ix, iy, irx, iry] of [[128, -2, 10, 5], [146, 2, 8, 4]]) {
      ctx.fillStyle = land;
      ctx.beginPath(); ctx.ellipse(ix, iy, irx, iry, 0, 0, k.TAU); ctx.fill();
    }

    // bölge vurgusu
    const reg = REGIONS[p.highlight];
    if (reg) {
      const pulse = 0.32 + 0.1 * Math.sin(t * 2.2);
      k.glow(reg.c[0], reg.c[1], 62, 'accent', pulse);
      for (const pts of reg.polys) { poly(pts, k.rgba('accent', 0.92)); polyLine(pts); }
    }

    // premium parlama (okyanus sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, -62, 72, 42, -0.3, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
