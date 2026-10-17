// environment/fence — tel örgü çit (yatay); direkler + baklava desenli örgü.
// NOT: canvas y-aşağıdır; zemin (0,0), çit negatif y yönünde yukarı uzar.
export default {
  name: 'fence',
  category: 'environment',
  desc: 'Tel örgü çit; direkler arasında baklava desenli örgü, üstte korkuluk',
  tags: ['çit', 'tel örgü', 'sınır', 'tel', 'korkuluk', 'fence', 'chain-link', 'barrier', 'border'],
  box: [-274, -113, 274, 13],
  bleed: 0,
  anchor: 'zemin (0,0); çit yukarı uzar, boy ~100 birim',
  points: { top: [0, -100] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.75))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const post = (x) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - 6 - LW / 2, -102 - LW / 2, 12 + LW, 102 + LW, 6 + LW / 2); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); k.rrect(x - 6, -102, 12, 102, 6); ctx.fill();
      // premium parlama (direk sol)
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); k.rrect(x - 4, -98, 4, 94, 2); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, -4, 268, 8, 0, 0, k.TAU); ctx.fill();

    // örgü (bant içine kırpılır)
    ctx.save();
    ctx.beginPath(); ctx.rect(-264, -98, 528, 86); ctx.clip();
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
    for (let o = -300; o < 300; o += 26) {
      ctx.beginPath(); ctx.moveTo(o, -8); ctx.lineTo(o + 88, -100); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(o, -100); ctx.lineTo(o + 88, -8); ctx.stroke();
    }
    ctx.restore();

    // üst ve alt ray
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-270 - LW / 2, -106 - LW / 2, 540 + LW, 12 + LW, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-270, -106, 540, 12, 6); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-270 - LW / 2, -18 - LW / 2, 540 + LW, 12 + LW, 8); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); k.rrect(-270, -18, 540, 12, 6); ctx.fill();

    // direkler (rayların üstünde)
    for (const x of [-264, -132, 0, 132, 264]) post(x);
  },
};
