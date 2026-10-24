// zoo-fx/giraffe-neck — yandan zürafa, boynu tilt parametresiyle eğilir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayaklar, boyun yukarı uzar; tilt>0 başı öne/aşağı eğer.
export default {
  name: 'giraffe-neck', category: 'zoo-fx',
  desc: 'Yandan duran benekli zürafa; boynu tilt ile öne eğilir, geriye kalkar',
  tags: ['zürafa', 'boyun', 'benek', 'hayvanat bahçesi', 'giraffe', 'neck', 'spots', 'zoo', 'safari', 'tall'],
  box: [-155, -315, 205, 10],
  bleed: 30,
  anchor: 'ayaklar (0,0); baş yüksekliği ~260 birim',
  points: { head: [108, -244], muzzle: [146, -228], tail: [-128, -110] },
  params: {
    color: { type: 'color', default: 'dim' },
    tilt: { type: 'number', default: 0, desc: 'boyun eğimi (-1 geriye, 0 dik, 1 öne eğik)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const spotC = k.rgba('yellow');
    const tilt = k.clamp(p.tilt, -1, 1);
    const br = Math.sin(t * k.TAU / 2.6) * 2; // nefes
    const sway = k.noise1(t * 0.7) * 3; // başta hafif salınım (canlı idle)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const rope = (x1, y1, cx, cy, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 88, 11, 0, 0, k.TAU); ctx.fill();

    // kuyruk: sallanma
    const tsway = k.noise1(t * 0.9) * 12;
    rope(-118, -112, -142, -84 + tsway, -136 + tsway, -52, 10, body);
    disc(-136 + tsway, -48, 9, 12, body);

    // bacaklar (uzun, ince)
    limb(-84, -96, -86, -14, 14, body);
    limb(-44, -96, -42, -14, 14, body);
    limb(56, -96, 58, -14, 14, body);
    limb(92, -96, 90, -14, 14, body);
    for (const px of [-86, -42, 58, 90]) blob(px - 11, -16, 24, 15, 7, body);

    // gövde + sağ alt gölge (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-116 + 6, -176 + 6 + br * 0.4, 214, 84, 36); ctx.fill();
    blob(-116, -176 + br * 0.4, 214, 84, 36, body);
    // benekler (gövde, sarı vurgu)
    for (const [sx, sy, sr] of [[-88, -150, 9], [-52, -130, 11], [-8, -150, 9], [34, -128, 10], [70, -150, 8], [-30, -112, 8]]) {
      ctx.fillStyle = spotC;
      ctx.beginPath(); ctx.ellipse(sx, sy + br * 0.4, sr, sr * 0.8, 0, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -158, 22, 12, -0.3, 0, k.TAU); ctx.fill();

    // boyun: tabandan döner, tilt ile eğilir
    const baseX = 84, baseY = -168;
    const neckAng = 0.12 + tilt * 0.55; // 0 = hafif öne eğik dik duruş
    const neckLen = 96;
    const hx = baseX + Math.sin(neckAng) * neckLen + sway;
    const hy = baseY - Math.cos(neckAng) * neckLen - br * 0.5;
    limb(baseX - 8, baseY + 6, hx - 8, hy + 10, 26, body);
    limb(baseX + 8, baseY + 6, hx + 8, hy + 10, 26, body);
    blob(baseX - 20, baseY - 6, 40, 30, 14, body);
    // boyun benekleri
    for (let i = 0; i < 4; i++) {
      const f = 0.25 + i * 0.2;
      const nx = baseX + (hx - baseX) * f - 4;
      const ny = baseY + (hy - baseY) * f;
      ctx.fillStyle = spotC;
      ctx.beginPath(); ctx.ellipse(nx, ny, 7, 6, 0, 0, k.TAU); ctx.fill();
    }
    // yele (boyun arkası kısa çizgi)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(baseX - 16, baseY - 4);
    ctx.lineTo(hx - 16, hy + 2);
    ctx.stroke();

    // baş: boynun ucunda, tilt ile hafif döner
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(neckAng * 0.4);
    // boynuzcuklar (ossicone)
    limb(-8, -18, -12, -38, 7, body);
    limb(8, -18, 12, -38, 7, body);
    disc(-12, -40, 6, 6, body);
    disc(12, -40, 6, 6, body);
    // kulaklar
    disc(-20, -10, 11, 8, body);
    disc(20, -10, 11, 8, body);
    // kafa + burun
    disc(0, 0, 26, 24, body);
    blob(8, -8, 44, 26, 12, body);
    // göz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(6, -4, 5, 5, 0, 0, k.TAU); ctx.fill();
    // burun deliği
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(44, 2, 3, 3, 0, 0, k.TAU); ctx.fill();
    // premium parlama (baş sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -14, 9, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // göz kırpma (baş yaklaşık konumda)
    const tb = t % 4.6;
    if (tb < 0.12) {
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(hx + 6, hy - 4, 8, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};
