// animals/cat — oturan sevimli kedi, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) oturma tabanı, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'cat', category: 'animals',
  desc: 'Oturan sevimli kedi, yandan görünüm; kuyruğu sallanır, arada göz kırpar',
  tags: ['kedi', 'kedicik', 'evcil hayvan', 'mırnav', 'cat', 'kitten', 'kitty', 'pet'],
  box: [-120, -278, 115, 10],
  bleed: 0,
  anchor: 'oturma tabanı (0,0); boy ~245 birim',
  points: { head: [18, -212], nose: [46, -203], tail: [-72, -70] },
  params: {
    color: { type: 'color', default: 'dim' },
    blink: { type: 'time', default: null, desc: 'göz kırpma + kulak seğirmesi (0.3 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const br = Math.sin(t * k.TAU / 2.4) * 2;                       // nefes
    const db = p.blink == null ? -1 : t - p.blink;
    const forced = db >= 0 && db < 0.3;
    const blinking = forced || (t % 4.3) < 0.12;                    // göz kırpma
    const earTwitch = forced ? Math.sin(db / 0.3 * Math.PI) : 0;    // kulak seğirmesi
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const rope = (x1, y1, cx, cy, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
    };
    const tri = (cx, cy, w, h, c) => {  // tepesi yukarı üçgen, tabanı (cx, cy)
      const pts = [[cx - w / 2, cy], [cx + w / 2, cy], [cx, cy - h]];
      const draw = (s, col) => {
        ctx.fillStyle = col; ctx.beginPath();
        pts.forEach(([x, y], i) => i ? ctx.lineTo((x - cx) * s + cx, (y - cy) * s + cy) : ctx.moveTo((x - cx) * s + cx, (y - cy) * s + cy));
        ctx.closePath(); ctx.fill();
      };
      draw(1 + LW / w, line); draw(1, c);
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(5, -4, 60, 11, 0, 0, k.TAU); ctx.fill();

    // kuyruk: noise1 ile yumuşak sallanma (canlı idle)
    const sway = k.noise1(t * 0.9) * 16;
    rope(-72, -70, -108, -70 + sway * 0.3, -100 + sway, -18, 15, body);

    // kalça + gövde
    disc(-28, -52, 58, 50, body);
    blob(-58, -195 - br * 0.4, 80, 150, 36, body);

    // ön bacaklar + patiler
    rope(2, -120, 3, -70, 4, -12, 17, body);
    rope(24, -120, 25, -70, 26, -12, 17, body);
    blob(-8, -16, 22, 16, 8, body);
    blob(16, -16, 22, 16, 8, body);

    // baş
    const hx = 18, hy = -212 - br * 0.6;
    // kulaklar (olayda sağ kulak seğirir)
    tri(-2, hy - 28, 26, 30, body);
    tri(34, hy - 28, 26, 30 - earTwitch * 12, body);
    disc(hx, hy, 36, 34, body);

    // alın çizgileri (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const ex of [6, 18, 30]) {
      ctx.beginPath(); ctx.moveTo(ex, hy - 24); ctx.lineTo(ex, hy - 14); ctx.stroke();
    }

    // gözler: kırpınca çizgiye döner
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 4;
    for (const [ex, ey] of [[14, hy - 4], [34, hy - 2]]) {
      if (blinking) { ctx.beginPath(); ctx.moveTo(ex - 6, ey); ctx.lineTo(ex + 6, ey); ctx.stroke(); }
      else { ctx.beginPath(); ctx.ellipse(ex, ey, 4.5, 4.5, 0, 0, k.TAU); ctx.fill(); }
    }
    // burun + ağız
    disc(46, hy + 9, 4, 3, inkC);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(40, hy + 16); ctx.lineTo(52, hy + 16); ctx.stroke();

    // bıyıklar (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 2.5;
    for (const [wy, wx] of [[-6, 78], [2, 80], [10, 76]]) {
      ctx.beginPath(); ctx.moveTo(52, hy + 6); ctx.lineTo(wx, hy + 6 + wy); ctx.stroke();
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 14, hy - 14, 12, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-38, -120, 10, 26, 0.1, 0, k.TAU); ctx.fill();
  },
};
