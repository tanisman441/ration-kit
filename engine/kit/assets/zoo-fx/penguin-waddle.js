// zoo-fx/penguin-waddle — paytak paytak yürüyen penguen, döngüsel yürüme. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'penguin-waddle', category: 'zoo-fx',
  desc: 'Dik duran penguen; gövdesi sağa sola yalpalar, ayakları sırayla adım atar',
  tags: ['penguen', 'paytak', 'yürüme', 'buz', 'hayvanat bahçesi', 'penguin', 'waddle', 'walk', 'ice', 'zoo', 'bird'],
  box: [-95, -195, 95, 10],
  bleed: 30,
  anchor: 'ayaklar (0,0); boy ~185 birim',
  points: { head: [0, -160], beak: [0, -148], feet: [0, -8] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 0.5, desc: 'yürüme hızı (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const bellyC = k.rgba('panel2'), beakC = k.rgba('yellow');
    const sp = k.clamp(p.speed, 0, 1);
    const cyc = t * (1.6 + sp * 1.8); // yürüme döngüsü
    const rock = Math.sin(cyc) * (0.10 + sp * 0.05); // gövde yalpalaması
    const stepL = Math.max(0, Math.sin(cyc)) * 16; // sol ayak kalkar
    const stepR = Math.max(0, -Math.sin(cyc)) * 16; // sağ ayak kalkar
    const bob = Math.abs(Math.cos(cyc)) * 3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 48, 10, 0, 0, k.TAU); ctx.fill();

    // ayaklar: sırayla adım (biri kalkarken diğeri basar)
    blob(-26, -16 - stepL, 28, 14, 7, beakC);
    blob(-2, -16 - stepR, 28, 14, 7, beakC);

    ctx.save();
    ctx.translate(0, -bob);
    ctx.rotate(rock);

    // kanatlar: yalpalamayla hafif çırpar
    const flap = Math.sin(cyc) * 0.18;
    ctx.save(); ctx.translate(-42, -96); ctx.rotate(0.35 + flap);
    blob(-8, -30, 16, 52, 8, body); ctx.restore();
    ctx.save(); ctx.translate(42, -96); ctx.rotate(-0.35 - flap);
    blob(-8, -30, 16, 52, 8, body); ctx.restore();

    // gövde + sağ alt gölge (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-44 + 6, -148 + 6, 88, 138, 42); ctx.fill();
    blob(-44, -148, 88, 138, 42, body);
    // karın (beyaz alan)
    disc(0, -84, 28, 52, bellyC);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, -122, 12, 20, -0.2, 0, k.TAU); ctx.fill();

    // baş
    disc(0, -158, 30, 28, body);
    // gözler
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(-12, -162, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(12, -162, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    // gaga (sarı vurgu, tek vurgu rengi)
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, -144, 13, 8, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = beakC; ctx.beginPath(); ctx.ellipse(0, -144, 10, 6, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // göz kırpma
    const tb = t % 4.5;
    if (tb < 0.12) {
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(-12, -162 - bob, 8, 3, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(12, -162 - bob, 8, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};
