// animals/horse — ayakta duran at, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'horse', category: 'animals',
  desc: 'Ayakta duran at, yandan görünüm; kuyruk ve yele sallanır, burun titrer',
  tags: ['at', 'binicilik', 'koşan', 'tay', 'horse', 'stallion', 'ride', 'equine'],
  box: [-145, -315, 165, 10],
  bleed: 30,
  anchor: 'ayaklar (0,0); boy ~305 birim',
  points: { back: [0, -178], head: [122, -262] },
  params: {
    color: { type: 'color', default: 'dim' },
    nod: { type: 'time', default: null, desc: 'baş eğme — selam/onay hareketi (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const hoofC = k.rgba('ink', 0.75), maneC = k.rgba('ink', 0.55);
    const br = Math.sin(t * k.TAU / 2.4) * 2;                       // nefes
    const dn = p.nod == null ? -1 : t - p.nod;
    const nodding = dn >= 0 && dn < 0.7;
    const nenv = nodding ? Math.sin(dn / 0.7 * Math.PI) : 0;        // baş eğme zarfı
    const hx = 20 * nenv, hy = 34 * nenv;                           // baş kayması
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
    const tri = (cx, cy, w, h, c) => {
      const s = 1 + LW / w;
      ctx.fillStyle = line; ctx.beginPath();
      ctx.moveTo(cx - w / 2 * s, cy); ctx.lineTo(cx + w / 2 * s, cy); ctx.lineTo(cx, cy - h * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(cx - w / 2, cy); ctx.lineTo(cx + w / 2, cy); ctx.lineTo(cx, cy - h); ctx.closePath(); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(10, -4, 80, 12, 0, 0, k.TAU); ctx.fill();

    // kuyruk: noise1 ile sallanma (canlı idle)
    const tsw = k.noise1(t * 0.9) * 16;
    ctx.strokeStyle = line; ctx.lineWidth = 15 + LW;
    ctx.beginPath(); ctx.moveTo(-84, -168); ctx.quadraticCurveTo(-108, -120 + tsw * 0.4, -96 + tsw, -70); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-84, -168); ctx.quadraticCurveTo(-108, -120 + tsw * 0.4, -96 + tsw, -70); ctx.stroke();

    // arka bacaklar + toynaklar
    limb(-58, -110, -62, -10, 17, body);
    limb(-36, -110, -38, -10, 17, body);
    blob(-74, -16, 26, 16, 7, hoofC);
    blob(-50, -16, 26, 16, 7, hoofC);

    // gövde
    blob(-86, -178 - br * 0.5, 158, 72, 34, body);

    // ön bacaklar + toynaklar
    limb(38, -115, 40, -10, 17, body);
    limb(60, -115, 62, -10, 17, body);
    blob(26, -16, 26, 16, 7, hoofC);
    blob(48, -16, 26, 16, 7, hoofC);

    // boyun (eğik)
    ctx.save(); ctx.translate(58, -165); ctx.rotate(0.55);
    blob(-20, -118, 40, 128, 20, body);
    ctx.restore();

    // yele: boyun üst kenarında sallanan tutamlar
    for (const i of [0, 1, 2, 3, 4]) {
      const s = i / 4;
      const px = 58 + (100 - 58) * s - 16;
      const py = -165 + (-250 + 165) * s + hx * s * 0.4;
      const sway = k.noise1(t * 1.2 + i * 3) * 5;
      ctx.save(); ctx.translate(px + sway, py); ctx.rotate(-0.3);
      tri(0, 0, 20, 26, maneC);
      ctx.restore();
    }

    // baş (nod olayında eğilir)
    disc(122 + hx, -262 + hy, 27, 24, body);
    blob(132 + hx, -272 + hy, 40, 32, 15, body);
    // kulaklar (biri arada seğirir)
    const flick = (t % 5.1) < 0.25 ? 8 : 0;
    tri(100 + hx, -282 + hy, 18, 24, body);
    tri(118 + hx, -286 + hy, 18, 24 - flick, body);
    // göz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(116 + hx, -270 + hy, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    // burun: titreme (noise1, ±2)
    const nx = k.noise1(t * 6) * 2, ny = k.noise1(t * 6 + 9) * 2;
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.ellipse(164 + hx + nx, -258 + hy + ny, 4.5, 3.5, 0, 0, k.TAU); ctx.fill();

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(108, -276, 10, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-40, -150, 26, 12, 0, 0, k.TAU); ctx.fill();
  },
};
