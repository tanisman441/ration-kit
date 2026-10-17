// environment/barrel — metal varil; fuel = ikaz şeritli, water = dalga şeritli.
// NOT: canvas y-aşağıdır; zemin (0,0), varil negatif y yönünde yukarı uzar.
export default {
  name: 'barrel',
  category: 'environment',
  desc: 'Metal varil; fuel varyantı sarı ikaz şeritli, water varyantı mavi dalga şeritli',
  tags: ['varil', 'bidon', 'yakıt', 'yağ', 'su bidonu', 'barrel', 'drum', 'fuel drum', 'oil drum', 'water'],
  box: [-75, -165, 75, 10],
  bleed: 0,
  anchor: 'zemin (0,0); varil merkezi, boy ~150 birim',
  points: { top: [0, -156] },
  params: {
    color: { type: 'color', default: 'dim' },
    variant: { type: 'enum', values: ['fuel', 'water'], default: 'fuel' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.78))).join(',')})`;
    const darker = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.6))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 62, 8, 0, 0, k.TAU); ctx.fill();

    // gövde
    blob(-58, -140, 116, 140, 14, k.rgba(p.color));

    // üst kapak (elips)
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, -140, 58 + LW / 2, 16 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(0, -140, 58, 16, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(0, -140, 44, 11, 0, 0, k.TAU); ctx.stroke();

    // çember bantlar
    ctx.fillStyle = darker;
    ctx.beginPath(); k.rrect(-58, -104, 116, 13, 4); ctx.fill();
    ctx.beginPath(); k.rrect(-58, -48, 116, 13, 4); ctx.fill();

    if (p.variant === 'fuel') {
      // ikaz şeridi (sarı vurgu, diyagonal)
      ctx.save();
      ctx.beginPath(); k.rrect(-52, -88, 104, 40, 6); ctx.clip();
      ctx.fillStyle = k.rgba('yellow', 0.85);
      for (let x = -90; x < 70; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, -48); ctx.lineTo(x + 12, -48); ctx.lineTo(x - 8, -88); ctx.lineTo(x - 20, -88);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    } else {
      // dalga şeridi (cyan vurgu)
      ctx.strokeStyle = k.rgba('cyan', 0.9); ctx.lineWidth = 5;
      ctx.beginPath();
      for (let x = -52; x <= 52; x += 4) {
        const y = -68 + Math.sin(x * 0.16) * 7;
        x === -52 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // premium parlama (sol üst, dikey)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-50, -132, 12, 118, 6); ctx.fill();
  },
};
